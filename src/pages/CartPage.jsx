import React, { useState, useEffect, useCallback } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { Trash2, Plus, Minus, ShoppingBagIcon } from 'lucide-react';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]); 
  const [loadingAddresses, setLoadingAddresses] = useState(false); 
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => { 
    setLoading(true);
    try {
      const response = await apiClient.get('/sepet');
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Sepet yüklenirken hata:', err);
      setError(err.response?.data?.error || 'Sepet yüklenirken bir hata oluştu.');
      if (err.response?.status === 401) { 
        navigate('/login', { state: { from: '/cart' } });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchAddresses = useCallback(async () => { 
    setLoadingAddresses(true);
    try {
      const response = await apiClient.get('/uyeler/profil/adresler');
      setAddresses(response.data || []);
    } catch (err) {
      console.error('Adresler yüklenirken hata:', err);
      
      setAddresses([]); 
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchAddresses(); 
  }, [fetchCart, fetchAddresses]);

  const handleUpdateQuantity = async (sepetUrunID, yeniAdet) => {
    if (yeniAdet < 0) return; 

    if (yeniAdet === 0) {
        handleRemoveItem(sepetUrunID);
        return;
    }
    try {
      await apiClient.put(`/sepet/urun/${sepetUrunID}`, { yeniAdet });
      fetchCart(); 
    } catch (err) {
      console.error('Adet güncellenirken hata:', err);
      alert(err.response?.data?.error || 'Adet güncellenirken bir hata oluştu.');
    }
  };

  const handleRemoveItem = async (sepetUrunID) => {
    if (window.confirm('Bu ürünü sepetten kaldırmak istediğinize emin misiniz?')) {
      try {
        await apiClient.delete(`/sepet/urun/${sepetUrunID}`);
        fetchCart(); 
      } catch (err) {
        console.error('Ürün kaldırılırken hata:', err);
        alert(err.response?.data?.error || 'Ürün sepetten kaldırılırken bir hata oluştu.');
      }
    }
  };
  
  const handleClearCart = async () => {
    if (window.confirm('Sepetinizdeki tüm ürünleri kaldırmak istediğinize emin misiniz?')) {
        try {
            await apiClient.delete('/sepet/bosalt');
            fetchCart(); 
        } catch (err) {
            console.error('Sepet temizlenirken hata:', err);
            alert(err.response?.data?.error || 'Sepet temizlenirken bir hata oluştu.');
        }
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.urunler || cart.urunler.length === 0) {
        alert("Sepetiniz boş.");
        return;
    }

    if (loadingAddresses) {
        alert("Adres bilgileri yükleniyor, lütfen bekleyin.");
        return;
    }

    let selectedAddressId;
    if (addresses.length > 0) {

        selectedAddressId = addresses[0].adresid; 
    } else {
        alert("Sipariş vermek için kayıtlı bir teslimat adresiniz bulunmamaktadır. Lütfen profil sayfanızdan adres ekleyin.");
        navigate('/profile'); 
        return;
    }

    if (!selectedAddressId) { 
        alert("Geçerli bir teslimat adresi seçilemedi. Lütfen profilinizi kontrol edin.");
        return;
    }

    const siparisData = {
      adresID: selectedAddressId,
      sepetUrunleri: cart.urunler.map(item => ({
        urunID: item.urunid,
        adet: item.adet,
        birimFiyatAlinan: parseFloat(item.birimfiyat), 
        toplamFiyatSatir: parseFloat(item.toplamfiyatsatir)
      })),
      toplamTutar: parseFloat(cart.geneltoplam)
    };

    try {
      setLoading(true); 
      const response = await apiClient.post('/siparisler', siparisData);
      
      setCart(null); 
      navigate('/order-success', { state: { orderId: response.data.siparis?.siparisid } }); 
    } catch (err) {
      console.error('Sipariş oluşturulurken hata:', err);
      alert(err.response?.data?.error || 'Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false); 
    }
  };


  if (loading && !cart) return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Sepet Yükleniyor...</p>
      </main>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-xl">{error}</p>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">Anasayfaya Dön</Link>
      </main>
      <Footer />
    </div>
  );
  
  if (!cart || !cart.urunler || cart.urunler.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-semibold mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">Görünüşe göre sepetinize henüz bir şey eklemediniz.</p>
          <Link
            to="/products"
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Alışverişe Başla
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">Sepetim ({cart.urunler.length} ürün)</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {cart.urunler.map((item) => (
            <div key={item.sepeturunid} className="flex flex-col sm:flex-row items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-1/2 lg:w-2/5">
                <img src={item.gorselurl || '/placeholder-image.png'} alt={item.urunadi} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                  <Link to={`/products/${item.urunid}`} className="text-lg font-medium text-gray-800 hover:text-sky-600">{item.urunadi}</Link>
                  <p className="text-sm text-gray-500">Birim Fiyat: {parseFloat(item.birimfiyat).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => handleUpdateQuantity(item.sepeturunid, item.adet - 1)}
                    disabled={item.adet <= 1 && item.adet !==0} 
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-3 py-1 text-center w-12">{item.adet}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.sepeturunid, item.adet + 1)}
                    disabled={item.adet >= item.stokadedi} 
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-md font-semibold text-gray-700 w-28 text-right">
                  {parseFloat(item.toplamfiyatsatir).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
                <button onClick={() => handleRemoveItem(item.sepeturunid)} className="text-red-500 hover:text-red-700 p-2">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
            <button 
                onClick={handleClearCart}
                className="text-sm text-gray-600 hover:text-red-600 hover:underline mb-4 sm:mb-0"
            >
                Sepeti Boşalt
            </button>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800">
  Genel Toplam: {
    (() => {
     
      const total = cart.urunler.reduce((sum, item) => {
        const adet = parseInt(item.adet) || 0;
        const birimFiyat = parseFloat(item.birimfiyat) || 0;
        return sum + (adet * birimFiyat);
      }, 0);
      
      
      return total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    })()
  }
</p>
              <button
                onClick={handleCheckout}
                disabled={loading || loadingAddresses} 
                className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;