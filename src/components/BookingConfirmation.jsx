import React, { useRef } from 'react';
import { jsPDF } from 'jspdf';

function fmt(n) { return Number(n || 0).toLocaleString(); }

export default function BookingConfirmation({ result, flight, searchParams, onNewSearch }) {
    const confirmed = result?.pnr || result?.bookingRefId || result?.status === 'HK';
    const pnr = result?.pnr || '—';
    const ref = result?.bookingRefId || '—';
    const locator = result?.airlineLocator || '—';
    const status = result?.status || 'HK';
    const passengers = result?.passengers || [];

    // Extract fare: prefer validated fare from result, then rawData fare
    const validatedFare = result?.validatedData?.validatedFare || null;
    const rawFare = result?.flight?.rawData?.fare || flight?.rawData?.fare || {};
    const fare = validatedFare || rawFare;
    const currency = fare?.currency || 'PKR';
    const total = fare?.total || 0;
    const baseFare = fare?.baseFare || fare?.base || 0;
    const taxAmount = fare?.tax || fare?.taxAmount || 0;

    // Extract the actual flight object (may be nested inside result if passed via onComplete)
    const flightObj = result?.flight || flight;

    // Extract from nested segments structure: segments[0].flights[0] = first leg
    const segments = flightObj?.segments || [];
    const firstLeg = segments[0]?.flights?.[0] || {};
    const lastSeg = segments[segments.length - 1];
    const lastLeg = lastSeg?.flights?.[lastSeg.flights?.length - 1] || {};

    const depAirport = firstLeg.departureLocation || flightObj?.rawData?.ondPairs?.[0]?.flightDetails?.[0]?.flifo?.location?.depAirport || '—';
    const arrAirport = lastLeg.arrivalLocation || flightObj?.rawData?.ondPairs?.[0]?.flightDetails?.slice(-1)[0]?.flifo?.location?.arrAirport || '—';
    const depDate = firstLeg.departureDate || '—';
    const depTime = firstLeg.departureTime || '';
    const arrDate = lastLeg.arrivalDate || '';
    const arrTime = lastLeg.arrivalTime || '';
    const airline = flightObj?.supplierSpecific?.issuingAirline || result?.airlineCode || firstLeg.airlineCode || '—';
    const cabinClass = flightObj?.supplierSpecific?.cabin === 'Y' ? 'Economy'
        : flightObj?.supplierSpecific?.cabin === 'C' ? 'Business'
            : flightObj?.supplierSpecific?.cabin === 'F' ? 'First'
                : flightObj?.supplierSpecific?.cabin || 'Economy';
    const stops = segments.reduce((sum, seg) => sum + (seg.flights?.length || 1) - 1, 0);

    const generatePDF = () => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(20, 27, 33);
        doc.rect(0, 0, W, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('SAER.PK — Flight Booking Confirmation', W / 2, 13, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleString()}`, W / 2, 21, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        let y = 38;

        // Booking Reference Box
        doc.setFillColor(235, 244, 255);
        doc.roundedRect(10, y, W - 20, 28, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('Booking Reference', 15, y + 9);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`PNR: ${pnr}`, 15, y + 17);
        doc.text(`Booking ID: ${ref}`, 15, y + 23);
        doc.text(`Airline Locator: ${locator}`, W / 2, y + 17);
        doc.text(`Status: ${status}`, W / 2, y + 23);
        y += 36;

        // Flight Details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setFillColor(20, 126, 251);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, y, W - 20, 8, 'F');
        doc.text('  FLIGHT DETAILS', 10, y + 6);
        doc.setTextColor(0, 0, 0);
        y += 12;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const flightDetails = [
            [`Route: ${depAirport} → ${arrAirport}`, `Airline: ${airline}`],
            [`Departure: ${depDate} ${depTime}`, `Arrival: ${arrDate} ${arrTime}`],
            [`Cabin: ${cabinClass}`, `Stops: ${stops === 0 ? 'Non-stop' : stops}`],
        ];
        flightDetails.forEach(([left, right]) => {
            doc.text(left, 15, y);
            doc.text(right, W / 2 + 5, y);
            y += 7;
        });
        y += 4;

        // Passengers
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setFillColor(20, 27, 33);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, y, W - 20, 8, 'F');
        doc.text('  PASSENGER INFORMATION', 10, y + 6);
        doc.setTextColor(0, 0, 0);
        y += 12;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        passengers.forEach((pax, i) => {
            const name = `${pax.salutation || ''} ${pax.givenName || ''} ${pax.surName || ''}`.trim();
            doc.setFont('helvetica', 'bold');
            doc.text(`${i + 1}. ${name} (${pax.paxType || 'ADT'})`, 15, y);
            doc.setFont('helvetica', 'normal');
            y += 6;
            const paxInfo = [
                `Passport: ${pax.docID || '—'}`,
                `Nationality: ${pax.nationality || '—'}`,
                `DOB: ${pax.birthDate || '—'}`,
                `Expiry: ${pax.expiryDate || '—'}`,
            ].join('   ');
            doc.text(paxInfo, 15, y);
            y += 8;
            if (pax.email || pax.phone) {
                doc.setTextColor(100, 100, 100);
                doc.text(`Contact: ${pax.email || ''} | ${pax.phone || ''}`, 15, y);
                doc.setTextColor(0, 0, 0);
                y += 8;
            }
            if (y > 260) { doc.addPage(); y = 20; }
        });
        y += 4;

        // Fare Summary
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setFillColor(16, 185, 129);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, y, W - 20, 8, 'F');
        doc.text('  FARE SUMMARY', 10, y + 6);
        doc.setTextColor(0, 0, 0);
        y += 12;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const fareLines = [
            [`Base Fare:`, `${currency} ${fmt(baseFare)}`],
            [`Taxes & Fees:`, `${currency} ${fmt(taxAmount)}`],
        ];
        fareLines.forEach(([label, val]) => {
            doc.text(label, 15, y);
            doc.text(val, W - 15, y, { align: 'right' });
            y += 6;
        });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('TOTAL:', 15, y + 2);
        doc.setTextColor(20, 126, 251);
        doc.text(`${currency} ${fmt(total)}`, W - 15, y + 2, { align: 'right' });
        y += 10;

        // Footer
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('This is an automatically generated booking confirmation. Please retain this document.', W / 2, 282, { align: 'center' });
        doc.text('For support: support@saer.pk | +92 300 000 0000', W / 2, 287, { align: 'center' });

        doc.save(`SAER-Booking-${pnr || ref}.pdf`);
    };

    return (
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
            {/* Success Banner */}
            <div className="slide-up" style={{
                background: confirmed
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: 20, padding: '32px 28px', textAlign: 'center',
                color: '#fff', marginBottom: 24, boxShadow: confirmed ? '0 8px 32px rgba(16,185,129,0.35)' : '0 8px 32px rgba(245,158,11,0.35)',
            }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>{confirmed ? '🎉' : '⏳'}</div>
                <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, marginBottom: 8 }}>
                    {confirmed ? 'Booking Confirmed!' : 'Booking Submitted'}
                </h1>
                <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                    {confirmed ? 'Your flight is booked. Check your email for full itinerary.' : 'Processing your booking. You will receive confirmation shortly.'}
                </p>
            </div>

            {/* Booking Reference Card */}
            <div className="card-lg animate-in" style={{ padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>📋 Booking Reference</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
                    {[
                        { label: 'PNR', value: pnr, highlight: true },
                        { label: 'Booking ID', value: ref },
                        { label: 'Airline Locator', value: locator },
                        { label: 'Status', value: status, badge: true },
                    ].map(({ label, value, highlight, badge }) => (
                        <div key={label} style={{ padding: '14px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                            <div style={{
                                fontSize: highlight ? 22 : 15, fontWeight: 900,
                                color: highlight ? 'var(--primary)' : 'var(--text)',
                                letterSpacing: highlight ? 2 : 0,
                                fontFamily: highlight ? 'monospace' : 'inherit',
                            }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flight Summary */}
            <div className="card-lg animate-in" style={{ padding: 24, marginBottom: 20 }}>
                <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>✈ Flight Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                        ['Route', `${depAirport} → ${arrAirport}`],
                        ['Airline', airline],
                        ['Departure', `${depDate} ${depTime}`.trim() || '—'],
                        ['Arrival', `${arrDate} ${arrTime}`.trim() || '—'],
                        ['Cabin', cabinClass],
                        ['Total Fare', `${currency} ${fmt(total)}`],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Passengers */}
            {passengers.length > 0 && (
                <div className="card-lg animate-in" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>👤 Passengers</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {passengers.map((p, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid var(--border)' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>{i + 1}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: 14 }}>{p.salutation} {p.givenName} {p.surName}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.paxType === 'ADT' ? 'Adult' : p.paxType === 'CHD' ? 'Child' : 'Infant'} · Passport: {p.docID || '—'}</div>
                                </div>
                                {p.email && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.email}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={generatePDF} className="btn btn-primary" style={{ flex: 1, padding: '16px', fontSize: 15, fontWeight: 800 }}>
                    💾 Save Booking PDF
                </button>
                <button onClick={onNewSearch} className="btn btn-outline" style={{ flex: 1, padding: '16px', fontSize: 15, fontWeight: 700 }}>
                    ✈ Search Another Flight
                </button>
            </div>

            <div style={{ marginTop: 24, padding: '14px 18px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', fontSize: 12, color: '#1e40af' }}>
                💡 <strong>Next steps:</strong> Check your email for booking confirmation. The airline will send your e-ticket within 2–4 hours. For assistance, call +92 300 000 0000 or email support@saer.pk
            </div>
        </div>
    );
}
