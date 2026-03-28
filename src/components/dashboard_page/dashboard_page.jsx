import { useState, useEffect } from 'react';
import './dashboard_page.css';
import { useNavigate } from 'react-router-dom';
import ModelResult from '../yolo_model/ModelResult';        // ← add
import { predictImage } from '../yolo_model/predictApi';
import ClassifyResult from '../cls_model/Classifyresult';
import { classifyImage } from '../cls_model/clspredictApi';
import {
    saveYoloHistory,
    saveClassifyHistory,
    fetchHistory,
    fetchHistoryDetail,
    deleteHistoryRecord

}
    from '../../services/historyService';

const DB_BASE = 'http://localhost:5000';

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('analyze');
    const [teaGrade, setTeaGrade] = useState('');

    const [rawTeaImage, setRawTeaImage] = useState(null);
    const [rawTeaFile, setRawTeaFile] = useState(null);     // ← add new
    const [result, setResult] = useState(null);     // ← add new
    const [loading, setLoading] = useState(false);    // ← add new
    const [error, setError] = useState(null);

    const [madeTeaImage, setMadeTeaImage] = useState(null);
    const [madeTeaFile, setMadeTeaFile] = useState(null);
    const [clsResult, setClsResult] = useState(null);
    const [clsLoading, setClsLoading] = useState(false);
    const [clsError, setClsError] = useState(null);

    // ── Auth state ────────────────────────────────────────────────────────
    const [currentUser, setCurrentUser] = useState(null);

    // ── History state ─────────────────────────────────────────────────────
    const [historyList, setHistoryList] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);


    const [priceResult, setPriceResult] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [priceError, setPriceError] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('teaUser');
        if (stored) {
            try { setCurrentUser(JSON.parse(stored)); }
            catch { localStorage.removeItem('teaUser'); }
        }
    }, []);

    // ── Load history when History tab is opened ───────────────────────────
    useEffect(() => {
        if (activeTab === 'history' && currentUser) {
            loadHistory();
        }
    }, [activeTab, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadHistory = async () => {
        setHistoryLoading(true);
        try {
            const records = await fetchHistory(currentUser.id);
            setHistoryList(records);
        } catch (err) {
            console.error('Failed to load history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('teaUser');
        navigate('/');
    };

    const handleRawTeaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRawTeaImage(URL.createObjectURL(file));
            setRawTeaFile(file);    // ← add: save the File for the API call
            setResult(null);        // ← add: clear old result when new image picked
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!rawTeaFile) {
            alert('Please upload a raw tea image first.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await predictImage(rawTeaFile);
            setResult(data);

            if (currentUser) {
                saveYoloHistory(currentUser.id, rawTeaImage, data)
                    .catch(err => console.warn('History save failed:', err));
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setRawTeaImage(null);
        setRawTeaFile(null);
        setMadeTeaImage(null);
    };

    const handleMadeTeaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMadeTeaImage(URL.createObjectURL(file));
            setMadeTeaFile(file);
            setClsResult(null);   // clear old result when new image picked
            setClsError(null);
        }
    };

    const handleClassify = async () => {
        if (!madeTeaFile) { alert('Please upload a made tea image first.'); return; }
        setClsLoading(true);
        setClsError(null);
        setClsResult(null);
        try {
            const data = await classifyImage(madeTeaFile);
            setClsResult(data);

            if (currentUser) {
                saveClassifyHistory(currentUser.id, madeTeaImage, data)
                    .catch(err => console.warn('History save failed:', err));
            }

        } catch (err) {
            setClsError(err.message);
        } finally {
            setClsLoading(false);
        }
    };

    const handleClsReset = () => {
        setClsResult(null);
        setClsError(null);
        setMadeTeaImage(null);
        setMadeTeaFile(null);
    };

    // ── History: open detail modal ────────────────────────────────────────
    const handleViewDetail = async (record) => {
        setDetailLoading(true);
        setSelectedRecord(null);
        try {
            const full = await fetchHistoryDetail(record._id);
            setSelectedRecord(full);
        } catch (err) {
            console.error('Failed to load detail:', err);
        } finally {
            setDetailLoading(false);
        }
    };

    // ── History: delete record ────────────────────────────────────────────
    const handleDeleteRecord = async (e, recordId) => {
        e.stopPropagation(); // don't open modal
        if (!window.confirm('Delete this history record?')) return;
        setDeletingId(recordId);
        try {
            await deleteHistoryRecord(recordId);
            setHistoryList(prev => prev.filter(r => r._id !== recordId));
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setDeletingId(null);
        }
    };

    // ── Price handlers ────────────────────────────────────────────────────
    const handleCheckPrice = async () => {
        if (!teaGrade.trim()) { setPriceError('Please enter a tea grade.'); return; }
        setPriceLoading(true); setPriceError(null); setPriceResult(null);
        try {
            const response = await fetch(`${DB_BASE}/api/price/predictp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grade: teaGrade.trim() }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to get price');
            if (!data.valid) throw new Error(`"${teaGrade.toUpperCase()}" is not a recognised Ceylon tea grade.`);
            setPriceResult(data);
        } catch (err) {
            setPriceError(err.message);
        } finally {
            setPriceLoading(false);
        }
    };

    const handlePriceReset = () => {
        setPriceResult(null); setPriceError(null); setTeaGrade('');
    };

    const getTrendIcon = (t) => t === 'Rising' ? '↑' : t === 'Declining' ? '↓' : '→';
    const getTrendColor = (t) => t === 'Rising' ? '#78ffd6' : t === 'Declining' ? '#ff6b6b' : '#fdcb6e';
    const getDemandColor = (d) => d === 'High' ? '#78ffd6' : d === 'Low' ? '#ff6b6b' : '#fdcb6e';



    return (
        <div className="dash-container">
            <div className="dash-background-overlay"></div>

            {/* ── Sidebar ── */}
            <div className="dash-sidebar">
                <div className="dash-sidebar-header">
                    <h2 className="dash-brand">Tea Grade Classifier</h2>

                    {currentUser && (
                        <div className="dash-user-info">
                            <div className="dash-user-avatar">
                                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="dash-user-details">
                                <span className="dash-user-name">{currentUser.name}</span>
                                <span className="dash-user-username">@{currentUser.username}</span>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="dash-nav">
                    <button
                        className={`dash-nav-item ${activeTab === 'analyze' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analyze')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                                stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Analyze Tea</span>
                    </button>

                    <button
                        className={`dash-nav-item ${activeTab === 'price' ? 'active' : ''}`}
                        onClick={() => setActiveTab('price')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Auction Price</span>
                    </button>

                    <button
                        className={`dash-nav-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                                stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>History</span>
                        {historyList.length > 0 && (
                            <span className="dash-nav-badge">{historyList.length}</span>
                        )}
                    </button>
                </nav>

                <div className="dash-sidebar-footer">
                    <button className="dash-logout" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                                stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* ── Main ── */}
            <div className="dash-main">
                <div className="dash-content">

                    {/* ══════════════════════════════════════════════════
                        ANALYZE TAB
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'analyze' && (
                        <div className="dash-tab-content">
                            <div className="dash-page-header">
                                <h1 className="dash-page-title">Analyze Tea Grade</h1>
                                <p className="dash-page-subtitle">
                                    Upload tea images for AI-powered grading analysis
                                </p>
                            </div>

                            {!result && !clsResult && !loading && !clsLoading && (
                                <div className="dash-upload-container">

                                    {/* Card 1 — Raw Tea → YOLO */}
                                    <div className="dash-upload-card">
                                        <div className="dash-card-header">
                                            <div className="dash-card-icon">
                                                <svg viewBox="0 0 24 24" width="24" height="24">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                                        stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3>Raw Tea Leaf</h3>
                                                <p>Upload image of raw tea leaves</p>
                                            </div>
                                        </div>

                                        <div className="dash-upload-area">
                                            {rawTeaImage ? (
                                                <div className="dash-preview">
                                                    <img src={rawTeaImage} alt="Raw tea" />
                                                    <button
                                                        className="dash-remove"
                                                        onClick={() => {
                                                            setRawTeaImage(null); setRawTeaFile(null);
                                                            setResult(null); setError(null);
                                                        }}
                                                    >
                                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="dash-upload-label">
                                                    <input type="file" accept="image/*" onChange={handleRawTeaUpload} className="dash-file-input" />
                                                    <div className="dash-upload-icon">
                                                        <svg viewBox="0 0 24 24" width="48" height="48">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                                                stroke="currentColor" strokeWidth="2" fill="none" />
                                                        </svg>
                                                    </div>
                                                    <p className="dash-upload-text">Click to upload or drag and drop</p>
                                                    <span className="dash-upload-hint">PNG, JPG up to 10MB</span>
                                                </label>
                                            )}
                                        </div>

                                        <button
                                            className="dash-card-analyze-btn"
                                            onClick={handleAnalyze}
                                            disabled={!rawTeaFile || loading}
                                        >
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                            <span>{loading ? 'Analyzing...' : 'Analyze Raw Tea'}</span>
                                        </button>
                                    </div>

                                    {/* Card 2 — Made Tea → Classification */}
                                    <div className="dash-upload-card">
                                        <div className="dash-card-header">
                                            <div className="dash-card-icon">
                                                <svg viewBox="0 0 24 24" width="24" height="24">
                                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"
                                                        stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3>Made Tea</h3>
                                                <p>Upload image of processed/dried tea</p>
                                            </div>
                                        </div>

                                        <div className="dash-upload-area">
                                            {madeTeaImage ? (
                                                <div className="dash-preview">
                                                    <img src={madeTeaImage} alt="Made tea" />
                                                    <button
                                                        className="dash-remove"
                                                        onClick={() => {
                                                            setMadeTeaImage(null); setMadeTeaFile(null);
                                                            setClsResult(null); setClsError(null);
                                                        }}
                                                    >
                                                        <svg viewBox="0 0 24 24" width="20" height="20">
                                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="dash-upload-label">
                                                    <input type="file" accept="image/*" onChange={handleMadeTeaUpload} className="dash-file-input" />
                                                    <div className="dash-upload-icon">
                                                        <svg viewBox="0 0 24 24" width="48" height="48">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                                                stroke="currentColor" strokeWidth="2" fill="none" />
                                                        </svg>
                                                    </div>
                                                    <p className="dash-upload-text">Click to upload or drag and drop</p>
                                                    <span className="dash-upload-hint">PNG, JPG up to 10MB</span>
                                                </label>
                                            )}
                                        </div>

                                        {clsError && <p className="dash-cls-error">{clsError}</p>}

                                        <button
                                            className="dash-card-analyze-btn"
                                            onClick={handleClassify}
                                            disabled={!madeTeaFile || clsLoading}
                                        >
                                            <svg viewBox="0 0 24 24" width="20" height="20">
                                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                            <span>{clsLoading ? 'Classifying...' : 'Classify Made Tea'}</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <ModelResult result={result} loading={loading} error={error} onReset={handleReset} />

                            {clsResult && (
                                <div className="dash-cls-result-wrap">
                                    <ClassifyResult result={clsResult} onReset={handleClsReset} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════
                        PRICE TAB
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'price' && (
                        <div className="dash-tab-content">
                            <div className="dash-page-header">
                                <h1 className="dash-page-title">Auction Price Prediction</h1>
                                <p className="dash-page-subtitle">
                                    AI-powered Ceylon tea auction price estimates based on Colombo market data
                                </p>
                            </div>

                            <div className="dash-price-container">
                                <div className="dash-price-card">

                                    {/* Input row */}
                                    <div className="dash-price-input-section">
                                        <label>Enter Tea Grade</label>
                                        <div className="dash-input-group">
                                            <input
                                                type="text"
                                                value={teaGrade}
                                                onChange={(e) => setTeaGrade(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCheckPrice()}
                                                placeholder="e.g., BOPF, OP1, PEKOE, FBOP"
                                                className="dash-price-input"
                                                disabled={priceLoading}
                                            />
                                            <button
                                                className="dash-price-btn"
                                                onClick={handleCheckPrice}
                                                disabled={priceLoading}
                                            >
                                                {priceLoading ? (
                                                    <>
                                                        <div className="dash-price-spinner" />
                                                        Predicting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                                            <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                                                stroke="currentColor" strokeWidth="2" fill="none" />
                                                        </svg>
                                                        Predict Price
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Quick-select grade chips */}
                                        <div className="dash-grade-chips">
                                            {['BOPF', 'OP1', 'PEKOE', 'FBOP', 'BOP', 'OPA', 'FNGS', 'BT'].map(g => (
                                                <button
                                                    key={g}
                                                    className={`dash-grade-chip ${teaGrade.toUpperCase() === g ? 'active' : ''}`}
                                                    onClick={() => setTeaGrade(g)}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {priceError && (
                                        <div className="dash-price-error">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="#ff6b6b" strokeWidth="2" />
                                                <path d="M12 8v4M12 16h.01" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            {priceError}
                                        </div>
                                    )}

                                    {/* Loading skeleton */}
                                    {priceLoading && (
                                        <div className="dash-price-skeleton">
                                            <div className="dash-price-divider" />
                                            <div className="dash-skeleton-row dash-skeleton-wide" />
                                            <div className="dash-skeleton-row dash-skeleton-medium" />
                                            <div className="dash-skeleton-row dash-skeleton-wide" />
                                            <div className="dash-skeleton-row dash-skeleton-narrow" />
                                        </div>
                                    )}

                                    {/* ── Results ── */}
                                    {priceResult && !priceLoading && (
                                        <>
                                            <div className="dash-price-divider" />

                                            {/* Grade name + badges */}
                                            <div className="dash-price-result-header">
                                                <div>
                                                    <div className="dash-price-grade-name">{priceResult.grade}</div>
                                                    <div className="dash-price-grade-info">{priceResult.grade_info}</div>
                                                </div>
                                                <div className="dash-price-badges">
                                                    <span className="dash-price-badge" style={{ color: getTrendColor(priceResult.price_trend) }}>
                                                        {getTrendIcon(priceResult.price_trend)} {priceResult.price_trend}
                                                    </span>
                                                    <span className="dash-price-badge" style={{ color: getDemandColor(priceResult.demand_level) }}>
                                                        ◆ {priceResult.demand_level} Demand
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Main price block */}
                                            <div className="dash-price-main">
                                                <div className="dash-price-lkr">
                                                    <span className="dash-price-currency">LKR</span>
                                                    <span className="dash-price-amount">
                                                        {priceResult.price_range.min.toLocaleString()}
                                                        <span className="dash-price-sep"> – </span>
                                                        {priceResult.price_range.max.toLocaleString()}
                                                    </span>
                                                    <span className="dash-price-unit">per kg</span>
                                                </div>
                                                <div className="dash-price-usd">
                                                    ≈ USD {priceResult.usd_equivalent.min.toFixed(2)} – {priceResult.usd_equivalent.max.toFixed(2)} / kg
                                                </div>
                                                <div className="dash-price-avg">
                                                    Average: <strong>LKR {priceResult.average_price.toLocaleString()}</strong> / kg
                                                </div>
                                            </div>

                                            {/* Market analysis */}
                                            <div className="dash-price-section">
                                                <div className="dash-price-section-title">
                                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                                                        <path d="M3 3v18h18M7 16l4-4 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Market Analysis
                                                </div>
                                                <p className="dash-price-section-text">{priceResult.market_analysis}</p>
                                            </div>

                                            {/* Recommendation */}
                                            <div className="dash-price-section dash-price-section--highlight">
                                                <div className="dash-price-section-title">
                                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                                                        <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Recommendation
                                                </div>
                                                <p className="dash-price-section-text">{priceResult.recommendation}</p>
                                            </div>

                                            {/* Last auction note */}
                                            <div className="dash-price-auction-note">
                                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                                                    <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                {priceResult.last_auction_note}
                                            </div>

                                            {/* Footer */}
                                            <div className="dash-price-footer">
                                                <span className="dash-price-disclaimer">
                                                    ⚠ AI estimates based on Colombo auction trends. Not financial advice.
                                                </span>
                                                <button className="dash-price-reset-btn" onClick={handlePriceReset}>
                                                    Check another grade
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* Empty state */}
                                    {!priceResult && !priceLoading && !priceError && (
                                        <>
                                            <div className="dash-price-divider" />
                                            <div className="dash-price-empty">
                                                <svg viewBox="0 0 24 24" width="52" height="52" fill="none">
                                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                                        stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <p>Enter a Ceylon tea grade above and click <strong>Predict Price</strong></p>
                                                <p className="dash-price-empty-sub">
                                                    Supports all standard grades: BOP, BOPF, OP, OP1, OPA, PEKOE, FBOP, BT, FNGS and more
                                                </p>
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════
                        HISTORY TAB
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'history' && (
                        <div className="dash-tab-content">
                            <div className="dash-page-header">
                                <h1 className="dash-page-title">Analysis History</h1>
                                <p className="dash-page-subtitle">View your past tea grading analyses</p>
                            </div>

                            {/* Detail modal */}
                            {(selectedRecord || detailLoading) && (
                                <div className="dash-history-modal-overlay" onClick={() => setSelectedRecord(null)}>
                                    <div className="dash-history-modal" onClick={e => e.stopPropagation()}>
                                        <button className="dash-history-modal-close" onClick={() => setSelectedRecord(null)}>✕</button>

                                        {detailLoading ? (
                                            <div className="dash-history-modal-loading">
                                                <div className="dash-history-spinner" />
                                                Loading details...
                                            </div>
                                        ) : selectedRecord && (
                                            <>
                                                <div className="dash-history-modal-header">
                                                    <span className="dash-history-modal-type-badge" data-type={selectedRecord.modelType}>
                                                        {selectedRecord.modelType === 'yolo' ? '🌿 Raw Tea Detection' : '🍵 Made Tea Classification'}
                                                    </span>
                                                    <span className="dash-history-modal-date">
                                                        {new Date(selectedRecord.createdAt).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="dash-history-modal-images">
                                                    <div className="dash-history-img-block">
                                                        <p className="dash-history-img-label">📷 Uploaded Image</p>
                                                        <img src={selectedRecord.uploadedImage} alt="uploaded" className="dash-history-modal-img" />
                                                    </div>
                                                    <div className="dash-history-img-block">
                                                        <p className="dash-history-img-label">🤖 Model Output</p>
                                                        <img src={selectedRecord.annotatedImage} alt="annotated" className="dash-history-modal-img" />
                                                    </div>
                                                </div>

                                                <div className="dash-history-modal-result">
                                                    <span className="dash-history-modal-grade">{selectedRecord.prediction}</span>
                                                    <span className="dash-history-modal-conf">{selectedRecord.confidence}% confidence</span>
                                                    {selectedRecord.extraData?.quality_tier && (
                                                        <span className="dash-history-modal-tier">{selectedRecord.extraData.quality_tier}</span>
                                                    )}
                                                </div>

                                                <div className="dash-history-modal-extra">
                                                    {selectedRecord.extraData?.top3 && (
                                                        <div className="dash-history-extra-block">
                                                            <p className="dash-history-extra-title">Top Predictions</p>
                                                            {selectedRecord.extraData.top3.map((item, i) => (
                                                                <div key={item.grade} className="dash-history-top3-row">
                                                                    <span className="dash-history-top3-rank">#{i + 1}</span>
                                                                    <span className="dash-history-top3-grade">{item.grade}</span>
                                                                    <div className="dash-history-top3-bar-wrap">
                                                                        <div className="dash-history-top3-bar" style={{ width: `${item.confidence}%` }} />
                                                                    </div>
                                                                    <span className="dash-history-top3-conf">{item.confidence}%</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {selectedRecord.extraData?.summary && (
                                                        <div className="dash-history-extra-block">
                                                            <p className="dash-history-extra-title">Detection Summary</p>
                                                            <div className="dash-history-summary-grid">
                                                                <div className="dash-history-summary-item">
                                                                    <span>Total Shoots</span>
                                                                    <strong>{selectedRecord.extraData.summary.total_shoots}</strong>
                                                                </div>
                                                                <div className="dash-history-summary-item">
                                                                    <span>Pluckable</span>
                                                                    <strong className="dash-summary-green">{selectedRecord.extraData.summary.pluckable_count}</strong>
                                                                </div>
                                                                <div className="dash-history-summary-item">
                                                                    <span>Skip</span>
                                                                    <strong className="dash-summary-amber">{selectedRecord.extraData.summary.skip_count}</strong>
                                                                </div>
                                                            </div>
                                                            {selectedRecord.extraData.summary.recommendation && (
                                                                <p className="dash-history-recommendation">
                                                                    {selectedRecord.extraData.summary.recommendation}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {selectedRecord.extraData?.brew_notes && (
                                                        <p className="dash-history-brew-notes">
                                                            ☕ {selectedRecord.extraData.brew_notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="dash-history-container">
                                {!currentUser ? (
                                    <div className="dash-empty-state">
                                        <svg viewBox="0 0 24 24" width="80" height="80">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                                                stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                        <h3>Not Logged In</h3>
                                        <p>Please log in to view your analysis history.</p>
                                        <button className="dash-empty-action" onClick={() => navigate('/login')}>Go to Login</button>
                                    </div>

                                ) : historyLoading ? (
                                    <div className="dash-history-loading-state">
                                        <div className="dash-history-spinner" />
                                        <span>Loading your history...</span>
                                    </div>

                                ) : historyList.length === 0 ? (
                                    <div className="dash-empty-state">
                                        <svg viewBox="0 0 24 24" width="80" height="80">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                                                stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                        <h3>No History Yet</h3>
                                        <p>Your analysis history will appear here once you start analyzing tea samples</p>
                                        <button className="dash-empty-action" onClick={() => setActiveTab('analyze')}>Start Analyzing</button>
                                    </div>

                                ) : (
                                    <>
                                        <div className="dash-history-toolbar">
                                            <span className="dash-history-count">
                                                {historyList.length} record{historyList.length !== 1 ? 's' : ''}
                                            </span>
                                            <button className="dash-history-refresh-btn" onClick={loadHistory}>
                                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                                                    <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Refresh
                                            </button>
                                        </div>

                                        <div className="dash-history-grid">
                                            {historyList.map(record => (
                                                <div key={record._id} className="dash-history-card" onClick={() => handleViewDetail(record)}>
                                                    <div className="dash-history-card-top">
                                                        <span className="dash-history-card-badge" data-type={record.modelType}>
                                                            {record.modelType === 'yolo' ? '🌿 Raw Tea' : '🍵 Made Tea'}
                                                        </span>
                                                        <button
                                                            className="dash-history-card-delete"
                                                            onClick={(e) => handleDeleteRecord(e, record._id)}
                                                            disabled={deletingId === record._id}
                                                            title="Delete record"
                                                        >
                                                            {deletingId === record._id ? '...' : (
                                                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                                                                    <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2"
                                                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="dash-history-card-body">
                                                        <span className="dash-history-card-grade">{record.prediction}</span>
                                                        <span className="dash-history-card-conf">{record.confidence}%</span>
                                                    </div>

                                                    {record.extraData?.quality_tier && (
                                                        <span className="dash-history-card-tier">{record.extraData.quality_tier}</span>
                                                    )}

                                                    <div className="dash-history-card-date">
                                                        {new Date(record.createdAt).toLocaleString()}
                                                    </div>

                                                    <div className="dash-history-card-cta">View details →</div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>

    )
}
export default DashboardPage;
