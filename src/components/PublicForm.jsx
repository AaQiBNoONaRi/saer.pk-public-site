import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function PublicForm({ formSchema, formId, onSuccess }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

    // Form Schema Destructuring
    const { fields = [], buttons = [], notes = [], submitButton } = formSchema;

    const handleChange = (name, value, type) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = 'This field is required';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch(`http://localhost:8000/api/forms/public/${formId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    form_id: formId,
                    submitted_data: formData,
                    source_url: window.location.href
                })
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({}); // Clear form
                if (onSuccess) onSuccess();
            } else {
                setSubmitStatus('error');
            }
        } catch (err) {
            console.error("Form submission failed", err);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f0fdf4', borderRadius: 16, border: '1px solid #dcfce7' }}>
                <CheckCircle2 color="#16a34a" size={48} style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#166534', marginBottom: 8 }}>Success!</h3>
                <p style={{ color: '#15803d' }}>Your form has been successfully submitted. We will be in touch shortly.</p>
                <button
                    onClick={() => setSubmitStatus(null)}
                    style={{ marginTop: 24, padding: '10px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
                >
                    Submit another response
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {submitStatus === 'error' && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
                    Oops! Something went wrong while submitting the form. Please try again.
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {fields.map(field => (
                    <div key={field.name}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                            {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                                rows={4}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${errors[field.name] ? '#fca5a5' : '#cbd5e1'}`,
                                    background: '#f8fafc', fontSize: 15, color: '#0f172a', resize: 'vertical', outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = errors[field.name] ? '#fca5a5' : '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                            />
                        ) : (
                            <input
                                type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value, field.type)}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: 12, border: `1px solid ${errors[field.name] ? '#fca5a5' : '#cbd5e1'}`,
                                    background: '#f8fafc', fontSize: 15, color: '#0f172a', outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                                onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = errors[field.name] ? '#fca5a5' : '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                            />
                        )}

                        {errors[field.name] && (
                            <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, fontWeight: 500 }}>{errors[field.name]}</p>
                        )}
                    </div>
                ))}

                <div style={{ marginTop: 12 }}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: '100%', padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 8px 16px rgba(37,99,235,0.2)', transition: 'background 0.2s', opacity: isSubmitting ? 0.7 : 1
                        }}
                        onMouseOver={e => !isSubmitting && (e.currentTarget.style.background = '#1d4ed8')}
                        onMouseOut={e => !isSubmitting && (e.currentTarget.style.background = '#2563eb')}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
                        {submitButton?.text || buttons[0]?.label || 'Submit'}
                    </button>

                    {notes && notes.length > 0 && (
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {notes.map((note, idx) => (
                                <p key={idx} style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>
                                    {note.text}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
