import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom'; 

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product.urunid}`} className="block group"> 
      <div className="flex flex-col items-center text-center p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full">
        <img
          src={product.gorselurl || 'https://via.placeholder.com/150?text=Görsel+Yok'}
          alt={product.urunadi}
          className="h-48 md:h-56 lg:h-64 w-auto object-contain mb-4 transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        <h3 className="text-lg font-semibold text-gray-800 mb-1 mt-auto">{product.urunadi}</h3> 
        <p className="text-md text-gray-600">
          {product.birimfiyat ? product.birimfiyat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : 'N/A'}
        </p>
      </div>
    </Link>
  );
};






const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDiscoverClick = () => {
    navigate('/products');
  }

  useEffect(() => {
    
    const fetchVitrinProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/vitrin');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Vitrin ürünleri yüklenirken hata oluştu:', error);
        setError('Ürünler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchVitrinProducts();
  }, []);

  if (loading) return <div className="text-center py-10">Ürünler yükleniyor...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-10">Gösterilecek en çok satan ürün bulunamadı.</div>;






  return (
    <section className="bg-white py-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-10">
          
          <div className="lg:w-1/4 mb-8 lg:mb-0 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
               <span className="whitespace-nowrap">En Çok </span>
               Satan Ürünler
            </h2>
            <p className="text-gray-500 mb-6 text-lg">
              Akıllı Ürün Akıllı Seçim
            </p>
            <button
              onClick={handleDiscoverClick} 
              className="bg-sky-100 hover:bg-sky-200 text-sky-700 font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors duration-200 mx-auto lg:mx-0"
              aria-label="En çok satan ürünleri keşfet"
            >
              <span>Keşfet</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {products.map((product) => (
              <ProductCard key={product.urunid} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;