import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth, db } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  /** True until the initial auth state resolves (keeps the splash up). */
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Ensure the `families/{uid}` doc exists (idempotent). */
async function ensureFamilyDoc(user: User) {
  await setDoc(
    doc(db, 'families', user.uid),
    { parentEmail: user.email, createdAt: serverTimestamp() },
    { merge: true }
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      signIn: async (email, password) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await ensureFamilyDoc(cred.user);
      },
      signUp: async (email, password) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await ensureFamilyDoc(cred.user);
      },
      signOut: () => firebaseSignOut(auth),
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
