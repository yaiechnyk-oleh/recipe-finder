'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, Clock, ChefHat, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [maxReadyTime, setMaxReadyTime] = useState('');

  const isFormValid =
    query.trim() !== '' || cuisine.trim() !== '' || maxReadyTime.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    if (cuisine.trim()) params.set('cuisine', cuisine.trim());
    if (maxReadyTime.trim()) params.set('maxReadyTime', maxReadyTime.trim());
    router.push(`/recipes?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl mb-4 shadow-lg">
            <ChefHat className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Find Your Recipe
          </h1>
          <p className="text-gray-600 text-sm">
            Discover delicious meals tailored to your taste
          </p>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label
              htmlFor="query"
              className="flex items-center text-sm font-semibold text-gray-700 mb-3"
            >
              <SearchIcon className="mr-2 text-orange-500" size={16} />
              What are you craving?
            </label>
            <div className="relative">
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. creamy pasta, chocolate cake..."
                className="
                  block w-full rounded-xl bg-white/70 backdrop-blur-sm
                  border-2 border-gray-200/50
                  px-4 py-4 text-gray-800 text-lg
                  placeholder:text-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100
                  transition-all duration-300
                  hover:border-orange-300 hover:shadow-md
                  group-hover:shadow-lg
                "
                aria-label="Recipe query"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/5 to-amber-400/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="group">
            <label
              htmlFor="cuisine"
              className="flex items-center text-sm font-semibold text-gray-700 mb-3"
            >
              <Sparkles className="mr-2 text-amber-500" size={16} />
              Cuisine Style
            </label>
            <div className="relative">
              <select
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="
                  block w-full rounded-xl bg-white/70 backdrop-blur-sm
                  border-2 border-gray-200/50
                  px-4 py-4 text-gray-800 text-lg
                  focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100
                  transition-all duration-300
                  hover:border-orange-300 hover:shadow-md
                  group-hover:shadow-lg
                  appearance-none cursor-pointer
                  bg-[url('data:image/svg+xml,%3Csvg fill='%23f97316' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.656a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E')]
                  bg-no-repeat bg-[position:calc(100%-1rem)_center] bg-[length:1.25rem]
                  pr-12
                "
                aria-label="Cuisine filter"
              >
                <option value="">Any cuisine</option>
                <option value="Italian">🇮🇹 Italian</option>
                <option value="Mexican">🇲🇽 Mexican</option>
                <option value="Chinese">🇨🇳 Chinese</option>
                <option value="Indian">🇮🇳 Indian</option>
                <option value="French">🇫🇷 French</option>
                <option value="Japanese">🇯🇵 Japanese</option>
                <option value="Thai">🇹🇭 Thai</option>
                <option value="Mediterranean">🌊 Mediterranean</option>
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/5 to-amber-400/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Max Prep Time Field */}
          <div className="group">
            <label
              htmlFor="maxReadyTime"
              className="flex items-center text-sm font-semibold text-gray-700 mb-3"
            >
              <Clock className="mr-2 text-green-500" size={16} />
              Maximum Prep Time
            </label>
            <div className="relative">
              <input
                id="maxReadyTime"
                type="number"
                min="1"
                step="1"
                value={maxReadyTime}
                onChange={(e) => setMaxReadyTime(e.target.value)}
                placeholder="30"
                className="
                  block w-full rounded-xl bg-white/70 backdrop-blur-sm
                  border-2 border-gray-200/50
                  px-4 py-4 text-gray-800 text-lg
                  placeholder:text-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100
                  transition-all duration-300
                  hover:border-orange-300 hover:shadow-md
                  group-hover:shadow-lg
                "
                aria-label="Maximum preparation time"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                minutes
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/5 to-amber-400/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`
                w-full py-4 rounded-xl text-lg font-bold transition-all duration-300 transform
                ${
                  isFormValid
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] hover:from-orange-600 hover:to-amber-600 active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              aria-disabled={!isFormValid}
            >
              {isFormValid ? (
                <span className="flex items-center justify-center">
                  <SearchIcon className="mr-2" size={20} />
                  Find My Recipe
                </span>
              ) : (
                'Enter search criteria'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 text-center mb-3">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Pasta', 'Chicken', 'Vegetarian', 'Quick meals'].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 text-xs bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full hover:from-orange-200 hover:to-amber-200 transition-all duration-200 hover:scale-105"
                >
                  {suggestion}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
