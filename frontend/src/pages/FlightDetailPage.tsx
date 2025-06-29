import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Plane, ArrowLeft, Check } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { Flight } from '../types';
import { useAuth } from '../contexts/AuthContext.tsx';
import Layout from '../components/Layout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const FlightDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const flights = await apiService.getFlights();
      const found = flights.find(f => f.id === Number(id));
      if (!found) {
        setError('Рейс не найден');
        return;
      }
      setFlight(found);
      const available = await apiService.getAvailableSeats(found.id);
      setSeats(available);
    } catch {
      setError('Не удалось загрузить данные рейса');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeat = async () => {
    if (!selectedSeat || !user || !flight) return;
    try {
      setBooking(true);
      await apiService.bookSeat({ flightId: flight.id, seatNumber: selectedSeat });
      navigate('/bookings');
    } catch {
      setError('Не удалось забронировать место');
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (d: string) =>
      new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = (d: string) =>
      new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });

  const calcDuration = (dep: string, arr: string) => {
    const diff = new Date(arr).getTime() - new Date(dep).getTime();
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return `${h}ч ${m}м`;
  };

  const rows = Array.from({ length: 20 }, (_, i) => i + 1);
  const seatStatus = (num: string) =>
      seats.includes(num) ? (selectedSeat === num ? 'selected' : 'available') : 'occupied';
  const seatClass = (s: string) =>
      s === 'available'
          ? 'bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
          : s === 'selected'
              ? 'bg-blue-600 border-2 border-blue-600 text-white'
              : 'bg-gray-300 border-2 border-gray-300 text-gray-500 cursor-not-allowed';

  if (loading || !flight)
    return (
        <Layout>
          <div className="max-w-7xl mx-auto px-4 py-8"><LoadingSpinner /></div>
        </Layout>
    );

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Назад */}
          <button
              onClick={() => navigate('/flights')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Назад к рейсам</span>
          </button>

          {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Карточка рейса */}
            <div>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 sticky top-24">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <Plane className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{flight.flightNumber}</h2>
                    <p className="text-gray-600">{flight.airplaneModel}</p>
                  </div>
                </div>

                <InfoRow label="Откуда" value={flight.origin} />
                <InfoRow label="Куда" value={flight.destination} className="mt-4" />

                <div className="space-y-2 my-6">
                  <IconRow icon={<Calendar />} text={formatDate(flight.departureTime)} />
                  <IconRow
                      icon={<Clock />}
                      text={`${formatTime(flight.departureTime)} – ${formatTime(flight.arrivalTime)}`}
                  />
                  <IconRow
                      icon={<MapPin />}
                      text={`Длительность: ${calcDuration(flight.departureTime, flight.arrivalTime)}`}
                  />
                </div>

                {selectedSeat && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center space-x-2">
                      <Check className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Выбранное место: {selectedSeat}</span>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Итого:</span>
                    <span className="text-2xl font-bold">₽{flight.price}</span>
                  </div>
                  <button
                      onClick={handleBookSeat}
                      disabled={!selectedSeat || booking}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"
                  >
                    {booking ? 'Бронирование…' : selectedSeat ? 'Забронировать место' : 'Выберите место'}
                  </button>
                </div>
              </div>
            </div>

            {/* Схема мест */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold mb-6">Выберите место</h3>

                {/* Легенда с корректным цветом */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm">
                  <Legend color="bg-white border-2 border-gray-300" label="Свободно" />
                  <Legend color="bg-blue-600" label="Выбрано" />
                  <Legend color="bg-gray-300" label="Занято" />
                </div>

                <div className="bg-gray-100 rounded-3xl p-6 max-w-md mx-auto">
                  <div className="w-full h-8 bg-gray-300 rounded-t-full mb-4" />

                  {rows.map(r => (
                      <SeatRow
                          key={r}
                          row={r}
                          seatStatus={seatStatus}
                          seatClass={seatClass}
                          onSelect={setSelectedSeat}
                      />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
  );
};

/* ---------- Вспомогательные компоненты ---------- */
const InfoRow: React.FC<{ label: string; value: string; className?: string }> = ({ label, value, className }) => (
    <div className={`space-y-1 ${className ?? ''}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
);

const IconRow: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-2">
      {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4 text-gray-400' })}
      <span className="text-sm text-gray-600">{text}</span>
    </div>
);

const Legend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center space-x-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span>{label}</span>
    </div>
);

const SeatRow: React.FC<{
  row: number;
  seatStatus: (n: string) => string;
  seatClass: (s: string) => string;
  onSelect: (n: string) => void;
}> = ({ row, seatStatus, seatClass, onSelect }) => {
  const renderSeat = (letter: string) => {
    const num = `${row}${letter}`;
    const status = seatStatus(num);
    return (
        <button
            key={num}
            onClick={() => status === 'available' && onSelect(num)}
            disabled={status === 'occupied'}
            className={`w-8 h-8 rounded text-xs font-medium ${seatClass(status)}`}
        >
          {letter}
        </button>
    );
  };
  return (
      <div className="flex items-center space-x-2">
        <div className="w-6 text-xs text-gray-500 text-center">{row}</div>
        <div className="flex space-x-1">{['A', 'B', 'C'].map(renderSeat)}</div>
        <div className="w-4" />
        <div className="flex space-x-1">{['D', 'E', 'F'].map(renderSeat)}</div>
      </div>
  );
};

export default FlightDetailPage;
