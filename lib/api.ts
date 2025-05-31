interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  cuisines?: string[];
}

interface RecipesResponse {
  results: Recipe[];
  totalResults: number;
}

interface SearchParams {
  query?: string;
  cuisine?: string;
  maxReadyTime?: string;
  offset?: number;
  number?: number;
}

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  cuisines?: string[];
  summary?: string;
  instructions?: string;
  analyzedInstructions?: Array<{
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  extendedIngredients?: Array<{
    id?: number;
    original?: string;
    originalString?: string;
    amount?: number;
    unit?: string;
    name?: string;
  }>;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  spoonacularScore?: number;
}

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY!;
const BASE_URL = 'https://api.spoonacular.com';

export async function searchRecipes(
  params: SearchParams = {}
): Promise<RecipesResponse> {
  const { query, cuisine, maxReadyTime, offset = 0, number = 20 } = params;

  const url = new URL(`${BASE_URL}/recipes/complexSearch`);
  url.searchParams.set('apiKey', API_KEY);
  url.searchParams.set('number', number.toString());
  url.searchParams.set('offset', offset.toString());

  if (query?.trim()) {
    url.searchParams.set('query', query.trim());
  }
  if (cuisine?.trim()) {
    url.searchParams.set('cuisine', cuisine.trim());
  }
  if (maxReadyTime?.trim()) {
    url.searchParams.set('maxReadyTime', maxReadyTime.trim());
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getRecipeById(id: string): Promise<RecipeDetail> {
  const url = `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch recipe: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function searchRecipesClient(
  params: SearchParams = {}
): Promise<RecipesResponse> {
  const { query, cuisine, maxReadyTime, offset = 0, number = 20 } = params;

  const url = new URL(`${BASE_URL}/recipes/complexSearch`);
  url.searchParams.set('apiKey', API_KEY);
  url.searchParams.set('number', number.toString());
  url.searchParams.set('offset', offset.toString());

  if (query?.trim()) {
    url.searchParams.set('query', query.trim());
  }
  if (cuisine?.trim()) {
    url.searchParams.set('cuisine', cuisine.trim());
  }
  if (maxReadyTime?.trim()) {
    url.searchParams.set('maxReadyTime', maxReadyTime.trim());
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Failed to fetch recipes: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export type { SearchParams, Recipe, RecipeDetail };
