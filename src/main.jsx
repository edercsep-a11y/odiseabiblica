import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#050711',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            background: 'rgba(26, 5, 5, 0.9)',
            border: '2px solid #ef4444',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#f87171', textTransform: 'uppercase', marginBottom: '12px' }}>
              🛡️ RECUPERACIÓN TÁCTICA
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Se detectó un reinicio de datos en la sesión. Presiona el botón para volver al inicio sin perder tus progresos.
            </p>
            <button 
              onClick={() => {
                try {
                  localStorage.removeItem('odisea_student_auth_session');
                } catch(e) {}
                window.location.reload();
              }}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: '900',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '13px'
              }}>
              REINICIAR AL CAMPAMENTO BASE
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
