# L’Arôme Café – Menu & Order Management System

A full-stack MERN application for café menu browsing, guest ordering, and administrative management. Customers can explore the menu, add items to their cart, and place orders without creating an account. Administrators can manage menu items and track customer orders.

## Live Demo

* **Frontend:** https://larome-frontend.vercel.app/
* **Backend:** https://larome-cafe.onrender.com/
* **API Health:** https://larome-cafe.onrender.com/api/health
* **Swagger API Documentation:** https://larome-cafe.onrender.com/api/docs
* **GitHub Repository:** https://github.com/sujal-dev07/Larome-cafe

## Features

### Customer Features

* Browse café menu items.
* Search menu items.
* Filter items by category.
* Sort items by price.
* Add products to the shopping cart.
* Increase or decrease item quantities.
* Remove items from the cart.
* Automatic cart total calculation.
* Guest checkout without customer login.
* Submit orders using customer name and phone number.
* QR-code-based access to the café website.

### Admin Features

* Secure administrator login.
* JWT-based authentication.
* Protected administrative routes.
* Add, edit, and delete menu items.
* View customer orders.
* Update order status.

### Backend Features

* RESTful API using Express.js.
* MongoDB Atlas database integration.
* Mongoose data models.
* Server-side order validation and total calculation.
* Centralized error handling.
* Swagger API documentation.

## Technology Stack

| Frontend   | Backend            | Database & Tools |
| ---------- | ------------------ | ---------------- |
| React.js   | Node.js            | MongoDB Atlas    |
| Vite       | Express.js         | Mongoose         |
| JavaScript | JWT Authentication | Git & GitHub     |
| CSS        | REST API           | Swagger          |
| Axios      | CORS               | Vercel & Render  |

## Project Structure

```text
Larome-cafe/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── docs/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

## Installation & Setup

### Prerequisites

* Node.js and npm
* MongoDB Atlas account
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/sujal-dev07/Larome-cafe.git

cd Larome-cafe
```

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Documentation

Swagger documentation is available at:

https://larome-cafe.onrender.com/api/docs

### Main API Routes

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/api/health`     | Check backend status  |
| GET    | `/api/menu`       | Retrieve menu items   |
| POST   | `/api/menu`       | Create menu item      |
| PUT    | `/api/menu/:id`   | Update menu item      |
| DELETE | `/api/menu/:id`   | Delete menu item      |
| POST   | `/api/orders`     | Create customer order |
| GET    | `/api/orders`     | Retrieve orders       |
| POST   | `/api/auth/login` | Admin login           |

Administrative endpoints require authentication where configured.

For request parameters, validation rules, and response examples, refer to the Swagger documentation.

## Environment Variables

### Backend

| Variable       | Description                        |
| -------------- | ---------------------------------- |
| `PORT`         | Backend server port                |
| `NODE_ENV`     | Application environment            |
| `MONGODB_URI`  | MongoDB Atlas connection string    |
| `JWT_SECRET`   | Secret used for JWT authentication |
| `FRONTEND_URL` | Frontend URL allowed by CORS       |

### Frontend

| Variable       | Description          |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

**Security:** Never commit `.env` files, database credentials, or JWT secrets to GitHub. Only commit `.env.example` files containing placeholder values.

## Deployment

| Component | Platform      |
| --------- | ------------- |
| Frontend  | Vercel        |
| Backend   | Render        |
| Database  | MongoDB Atlas |

The deployed application uses environment variables configured through the hosting platforms.

## Screenshots

1. Café homepage and menu.
  <img width="1851" height="945" alt="homepage" src="https://github.com/user-attachments/assets/f2a9eae2-0977-4c15-a31a-ff58cfba47c8" />
2. Shopping cart.
   <img width="1743" height="913" alt="cart" src="https://github.com/user-attachments/assets/56beb386-1bfe-4a3a-a92f-b6128f801044" />
3. Customer checkout.
  <img width="1764" height="927" alt="checkout" src="https://github.com/user-attachments/assets/3832f0ea-a812-4af6-888d-095f5cc7b592" />
4. Order success page.
  <img width="1768" height="925" alt="sucess" src="https://github.com/user-attachments/assets/236af7cf-42cf-4df5-b15c-a885a62bf5ee" />
5. Admin login.
  <img width="1744" height="911" alt="admin login" src="https://github.com/user-attachments/assets/eb57c6c7-9653-46e0-8c3e-3a7d59a49624" />
6. Admin dashboard.
  <img width="1799" height="898" alt="admin dash" src="https://github.com/user-attachments/assets/8a4dea37-8664-4804-994e-7edcf98b578d" />
7. Menu management.
 <img width="1723" height="876" alt="menu-manage" src="https://github.com/user-attachments/assets/8a6e3c90-32bf-486d-911b-4653d4eac44a" />
<img width="1300" height="866" alt="menumanage2" src="https://github.com/user-attachments/assets/719e10de-6586-4631-b268-9aeaa2357646" />
8. Order management.
  <img width="1684" height="963" alt="ordermange" src="https://github.com/user-attachments/assets/f8fdc582-8ffd-486e-a2b9-93e7a66a569b" />


