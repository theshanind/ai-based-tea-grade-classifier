import { useState } from 'react';
import './dashboard_page.css';

const DashboardPage = () => {

    const [rawTeaImage, setRawTeaImage] = useState(null);
    const [madeTeaImage, setMadeTeaImage] = useState(null);

    const handleRawTeaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRawTeaImage(URL.createObjectURL(file));
        }
    };

    const handleMadeTeaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMadeTeaImage(URL.createObjectURL(file));
        }
    };

    const handleAnalyze = () => {
        console.log('Analyze button clicked');
        // Analysis logic will be implemented later
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-background-overlay"></div>

            <div className="dashboard-content-wrapper">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="dashboard-header-left">
                        <h1 className="dashboard-title">Tea Grade Classifier</h1>
                        <p className="dashboard-subtitle">AI-Powered Tea Quality Assessment</p>
                    </div>
                    <button className="dashboard-logout-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="dashboard-main">
                    {/* Upload Section */}
                    <div className="dashboard-upload-section">
                        <h2 className="dashboard-section-title">Upload Tea Images</h2>

                        <div className="dashboard-upload-grid">
                            {/* Raw Tea Leaf Upload */}
                            <div className="dashboard-upload-card">
                                <div className="dashboard-upload-header">
                                    <h3>Raw Tea Leaf</h3>
                                    <svg viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </div>

                                <div className="dashboard-upload-area">
                                    {rawTeaImage ? (
                                        <div className="dashboard-preview">
                                            <img src={rawTeaImage} alt="Raw Tea Preview" />
                                            <button
                                                className="dashboard-remove-btn"
                                                onClick={() => setRawTeaImage(null)}
                                            >
                                                <svg viewBox="0 0 24 24" width="16" height="16">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="dashboard-upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleRawTeaUpload}
                                                className="dashboard-file-input"
                                            />
                                            <div className="dashboard-upload-content">
                                                <svg viewBox="0 0 24 24" width="48" height="48">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                                <p>Click to upload</p>
                                                <span>PNG, JPG up to 10MB</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Made Tea Upload */}
                            <div className="dashboard-upload-card">
                                <div className="dashboard-upload-header">
                                    <h3>Made Tea</h3>
                                    <svg viewBox="0 0 64 64" width="24" height="24">
                                        <path d="M50 18h-4v-4c0-2.2-1.8-4-4-4H22c-2.2 0-4 1.8-4 4v4h-4c-2.2 0-4 1.8-4 4v28c0 6.6 5.4 12 12 12h20c6.6 0 12-5.4 12-12V22c0-2.2-1.8-4-4-4zM22 14h20v4H22v-4zm28 36c0 4.4-3.6 8-8 8H22c-4.4 0-8-3.6-8-8V22h36v28z" fill="currentColor" />
                                    </svg>
                                </div>

                                <div className="dashboard-upload-area">
                                    {madeTeaImage ? (
                                        <div className="dashboard-preview">
                                            <img src={madeTeaImage} alt="Made Tea Preview" />
                                            <button
                                                className="dashboard-remove-btn"
                                                onClick={() => setMadeTeaImage(null)}
                                            >
                                                <svg viewBox="0 0 24 24" width="16" height="16">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="dashboard-upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleMadeTeaUpload}
                                                className="dashboard-file-input"
                                            />
                                            <div className="dashboard-upload-content">
                                                <svg viewBox="0 0 24 24" width="48" height="48">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                                <p>Click to upload</p>
                                                <span>PNG, JPG up to 10MB</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Analyze Button */}
                        <div className="dashboard-analyze-section">
                            <button
                                className="dashboard-analyze-btn"
                                onClick={handleAnalyze}
                                disabled={!rawTeaImage || !madeTeaImage}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <span>Analyze Tea Grade</span>
                            </button>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="dashboard-history-section">
                        <div className="dashboard-history-header">
                            <h2 className="dashboard-section-title">Analysis History</h2>
                            <button className="dashboard-refresh-btn">
                                <svg viewBox="0 0 24 24" width="18" height="18">
                                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </button>
                        </div>

                        <div className="dashboard-history-content">
                            <div className="dashboard-empty-state">
                                <svg viewBox="0 0 24 24" width="64" height="64">
                                    <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                <h3>No Analysis Yet</h3>
                                <p>Upload tea images and click analyze to see your results here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}
export default DashboardPage;
