import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Layout from '../components/Layout.tsx';

const RegisterPage: React.FC = () => {
  const [data, setData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
      setData({ ...data, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) return setError('Пароли не совпадают');
    setLoading(true); setError('');
    try { await register(data.username, data.email, data.password); nav('/bookings'); }
    catch { setError('Регистрация не удалась. Попробуйте ещё раз.'); }
    finally { setLoading(false); }
  };

  return (
      <Layout showHeader={false}>
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <Header />

            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              <form onSubmit={submit} className="space-y-6">
                {error && <Err msg={error} />}

                <Field id="username" label="Имя пользователя" type="text" icon={<UserIcon />} value={data.username} onChange={change} placeholder="Придумайте имя пользователя" />

                <Field id="email" label="Адрес электронной почты" type="email" icon={<MailIcon />} value={data.email} onChange={change} placeholder="Введите email" />

                <Field id="password" label="Пароль" type={showPwd ? 'text' : 'password'} icon={<LockIcon />}
                       value={data.password} onChange={change} placeholder="Создайте пароль"
                       toggle={() => setShowPwd(!showPwd)} show={showPwd} />

                <Field id="confirmPassword" label="Подтвердите пароль" type={showConf ? 'text' : 'password'} icon={<LockIcon />}
                       value={data.confirmPassword} onChange={change} placeholder="Подтвердите пароль"
                       toggle={() => setShowConf(!showConf)} show={showConf} />

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg disabled:opacity-50">
                  {loading ? 'Создание аккаунта…' : 'Создать аккаунт'}
                </button>
              </form>

              <p className="mt-6 text-center text-gray-600">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Войдите</Link>
              </p>
            </div>
          </div>
        </div>
      </Layout>
  );
};

/* ----- Вспомогательные компоненты ----- */
const Header = () => (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
          <Plane className="h-8 w-8 text-white" />
        </div>
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Создайте аккаунт
      </h2>
      <p className="text-gray-600 mt-2">Присоединяйтесь, чтобы бронировать авиабилеты</p>
    </div>
);

const Err: React.FC<{ msg: string }> = ({ msg }) => (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{msg}</div>
);

const UserIcon = () => <User className="h-5 w-5 text-gray-400" />;
const MailIcon = () => <Mail className="h-5 w-5 text-gray-400" />;
const LockIcon = () => <Lock className="h-5 w-5 text-gray-400" />;

interface P {
  id: string; label: string; type: string; icon: React.ReactNode;
  value: string; onChange: any; placeholder: string; toggle?: () => void; show?: boolean;
}
const Field: React.FC<P> = ({ id, label, type, icon, value, onChange, placeholder, toggle, show }) => (
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
            onChange={onChange}
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

export default RegisterPage;
