# Succulent System

The **Succulent Inventory System** is a full-stack inventory management application designed to streamline the tracking, costing, and sales of succulents and arrangements. Built using the **MERN Stack** (MongoDB, Express, React, Node.js), it features a reactive pricing engine that ensures accurate profit margins for both individual plants and complex arrangements.

## Key Features

*   **Costing **: Automatically calculates total costs and selling prices by aggregating the costs of individual plants, pots, soil, and labor, then applying a customizable markup percentage.
*   **Live Edit Preview**: Includes an "Advanced Edit" modal that allows users to modify inventory components (like pot or soil costs) and see the updated prices in real-time before saving.
*   **Inventory Intelligence**: Visual indicators for stock levels, including "Low Stock" alerts to help maintain optimal inventory levels.
*   **Flexible Product Modes**: Supports "Single Plant" entries for quick inventory additions and "Arrangement" entries for multi-component products.
*   **Cross-Environment Compatibility**: Optimized for local development using `.env` files and seamless production deployment via Vercel's multi-service architecture.

## Tech Stack

*   **Frontend**: React.js, Vite, Axios.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB Atlas (via Mongoose ODM).
*   **Deployment**: Vercel (Configured for multi-service routing).

## Deployment (Vercel)

To deploy this system, ensure a `vercel.json` file is present in the root directory to route traffic to the appropriate service:
```json
{
  "experimentalServices": {
    "frontend": { "entrypoint": "frontend", "routePrefix": "/", "framework": "vite" },
    "backend": { "entrypoint": "backend", "routePrefix": "/_backend" }
  }}
  
