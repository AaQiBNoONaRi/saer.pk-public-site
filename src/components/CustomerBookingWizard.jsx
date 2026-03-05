// ─── CustomerBookingWizard ────────────────────────────────────────────────────
// 3-step public booking wizard: Details → Review → Payment Status
// Matches step structure used in agency/branch portals
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8000';
const PKR = (v) => `Rs. ${Number(v || 0).toLocaleString()}`;

const TITLES = ['MR', 'MRS', 'MS', 'MSTR', 'MISS'];
const ROOM_MIN_PAX = { sharing: 1, double: 2, triple: 3, quad: 4, quint: 5 };
const ROOM_TYPES = [
    { key: 'sharing', label: 'Sharing', min: 1 },
    { key: 'double', label: 'Double', min: 2 },
    { key: 'triple', label: 'Triple', min: 3 },
    { key: 'quad', label: 'Quad', min: 4 },
    { key: 'quint', label: 'Quint', min: 5 },
];
const COUNTRIES = [
    'Pakistan', 'Saudi Arabia', 'UAE', 'UK', 'USA', 'Canada',
    'Australia', 'Bangladesh', 'Malaysia', 'Turkey', 'Other',
];

const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 10,
    padding: '10px 14px', fontSize: 14, fontWeight: 600, color: '#1E293B',
    outline: 'none', background: '#fff', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 };
const errStyle = { color: '#EF4444', fontSize: 11, fontWeight: 700, marginTop: 4 };

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 16 }}>
            {label && <label style={labelStyle}>{label}</label>}
            {children}
            {error && <p style={errStyle}>{error}</p>}
        </div>
    );
}

