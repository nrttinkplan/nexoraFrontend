import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kullaniciAdiVeyaEposta: '',
    sifre: '',
  });
  const [error, setError] = useState('');
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
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/uyeler/giris', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.uye));
      navigate('/');
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
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

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } },
  };
  
  const formItemVariants = {
    initial: { opacity: 0, x: -20 },
    in: (delay = 0) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.3 + delay * 0.1, duration: 0.4, ease: "easeOut" } 
    }),
  };


  return (
    <div className="flex min-h-screen font-sans">
      <motion.div
        className="w-1/3 bg-cover bg-center hidden md:flex flex-col items-start justify-start p-10"
        style={{
          backgroundImage: "url('/src/assets/images/loginPhoto.jpg')",
        }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        
      </motion.div>

      <motion.div 
        className="w-full md:w-2/3 bg-white flex flex-col p-6 sm:p-12 lg:p-20"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <motion.div className="mb-12" variants={itemVariants}>
          <Link to="/"><h1 className="text-3xl font-semibold text-gray-700">Nexora</h1></Link>
        </motion.div>

        <div className="flex flex-col items-center justify-center flex-grow w-full">
          <motion.div 
            className="w-full max-w-md"
            initial="initial"
            animate="in"
            variants={{ in: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div className="mb-8 text-center" variants={formItemVariants} custom={0}>
              <h2 className="text-4xl font-bold text-black">
                <span role="img" aria-label="waving hand">👋</span> Merhaba
              </h2>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                Nexora'ya Giriş Yap
              </p>
            </motion.div>

            {error && <motion.div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm" variants={formItemVariants} custom={1}>{error}</motion.div>}

            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={formItemVariants} custom={2}>
                <label
                  htmlFor="kullaniciAdiVeyaEposta"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kullanıcı Adı veya E-posta
                </label>
                <input
                  type="text"
                  name="kullaniciAdiVeyaEposta"
                  id="kullaniciAdiVeyaEposta"
                  value={formData.kullaniciAdiVeyaEposta}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </motion.div>

              <motion.div variants={formItemVariants} custom={3}>
                <label
                  htmlFor="sifre"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Şifre
                </label>
                <input
                  type="password"
                  name="sifre"
                  id="sifre"
                  value={formData.sifre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </motion.div>

              <motion.div className="flex justify-center" variants={formItemVariants} custom={4}>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center items-center py-3 px-8 border border-transparent rounded-xl shadow-md text-lg font-semibold text-gray-700 bg-sky-200 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150 disabled:opacity-50"
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} <span className="ml-2">→</span>
                </button>
              </motion.div>
            </motion.form>

            <motion.div className="mt-12 text-center" variants={formItemVariants} custom={5}>
              <button type="button" className="text-lg font-semibold text-gray-800 hover:text-sky-600">
                Şifremi Unuttum
              </button>
              <div className="mt-3 flex flex-col items-center">
                <span className="text-sm text-gray-600">Henüz Hesabınız Yok Mu? </span>
                <Link to="/register" className="text-sm font-medium text-sky-600 hover:underline mt-1">
                  Kayıt Olun
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;