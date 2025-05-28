'use client';
import { IUser } from '@/models/Users';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    
    async function fetchUser() {
      const res = await fetch('/api/auth/currentUser');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        
      }
    }

    fetchUser();
  }, []);

  return user;
}