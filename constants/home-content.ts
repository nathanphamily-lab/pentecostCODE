/**
 * Phase 3.2 dummy content for the Home screen.
 *
 * Hardcoded stand-in for the content library. In Phase 3.3 this is replaced by
 * data fetched from Firestore; the shapes below mirror the §3.3 content rows and
 * the §5.2 Biblical story scope so the swap is drop-in.
 *
 * `color` is a placeholder crayon-box thumbnail tint (per §7) until real
 * illustrations exist.
 */

export type HomeCard = {
  id: string;
  title: string;
  /** Placeholder thumbnail tint until illustrations exist. */
  color: string;
  /** Not-yet-unlocked cards render grayed out and are non-interactive. */
  locked: boolean;
};

export type HomeRow = {
  id: string;
  title: string;
  cards: HomeCard[];
};

export const HOME_ROWS: HomeRow[] = [
  {
    id: 'start-here',
    title: 'Start Here',
    cards: [
      { id: 'sh-1', title: 'Meet Johnny', color: '#FFB4A2', locked: false },
      { id: 'sh-2', title: 'First Sounds', color: '#FFCB77', locked: false },
      { id: 'sh-3', title: 'Say Hello', color: '#B5E48C', locked: false },
      { id: 'sh-4', title: 'Big & Small', color: '#90DBF4', locked: true },
    ],
  },
  {
    id: 'bible-stories',
    title: 'Bible Stories',
    cards: [
      { id: 'bs-1', title: 'The Creation', color: '#8ECAE6', locked: false },
      { id: 'bs-2', title: "Noah's Ark", color: '#219EBC', locked: false },
      { id: 'bs-3', title: 'Baby Moses', color: '#FFB703', locked: true },
      { id: 'bs-4', title: 'David & Goliath', color: '#FB8500', locked: true },
      { id: 'bs-5', title: 'Daniel & the Lions', color: '#E29578', locked: true },
      { id: 'bs-6', title: 'Joseph & His Brothers', color: '#CDB4DB', locked: true },
    ],
  },
  {
    id: 'letters',
    title: 'Letters A–Z',
    cards: [
      { id: 'ltr-a', title: 'Letter A', color: '#FF9F1C', locked: false },
      { id: 'ltr-b', title: 'Letter B', color: '#2EC4B6', locked: false },
      { id: 'ltr-c', title: 'Letter C', color: '#E71D36', locked: false },
      { id: 'ltr-d', title: 'Letter D', color: '#9B5DE5', locked: true },
      { id: 'ltr-e', title: 'Letter E', color: '#00BBF9', locked: true },
    ],
  },
  {
    id: 'sight-words',
    title: 'Sight Words',
    cards: [
      { id: 'sw-1', title: 'the', color: '#F15BB5', locked: false },
      { id: 'sw-2', title: 'and', color: '#FEE440', locked: false },
      { id: 'sw-3', title: 'is', color: '#00F5D4', locked: true },
      { id: 'sw-4', title: 'you', color: '#9B5DE5', locked: true },
    ],
  },
  {
    id: 'special-sounds',
    title: 'Special Sounds',
    cards: [
      { id: 'ss-sh', title: 'SH', color: '#06D6A0', locked: false },
      { id: 'ss-ch', title: 'CH', color: '#118AB2', locked: false },
      { id: 'ss-th', title: 'TH', color: '#EF476F', locked: true },
      { id: 'ss-igh', title: 'IGH', color: '#FFD166', locked: true },
    ],
  },
  {
    id: 'ages-5-7',
    title: 'Ages 5–7',
    cards: [
      { id: 'a57-1', title: 'Long Vowels', color: '#7209B7', locked: true },
      { id: 'a57-2', title: 'Silent E', color: '#3A0CA3', locked: true },
      { id: 'a57-3', title: 'Blends', color: '#4361EE', locked: true },
      { id: 'a57-4', title: 'Syllables', color: '#4CC9F0', locked: true },
    ],
  },
];
