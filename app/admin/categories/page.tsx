"use client"

import { useState, useEffect } from "react"

import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"

// validation schema for category form
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional()
})

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // form fields
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")

  // load categories when page opens
  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const response = await fetch(`http://localhost:4000/api/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // reset form fields
  function resetForm() {
    setName("")
    setSlug("")
    setDescription("")
  }

  // handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // validate form data
    try {
      categorySchema.parse({ name, slug, description })
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.issues[0].message)
        return
      }
    }

    try {
      const response = await fetch(`http://localhost:4000/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, slug, description })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create category')
      }

      alert('Category created successfully!')
      setShowForm(false)
      resetForm()
      fetchCategories() // reload categories list
    } catch (error: any) {
      console.error('Error creating category:', error)
      alert(error.message || 'Failed to create category')
    }
  }

  // delete a category
  async function handleDelete(categoryId: number, categoryName: string) {
    // confirm deletion with user
    const confirmed = window.confirm(
      `Are you sure you want to delete "${categoryName}"? This will fail if products are using this category.`
    )
    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:4000/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete category')
      }

      alert('Category deleted successfully!')
      fetchCategories() // reload categories list
    } catch (error: any) {
      console.error('Error deleting category:', error)
      alert(error.message || 'Failed to delete category. It may have products assigned to it.')
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
          Manage Categories
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Category
        </button>
      </div>

      {/* category form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Add New Category
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* category name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Category Name *
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

              {/* form buttons */}
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Category
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

      {/* categories table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Name</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Slug</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Description</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b dark:border-gray-700">
                <td className="py-3 px-4 text-gray-900 dark:text-white">{category.name}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{category.slug}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {category.description || '-'}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
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

        {categories.length === 0 && (
          <p className="text-center py-8 text-gray-500">No categories yet</p>
        )}
      </div>
    </div>
  )
}