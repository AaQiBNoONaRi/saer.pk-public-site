import React from 'react';
import logo from '../assets/logo.png';

export default function Footer({ onNavigate }) {
    const handleClick = (page) => {
        if (onNavigate) onNavigate(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const linkStyle = {
        color: 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 500,
        transition: 'color 0.2s',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: 'inherit',
        textAlign: 'left',
        display: 'block',
        lineHeight: '2.2',
    };

    return (
        <footer style={{ background: '#0c1015', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            {/* Subtle top border accent */}
            <div style={{
                height: 3,
                background: 'linear-gradient(90deg, var(--primary), var(--gold), var(--primary))',
                opacity: 0.7,
            }} />

            {/* Main Footer Content */}
            <div style={{
                maxWidth: 1200, margin: '0 auto',
                padding: '64px 40px 48px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 48,
            }}>
                {/* Column 1: Brand */}
                <div style={{ gridColumn: 'span 1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{
                            width: 38, height: 38,
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            <img src={logo} alt="Saer.pk" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>
                                Saer<span style={{ color: 'var(--gold)' }}>.pk</span>
                            </div>
                        </div>
                    </div>
                    <p style={{
                        fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
                        marginBottom: 24, maxWidth: 280,
                    }}>
                        Your trusted partner for Hajj and Umrah services. We provide comprehensive travel
                        solutions with comfort, safety, and spiritual fulfillment at the heart of every journey.
                    </p>
                    {/* Social Icons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        {[
                            { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                            { label: 'Instagram', paths: ['M16 8a6 6 0 0 1 6 6v7a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4z', 'M9 21V9', 'M3 9h18'] },
                            { label: 'Twitter', path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
                        ].map(({ label }) => (
                            <a key={label} href="#" style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', color: 'rgba(255,255,255,0.5)',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                title={label}
                            >
                                {label === 'Facebook' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                )}
                                {label === 'Instagram' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </svg>
                                )}
                                {label === 'Twitter' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                    </svg>
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 20 }}>
                        Quick Links
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            { label: 'Home', page: 'home' },
                            { label: 'Umrah Packages', page: 'packages' },
                            { label: 'Search Flights', page: 'home' },
                            { label: 'Blog', page: 'blog' },
                            { label: 'Track Booking', page: 'tracker' },
                        ].map(({ label, page }) => (
                            <button key={label} onClick={() => handleClick(page)} style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                            >{label}</button>
                        ))}
                    </div>
                </div>

                {/* Column 3: Services */}
                <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 20 }}>
                        Our Services
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {[
                            'Umrah Packages',
                            'Hajj Packages',
                            'Flight Booking',
                            'Visa Assistance',
                            'Hotel Reservations',
                            'Airport Transfers',
                        ].map(label => (
                            <span key={label} style={{
                                ...linkStyle,
                                cursor: 'default',
                            }}>{label}</span>
                        ))}
                    </div>
                </div>

                {/* Column 4: Contact */}
                <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 20 }}>
                        Contact Us
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.68 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Phone</div>
                                <a href="tel:+92300000000" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>+92 300 000 0000</a>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                            </svg>
                            <div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Email</div>
                                <a href="mailto:info@saer.pk" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>info@saer.pk</a>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Office</div>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: 13, lineHeight: 1.6 }}>Karachi, Pakistan</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp button */}
                    <button
                        onClick={() => window.open('https://wa.me/92300000000', '_blank')}
                        style={{
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            border: 'none', borderRadius: 10,
                            color: '#fff', padding: '12px 20px', marginTop: 24,
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontFamily: 'inherit', width: '100%', justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.345 0-4.513-.795-6.24-2.13l-.436-.348-3.13 1.049 1.049-3.13-.348-.436A9.946 9.946 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                        </svg>
                        Chat on WhatsApp
                    </button>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                padding: '20px 40px',
                maxWidth: 1200, margin: '0 auto',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 12,
            }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                    {new Date().getFullYear()} Saer.pk — All rights reserved.
                </p>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Privacy Policy', 'Terms of Service'].map(t => (
                        <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500, cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                        >{t}</span>
                    ))}
                </div>
            </div>

            {/* Background decorative gradient */}
            <div style={{
                position: 'absolute', bottom: -200, right: -100,
                width: 400, height: 400,
                background: 'var(--primary)',
                filter: 'blur(200px)', opacity: 0.04,
                borderRadius: '50%', pointerEvents: 'none',
            }} />
        </footer>
    );
}
