import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 

const ProductCard = ({ product }) => {

  return (
    <div className="flex flex-col h-full items-center text-center p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-white group-hover:border-sky-500">
      <div className="w-full aspect-[1/1] flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={product.gorselurl || 'https://via.placeholder.com/150?text=Görsel+Yok'} 
          alt={product.urunadi}
          className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 h-14 overflow-hidden flex items-center justify-center">
        {product.urunadi}
      </h3>
      <p className="text-md text-gray-600 mb-2">
        {product.birimfiyat ? product.birimfiyat.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : 'N/A'}
      </p>
      <button
        className="mt-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 w-full"
        onClick={(e) => {
          e.preventDefault(); 
          
          console.log(`${product.urunadi} sepete eklendi! (Buton işlevselliği eklenecek)`);
          
        }}
      >
        Sepete Ekle
      </button>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); 

  
  const filterButtonContainerVariants = {
    hidden: { opacity: 1 }, 
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, 
      },
    },
  };

  const filterButtonItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const productGridContainerVariants = {
    hidden: { opacity: 0 }, 
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, 
        delayChildren: 0.2, 
      },
    },
  };

  const productItemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };


  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryIdFromUrl = params.get('kategoriID');
    const searchQueryFromUrl = params.get('search');

    setSelectedCategoryId(categoryIdFromUrl || null);
    setSearchQuery(searchQueryFromUrl || '');

  }, [location.search]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/kategoriler');
        setCategories(response.data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let isActive = true; 

    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:3000/api/urunler';
        const queryParams = new URLSearchParams();

        if (selectedCategoryId) {
          queryParams.append('kategoriID', selectedCategoryId);
        }
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const response = await axios.get(url);
        if (isActive) { 
          setProducts(response.data);
          setError(null);
        }
      } catch (error) {
        console.error('Ürünler yüklenirken hata oluştu:', error);
        if (isActive) { 
          setError('Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
          setProducts([]);
        }
      } finally {
        if (isActive) { 
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false; 
    };
  }, [selectedCategoryId, searchQuery]);

  
  let pageTitle = "Tüm Ürünler";
  const currentCategory = categories.find(c => String(c.kategoriid) === String(selectedCategoryId));

  if (searchQuery) {
    pageTitle = `"${searchQuery}" için arama sonuçları`;
    if (currentCategory) {
      pageTitle += ` (${currentCategory.kategoriadi} kategorisinde)`;
    }
  } else if (currentCategory) {
    pageTitle = `${currentCategory.kategoriadi} Kategorisindeki Ürünler`;
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    const params = new URLSearchParams(location.search);
    if (categoryId) {
      params.set('kategoriID', categoryId);
    } else {
      params.delete('kategoriID');
    }
    navigate({ search: params.toString() });
  };


  
  if (loading && products.length === 0 && !error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-10 text-xl text-gray-700">Ürünler yükleniyor...</div>
        </main>
        <Footer />
      </div>
    );
  }

  
  if (error && products.length === 0 && !loading) { 
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-10 text-red-500">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {pageTitle}
        </motion.h1>

        
        {categories.length > 0 && (
          <motion.div 
            className="mb-8 flex flex-wrap justify-center items-center gap-2 sm:gap-3"
            variants={filterButtonContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              key="tumu-kategorisi"
              variants={filterButtonItemVariants}
              onClick={() => handleCategoryChange(null)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                !selectedCategoryId ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.kategoriid}
                variants={filterButtonItemVariants}
                onClick={() => handleCategoryChange(String(category.kategoriid))}
                className={`py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  String(selectedCategoryId) === String(category.kategoriid) ? 'bg-sky-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.kategoriadi}
              </motion.button>
            ))}
          </motion.div>
        )}
        
        {loading && products.length > 0 && <div className="text-center py-5 text-gray-600">Ürünler güncelleniyor...</div>}
        
        {error && !loading && <div className="text-center py-5 text-red-500">{error}</div>}

        {!loading && products.length === 0 && !error && (
          <motion.p 
            className="text-center text-gray-600 text-lg py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {searchQuery || selectedCategoryId ? "Aradığınız kriterlere uygun ürün bulunamadı." : "Gösterilecek ürün bulunamadı."}
          </motion.p>
        )}

        {products.length > 0 && !error && ( 
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8"
            key={selectedCategoryId + searchQuery} 
            variants={productGridContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <motion.div
                key={product.urunid}
                variants={productItemVariants}
                
              >
                <Link
                  to={`/products/${product.urunid}`}
                  className="block group focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-lg h-full" 
                >
                  <ProductCard product={product} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;