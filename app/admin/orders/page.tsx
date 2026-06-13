"use client"

import { useState, useEffect } from "react"

import { Trash2 } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // load orders when page opens
  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    try {
      const response = await fetch(`http://localhost:4000/api/orders`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // update order status
  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      alert('Order status updated successfully!')
      fetchOrders() // reload orders list
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  // delete an order
  async function handleDelete(orderId: number) {
    // confirm deletion with user
    const confirmed = window.confirm('Are you sure you want to delete this order?')
    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete order')
      }

      alert('Order deleted successfully!')
      fetchOrders() // reload orders list
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Failed to delete order')
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
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Manage Orders
      </h1>

      {/* orders table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Order ID</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Product</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Customer</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Email</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Quantity</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Total</th>
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Status</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b dark:border-gray-700">
                <td className="py-3 px-4 text-gray-900 dark:text-white">#{order.id}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{order.product_name}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{order.customer_name}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{order.customer_email}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{order.quantity}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">
                  {order.total_amount.toLocaleString()} DZD
                </td>
                <td className="py-3 px-4">
                  {/* status dropdown - allows admin to change order status */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-2 py-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDelete(order.id)}
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

        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">No orders yet</p>
        )}
      </div>
    </div>
  )
}