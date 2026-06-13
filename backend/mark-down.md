## DB 
### Key points to keep in mind :

# in categories table:
- quantity → how many units of the product the customer bought.
- total amount is the unit price * the nbr of units 
`` quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' ``
- DEFAULT 'pending' → if you don’t specify a value, it automatically starts as "pending".
- DECIMAL(10, 2) → a number that can have up to 10 digits in total, with 2 after the decimal point (e.g., 12345.67)

- When a new order is created, it automatically gets the value 'pending' because of the DEFAULT 'pending' part.

Later, when the order is processed, shipped, or completed, the status can be updated to another value — for example:

'pending' → the order was received but not yet processed.

'processing' → someone is preparing it.

'shipped' → it’s on its way.

'delivered' → the customer got it.

'cancelled' → the order was cancelled.



### Restful endpoints
- A RESTful API is a set of rules for how clients (like your frontend or mobile app) talk to the server.
It uses HTTP methods to perform actions on resources (like products, users, or orders).

### async in apis 
- It’s asynchronous (async) because it waits for a database query to finish.

### dynamic creation of placeholders in queries
``   // dynamically building the placeholders like $3,$4,$5 for each category id
      const placeholders = categoryIds
        .map((_, i) => `$${paramCount + i}`)
        .join(",");
      /*.map((_, i) => ...)
      Loops over each category in the array.
     _ means “we don’t care about the actual value,” we just use i (the index).
     For each index, it creates a string like $3, $4, $5… */
/*.join(",") : joins them into a single string separated by commas */``

# E-commerce Platform - Frontend

A modern e-commerce web application built with Next.js, featuring product management, shopping cart, and order processing.

## About the Dependencies

This project uses several npm packages to handle different aspects of the application. Here's why each group of dependencies is included:

### UI Components (Radix UI)
The application uses Radix UI components, which provide accessible and unstyled UI primitives. These components handle complex interactions like modals, dropdowns, and tooltips while maintaining proper accessibility standards. Instead of building every UI element from scratch, these components let me focus on the business logic and styling with Tailwind CSS.

### Form Management
- **react-hook-form**: Manages form state efficiently without unnecessary re-renders
- **@hookform/resolvers**: Connects validation libraries to react-hook-form
- **zod**: Validates form data with TypeScript types to catch errors before they reach the backend

These three work together to handle all the forms in the app (product creation, order placement, etc.) with proper validation.

### Styling Utilities
- **tailwind-merge**: Merges Tailwind classes without conflicts
- **clsx**: Conditionally combines CSS classes
- **class-variance-authority**: Creates component variants easily
- **tailwindcss-animate**: Adds smooth animations

These make it much easier to manage dynamic styling throughout the application.

### Icons and Theming
- **lucide-react**: Provides modern, consistent icons for the entire UI
- **next-themes**: Handles light/dark mode switching seamlessly

### Additional Features
- **date-fns** & **react-day-picker**: For handling dates in order forms and displaying formatted timestamps
- **sonner**: Toast notifications for user feedback (success messages, error alerts)
- **embla-carousel-react**: Product image carousels
- **recharts**: Charts for potential admin dashboard features





