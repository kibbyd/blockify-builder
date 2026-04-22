'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState({ loading: true, error: null, success: false });

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setState({ loading: false, error: 'Missing session ID', success: false });
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setState({ loading: false, error: null, success: true });
        } else {
          setState({ loading: false, error: data.error || 'Verification failed', success: false });
        }
      } catch {
        setState({ loading: false, error: 'Network error', success: false });
      }
    })();
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '48px 40px',
        maxWidth: '480px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
      }}>
        {state.loading && (
          <>
            <h1 style={{ marginTop: 0, color: '#333', fontSize: '22px' }}>Activating your license...</h1>
            <p style={{ color: '#666' }}>Verifying your payment with Stripe.</p>
          </>
        )}

        {!state.loading && state.success && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>✓</div>
            <h1 style={{ marginTop: 0, color: '#333', fontSize: '26px' }}>Thank you!</h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
              Your license has been updated. You have 30 days of full access.
            </p>
            <button
              onClick={() => router.push('/builder')}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Continue to Builder
            </button>
          </>
        )}

        {!state.loading && state.error && (
          <>
            <h1 style={{ marginTop: 0, color: '#e53e3e', fontSize: '22px' }}>Something went wrong</h1>
            <p style={{ color: '#666' }}>{state.error}</p>
            <button
              onClick={() => router.push('/builder')}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                fontSize: '15px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Back to Builder
            </button>
          </>
        )}
      </div>
    </div>
  );
}
