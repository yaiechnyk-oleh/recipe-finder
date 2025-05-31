'use client';

import { useState } from 'react';
import { Loader2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star } from 'lucide-react';
import { searchRecipesClient } from '@/lib/api';
import type { SearchParams, Recipe } from '@/lib/api';

interface RecipesLoadMoreProps {
  initialRecipes: Recipe[];
  totalResults: number;
  searchParams: SearchParams;
}

export default function RecipesLoadMore({
  initialRecipes,
  totalResults,
  searchParams,
}: RecipesLoadMoreProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(20);

  const RECIPES_PER_BATCH = 20;
  const hasMore = recipes.length < totalResults;

  const handleLoadMore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await searchRecipesClient({
        ...searchParams,
        offset,
        number: RECIPES_PER_BATCH,
      });
      const newRecipes = data.results || [];

      setRecipes((prev) => [...prev, ...newRecipes]);
      setOffset((prev) => prev + RECIPES_PER_BATCH);
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show additional recipes beyond the initial server-rendered ones
  const additionalRecipes = recipes.slice(initialRecipes.length);

  return (
    <>
      {additionalRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {additionalRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group"
            >
              <div className="bg-white/90 rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={recipe.image || '/placeholder.svg'}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 bg-white/95 rounded-full px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-xs text-orange-600 font-semibold">
                      <Star className="mr-1" size={12} />
                      Recipe
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                    {recipe.title}
                  </h2>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    {recipe.readyInMinutes && (
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {recipe.readyInMinutes}m
                      </div>
                    )}
                    {recipe.servings && (
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {recipe.servings} servings
                      </div>
                    )}
                  </div>

                  {recipe.cuisines && recipe.cuisines.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.cuisines.slice(0, 2).map((cuisine: string) => (
                        <span
                          key={cuisine}
                          className="text-xs bg-orange-100 text-orange-700 rounded-full px-2 py-1 font-medium"
                        >
                          {cuisine}
                        </span>
                      ))}
                      {recipe.cuisines.length > 2 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{recipe.cuisines.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Loading More...
              </>
            ) : (
              <>
                <Plus className="mr-2" size={20} />
                Load More Recipes
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Showing {recipes.length} of {totalResults} recipes
          </p>
        </div>
      )}

      {!hasMore && recipes.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 inline-block">
            <p className="text-gray-600 mb-4">
              You've seen all {totalResults} recipes! Want to search for
              something else?
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105"
            >
              <Search className="mr-2" size={16} />
              New Search
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
