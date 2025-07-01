import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Search } from 'lucide-react';
import TypingEffect from '../Effects/TypingEffect';
const NexoraHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {

      navigate('/products');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (

    <div
      className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 bg-center flex items-center min-h-[45vh] md:min-h-[70vh]" 
      style={{
        backgroundImage: "url('./src/assets/images/sectionHome.jpg')",
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      
      <div className="w-full py-10 z-10">
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black leading-tight">
          Teknoloji
          <br />
          <TypingEffect word="Nexora" />’da
        </h1>

        
        <div className="mt-10 mb-12 flex space-x-12 sm:space-x-16">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-black">201+</p>
            <p className="text-sm sm:text-base text-gray-800 mt-1">Teknoloji Ürünü</p>
          </div>
          <div>
            <p className='text-3xl sm:text-6xl fond-bold text-black'>|</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-black">1204+</p>
            <p className="text-sm sm:text-base text-gray-800 mt-1">Müşteri</p>
          </div>
        </div>

        
        <div className="flex items-center bg-white rounded-xl shadow-lg p-1.5 max-w-md w-full sm:w-auto">
          <input
            type="text"
            placeholder="Bilgisayar veya çevre birimi arayın"
            className="flex-grow bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-500 px-4 py-3 text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            aria-label="Ara"
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg ml-2 transition-colors"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NexoraHero;