function PaxCounter({ label, value, onChange, min = 0, max = Infinity, onExceed }) {
    const atMin = value <= min;
    const atMax = value >= max;
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button
                    onClick={() => { if (!atMin) onChange(Math.max(min, value - 1)); }}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #E2E8F0', background: atMin ? '#F1F5F9' : '#F8FAFF', cursor: atMin ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 900, color: atMin ? '#CBD5E1' : '#475569' }}
                >−</button>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#1E293B', minWidth: 20, textAlign: 'center' }}>{value}</span>
                <button
                    onClick={() => { if (atMax) { onExceed && onExceed(); } else { onChange(value + 1); } }}
                    style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${atMax ? '#E2E8F0' : '#147EFB'}`, background: atMax ? '#F1F5F9' : '#EFF6FF', cursor: 'pointer', fontSize: 16, fontWeight: 900, color: atMax ? '#CBD5E1' : '#147EFB' }}
                >+</button>
            </div>
        </div>
    );
}

function StepIndicator({ step, current }) {
    const done = current > step;
    const active = current === step;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 14,
                background: done ? '#22C55E' : active ? '#147EFB' : '#E2E8F0',
                color: (done || active) ? '#fff' : '#94A3B8',
                boxShadow: active ? '0 4px 12px rgba(20,126,251,0.35)' : 'none',
                transition: 'all 0.2s'
            }}>
                {done ? '✓' : step}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: active ? '#147EFB' : done ? '#22C55E' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {step === 1 ? 'Details' : step === 2 ? 'Review' : 'Payment Status'}
            </span>
        </div>
    );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function CustomerBookingWizard({ pkg, onBack, onDone }) {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [createdBooking, setCreatedBooking] = useState(null);

    // Step 1 state
    const [contact, setContact] = useState({ name: '', phone: '', email: '' });
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [roomType, setRoomType] = useState('sharing');

    // Step 2 state — dynamically built from adults+children+infants
    const [passengers, setPassengers] = useState([]);

    // Step 3 state
    const [paymentMethod, setPaymentMethod] = useState('transfer');
    const [paymentForm, setPaymentForm] = useState({
        depositorName: '', accountNumber: '',
        bankName: '', accountTitle: '',
        slipFile: null,
    });
    const [pay3Errors, setPay3Errors] = useState({});
    const [paySubmitting, setPaySubmitting] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);
    const [paySubmitError, setPaySubmitError] = useState('');

    const totalPax = adults + children + infants;
    const roomMinPax = ROOM_MIN_PAX[roomType] || 1;
    const [paxToast, setPaxToast] = useState('');

    function showPaxToast(msg) {
        setPaxToast(msg);
        setTimeout(() => setPaxToast(''), 3000);
    }

    // When room type changes: just update the room type, reset to 1 adult
    function handleRoomTypeChange(key) {
        setRoomType(key);
        setAdults(1);
        setChildren(0);
        setInfants(0);
    }

    // Rebuild passengers array whenever pax count changes
    useEffect(() => {
        const paxList = [];
        for (let i = 0; i < adults; i++)   paxList.push(blankPax('adult', i + 1));
        for (let i = 0; i < children; i++) paxList.push(blankPax('child', i + 1));
        for (let i = 0; i < infants; i++)  paxList.push(blankPax('infant', i + 1));
        setPassengers(paxList);
    }, [adults, children, infants]);

    // Fetch bank accounts for payment step
    useEffect(() => {
        fetch(`${API}/api/customer-bookings/payment-info/banks`)
            .then(r => r.ok ? r.json() : [])
            .then(d => setBankAccounts(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);

    function blankPax(type, idx) {
        return { id: `${type}_${idx}`, type, title: 'MR', first_name: '', last_name: '', passport_no: '', passport_issue: '', passport_expiry: '', dob: '', country: 'Pakistan', passport_file: null, passport_path: '' };
    }

    // Calculate price
    const prices = pkg.package_prices || {};
    const priceForRoom = (() => {
        const val = prices[roomType];
        if (!val) return 0;
        return typeof val === 'number' ? val : (val.selling || 0);
    })();
    const totalAmount = priceForRoom * totalPax;

    // ── Validation ──────────────────────────────────────────────────────────
    function validateStep1() {
        const e = {};
        if (!contact.name.trim()) e.name = 'Name is required';
        if (!contact.phone.trim()) e.phone = 'Phone is required';
        if (totalPax < roomMinPax) e.pax = `${ROOM_TYPES.find(r => r.key === roomType)?.label} room requires at least ${roomMinPax} passenger${roomMinPax > 1 ? 's' : ''}`;
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function validateStep2() {
        const e = {};
        passengers.forEach((p, i) => {
            if (!p.first_name.trim()) e[`fn_${i}`] = 'Required';
            if (!p.last_name.trim()) e[`ln_${i}`] = 'Required';
            if (!p.passport_no.trim()) e[`pp_${i}`] = 'Required';
            if (!p.passport_expiry.trim()) e[`pe_${i}`] = 'Required';
        });
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function validateStep3() {
        const e = {};
        if (paymentMethod === 'transfer') {
            if (!paymentForm.depositorName.trim()) e.depositorName = 'Depositor name is required';
            if (!paymentForm.accountNumber.trim()) e.accountNumber = 'Account number is required';
            if (!paymentForm.slipFile) e.slipFile = 'Please upload a payment slip';
        } else if (paymentMethod === 'bank') {
            if (!paymentForm.bankName.trim()) e.bankName = 'Bank name is required';
            if (!paymentForm.accountTitle.trim()) e.accountTitle = 'Account title is required';
            if (!paymentForm.accountNumber.trim()) e.accountNumber = 'Account number is required';
            if (!paymentForm.slipFile) e.slipFile = 'Please upload a payment slip';
        }
        setPay3Errors(e);
        return Object.keys(e).length === 0;
    }

    async function handlePaymentSubmit() {
        if (!validateStep3()) return;
        setPaySubmitting(true);
        setPaySubmitError('');
        try {
            const fd = new FormData();
            fd.append('payment_method', paymentMethod);
            if (paymentMethod === 'transfer') {
                fd.append('depositor_name', paymentForm.depositorName);
                fd.append('account_number', paymentForm.accountNumber);
            } else {
                fd.append('bank_name', paymentForm.bankName);
                fd.append('account_title', paymentForm.accountTitle);
                fd.append('account_number', paymentForm.accountNumber);
            }
            if (paymentForm.slipFile) fd.append('slip_file', paymentForm.slipFile);

            const bookingId = createdBooking._id || createdBooking.id;
            const res = await fetch(`${API}/api/customer-bookings/${bookingId}/submit-payment`, {
                method: 'POST',
                body: fd,
            });
            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                setPaySubmitError(e.detail || 'Payment submission failed. Please try again.');
                return;
            }
            setPaySuccess(true);
        } catch {
            setPaySubmitError('Network error. Please try again.');
        } finally {
            setPaySubmitting(false);
        }
    }

    // ── Passport upload helper ───────────────────────────────────────────────
    async function uploadPassport(file) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API}/api/customer-bookings/upload-passport`, { method: 'POST', body: fd });
        if (res.ok) { const d = await res.json(); return d.path || ''; }
        return '';
    }

    // ── Submit Booking ──────────────────────────────────────────────────────
    async function handleSubmit() {
        if (!validateStep2()) return;
        setSubmitting(true);
        setErrors({});
        try {
            // Upload passports first
            const updatedPax = await Promise.all(passengers.map(async (p) => {
                let path = p.passport_path;
                if (p.passport_file && !path) {
                    path = await uploadPassport(p.passport_file);
                }
                return { ...p, passport_path: path };
            }));

            const payload = {
                package_id: pkg._id || pkg.id,
                package_details: pkg,
                contact_name: contact.name,
                contact_phone: contact.phone,
                contact_email: contact.email,
                adults,
                children,
                infants,
                room_type: roomType,
                total_passengers: totalPax,
                total_amount: totalAmount,
                payment_method: paymentMethod,
                payment_status: 'unpaid',
                passengers: updatedPax.map(p => ({
                    type: p.type,
                    title: p.title,
                    first_name: p.first_name,
                    last_name: p.last_name,
                    passport_no: p.passport_no,
                    passport_issue: p.passport_issue,
                    passport_expiry: p.passport_expiry,
                    dob: p.dob,
                    country: p.country,
                    passport_path: p.passport_path,
                })),
            };

            const res = await fetch(`${API}/api/customer-bookings/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const e = await res.json().catch(() => ({}));
                setErrors({ submit: e.detail || 'Booking failed. Please try again.' });
                return;
            }

            const data = await res.json();
            setCreatedBooking(data);
            setStep(3);
        } catch (e) {
            setErrors({ submit: 'Network error. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    }

    // ── Update a passenger field ─────────────────────────────────────────────
    function setPax(idx, field, val) {
        setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
    }

    const commonCardStyle = {
        background: '#fff', borderRadius: 20, padding: '32px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9',
        maxWidth: 680, margin: '0 auto',
    };

    return (
        <div style={{ background: '#F8F9FE', minHeight: '100vh', paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)', padding: '40px 24px 56px' }}>
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                        ← Back
                    </button>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 6px 0' }}>Booking</p>
                    <h1 style={{ color: '#fff', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, margin: '0 0 24px 0', lineHeight: 1.2 }}>{pkg.title}</h1>

                    {/* Step Bar */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                        <StepIndicator step={1} current={step} />
                        <div style={{ flex: 1, height: 2, background: step > 1 ? '#22C55E' : '#334155', marginTop: 17, transition: 'background 0.3s' }} />
                        <StepIndicator step={2} current={step} />
                        <div style={{ flex: 1, height: 2, background: step > 2 ? '#22C55E' : '#334155', marginTop: 17, transition: 'background 0.3s' }} />
                        <StepIndicator step={3} current={step} />
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 680, margin: '-24px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>

                {/* ─── STEP 1: DETAILS ─── */}
                {step === 1 && (
                    <div style={commonCardStyle}>
                        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1E293B', margin: '0 0 4px 0' }}>Booking Details</h2>
                        <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, margin: '0 0 24px 0' }}>{pkg.title}</p>

                        <Field label="Full Name *" error={errors.name}>
                            <input style={inputStyle} value={contact.name} onChange={e => setContact(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Muhammad Ali" />
                        </Field>
                        <Field label="Phone Number *" error={errors.phone}>
                            <input style={inputStyle} value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} placeholder="+92 3XX XXXXXXX" />
                        </Field>
                        <Field label="Email Address">
                            <input style={inputStyle} value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} placeholder="optional@email.com" />
                        </Field>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 20, marginTop: 8 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px 0' }}>Passengers</h3>
                            <PaxCounter
                                label="Adults"
                                value={adults}
                                onChange={setAdults}
                                min={1}
                                max={roomMinPax - children - infants}
                                onExceed={() => showPaxToast(`Room is full — ${ROOM_TYPES.find(r => r.key === roomType)?.label} fits ${roomMinPax} pax max`)}
                            />
                            <PaxCounter
                                label="Children (2–11 yrs)"
                                value={children}
                                onChange={setChildren}
                                min={0}
                                max={roomMinPax - adults - infants}
                                onExceed={() => showPaxToast(`Room is full — ${ROOM_TYPES.find(r => r.key === roomType)?.label} fits ${roomMinPax} pax max`)}
                            />
                            <PaxCounter
                                label="Infants (under 2)"
                                value={infants}
                                onChange={setInfants}
                                min={0}
                                max={roomMinPax - adults - children}
                                onExceed={() => showPaxToast(`Room is full — ${ROOM_TYPES.find(r => r.key === roomType)?.label} fits ${roomMinPax} pax max`)}
                            />
                            {/* Bed fill indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, marginBottom: 4 }}>
                                {Array.from({ length: roomMinPax }).map((_, i) => (
                                    <div key={i} style={{
                                        width: 10, height: 10, borderRadius: '50%',
                                        background: i < totalPax ? '#22C55E' : '#E2E8F0',
                                        transition: 'background 0.2s'
                                    }} />
                                ))}
                                <span style={{ fontSize: 11, fontWeight: 700, color: totalPax >= roomMinPax ? '#16A34A' : '#94A3B8', marginLeft: 4 }}>
                                    {totalPax}/{roomMinPax} bed{roomMinPax !== 1 ? 's' : ''} filled
                                </span>
                            </div>
                            {/* Toast error */}
                            {paxToast && (
                                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 15 }}>⚠️</span>
                                    <span style={{ color: '#DC2626', fontSize: 12, fontWeight: 700 }}>{paxToast}</span>
                                </div>
                            )}
                            {errors.pax && <p style={errStyle}>{errors.pax}</p>}
                        </div>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 20, marginTop: 8 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px 0' }}>Room Type</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {ROOM_TYPES.map(r => {
                                    const val = pkg.package_prices?.[r.key];
                                    const price = val ? (typeof val === 'number' ? val : val.selling) : null;
                                    const active = roomType === r.key;
                                    return (
                                        <button key={r.key} onClick={() => handleRoomTypeChange(r.key)} style={{
                                            padding: '10px 16px', borderRadius: 12, border: `2px solid ${active ? '#147EFB' : '#E2E8F0'}`,
                                            background: active ? '#EFF6FF' : '#fff', cursor: 'pointer',
                                            textAlign: 'center', minWidth: 86, fontFamily: 'inherit',
                                        }}>
                                            <p style={{ color: active ? '#1D4ED8' : '#475569', fontWeight: 800, fontSize: 13, margin: '0 0 2px 0' }}>{r.label}</p>
                                            <p style={{ color: active ? '#60A5FA' : '#CBD5E1', fontSize: 10, fontWeight: 800, margin: '0 0 2px 0' }}>{r.min} pax min</p>
                                            {price ? <p style={{ color: active ? '#147EFB' : '#94A3B8', fontSize: 11, fontWeight: 700, margin: 0 }}>{PKR(price)}</p> : <p style={{ color: '#D1D5DB', fontSize: 11, margin: 0 }}>—</p>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price summary */}
                        {totalAmount > 0 && (
                            <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 14, padding: '14px 18px', marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{totalPax} Pax × {PKR(priceForRoom)}</span>
                                <span style={{ fontSize: 17, fontWeight: 900, color: '#1D4ED8' }}>{PKR(totalAmount)}</span>
                            </div>
                        )}

                        <button onClick={() => { if (validateStep1()) setStep(2); }} style={primaryBtn}>
                            Continue to Review →
                        </button>
                    </div>
                )}

                {/* ─── STEP 2: REVIEW (Passenger Info + Price) ─── */}
                {step === 2 && (
                    <div style={commonCardStyle}>
                        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1E293B', margin: '0 0 4px 0' }}>Review Passengers</h2>
                        <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, margin: '0 0 24px 0' }}>Fill in passport details for each traveller</p>

                        {passengers.map((p, i) => (
                            <div key={p.id} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: i < passengers.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                    <span style={{
                                        background: p.type === 'adult' ? '#EFF6FF' : p.type === 'child' ? '#FEF9C3' : '#FEF2F2',
                                        color: p.type === 'adult' ? '#1D4ED8' : p.type === 'child' ? '#92400E' : '#991B1B',
                                        fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px',
                                        padding: '4px 10px', borderRadius: 8,
                                    }}>
                                        {p.type} #{i + 1}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <Field label="Title">
                                        <select style={inputStyle} value={p.title} onChange={e => setPax(i, 'title', e.target.value)}>
                                            {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="First Name *" error={errors[`fn_${i}`]}>
                                        <input style={inputStyle} value={p.first_name} onChange={e => setPax(i, 'first_name', e.target.value)} placeholder="First name" />
                                    </Field>
                                    <Field label="Last Name *" error={errors[`ln_${i}`]}>
                                        <input style={inputStyle} value={p.last_name} onChange={e => setPax(i, 'last_name', e.target.value)} placeholder="Last name" />
                                    </Field>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                    <Field label="Passport No *" error={errors[`pp_${i}`]}>
                                        <input style={inputStyle} value={p.passport_no} onChange={e => setPax(i, 'passport_no', e.target.value)} placeholder="AX1234567" />
                                    </Field>
                                    <Field label="Date of Birth">
                                        <input style={inputStyle} type="date" value={p.dob} onChange={e => setPax(i, 'dob', e.target.value)} />
                                    </Field>
                                    <Field label="Passport Issue Date">
                                        <input style={inputStyle} type="date" value={p.passport_issue} onChange={e => setPax(i, 'passport_issue', e.target.value)} />
                                    </Field>
                                    <Field label="Passport Expiry *" error={errors[`pe_${i}`]}>
                                        <input style={inputStyle} type="date" value={p.passport_expiry} onChange={e => setPax(i, 'passport_expiry', e.target.value)} />
                                    </Field>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <Field label="Country">
                                        <select style={inputStyle} value={p.country} onChange={e => setPax(i, 'country', e.target.value)}>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Passport Image">
                                        <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', background: '#F8FAFF' }}>
                                            <input type="file" accept="image/*" style={{ display: 'none' }} id={`passport_${i}`}
                                                onChange={e => { const f = e.target.files?.[0]; if (f) setPax(i, 'passport_file', f); }} />
                                            <label htmlFor={`passport_${i}`} style={{ cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748B' }}>
                                                {p.passport_file ? `✓ ${p.passport_file.name}` : 'Upload passport image'}
                                            </label>
                                        </div>
                                    </Field>
                                </div>
                            </div>
                        ))}

                        {/* Price breakdown strip above buttons */}
                        {totalAmount > 0 && (
                            <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 14, padding: '14px 18px', marginTop: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                                    {ROOM_TYPES.find(r => r.key === roomType)?.label} •{' '}
                                    {adults > 0 && `${adults} adult${adults > 1 ? 's' : ''}`}
                                    {children > 0 && `, ${children} child`}
                                    {infants > 0 && `, ${infants} infant`}
                                </span>
                                <span style={{ fontSize: 18, fontWeight: 900, color: '#1D4ED8' }}>{PKR(totalAmount)}</span>
                            </div>
                        )}

                        {errors.submit && (
                            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 12, padding: '12px 16px', marginBottom: 8 }}>
                                <p style={{ color: '#DC2626', fontSize: 13, fontWeight: 700, margin: 0 }}>{errors.submit}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <button onClick={() => setStep(1)} style={secondaryBtn}>← Back</button>
                            <button onClick={handleSubmit} disabled={submitting} style={{ ...primaryBtn, flex: 1, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                                {submitting ? '⏳ Creating Booking…' : 'Confirm Booking →'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── STEP 3: PAYMENT ─── */}
                {step === 3 && createdBooking && (
                    <div>
                        {/* Success header */}
                        <div style={{ ...commonCardStyle, background: 'linear-gradient(135deg, #064E3B, #065F46)', border: 'none', textAlign: 'center', padding: '40px 32px', marginBottom: 16 }}>
                            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
                            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 8px 0' }}>Booking Submitted!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, margin: '0 0 24px 0' }}>Your request is received. Now complete your payment below.</p>
                            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '14px 24px', display: 'inline-block' }}>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 4px 0' }}>Booking Reference</p>
                                <p style={{ color: '#fff', fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '2px' }}>{createdBooking.booking_reference}</p>
                            </div>
                        </div>

                        {/* Status badges */}
                        <div style={{ ...commonCardStyle, marginBottom: 16 }}>
                            <h3 style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.2px', margin: '0 0 16px 0' }}>Booking Status</h3>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                                <div style={{ flex: 1, minWidth: 140, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: '12px 16px' }}>
                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px 0' }}>Order Status</p>
                                    <p style={{ fontSize: 14, fontWeight: 900, color: '#D97706', margin: 0 }}>Under Process</p>
                                </div>
                                <div style={{ flex: 1, minWidth: 140, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: '12px 16px' }}>
                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px 0' }}>Payment Status</p>
                                    <p style={{ fontSize: 14, fontWeight: 900, color: '#EF4444', margin: 0 }}>Unpaid</p>
                                </div>
                                <div style={{ flex: 1, minWidth: 140, background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 14, padding: '12px 16px' }}>
                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#5B21B6', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px 0' }}>Contact</p>
                                    <p style={{ fontSize: 13, fontWeight: 900, color: '#7C3AED', margin: 0 }}>{contact.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div style={commonCardStyle}>
                            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1E293B', margin: '0 0 18px 0' }}>How to Pay</h3>

                            {/* Method tabs */}
                            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                                {[['transfer', '🏦 Transfer'], ['bank', '🏛️ Bank']].map(([k, l]) => (
                                    <button key={k} onClick={() => { setPaymentMethod(k); setPay3Errors({}); }}
                                        style={{
                                            flex: 1, padding: '12px 0', borderRadius: 12,
                                            border: `2px solid ${paymentMethod === k ? '#147EFB' : '#E2E8F0'}`,
                                            background: paymentMethod === k ? '#EFF6FF' : '#fff',
                                            color: paymentMethod === k ? '#1D4ED8' : '#64748B',
                                            fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit'
                                        }}>
                                        {l}
                                    </button>
                                ))}
                            </div>

                            {/* Transfer form */}
                            {paymentMethod === 'transfer' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <Field label="Depositor / Account Name *" error={pay3Errors.depositorName}>
                                        <input style={inputStyle}
                                            value={paymentForm.depositorName}
                                            onChange={e => setPaymentForm(f => ({ ...f, depositorName: e.target.value }))}
                                            placeholder="e.g. Muhammad Ali" />
                                    </Field>
                                    <Field label="Account Number *" error={pay3Errors.accountNumber}>
                                        <input style={inputStyle}
                                            value={paymentForm.accountNumber}
                                            onChange={e => setPaymentForm(f => ({ ...f, accountNumber: e.target.value }))}
                                            placeholder="e.g. 1234567890" />
                                    </Field>
                                    <Field label="Upload Payment Slip *" error={pay3Errors.slipFile}>
                                        <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: 10, padding: '12px 14px', background: '#F8FAFF' }}>
                                            <input type="file" accept="image/*,.pdf" id="pay_slip"
                                                style={{ display: 'none' }}
                                                onChange={e => { const f = e.target.files?.[0]; if (f) setPaymentForm(pf => ({ ...pf, slipFile: f })); }} />
                                            <label htmlFor="pay_slip" style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                📎 {paymentForm.slipFile ? `✓ ${paymentForm.slipFile.name}` : 'Choose slip image or PDF'}
                                            </label>
                                        </div>
                                    </Field>
                                </div>
                            )}

                            {/* Bank form */}
                            {paymentMethod === 'bank' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {/* ORG bank account — read-only send-to info */}
                                    {bankAccounts.length > 0 ? (
                                        <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', border: '1.5px solid #BFDBFE', borderRadius: 14, padding: '16px 18px' }}>
                                            <p style={{ fontSize: 10, fontWeight: 900, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>🏛️ Send Payment To This Account</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                                <div>
                                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#64748B', margin: '0 0 2px 0' }}>BANK NAME</p>
                                                    <p style={{ fontSize: 14, fontWeight: 900, color: '#1E293B', margin: 0 }}>{bankAccounts[0].bank_name || '—'}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#64748B', margin: '0 0 2px 0' }}>ACCOUNT TITLE</p>
                                                    <p style={{ fontSize: 14, fontWeight: 900, color: '#1E293B', margin: 0 }}>{bankAccounts[0].account_title || '—'}</p>
                                                </div>
                                                <div style={{ gridColumn: '1/-1' }}>
                                                    <p style={{ fontSize: 10, fontWeight: 800, color: '#64748B', margin: '0 0 2px 0' }}>ACCOUNT NUMBER</p>
                                                    <p style={{ fontSize: 16, fontWeight: 900, color: '#1D4ED8', margin: 0, letterSpacing: '1px' }}>{bankAccounts[0].account_number || '—'}</p>
                                                </div>
                                                {bankAccounts[0].iban && (
                                                    <div style={{ gridColumn: '1/-1' }}>
                                                        <p style={{ fontSize: 10, fontWeight: 800, color: '#64748B', margin: '0 0 2px 0' }}>IBAN</p>
                                                        <p style={{ fontSize: 13, fontWeight: 800, color: '#475569', margin: 0, letterSpacing: '0.5px' }}>{bankAccounts[0].iban}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 16px' }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: 0 }}>Loading bank details…</p>
                                        </div>
                                    )}

                                    <p style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '4px 0 0 0' }}>Your Transfer Details (Proof)</p>
                                    <Field label="Your Bank Name *" error={pay3Errors.bankName}>
                                        <input style={inputStyle}
                                            value={paymentForm.bankName}
                                            onChange={e => setPaymentForm(f => ({ ...f, bankName: e.target.value }))}
                                            placeholder="e.g. HBL / Meezan Bank" />
                                    </Field>
                                    <Field label="Your Account Title *" error={pay3Errors.accountTitle}>
                                        <input style={inputStyle}
                                            value={paymentForm.accountTitle}
                                            onChange={e => setPaymentForm(f => ({ ...f, accountTitle: e.target.value }))}
                                            placeholder="e.g. Muhammad Ali" />
                                    </Field>
                                    <Field label="Your Account Number *" error={pay3Errors.accountNumber}>
                                        <input style={inputStyle}
                                            value={paymentForm.accountNumber}
                                            onChange={e => setPaymentForm(f => ({ ...f, accountNumber: e.target.value }))}
                                            placeholder="e.g. 1234567890" />
                                    </Field>
                                    <Field label="Upload Payment Slip *" error={pay3Errors.slipFile}>
                                        <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: 10, padding: '12px 14px', background: '#F8FAFF' }}>
                                            <input type="file" accept="image/*,.pdf" id="pay_slip_bank"
                                                style={{ display: 'none' }}
                                                onChange={e => { const f = e.target.files?.[0]; if (f) setPaymentForm(pf => ({ ...pf, slipFile: f })); }} />
                                            <label htmlFor="pay_slip_bank" style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                📎 {paymentForm.slipFile ? `✓ ${paymentForm.slipFile.name}` : 'Choose slip image or PDF'}
                                            </label>
                                        </div>
                                    </Field>
                                </div>
                            )}

                            <div style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 16px', marginTop: 16 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', margin: 0 }}>📌 Always mention your booking reference <strong style={{ color: '#147EFB' }}>{createdBooking.booking_reference}</strong> when sending payment proof.</p>
                            </div>

                            {paySuccess ? (
                                <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 16, padding: '24px', marginTop: 16, textAlign: 'center' }}>
                                    <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                                    <p style={{ fontSize: 16, fontWeight: 900, color: '#15803D', margin: '0 0 6px 0' }}>Payment Submitted!</p>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#166534', margin: '0 0 16px 0' }}>Your payment details have been received. Our team will verify and confirm shortly.</p>
                                    <button onClick={() => window.location.reload()} style={{ ...primaryBtn, marginTop: 0 }}>Book Another Package</button>
                                </div>
                            ) : (
                                <>
                                    {paySubmitError && (
                                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginTop: 12 }}>
                                            <p style={{ color: '#DC2626', fontSize: 13, fontWeight: 700, margin: 0 }}>⚠️ {paySubmitError}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handlePaymentSubmit}
                                        disabled={paySubmitting}
                                        style={{ ...primaryBtn, marginTop: 16, opacity: paySubmitting ? 0.7 : 1, cursor: paySubmitting ? 'not-allowed' : 'pointer' }}
                                    >
                                        {paySubmitting ? '⏳ Submitting…' : '💳 Submit Payment'}
                                    </button>
                                    <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'center', marginTop: 10, fontSize: 12, fontWeight: 700, color: '#94A3B8', cursor: 'pointer' }}>
                                        Or book another package
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Small helpers ─────────────────────────────────────────────────────────

function Row({ label, value, green, orange }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: green ? '#16A34A' : orange ? '#EA580C' : '#94A3B8' }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: green ? '#15803D' : orange ? '#C2410C' : '#1E293B' }}>{value}</span>
        </div>
    );
}

const primaryBtn = {
    background: 'linear-gradient(135deg, #147EFB 0%, #0B5CCC 100%)',
    color: '#fff', border: 'none', borderRadius: 14, padding: '14px 24px',
    fontSize: 14, fontWeight: 900, cursor: 'pointer', width: '100%', marginTop: 12,
    boxShadow: '0 4px 16px rgba(20,126,251,0.3)', letterSpacing: '0.3px'
};
const secondaryBtn = {
    background: '#fff', color: '#64748B', border: '1.5px solid #E2E8F0',
    borderRadius: 14, padding: '14px 20px', fontSize: 14, fontWeight: 800,
    cursor: 'pointer', marginTop: 12, whiteSpace: 'nowrap'
};
