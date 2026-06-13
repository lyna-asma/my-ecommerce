"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"

import { z } from "zod"

// validation schema for order form using zod
// this checks if the data is correct before sending to backend
const orderSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  customer_email: z.string().email("Valid email is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1")
})

export default function OrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product')

  // state for product and form
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // form fields
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [address, setAddress] = useState("")
  const [quantity, setQuantity] = useState(1)

  // fetch product when page loads
  useEffect(() => {
    if (productId) {
      fetchProduct()
    } else {
      // if no product id in url, show error and go back
      alert('No product selected')
      router.push('/products')
    }
  }, [productId])

  async function fetchProduct() {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`)
      if (!response.ok) throw new Error('Product not found')
      
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Failed to load product')
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  // calculate total price based on quantity
  const totalPrice = product ? product.price * quantity : 0

  // handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // validate form data using zod schema
    try {
      orderSchema.parse({
        customer_name: customerName,
        customer_email: customerEmail,
        address: address,
        quantity: quantity
      })
    } catch (error) {
      // if validation fails, show error message
      if (error instanceof z.ZodError) {
        alert(error.issues[0].message)
        return
      }
      // rethrow unexpected errors so they can be handled elsewhere
      throw error
    }

    // check if enough stock available
    if (quantity > product.stock) {
      alert(`Not enough stock! Only ${product.stock} items available`)
      return
    }

    // confirm order with user
    const confirmOrder = window.confirm(
      `Place order for ${quantity} x ${product.name}?\nTotal: ${totalPrice.toLocaleString()} DZD`
    )
    
    if (!confirmOrder) return

    // submit order to backend
    setSubmitting(true)
    try {
      const response = await fetch(`http://localhost:4000/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: product.id,
          customer_name: customerName,
          customer_email: customerEmail,
          address: address,
          quantity: quantity
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to place order')
      }

      const order = await response.json()
      
      // show success message
      alert('Order placed successfully!')
      
      // redirect to order confirmation page
      router.push(`/order-confirmation/${order.id}`)
    } catch (error: any) {
      console.error('Error placing order:', error)
      alert(error.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Place Order</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* product summary */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
          
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

          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            {product.name}
          </h3>
          <p className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {product.price.toLocaleString()} DZD
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available: {product.stock} items
          </p>
        </div>

        {/* order form */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* quantity selector */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* customer name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input"
                required
              />
            </div>

            {/* customer email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            {/* delivery address */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Delivery Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input"
                rows={3}
                required
              />
            </div>

            {/* total price display */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>{totalPrice.toLocaleString()} DZD</span>
              </div>
            </div>

            {/* submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}