import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage"; 
import OrdersPage from "./pages/OrdersPage"; 
import ProfilePage from "./pages/ProfilePage"; 
import OrderSuccessPage from "./pages/OrderSuccessPage"; 
import OrderDetailPage from './pages/OrderDetailPage';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />; 
};


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />

       
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
         
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
        </Route>
        
        
      </Routes>
    </div>
  );
}

export default App;