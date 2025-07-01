// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'; // useNavigate eklendi
import apiClient from '../services/api'; // axios yerine apiClient import edildi
import { Star, Heart, Minus, Plus, ShoppingCartIcon, ChevronLeftIcon } from 'lucide-react'; // İkonlar lucide-react'ten
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) {
        setError("Ürün ID'si bulunamadı.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // const response = await axios.get(`http://localhost:3000/api/urunler/${productId}`);
        const response = await apiClient.get(`/urunler/${productId}`); 
        setProduct(response.data);
      } catch (err) {
        console.error('Ürün detayı yüklenirken hata oluştu:', err);
        if (err.response && err.response.status === 404) {
          setError('Ürün bulunamadı.');
        } else {
          setError('Ürün detayı yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      
      navigate('/login', { state: { from: `/products/${productId}` } });
      return;
    }

    if (!product || product.stokadedi === 0) {
      alert('Bu ürün stokta yok veya sepete eklenemez.');
      return;
    }
    if (quantity > product.stokadedi) {
        alert(`Stokta yeterli ürün yok. En fazla ${product.stokadedi} adet ekleyebilirsiniz.`);
        return;
    }

    try {
      const response = await apiClient.post('/sepet/ekle', { 
        urunID: product.urunid,
        adet: quantity,
      });
      alert(response.data.message || 'Ürün sepete eklendi!');
     
    } catch (err) {
      console.error('Sepete eklenirken hata:', err.response?.data?.error || err.message);
      alert(err.response?.data?.error || 'Ürün sepete eklenirken bir hata oluştu.');
    }
  };

  const toggleFavorite = () => {
    
    setIsFavorited(prev => !prev);
    if (product) {
        console.log(`${product.urunadi || 'Ürün'} favori durumu: ${!isFavorited}`);
    }
  };

  const renderStars = (rating, reviewCount = 0) => {
    const stars = [];
    const numRating = parseFloat(rating);

    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
        if (reviewCount === 0 && isNaN(numRating)) { 
            return <span className="text-sm text-gray-500">Henüz değerlendirilmemiş</span>;
        }
        
        for (let i = 0; i < 5; i++) {
            stars.push(<Star key={`empty-default-${i}`} className="w-5 h-5 text-gray-300" />);
        }
        return stars;
    }

    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.4; 

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />);
    }
    if (hasHalfStar && stars.length < 5) { 
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400 fill-yellow-400" />);
    }
    const emptyStarsCount = 5 - stars.length;
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  
  const renderTechnicalSpecifications = () => {
    if (!product || !product.teknikozellikler) {
      return <p className="text-gray-600 text-sm">Bu ürün için teknik özellik bilgisi bulunmamaktadır.</p>;
    }

    const specsData = product.teknikozellikler;

    if (typeof specsData === 'object' && !Array.isArray(specsData) && Object.keys(specsData).length > 0) {
      
      return (
        <ul className="space-y-2 text-gray-700 text-sm md:text-base">
          {Object.entries(specsData).map(([key, value]) => (
            <li key={key} className="flex justify-between py-1 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-600">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
              <span className="text-right">{String(value)}</span>
            </li>
          ))}
        </ul>
      );
    } else if (Array.isArray(specsData) && specsData.length > 0) {
      
      return (
        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1 text-sm md:text-base">
          {specsData.map((spec, index) => (
            <li key={index}>{String(spec)}</li>
          ))}
        </ul>
      );
    } else if (typeof specsData === 'string' && specsData.trim() !== '') {
      
      const parsedSpecs = specsData.split(/[,;|\n]/).map(s => s.trim()).filter(s => s);
      if (parsedSpecs.length > 0) {
        return (
          <ul className="list-disc list-inside space-y-1 text-gray-700 pl-1 text-sm md:text-base">
            {parsedSpecs.map((spec, index) => <li key={index}>{spec}</li>)}
          </ul>
        );
      }
    }
    
    return <p className="text-gray-600 text-sm">Bu ürün için teknik özellik bilgisi bulunmamaktadır.</p>;
  };


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20 text-xl text-gray-700">Ürün detayları yükleniyor...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">{error}</h2>
          <RouterLink
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Tüm Ürünlere Geri Dön
          </RouterLink>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20 text-gray-700">Ürün bilgisi bulunamadı.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const productName = product.urunadi || "Ürün Adı Mevcut Değil";
  const imageUrl = product.gorselurl || "https://via.placeholder.com/600x400.png/f0f0f0/333?text=Görsel+Yok";
  const productRating = product.rating; // Backend'den geliyorsa kullanılır
  const reviewCount = product.reviewCount || 0; // Backend'den geliyorsa kullanılır, yoksa 0
  const price = product.birimfiyat ? parseFloat(product.birimfiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A";
  const currency = product.parabirimi || "₺"; // Backend'den parabirimi gelmiyorsa varsayılan
  const shortDescription = product.aciklama || product.kisaaciklama || "Bu ürün için bir açıklama bulunmamaktadır.";
  
  const reviews = Array.isArray(product.yorumlar) ? product.yorumlar : []; // Backend'den yorumlar geliyorsa kullanılır

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <div className="container mx-auto p-4 md:p-8 max-w-6xl mt-6 mb-6">
        <div className="mb-6">
            <RouterLink to="/products" className="text-sky-600 hover:text-sky-700 inline-flex items-center text-sm font-medium">
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Tüm Ürünler
            </RouterLink>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-10 md:mb-16 bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <div className="md:w-2/5 lg:w-1/2 flex justify-center items-start">
            <img
              src={imageUrl}
              alt={productName}
              className="w-full max-w-md h-auto object-contain rounded-lg shadow-md"
            />
          </div>

          <div className="md:w-3/5 lg:w-1/2 flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {productName}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderStars(productRating, reviewCount)}
              </div>
              {reviewCount > 0 && ( // Sadece yorum sayısı 0'dan fazlaysa göster
                <span className="ml-2 text-sm text-gray-600">
                  ({reviewCount} inceleme)
                </span>
              )}
            </div>

            <p className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-5">
              {price}
              <span className="text-2xl align-baseline ml-1">{currency}</span>
            </p>

            <p className="text-gray-700 mb-6 text-sm leading-relaxed">
              {shortDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
                <div className="flex-shrink-0">
                    <div className="flex items-center border border-gray-200 rounded-md h-12 bg-white shadow-sm overflow-hidden">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="px-4 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                            aria-label="Adedi azalt"
                        >
                            <Minus size={20} strokeWidth={2.5} />
                        </button>
                        <input
                            type="text"
                            readOnly
                            value={quantity}
                            className="w-14 text-center h-full border-x border-gray-200 focus:outline-none font-semibold text-gray-700 bg-white"
                            aria-label="Mevcut adet"
                        />
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="px-4 h-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                            aria-label="Adedi artır"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleAddToCart} 
                    disabled={!product || !product.stokadedi || product.stokadedi === 0}
                    className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-150 h-12 flex-grow shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <ShoppingCartIcon className="h-5 w-5 mr-2 hidden sm:inline-block" />
                    {product && product.stokadedi && product.stokadedi > 0 ? 'Sepete Ekle' : 'Tükendi'}
                </button>
            </div>

            <button
              onClick={toggleFavorite}
              className={`flex items-center text-sm transition-colors duration-150 self-start p-2 rounded-md group ${
                isFavorited ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-600 hover:bg-gray-100 hover:text-red-500'
              }`}
            >
              <Heart size={20} className={`mr-2 transition-all ${isFavorited ? 'fill-red-500 stroke-red-500' : 'fill-transparent group-hover:fill-red-100'}`} />
              {isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <div className="mb-10 md:mb-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">
              Teknik Özellikler
            </h2>
            {renderTechnicalSpecifications()}
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-3">
              Yorumlar
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id || review.yor_id || `review-${Math.random()}`} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800">{review.author || review.kullaniciAdi || "Anonim"}</p>
                      {typeof review.rating === 'number' && ( // Yorum için puan varsa göster
                        <div className="flex items-center">
                          {renderStars(review.rating, 1)} {/* Yorumun kendi puanı için reviewCount=1 */}
                          <span className="ml-2 text-xs text-gray-500">({parseFloat(review.rating).toFixed(1)})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {review.date ? new Date(review.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : "Tarih Bilgisi Yok"}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment || review.yorumMetni || "Yorum içeriği bulunmamaktadır."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Bu ürün için henüz yorum yapılmamış.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;