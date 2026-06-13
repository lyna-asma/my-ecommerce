import Image from "next/image"
import Link from "next/link"

import { notFound } from "next/navigation"

// fetch single product by slug from backend
async function getProduct(slug: string) {
  try {
    const response = await fetch(`http://localhost:4000/api/products/${slug}`, {
      cache: 'no-store' // always get fresh data
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string }
}) {
  // get the product data
  const product = await getProduct(params.slug)

  // if product not found, show 404 page
  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-12">
        {/* product image */}
        <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={`http://localhost:4000${product.image_url}`}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {/* product information */}
        <div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {product.name}
          </h1>

          <p className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {product.price.toLocaleString()} DZD
          </p>

          {/* stock status */}
          {product.stock > 0 ? (
            <p className="text-green-600 font-semibold mb-6">
              In Stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-red-600 font-semibold mb-6">Out of Stock</p>
          )}

          {/* product description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {product.description || 'No description available'}
            </p>
          </div>

          {/* buy now button */}
          {product.stock > 0 ? (
            <Link
              href={`/order?product=${product.id}`}
              className="btn-primary inline-block"
            >
              Buy Now
            </Link>
          ) : (
            <button disabled className="btn-primary opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}

          {/* back to products link */}
          <Link
            href="/products"
            className="btn-secondary inline-block ml-4"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>)
    }