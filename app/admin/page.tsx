import Link from "next/link"
import { Package, ShoppingBag, Tag, LayoutDashboard } from "lucide-react"

// fetch statistics from backend
async function getStats() {
  try {
    // fetch products, orders, and categories in parallel
    const [productsRes, ordersRes, categoriesRes] = await Promise.all([
      fetch(`http://localhost:4000/api/products`, { cache: 'no-store' }),
      fetch(`http://localhost:4000/api/orders`, { cache: 'no-store' }),
      fetch(`http://localhost:4000/api/categories`, { cache: 'no-store' })
    ])

    const products = await productsRes.json()
    const orders = await ordersRes.json()
    const categories = await categoriesRes.json()

    // calculate total revenue from all orders
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.total_amount)
    }, 0)

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalCategories: categories.length,
      totalRevenue: totalRevenue
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalCategories: 0,
      totalRevenue: 0
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* statistics cards */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {/* total products */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts}
              </p>
            </div>
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* total orders */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* total categories */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Categories</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalCategories}
              </p>
            </div>
            <Tag className="w-12 h-12 text-gray-400" />
          </div>
        </div>

        {/* total revenue */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalRevenue.toLocaleString()} DZD
              </p>
            </div>
            <LayoutDashboard className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      </div>

      {/* quick links to management pages */}
      <div className="grid grid-cols-3 gap-6">
        <Link href="/admin/products" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <Package className="w-12 h-12 text-gray-900 dark:text-white mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Manage Products
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add, edit, or delete products
          </p>
        </Link>

        <Link href="/admin/categories" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <Tag className="w-12 h-12 text-gray-900 dark:text-white mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Manage Categories
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add or delete categories
          </p>
        </Link>

        <Link href="/admin/orders" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <ShoppingBag className="w-12 h-12 text-gray-900 dark:text-white mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Manage Orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            View and update order status
          </p>
        </Link>
      </div>
    </div>
  )
}