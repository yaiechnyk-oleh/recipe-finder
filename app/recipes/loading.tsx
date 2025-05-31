import { Loader2 } from "lucide-react"

export default function RecipesLoading() {
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
                        <p className="text-gray-600">Searching for delicious recipes...</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
