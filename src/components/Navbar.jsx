import React from 'react';

export default function Navbar({ onLogoClick, onTrackBooking, onBlogClick }) {
    return (
        <nav style={{
            background: 'rgba(15, 52, 96, 0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
            <button
                onClick={onLogoClick}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#fff',
                }}
            >
                <div style={{
                    width: 38, height: 38,
                    background: 'linear-gradient(135deg, #e94f37, #ff6b4a)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(233,79,55,0.4)',
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4c-1 0-2 .5-3.5 2l-3.5 3.5-8.2-1.8-.8.8 7 3-2.3 2.3-2.5-.2-.7.7 2 2 2 2 .7-.7-.2-2.5 2.3-2.3 3 7z" />
                    </svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1.1 }}>SAER<span style={{ color: '#e94f37' }}>.PK</span></div>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Flight Booking</div>
                </div>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                    onClick={onBlogClick}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '8px 12px',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                >
                    📰 Blog
                </button>
                <button
                    onClick={onTrackBooking}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        color: '#fff',
                        padding: '7px 14px',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    🔍 Track Booking
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>24/7 Support:</span>
                    <a href="tel:+92300000000" style={{ color: '#90e0ef', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>+92 300 000 0000</a>
                </div>
            </div>
        </nav>
    );
}

