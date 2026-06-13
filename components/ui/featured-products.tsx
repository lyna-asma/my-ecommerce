import Link from "next/link"
import Image from "next/image"

//idk if this line of .env.local file is worth adding
// ----------THINK OF IT LATER
//import { API_URL } from "@/lib/utils"

// fetch the 5 most recent products from the backend
async function getFeaturedProducts() {
  try {
    const response = await fetch(`http://localhost:4000/api/products`, {
      // don't cache this data - always get fresh products
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    const products = await response.json()
    // return only the first 5 products (most recent)
    return products.slice(0, 5)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function FeaturedProducts() {
  // get the products from backend
  const products = await getFeaturedProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No products available yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      {products.map((product: any) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          {/* product image */}
          <div className="relative w-full h-48 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {product.image_url ? (
              <Image
                src={`http://localhost:4000${product.image_url}`}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* product name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h3>

          {/* product price */}
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {product.price.toLocaleString()} DZD
          </p>

          {/* stock indicator */}
          <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        </Link>
      ))}
    </div>
  )
}