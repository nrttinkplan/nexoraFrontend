import React from 'react';
import { Link , useNavigate} from 'react-router-dom';


const categoriesData = [
  {
    id: 1,
    title: "Dizüstü Bilgisayar",
    imageSrc: "./src/assets/images/dizüstüPcCategory.png",
    altText: "Dizüstü bilgisayar illüstrasyonu",
    targetKategoriID: 4,
  },
  {
    id: 2,
    title: "Masaüstü Bilgisayar",
    imageSrc: "./src/assets/images/masaüstüPcCategory.png",
    altText: "Masaüstü bilgisayar illüstrasyonu",
    targetKategoriID: 5, 
  },
  {
    id: 3,
    title: "Klavye & Mouse",
    imageSrc: "./src/assets/images/klavyeMouseCategory.png",
    altText: "Klavye ve mouse illüstrasyonu",
    targetKategoriID: null, 
  },
];

const CategoriesSection = () => {
  const navigate = useNavigate();
  const handleDiscoverClick = () => {
    navigate('/products');
  };

  return (
    <section className="py-12 md:py-16 bg-white">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            KATEGORİLER
          </h2>
          <p className="text-md md:text-lg text-gray-600">
            Aradığınızı bulun
          </p>
        </div>

      
        <div className="bg-sky-100 rounded-lg py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {categoriesData.map((category) => {
              const categoryContent = (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 h-52 md:h-64 w-full flex items-center justify-center">
                    <img
                      src={category.imageSrc} 
                      alt={category.altText}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-700">
                    {category.title}
                  </h3>
                </div>
              );

              
              if (category.targetKategoriID && (category.title === "Dizüstü Bilgisayar" || category.title === "Masaüstü Bilgisayar")) {
                return (
                  <Link
                    to={`/products?kategoriID=${category.targetKategoriID}`}
                    key={category.id}
                    className="block p-4 rounded-lg hover:bg-sky-200/60 transition-colors duration-200"
                  >
                    {categoryContent}
                  </Link>
                );
              }
              
              return (
                <div key={category.id} className="p-4"> 
                  {categoryContent}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <button
              onClick={handleDiscoverClick}
              className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center mx-auto"
              aria-label="Tüm kategorileri keşfet"
            >
              Keşfet
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;