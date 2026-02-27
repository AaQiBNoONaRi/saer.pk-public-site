import React, { useState } from 'react';

const API = 'http://localhost:8000/api/flight-search';

function fmt(n) { return Number(n || 0).toLocaleString(); }

function InfoRow({ label, value, highlight }) {
    return (
        <div style={{ padding: '10px 14px', background: highlight ? '#eff6ff' : '#f8fafc', borderRadius: 8, border: `1px solid ${highlight ? '#bfdbfe' : 'var(--border)'}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: highlight ? 'var(--primary)' : 'var(--text)', fontFamily: highlight ? 'monospace' : 'inherit', letterSpacing: highlight ? 1 : 0 }}>{value || '—'}</div>
        </div>
    );
}

export default function BookingTracker({ onBack }) {
    const [bookingRefId, setBookingRefId] = useState('');
    const [supplierCode, setSupplierCode] = useState('2');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        const refId = bookingRefId.trim();
        if (!refId) { setError('Please enter a Booking ID.'); return; }
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const res = await fetch(`${API}/booking-detail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingRefId: refId, supplierCode: parseInt(supplierCode) || 2 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Could not retrieve booking.');
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to retrieve booking details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Parse the AIQS response
    const content = result?.response?.content || result || {};
    const bookRS = content?.tripDetailRS || content?.bookFlightResult || {};
    // AIQS Retrieval structure usually puts info in tripDetailsUiData.response
    const pnrDetails = bookRS?.tripDetailsUiData?.response || bookRS?.pnrDetails || bookRS || {};
    const pnr = bookRS?.pnr || pnrDetails?.pnr || result?.pnr || '—';
    const status = pnrDetails?.bookingStatus || pnrDetails?.status || bookRS?.status || '—';
    const passengers = pnrDetails?.travelerInfo || pnrDetails?.passengers || [];
    const segments = pnrDetails?.ondPairs || pnrDetails?.segmentGroup || [];
    const fare = pnrDetails?.fare || {};

    // Airline reservations
    const airlineReservations = bookRS?.airlineReservation || [];

    return (
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <button onClick={onBack} className="btn btn-outline btn-sm" style={{ marginBottom: 16 }}>← Back to Home</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #e94f37, #ff6b4a)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(233,79,55,0.3)', flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Track Your Booking</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>Enter your Booking ID to retrieve full flight details</p>
                    </div>
                </div>
            </div>

            {/* Search Form */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <form onSubmit={handleSearch}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                                Booking ID <span style={{ color: 'var(--error)' }}>*</span>
                            </label>
                            <input
                                value={bookingRefId}
                                onChange={e => setBookingRefId(e.target.value.toUpperCase())}
                                placeholder="e.g. CLI_11078-5449"
                                style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', width: '100%', boxSizing: 'border-box' }}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                                Supplier
                            </label>
                            <select value={supplierCode} onChange={e => setSupplierCode(e.target.value)} style={{ padding: '12px 14px', height: '100%' }}>
                                <option value="2">AIQS (Default)</option>
                                <option value="11">Jazeera / Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Info tip */}
                    <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, marginBottom: 16, fontSize: 12, color: '#92400e' }}>
                        💡 <strong>Where to find your Booking ID?</strong> Check your booking confirmation email or receipt. It looks like <strong style={{ fontFamily: 'monospace' }}>CLI_XXXXX-YYYY</strong>. Your PNR (e.g. <strong style={{ fontFamily: 'monospace' }}>FR6VNS</strong>) is different — enter the full Booking ID for complete details.
                    </div>

                    {error && (
                        <div style={{ padding: '10px 14px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#dc2626', fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                            ⚠ {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', fontSize: 15, fontWeight: 800 }}>
                        {loading ? '🔍 Searching...' : '🔍 Retrieve Booking'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {result && (
                <div className="slide-up">
                    {/* Status Banner */}
                    <div style={{
                        background: status === 'HK' ? 'linear-gradient(135deg, #10b981, #059669)'
                            : status === 'UN' || status === 'HX' ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        borderRadius: 14, padding: '20px 24px', marginBottom: 20,
                        display: 'flex', alignItems: 'center', gap: 14, color: '#fff',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    }}>
                        <div style={{ fontSize: 36 }}>
                            {status === 'HK' ? '✅' : status === 'UN' || status === 'HX' ? '❌' : '⏳'}
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 2 }}>
                                Booking {status === 'HK' ? 'Confirmed' : status === 'HX' ? 'Cancelled' : status || 'Found'}
                            </div>
                            <div style={{ fontSize: 13, opacity: 0.85 }}>
                                Status Code: <strong>{status}</strong>
                                {status === 'HK' && ' — Seats Confirmed'}
                                {status === 'HX' && ' — Booking Cancelled'}
                                {status === 'UN' && ' — Unable to Confirm'}
                            </div>
                        </div>
                    </div>

                    {/* Booking Reference */}
                    <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                        <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>📋 Booking Reference</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                            <InfoRow label="Booking ID" value={bookingRefId} highlight />
                            <InfoRow label="PNR" value={pnr} highlight />
                            <InfoRow label="Status" value={status} />
                            {airlineReservations.map((r, i) => (
                                <InfoRow key={i} label={`Airline Locator (${r.airlineCode || i + 1})`} value={r.airlineLocator} />
                            ))}
                        </div>
                    </div>

                    {/* Flight Segments */}
                    {segments.length > 0 && (
                        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>✈ Flight Itinerary</h3>
                            {segments.map((seg, i) => {
                                // Sometimes the flights are nested in flightDetails, sometimes in segments, sometimes directly on the seg object
                                const flights = seg.segments || seg.flightDetails || (seg.segInfo ? [{ flifo: { depAirport: seg.segInfo?.flifo?.depAirport, arrAirport: seg.segInfo?.flifo?.arrAirport, mktgAirline: seg.segInfo?.flifo?.mktgAirline, flightNo: seg.segInfo?.flifo?.flightNo }, dateTime: seg.dateTime }] : []);
                                if (!flights.length && seg.depAirport) flights.push(seg); // Direct properties

                                return (
                                    <div key={i} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 8 }}>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>Segment {i + 1}</div>
                                        {flights.map((fd, j) => {
                                            const f = fd.flifo || fd.segInfo?.flifo || fd || {};
                                            const dt = fd.dateTime || fd.segInfo?.dateTime || fd || {};
                                            return (
                                                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
                                                    <div style={{ fontWeight: 900, fontSize: 16 }}>
                                                        {f.depAirport || '—'} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>→</span> {f.arrAirport || '—'}
                                                    </div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{dt.depDate} {dt.depTime}</div>
                                                    <div style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                                                        {f.mktgAirline || f.airlineCode || ''}{f.flightNo || ''}
                                                    </div>
                                                    {f.cabin && <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{f.cabin === 'Y' ? 'Economy' : f.cabin === 'C' ? 'Business' : f.cabin}</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Passengers */}
                    {passengers.length > 0 && (
                        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>👤 Passengers</h3>
                            {passengers.map((p, i) => {
                                const name = `${p.salutation || p.nameTitle || ''} ${p.givenName || p.firstName || ''} ${p.surName || p.lastName || ''}`.trim();
                                const paxType = p.paxType || p.passengerType || 'ADT';
                                return (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 8 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{i + 1}</div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: 14 }}>{name || '—'}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                                {paxType === 'ADT' ? 'Adult' : paxType === 'CHD' ? 'Child' : 'Infant'}
                                                {(p.docID || p.passportNo) && ` · Passport: ${p.docID || p.passportNo}`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Fare */}
                    {(fare.total || fare.baseFare) && (
                        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 14 }}>💰 Fare Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <InfoRow label="Base Fare" value={`${fare.currency || 'PKR'} ${fmt(fare.baseFare || fare.base)}`} />
                                <InfoRow label="Taxes & Fees" value={`${fare.currency || 'PKR'} ${fmt(fare.tax || fare.taxAmount)}`} />
                                <InfoRow label="Total" value={`${fare.currency || 'PKR'} ${fmt(fare.total)}`} highlight />
                            </div>
                        </div>
                    )}

                    {/* Raw data fallback */}
                    {!passengers.length && !segments.length && (
                        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                            <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>📄 Raw Booking Data</h3>
                            <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f8fafc', padding: 14, borderRadius: 8, maxHeight: 400, overflow: 'auto', color: 'var(--text-muted)' }}>
                                {JSON.stringify(content, null, 2)}
                            </pre>
                        </div>
                    )}

                    <button onClick={() => { setResult(null); setBookingRefId(''); }} className="btn btn-outline" style={{ width: '100%', padding: '13px' }}>
                        🔍 Track Another Booking
                    </button>
                </div>
            )}
        </div>
    );
}
