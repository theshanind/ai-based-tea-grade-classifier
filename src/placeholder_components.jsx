import { Link } from "react-router-dom";
const PlaceholderPage = ({ pageName }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center'
        }}>
            <h1>{pageName} Page</h1>
            <p>This page is currently under development.</p>
            <Link to="/" style={{ marginTop: '20px', color: '#007bff' }}>
                ← Back to Home
            </Link>
        </div>
    );
};

export default PlaceholderPage;