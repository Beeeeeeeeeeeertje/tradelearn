import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, ADMIN_UID } from './firebase';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [gebruiker, setGebruiker] = useState<User | null>(null);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    const stop = onAuthStateChanged(auth, (user) => {
      setGebruiker(user);
      setLaden(false);
    });
    return stop;
  }, []);

  const isAdmin = gebruiker?.uid === ADMIN_UID;

  return (
    <AuthContext.Provider value={{ gebruiker, isAdmin, laden }}>
      {!laden && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
