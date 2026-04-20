import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8000/api/packages/public/list';

export default function PublicPackagesList({ onBack, compact = false, onViewPackage }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await fetch(API);
                if (!res.ok) throw new Error('Failed to fetch packages');
                const data = await res.json();
                setPackages(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return Number(price).toLocaleString('en-PK');
    };

    return (
        <div style={{ background: compact ? 'transparent' : 'var(--bg)', minHeight: compact ? 'auto' : '100vh', paddingBottom: compact ? 0 : 80 }}>
            {/* Header Hero Area */}
            {!compact && (
                <div style={{
                    background: 'var(--navy)',
                    padding: '72px 24px 88px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    color: '#fff'
                }}>
                    {/* Geometric pattern */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                    <div style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(20,126,251,0.1)', border: '1px solid rgba(20,126,251,0.25)',
                            padding: '6px 16px', borderRadius: 999, color: 'var(--primary)',
                            fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                            marginBottom: 24,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                            </svg>
                            Premium Umrah Packages
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 900, letterSpacing: '-1px',
                            lineHeight: 1.1, margin: '0 0 20px 0', color: '#fff'
                        }}>
                            Your Sacred Journey,<br />
                            <span style={{ color: 'var(--gold)' }}>Perfectly Curated</span>
                        </h1>
                        <p style={{
                            fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7,
                            maxWidth: 560, margin: '0 auto', fontWeight: 500
                        }}>
                            Discover our specially designed Umrah packages. Every detail is carefully planned to ensure your spiritual journey is peaceful, comfortable, and memorable.
                        </p>
                    </div>

                    {/* Decorative Glow */}
                    <div style={{
                        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400,
                        background: 'var(--primary)', filter: 'blur(180px)', opacity: 0.1, borderRadius: '50%'
                    }} />
                </div>
            )}

            {/* Packages Grid */}
            <div style={{ maxWidth: 1200, margin: compact ? '0 auto' : '-44px auto 0', padding: compact ? '0 24px' : '0 24px', position: 'relative', zIndex: 20 }}>
                {loading ? (
                    <div style={{ padding: '80px 0', textAlign: 'center' }}>
                        <div style={{
                            display: 'inline-block', width: 40, height: 40,
                            border: '3px solid rgba(20,126,251,0.15)',
                            borderTopColor: 'var(--primary)',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 15, fontWeight: 600 }}>Loading packages...</p>
                    </div>
                ) : error ? (
                    <div style={{
                        background: '#fff', borderRadius: 20, padding: 48,
                        textAlign: 'center', border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                        <div style={{
                            background: 'rgba(239,68,68,0.08)', width: 56, height: 56,
                            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Failed to load packages</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{error}</p>
                    </div>
                ) : packages.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: 20, padding: 80,
                        textAlign: 'center', border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                        <div style={{
                            background: 'rgba(20,126,251,0.06)', width: 72, height: 72,
                            borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>No Packages Available</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>We are currently updating our itinerary. Please check back soon.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
                        {(compact ? packages.slice(0, 3) : packages).map(pkg => (
                            <PackageCard key={pkg._id || pkg.id} pkg={pkg} formatPrice={formatPrice} onViewPackage={onViewPackage} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function PackageCard({ pkg, formatPrice, onViewPackage }) {
    const flight = typeof pkg.flight === 'object' ? pkg.flight : null;
    let flightStr = null;
    let airlineCode = null;
    if (flight) {
        const dep = flight.departure_trip || flight;
        flightStr = `${dep.departure_city || 'Origin'} → ${dep.arrival_city || 'Dest'}`;
        airlineCode = dep.airline || 'FL';
    }

    let lowestPrice = null;
    let lowestType = null;
    if (pkg.package_prices) {
        const types = ['quad', 'quint', 'triple', 'sharing', 'double'];
        for (const type of types) {
            if (pkg.package_prices[type] && pkg.package_prices[type].selling > 0) {
                if (lowestPrice === null || pkg.package_prices[type].selling < lowestPrice) {
                    lowestPrice = pkg.package_prices[type].selling;
                    lowestType = type;
                }
            }
        }
    }

    const totalNights = (pkg.hotels || []).reduce((acc, h) => acc + (h.nights || 0), 0);
    const makkahHotel = pkg.hotels?.find(h => h.city?.toLowerCase() === 'makkah');
    const madinahHotel = pkg.hotels?.find(h => h.city?.toLowerCase() === 'madinah');

    return (
        <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1px solid rgba(226,232,240,0.8)',
            boxShadow: '0 2px 12px rgba(20,27,33,0.05)',
            display: 'flex', flexDirection: 'column', height: '100%',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(20,27,33,0.1)';
                e.currentTarget.style.borderColor = 'rgba(20,126,251,0.15)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(20,27,33,0.05)';
                e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)';
            }}
        >
            {/* Top Accent Area */}
            <div style={{
                height: 130, background: 'linear-gradient(135deg, var(--navy) 0%, #1a2332 100%)',
                position: 'relative', overflow: 'hidden', padding: '20px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
                {/* Pattern */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                {/* Decorative glow */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.2 }} />

                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                        background: 'rgba(200,169,81,0.15)', backdropFilter: 'blur(8px)',
                        padding: '5px 14px', borderRadius: 999, color: 'var(--gold)',
                        fontSize: 12, fontWeight: 700, border: '1px solid rgba(200,169,81,0.2)',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                        {totalNights} Nights
                    </div>
                    {pkg.pax_capacity && (
                        <div style={{
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                            padding: '5px 12px', borderRadius: 999, color: 'rgba(255,255,255,0.7)',
                            fontSize: 11, fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            </svg>
                            {pkg.pax_capacity} Seats
                        </div>
                    )}
                </div>
                <h3 style={{
                    position: 'relative', zIndex: 2,
                    fontSize: 20, fontWeight: 900, color: '#fff',
                    margin: 0, lineHeight: 1.2, letterSpacing: '-0.3px',
                }}>
                    {pkg.title}
                </h3>
            </div>

            {/* Core Details */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Price */}
                {lowestPrice && (
                    <div style={{
                        background: 'rgba(20,126,251,0.04)', border: '1px solid rgba(20,126,251,0.1)',
                        borderRadius: 14, padding: '16px 18px', marginBottom: 20,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>
                                Starting from ({lowestType})
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>PKR</span>
                                <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>{formatPrice(lowestPrice)}</span>
                            </div>
                        </div>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(20,126,251,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Inclusions */}
                <div style={{ marginBottom: 20, flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>
                        Inclusions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {flightStr && (
                            <InclusionItem
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>}
                                bgColor="#eef6ff"
                                title="Return Flights"
                                desc={`${flightStr} ${airlineCode ? `(${airlineCode})` : ''}`}
                            />
                        )}
                        {makkahHotel && (
                            <InclusionItem
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                                bgColor="rgba(20,126,251,0.06)"
                                title="Makkah Hotel"
                                desc={`${makkahHotel.name} (${makkahHotel.nights} Nights)`}
                            />
                        )}
                        {madinahHotel && (
                            <InclusionItem
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                                bgColor="rgba(20,126,251,0.06)"
                                title="Madinah Hotel"
                                desc={`${madinahHotel.name} (${madinahHotel.nights} Nights)`}
                            />
                        )}
                        {(pkg.visa_pricing || pkg.transport) && (
                            <InclusionItem
                                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                                bgColor="rgba(200,169,81,0.08)"
                                title="Included Services"
                                desc={[pkg.visa_pricing ? 'Umrah Visa' : null, pkg.transport ? `Transport (${pkg.transport.sector || 'Included'})` : null].filter(Boolean).join(' & ')}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Action Bottom */}
            <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
                {onViewPackage && (
                    <button
                        onClick={() => onViewPackage(pkg._id || pkg.id)}
                        style={{
                            flex: 1, padding: '14px 0',
                            background: '#fff',
                            color: 'var(--primary)', border: '2px solid var(--primary)', borderRadius: 14,
                            fontSize: 13, fontWeight: 800, cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                    >
                        View Details
                    </button>
                )}
                <button
                    onClick={() => onViewPackage ? onViewPackage(pkg._id || pkg.id) : window.open('https://wa.me/92300000000?text=' + encodeURIComponent(`I'm interested in the ${pkg.title} package`), '_blank')}
                    style={{
                        flex: onViewPackage ? 1 : undefined, width: onViewPackage ? undefined : '100%', padding: 16,
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                        color: '#fff', border: 'none', borderRadius: 14,
                        fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s',
                        boxShadow: '0 6px 20px rgba(20,126,251,0.25)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(20,126,251,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(20,126,251,0.25)'; }}
                >
                    {onViewPackage ? 'Book Now' : 'Inquire Now'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function InclusionItem({ icon, bgColor, title, desc }) {
    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: bgColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>{icon}</div>
            <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{desc}</div>
            </div>
        </div>
    );
}
