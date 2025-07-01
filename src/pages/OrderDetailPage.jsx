import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { ChevronLeftIcon } from 'lucide-react';
import { motion } from 'framer-motion'; 

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: delay * 0.15, duration: 0.5, ease: "easeOut" }
    })
  };
  
  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05, 
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };


  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true); 
      setError(null);   
      try {
        const response = await apiClient.get(`/siparisler/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error('Sipariş detayları yüklenirken hata:', err);
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: `/orders/${orderId}` } });
          return;
        }
        setError(err.response?.data?.error || 'Sipariş detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <motion.main 
          className="flex-grow container mx-auto px-4 py-8 text-center"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <p className="text-xl">Sipariş Detayları Yükleniyor...</p>
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
          className="flex-grow container mx-auto px-4 py-8 text-center"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <p className="text-red-500 text-xl">{error}</p>
          <Link to="/orders" className="mt-4 text-blue-500 hover:underline">Siparişlerime Dön</Link>
        </motion.main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <motion.main 
          className="flex-grow container mx-auto px-4 py-8 text-center"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
        >
          <p className="text-xl">Sipariş bulunamadı.</p>
          <Link to="/orders" className="mt-4 text-blue-500 hover:underline">Siparişlerime Dön</Link>
        </motion.main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(order.siparistarihi).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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
        <motion.div 
          className="mb-6"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0} 
        >
          <Link to="/orders" className="inline-flex items-center text-sky-600 hover:text-sky-800">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            <span>Siparişlerime Dön</span>
          </Link>
        </motion.div>
        
        <motion.div 
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={1} 
        >
          
          <motion.div 
            className="border-b border-gray-200 p-6"
            variants={sectionVariants}
            custom={0} 
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">Sipariş #{order.siparisid}</h1>
                <p className="text-sm text-gray-600">{formattedDate}</p>
              </div>
              <span className={`mt-4 sm:mt-0 px-4 py-2 text-sm font-medium rounded-full ${
                order.siparisdurumu === 'Hazırlanıyor' ? 'bg-yellow-100 text-yellow-800' :
                order.siparisdurumu === 'Kargoya Verildi' ? 'bg-blue-100 text-blue-800' :
                order.siparisdurumu === 'Teslim Edildi' ? 'bg-green-100 text-green-800' :
                order.siparisdurumu === 'İptal Edildi' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.siparisdurumu}
              </span>
            </div>
          </motion.div>
          
          
          <motion.div 
            className="p-6 border-b border-gray-200"
            variants={sectionVariants}
            custom={1} 
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Teslimat Bilgileri</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-700">{order.adresbasligi}</p>
              <p className="text-gray-600 mt-1">{order.adressatiri}</p>
              <p className="text-gray-600">{order.ilce}, {order.il} {order.postakodu}</p>
            </div>
          </motion.div>
          
          
          <motion.div 
            className="p-6"
            variants={sectionVariants}
            custom={2} 
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Sipariş Ürünleri</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Adet</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                  </tr>
                </thead>
                <motion.tbody 
                  className="divide-y divide-gray-200"

                >
                  {order.detaylar.map((item, index) => (
                    <motion.tr 
                      key={item.siparisdetayid} 
                      className="hover:bg-gray-50"
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index} 
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14">
                            <img 
                              className="h-14 w-14 object-cover rounded-md" 
                              src={item.gorselurl || 'https://via.placeholder.com/150?text=Görsel+Yok'} 
                              alt={item.urunadi} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.urunadi}</div>
                            <div className="text-xs text-gray-500">Ürün ID: {item.urunid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {item.adet}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                        {parseFloat(item.birimfiyatalinan).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {parseFloat(item.toplamfiyatsatir).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
                <motion.tfoot 
                  className="bg-gray-50"
                  variants={sectionVariants} 
                  initial="hidden"
                  animate="visible"
                  custom={3} 
                >
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="3">
                      Toplam Tutar
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {parseFloat(order.toplamtutar).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </th>
                  </tr>
                </motion.tfoot>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;