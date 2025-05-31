import { Suspense } from 'react';
import RecipesServer from './recipes-server';
import RecipesLoading from './loading';

interface RecipesPageProps {
  searchParams: {
    query?: string;
    cuisine?: string;
    maxReadyTime?: string;
  };
}

export default function RecipesPage({ searchParams }: RecipesPageProps) {
  return (
    <Suspense fallback={<RecipesLoading />}>
      <RecipesServer searchParams={searchParams} />
    </Suspense>
  );
}
