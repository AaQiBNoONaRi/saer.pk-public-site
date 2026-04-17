import React, { useState, useEffect } from 'react';
import { User, Calendar, Tag, ArrowLeft, Play, Image as ImageIcon, Share2, Twitter, Facebook, Link as LinkIcon, ChevronRight } from 'lucide-react';
import PublicForm from './PublicForm';

const API = 'http://127.0.0.1:8000/api/blogs/public';
const FORMS_API = 'http://127.0.0.1:8000/api/forms/public';

export default function BlogArticle({ slug, onBack }) {
    const [article, setArticle] = useState(null);
    const [linkedForms, setLinkedForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        fetch(`${API}/post/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Article not found');
                return res.json();
            })
            .then(data => {
                setArticle(data);
                // Fetch linked forms if there's an article ID
                if (data._id) {
                    const categoryParam = data.category ? `?category=${encodeURIComponent(data.category)}` : '';
                    fetch(`${FORMS_API}/getByBlog/${data._id}${categoryParam}`)
                        .then(res => res.ok ? res.json() : [])
                        .then(formsData => setLinkedForms(formsData))
                        .catch(err => console.error("Failed to fetch forms:", err));
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#94a3b8' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e2e8f0', marginBottom: 16, animation: 'pulse 1.5s infinite' }}></div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Loading article...</h2>
            <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }` }} />
        </div>
    );

    if (error) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ef4444', marginBottom: 24 }}>{error}</h2>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#0f172a', color: '#fff', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={18} /> Back to Blog
            </button>
        </div>
    );

    if (!article) return null;

    const bgImage = article.thumbnail_image_url || (article.blocks?.find(b => b.type === 'image')?.content?.url) || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80';

    let embedUrl = null;
    if (article.video_url) {
        if (article.video_url.includes('youtube.com/watch?v=')) {
            const videoId = article.video_url.split('v=')[1]?.split('&')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (article.video_url.includes('youtu.be/')) {
            const videoId = article.video_url.split('youtu.be/')[1]?.split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (article.video_url.includes('vimeo.com/')) {
            const videoId = article.video_url.split('vimeo.com/')[1]?.split('?')[0];
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
        } else {
            embedUrl = article.video_url;
        }
    }

    return (
        <div style={{ paddingBottom: 96, background: '#f8fafc', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            {article.custom_css && <style dangerouslySetInnerHTML={{ __html: article.custom_css }} />}

            {/* Breadcrumb Navigation atop Hero */}
            <div style={{ position: 'absolute', top: 24, left: 'max(5%, calc((100% - 1200px) / 2))', zIndex: 10, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 700, color: '#fff', opacity: 0.9 }}>
                <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontWeight: 700, opacity: 0.8, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.8}>
                    SAER Blog
                </button>
                <ChevronRight size={14} style={{ opacity: 0.5 }} />
                <span>{article.category || 'Article'}</span>
            </div>

            {/* Hero Section */}
            <div style={{
                position: 'relative',
                width: '100%',
                minHeight: '60vh',
                height: 550,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '40px 5%',
                color: '#fff',
                background: `linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.5) 40%, rgba(15,23,42,0.2) 100%), url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', zIndex: 10, paddingBottom: 60 }}>
                    {article.category && (
                        <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(37,99,235,0.9)', backdropFilter: 'blur(4px)', color: '#fff', borderRadius: 30, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                            {article.category}
                        </div>
                    )}

                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', maxWidth: 900, fontWeight: 900, margin: '0 0 32px', lineHeight: 1.1, letterSpacing: '-1.5px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                        {article.title}
                    </h1>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, fontSize: 16, fontWeight: 600, color: '#f1f5f9', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#fff" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, marginBottom: 2 }}>Written by</span>
                                <span>{article.author || 'SAER Team'}</span>
                            </div>
                        </div>
                        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.2)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={20} color="#fff" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, marginBottom: 2 }}>Published on</span>
                                <span>{new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div style={{ maxWidth: 1200, margin: '-60px auto 0', padding: '0 24px', position: 'relative', zIndex: 20 }}>
                <div className="article-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 40, alignItems: 'start' }}>

                    {/* Main Content Column */}
                    <div style={{ background: '#fff', borderRadius: 32, padding: 'clamp(32px, 5vw, 64px)', boxShadow: '0 20px 40px rgba(15,23,42,0.06)', border: '1px solid #f1f5f9' }}>

                        <div className="custom-blog-prose" dangerouslySetInnerHTML={{ __html: article.content }} />

                        {/* Fallback for Legacy Blocks */}
                        {!article.content && article.blocks && article.blocks.length > 0 && (
                            <div className="custom-blog-prose">
                                {article.blocks.map((block, idx) => {
                                    if (block.type === 'paragraph') return <p key={idx}>{block.content.text}</p>;
                                    if (block.type === 'heading') return React.createElement(`h${block.content.level || 2}`, { key: idx, style: { fontWeight: 800, margin: '40px 0 20px' } }, block.content.text);
                                    if (block.type === 'image') return <img key={idx} src={block.content.url} alt="Blog block" style={{ borderRadius: 16, width: '100%', margin: '40px 0', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />;
                                    return null;
                                })}
                            </div>
                        )}

                        {((article.gallery_images && article.gallery_images.length > 0) || embedUrl) && (
                            <hr style={{ margin: '60px 0', border: 'none', borderTop: '2px solid #f1f5f9' }} />
                        )}

                        {/* Video */}
                        {embedUrl && (
                            <div style={{ marginBottom: 60 }}>
                                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Play color="#2563eb" size={20} style={{ marginLeft: 2 }} />
                                    </div>
                                    Featured Video
                                </h3>
                                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,23,42,0.15)', background: '#0f172a' }}>
                                    <iframe
                                        src={embedUrl}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {article.gallery_images && article.gallery_images.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageIcon color="#2563eb" size={20} />
                                    </div>
                                    Image Gallery
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                    {article.gallery_images.map((imgUrl, idx) => (
                                        <a href={imgUrl} target="_blank" rel="noreferrer" key={idx} style={{ display: 'block', position: 'relative', paddingTop: '100%', borderRadius: 16, overflow: 'hidden', background: '#f1f5f9' }}>
                                            <img
                                                src={imgUrl}
                                                alt={`Gallery ${idx + 1}`}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* End of Blog Forms */}
                        {linkedForms.filter(f => f.position === 'End of Blog (Below Content)').map(form => (
                            <div key={form._id} style={{ marginTop: 40, paddingTop: 40, borderTop: '2px dashed #e2e8f0' }}>
                                <div style={{ marginBottom: 24 }}>
                                    <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{form.name}</h3>
                                </div>
                                <div style={{ background: '#f8fafc', padding: 32, borderRadius: 24, border: '1px solid #e2e8f0' }}>
                                    <PublicForm formSchema={form.schema} formId={form._id} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Column */}
                    <div className="article-sidebar" style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Sidebar (Top) Forms */}
                        {linkedForms.filter(f => f.position === 'Sidebar (Top)').map(form => (
                            <div key={form._id} style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(15,23,42,0.04)', border: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>{form.name}</h3>
                                <PublicForm formSchema={form.schema} formId={form._id} />
                            </div>
                        ))}

                        {/* Author Profile Card */}
                        <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 10px 30px rgba(15,23,42,0.04)', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#f8fafc', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <User size={40} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{article.author || 'SAER Team'}</h3>
                            <p style={{ fontSize: 14, color: '#64748b', margin: '0', lineHeight: 1.6 }}>Frequent contributor to the SAER blog, bringing you the latest updates and guides.</p>
                        </div>

                        {/* Tags / Topics Widget */}
                        {article.tags && article.tags.length > 0 && (
                            <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(15,23,42,0.04)', border: '1px solid #f1f5f9' }}>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    <Tag size={16} color="#64748b" /> Related Topics
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {article.tags.map(tag => (
                                        <span key={tag} style={{ padding: '6px 14px', background: '#f1f5f9', color: '#475569', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: '1px solid transparent' }}
                                            onMouseOver={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a'; }}
                                            onMouseOut={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#475569'; }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sidebar (Sticky) Forms */}
                        {linkedForms.filter(f => f.position === 'Sidebar (Sticky)').map(form => (
                            <div key={form._id} style={{ background: '#eff6ff', borderRadius: 24, padding: 24, border: '1px solid #bfdbfe' }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e3a8a', margin: '0 0 16px' }}>{form.name}</h3>
                                <PublicForm formSchema={form.schema} formId={form._id} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
                    .article-layout-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .article-sidebar {
                        position: static !important;
                    }
                }
                
                .custom-blog-prose {
                    color: #334155;
                    font-size: 19px;
                    line-height: 1.8;
                }
                .custom-blog-prose p {
                    margin-bottom: 2em;
                }
                .custom-blog-prose h2 {
                    font-size: 36px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 2em 0 1em;
                    line-height: 1.25;
                    letter-spacing: -0.5px;
                }
                .custom-blog-prose h3 {
                    font-size: 26px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 1.5em 0 1em;
                }
                .custom-blog-prose a {
                    color: #2563eb;
                    font-weight: 600;
                    text-decoration: none;
                    border-bottom: 2px solid rgba(37,99,235,0.3);
                    transition: all 0.2s;
                    padding-bottom: 2px;
                }
                .custom-blog-prose a:hover {
                    border-bottom-color: #2563eb;
                    background: rgba(37,99,235,0.05);
                }
                .custom-blog-prose img {
                    width: 100%;
                    height: auto;
                    border-radius: 24px;
                    margin: 3em 0;
                    box-shadow: 0 20px 40px rgba(15,23,42,0.1);
                    border: 1px solid #f1f5f9;
                }
                .custom-blog-prose ul, .custom-blog-prose ol {
                    padding-left: 1.5em;
                    margin-bottom: 2em;
                }
                .custom-blog-prose li {
                    margin-bottom: 0.75em;
                }
                .custom-blog-prose li::marker {
                    color: #3b82f6;
                    font-weight: bold;
                }
                .custom-blog-prose blockquote {
                    font-size: 20px;
                    font-style: italic;
                    font-weight: 600;
                    color: #0f172a;
                    padding: 2.5em 2.5em 2.5em 3.5em;
                    margin: 3em 0;
                    background: #f8fafc;
                    border-left: 8px solid #2563eb;
                    border-radius: 0 24px 24px 0;
                    position: relative;
                }
                .custom-blog-prose blockquote::before {
                    content: '"';
                    position: absolute;
                    top: -0.2em;
                    left: 0.2em;
                    font-size: 80px;
                    font-family: Georgia, serif;
                    color: rgba(37,99,235,0.15);
                    line-height: 1;
                }
                .custom-blog-prose pre {
                    background: #0f172a;
                    color: #f8fafc;
                    padding: 2em;
                    border-radius: 16px;
                    overflow-x: auto;
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 2em 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                }
                .custom-blog-prose strong {
                    color: #0f172a;
                    font-weight: 700;
                }
            `}} />
        </div>
    );
}
