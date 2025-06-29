import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api.ts';
import { Flight } from '../types';
import Layout from '../components/Layout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const FlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadFlights(); }, []);

  const loadFlights = async () => {
    try { setFlights(await apiService.getFlights()); }
    catch { setError('Не удалось загрузить список рейсов'); }
    finally { setLoading(false); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' });
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const duration = (dep: string, arr: string) => {
    const diff = new Date(arr).getTime() - new Date(dep).getTime();
    const h = Math.floor(diff / 3_600_000); const m = Math.floor((diff % 3_600_000) / 60_000);
    return `${h}ч ${m}м`;
  };

  if (loading) return <Layout><LoadingSpinnerSection/></Layout>;

  return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Доступные рейсы</h1>
            <p className="text-gray-600 mt-2">Выберите идеальный рейс из нашего списка</p>
          </header>

          {error && <ErrorBanner message={error} />}

          <div className="space-y-6">
            {flights.map(f => (
                <div
                    key={f.id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 hover:-translate-y-1 transition cursor-pointer"
                    onClick={() => navigate(`/flights/${f.id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Инфо о рейсе */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{f.flightNumber}</h3>
                          <p className="text-sm text-gray-600">{f.airplaneModel}</p>
                        </div>
                      </div>

                      {/* Маршрут + время */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <TimeCol time={fmtTime(f.departureTime)} place={f.origin} date={fmtDate(f.departureTime)} align="left" />
                        <DurationCol dur={duration(f.departureTime, f.arrivalTime)} />
                        <TimeCol time={fmtTime(f.arrivalTime)} place={f.destination} date={fmtDate(f.arrivalTime)} align="right" />
                      </div>
                    </div>

                    {/* Цена + кнопка */}
                    <div className="mt-6 lg:mt-0 lg:ml-8 text-center lg:text-right">
                      <p className="text-3xl font-bold">₽{f.price}</p>
                      <p className="text-sm text-gray-600 mb-4">за пассажира</p>
                      <button
                          onClick={e => { e.stopPropagation(); navigate(`/flights/${f.id}`); }}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:-translate-y-0.5 transition"
                      >
                        Выбрать рейс
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </Layout>
  );
};

/* ----- Вспомогательные компоненты ----- */
const LoadingSpinnerSection = () => (
    <div className="max-w-7xl mx-auto px-4 py-8"><LoadingSpinner /></div>
);
const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{message}</div>
);
const TimeCol: React.FC<{ time: string; place: string; date: string; align: 'left'|'right' }> = ({ time, place, date, align }) => (
    <div className={`text-center md:text-${align}`}>
      <p className="text-2xl font-bold">{time}</p>
      <p className="text-sm text-gray-600">{place}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
);
const DurationCol: React.FC<{ dur: string }> = ({ dur }) => (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <div className="h-0.5 w-8 bg-gray-300" /><ArrowRight className="h-4 w-4 text-gray-400" /><div className="h-0.5 w-8 bg-gray-300" />
      </div>
      <p className="text-sm text-gray-600">{dur}</p>
      <p className="text-xs text-gray-500">Без пересадок</p>
    </div>
);

export default FlightsPage;
