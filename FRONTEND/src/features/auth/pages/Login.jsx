import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../auth.form.scss";
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await handleLogin({ email, password });
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <main className="auth-page">
      <div className="form-container glass-panel">
        <div className="form-header">
          <span className="badge">Welcome back</span>
          <h1>Sign In</h1>
          <p className="subtitle">Enter your credentials to access your interview workspace</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="button primary-button" 
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              <span>Continue &rarr;</span>
            )}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;