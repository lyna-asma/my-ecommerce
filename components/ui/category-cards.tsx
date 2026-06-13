import Link from "next/link"

// our four main categories
const categories = [
  { id: 1, name: "Scarfs", slug: "scarfs", icon: "🧣" },
  { id: 2, name: "Dresses", slug: "dresses", icon: "👗" },
  { id: 3, name: "Tops", slug: "tops", icon: "👚" },
  { id: 4, name: "Bottoms", slug: "bottoms", icon: "👖" }
]

export function CategoryCards() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="card text-center hover:shadow-lg transition-shadow cursor-pointer"
        >
          {/* category icon */}
          <div className="text-6xl mb-4">{category.icon}</div>
          
          {/* category name */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {category.name}
          </h3>
        </Link>
      ))}
    </div>
  )
}