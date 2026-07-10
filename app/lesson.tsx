import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function LessonScreen() {
  return (
    <PlaceholderScreen
      title="Lesson"
      actions={[
        { label: 'Tap a word (Phonics Breakdown)', href: '/phonics-breakdown' },
        { label: 'Finish → Quiz', href: '/quiz' },
      ]}
    />
  );
}
