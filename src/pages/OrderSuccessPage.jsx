import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Siparişiniz Başarıyla Alındı!
        </h1>
        {orderId && (
          <p className="text-lg text-gray-600 mb-2">
            Sipariş Numaranız: <span className="font-semibold text-gray-700">{orderId}</span>
          </p>
        )}
        <p className="text-md text-gray-600 mb-8 max-w-md">
          Siparişinizi aldık ve en kısa sürede hazırlamaya başlayacağız. Sipariş durumunuzu "Siparişlerim" sayfasından takip edebilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/orders"
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center w-full sm:w-auto"
          >
            Siparişlerimi Görüntüle
          </Link>
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors text-center w-full sm:w-auto"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;