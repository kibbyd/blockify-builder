"use client";
import React, { useState } from 'react';
import { signOut } from 'next-auth/react';

const PaymentWall = ({ subscription }) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  };

  const getMessage = () => {
    if (subscription.status === 'trial') {
      return 'Your free trial has ended.';
    }
    if (subscription.status === 'cancelled') {
      return 'Your subscription has been cancelled.';
    }
    if (subscription.status === 'expired') {
      return 'Your subscription has expired.';
    }
    return 'Subscribe to access the builder.';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{ marginTop: 0, color: '#333' }}>Blockify Builder</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>{getMessage()}</p>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#333', fontSize: '24px' }}>$39 / 30 days</h2>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Unlimited page creation</li>
            <li>Export to Liquid templates</li>
            <li>All components & layouts</li>
            <li>Responsive design tools</li>
            <li>Export/Import JSON</li>
            <li>Cloud-hosted for access anywhere</li>
          </ul>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '18px',
            fontWeight: '600',
            background: loading ? '#a0aec0' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
          }}
        >
          {loading ? 'Redirecting to checkout...' : 'Subscribe now'}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            background: 'transparent',
            color: '#999',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default PaymentWall;
