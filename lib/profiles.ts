import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

/** Reading-level tiers per AppSpec §5.1. */
export type AgeTier = 'tier1' | 'tier2' | 'tier3';

export const AGE_TIERS: { value: AgeTier; label: string }[] = [
  { value: 'tier1', label: 'Ages 3–4' },
  { value: 'tier2', label: 'Ages 5–6' },
  { value: 'tier3', label: 'Ages 7+' },
];

export type ChildProfile = {
  id: string;
  name: string;
  ageTier: AgeTier;
  /** Placeholder avatar palette key until real avatars exist. */
  avatar: string;
};

export type NewChildProfile = {
  name: string;
  ageTier: AgeTier;
  avatar: string;
};

/** `families/{uid}/profiles` — one child profile per doc. */
function profilesCollection(uid: string) {
  return collection(db, 'families', uid, 'profiles');
}

/** Subscribe to a family's child profiles, ordered by creation. */
export function subscribeProfiles(
  uid: string,
  onChange: (profiles: ChildProfile[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(profilesCollection(uid), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const profiles = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name as string,
          ageTier: data.ageTier as AgeTier,
          avatar: data.avatar as string,
        };
      });
      onChange(profiles);
    },
    onError
  );
}

/** Create a new child profile under a family. */
export async function createProfile(uid: string, profile: NewChildProfile) {
  await addDoc(profilesCollection(uid), {
    ...profile,
    createdAt: serverTimestamp(),
  });
}
