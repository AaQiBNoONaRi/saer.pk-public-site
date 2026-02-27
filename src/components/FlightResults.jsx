import React, { useState, useMemo, useCallback } from 'react';
import { Info, Luggage, Utensils, Layers, AlertCircle, Plane } from 'lucide-react';

const API = 'http://localhost:8000/api/flight-search';

// ── Utility ────────────────────────────────────────────────────────────────────
const AIRLINES = {
    'EK': 'Emirates',
    'QR': 'Qatar Airways',
    'EY': 'Etihad Airways',
    'SV': 'Saudia',
    'FZ': 'flydubai',
    'G9': 'Air Arabia',
    'J9': 'Jazeera Airways',
    'WY': 'Oman Air',
    'GF': 'Gulf Air',
    'KU': 'Kuwait Airways',
    'PK': 'PIA',
    'PA': 'Airblue',
    'ER': 'SereneAir',
    'PF': 'AirSial',
    'TK': 'Turkish Airlines',
    'XY': 'Flynas',
    'MS': 'EgyptAir',
    'RJ': 'Royal Jordanian',
    'ME': 'MEA',
};

function getAirlineName(code) {
    if (!code) return 'Flight';
    const c = code.trim().toUpperCase();
    return AIRLINES[c] || c;
}

function fmtDuration(val) {
    if (!val) return '—';
    if (typeof val === 'string' && val.length === 4 && !val.includes('h')) {
        return `${parseInt(val.substring(0, 2), 10)}h ${parseInt(val.substring(2, 4), 10)}m`;
    }
    if (typeof val === 'number') {
        return `${Math.floor(val / 60)}h ${val % 60}m`;
    }
    return val;
}
function fmtTime(str) {
    if (!str) return '—';
    try {
        if (str.length === 4 && !str.includes(':')) {
            str = `${str.substring(0, 2)}:${str.substring(2, 4)}`;
        }
        const d = new Date(`2000-01-01T${str}`);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return str; }
}
function fmtPrice(n) {
    return Number(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 0 });
}

