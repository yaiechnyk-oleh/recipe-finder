Обробка тривала кілька секунд

# Recipe Finder App

A Next.js 15 application that helps you search for recipes by name, filter by cuisine, set a maximum cook time, and view detailed instructions—all in one place. Built with Tailwind CSS for styling, React Suspense for loading states, and TypeScript for type safety.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yaiechnyk-oleh/recipe-finder.git
   cd recipe-finder
   ```

2. **Install dependencies**
   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

3. **Set up your Spoonacular API key**
   Create a file named `.env.local` in the project root and add:

   ```env
   NEXT_PUBLIC_SPOONACULAR_API_KEY=YOUR_SPOONACULAR_API_KEY
   ```

   Replace `YOUR_SPOONACULAR_API_KEY` with the key you get from [Spoonacular API](https://spoonacular.com/food-api).

4. **Run in development mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Building for Production

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   ```
2. Start the production server:

   ```bash
   npm run start
   # or
   yarn start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Features

* **Search Form (Home Page)**

    * Text input for recipe name (e.g. “pasta”).
    * Dropdown to choose a cuisine (Italian, Mexican, Chinese, etc.).
    * Numeric input for maximum preparation time (in minutes).
    * “Next” button is disabled until at least one field is filled.

* **Recipes Page (Server‐Side Rendered & Cached)**

    * Fetches data from the Spoonacular API on the server, then caches responses for 60 seconds.
    * Displays recipe cards (title + image) in a responsive grid.
    * Basic error handling if the API call fails.
    * Passes the first 20 results to a “Load More” component for client‐side pagination.

* **“Load More” Pagination (Client‐Side)**

    * Initial results come from server‐side rendering.
    * Clicking “Load More” fetches the next batch of recipes without reloading the page.

* **Recipe Details Page (Server‐Side Rendered & Cached)**

    * Fetches detailed information (ingredients, instructions, prep time, servings, likes, cuisines) on the server and caches for 60 seconds.
    * Displays a hero image, ingredient list, and step‐by‐step instructions (HTML or numbered).

* **React Suspense for Loading States**

    * While the server is fetching data, a loading skeleton is displayed.

* **Tailwind CSS for Styling**

    * Utility‐first styling ensures a consistent, responsive layout on all pages.

* **ESLint + Prettier + TypeScript**

    * ESLint is configured with Next.js recommended rules and ESLint‐Prettier integration.
    * Prettier enforces a consistent code style (80‐character lines, single quotes, trailing commas, etc.).
    * TypeScript is used across the codebase for type safety.

## Project Structure & Architecture

```
recipe-finder/
├─ app/
│  ├─ layout.tsx               # Global layout (if needed)
│  ├─ globals.css              # Tailwind base + global styles
│  ├─ page.tsx                 # Search Page (Client Component)
│  ├─ recipes/
│  │  ├─ page.tsx              # Wraps RecipesServer in Suspense
│  │  ├─ recipes-server.tsx    # Server Component: SSR + caching + initial grid
│  │  ├─ recipes-load-more.tsx # Client Component: “Load More” pagination
│  │  ├─ loading.tsx           # Fallback skeleton for Suspense
│  │  └─ [id]/
│  │     └─ page.tsx           # Recipe Details (Server Component)
│  └─ api/                     # (Optional) Internal API routes if you want to hide your key
│     └─ recipes/
│        └─ route.ts           # Proxies requests to Spoonacular using server‐side key
├─ lib/
│  └─ api.ts                   # Centralized fetch helpers: searchRecipes & getRecipeById
├─ public/
│  └─ placeholder.svg          # Fallback image if a recipe has no picture
├─ .env.local                  # Your Spoonacular API key (not committed)
├─ .prettierrc                 # Prettier configuration
├─ eslint.config.mjs           # ESLint (Flat) + Prettier integration
├─ tsconfig.json               # TypeScript configuration
├─ next.config.ts              # Next.js configuration (if any)
├─ package.json                # Scripts & dependencies
└─ README.md                   # This file
```

* **Search Page (`app/page.tsx`)**

    * Marked with `"use client"` so it runs in the browser.
    * Contains the search form with three fields.
    * On submit, navigates to `/recipes?…`.

* **Recipes Page**

    * `app/recipes/page.tsx` uses React Suspense to load `RecipesServer`.
    * `app/recipes/recipes-server.tsx` is a Server Component that calls `searchRecipes()` from `lib/api.ts` with `{ next: { revalidate: 60 } }`.
    * Renders the main grid of recipe cards and passes the first batch to `recipes-load-more.tsx`.

* **“Load More” (`app/recipes/recipes-load-more.tsx`)**

    * Marked with `"use client"`.
    * Receives `initialRecipes` and `totalResults` from the server component.
    * Manages client‐side state to fetch additional recipes on demand.

* **Recipe Details (`app/recipes/[id]/page.tsx`)**

    * A Server Component that reads `id` from the URL, calls `getRecipeById()` (with `{ next: { revalidate: 60 } }`), and renders the full detail view.

* **API Helpers (`lib/api.ts`)**

  ```ts
  // lib/api.ts
  type SearchParams = {
    query?: string;
    cuisine?: string;
    maxReadyTime?: string;
    offset?: number;
    number?: number;
  };
  type RecipeSummary = { id: number; title: string; image: string };
  type RecipesResponse = { results: RecipeSummary[]; totalResults: number };

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
    if (query?.trim()) url.searchParams.set('query', query.trim());
    if (cuisine?.trim()) url.searchParams.set('cuisine', cuisine.trim());
    if (maxReadyTime?.trim()) url.searchParams.set('maxReadyTime', maxReadyTime.trim());

    // Cache for 60 seconds
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  }

  export async function getRecipeById(id: string) {
    const url = `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  }
  ```

    * Both functions use `fetch(..., { next: { revalidate: 60 } })` to cache responses for one minute.

* **Styling & Suspense**

    * Tailwind CSS is used across all components—no extra CSS files are needed besides the global resets.
    * `app/recipes/loading.tsx` provides a simple skeleton that displays while server data is loading.

* **Linting & Formatting**

    * ESLint is configured in `eslint.config.mjs` with Next.js recommended rules plus Prettier integration:

      ```js
      import { FlatCompat } from '@eslint/eslintrc';
      import prettierPlugin from 'eslint-plugin-prettier';
  
      const compat = new FlatCompat({ baseDirectory: __dirname });
  
      export default [
        ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
        {
          plugins: { prettier: prettierPlugin },
          rules: {
            'prettier/prettier': ['error', {}, { usePrettierrc: true }],
          },
          overrides: [
            {
              files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
              parserOptions: { project: ['./tsconfig.json'] },
            },
          ],
        },
      ];
      ```
    * Prettier settings in `.prettierrc`:

      ```json
      {
        "printWidth": 80,
        "tabWidth": 2,
        "useTabs": false,
        "semi": true,
        "singleQuote": true,
        "trailingComma": "es5",
        "bracketSpacing": true,
        "arrowParens": "always"
      }
      ```
    * Run `npm run format` or `yarn format` to auto‐format code. ESLint errors will include any Prettier violations.

---


## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, tweak, or fork it as you please!

---

Thanks for checking out Recipe Finder—happy cooking! 🍝
