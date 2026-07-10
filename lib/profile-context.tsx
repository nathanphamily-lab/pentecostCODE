import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/lib/auth-context';
import { ChildProfile, subscribeProfiles } from '@/lib/profiles';

type ProfileContextValue = {
  /** Child profiles for the signed-in family. */
  profiles: ChildProfile[];
  /** True until the first profiles snapshot arrives. */
  loading: boolean;
  /** The child profile chosen this session (in-memory; re-picked each launch). */
  selectedProfile: ChildProfile | null;
  selectProfile: (profile: ChildProfile) => void;
  clearSelection: () => void;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    if (!user) {
      // Signed out: drop everything so the gate falls back to login.
      setProfiles([]);
      setSelectedProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeProfiles(
      user.uid,
      (next) => {
        setProfiles(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [user]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profiles,
      loading,
      selectedProfile,
      selectProfile: setSelectedProfile,
      clearSelection: () => setSelectedProfile(null),
    }),
    [profiles, loading, selectedProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
}
