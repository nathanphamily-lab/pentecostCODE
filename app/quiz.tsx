import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function QuizScreen() {
  return (
    <PlaceholderScreen
      title="Quiz"
      actions={[{ label: 'Done → Home', href: '/', dismissTo: true }]}
    />
  );
}
