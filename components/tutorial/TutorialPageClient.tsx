"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { TutorialProvider } from '@/components/tutorial/TutorialProvider';
import { TutorialLayout } from '@/components/tutorial/TutorialLayout';
import { useTutorial } from '@/components/tutorial/TutorialProvider';

function TutorialInitializer() {
  const searchParams = useSearchParams();
  const { examples, setCurrentExample } = useTutorial();
  
  useEffect(() => {
    const exampleParam = searchParams.get('example');
    if (exampleParam) {
      const targetExample = examples.find(ex => ex.id === exampleParam);
      if (targetExample) {
        setCurrentExample(targetExample);
      }
    }
  }, [searchParams, examples, setCurrentExample]);

  return null;
}

export function TutorialPageClient() {
  return (
    <TutorialProvider>
      <TutorialInitializer />
      <TutorialLayout />
    </TutorialProvider>
  );
}
