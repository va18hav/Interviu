import React from 'react';
import LogoImg from '../assets/images/logo.png';

const VERDICT_CONFIG = {
    'strong hire': { color: '#059669', bg: '#ecfdf5', label: 'STRONG HIRE' },
    'hire': { color: '#10b981', bg: '#f0fdf4', label: 'HIRE' },
    'lean hire': { color: '#6366f1', bg: '#f5f3ff', label: 'LEAN HIRE' },
    'lean no hire': { color: '#f59e0b', bg: '#fffbeb', label: 'LEAN NO HIRE' },
    'no hire': { color: '#ef4444', bg: '#fef2f2', label: 'NO HIRE' },
    'strong no hire': { color: '#dc2626', bg: '#fef2f2', label: 'STRONG NO HIRE' },
};

const getVerdictConfig = (signal = '') => {
    const key = signal.toLowerCase().trim();
    return VERDICT_CONFIG[key] || { color: '#6366f1', bg: '#f5f3ff', label: signal.toUpperCase() };
};

const ROUND_NAMES = {
    coding: 'Coding Interview',
    debug: 'Debugging Interview',
    design: 'System Design Interview',
    behavioral: 'Behavioral Interview',
    technical: 'Technical Interview'
};

const getRoundLabel = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('coding')) return ROUND_NAMES.coding;
    if (t.includes('debug')) return ROUND_NAMES.debug;
    if (t.includes('design')) return ROUND_NAMES.design;
    if (t.includes('behavioral')) return ROUND_NAMES.behavioral;
    return ROUND_NAMES.technical;
};

const ShareCard = React.forwardRef(({ reportData, metaData, candidateName }, ref) => {
    const verdict = getVerdictConfig(reportData?.verdict?.signal);
    const roundLabel = getRoundLabel(metaData?.type);
    const confidence = reportData?.verdict?.confidence ?? '—';
    const level = reportData?.verdict?.level ?? '—';
    const risk = reportData?.verdict?.risk ?? '—';
    const summary = reportData?.verdict?.summary || '';

    const cardStyle = {
        width: '800px',
        height: '450px',
        background: '#ffffff',
        borderRadius: '32px',
        padding: '32px',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9',
    };

    return (
        <div ref={ref} style={cardStyle}>
            {/* Header Content */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                        {candidateName || 'Candidate'}
                    </h1>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {metaData?.company && (
                            <span style={{ fontSize: '10px', fontWeight: '800', color: '#6366f1', background: '#eef2ff', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                {metaData.company}
                            </span>
                        )}
                        <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', background: '#f8fafc', padding: '4px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                            {roundLabel}
                        </span>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px 0' }}>
                        {metaData?.title || 'Technical Interview Simulation'}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '11px', fontWeight: '600' }}>
                        <span>📅 {metaData?.date || ''}</span>
                        <span>⏱️ {metaData?.duration || '45'}M</span>
                    </div>
                </div>

                {/* Right Verdict Panel */}
                <div style={{
                    width: '240px',
                    background: '#f8fafc',
                    borderRadius: '24px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #f1f5f9'
                }}>
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Recommendation</span>
                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: verdict.color, textAlign: 'center', lineHeight: '1', margin: '0 0 8px 0' }}>
                        {verdict.label}
                    </h2>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>Hiring Signal Output</span>
                    <div style={{ width: '40px', height: '3px', background: '#6366f1', borderRadius: '2px', marginTop: '16px' }} />
                </div>
            </div>

            {/* Summary Box */}
            <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '20px',
                border: '1px solid #f1f5f9',
                fontStyle: 'italic',
                color: '#475569',
                fontSize: '11px',
                lineHeight: '1.6'
            }}>
                "{summary.length > 200 ? summary.substring(0, 200) + '...' : summary}"
            </div>

            {/* Metrics Footer */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Confidence</span>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>{confidence}/10</span>
                </div>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Level Calibration</span>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>{level}</span>
                </div>
                <div style={{ flex: 1, background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Risk Assessment</span>
                    <span style={{ fontSize: '15px', fontWeight: '900', color: risk === 'High' ? '#ef4444' : '#f59e0b' }}>{risk}</span>
                </div>

                {/* Branding */}
                <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '12px' }}>
                    <img src={LogoImg} style={{ height: '42px', marginBottom: '4px' }} alt="Interviu" />
                    <span style={{ fontSize: '8px', fontWeight: '800', color: '#6366f1', letterSpacing: '0.1em' }}>Interviu.pro</span>
                </div>
            </div>
        </div>
    );
});

ShareCard.displayName = 'ShareCard';
export default ShareCard;
