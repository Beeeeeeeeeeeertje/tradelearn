import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginPagina() {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [fout, setFout] = useState('');

  async function login() {
    try {
      await signInWithEmailAndPassword(auth, email, wachtwoord);
    } catch {
      setFout('❌ Email of wachtwoord is incorrect');
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d1117',
      }}
    >
      <div
        style={{
          background: 'rgba(22,27,34,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '40px',
          width: '360px',
        }}
      >
        <h1 style={{ color: '#f0b429', marginBottom: '8px', fontSize: '24px' }}>
          ⚡ TradeLearn
        </h1>
        <p style={{ color: '#7d8590', marginBottom: '28px' }}>
          Log in om verder te gaan
        </p>

        {fout && (
          <div
            style={{ color: '#f85149', marginBottom: '16px', fontSize: '14px' }}
          >
            {fout}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStijl}
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          style={inputStijl}
        />
        <button onClick={login} style={knopStijl}>
          Inloggen
        </button>
      </div>
    </div>
  );
}

const inputStijl: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  marginBottom: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#e6edf3',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
};

const knopStijl: React.CSSProperties = {
  width: '100%',
  padding: '13px',
  marginTop: '8px',
  background: 'linear-gradient(135deg, #f0b429, #e08e00)',
  border: 'none',
  borderRadius: '10px',
  color: '#000',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};
