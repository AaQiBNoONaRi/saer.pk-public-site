import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function Navbar({ onLogoClick, onTrackBooking, onBlogClick, onPackagesClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navBg = scrolled
        ? 'rgba(15, 20, 25, 0.97)'
        : 'rgba(15, 20, 25, 0.85)';

    const navLinkStyle = {
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.72)',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: 8,
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        letterSpacing: '0.01em',
        position: 'relative',
    };

    const handleNav = (fn) => {
        setMobileOpen(false);
        fn();
    };

    return (
        <>
            <nav style={{
                background: navBg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                padding: '0 40px',
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.3s ease',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
            }}>
                {/* Logo */}
                <button
                    onClick={() => handleNav(onLogoClick)}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 12, padding: 0,
                    }}
                >
                    <div style={{
                        width: 100, height: 100,
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
                        <img src={logo} alt="Saer.pk" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>

                        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.8px', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>
                            Hajj & Umrah Services
                        </div>
                    </div>
                </button>

                {/* Desktop Navigation */}
                <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => handleNav(onLogoClick)} style={navLinkStyle}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'none'; }}
                    >Home</button>
                    <button onClick={() => handleNav(onPackagesClick)} style={navLinkStyle}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'none'; }}
                    >Packages</button>
                    <button onClick={() => handleNav(onBlogClick)} style={navLinkStyle}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'none'; }}
                    >Blog</button>
                    <button onClick={() => handleNav(onTrackBooking)} style={navLinkStyle}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'none'; }}
                    >Track Booking</button>

                    {/* Divider */}
                    <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.68 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <a href="tel:+92300000000" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                            +92 300 000 0000
                        </a>
                    </div>

                    {/* WhatsApp CTA */}
                    <button
                        onClick={() => window.open('https://wa.me/92300000000', '_blank')}
                        style={{
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            border: 'none', borderRadius: 999,
                            color: '#fff', padding: '9px 20px',
                            fontSize: 13, fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 7,
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.3)'; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.345 0-4.513-.795-6.24-2.13l-.436-.348-3.13 1.049 1.049-3.13-.348-.436A9.946 9.946 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                        </svg>
                        WhatsApp
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="show-mobile-only"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 8, color: '#fff', display: 'flex', alignItems: 'center',
                    }}
                >
                    {mobileOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div style={{
                    position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 20, 25, 0.97)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 999,
                    padding: '24px 32px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    animation: 'slideDown 0.2s ease',
                }}>
                    {[
                        { label: 'Home', action: onLogoClick },
                        { label: 'Packages', action: onPackagesClick },
                        { label: 'Blog', action: onBlogClick },
                        { label: 'Track Booking', action: onTrackBooking },
                    ].map(({ label, action }) => (
                        <button
                            key={label}
                            onClick={() => handleNav(action)}
                            style={{
                                background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
                                fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: '16px 0',
                                textAlign: 'left', fontFamily: 'inherit',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >{label}</button>
                    ))}
                    <div style={{ marginTop: 16 }}>
                        <a href="tel:+92300000000" style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                            marginBottom: 16,
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.68 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            +92 300 000 0000
                        </a>
                        <button
                            onClick={() => window.open('https://wa.me/92300000000', '_blank')}
                            style={{
                                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                border: 'none', borderRadius: 999, color: '#fff',
                                padding: '14px 28px', fontSize: 15, fontWeight: 700,
                                cursor: 'pointer', width: '100%', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.345 0-4.513-.795-6.24-2.13l-.436-.348-3.13 1.049 1.049-3.13-.348-.436A9.946 9.946 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                            </svg>
                            Chat on WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
