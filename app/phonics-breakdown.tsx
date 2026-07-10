import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function PhonicsBreakdownScreen() {
  return (
    <PlaceholderScreen
      title="Phonics Breakdown"
      subtitle="Coming soon — tap to resume"
      actions={[{ label: 'Tap to resume', href: '/lesson', dismissTo: true }]}
    />
  );
}
