import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Star, ChefHat, Search } from 'lucide-react';
import RecipesLoadMore from './recipes-load-more';
import { searchRecipes } from '@/lib/api';
import type { SearchParams } from '@/lib/api';

interface RecipesServerProps {
  searchParams: SearchParams;
}

export default async function RecipesServer({
  searchParams,
}: RecipesServerProps) {
  const { query, cuisine, maxReadyTime } = searchParams;

  try {
    const data = await searchRecipes(searchParams);
    const recipes = data.results || [];
    const totalResults = data.totalResults || 0;

    const searchCriteria = [];
    if (query?.trim()) searchCriteria.push(`"${query}"`);
    if (cuisine?.trim()) searchCriteria.push(`${cuisine} cuisine`);
    if (maxReadyTime?.trim())
      searchCriteria.push(`under ${maxReadyTime} minutes`);

    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-all duration-300 hover:scale-105 mb-6 group"
            >
              <ArrowLeft
                className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
                size={20}
              />
              Back to Search
            </Link>

            <div className="bg-white/95 rounded-3xl shadow-lg p-8 border border-white/50">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl mr-4 shadow-lg">
                  <ChefHat className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Recipe Results
                  </h1>
                  {searchCriteria.length > 0 ? (
                    <p className="text-gray-600 mt-1">
                      Searching for {searchCriteria.join(', ')}
                    </p>
                  ) : (
                    <p className="text-gray-600 mt-1">Showing all recipes</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {recipes.length} of {totalResults} recipes
                </div>
              </div>
            </div>
          </div>

          {recipes.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-white/50 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-6 shadow-lg">
                <Search className="text-gray-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Recipes Found
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any recipes matching your criteria. Try
                adjusting your search terms or filters.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105"
              >
                <Search className="mr-2" size={16} />
                New Search
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
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
                            {recipe.cuisines
                              .slice(0, 2)
                              .map((cuisine: string) => (
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

              <RecipesLoadMore
                initialRecipes={recipes}
                totalResults={totalResults}
                searchParams={searchParams}
              />
            </>
          )}
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full border border-white/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <Search className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-600 mb-6">
            Something went wrong:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2" size={16} />
            Try Again
          </Link>
        </div>
      </main>
    );
  }
}
