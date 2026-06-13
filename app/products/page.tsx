"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"


// category list for checkboxes
const categories = [
  { id: 1, name: "Scarfs" },
  { id: 2, name: "Dresses" },
  { id: 3, name: "Tops" },
  { id: 4, name: "Bottoms" }
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  
  // state for all products and filters
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100000)
  const [searchQuery, setSearchQuery] = useState("")

  // when page loads, check if there's a category or search in the url
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    const searchFromUrl = searchParams.get('search')
    
    if (categoryFromUrl) {
      setSelectedCategories([parseInt(categoryFromUrl)])
    }
    
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }, [searchParams])

  // fetch products from backend whenever filters change
  useEffect(() => {
    fetchProducts()
  }, [selectedCategories, minPrice, maxPrice])

  async function fetchProducts() {
    setLoading(true)
    try {
      // build url with all filter parameters
      let url = `http://localhost:4000/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}`
      
      // add category filters - backend expects multiple category params
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(catId => {
          url += `&category=${catId}`
        })
      }
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      let data = await response.json()
      
      // filter by search query on frontend (simple text search)
      if (searchQuery) {
        data = data.filter((product: any) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // handle category checkbox changes
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // remove category if already selected
        return prev.filter(id => id !== categoryId)
      } else {
        // add category if not selected
        return [...prev, categoryId]
      }
    })
  }

  // apply search filter
  const handleSearch = () => {
    fetchProducts()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Products</h1>

      <div className="flex gap-8">
        {/* filters sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Filters</h2>

            {/* search input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input"
              />
              <button
                onClick={handleSearch}
                className="btn-primary w-full mt-2"
              >
                Search
              </button>
            </div>

            {/* category checkboxes */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Categories
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                </label>
              ))}
            </div>

            {/* price range sliders */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Min Price: {minPrice.toLocaleString()} DZD
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Max Price: {maxPrice.toLocaleString()} DZD
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* reset filters button */}
            <button
              onClick={() => {
                setSelectedCategories([])
                setMinPrice(0)
                setMaxPrice(100000)
                setSearchQuery("")
              }}
              className="btn-secondary w-full"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* products grid */}
        <main className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="card hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* product image */}
                  <div className="relative w-full h-48 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={`http://localhost:3000${product.image_url}`}
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

                  {/* product info */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {product.price.toLocaleString()} DZD
                  </p>
                  <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}