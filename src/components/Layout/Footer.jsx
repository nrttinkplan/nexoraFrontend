

import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-blue-200 py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 lg:col-span-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Nexora</h1>
            <p className="text-base md:text-lg mb-6">
              Hayalinizdeki Teknolojiyi Bulmanıza Yardımcı Oluyoruz.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-blue-900 hover:bg-blue-700 text-white flex items-center justify-center transition-colors duration-300"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-blue-900 hover:bg-blue-700 text-white flex items-center justify-center transition-colors duration-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-blue-900 hover:bg-blue-700 text-white flex items-center justify-center transition-colors duration-300"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          
          <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Bilgi</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Ürün</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Şirket</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Toplum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hikayemiz</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kaynaklar</a></li>
              </ul>
            </div>
          </div>
        </div>

        
        <div className="mt-12 pt-8 border-t border-blue-700 text-center md:text-left">
          <p className="text-sm text-blue-300">
            2025 all Right Reserved Term of use Nexora
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;