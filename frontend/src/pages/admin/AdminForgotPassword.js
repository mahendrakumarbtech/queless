import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminAuthWrapper } from './auth/AdminAuthWrapper';

const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    // TODO: integrate with backend forgot-password API when available
    setTimeout(() => {
      setMessage('If an account exists for this email, you will receive reset instructions.');
      setLoading(false);
    }, 800);
  };

  return (
    <AdminAuthWrapper>
      <h4 className="mb-2">Forgot Password? 🔒</h4>
      <p className="mb-4">Enter your email and we'll send you instructions to reset your password</p>

      {message && (
        <div className="alert alert-info py-2 mb-3" role="alert">
          {message}
        </div>
      )}

      <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoFocus
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary d-grid w-100"
          disabled={loading}
          aria-label="Send reset link"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center">
        <Link to="/admin/login" className="d-flex align-items-center justify-content-center">
          <i className="bi bi-chevron-left scaleX-n1-rtl bx-sm me-1"></i>
          Back to login
        </Link>
      </div>
    </AdminAuthWrapper>
  );
};

export default AdminForgotPassword;
