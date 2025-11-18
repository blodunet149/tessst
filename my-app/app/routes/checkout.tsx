import { useState } from 'react';
import { useCart } from '../components/food/cart-context';
import { useNavigate } from "react-router";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/food/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: cartTotal,
          deliveryAddress,
          paymentMethod
        }),
      });

      if (response.ok) {
        const result = await response.json();
        clearCart(); // Clear cart after successful order
        alert(`Pesanan berhasil! Order ID: ${result.order.id}`);
        navigate('/orders'); // Redirect to order history
      } else {
        const error = await response.json();
        alert(`Gagal membuat pesanan: ${error.error}`);
      }
    } catch (error) {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-2 text-gray-600">Keranjang Anda kosong</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/menu')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Lihat Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Checkout</h3>
          </div>
          
          <form onSubmit={handlePlaceOrder} className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Ringkasan Pesanan</h4>
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item.id} className="py-4 flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} x Rp {item.price.toLocaleString()}</p>
                    </div>
                    <p className="font-medium text-gray-900">Rp {(item.price * item.quantity).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>Rp {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                Alamat Pengiriman
              </label>
              <textarea
                id="deliveryAddress"
                rows={3}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
              <div className="mt-2 space-y-4">
                <div className="flex items-center">
                  <input
                    id="cash"
                    name="paymentMethod"
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery (COD)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="bank-transfer"
                    name="paymentMethod"
                    type="radio"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                    Bank Transfer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="credit-card"
                    name="paymentMethod"
                    type="radio"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                    Kartu Kredit/Debit
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kembali ke Keranjang
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  `Bayar Rp ${cartTotal.toLocaleString()}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}