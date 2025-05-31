import { Suspense } from "react"
import RecipesClient from "./recipes-client"
import RecipesLoading from "./loading"

export default function RecipesPage() {
    return (
        <Suspense fallback={<RecipesLoading />}>
            <RecipesClient />
        </Suspense>
    )
}
