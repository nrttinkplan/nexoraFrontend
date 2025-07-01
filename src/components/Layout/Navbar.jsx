import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Anasayfa', href: '/' },
    { name: 'Ürünler', href: '/products' },
 
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  return (
    <nav className="bg-white mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-semibold text-gray-800">
              Nexora
            </Link>
          </div>

          
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          
          <div className="flex items-center">
            
            <div className="hidden md:flex items-center space-x-4">
              {currentUser && (
                <Link
                  to="/cart"
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  aria-label="Sepetim"
                >
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
              )}
              
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  aria-label="User Account"
                  aria-expanded={isUserMenuOpen}
                  id="user-menu-button"
                  aria-haspopup="true"
                >
                  {currentUser ? <UserCircleIcon className="h-7 w-7 text-sky-600" /> : <UserIcon className="h-6 w-6" aria-hidden="true" />}
                </button>
                {isUserMenuOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    {currentUser ? (
                      <>
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.kullaniciAdi || `${currentUser.ad} ${currentUser.soyad}`}
                          </p>
                          {currentUser.eposta && <p className="text-xs text-gray-500 truncate">{currentUser.eposta}</p>}
                        </div>
                        <div className="border-t border-gray-100"></div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profilim
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Siparişlerim
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Çıkış Yap
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Giriş Yap
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Üye Ol
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            
            <div className="md:hidden flex items-center ml-2">
              {currentUser && (
                <Link
                  to="/cart"
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none"
                  aria-label="Sepetim"
                  onClick={() => setIsMobileMenuOpen(false)} 
                >
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Ana menüyü aç</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:bg-gray-50 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {currentUser ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-base font-medium text-gray-800 truncate">
                      {currentUser.kullaniciAdi || `${currentUser.ad} ${currentUser.soyad}`}
                    </p>
                    {currentUser.eposta && <p className="text-sm text-gray-500 truncate">{currentUser.eposta}</p>}
                  </div>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:bg-gray-50 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profilim
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:bg-gray-50 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Siparişlerim
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left text-gray-700 hover:bg-gray-50 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:bg-gray-50 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:bg-gray-50 hover:text-black block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Üye Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;