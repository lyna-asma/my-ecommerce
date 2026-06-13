import Link from "next/link"
import { PromoSlider } from "@/components/ui/promo-slider"
import { CategoryCards } from "@/components/ui/category-cards"
import { FeaturedProducts } from "@/components/ui/featured-products"

export default function HomePage() {
  return (
    <div>
      {/* promotional slider */}
      <PromoSlider />

      {/* hero section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Wearlyn
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Wearlyn is all about crafting the in-between — where modesty reigns and luxury is seen.
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </section>

      {/* shop by category section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <CategoryCards />
        </div>
      </section>

      {/* featured products section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <FeaturedProducts />
        </div>
      </section>
    </div>
  )
}