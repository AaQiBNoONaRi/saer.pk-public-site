import React, { useState, useRef, useEffect, useCallback } from 'react';

const API = 'http://localhost:8000/api/flight-search';

// ── Airport autocomplete helper ──────────────────────────────────────────────
const POPULAR = [
    // Pakistan
    { code: 'KHI', name: 'Karachi', country: 'PK', full: 'Jinnah International Airport' },
    { code: 'LHE', name: 'Lahore', country: 'PK', full: 'Allama Iqbal International Airport' },
    { code: 'ISB', name: 'Islamabad', country: 'PK', full: 'Islamabad International Airport' },
    { code: 'PEW', name: 'Peshawar', country: 'PK', full: 'Bacha Khan International Airport' },
    { code: 'MUX', name: 'Multan', country: 'PK', full: 'Multan International Airport' },
    { code: 'SKT', name: 'Sialkot', country: 'PK', full: 'Sialkot International Airport' },
    { code: 'UET', name: 'Quetta', country: 'PK', full: 'Quetta International Airport' },
    { code: 'LYP', name: 'Faisalabad', country: 'PK', full: 'Faisalabad International Airport' },
    { code: 'GIL', name: 'Gilgit', country: 'PK', full: 'Gilgit Airport' },
    { code: 'SKZ', name: 'Sukkur', country: 'PK', full: 'Sukkur Airport' },
    // Middle East
    { code: 'DXB', name: 'Dubai', country: 'AE', full: 'Dubai International Airport' },
    { code: 'DWC', name: 'Dubai (DWC)', country: 'AE', full: 'Al Maktoum International Airport' },
    { code: 'AUH', name: 'Abu Dhabi', country: 'AE', full: 'Abu Dhabi International Airport' },
    { code: 'SHJ', name: 'Sharjah', country: 'AE', full: 'Sharjah International Airport' },
    { code: 'JED', name: 'Jeddah', country: 'SA', full: 'King Abdulaziz International Airport' },
    { code: 'RUH', name: 'Riyadh', country: 'SA', full: 'King Khalid International Airport' },
    { code: 'DMM', name: 'Dammam', country: 'SA', full: 'King Fahd International Airport' },
    { code: 'MED', name: 'Madinah', country: 'SA', full: 'Prince Mohammad Bin Abdulaziz Airport' },
    { code: 'DOH', name: 'Doha', country: 'QA', full: 'Hamad International Airport' },
    { code: 'MCT', name: 'Muscat', country: 'OM', full: 'Muscat International Airport' },
    { code: 'KWI', name: 'Kuwait', country: 'KW', full: 'Kuwait International Airport' },
    { code: 'BAH', name: 'Bahrain', country: 'BH', full: 'Bahrain International Airport' },
    { code: 'IST', name: 'Istanbul', country: 'TR', full: 'Istanbul Airport' },
    { code: 'SAW', name: 'Istanbul (SAW)', country: 'TR', full: 'Sabiha Gokcen International Airport' },
    { code: 'BEY', name: 'Beirut', country: 'LB', full: 'Beirut-Rafic Hariri International Airport' },
    { code: 'AMM', name: 'Amman', country: 'JO', full: 'Queen Alia International Airport' },
    // Europe
    { code: 'LHR', name: 'London', country: 'GB', full: 'London Heathrow Airport' },
    { code: 'LGW', name: 'London (LGW)', country: 'GB', full: 'London Gatwick Airport' },
    { code: 'STN', name: 'London (STN)', country: 'GB', full: 'London Stansted Airport' },
    { code: 'MAN', name: 'Manchester', country: 'GB', full: 'Manchester Airport' },
    { code: 'BHX', name: 'Birmingham', country: 'GB', full: 'Birmingham Airport' },
    { code: 'CDG', name: 'Paris', country: 'FR', full: 'Charles de Gaulle Airport' },
    { code: 'ORY', name: 'Paris (ORY)', country: 'FR', full: 'Orly Airport' },
    { code: 'FRA', name: 'Frankfurt', country: 'DE', full: 'Frankfurt Airport' },
    { code: 'MUC', name: 'Munich', country: 'DE', full: 'Munich Airport' },
    { code: 'AMS', name: 'Amsterdam', country: 'NL', full: 'Schiphol Airport' },
    { code: 'FCO', name: 'Rome', country: 'IT', full: 'Leonardo da Vinci-Fiumicino Airport' },
    { code: 'MXP', name: 'Milan', country: 'IT', full: 'Malpensa Airport' },
    { code: 'MAD', name: 'Madrid', country: 'ES', full: 'Adolfo Suarez Madrid-Barajas Airport' },
    { code: 'BCN', name: 'Barcelona', country: 'ES', full: 'Josep Tarradellas Barcelona-El Prat Airport' },
    { code: 'ZRH', name: 'Zurich', country: 'CH', full: 'Zurich Airport' },
    // North America
    { code: 'JFK', name: 'New York', country: 'US', full: 'John F. Kennedy International Airport' },
    { code: 'EWR', name: 'New York (EWR)', country: 'US', full: 'Newark Liberty International Airport' },
    { code: 'ORD', name: 'Chicago', country: 'US', full: "O'Hare International Airport" },
    { code: 'LAX', name: 'Los Angeles', country: 'US', full: 'Los Angeles International Airport' },
    { code: 'YYZ', name: 'Toronto', country: 'CA', full: 'Toronto Pearson International Airport' },
    { code: 'YVR', name: 'Vancouver', country: 'CA', full: 'Vancouver International Airport' },
    // Asia Pacific
    { code: 'SIN', name: 'Singapore', country: 'SG', full: 'Changi Airport' },
    { code: 'BKK', name: 'Bangkok', country: 'TH', full: 'Suvarnabhumi Airport' },
    { code: 'HKG', name: 'Hong Kong', country: 'HK', full: 'Hong Kong International Airport' },
    { code: 'HND', name: 'Tokyo (HND)', country: 'JP', full: 'Haneda Airport' },
    { code: 'NRT', name: 'Tokyo (NRT)', country: 'JP', full: 'Narita International Airport' },
    { code: 'KUL', name: 'Kuala Lumpur', country: 'MY', full: 'Kuala Lumpur International Airport' },
    { code: 'SYD', name: 'Sydney', country: 'AU', full: 'Sydney Kingsford Smith Airport' },
    { code: 'MEL', name: 'Melbourne', country: 'AU', full: 'Melbourne Airport' },
];

