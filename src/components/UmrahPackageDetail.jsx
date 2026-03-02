import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8000';

const fmt = (v) => (v != null && v !== '' ? v : '—');
const PKR = (v) => `Rs. ${Number(v || 0).toLocaleString()}`;

const STAR_COLOR = '#F59E0B';

function StarRating({ stars }) {
    const n = parseInt(stars) || 0;
    return (
        <span>
            {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: i <= n ? STAR_COLOR : '#D1D5DB', fontSize: 14 }}>★</span>
            ))}
        </span>
    );
}

export default function UmrahPackageDetail({ packageId, onBack, onBook }) {
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!packageId) return;
        setLoading(true);
        fetch(`${API}/api/packages/public/list`)
            .then(r => r.json())
            .then(list => {
                const found = list.find(p => (p._id || p.id) === packageId);
                if (found) setPkg(found);
                else setError('Package not found');
            })
            .catch(() => setError('Failed to load package'))
            .finally(() => setLoading(false));
    }, [packageId]);

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: 44, height: 44, border: '3px solid rgba(20,126,251,0.15)',
                borderTopColor: '#147EFB', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
            }} />
        </div>
    );
    if (error) return (
        <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', color: '#EF4444', fontWeight: 700 }}>
            {error}
        </div>
    );
    if (!pkg) return null;

    const hotels = pkg.hotels || [];
    const flight = pkg.flight || {};
    const prices = pkg.package_prices || {};
    const visa = pkg.visa_pricing || {};
    const transport = pkg.transport || {};
    const food = pkg.food || {};
    const ziyarat = pkg.ziyarat || {};

    // Build room price rows
    const ROOM_LABELS = { sharing: 'Sharing', double: 'Double', triple: 'Triple', quad: 'Quad', quint: 'Quint' };
    const roomRows = Object.entries(prices).filter(([, v]) => v && (typeof v === 'number' ? v > 0 : v.selling > 0));

    return (
        <div style={{ background: '#F8F9FE', minHeight: '100vh', paddingBottom: 80 }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)',
                padding: '60px 24px 80px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                    <button onClick={onBack} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700,
                        background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24,
                        letterSpacing: '0.5px'
                    }}>
                        ← Back to Packages
                    </button>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                        <div style={{ flex: 1 }}>
                            <span style={{
                                display: 'inline-block', background: 'rgba(20,126,251,0.15)',
                                border: '1px solid rgba(20,126,251,0.3)', color: '#60A5FA',
                                fontSize: 10, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
                                padding: '4px 12px', borderRadius: 999, marginBottom: 12
                            }}>Umrah Package</span>
                            <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.2 }}>
                                {pkg.title}
                            </h1>
                            {pkg.description && (
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
                                    {pkg.description}
                                </p>
                            )}
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20, padding: '24px 28px', textAlign: 'center', minWidth: 200
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px 0' }}>Starting from</p>
                            <p style={{ color: '#60A5FA', fontSize: 28, fontWeight: 900, margin: '0 0 2px 0' }}>
                                {(() => {
                                    const vals = roomRows.map(([,v]) => typeof v === 'number' ? v : (v.selling || 0));
                                    const min = vals.length ? Math.min(...vals) : 0;
                                    return PKR(min);
                                })()}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, margin: 0 }}>per person</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}>

                {/* Room Prices */}
                {roomRows.length > 0 && (
                    <Card title="Room Prices">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                            {roomRows.map(([key, val]) => (
                                <div key={key} style={{
                                    background: '#F0F7FF', border: '1.5px solid #BFDBFE',
                                    borderRadius: 14, padding: '14px 16px', textAlign: 'center'
                                }}>
                                    <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px 0' }}>
                                        {ROOM_LABELS[key] || key}
                                    </p>
                                    <p style={{ color: '#1D4ED8', fontSize: 18, fontWeight: 900, margin: 0 }}>
                                        {PKR(typeof val === 'number' ? val : val.selling)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Flight */}
                {(flight.airline || flight.departure_city) && (
                    <Card title="✈️ Flight Details">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                            <InfoRow label="Airline" value={fmt(flight.airline)} />
                            <InfoRow label="Route" value={flight.departure_city && flight.arrival_city ? `${flight.departure_city} → ${flight.arrival_city}` : '—'} />
                            <InfoRow label="Trip Type" value={fmt(flight.trip_type)} />
                            <InfoRow label="Adult Fare" value={flight.adult_selling ? PKR(flight.adult_selling) : '—'} />
                            <InfoRow label="Child Fare" value={flight.child_selling ? PKR(flight.child_selling) : '—'} />
                            <InfoRow label="Infant Fare" value={flight.infant_selling ? PKR(flight.infant_selling) : '—'} />
                        </div>
                    </Card>
                )}

                {/* Hotels */}
                {hotels.length > 0 && (
                    <Card title="🏨 Hotels">
                        {hotels.map((h, i) => (
                            <div key={i} style={{
                                background: '#FAFAFA', border: '1px solid #F0F0F0',
                                borderRadius: 14, padding: '16px 20px', marginBottom: i < hotels.length - 1 ? 10 : 0
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: 15, color: '#1E293B', margin: '0 0 4px 0' }}>{fmt(h.name)}</p>
                                        <p style={{ color: '#64748B', fontSize: 13, fontWeight: 600, margin: '0 0 6px 0' }}>{fmt(h.city)}</p>
                                        <StarRating stars={h.stars || h.hotel_data?.stars || 0} />
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: '#6B7280', fontSize: 11, fontWeight: 700, margin: '0 0 2px 0' }}>{fmt(h.check_in)} → {fmt(h.check_out)}</p>
                                        <p style={{ color: '#1D4ED8', fontWeight: 800, fontSize: 13, margin: 0 }}>{h.nights || h.total_nights} nights</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card>
                )}

                {/* Services */}
                <Card title="🗂️ Included Services">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                        {transport?.title && <ServiceBadge label="Transport" value={fmt(transport.title)} />}
                        {food?.title && <ServiceBadge label="Food" value={fmt(food.title)} />}
                        {ziyarat?.title && <ServiceBadge label="Ziyarat" value={fmt(ziyarat.title)} />}
                        {Object.entries(visa).filter(([,v]) => v > 0).map(([k, v]) => (
                            <ServiceBadge key={k} label={`Visa (${k})`} value={PKR(v)} />
                        ))}
                        {!transport?.title && !food?.title && !ziyarat?.title && Object.keys(visa).length === 0 && (
                            <p style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 600 }}>Contact us for service details.</p>
                        )}
                    </div>
                </Card>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button
                        onClick={() => onBook(pkg)}
                        style={{
                            background: 'linear-gradient(135deg, #147EFB 0%, #0B5CCC 100%)',
                            color: '#fff', border: 'none', borderRadius: 16,
                            padding: '18px 56px', fontSize: 17, fontWeight: 900,
                            cursor: 'pointer', letterSpacing: '0.3px',
                            boxShadow: '0 8px 24px rgba(20,126,251,0.35)',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,126,251,0.45)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(20,126,251,0.35)'; }}
                    >
                        Book This Package →
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Small helpers ─────────────────────────────────────────────────────────

function Card({ title, children }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 20, padding: '28px 28px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9',
            marginBottom: 20
        }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1E293B', margin: '0 0 20px 0', letterSpacing: '-0.3px' }}>{title}</h3>
            {children}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div>
            <p style={{ color: '#9CA3AF', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px 0' }}>{label}</p>
            <p style={{ color: '#1E293B', fontSize: 14, fontWeight: 700, margin: 0 }}>{value}</p>
        </div>
    );
}

function ServiceBadge({ label, value }) {
    return (
        <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12,
            padding: '12px 14px'
        }}>
            <p style={{ color: '#6B7280', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px 0' }}>{label}</p>
            <p style={{ color: '#15803D', fontSize: 13, fontWeight: 800, margin: 0 }}>{value}</p>
        </div>
    );
}
