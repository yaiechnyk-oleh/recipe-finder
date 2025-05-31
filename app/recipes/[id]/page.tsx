import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Utensils,
  Star,
  Heart,
  Share2,
} from 'lucide-react';
import { getRecipeById } from '@/lib/api';

interface Params {
  params: { id: string };
}

export default async function RecipeDetailPage({ params }: Params) {
  const { id } = params;

  let recipe: any = null;
  let fetchError: string | null = null;

  try {
    recipe = await getRecipeById(id);
    console.log('Recipe data:', recipe);
  } catch (err: any) {
    fetchError = err.message;
  }

  if (fetchError || !recipe) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full border border-white/50 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
            <ChefHat className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Recipe Not Found
          </h2>
          <p className="text-red-600 mb-6">
            Error loading recipe: {fetchError}
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Recipes
          </Link>
        </div>
      </main>
    );
  }

  const hasIngredients =
    recipe.extendedIngredients &&
    Array.isArray(recipe.extendedIngredients) &&
    recipe.extendedIngredients.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/recipes"
            className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-all duration-300 hover:scale-105 group"
          >
            <ArrowLeft
              className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
              size={20}
            />
            Back to Recipes
          </Link>
        </div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            <div className="relative">
              {recipe.image && (
                <div className="relative h-80 md:h-96 w-full overflow-hidden">
                  <Image
                    src={recipe.image || '/placeholder.svg'}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                      <Heart className="text-red-500" size={20} />
                    </button>
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                      <Share2 className="text-blue-500" size={20} />
                    </button>
                  </div>

                  {recipe.spoonacularScore && (
                    <div className="absolute bottom-8 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <div className="flex items-center text-sm font-semibold">
                        <Star className="text-yellow-500 mr-1" size={16} />
                        <span className="text-gray-800">
                          {Math.round(recipe.spoonacularScore)}/100
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {recipe.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Clock size={16} />
                    <span className="font-medium">
                      {recipe.readyInMinutes} mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <Users size={16} />
                    <span className="font-medium">
                      {recipe.servings} servings
                    </span>
                  </div>
                  {recipe.cuisines && recipe.cuisines.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <ChefHat size={16} />
                      <span className="font-medium">{recipe.cuisines[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {recipe.summary && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                  <h2 className="flex items-center text-xl font-bold text-gray-800 mb-3">
                    <Utensils className="mr-2 text-orange-500" size={20} />
                    About This Recipe
                  </h2>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: recipe.summary.replace(/<a[^>]*>|<\/a>/g, ''),
                    }}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h2 className="flex items-center text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                      <Utensils className="text-white" size={16} />
                    </div>
                    Ingredients
                  </h2>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    {hasIngredients ? (
                      <ul className="space-y-3">
                        {recipe.extendedIngredients.map(
                          (ing: any, idx: number) => (
                            <li
                              key={`${ing.id || idx}-${idx}`}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50/50 transition-colors duration-200 group"
                            >
                              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mt-2 group-hover:scale-125 transition-transform duration-200"></div>
                              <span className="text-gray-800 leading-relaxed flex-1">
                                {ing.original ||
                                  ing.originalString ||
                                  `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                          <Utensils className="text-amber-500" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No Ingredients Listed
                        </h3>
                        <p className="text-gray-600 max-w-xs">
                          This recipe doesn't have a detailed ingredients list.
                          You might find ingredient information in the
                          instructions below.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="flex items-center text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                      <ChefHat className="text-white" size={16} />
                    </div>
                    Instructions
                  </h2>
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                    {recipe.instructions ? (
                      <div
                        className="prose prose-gray max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: recipe.instructions,
                        }}
                      />
                    ) : recipe.analyzedInstructions &&
                      recipe.analyzedInstructions.length > 0 ? (
                      <ol className="space-y-6 list-decimal list-inside">
                        {recipe.analyzedInstructions[0].steps.map(
                          (step: any) => (
                            <li key={step.number} className="text-gray-800">
                              <span className="font-medium">
                                Step {step.number}:
                              </span>{' '}
                              {step.step}
                            </li>
                          )
                        )}
                      </ol>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                          <ChefHat className="text-amber-500" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No Instructions Available
                        </h3>
                        <p className="text-gray-600 max-w-xs">
                          This recipe doesn't include cooking instructions. You
                          might want to try another recipe.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {recipe.nutrition &&
                recipe.nutrition.nutrients &&
                recipe.nutrition.nutrients.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Nutrition Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {recipe.nutrition.nutrients
                        .slice(0, 4)
                        .map((nutrient: any) => (
                          <div key={nutrient.name} className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.round(nutrient.amount)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {nutrient.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              {nutrient.name}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/recipes"
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Back to Recipes
                </Link>
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-white/80 backdrop-blur-sm text-orange-600 rounded-xl font-semibold hover:bg-white transition-all duration-300 hover:scale-[1.02] border border-orange-200 shadow-lg"
                >
                  <ChefHat className="mr-2" size={20} />
                  Find More Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
