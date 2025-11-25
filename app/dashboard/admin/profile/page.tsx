// ...existing code...
'use client';

import React, { useEffect, useState } from 'react';

type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role?: string;
  status?: string;
};

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        if (data?.data) setUser(data.data);
        else setError(data?.message ?? 'Unable to load profile');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading profile…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!user) return <div>No profile data</div>;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Admin profile</h1>
      <form>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Email</label>
          <input type="text" value={user.email} readOnly style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12 }}>First name</label>
            <input type="text" value={user.firstName} readOnly style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12 }}>Last name</label>
            <input type="text" value={user.lastName} readOnly style={{ width: '100%' }} />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Full name</label>
          <input type="text" value={user.fullName} readOnly style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 12 }}>Status</label>
          <input type="text" value={user.status ?? ''} readOnly style={{ width: '100%' }} />
        </div>
      </form>
    </div>
  );
}
