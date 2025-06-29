import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Layout from '../components/Layout.tsx';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); navigate('/bookings'); }
    catch { setError('Неверный email или пароль'); }
    finally { setLoading(false); }
  };

  return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            {/* Логотип */}
            <LogoSection />

            {/* Форма входа */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              <form onSubmit={submit} className="space-y-6">
                {error && <Err msg={error} />}

                <InputField
                    id="email"
                    label="Адрес электронной почты"
                    type="email"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    value={email}
                    onChange={setEmail}
                    placeholder="Введите email"
                />

                <InputField
                    id="password"
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                    value={password}
                    onChange={setPassword}
                    placeholder="Введите пароль"
                    toggle={() => setShowPassword(!showPassword)}
                    show={showPassword}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Вход…' : 'Войти'}
                </button>
              </form>

              <p className="mt-6 text-center text-gray-600">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Создайте аккаунт</Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
  );
};

/* ----- Вспомогательные компоненты ----- */
const LogoSection = () => (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
          <Plane className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        С возвращением
      </h2>
      <p className="text-gray-600 mt-2">Войдите в аккаунт, чтобы продолжить</p>
    </div>
);

const Err: React.FC<{ msg: string }> = ({ msg }) => (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{msg}</div>
);

interface FieldProps {
  id: string; label: string; type: string; icon: React.ReactNode;
  value: string; onChange: (v: string)=>void; placeholder: string;
  toggle?: ()=>void; show?: boolean;
}
const InputField: React.FC<FieldProps> = ({ id, label, type, icon, value, onChange, placeholder, toggle, show }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input
            id={id}
            name={id}
            type={type}
            required
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50"
        />
        {toggle && (
            <button type="button" onClick={toggle} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {show ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
        )}
      </div>
    </div>
);

export default LoginPage;
