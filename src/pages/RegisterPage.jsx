import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kullaniciAdi: '',
    eposta: '',
    sifre: '',
    ad: '',
    soyad: '',
    telefonNo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.sifre.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/uyeler/kayit', formData);
      setSuccess(response.data.message + ' Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };
  
  const formItemVariants = {
    initial: { opacity: 0, x: -20 },
    in: (delay = 0) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.3 + delay * 0.08, duration: 0.4, ease: "easeOut" } 
    }),
  };

  return (
    <div className="flex min-h-screen font-sans">
      <motion.div
        className="w-1/3 bg-cover bg-center hidden md:flex flex-col items-start justify-start p-8"
        style={{
          backgroundImage: "url('/src/assets/images/loginPhoto.jpg')",
        }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
      </motion.div>

      <motion.div 
        className="w-full md:w-2/3 bg-white flex flex-col p-6 sm:p-10 lg:p-12"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <motion.div 
            className="mb-8" 
            variants={formItemVariants} 
            custom={0} 
        >
          <Link to="/"><h1 className="text-3xl font-semibold text-gray-700">Nexora</h1></Link>
        </motion.div>

        <div className="flex flex-col items-center justify-center flex-grow w-full">
          <motion.div 
            className="w-full max-w-md"
            initial="initial"
            animate="in"
            variants={{ in: { transition: { staggerChildren: 0.05 } } }} 
          >
            <motion.div className="mb-6 text-center" variants={formItemVariants} custom={1}>
              <h2 className="text-3xl font-bold text-black">
                <span role="img" aria-label="waving hand">👋</span> Merhaba
              </h2>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                Nexora'ya Kayıt Ol
              </p>
            </motion.div>

            {error && <motion.div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm" variants={formItemVariants} custom={2}>{error}</motion.div>}
            {success && <motion.div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm" variants={formItemVariants} custom={2}>{success}</motion.div>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <motion.div variants={formItemVariants} custom={3}>
                <label
                  htmlFor="kullaniciAdi"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Kullanıcı Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kullaniciAdi"
                  id="kullaniciAdi"
                  value={formData.kullaniciAdi}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </motion.div>

              <motion.div variants={formItemVariants} custom={4}>
                <label
                  htmlFor="eposta"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  E-Posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="eposta"
                  id="eposta"
                  value={formData.eposta}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </motion.div>

              <motion.div variants={formItemVariants} custom={5}>
                <label
                  htmlFor="sifre"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Şifre <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="sifre"
                  id="sifre"
                  value={formData.sifre}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </motion.div>

              <motion.div variants={formItemVariants} custom={6}>
                <label
                  htmlFor="ad"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Ad
                </label>
                <input
                  type="text"
                  name="ad"
                  id="ad"
                  value={formData.ad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </motion.div>

              <motion.div variants={formItemVariants} custom={7}>
                <label
                  htmlFor="soyad"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Soyad
                </label>
                <input
                  type="text"
                  name="soyad"
                  id="soyad"
                  value={formData.soyad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </motion.div>

              <motion.div variants={formItemVariants} custom={8}>
                <label
                  htmlFor="telefonNo"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Telefon No
                </label>
                <input
                  type="tel"
                  name="telefonNo"
                  id="telefonNo"
                  value={formData.telefonNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                />
              </motion.div>

              <motion.div className="flex justify-center pt-2" variants={formItemVariants} custom={9}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center items-center py-2 px-5 sm:px-8 border border-transparent rounded-lg shadow-md text-base font-semibold text-gray-700 bg-sky-200 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150 disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Kayıt Ol'} <span className="ml-2">→</span>
                </button>
              </motion.div>
            </form>

            <motion.div className="mt-8 text-center" variants={formItemVariants} custom={10}>
              <div className="mt-2 flex flex-col items-center">
                <span className="text-xs text-gray-600">Hesabınız Var Mı? </span>
                <Link to="/login" className="text-xs font-medium text-sky-600 hover:underline mt-1">
                  Giriş Yapın
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;