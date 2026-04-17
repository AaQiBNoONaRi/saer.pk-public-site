import { useState, useEffect } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import PublicForm from './PublicForm';
import Navbar from './Navbar';

const API = 'http://127.0.0.1:8000/api/forms/public';

export default function StandaloneFormPage({ slug, onBack }) {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        // The URL pattern expects /forms/:slug, so autoUrl is `/forms/${slug}`
        fetch(`${API}/getByAutoUrl?autoUrl=/forms/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Form not found or is no longer active');
                return res.json();
            })
            .then(data => {
                setForm(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            <Navbar />

            <div style={{ padding: '80px 20px', maxWidth: 600, margin: '0 auto' }}>

                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: '#94a3b8' }}>
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Loading form...</h2>
                    </div>
                )}

                {error && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', textAlign: 'center' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                            <span style={{ fontSize: 24 }}>😕</span>
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Form Not Found</h2>
                        <p style={{ color: '#64748b', marginBottom: 32 }}>{error}</p>
                        <button onClick={onBack || (() => window.history.back())} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#0f172a', color: '#fff', borderRadius: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            <ArrowLeft size={18} /> Return Home
                        </button>
                    </div>
                )}

                {form && (
                    <div className="animate-in fade-in" style={{ animationDuration: '0.6s' }}>
                        <button
                            onClick={onBack || (() => window.history.back())}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#fff', color: '#475569', borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: 'pointer', border: '1px solid #e2e8f0', marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
                            onMouseOver={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                            onMouseOut={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                            <ArrowLeft size={16} /> Go Back
                        </button>

                        <div style={{ background: '#fff', borderRadius: 24, padding: '40px', boxShadow: '0 20px 40px rgba(15,23,42,0.06), 0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                                    {form.name}
                                </h1>
                                <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
                                    Please fill out the details below.
                                </p>
                            </div>

                            <PublicForm formSchema={form.schema} formId={form._id} />

                        </div>

                        <div style={{ textAlign: 'center', marginTop: 32, color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>
                            Powered by SAER Form Builder
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
