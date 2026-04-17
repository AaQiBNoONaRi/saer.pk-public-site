import React, { useState, useRef, useEffect, useCallback } from 'react';
import PublicPackagesList from './PublicPackagesList';

const API = 'http://127.0.0.1:8000/api/flight-search';

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

function AirportInput({ value, onChange, placeholder, exclude, inputStyle = {} }) {
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

    // determine if embedded (no-border) mode based on inputStyle
    const isEmbedded = inputStyle.border === 'none';

    return (
        <div ref={ref} style={{ position: 'relative', flex: 1 }}>
            <input
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); if (!e.target.value) onChange('', null); }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                style={isEmbedded
                    ? { padding: 0, fontSize: 15, fontWeight: 600, border: 'none', background: 'transparent', boxShadow: 'none', width: '100%', outline: 'none', ...inputStyle }
                    : { padding: '14px 16px 14px 48px', fontSize: 15, fontWeight: 500 }
                }
            />
            {!isEmbedded && (
                <span style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', display: 'flex', alignItems: 'center',
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                    </svg>
                </span>
            )}
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
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                </span>
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
export default function HeroSearch({ onSearch, compact = false }) {
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
        background: active ? 'var(--primary)' : 'rgba(255,255,255,0.10)',
        color: active ? '#fff' : 'rgba(255,255,255,0.65)',
        boxShadow: active ? '0 4px 14px rgba(20,126,251,0.4)' : 'none',
        fontFamily: 'inherit',
    });

    const newHeroBanner = (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Hero Banner */}
            <div style={{
                position: 'relative',
                minHeight: 580,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: '#0a0f14',
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url(/kaaba-hero.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 40%',
                    filter: 'brightness(0.35)',
                }} />
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(10,15,20,0.95) 0%, rgba(10,15,20,0.7) 50%, rgba(10,15,20,0.4) 100%)',
                }} />
                {/* Subtle geometric pattern */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    opacity: 0.5,
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    maxWidth: 1200, margin: '0 auto', width: '100%',
                    padding: '80px 48px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 48,
                }}>
                    {/* Left: headline + tagline */}
                    <div style={{ flex: '0 0 auto', maxWidth: 540 }}>
                        {/* Trust badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(20,126,251,0.1)', border: '1px solid rgba(20,126,251,0.25)',
                            padding: '6px 16px', borderRadius: 999,
                            fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                            color: 'var(--primary)', marginBottom: 28,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Trusted by Thousands
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(32px, 4.2vw, 54px)',
                            fontWeight: 900, color: '#fff',
                            lineHeight: 1.12, marginBottom: 22,
                            letterSpacing: '-1px',
                        }}>
                            Your Complete<br />
                            <span style={{ color: 'var(--gold)' }}>Hajj & Umrah</span><br />
                            Solution
                        </h1>
                        <p style={{
                            fontSize: 16, color: 'rgba(255,255,255,0.6)',
                            fontWeight: 400, lineHeight: 1.75,
                            marginBottom: 36, maxWidth: 420,
                        }}>
                            Premium Umrah packages, competitive flight deals, and
                            worry-free travel arrangements. Trusted by pilgrims across Pakistan.
                        </p>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => document.getElementById('search-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', // <-- Updated
                                    color: '#fff', border: 'none',
                                    borderRadius: 12, padding: '16px 36px',
                                    fontSize: 15, fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    boxShadow: '0 8px 28px rgba(20,126,251,0.45)', // <-- Updated to primary blue RGBA
                                    transition: 'all 0.2s',
                                    display: 'inline-flex', alignItems: 'center', gap: 10,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(20,126,251,0.5)'; }} // <-- Updated
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(20,126,251,0.45)'; }} // <-- Updated
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                Search Flights
                            </button>
                            <button
                                onClick={() => document.querySelector('[data-packages-section]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                style={{
                                    background: 'transparent',
                                    color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)',
                                    borderRadius: 12, padding: '15px 28px',
                                    fontSize: 14, fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            >
                                View Packages
                            </button>
                        </div>
                    </div>

                    {/* Right: floating stat cards */}
                    <div className="hide-mobile" style={{
                        flex: '0 0 auto',
                        display: 'flex', flexDirection: 'column', gap: 16,
                        width: 'clamp(240px, 30vw, 340px)',
                    }}>
                        {[
                            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, value: '10,000+', label: 'Pilgrims Served' },
                            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, value: '50+', label: 'Partner Hotels' },
                            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, value: '100%', label: 'Secure Booking' },
                        ].map(({ icon, value, label }, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 16, padding: '18px 22px',
                                display: 'flex', alignItems: 'center', gap: 16,
                                animation: `fadeIn 0.5s ease ${i * 0.15}s both`,
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: 'rgba(200,169,81,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>{icon}</div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{value}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 2 }}>{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wave divider */}
                <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%', zIndex: 3 }} preserveAspectRatio="none">
                    <path d="M0,60V20C360,60,720,0,1440,30V60H0Z" fill="var(--bg)" />
                </svg>
            </div>
        </div>
    );

    const searchFormBlock = (
        <div id="search-card" style={{ maxWidth: 1080, margin: compact ? '0 auto' : '-56px auto 48px', padding: compact ? '0' : '0 24px', position: 'relative', zIndex: 10 }}>
            <div style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(20,27,33,0.13), 0 4px 16px rgba(20,27,33,0.06)',
                overflow: 'visible',
            }}>
                {/* ── Tabs row ── */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    padding: '0 28px',
                    borderBottom: '1px solid #f0f4f8',
                    gap: 0,
                }}>
                    {[
                        { id: 'oneway', label: 'One Way' },
                        { id: 'return', label: 'Return' },
                        { id: 'multicity', label: 'Multi-City' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setTripType(id)}
                            style={{
                                padding: '18px 22px',
                                border: 'none', background: 'none',
                                cursor: 'pointer', fontFamily: 'inherit',
                                fontSize: 14, fontWeight: tripType === id ? 700 : 500,
                                color: tripType === id ? 'var(--primary)' : '#94a3b8',
                                borderBottom: tripType === id ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                                marginBottom: -1,
                                transition: 'all 0.15s',
                                letterSpacing: 0.1,
                            }}
                            onMouseEnter={e => { if (tripType !== id) e.currentTarget.style.color = 'var(--text)'; }}
                            onMouseLeave={e => { if (tripType !== id) e.currentTarget.style.color = '#94a3b8'; }}
                        >{label}</button>
                    ))}
                </div>

                {/* ── Form body ── */}
                <div style={{ padding: '24px 28px 28px' }}>

                    {tripType !== 'multicity' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                            {/* Row 1 — From / swap / To */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', alignItems: 'end', gap: 0 }}>
                                {/* From */}
                                <div style={{
                                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                                    borderRadius: '12px 0 0 12px', padding: '12px 16px',
                                    position: 'relative', cursor: 'text',
                                    borderRight: 'none',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                        </svg>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>From</div>
                                            <AirportInput
                                                value={from ? `${fromInfo?.name || ''} (${from})` : ''}
                                                onChange={(code, info) => { setFrom(code); setFromInfo(info); }}
                                                placeholder="City or airport"
                                                exclude={to}
                                                inputStyle={{
                                                    border: 'none', background: 'transparent', padding: 0,
                                                    fontSize: 15, fontWeight: 600, color: 'var(--text)',
                                                    boxShadow: 'none',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Swap button */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderTop: '1.5px solid #e2e8f0', borderBottom: '1.5px solid #e2e8f0', height: '100%', zIndex: 2 }}>
                                    <button
                                        onClick={() => { const tmp = from; setFrom(to); setTo(tmp); const ti = fromInfo; setFromInfo(toInfo); setToInfo(ti); }}
                                        style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            border: '1.5px solid #e2e8f0',
                                            background: '#fff', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s', color: 'var(--primary)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                        title="Swap airports"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* To */}
                                <div style={{
                                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                                    borderRadius: '0 12px 12px 0', padding: '12px 16px',
                                    borderLeft: 'none',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>To</div>
                                            <AirportInput
                                                value={to ? `${toInfo?.name || ''} (${to})` : ''}
                                                onChange={(code, info) => { setTo(code); setToInfo(info); }}
                                                placeholder="City or airport"
                                                exclude={from}
                                                inputStyle={{
                                                    border: 'none', background: 'transparent', padding: 0,
                                                    fontSize: 15, fontWeight: 600, color: 'var(--text)',
                                                    boxShadow: 'none',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 — Depart / Return / Travellers + Search btn */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>

                                {/* Depart date */}
                                <div style={{
                                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                                    borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Depart</div>
                                            <input
                                                type="date" value={depDate} min={today}
                                                onChange={e => setDepDate(e.target.value)}
                                                style={{
                                                    border: 'none', background: 'transparent', padding: 0,
                                                    fontSize: 14, fontWeight: 600, color: depDate ? 'var(--text)' : '#94a3b8',
                                                    boxShadow: 'none', width: '100%', cursor: 'pointer',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Return date */}
                                <div style={{
                                    background: '#f8fafc',
                                    border: `1.5px solid ${tripType === 'oneway' ? '#f0f4f8' : '#e2e8f0'}`,
                                    borderRadius: 12, padding: '12px 16px',
                                    opacity: tripType === 'oneway' ? 0.5 : 1,
                                    cursor: tripType === 'oneway' ? 'not-allowed' : 'pointer',
                                    position: 'relative',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Return</div>
                                            {tripType === 'oneway' ? (
                                                <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>One-way trip</div>
                                            ) : (
                                                <input
                                                    type="date" value={retDate} min={depDate || new Date().toISOString().split('T')[0]}
                                                    onChange={e => setRetDate(e.target.value)}
                                                    style={{
                                                        border: 'none', background: 'transparent', padding: 0,
                                                        fontSize: 14, fontWeight: 600, color: retDate ? 'var(--text)' : '#94a3b8',
                                                        boxShadow: 'none', width: '100%', cursor: 'pointer',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Travellers */}
                                <div style={{
                                    background: '#f8fafc', border: '1.5px solid #e2e8f0',
                                    borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Travellers & Class</div>
                                            <TravelersDropdown value={travelers} onChange={setTravelers} inputStyle={{ border: 'none', background: 'transparent', padding: 0, fontSize: 14, fontWeight: 600, boxShadow: 'none' }} />
                                        </div>
                                    </div>
                                </div>
                                {/* End Travellers */}
                            </div>
                            {/* End Row 2 */}

                            {/* Search button */}
                            <button
                                onClick={handleSearch}
                                disabled={searching}
                                style={{
                                    background: 'var(--primary)',
                                    color: '#fff', border: 'none',
                                    borderRadius: 12, padding: '0 32px',
                                    height: 58, fontSize: 15, fontWeight: 700,
                                    cursor: searching ? 'not-allowed' : 'pointer',
                                    fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    whiteSpace: 'nowrap', flexShrink: 0,
                                    boxShadow: '0 8px 24px rgba(20,126,251,0.35)',
                                    transition: 'all 0.2s',
                                    opacity: searching ? 0.8 : 1,
                                }}
                                onMouseEnter={e => { if (!searching) { e.currentTarget.style.background = '#0f63d4'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,126,251,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(20,126,251,0.35)'; e.currentTarget.style.transform = 'none'; }}
                            >
                                {searching ? (
                                    <>
                                        <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        /* ── Multi-City ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {segments.map((seg, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr auto auto', gap: 10, alignItems: 'center' }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)',
                                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: 12, flexShrink: 0,
                                    }}>{i + 1}</div>
                                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>From</div>
                                        <AirportInput
                                            value={seg.from ? `(${seg.from})` : ''}
                                            onChange={(code) => updateSegment(i, 'from', code)}
                                            placeholder="City or airport"
                                            exclude={seg.to}
                                            inputStyle={{ border: 'none', background: 'transparent', padding: 0, fontSize: 14, fontWeight: 600, boxShadow: 'none' }}
                                        />
                                    </div>
                                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>To</div>
                                        <AirportInput
                                            value={seg.to ? `(${seg.to})` : ''}
                                            onChange={(code) => updateSegment(i, 'to', code)}
                                            placeholder="City or airport"
                                            exclude={seg.from}
                                            inputStyle={{ border: 'none', background: 'transparent', padding: 0, fontSize: 14, fontWeight: 600, boxShadow: 'none' }}
                                        />
                                    </div>
                                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 14px' }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Date</div>
                                        <input type="date" value={seg.date} min={today}
                                            onChange={e => updateSegment(i, 'date', e.target.value)}
                                            style={{ border: 'none', background: 'transparent', padding: 0, fontSize: 14, fontWeight: 600, boxShadow: 'none', width: 130, cursor: 'pointer' }}
                                        />
                                    </div>
                                    {segments.length > 2 ? (
                                        <button onClick={() => setSegments(segments.filter((_, j) => j !== i))} style={{
                                            width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #fecaca',
                                            background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 18,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>×</button>
                                    ) : <div style={{ width: 30 }} />}
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
                                {segments.length < 5 && (
                                    <button onClick={() => setSegments([...segments, { from: '', to: '', date: '' }])} style={{
                                        padding: '8px 18px', borderRadius: 8, border: '1.5px dashed var(--border)',
                                        background: '#f8fafc', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                        color: 'var(--primary)', fontFamily: 'inherit', transition: 'all 0.15s',
                                    }}>+ Add City</button>
                                )}
                                <div style={{ flex: 1 }}><TravelersDropdown value={travelers} onChange={setTravelers} /></div>
                                <button
                                    onClick={handleSearch}
                                    disabled={searching}
                                    style={{
                                        background: 'var(--primary)', color: '#fff', border: 'none',
                                        borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        boxShadow: '0 4px 16px rgba(20,126,251,0.3)',
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    {searching ? 'Searching...' : 'Search Flights'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div style={{
                            marginTop: 14, background: '#fef2f2', border: '1px solid #fecaca',
                            borderRadius: 8, padding: '10px 16px', color: '#dc2626',
                            fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}
                </div>

                {/* ── Popular routes bar ── */}
                {compact === false && (
                    <div style={{
                        borderTop: '1px solid #f0f4f8',
                        padding: '14px 28px',
                        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                    }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Popular</span>
                        <div style={{ width: 1, height: 14, background: '#e2e8f0', flexShrink: 0 }} />
                        {[['KHI', 'DXB'], ['LHE', 'JED'], ['ISB', 'KHI'], ['LHE', 'DOH'], ['KHI', 'RUH']].map(([f, t]) => (
                            <button key={`${f}-${t}`} onClick={() => {
                                const fa = POPULAR.find(a => a.code === f);
                                const ta = POPULAR.find(a => a.code === t);
                                setFrom(f); setFromInfo(fa); setTo(t); setToInfo(ta); setTripType('oneway');
                            }} style={{
                                padding: '5px 14px', borderRadius: 999,
                                border: '1px solid #e2e8f0', background: '#f8fafc',
                                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6,
                                transition: 'all 0.15s', fontFamily: 'inherit',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'rgba(20,126,251,0.04)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = '#f8fafc'; }}
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
                                {f} → {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (compact) {
        return (
            <div style={{ background: '#fff', padding: '24px 0 32px' }}>
                {searchFormBlock}
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg)' }}>
            {newHeroBanner}

            <div style={{ marginTop: -56, position: 'relative', zIndex: 10 }}>
                {searchFormBlock}
            </div>

            {/* ── Trust / Features bar ── */}
            <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                    {[
                        { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, title: 'Secure Booking', desc: 'SSL encrypted & safe payments' },
                        { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>, title: 'All Airlines', desc: 'Compare every major carrier' },
                        { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, title: 'Best Fares', desc: 'Guaranteed lowest prices' },
                        { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.68 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>, title: '24/7 Support', desc: 'Always here when you need us' },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} style={{
                            background: '#fff', borderRadius: 16,
                            border: '1px solid rgba(226,232,240,0.8)',
                            padding: '24px 20px',
                            display: 'flex', alignItems: 'flex-start', gap: 16,
                            boxShadow: '0 2px 8px rgba(20,27,33,0.04)',
                            transition: 'all 0.25s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,27,33,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(20,27,33,0.04)'; e.currentTarget.style.transform = 'none'; }}
                        >
                            <div style={{ flexShrink: 0, width: 48, height: 48, background: 'rgba(20,126,251,0.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {icon}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Featured Packages ── */}
            <div data-packages-section style={{ padding: '80px 0 48px' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, var(--primary), var(--gold))', borderRadius: 2, margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px', color: 'var(--text)', letterSpacing: '-0.5px' }}>Featured Umrah Packages</h2>
                    <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                        Carefully curated packages designed for a comfortable and spiritual journey
                    </p>
                </div>
                <PublicPackagesList compact={true} />
            </div>

            {/* ── Why Choose Us ── */}
            <div style={{ padding: '64px 0 80px', background: '#fff' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, var(--primary), var(--gold))', borderRadius: 2, margin: '0 auto 16px' }} />
                        <h2 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px', color: 'var(--text)', letterSpacing: '-0.5px' }}>Why Choose Saer.pk</h2>
                        <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                            We go beyond booking to ensure every aspect of your pilgrimage is handled with care
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
                        {[
                            {
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>,
                                title: 'Expert Flight Booking',
                                desc: 'Access to all major airlines with the best fares. Our flight search engine compares hundreds of options to find you the perfect itinerary.',
                            },
                            {
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
                                title: 'Premium Hotels',
                                desc: 'Handpicked hotels near Haram in Makkah and Masjid Nabawi in Madinah. Choose from economy to 5-star luxury accommodations.',
                            },
                            {
                                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
                                title: 'Dedicated Support',
                                desc: 'Personal travel advisors available round the clock. From visa processing to ground transportation, we handle everything for you.',
                            },
                        ].map(({ icon, title, desc }, i) => (
                            <div key={title} style={{
                                background: 'var(--bg)', borderRadius: 20,
                                padding: '36px 28px',
                                border: '1px solid rgba(226,232,240,0.8)',
                                transition: 'all 0.25s',
                                animation: `fadeIn 0.5s ease ${i * 0.1}s both`,
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(20,126,251,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(20,126,251,0.15)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)'; }}
                            >
                                <div style={{
                                    width: 56, height: 56, borderRadius: 14,
                                    background: 'rgba(20,126,251,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 24,
                                }}>{icon}</div>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>{title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stats Counter ── */}
            <div style={{
                background: 'var(--navy)',
                padding: '56px 24px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle pattern */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, position: 'relative', zIndex: 2 }}>
                    {[
                        { value: '10,000+', label: 'Pilgrims Served', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
                        { value: '8+', label: 'Years Experience', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
                        { value: '50+', label: 'Partner Hotels', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
                        { value: '15+', label: 'Destinations', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg> },
                    ].map(({ value, label, icon }, i) => (
                        <div key={label} style={{ textAlign: 'center', animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 14,
                                background: 'rgba(200,169,81,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}>{icon}</div>
                            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA Banner ── */}
            {/* ── CTA Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', // <-- Updated
                padding: '72px 24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                        Start Your Sacred Journey Today
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 36 }}>
                        Let us help you plan the perfect Hajj or Umrah experience. Book your flights, hotels, and complete packages with confidence.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => document.getElementById('search-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            style={{
                                background: '#fff', color: 'var(--primary)',
                                border: 'none', borderRadius: 12,
                                padding: '16px 36px', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                transition: 'all 0.2s',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Search Flights
                        </button>
                        <button
                            onClick={() => window.open('https://wa.me/92300000000', '_blank')}
                            style={{
                                background: 'transparent', color: '#fff',
                                border: '1.5px solid rgba(255,255,255,0.3)',
                                borderRadius: 12, padding: '15px 28px',
                                fontSize: 14, fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.345 0-4.513-.795-6.24-2.13l-.436-.348-3.13 1.049 1.049-3.13-.348-.436A9.946 9.946 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                            Chat on WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
