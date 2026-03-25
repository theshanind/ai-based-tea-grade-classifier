import './Classifyresult.css';

const TIER_COLORS = {
    'Premium'            : '#78ffd6',
    'Above Standard+'    : '#a8edea',
    'Above Standard'     : '#74b9ff',
    'Standard Whole Leaf': '#a29bfe',
    'Standard+'          : '#b2bec3',
    'Standard'           : '#dfe6e9',
    'Economy'            : '#fdcb6e',
};

const CONFIDENCE_COLORS = {
    high  : { bg: 'rgba(120,255,214,0.15)', border: 'rgba(120,255,214,0.4)', text: '#78ffd6' },
    medium: { bg: 'rgba(253,203,110,0.15)', border: 'rgba(253,203,110,0.4)', text: '#fdcb6e' },
    low   : { bg: 'rgba(255,107,107,0.15)', border: 'rgba(255,107,107,0.4)', text: '#ff6b6b' },
};

const ClassifyResult = ({ result, onReset }) => {
    if (!result) return null;

    const tierColor = TIER_COLORS[result.quality_tier] || '#b2bec3';
    const confStyle = CONFIDENCE_COLORS[result.confidence_level] || CONFIDENCE_COLORS.medium;

    return (
        <div className="cls-result-wrapper">

            {/* ── Header bar ── */}
            <div className="cls-result-header">
                <div className="cls-result-grade-badge" style={{ borderColor: tierColor, color: tierColor }}>
                    {result.grade}
                </div>
                <div className="cls-result-title-block">
                    <h3 className="cls-result-full-name">{result.full_name}</h3>
                    <span className="cls-result-tier" style={{ color: tierColor }}>
                        {result.quality_tier}
                    </span>
                </div>
                <div
                    className="cls-confidence-pill"
                    style={{ background: confStyle.bg, border: `1px solid ${confStyle.border}`, color: confStyle.text }}
                >
                    {result.confidence}% {result.confidence_level}
                </div>
            </div>

            {/* ── Annotated image ── */}
            {result.annotated_image && (
                <div className="cls-result-image-wrap">
                    <img
                        src={result.annotated_image}
                        alt={`${result.grade} annotated`}
                        className="cls-result-image"
                    />
                    <div className="cls-result-image-label">Model output</div>
                </div>
            )}

            {/* ── Info cards ── */}
            <div className="cls-info-grid">

                <div className="cls-info-card">
                    <div className="cls-info-card-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"
                                fill="currentColor"/>
                        </svg>
                    </div>
                    <div className="cls-info-card-content">
                        <span className="cls-info-card-label">Plant part</span>
                        <span className="cls-info-card-value">{result.plant_part}</span>
                    </div>
                </div>

                <div className="cls-info-card">
                    <div className="cls-info-card-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 0 0 5 21C8 21 11 18 11 18c0 2-1 3-1 3s5-1 7-6c3 1 4 4 4 4 1-5-1-10-4-13z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="cls-info-card-content">
                        <span className="cls-info-card-label">Origin on plant</span>
                        <span className="cls-info-card-value">{result.origin}</span>
                    </div>
                </div>

                <div className="cls-info-card">
                    <div className="cls-info-card-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="cls-info-card-content">
                        <span className="cls-info-card-label">Description</span>
                        <span className="cls-info-card-value">{result.description}</span>
                    </div>
                </div>

                <div className="cls-info-card">
                    <div className="cls-info-card-icon">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="cls-info-card-content">
                        <span className="cls-info-card-label">Brew notes</span>
                        <span className="cls-info-card-value">{result.brew_notes}</span>
                    </div>
                </div>
            </div>

            {/* ── Top 3 alternatives ── */}
            <div className="cls-top3-section">
                <h4 className="cls-top3-title">Top predictions</h4>
                <div className="cls-top3-list">
                    {result.top3.map((item, idx) => (
                        <div key={item.grade} className={`cls-top3-item ${idx === 0 ? 'cls-top3-item--best' : ''}`}>
                            <div className="cls-top3-rank">#{idx + 1}</div>
                            <div className="cls-top3-info">
                                <span className="cls-top3-grade">{item.grade}</span>
                                <span className="cls-top3-tier"
                                    style={{ color: TIER_COLORS[item.quality_tier] || '#b2bec3' }}>
                                    {item.quality_tier}
                                </span>
                            </div>
                            <div className="cls-top3-bar-wrap">
                                <div
                                    className="cls-top3-bar"
                                    style={{
                                        width: `${item.confidence}%`,
                                        background: idx === 0 ? '#78ffd6' : 'rgba(255,255,255,0.2)',
                                    }}
                                />
                            </div>
                            <span className="cls-top3-conf">{item.confidence}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Inference info + reset ── */}
            <div className="cls-result-footer">
                <span className="cls-inference-time">
                    {result.inference_ms} ms  ·  {result.filename}
                </span>
                <button className="cls-reset-btn" onClick={onReset}>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                        <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Classify another
                </button>
            </div>
        </div>
    );
};

export default ClassifyResult;