"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Users, Star, ChefHat, Search, Loader2, Plus } from "lucide-react"

interface Recipe {
    id: number
    title: string
    image: string
    readyInMinutes?: number
    servings?: number
    cuisines?: string[]
}

export default function RecipesClient() {
    const searchParams = useSearchParams()
    const query = searchParams.get("query")
    const cuisine = searchParams.get("cuisine")
    const maxReadyTime = searchParams.get("maxReadyTime")

    console.log("URL Search params:", { query, cuisine, maxReadyTime })

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [totalResults, setTotalResults] = useState(0)

    const RECIPES_PER_BATCH = 20

    const fetchRecipes = async (currentOffset: number, isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
            }

            const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY!
            const baseURL = "https://api.spoonacular.com/recipes/complexSearch"
            const url = new URL(baseURL)
            url.searchParams.set("apiKey", API_KEY)
            url.searchParams.set("number", RECIPES_PER_BATCH.toString())
            url.searchParams.set("offset", currentOffset.toString())

            if (query && query.trim()) {
                url.searchParams.set("query", query.trim())
            }
            if (cuisine && cuisine.trim()) {
                url.searchParams.set("cuisine", cuisine.trim())
            }
            if (maxReadyTime && maxReadyTime.trim()) {
                url.searchParams.set("maxReadyTime", maxReadyTime.trim())
            }

            console.log("API URL:", url.toString())

            const res = await fetch(url.toString())
            if (!res.ok) throw new Error(`Spoonacular returned ${res.status}`)

            const data = await res.json()
            console.log("API Response:", data)

            const newRecipes = data.results || []

            if (isLoadMore) {
                setRecipes((prev) => [...prev, ...newRecipes])
            } else {
                setRecipes(newRecipes)
                setTotalResults(data.totalResults || 0)
            }

            setHasMore(
                newRecipes.length === RECIPES_PER_BATCH && currentOffset + RECIPES_PER_BATCH < (data.totalResults || 0),
            )
        } catch (err: any) {
            console.error("Fetch error:", err)
            setError(err.message)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        console.log("Effect triggered with params:", { query, cuisine, maxReadyTime })
        setOffset(0)
        setHasMore(true)
        setRecipes([])
        fetchRecipes(0, false)
    }, [query, cuisine, maxReadyTime])

    const handleLoadMore = () => {
        const newOffset = offset + RECIPES_PER_BATCH
        setOffset(newOffset)
        fetchRecipes(newOffset, true)
    }


    const searchCriteria = []
    if (query && query.trim()) searchCriteria.push(`"${query}"`)
    if (cuisine && cuisine.trim()) searchCriteria.push(`${cuisine} cuisine`)
    if (maxReadyTime && maxReadyTime.trim()) searchCriteria.push(`under ${maxReadyTime} minutes`)

    if (error) {
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
                    <p className="text-red-600 mb-6">Something went wrong: {error}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Try Again
                    </Link>
                </div>
            </main>
        )
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-white/50 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl mb-4 shadow-lg">
                                <Loader2 className="text-white animate-spin" size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding Recipes</h2>
                            <p className="text-gray-600">
                                {searchCriteria.length > 0
                                    ? `Searching for ${searchCriteria.join(", ")}...`
                                    : "Searching for delicious recipes..."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-all duration-300 hover:scale-105 mb-6 group"
                    >
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" size={20} />
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
                                    <p className="text-gray-600 mt-1">Searching for {searchCriteria.join(", ")}</p>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Recipes Found</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            We couldn't find any recipes matching your criteria. Try adjusting your search terms or filters.
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
                                <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group">
                                    <div className="bg-white/90 rounded-2xl shadow-lg border border-white/50 overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1">
                                        {/* Image */}
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                src={recipe.image || "/placeholder.svg"}
                                                alt={recipe.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                                loading="lazy"
                                            />

                                            {/* Simple overlay on hover */}
                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Simplified badge */}
                                            <div className="absolute top-3 right-3 bg-white/95 rounded-full px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex items-center text-xs text-orange-600 font-semibold">
                                                    <Star className="mr-1" size={12} />
                                                    Recipe
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h2 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                                                {recipe.title}
                                            </h2>

                                            {/* Meta info */}
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

                                            {/* Cuisines */}
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
                                                        <span className="text-xs text-gray-400 px-2 py-1">+{recipe.cuisines.length - 2} more</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>


                        {hasMore && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                                >
                                    {loadingMore ? (
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
                    </>
                )}

                {!hasMore && recipes.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 inline-block">
                            <p className="text-gray-600 mb-4">
                                You've seen all {totalResults} recipes! Want to search for something else?
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
            </div>
        </main>
    )
}
