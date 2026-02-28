import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8000/api/flight-search';
const COUNTRIES = [
    { code: 'PK', name: 'Pakistan' }, { code: 'AE', name: 'UAE' }, { code: 'SA', name: 'Saudi Arabia' },
    { code: 'US', name: 'United States' }, { code: 'GB', name: 'United Kingdom' }, { code: 'IN', name: 'India' },
    { code: 'BD', name: 'Bangladesh' }, { code: 'TR', name: 'Turkey' }, { code: 'MY', name: 'Malaysia' },
    { code: 'SG', name: 'Singapore' }, { code: 'QA', name: 'Qatar' }, { code: 'KW', name: 'Kuwait' },
    { code: 'OM', name: 'Oman' }, { code: 'BH', name: 'Bahrain' }, { code: 'EG', name: 'Egypt' },
];

function Field({ label, required, children, error }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 }}>
                {label}{required && <span style={{ color: 'var(--error)', marginLeft: 2 }}>*</span>}
            </label>
            {children}
            {error && <div style={{ fontSize: 11, color: 'var(--error)', marginTop: 3, fontWeight: 500 }}>⚠ {error}</div>}
        </div>
    );
}

function PassengerForm({ index, paxType, data, onChange, errors }) {
    const labels = { ADT: `Adult ${index + 1}`, CHD: `Child ${index + 1}`, INF: `Infant ${index + 1}` };
    const colors = { ADT: '#147EFB', CHD: '#3b82f6', INF: '#8b5cf6' };

    return (
        <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
            <div style={{
                padding: '12px 20px', background: `linear-gradient(135deg, ${colors[paxType]}, ${colors[paxType]}aa)`,
                color: '#fff', display: 'flex', alignItems: 'center', gap: 10,
            }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
                    {index + 1}
                </span>
                <span style={{ fontWeight: 800, fontSize: 14 }}>{labels[paxType]}</span>
                <span style={{ fontSize: 12, opacity: 0.8 }}>— Required Information</span>
            </div>
            <div style={{ padding: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>

                    <Field label="Title" required error={errors?.salutation}>
                        <select value={data.salutation || ''} onChange={e => onChange('salutation', e.target.value)} style={{ padding: '10px 12px' }}>
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Dr">Dr</option>
                            {paxType === 'INF' || paxType === 'CHD' ? <option value="Mstr">Mstr</option> : null}
                        </select>
                    </Field>

                    <Field label="First Name" required error={errors?.givenName}>
                        <input value={data.givenName || ''} onChange={e => onChange('givenName', e.target.value.toUpperCase())}
                            placeholder="JOHN" style={{ padding: '10px 12px', textTransform: 'uppercase' }} />
                    </Field>

                    <Field label="Last Name" required error={errors?.surName}>
                        <input value={data.surName || ''} onChange={e => onChange('surName', e.target.value.toUpperCase())}
                            placeholder="DOE" style={{ padding: '10px 12px', textTransform: 'uppercase' }} />
                    </Field>

                    <Field label="Gender" required error={errors?.gender}>
                        <select value={data.gender || ''} onChange={e => onChange('gender', e.target.value)} style={{ padding: '10px 12px' }}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </Field>

                    <Field label="Date of Birth" required error={errors?.birthDate}>
                        <input type="date" value={data.birthDate || ''} onChange={e => onChange('birthDate', e.target.value)}
                            style={{ padding: '10px 12px' }}
                            max={paxType === 'INF' ? new Date().toISOString().split('T')[0] : undefined}
                        />
                    </Field>

                    <Field label="Nationality" required error={errors?.nationality}>
                        <select value={data.nationality || 'PK'} onChange={e => onChange('nationality', e.target.value)} style={{ padding: '10px 12px' }}>
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </Field>

                    <Field label="Passport Number" required error={errors?.docID}>
                        <input value={data.docID || ''} onChange={e => onChange('docID', e.target.value.toUpperCase())}
                            placeholder="AB1234567" style={{ padding: '10px 12px', textTransform: 'uppercase', fontFamily: 'monospace' }} />
                    </Field>

                    <Field label="Issuing Country" required error={errors?.docIssueCountry}>
                        <select value={data.docIssueCountry || 'PK'} onChange={e => onChange('docIssueCountry', e.target.value)} style={{ padding: '10px 12px' }}>
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                    </Field>

                    <Field label="Passport Expiry" required error={errors?.expiryDate}>
                        <input type="date" value={data.expiryDate || ''} onChange={e => onChange('expiryDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]} style={{ padding: '10px 12px' }} />
                    </Field>

                    {index === 0 && (
                        <>
                            <Field label="Email" required error={errors?.email}>
                                <input type="email" value={data.email || ''} onChange={e => onChange('email', e.target.value)}
                                    placeholder="john@example.com" style={{ padding: '10px 12px' }} />
                            </Field>
                            <Field label="Phone" required error={errors?.phone}>
                                <input type="tel" value={data.phone || ''} onChange={e => onChange('phone', e.target.value)}
                                    placeholder="03001234567" style={{ padding: '10px 12px' }} />
                            </Field>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function FareSummary({ flight, searchParams, validated }) {
    const raw = flight?.rawData || {};
    const fare = validated?.validatedFare || raw.fare || {};
    const total = fare.total || flight?.totalPrice || 0;
    const base = fare.base || 0;
    const tax = fare.taxAmount || (total - base);
    const currency = flight?.currency || fare.currency || 'PKR';
    const fmt = n => Number(n || 0).toLocaleString();
    const travelers = searchParams?.travelers || {};
    const adt = travelers.adults ?? searchParams?.adults ?? 1;
    const chd = travelers.children ?? searchParams?.children ?? 0;
    const inf = travelers.infants ?? searchParams?.infants ?? 0;

    const ondPairs = raw.ondPairs || [];
    const firstFd = ondPairs[0]?.flightDetails?.[0]?.flifo || {};
    const loc = firstFd.location || {};
    const dt = firstFd.dateTime || {};

    return (
        <div className="card" style={{ padding: 20, position: 'sticky', top: 80 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>✈ Flight Summary</div>

            <div style={{
                background: 'linear-gradient(135deg, #f0f4ff, #f8faff)', borderRadius: 10,
                padding: 14, marginBottom: 16, border: '1px solid #dbeafe',
            }}>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                    {flight?.origin || loc.depAirport} → {flight?.destination || loc.arrAirport}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {flight?.airline} · {flight?.cabin || 'Economy'} · {flight?.stops === 0 ? 'Non-stop' : `${flight?.stops} stop(s)`}
                </div>
                {dt.depDate && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: 'var(--primary)' }}>{dt.depDate}</div>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {adt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{adt}x Adult</span><span style={{ fontWeight: 600 }}>{currency} {fmt(base * adt)}</span></div>}
                {chd > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{chd}x Child</span><span style={{ fontWeight: 600 }}>—</span></div>}
                {inf > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{inf}x Infant</span><span style={{ fontWeight: 600 }}>—</span></div>}
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>Base fare</span><span>{currency} {fmt(base)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}><span>Taxes & Fees</span><span>{currency} {fmt(tax)}</span></div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Total</span>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>
                        <span style={{ fontSize: 13 }}>{currency} </span>{fmt(total)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>All taxes included</div>
                </div>
            </div>

            {validated?.sealed && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: '#d1fae5', borderRadius: 8, border: '1px solid #6ee7b7', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 14 }}>✅</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#065f46' }}>Price validated & locked</span>
                </div>
            )}
        </div>
    );
}

export default function BookingForm({ flight, validatedData, searchParams, onComplete, onBack }) {
    const travelers = searchParams?.travelers || {};
    const adt = travelers.adults ?? searchParams?.adults ?? 1;
    const chd = travelers.children ?? searchParams?.children ?? 0;
    const inf = travelers.infants ?? searchParams?.infants ?? 0;

    const buildPax = (type) => Array.from({ length: type }, () => ({
        salutation: '', givenName: '', surName: '', gender: '', birthDate: '',
        nationality: 'PK', docID: '', docIssueCountry: 'PK', expiryDate: '',
        email: '', phone: '', countryCode: 'PK', phoneCode: '92',
    }));

    const [adults, setAdults] = useState(buildPax(adt));
    const [children, setChildren] = useState(buildPax(chd));
    const [infants, setInfants] = useState(buildPax(inf));
    const [errors, setErrors] = useState({});
    const [booking, setBooking] = useState(false);
    const [bookError, setBookError] = useState('');

    const [validated, setValidated] = useState(null);
    const [validating, setValidating] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (!validatedData) return;
        if (typeof validatedData.then === 'function') {
            // It's a promise — resolves directly to the parsed JSON object
            setValidating(true);
            setValidationError('');
            validatedData
                .then(data => {
                    setValidated(data);
                    setValidating(false);
                })
                .catch(err => {
                    console.error('Validation error:', err);
                    setValidationError('Could not validate live pricing. Please return to search results.');
                    setValidating(false);
                });
        } else {
            // Already resolved data object
            setValidated(validatedData);
        }
    }, [validatedData]);

    const updatePax = (list, setter, idx, field, val) => {
        const next = [...list];
        next[idx] = { ...next[idx], [field]: val };
        setter(next);
    };

    const validate = () => {
        const errs = {};
        const required = ['salutation', 'givenName', 'surName', 'gender', 'birthDate', 'nationality', 'docID', 'expiryDate'];
        const allPax = [
            ...adults.map((p, i) => ({ p, type: 'ADT', i })),
            ...children.map((p, i) => ({ p, type: 'CHD', i })),
            ...infants.map((p, i) => ({ p, type: 'INF', i })),
        ];
        allPax.forEach(({ p, type, i }) => {
            const key = `${type}-${i}`;
            const pErrs = {};
            required.forEach(f => { if (!p[f]) pErrs[f] = 'Required'; });
            if (type === 'ADT' && i === 0) {
                if (!p.email) pErrs.email = 'Required';
                if (!p.phone) pErrs.phone = 'Required';
            }
            if (Object.keys(pErrs).length) errs[key] = pErrs;
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleBook = async () => {
        if (!validate()) return;
        setBookError('');
        setBooking(true);
        try {
            const tripType = searchParams?.tripType || 'oneway';
            const ttMap = { oneway: 'O', return: 'R', roundtrip: 'R', multicity: 'M' };
            const tt = ttMap[tripType] || 'O';

            const passengers = [
                ...adults.map(p => ({ ...p, paxType: 'ADT' })),
                ...children.map(p => ({ ...p, paxType: 'CHD' })),
                ...infants.map(p => ({ ...p, paxType: 'INF' })),
            ];

            const res = await fetch(`${API}/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rawData: flight.rawData,
                    supplierCode: flight.supplierCode,
                    supplierSpecific: flight.supplierSpecific,
                    validatedSupplierSpecific: validated?.supplierSpecific ?? null,
                    sealed: validated?.sealed ?? null,
                    passengers,
                    adt, chd, inf, tripType: tt,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Booking failed');
            onComplete({ ...data, passengers, flight, searchParams, validatedData: validated });
        } catch (err) {
            setBookError(err.message || 'Booking failed. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button onClick={onBack} className="btn btn-outline btn-sm">← Back to Results</button>
                <div>
                    <h2 style={{ fontWeight: 900, fontSize: 22, margin: 0 }}>Passenger Details</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Fill in all traveler information to complete booking</p>
                </div>
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: '#f8fafc', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {[{ n: '1', label: 'Select Flight', done: true }, { n: '2', label: 'Passenger Details', active: true }, { n: '3', label: 'Confirm & Book', done: false }].map(({ n, label, done, active }, i) => (
                    <div key={n} style={{
                        flex: 1, padding: '12px 16px', textAlign: 'center', fontWeight: 700, fontSize: 13,
                        background: active ? 'var(--primary)' : done ? '#dbeafe' : 'transparent',
                        color: active ? '#fff' : done ? 'var(--primary)' : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                        <span style={{
                            width: 22, height: 22, borderRadius: '50%',
                            background: active ? '#fff' : done ? 'var(--primary)' : 'var(--border)',
                            color: active ? 'var(--primary)' : done ? '#fff' : 'var(--text-muted)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0,
                        }}>{done && !active ? '✓' : n}</span>
                        {label}
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Main Form */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {adults.map((pax, i) => (
                        <PassengerForm key={`adt-${i}`} index={i} paxType="ADT" data={pax}
                            onChange={(f, v) => updatePax(adults, setAdults, i, f, v)}
                            errors={errors[`ADT-${i}`]} />
                    ))}
                    {children.map((pax, i) => (
                        <PassengerForm key={`chd-${i}`} index={i} paxType="CHD" data={pax}
                            onChange={(f, v) => updatePax(children, setChildren, i, f, v)}
                            errors={errors[`CHD-${i}`]} />
                    ))}
                    {infants.map((pax, i) => (
                        <PassengerForm key={`inf-${i}`} index={i} paxType="INF" data={pax}
                            onChange={(f, v) => updatePax(infants, setInfants, i, f, v)}
                            errors={errors[`INF-${i}`]} />
                    ))}

                    {/* Important notice */}
                    <div style={{ padding: '14px 18px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 4 }}>⚠ Important</div>
                        <ul style={{ fontSize: 12, color: '#78350f', paddingLeft: 18, margin: 0 }}>
                            <li>Passenger names must match passport exactly</li>
                            <li>Ensure passport is valid for at least 6 months from travel date</li>
                            <li>Once booked, name changes may not be possible</li>
                        </ul>
                    </div>

                    {bookError && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
                            padding: '12px 16px', color: '#dc2626', fontSize: 14, fontWeight: 500, marginBottom: 16,
                        }}>⚠ {bookError}</div>
                    )}
                    {validationError && (
                        <div style={{
                            background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10,
                            padding: '12px 16px', color: '#92400e', fontSize: 14, fontWeight: 500, marginBottom: 16,
                        }}>⚠ {validationError}</div>
                    )}

                    <button
                        onClick={handleBook}
                        disabled={booking || validating || !!validationError}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '18px', fontSize: 16, fontWeight: 800 }}
                    >
                        {booking ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <span className="spin" style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                                Processing Your Booking...
                            </span>
                        ) : validating ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <span className="spin" style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                                Validating Live Price...
                            </span>
                        ) : '🎫 Confirm Booking'}
                    </button>
                </div>

                {/* Sidebar */}
                <div style={{ width: 300, flexShrink: 0 }} className="hide-mobile">
                    <FareSummary flight={flight} searchParams={searchParams} validated={validated} />
                </div>
            </div>
        </div>
    );
}
