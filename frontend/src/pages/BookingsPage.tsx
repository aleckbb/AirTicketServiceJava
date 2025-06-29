import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plane, Plus, X } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { Booking } from '../types';
import Layout from '../components/Layout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookings();
      setBookings(data);
    } catch {
      setError('Не удалось загрузить бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Отменить это бронирование?')) return;
    try {
      await apiService.cancelBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch {
      alert('Ошибка: не удалось отменить бронирование');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LoadingSpinner />
          </div>
        </Layout>
    );
  }

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Мои бронирования</h1>
              <p className="text-gray-600 mt-2">Управляйте своими авиабронированиями</p>
            </div>
            <button
                onClick={() => navigate('/flights')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Забронировать новый рейс</span>
            </button>
          </div>

          {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
          )}

          {/* Bookings List */}
          {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900">Пока нет бронирований</h3>
                <p className="text-gray-600 mb-6">Начните планировать своё следующее путешествие!</p>
                <button
                    onClick={() => navigate('/flights')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Посмотреть рейсы
                </button>
              </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Flight Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {booking.flight.flightNumber}
                          </h3>
                          <p className="text-sm text-gray-600">{booking.flight.airplaneModel}</p>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Откуда</p>
                          <p className="font-semibold text-gray-900">{booking.flight.origin.split(' ')[0]}</p>
                        </div>
                        <div className="flex-1 relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 border-dashed"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <Plane className="h-5 w-5 text-blue-600 bg-white p-1 rounded-full" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Куда</p>
                          <p className="font-semibold text-gray-900">{booking.flight.destination.split(' ')[0]}</p>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(booking.flight.departureTime)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                      {formatTime(booking.flight.departureTime)} – {formatTime(booking.flight.arrivalTime)}
                    </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Место {booking.seatNumber}</span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-lg font-bold text-gray-900">₽{booking.flight.price}</p>
                          <p className="text-xs text-gray-500">Итого</p>
                        </div>
                        <button
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Отменить бронирование"
                            onClick={() => handleCancel(booking.id)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </Layout>
  );
};

export default BookingsPage;
