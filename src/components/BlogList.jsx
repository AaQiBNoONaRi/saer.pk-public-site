import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const API = 'http://127.0.0.1:8000/api/blogs/public';

export default function BlogList({ onReadArticle }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredCard, setHoveredCard] = useState(null);

    const getExcerpt = (blog) => {
        let textContent = '';
        if (blog.content) {
            const tmp = document.createElement('div');
            tmp.innerHTML = blog.content;
            textContent = tmp.textContent || tmp.innerText || '';
        } else if (blog.blocks && blog.blocks.length > 0) {
            const pBlock = blog.blocks.find(b => b.type === 'paragraph');
            if (pBlock && pBlock.content.text) {
                textContent = pBlock.content.text;
            }
        }

        if (!textContent) return 'Read more to explore this article from SAER...';
        return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent;
    };

    const getCoverImage = (blog) => {
        if (blog.thumbnail_image_url) return blog.thumbnail_image_url;
        if (blog.blocks && blog.blocks.length > 0) {
            const imgBlock = blog.blocks.find(b => b.type === 'image');
            if (imgBlock && imgBlock.content.url) return imgBlock.content.url;
        }
        return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    useEffect(() => {
        fetch(`${API}/list`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load blogs');
                return res.json();
            })
            .then(data => {
                setBlogs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load articles at this time.');
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div style={{ maxWidth: 1000, margin: '60px auto', padding: '0 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 16, animation: 'pulse 2s infinite' }}>📝</div>
            <h2 style={{ fontWeight: 600 }}>Loading articles...</h2>
        </div>
    );

    if (error) return (
        <div style={{ maxWidth: 1000, margin: '60px auto', padding: '0 24px', textAlign: 'center', color: '#e11d48' }}>
            <h2 style={{ fontWeight: 700 }}>{error}</h2>
        </div>
    );

    return (
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 24px' }}>
            <div style={{ marginBottom: 60, textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
                    Stories & Insights
                </div>
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#0f172a', marginBottom: 16, letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                    Explore The World <br /><span style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>With SAER</span>
                </h1>
                <p style={{ fontSize: 18, color: '#64748b', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                    Discover travel guides, destination tips, and the latest news tailored for your next incredible journey.
                </p>
            </div>

            {blogs.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center', background: '#f8fafc', borderRadius: 32, border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
                    <h3 style={{ fontSize: 24, margin: '0 0 12px', color: '#475569', fontWeight: 800 }}>No articles yet.</h3>
                    <p style={{ color: '#94a3b8', fontSize: 16 }}>Stay tuned for our upcoming content.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 32 }}>
                    {blogs.map((blog) => {
                        const isHovered = hoveredCard === blog._id;
                        return (
                            <div
                                key={blog._id}
                                onMouseEnter={() => setHoveredCard(blog._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => onReadArticle(blog.slug)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fff',
                                    borderRadius: 24,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    boxShadow: isHovered ? '0 20px 40px rgba(15, 23, 42, 0.08)' : '0 4px 12px rgba(15, 23, 42, 0.03)',
                                    transform: isHovered ? 'translateY(-8px)' : 'none',
                                    border: '1px solid #f1f5f9',
                                    height: '100%'
                                }}
                            >
                                {/* Image Wrapper */}
                                <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: '#f1f5f9' }}>
                                    <img
                                        src={getCoverImage(blog)}
                                        alt={blog.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.7s ease',
                                            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                                        }}
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80' }}
                                    />
                                    {blog.category && (
                                        <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                            {blog.category}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} color="#3b82f6" /> {formatDate(blog.published_at || blog.created_at)}</span>
                                        {blog.author && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} color="#3b82f6" /> {blog.author}</span>}
                                    </div>

                                    <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {blog.title}
                                    </h3>

                                    <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6, margin: '0 0 24px', flex: 1 }}>
                                        {getExcerpt(blog)}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: isHovered ? '#2563eb' : '#3b82f6', transition: 'color 0.2s' }}>
                                        Read Article <ArrowRight size={16} style={{ transition: 'transform 0.3s', transform: isHovered ? 'translateX(4px)' : 'none' }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Global Keyframes for pulse */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
            `}} />
        </div>
    );
}
