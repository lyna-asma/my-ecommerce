import Link from "next/link"

import { notFound } from "next/navigation"


// fetch order details from backend
async function getOrder(orderId: string) {
  try {
    const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
      cache: 'no-store' // always get fresh data
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export default async function OrderConfirmationPage({
  params
}: {
  params: { id: string }
}) {
  // get the order data
  const order = await getOrder(params.id)

  // if order not found, show 404 page
  if (!order) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* success message */}
      <div className="text-center mb-8">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Thank you for your order. We'll send updates to your email.
        </p>
      </div>

      {/* order details card */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Order Details
        </h2>

        <div className="space-y-4">
          {/* order id */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
            <span className="font-semibold text-gray-900 dark:text-white">#{order.id}</span>
          </div>

          {/* product name */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Product:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {order.product_name}
            </span>
          </div>

          {/* quantity */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {order.quantity}
            </span>
          </div>

          {/* customer name */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Customer Name:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {order.customer_name}
            </span>
          </div>

          {/* customer email */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {order.customer_email}
            </span>
          </div>

          {/* delivery address */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Delivery Address:</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">
              {order.address}
            </span>
          </div>

          {/* order status */}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="font-semibold text-gray-900 dark:text-white capitalize">
              {order.status}
            </span>
          </div>

          {/* total amount */}
          <div className="flex justify-between pt-4 border-t">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {order.total_amount.toLocaleString()} DZD
            </span>
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}