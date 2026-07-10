import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function HomeScreen() {
  return (
    <PlaceholderScreen
      title="Home"
      actions={[{ label: 'Start a Lesson →', href: '/lesson' }]}
    />
  );
}
