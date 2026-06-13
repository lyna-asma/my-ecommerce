"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// promotional slides data
const slides = [
  {
    id: 1,
    title: "New Arrivals",
    description: "Discover our latest collection of modest fashion",
    bgColor: "bg-gray-100 dark:bg-gray-800"
  },
  {
    id: 2,
    title: "Premium Quality",
    description: "Handcrafted with care and attention to detail",
    bgColor: "bg-gray-200 dark:bg-gray-700"
  },
  {
    id: 3,
    title: "Free Shipping",
    description: "On orders over 10,000 DZD",
    bgColor: "bg-gray-100 dark:bg-gray-800"
  }
]

export function PromoSlider() {
  // keep track of which slide is currently showing
  const [currentSlide, setCurrentSlide] = useState(0)

  // automatically change slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    
    // cleanup function - stop the timer when component unmounts
    return () => clearInterval(timer)
  }, [])

  // go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  // go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* show current slide */}
      <div className={`w-full h-full flex items-center justify-center ${slides[currentSlide].bgColor} transition-colors duration-500`}>
        <div className="text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      {/* previous button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
      </button>

      {/* next button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
      </button>

      {/* dots indicator - shows which slide is active */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-gray-900 dark:bg-white"
                : "bg-gray-400 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}