import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { PlusCircle, Edit3, Trash2, XSquare, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    kullaniciadi: '',
    eposta: '',
    ad: '',
    soyad: '',
    telefonno: '',
  });
  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const initialAddressFormState = { 
    adresBasligi: '',
    adresSatiri: '',
    il: '',
    ilce: '',
    postaKodu: '',
  };
  const [addressFormData, setAddressFormData] = useState(initialAddressFormState);

  
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
      transition: { delay: delay * 0.1, duration: 0.4, ease: "easeOut" }
    })
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut", delay: 0.1 } }
  };
  
  const addressCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" }
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const addressFormVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };


  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await apiClient.get('/uyeler/profil');
      const profileData = response.data;
      const currentData = {
        kullaniciadi: profileData.kullaniciadi || '',
        eposta: profileData.eposta || '',
        ad: profileData.ad || '',
        soyad: profileData.soyad || '',
        telefonno: profileData.telefonno || '',
      };
      setUserData(currentData);
      setInitialData(currentData);
    } catch (err) {
      console.error('Profil bilgileri alınırken hata:', err);
      setError(err.response?.data?.error || 'Profil bilgileri yüklenemedi. Lütfen tekrar deneyin.');
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { from: '/profile' } });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    setAddressError('');
    try {
      const response = await apiClient.get('/uyeler/profil/adresler');
      setAddresses(response.data);
    } catch (err) {
      console.error('Adresler alınırken hata:', err);
      setAddressError(err.response?.data?.error || 'Adresler yüklenemedi.');
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login', { state: { from: '/profile' } });
        return;
    }
    fetchUserProfile();
    fetchAddresses();
  }, [fetchUserProfile, fetchAddresses, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    const changedData = {};
    if (userData.ad !== initialData.ad) changedData.ad = userData.ad;
    if (userData.soyad !== initialData.soyad) changedData.soyad = userData.soyad;
    if (userData.eposta !== initialData.eposta) changedData.eposta = userData.eposta;
    if (userData.telefonno !== initialData.telefonno) changedData.telefonno = userData.telefonno;

    if (Object.keys(changedData).length === 0) {
        setSuccessMessage("Profil bilgilerinde değişiklik yapılmadı.");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
        return;
    }
    setLoading(true);
    try {
      const response = await apiClient.put('/uyeler/profil', changedData);
      setSuccessMessage(response.data.message || 'Profil başarıyla güncellendi.');
      const updatedUser = response.data.uye;
      const newCurrentData = {
        kullaniciadi: updatedUser.kullaniciadi || '',
        eposta: updatedUser.eposta || '',
        ad: updatedUser.ad || '',
        soyad: updatedUser.soyad || '',
        telefonno: updatedUser.telefonno || '',
      };
      setUserData(newCurrentData);
      setInitialData(newCurrentData);

      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          ad: updatedUser.ad,
          soyad: updatedUser.soyad,
          eposta: updatedUser.eposta,
        }));
        window.dispatchEvent(new Event('storage')); 
      }
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Profil güncellenirken hata:', err);
      setError(err.response?.data?.error || 'Profil güncellenirken bir hata oluştu.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddAddressForm = () => {
    setEditingAddress(null);
    setAddressFormData(initialAddressFormState); 
    setShowAddressForm(true);
    setAddressError('');
  };

  const handleOpenEditAddressForm = (address) => {
    setEditingAddress(address);
    setAddressFormData({ 
      adresBasligi: address.adresbasligi || '',
      adresSatiri: address.adressatiri || '',
      il: address.il || '',
      ilce: address.ilce || '',
      postaKodu: address.postakodu || '',
    });
    setShowAddressForm(true);
    setAddressError('');
  };
  
  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddressFormData(initialAddressFormState);
    setAddressError('');
  };

  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAddresses(true);
    setAddressError('');
    setSuccessMessage('');
    try {
      if (editingAddress) {
        await apiClient.put(`/uyeler/profil/adresler/${editingAddress.adresid}`, addressFormData);
        setSuccessMessage('Adres başarıyla güncellendi.');
      } else {
        await apiClient.post('/uyeler/profil/adresler', addressFormData);
        setSuccessMessage('Adres başarıyla eklendi.');
      }
      fetchAddresses();
      handleCloseAddressForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Adres kaydedilirken hata:', err);
      setAddressError(err.response?.data?.error || 'Adres kaydedilirken bir hata oluştu.');
      setTimeout(() => setAddressError(''), 3000);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      setLoadingAddresses(true);
      setAddressError('');
      setSuccessMessage('');
      try {
        await apiClient.delete(`/uyeler/profil/adresler/${addressId}`);
        setSuccessMessage('Adres başarıyla silindi.');
        fetchAddresses();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Adres silinirken hata:', err);
        setAddressError(err.response?.data?.error || 'Adres silinirken bir hata oluştu.');
        setTimeout(() => setAddressError(''), 3000);
      } finally {
        setLoadingAddresses(false);
      }
    }
  };

  if (loading && !initialData.kullaniciadi) {
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
          <p className="text-xl">Profil Yükleniyor...</p>
        </motion.main>
        <Footer />
      </div>
    );
  }

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
        <motion.h1 
          className="text-3xl font-semibold mb-8 text-gray-800"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0} // İlk gecikme
        >
          Profilim
        </motion.h1>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {error}
            </motion.div>
          )}
          {successMessage && (
            <motion.div 
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6 max-w-2xl mx-auto mb-12"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          
          <div>
            <label htmlFor="kullaniciadi" className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              name="kullaniciadi"
              id="kullaniciadi"
              value={userData.kullaniciadi}
              readOnly
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Kullanıcı adı değiştirilemez.</p>
          </div>

          <div>
            <label htmlFor="eposta" className="block text-sm font-medium text-gray-700 mb-1">
              E-Posta <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="eposta"
              id="eposta"
              value={userData.eposta}
              onChange={handleChange}
              disabled={!isEditing || loading}
              required
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div>
            <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-1">
              Ad
            </label>
            <input
              type="text"
              name="ad"
              id="ad"
              value={userData.ad || ''}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div>
            <label htmlFor="soyad" className="block text-sm font-medium text-gray-700 mb-1">
              Soyad
            </label>
            <input
              type="text"
              name="soyad"
              id="soyad"
              value={userData.soyad || ''}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div>
            <label htmlFor="telefonno" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon Numarası
            </label>
            <input
              type="tel"
              name="telefonno"
              id="telefonno"
              value={userData.telefonno || ''}
              onChange={handleChange}
              disabled={!isEditing || loading}
              placeholder="Örn: 5xxxxxxxxx"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setUserData(initialData); 
                    setError('');
                  }}
                  disabled={loading}
                  className="w-full sm:w-auto py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || (userData.eposta === initialData.eposta && userData.ad === initialData.ad && userData.soyad === initialData.soyad && userData.telefonno === initialData.telefonno)}
                  className="w-full sm:w-auto py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:bg-sky-300"
                >
                  {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="w-full sm:w-auto py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Profili Düzenle
              </button>
            )}
          </div>
        </motion.form>

        <motion.div 
          className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={1} // İkinci ana bölüm için gecikme
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Adreslerim</h2>
            {!showAddressForm && (
              <motion.button
                onClick={handleOpenAddAddressForm}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusCircle size={18} className="mr-2" /> Yeni Adres Ekle
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {addressError && (
              <motion.div 
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {addressError}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showAddressForm && (
              <motion.form 
                onSubmit={handleAddressFormSubmit} 
                className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4 overflow-hidden"
                variants={addressFormVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h3 className="text-lg font-medium text-gray-900">{editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
                
                <div>
                  <label htmlFor="adresBasligi" className="block text-sm font-medium text-gray-700">Adres Başlığı <span className="text-red-500">*</span></label>
                  <input type="text" name="adresBasligi" id="adresBasligi" value={addressFormData.adresBasligi} onChange={handleAddressFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Ev, İş vb."/>
                </div>
                <div>
                  <label htmlFor="adresSatiri" className="block text-sm font-medium text-gray-700">Adres Satırı <span className="text-red-500">*</span></label>
                  <textarea name="adresSatiri" id="adresSatiri" value={addressFormData.adresSatiri} onChange={handleAddressFormChange} required rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Mahalle, cadde, sokak, no, daire"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="il" className="block text-sm font-medium text-gray-700">İl <span className="text-red-500">*</span></label>
                    <input type="text" name="il" id="il" value={addressFormData.il} onChange={handleAddressFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                  <div>
                    <label htmlFor="ilce" className="block text-sm font-medium text-gray-700">İlçe <span className="text-red-500">*</span></label>
                    <input type="text" name="ilce" id="ilce" value={addressFormData.ilce} onChange={handleAddressFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <div>
                    <label htmlFor="postaKodu" className="block text-sm font-medium text-gray-700">Posta Kodu</label>
                    <input type="text" name="postaKodu" id="postaKodu" value={addressFormData.postaKodu} onChange={handleAddressFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={handleCloseAddressForm} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    <XSquare size={18} className="mr-2"/> İptal
                  </button>
                  <button type="submit" disabled={loadingAddresses} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50">
                    <Save size={18} className="mr-2"/> {loadingAddresses ? 'Kaydediliyor...' : (editingAddress ? 'Güncelle' : 'Kaydet')}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {loadingAddresses && !showAddressForm && <p className="text-gray-600">Adresler yükleniyor...</p>}
          {!loadingAddresses && addresses.length === 0 && !showAddressForm && (
            <motion.p 
              className="text-gray-600 text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Kayıtlı adresiniz bulunmamaktadır.
            </motion.p>
          )}
          {!showAddressForm && addresses.length > 0 && (
            <motion.div 
              className="space-y-4"

            >
              <AnimatePresence>
                {addresses.map((address, index) => (
                  <motion.div 
                    key={address.adresid} 
                    className="p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow"
                    variants={addressCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index} 
                    layout 
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{address.adresbasligi}</h4>
                        <p className="text-sm text-gray-600">{address.adressatiri}</p>
                        <p className="text-sm text-gray-600">{address.ilce} / {address.il} {address.postakodu && `- ${address.postakodu}`}</p>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0 ml-2">
                        <button onClick={() => handleOpenEditAddressForm(address)} className="p-1 text-sky-600 hover:text-sky-800" title="Düzenle">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDeleteAddress(address.adresid)} className="p-1 text-red-500 hover:text-red-700" title="Sil">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default ProfilePage;