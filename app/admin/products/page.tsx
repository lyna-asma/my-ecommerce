"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

import { Pencil, Trash2, Plus } from "lucide-react"
import { z } from "zod"

// validation schema for product form
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().min(0, "Stock must be positive"),
  category_id: z.number().min(1, "Category is required")
})

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // form fields
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  // load products and categories when page opens
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    try {
      const response = await fetch(`http://localhost:4000/api/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(`http://localhost:4000/api/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // open form for adding new product
  function handleAddNew() {
    setEditingProduct(null)
    resetForm()
    setShowForm(true)
  }

  // open form for editing existing product
  function handleEdit(product: any) {
    setEditingProduct(product)
    setName(product.name)
    setSlug(product.slug)
    setDescription(product.description || "")
    setPrice(product.price.toString())
    setStock(product.stock.toString())
    setCategoryId(product.category_id.toString())
    setImageFile(null)
    setShowForm(true)
  }

  // reset form fields
  function resetForm() {
    setName("")
    setSlug("")
    setDescription("")
    setPrice("")
    setStock("")
    setCategoryId("")
    setImageFile(null)
  }

  // handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // validate form data
    try {
      productSchema.parse({
        name,
        slug,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category_id: parseInt(categoryId)
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.issues[0].message)
        return
      }
    }

    // create form data for file upload
    // form data is needed because we're sending both text and image file
    const formData = new FormData()
    formData.append('name', name)
    formData.append('slug', slug)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append('category_id', categoryId)
    
    // add image file if selected
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      let response
      
      if (editingProduct) {
        // update existing product
        response = await fetch(`http://localhost:4000}/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: formData // don't set content-type header - browser will set it automatically for form data
        })
      } else {
        // create new product
        response = await fetch(`http://localhost:4000/api/products`, {
          method: 'POST',
          body: formData
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save product')
      }

      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
      setShowForm(false)
      resetForm()
      fetchProducts() // reload products list
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert(error.message || 'Failed to save product')
    }
  }

  // delete a product
  async function handleDelete(productId: number, productName: string) {
    // confirm deletion with user
    const confirmed = window.confirm(`Are you sure you want to delete "${productName}"?`)
    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      alert('Product deleted successfully!')
      fetchProducts() // reload products list
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Manage Products
        </h1>
        <button onClick={handleAddNew} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add New Product
        </button>
      </div>

      {/* product form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* product name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  required
                />
              </div>

              {/* slug */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Slug * (URL-friendly name, no spaces)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="input"
                  required
                />
              </div>

              {/* description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input"
                  rows={3}
                />
              </div>

              {/* price and stock in same row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Price (DZD) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="input"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* category selector */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* image upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="input"
                />
                {editingProduct && !imageFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to keep current image
                  </p>
                )}
              </div>

              {/* form buttons */}
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* products table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Image</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Name</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Price</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Stock</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Category</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b dark:border-gray-700">
                <td className="py-3 px-4">
                  <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded">
                    {product.image_url ? (
                      <Image
                        src={`http://localhost:4000${product.image_url}`}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{product.name}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {product.price.toLocaleString()} DZD
                </td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{product.stock}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mr-2"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products yet</p>
        )}
      </div>
    </div>
  )
}