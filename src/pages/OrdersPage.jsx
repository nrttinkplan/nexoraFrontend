import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { PackageIcon, ChevronRightIcon } from 'lucide-react';
import { motion } from 'framer-motion'; 

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const orderCardContainerVariants = {
    hidden: { opacity: 1 }, 
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, 
      },
    },
  };

  const orderCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } }
  };


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/siparisler/kullanici');
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Siparişler yüklenirken hata:', err);
        setError(err.response?.data?.error || 'Siparişler yüklenirken bir hata oluştu.');
         if (err.response?.status === 401) {
            navigate('/login', { state: { from: '/orders' } });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <motion.main 
          className="flex-grow flex justify-center items-center text-center"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <p className="text-xl">Siparişler Yükleniyor...</p>
        </motion.main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <motion.main 
          className="flex-grow flex flex-col items-center justify-center text-center px-4"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <p className="text-red-500 text-xl">{error}</p>
          <Link to="/" className="mt-4 text-blue-500 hover:underline">Anasayfaya Dön</Link>
        </motion.main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        <motion.h1 
          className="text-3xl font-semibold mb-8 text-gray-800"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          Siparişlerim
        </motion.h1>
        {orders.length === 0 ? (
          <motion.div 
            className="text-center py-10 bg-white shadow rounded-lg"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
          >
            <PackageIcon className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-700">Henüz hiç sipariş vermediniz.</p>
            <Link to="/products" className="mt-6 inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Alışverişe Başla
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-6"
            variants={orderCardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {orders.map((order) => (
              <motion.div 
                key={order.siparisid} 
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                variants={orderCardVariants}
                
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-sky-700">Sipariş #{order.siparisid}</h2>
                      <p className="text-sm text-gray-500">
                        Tarih: {new Date(order.siparistarihi).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${
                        order.siparisdurumu === 'Hazırlanıyor' ? 'bg-yellow-100 text-yellow-800' :
                        order.siparisdurumu === 'Kargoya Verildi' ? 'bg-blue-100 text-blue-800' : 
                        order.siparisdurumu === 'Teslim Edildi' ? 'bg-green-100 text-green-800' :
                        order.siparisdurumu === 'İptal Edildi' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {order.siparisdurumu}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700">
                        Toplam Tutar: <span className="font-semibold">{parseFloat(order.toplamtutar).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                    </p>
                    {order.adresbasligi && (
                        <p className="text-sm text-gray-600">
                            Teslimat Adresi: {order.adresbasligi} - {order.adressatiri}, {order.ilce}/{order.il}
                        </p>
                    )}
                  </div>
                  <Link 
                    to={`/orders/${order.siparisid}`} 
                    className="inline-flex items-center text-sm text-sky-600 hover:text-sky-800 hover:underline font-medium"
                  >
                    Sipariş Detaylarını Görüntüle <ChevronRightIcon size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default OrdersPage;