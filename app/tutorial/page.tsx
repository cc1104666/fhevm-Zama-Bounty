import { TutorialProvider } from '@/components/tutorial/TutorialProvider';
import { TutorialLayout } from '@/components/tutorial/TutorialLayout';

export const metadata = {
  title: 'Interactive FHEVM Tutorial - Hello FHEVM',
  description: 'Learn to build privacy-preserving dApps with step-by-step interactive tutorial',
};

export default function TutorialPage() {
  return (
    <TutorialProvider>
      <TutorialLayout />
    </TutorialProvider>
  );
}