// ── Fare Rules Display ─────────────────────────────────────────────────
const FareRulesPanel = ({ data }) => {
    const [openCat, setOpenCat] = useState(null);
    const [activeRoute, setActiveRoute] = useState(0);
    if (!data) return null;

    let routes = [];
    try {
        const fareRules = data.fareRules;
        if (Array.isArray(fareRules) && fareRules.length > 0) {
            for (const segment of fareRules) {
                const details = segment.fareRuleDetails;
                if (Array.isArray(details) && details.length > 0) {
                    routes.push({
                        label: `${segment.depAirport || '?'} → ${segment.arrAirport || '?'}`,
                        rules: details,
                    });
                }
            }
        }
        if (!routes.length && data.raw) {
            const airFareRule = data.raw?.response?.content?.fareRuleResponse?.airFareRule;
            if (Array.isArray(airFareRule)) {
                for (const seg of airFareRule) {
                    const details = seg.fareRuleDetails;
                    if (Array.isArray(details) && details.length) {
                        routes.push({
                            label: `${seg.depAirport || '?'} → ${seg.arrAirport || '?'}`,
                            rules: details,
                        });
                    }
                }
            }
        }
    } catch (_) { }

    const currentRoute = routes[activeRoute] || null;
    const currentRules = currentRoute?.rules || [];

    return (
        <div onClick={e => e.stopPropagation()} style={{
            background: 'white', border: '1.5px solid var(--border)',
            borderRadius: 10, marginBottom: 16, overflow: 'hidden',
        }}>
            <div style={{ padding: '12px 18px', borderBottom: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Info size={16} color="var(--primary)" />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Fare Rules</span>
                </div>
                {routes.length > 1 && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        {routes.map((r, i) => (
                            <button key={i} onClick={() => { setActiveRoute(i); setOpenCat(null); }}
                                style={{
                                    padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                    fontSize: 11, fontWeight: 600,
                                    background: i === activeRoute ? 'var(--primary)' : '#f1f5f9',
                                    color: i === activeRoute ? 'white' : 'var(--text-muted)',
                                }}>
                                {r.label}
                            </button>
                        ))}
                    </div>
                )}
                {routes.length === 1 && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{routes[0].label}</span>}
            </div>

            {currentRules.length > 0 ? (
                currentRules.map((rule, i) => {
                    const title = (rule.ruleHead || `Rule ${i + 1}`).toString().toUpperCase();
                    const body = rule.ruleBody || '';
                    const isOpen = openCat === i;
                    return (
                        <div key={i} style={{ borderBottom: i < currentRules.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <button onClick={() => setOpenCat(isOpen ? null : i)}
                                style={{
                                    width: '100%', padding: '12px 18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: isOpen ? '#f8fafc' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                                }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', letterSpacing: 0.5 }}>{title}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: 16, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>∨</span>
                            </button>
                            {isOpen && (
                                <div style={{ padding: '4px 18px 16px', background: '#f8fafc' }}>
                                    <pre style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'inherit' }}>
                                        {body || 'No details available for this rule.'}
                                    </pre>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div style={{ padding: '20px 18px' }}><p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>No fare rules returned by provider.</p></div>
            )}
        </div>
    );
};

// ── Baggage Info ────────────────────────────────────────────────────────
const BaggageTag = ({ baggage }) => {
    if (!baggage || baggage.length === 0) return <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>;
    return (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {baggage.map((b, i) => {
                let display = '';
                if (typeof b === 'string' && b.trim().startsWith('{')) {
                    try {
                        const parsed = JSON.parse(b);
                        display = `${parsed.value || ''} ${parsed.unit || ''}`.trim();
                        if (!display) display = b;
                    } catch (e) { display = b; }
                } else if (typeof b === 'object' && b !== null) {
                    if (b.value && b.unit) display = `${b.value} ${b.unit}`;
                    else display = b.allowance || b.weight || b.pieces || JSON.stringify(b);
                } else {
                    display = String(b);
                }
                return (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        <Luggage size={12} /> {display}
                    </span>
                );
            })}
        </div>
    );
};

// ── Flight Card ─────────────────────────────────────────────────────────────────
function FlightCard({ flight, onSelect, validating }) {
    const [expanded, setExpanded] = useState(false);

    // Panel States
    const [fareRulesData, setFareRulesData] = useState(null);
    const [mealsData, setMealsData] = useState(null);
    const [baggageData, setBaggageData] = useState(null);
    const [brandedFaresData, setBrandedFaresData] = useState(null);
    const [selectedBrandIdx, setSelectedBrandIdx] = useState(0);

    const [loadingRules, setLoadingRules] = useState(false);
    const [loadingMeals, setLoadingMeals] = useState(false);
    const [loadingBaggage, setLoadingBaggage] = useState(false);
    const [loadingBrands, setLoadingBrands] = useState(false);

    const raw = flight.rawData || {};
    const ondPairs = raw.ondPairs || [];

    // The new JSON has 'fare' on the root
    const fare = flight.fare || raw.fare || {};
    const total = fare.total || flight.totalPrice || 0;
    const currency = fare.currency || flight.currency || 'PKR';

    // Extract segment & flights
    const firstSegment = flight.segments?.[0] || {};
    const outboundFlights = firstSegment.flights || [];
    const firstFlight = outboundFlights[0] || {};
    const lastFlight = outboundFlights[outboundFlights.length - 1] || firstFlight;

    // Stops is number of flights in the segment minus 1
    const stops = Math.max(0, outboundFlights.length - 1);
    const duration = firstSegment.ond?.duration || flight.duration || '';
    const airlineCode = firstFlight.operatingAirline || firstFlight.airlineCode || flight.airline || 'FL';
    const airlineName = getAirlineName(airlineCode);

    const flightNo = firstFlight.flightNo || flight.flightNumber || '';
    const dep = firstFlight.departureTime || flight.departureTime || '';
    const arr = lastFlight.arrivalTime || flight.arrivalTime || '';
    const origin = firstFlight.departureLocation || flight.origin || '';
    const dest = lastFlight.arrivalLocation || flight.destination || '';

    // Baggage details
    let baggageStr = flight.baggage || '';
    if (!baggageStr && firstFlight.baggage && firstFlight.baggage.length > 0) {
        baggageStr = `${firstFlight.baggage[0].value} ${firstFlight.baggage[0].unit}`;
    }

    const refundable = flight.refundable;

    const stopsLabel = stops === 0 ? 'Non-stop' : stops === 1 ? '1 Stop' : `${stops} Stops`;
    const stopsColor = stops === 0 ? '#10b981' : stops === 1 ? '#f59e0b' : '#ef4444';

    return (
        <div className="card animate-in" style={{
            marginBottom: 12, overflow: 'hidden',
            transition: 'box-shadow 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
        >
            <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Airline */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 8, background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, border: '1px solid var(--border)', overflow: 'hidden'
                        }}>
                            <img
                                src={`https://images.kiwi.com/airlines/64/${airlineCode}.png`}
                                alt={airlineName}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                            />
                            <span style={{ display: 'none', fontWeight: 900, fontSize: 13, color: 'var(--primary)' }}>{airlineCode}</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)' }}>{airlineName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Flight {flightNo}</div>
                        </div>
                    </div>

                    {/* Itinerary */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>{fmtTime(dep)}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{origin}</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{duration || fmtDuration(flight.durationMinutes)}</div>
                            <div style={{ height: 2, background: 'var(--border)', margin: '4px 0', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                                    width: 24, height: 24, background: '#fff', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                                    border: '1px solid var(--border)',
                                }}>✈</div>
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: stopsColor }}>{stopsLabel}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>{fmtTime(arr)}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{dest}</div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                        {refundable && <span className="badge badge-green">Refundable</span>}
                        {flight.baggage && <span className="badge badge-sky">{flight.baggage}</span>}
                    </div>

                    {/* Price + CTA */}
                    <div style={{ textAlign: 'right', minWidth: 140 }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>per person</div>
                        <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{currency} </span>
                            {fmtPrice(total)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>includes taxes</div>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onSelect(flight)}
                            disabled={!!validating}
                            style={{ fontSize: 12, padding: '9px 18px' }}
                        >
                            {validating ? (
                                <span className="spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} />
                            ) : 'Select →'}
                        </button>
                    </div>
                </div>

                {/* Expand row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                    {flight.fareType && <span className="badge badge-gray">{flight.fareType}</span>}
                    {flight.cabin && <span className="badge badge-blue">{flight.cabin}</span>}
                    <button onClick={() => setExpanded(!expanded)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginLeft: 'auto',
                    }}>{expanded ? '▲ Hide details' : '▼ View details'}</button>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div style={{ background: '#f8fafc', borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>Flight Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {[
                            { label: 'Total Price', value: `${currency} ${fmtPrice(total)}` },
                            { label: 'Base Fare', value: `${currency} ${fmtPrice(fare.baseFare || fare.base)}` },
                            { label: 'Taxes', value: `${currency} ${fmtPrice(fare.tax || fare.taxAmount)}` },
                            { label: 'Cabin', value: firstFlight.cabin || flight.cabin || '—' },
                            { label: 'Stops', value: stopsLabel },
                            { label: 'Duration', value: duration || fmtDuration(flight.durationMinutes) },
                            { label: 'Baggage', value: baggageStr || '—' },
                            { label: 'Refundable', value: refundable ? 'Yes' : refundable === false ? 'No' : '—' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
                            </div>
                        ))}
                    </div>
                    {/* Segments Display */}
                    {firstSegment.flights?.length > 0 && (
                        <div style={{ marginTop: 14, marginBottom: 20 }}>
                            <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Segments</div>
                            {(flight.segments || []).flatMap((seg, sIdx) =>
                                (seg.flights || []).map((f, i) => (
                                    <div key={`${sIdx}-${i}`} style={{
                                        display: 'grid', gridTemplateColumns: '160px 1fr 1fr auto', gap: 16, alignItems: 'center', padding: '12px 16px',
                                        background: '#fff', borderRadius: 8, marginBottom: 6, border: '1px solid var(--border)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <img src={`https://images.kiwi.com/airlines/64/${f.airlineCode}.png`} alt={f.airlineCode} onError={e => e.target.style.display = 'none'} style={{ width: 32, height: 16, objectFit: 'contain' }} />
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: 12 }}>{f.airlineCode} {f.flightNo}</div>
                                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{f.equipmentType || ''}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: 800, fontSize: 14 }}>{fmtTime(f.departureTime)}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.departureLocation}</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: 800, fontSize: 14 }}>{fmtTime(f.arrivalTime)}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{f.arrivalLocation}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cabin: <strong style={{ color: 'var(--text)' }}>{f.cabin || 'Economy'}</strong></span>
                                            {f.baggage && f.baggage.length > 0 && <BaggageTag baggage={f.baggage} />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Agent Portal Action Buttons (Rules, Meals, Baggage, Branded Fares) */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                        <button onClick={async (e) => {
                            e.stopPropagation();
                            if (fareRulesData) return setFareRulesData(null);
                            setLoadingRules(true);
                            try {
                                const res = await fetch(`${API}/fare-rules`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplierCode: flight.supplierCode, supplierSpecific: flight.supplierSpecific, rawData: flight.rawData }) });
                                setFareRulesData(await res.json());
                            } catch (err) { alert('Failed to load fare rules'); }
                            setLoadingRules(false);
                        }} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '6px 12px' }}>
                            {loadingRules ? 'Loading...' : '📋 Fare Rules'}
                        </button>

                        <button onClick={async (e) => {
                            e.stopPropagation();
                            if (mealsData) return setMealsData(null);
                            setLoadingMeals(true);
                            try {
                                const res = await fetch(`${API}/meals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplierCode: flight.supplierCode, supplierSpecific: flight.supplierSpecific, rawData: flight.rawData }) });
                                setMealsData(await res.json());
                            } catch (e) { setMealsData({ meals: [] }); }
                            setLoadingMeals(false);
                        }} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '6px 12px' }}>
                            {loadingMeals ? 'Loading...' : '🍱 Meals'}
                        </button>

                        <button onClick={async (e) => {
                            e.stopPropagation();
                            if (baggageData) return setBaggageData(null);
                            setLoadingBaggage(true);
                            try {
                                const res = await fetch(`${API}/baggage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplierCode: flight.supplierCode, supplierSpecific: flight.supplierSpecific, rawData: flight.rawData }) });
                                setBaggageData(await res.json());
                            } catch (e) { setBaggageData({ baggage: [] }); }
                            setLoadingBaggage(false);
                        }} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '6px 12px' }}>
                            {loadingBaggage ? 'Loading...' : '🧳 Extra Baggage'}
                        </button>

                        <button onClick={async (e) => {
                            e.stopPropagation();
                            if (brandedFaresData) return setBrandedFaresData(null);
                            const inlineBrands = flight?.brands;
                            if (!flight?.brandedFareSeparate && inlineBrands && Object.keys(inlineBrands).length > 0) {
                                setBrandedFaresData({ brands: inlineBrands, source: 'inline' });
                                return;
                            }
                            setLoadingBrands(true);
                            try {
                                const res = await fetch(`${API}/branded-fares`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ supplierCode: flight.supplierCode, supplierSpecific: flight.supplierSpecific, rawData: flight.rawData }) });
                                setBrandedFaresData(await res.json());
                            } catch (e) { setBrandedFaresData({ error: 'Failed to fetch branded fares' }); }
                            setLoadingBrands(false);
                        }} className="btn btn-outline btn-sm" style={{ fontSize: 11, padding: '6px 12px' }}>
                            {loadingBrands ? 'Loading...' : '🏷️ Branded Fares'}
                        </button>
                    </div>

                    {/* Panels */}
                    {fareRulesData && <FareRulesPanel data={fareRulesData} />}

                    {mealsData && (
                        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Utensils size={14} /> Available Meals</div>
                            {mealsData?.meals?.length > 0 ? (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {mealsData.meals.map((m, i) => <span key={i} style={{ padding: '4px 8px', background: 'white', border: '1px solid #fdba74', borderRadius: 6, fontSize: 11, color: '#9a3412', fontWeight: 600 }}>{m.name || m.code || JSON.stringify(m)}</span>)}
                                </div>
                            ) : <div style={{ fontSize: 12, color: '#a16207' }}>No meal options available from this provider.</div>}
                        </div>
                    )}

                    {baggageData && (
                        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#075985', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Luggage size={14} /> Extra Baggage Options</div>
                            {baggageData?.baggage?.length > 0 ? (
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {baggageData.baggage.map((b, i) => <span key={i} style={{ padding: '4px 8px', background: 'white', border: '1px solid #7dd3fc', borderRadius: 6, fontSize: 11, color: '#0369a1', fontWeight: 600 }}>{b.weight || b.name} - {b.price || b.amount} {b.currency}</span>)}
                                </div>
                            ) : <div style={{ fontSize: 12, color: '#0369a1' }}>No extra baggage options available.</div>}
                        </div>
                    )}

                    {brandedFaresData && (
                        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, padding: 14, marginBottom: 16, overflowX: 'auto' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Layers size={14} /> Branded Fares Options</div>
                            {brandedFaresData.error ? (
                                <div style={{ color: '#991b1b', fontSize: 12 }}>{brandedFaresData.error}</div>
                            ) : (() => {
                                const rawList = brandedFaresData.brands;
                                const brandsList = Array.isArray(rawList) ? rawList : (rawList && typeof rawList === 'object' ? Object.values(rawList).flat() : []);
                                if (!brandsList.length) return <div style={{ fontSize: 12, color: '#6b21a8' }}>No branded fares available.</div>;

                                const allKeys = Array.from(new Set(brandsList.flatMap(b => Object.keys(b.inclusions || {}))));
                                return (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 500 }}>
                                        <thead>
                                            <tr>
                                                <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '2px solid #e9d5ff', color: 'var(--text-muted)' }}>Feature</th>
                                                {brandsList.map((b, i) => (
                                                    <th key={i} onClick={() => setSelectedBrandIdx(i)} style={{ padding: '8px 12px', textAlign: 'center', borderBottom: selectedBrandIdx === i ? '3px solid #7c3aed' : '2px solid #e9d5ff', color: selectedBrandIdx === i ? '#7c3aed' : 'var(--text-muted)', cursor: 'pointer', background: selectedBrandIdx === i ? '#f3e8ff' : 'transparent', borderRadius: selectedBrandIdx === i ? '6px 6px 0 0' : 0 }}>
                                                        <div>{b.brandName || `Option ${i + 1}`}</div>
                                                        <div style={{ fontSize: 11, fontWeight: 500 }}>{b.price ? `${b.currency || ''} ${b.price}` : 'Included'}</div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allKeys.map(k => (
                                                <tr key={k}>
                                                    <td style={{ padding: '8px 12px', borderBottom: '1px solid #f3e8ff', color: '#6b21a8', fontWeight: 600 }}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                                                    {brandsList.map((b, i) => {
                                                        const val = b.inclusions?.[k];
                                                        return <td key={i} style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid #f3e8ff', background: selectedBrandIdx === i ? '#f3e8ff' : 'transparent', color: val?.toLowerCase().includes('included') ? '#16a34a' : (val?.toLowerCase().includes('not') || !val ? '#94a3b8' : '#f59e0b') }}>{val || 'Not Included'}</td>
                                                    })}
                                                </tr>
                                            ))}
                                            <tr>
                                                <td style={{ padding: '12px', borderTop: '2px solid #e9d5ff' }}></td>
                                                {brandsList.map((b, i) => (
                                                    <td key={i} style={{ padding: '12px', textAlign: 'center', borderTop: '2px solid #e9d5ff', background: selectedBrandIdx === i ? '#f3e8ff' : 'transparent', borderRadius: selectedBrandIdx === i ? '0 0 6px 6px' : 0 }}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const chosenBrand = brandsList[i];
                                                                const flightWithBrand = { ...flight, chosenBrand, supplierSpecific: chosenBrand.supplierSpecific ?? flight.supplierSpecific };
                                                                onSelect(flightWithBrand);
                                                            }}
                                                            className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: 11, padding: '8px 12px' }}>
                                                            {(() => {
                                                                const rawTotal = b.total || b.price || (b.fareBreakup && b.fareBreakup[0] && b.fareBreakup[0].total) || (b.baseFare && b.tax ? (Number(b.baseFare) + Number(b.tax)) : null);
                                                                const totalNum = rawTotal ? Number(rawTotal) : null;
                                                                const priceText = totalNum ? `${b.currency || ''} ${fmtPrice(totalNum)}` : '';
                                                                return (
                                                                    <span>{`Select ${b.brandName}`}{priceText ? ` · ${priceText}` : ''}</span>
                                                                );
                                                            })()}
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Filters ─────────────────────────────────────────────────────────────────────
function FilterPanel({ flights, filters, onChange }) {
    const airlines = useMemo(() => {
        return [...new Set(flights.map(f => {
            const firstFlight = f.segments?.[0]?.flights?.[0] || {};
            return firstFlight.operatingAirline || firstFlight.airlineCode || f.airline || f.airlineCode;
        }).filter(Boolean))];
    }, [flights]);

    const maxP = useMemo(() => Math.max(...flights.map(f => f.totalPrice || f.fare?.total || f.rawData?.fare?.total || 0), 0), [flights]);

    return (
        <div className="card" style={{ padding: 20, position: 'sticky', top: 80 }}>
            
            {/* Price Range */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Max Price</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>PKR {filters.maxPrice?.toLocaleString()}</span>
                </div>
                <input type="range" min={0} max={Math.max(maxP, 100000)} value={filters.maxPrice ?? maxP}
                    onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                    style={{ width: '100%' }} />
            </div>

            {/* Stops */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Stops</div>
                {['Any', 'Non-stop', '1 Stop', '2+ Stops'].map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                        <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input type="radio" name="stops" value={s} style={{ margin: 0 }} checked={filters.stops === s} onChange={(e) => onChange({ ...filters, stops: e.target.value })} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: 13 }}>{s}</span>
                        </div>
                    </label>
                ))}
            </div>

            {/* Airlines */}
            {airlines.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Airlines</div>
                    {airlines.map(a => (
                        <label key={a} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                            <input type="checkbox"
                                style={{ margin: 0 }}
                                checked={!filters.airlines?.length || filters.airlines.includes(a)}
                                onChange={e => {
                                    const cur = filters.airlines?.length ? filters.airlines : airlines;
                                    const next = e.target.checked ? [...cur, a] : cur.filter(x => x !== a);
                                    onChange({ ...filters, airlines: next.length === airlines.length ? [] : next });
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <img src={`https://images.kiwi.com/airlines/64/${a}.png`} alt={a} style={{ height: 16, width: 16, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{getAirlineName(a)}</span>
                            </div>
                        </label>
                    ))}
                </div>
            )}

            {/* Refundable */}
            <div style={{ marginBottom: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" style={{ margin: 0 }} checked={!!filters.refundableOnly} onChange={e => onChange({ ...filters, refundableOnly: e.target.checked })} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Refundable Only</span>
                </label>
            </div>

            <button onClick={() => onChange({ stops: 'Any', airlines: [], refundableOnly: false, maxPrice: null })}
                style={{
                    marginTop: 16, width: '100%', padding: '8px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                }}>Reset Filters</button>
        </div>
    );
}

// ── Main Results Page ──────────────────────────────────────────────────────────
export default function FlightResults({ results, searchParams, onSelect, onNewSearch }) {
    const [sort, setSort] = useState('cheapest');
    const [filters, setFilters] = useState({ stops: 'Any', airlines: [], refundableOnly: false, maxPrice: null });
    const [showFilters, setShowFilters] = useState(false); // mobile

    const maxP = useMemo(() => Math.max(...results.map(f => f.totalPrice || f.fare?.total || f.rawData?.fare?.total || 0), 200000), [results]);
    if (filters.maxPrice === null && maxP) {
        // set default
    }

    const filtered = useMemo(() => {
        return results.filter(f => {
            const price = f.totalPrice || f.fare?.total || f.rawData?.fare?.total || 0;
            const mp = filters.maxPrice ?? maxP;
            if (filters.maxPrice !== null && price > mp) return false;

            const firstFlight = f.segments?.[0]?.flights?.[0] || {};
            const outboundFlights = f.segments?.[0]?.flights || [];

            const stops = f.stops ?? Math.max(0, outboundFlights.length - 1);
            if (filters.stops === 'Non-stop' && stops !== 0) return false;
            if (filters.stops === '1 Stop' && stops !== 1) return false;
            if (filters.stops === '2+ Stops' && stops < 2) return false;

            const al = firstFlight.operatingAirline || firstFlight.airlineCode || f.airline || f.airlineCode;
            if (filters.airlines?.length && !filters.airlines.includes(al)) return false;
            if (filters.refundableOnly && !f.refundable) return false;
            return true;
        });
    }, [results, filters, maxP]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const pa = a.totalPrice || a.fare?.total || a.rawData?.fare?.total || 0;
            const pb = b.totalPrice || b.fare?.total || b.rawData?.fare?.total || 0;
            if (sort === 'cheapest') return pa - pb;

            const durStringA = a.segments?.[0]?.ond?.duration || a.duration || '';
            const durStringB = b.segments?.[0]?.ond?.duration || b.duration || '';
            let dA = a.durationMinutes || 9999;
            let dB = b.durationMinutes || 9999;
            if (durStringA.length === 4) dA = parseInt(durStringA.substring(0, 2)) * 60 + parseInt(durStringA.substring(2, 4));
            if (durStringB.length === 4) dB = parseInt(durStringB.substring(0, 2)) * 60 + parseInt(durStringB.substring(2, 4));

            if (sort === 'fastest') return dA - dB;

            const depA = a.segments?.[0]?.flights?.[0]?.departureTime || a.departureTime || '';
            const depB = b.segments?.[0]?.flights?.[0]?.departureTime || b.departureTime || '';
            if (sort === 'earliest') return depA < depB ? -1 : 1;
            return pa - pb;
        });
    }, [filtered, sort]);

    const handleSelect = useCallback((flight) => {
        const tripType = searchParams?.tripType || 'oneway';
        const ttMap = { oneway: 'O', return: 'R', roundtrip: 'R', multicity: 'M' };

        // Resolve the promise to JSON directly so BookingForm can safely .then() on it
        const validationPromise = fetch(`${API}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                supplierCode: flight.supplierCode,
                supplierSpecific: flight.supplierSpecific,
                rawData: flight.rawData,
                adt: searchParams?.adults ?? searchParams?.travelers?.adults ?? 1,
                chd: searchParams?.children ?? searchParams?.travelers?.children ?? 0,
                inf: searchParams?.infants ?? searchParams?.travelers?.infants ?? 0,
                tripType: ttMap[tripType] || 'O',
                searchKey: flight.rawData?.searchKey || null,
            }),
        }).then(r => {
            if (!r.ok) throw new Error(`Validation failed: ${r.status}`);
            return r.json();
        });

        onSelect(flight, validationPromise);
    }, [searchParams, onSelect]);

    const from = searchParams?.origin || (searchParams?.multiCitySegments?.[0]?.origin);
    const to = searchParams?.destination || (searchParams?.multiCitySegments?.slice(-1)[0]?.destination);

    return (
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <button onClick={onNewSearch} className="btn btn-outline btn-sm">← New Search</button>
                <div>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>
                        {from && to ? `${from} → ${to}` : 'Flight Results'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {sorted.length} of {results.length} flights shown
                        {searchParams?.departurDate ? ` · ${searchParams.departureDate}` : ''}
                    </div>
                </div>
                
            </div>

            {/* Sort Bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Sort:</span>
                {[
                    { id: 'cheapest', label: 'Cheapest' },
                    { id: 'fastest', label: 'Fastest' },
                    { id: 'earliest', label: 'Earliest' },
                ].map(({ id, label }) => (
                    <button key={id} onClick={() => setSort(id)} style={{
                        padding: '7px 18px', borderRadius: 99, border: '1.5px solid',
                        borderColor: sort === id ? 'var(--primary)' : 'var(--border)',
                        background: sort === id ? 'var(--primary)' : '#fff',
                        color: sort === id ? '#fff' : 'var(--text)',
                        cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'var(--transition)',
                    }}>{label}</button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Filters Sidebar */}
                <div style={{ width: 240, flexShrink: 0 }} className="hide-mobile">
                    <FilterPanel flights={results} filters={filters} onChange={setFilters} />
                </div>

                {/* Results */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {sorted.length === 0 ? (
                        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>✈</div>
                            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>No flights match</div>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Try adjusting your filters</div>
                            <button onClick={() => setFilters({ stops: 'Any', airlines: [], refundableOnly: false, maxPrice: null })} className="btn btn-secondary">Clear Filters</button>
                        </div>
                    ) : (
                        sorted.map((flight, i) => {
                            const uniqueKey = `${i}-${flight.id ?? ''}-${flight.supplierCode ?? ''}-${flight.segments?.[0]?.flights?.[0]?.flightNo ?? ''}`;
                            return (
                                <FlightCard
                                    key={uniqueKey}
                                    flight={flight}
                                    onSelect={() => handleSelect(flight)}
                                    validating={false}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