function AirportInput({ value, onChange, placeholder, exclude }) {
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const ref = useRef();

    useEffect(() => {
        const q = query.toLowerCase();
        const res = POPULAR.filter(a =>
            a.code !== exclude &&
            (!q || a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.full.toLowerCase().includes(q))
        ).slice(0, 8);
        setFiltered(res);
    }, [query, exclude]);

    useEffect(() => {
        const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const select = (airport) => {
        setQuery(`${airport.name} (${airport.code})`);
        onChange(airport.code, airport);
        setOpen(false);
    };

    return (
        <div ref={ref} style={{ position: 'relative', flex: 1 }}>
            <input
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange('', null); }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                style={{ padding: '14px 16px 14px 48px', fontSize: 15, fontWeight: 500 }}
            />
            <span style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                fontSize: 18, pointerEvents: 'none',
            }}>✈️</span>
            {open && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 200, maxHeight: 300, overflowY: 'auto',
                }}>
                    {filtered.map(a => (
                        <button key={a.code} onMouseDown={() => select(a)} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            width: '100%', padding: '10px 16px', background: 'none',
                            border: 'none', cursor: 'pointer', textAlign: 'left',
                            borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 10, background: '#eef2ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: 13, color: 'var(--primary)', flexShrink: 0,
                            }}>{a.code}</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name} <span style={{ color: '#94a3b8', fontSize: 12 }}>({a.code})</span></div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{a.full}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function TravelersDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const total = value.adults + value.children + value.infants;
    const classes = ['Economy', 'Premium Economy', 'Business', 'First Class'];

    return (
        <div ref={ref} style={{ position: 'relative', minWidth: 200 }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', padding: '14px 16px', border: '1.5px solid var(--border)',
                borderRadius: 8, background: '#fff', cursor: 'pointer', textAlign: 'left',
                fontSize: 15, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
                transition: 'var(--transition)',
            }}>
                <span style={{ fontSize: 18 }}>👤</span>
                {total} Traveler{total !== 1 ? 's' : ''} · {value.cabin}
            </button>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 200, padding: 16, minWidth: 280,
                }}>
                    {[
                        { key: 'adults', label: 'Adults', sub: '12+ years' },
                        { key: 'children', label: 'Children', sub: '2–11 years' },
                        { key: 'infants', label: 'Infants', sub: 'Under 2 years' },
                    ].map(({ key, label, sub }) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button onClick={() => onChange({ ...value, [key]: Math.max(key === 'adults' ? 1 : 0, value[key] - 1) })}
                                    style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--border)', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{value[key]}</span>
                                <button onClick={() => onChange({ ...value, [key]: value[key] + 1 })}
                                    style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--border)', background: '#f8fafc', cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>
                    ))}
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 12px' }} />
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Cabin Class</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {classes.map(c => (
                            <button key={c} onClick={() => onChange({ ...value, cabin: c })} style={{
                                padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${value.cabin === c ? 'var(--primary)' : 'var(--border)'}`,
                                background: value.cabin === c ? 'var(--primary)' : '#fff',
                                color: value.cabin === c ? '#fff' : 'var(--text)',
                                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            }}>{c}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Hero ──────────────────────────────────────────────────────────────────
export default function HeroSearch({ onSearch }) {
    const [tripType, setTripType] = useState('oneway');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [fromInfo, setFromInfo] = useState(null);
    const [toInfo, setToInfo] = useState(null);
    const [depDate, setDepDate] = useState('');
    const [retDate, setRetDate] = useState('');
    const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0, cabin: 'Economy' });
    const [segments, setSegments] = useState([
        { from: '', to: '', date: '' },
        { from: '', to: '', date: '' },
    ]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const cabinMap = { 'Economy': 'Y', 'Premium Economy': 'W', 'Business': 'C', 'First Class': 'F' };

    const handleSearch = async () => {
        setError('');
        if (tripType !== 'multicity') {
            if (!from || !to) return setError('Please select origin and destination airports.');
            if (!depDate) return setError('Please select a departure date.');
            if (tripType === 'return' && !retDate) return setError('Please select a return date.');
        } else {
            if (segments.some(s => !s.from || !s.to || !s.date)) return setError('Please fill all multi-city segments.');
        }

        setSearching(true);
        try {
            // Helper to format YYYY-MM-DD to DD-MM-YYYY
            const formatDate = (dateStr) => {
                if (!dateStr) return dateStr;
                const [y, m, d] = dateStr.split('-');
                return `${d}-${m}-${y}`;
            };

            let payload;
            if (tripType === 'multicity') {
                payload = {
                    tripType: 'multicity',
                    multiCitySegments: segments.map(s => ({ origin: s.from, destination: s.to, departureDate: formatDate(s.date) })),
                    adults: travelers.adults, children: travelers.children, infants: travelers.infants,
                    cabinClass: cabinMap[travelers.cabin] || 'Y',
                };
            } else {
                payload = {
                    tripType: tripType === 'return' ? 'return' : 'oneway',
                    origin: from, destination: to,
                    departureDate: formatDate(depDate), returnDate: retDate ? formatDate(retDate) : undefined,
                    adults: travelers.adults, children: travelers.children, infants: travelers.infants,
                    cabinClass: cabinMap[travelers.cabin] || 'Y',
                };
            }

            const res = await fetch(`${API}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || 'Search failed. Please try again.');
            }

            const data = await res.json();
            const flights = data.flights || [];
            if (flights.length === 0) throw new Error('No flights found for this route. Try different dates or airports.');
            onSearch({ ...payload, travelers, cabin: travelers.cabin }, flights);
        } catch (err) {
            setError(err.message);
        } finally {
            setSearching(false);
        }
    };

    const updateSegment = (i, field, val) => {
        const s = [...segments];
        s[i] = { ...s[i], [field]: val };
        setSegments(s);
    };

    const btnStyle = (active) => ({
        padding: '10px 24px', borderRadius: 99, border: 'none', cursor: 'pointer',
        fontWeight: 700, fontSize: 14, letterSpacing: 0.3, transition: 'var(--transition)',
        background: active ? 'var(--primary)' : 'rgba(255,255,255,0.12)',
        color: active ? '#fff' : 'rgba(255,255,255,0.75)',
        boxShadow: active ? '0 4px 12px rgba(15,52,96,0.4)' : 'none',
    });

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Hero Background */}
            <div style={{
                background: 'linear-gradient(135deg, #0f3460 0%, #16213e 40%, #0f3460 70%, #1a4a8a 100%)',
                padding: '80px 24px 120px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                {[
                    { size: 400, top: -100, left: -100, opacity: 0.06 },
                    { size: 300, top: -50, right: -80, opacity: 0.08 },
                    { size: 200, bottom: 0, left: '30%', opacity: 0.05 },
                ].map((c, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: c.size, height: c.size,
                        borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)',
                        top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                        pointerEvents: 'none',
                    }} />
                ))}

                {/* Floating plane icons */}
                <div style={{
                    position: 'absolute', top: 40, left: '10%', opacity: 0.15,
                    animation: 'float 6s ease-in-out infinite', fontSize: 32,
                }}>✈</div>
                <div style={{
                    position: 'absolute', top: 60, right: '12%', opacity: 0.12,
                    animation: 'float 8s ease-in-out infinite 2s', fontSize: 24,
                }}>✈</div>

                <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.3)',
                        padding: '6px 16px', borderRadius: 99, marginBottom: 20,
                    }}>
                        <span style={{ color: '#90e0ef', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>✦ Book Now, Fly Smart</span>
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 900, color: '#fff',
                        lineHeight: 1.1, marginBottom: 16, letterSpacing: -1,
                    }}>
                        Find Your <span style={{ color: '#e94f37' }}>Perfect</span> Flight
                    </h1>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', fontWeight: 400, marginBottom: 40 }}>
                        Search hundreds of airlines and book with confidence
                    </p>
                </div>

                {/* Wave divider */}
                <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%' }} preserveAspectRatio="none">
                    <path d="M0,60V20C360,60,720,0,1440,30V60H0Z" fill="var(--bg)" />
                </svg>
            </div>

            {/* Search Card */}
            <div style={{ maxWidth: 1000, margin: '-60px auto 40px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                <div className="card-lg" style={{ padding: 28 }}>
                    {/* Trip Type Toggle */}
                    <div style={{
                        display: 'flex', gap: 8, marginBottom: 24,
                        background: '#f0f4f8', padding: 5, borderRadius: 99, width: 'fit-content',
                    }}>
                        {[
                            { id: 'oneway', label: '→ One Way' },
                            { id: 'return', label: '⇄ Return' },
                            { id: 'multicity', label: '⤴ Multi-City' },
                        ].map(({ id, label }) => (
                            <button key={id} onClick={() => setTripType(id)} style={{
                                padding: '9px 22px', borderRadius: 99, border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: 13, letterSpacing: 0.2, transition: 'var(--transition)',
                                background: tripType === id ? '#fff' : 'transparent',
                                color: tripType === id ? 'var(--primary)' : 'var(--text-muted)',
                                boxShadow: tripType === id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                            }}>{label}</button>
                        ))}
                    </div>

                    {tripType !== 'multicity' ? (
                        /* One Way / Return */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', flexWrap: 'wrap' }}>
                                <AirportInput
                                    value={from ? `${fromInfo?.name || ''} (${from})` : ''}
                                    onChange={(code, info) => { setFrom(code); setFromInfo(info); }}
                                    placeholder="From — Origin city or airport"
                                    exclude={to}
                                />
                                <button
                                    onClick={() => { const tmp = from; setFrom(to); setTo(tmp); const ti = fromInfo; setFromInfo(toInfo); setToInfo(ti); }}
                                    style={{
                                        width: 42, height: 42, borderRadius: '50%', border: '1.5px solid var(--border)',
                                        background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', alignSelf: 'center', flexShrink: 0,
                                        transition: 'var(--transition)', color: 'var(--primary)', fontWeight: 700,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f0f4f8'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                >⇄</button>
                                <AirportInput
                                    value={to ? `${toInfo?.name || ''} (${to})` : ''}
                                    onChange={(code, info) => { setTo(code); setToInfo(info); }}
                                    placeholder="To — Destination city or airport"
                                    exclude={from}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 150, position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>📅</span>
                                    <input
                                        type="date" value={depDate} min={today}
                                        onChange={e => setDepDate(e.target.value)}
                                        style={{ padding: '14px 14px 14px 44px', fontSize: 15 }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 150, position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>📅</span>
                                    <input
                                        type="date" value={retDate} min={depDate || today}
                                        onChange={e => setRetDate(e.target.value)}
                                        disabled={tripType === 'oneway'}
                                        style={{
                                            padding: '14px 14px 14px 44px', fontSize: 15,
                                            opacity: tripType === 'oneway' ? 0.45 : 1,
                                            cursor: tripType === 'oneway' ? 'not-allowed' : 'pointer',
                                        }}
                                        placeholder={tripType === 'oneway' ? 'One-way trip' : 'Return date'}
                                    />
                                </div>
                                <TravelersDropdown value={travelers} onChange={setTravelers} />
                            </div>
                        </div>
                    ) : (
                        /* Multi-City */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {segments.map((seg, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: 12, flexShrink: 0,
                                    }}>{i + 1}</div>
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <AirportInput
                                            value={seg.from ? `(${seg.from})` : ''}
                                            onChange={(code) => updateSegment(i, 'from', code)}
                                            placeholder="From"
                                            exclude={seg.to}
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 120 }}>
                                        <AirportInput
                                            value={seg.to ? `(${seg.to})` : ''}
                                            onChange={(code) => updateSegment(i, 'to', code)}
                                            placeholder="To"
                                            exclude={seg.from}
                                        />
                                    </div>
                                    <div style={{ minWidth: 150 }}>
                                        <input type="date" value={seg.date} min={today}
                                            onChange={e => updateSegment(i, 'date', e.target.value)}
                                            style={{ padding: '12px 14px', fontSize: 14 }}
                                        />
                                    </div>
                                    {segments.length > 2 && (
                                        <button onClick={() => setSegments(segments.filter((_, j) => j !== i))} style={{
                                            width: 30, height: 30, borderRadius: '50%', border: '1px solid #fecaca',
                                            background: '#fee2e2', color: '#ef4444', cursor: 'pointer', fontSize: 16,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>×</button>
                                    )}
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                                {segments.length < 5 && (
                                    <button onClick={() => setSegments([...segments, { from: '', to: '', date: '' }])} style={{
                                        padding: '8px 18px', borderRadius: 8, border: '1.5px dashed var(--border)',
                                        background: '#f8fafc', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--primary)',
                                    }}>+ Add City</button>
                                )}
                                <TravelersDropdown value={travelers} onChange={setTravelers} />
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
                            padding: '10px 14px', color: '#dc2626', fontSize: 14, fontWeight: 500,
                            marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
                        }}>⚠ {error}</div>
                    )}

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={searching}
                        className="btn btn-primary btn-xl"
                        style={{ width: '100%', marginTop: 18, fontSize: 16, letterSpacing: 0.5 }}
                    >
                        {searching ? (
                            <>
                                <span className="spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                                Searching Flights...
                            </>
                        ) : (
                            <> 🔍 Search Flights</>
                        )}
                    </button>
                </div>

                {/* Popular routes */}
                <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, alignSelf: 'center' }}>Popular:</span>
                    {[['KHI', 'DXB'], ['LHE', 'JED'], ['ISB', 'KHI'], ['LHE', 'DOH']].map(([f, t]) => (
                        <button key={`${f}-${t}`} onClick={() => {
                            const fa = POPULAR.find(a => a.code === f);
                            const ta = POPULAR.find(a => a.code === t);
                            setFrom(f); setFromInfo(fa);
                            setTo(t); setToInfo(ta);
                            setTripType('oneway');
                        }} style={{
                            padding: '6px 14px', borderRadius: 99, border: '1px solid var(--border)',
                            background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                            color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'var(--transition)',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >✈ {f} → {t}</button>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {[
                        { icon: '🔒', title: 'Secure Booking', desc: 'SSL encrypted payment protection' },
                        { icon: '✈', title: 'All Airlines', desc: 'Compare every major carrier' },
                        { icon: '💰', title: 'Best Prices', desc: 'Guaranteed lowest fares' },
                        { icon: '📞', title: '24/7 Support', desc: 'We\'re always here to help' },
                    ].map(({ icon, title, desc }) => (
                        <div className="card" key={title} style={{ padding: '20px 18px', textAlign: 'center' }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
