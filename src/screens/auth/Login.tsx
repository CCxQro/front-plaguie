import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import CustomButton from '../../components/Button/CustomButton';
import CheckButton from '../../components/CheckButton/CheckButton';
import { login } from '../../services/auth/login';
import useAuthStore from '../../services/Contexts/useAuthStore';
import { getDefaultRoute } from '../../components/ProtectedRoute/routes';

const DEACTIVATED_ACCOUNT_ERROR = 'La cuenta de usuario está desactivada';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [fieldType, setFieldType] = useState('password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(() => {
    const flash = sessionStorage.getItem('login-flash');
    if (flash) {
      sessionStorage.removeItem('login-flash');
      return flash;
    }
    return '';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { user, token } = await login(email, password);
      authLogin(user, token);
      navigate(getDefaultRoute(user.roleId));
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (msg === DEACTIVATED_ACCOUNT_ERROR) {
        setErrorMessage('Tu cuenta ha sido desactivada. Contacta a un administrador.');
      } else {
        setErrorMessage('Correo o contraseña incorrectos. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-auto bg-[#F6F7F7] flex relative">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#75C79E] border-t-transparent" />
            <p className="text-sm font-medium text-[#64748B]">Iniciando sesión...</p>
          </div>
        </div>
      )}

    {/* Left Side */}
    <div className="w-2/3 min-h-screen bg-[rgba(117,199,158,0.1)] flex justify-center items-center relative overflow-hidden">
    
        {/* Imagen de fondo sutil (Textura) */}
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/leaves.png')] opacity-10"></div>

        {/* Content: El "Frame" de la imagen */}
        <div className="relative z-10 w-full max-w-2xl px-12">
            
            {/* Decoración: Círculo difuminado detrás */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#75C79E] opacity-20 blur-3xl rounded-full"></div>

            {/* El Frame de la imagen */}
            <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-white/50 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
                src="https://images.unsplash.com/photo-1543459176-4426b37223ba?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBsYW50c3xlbnwwfHwwfHx8MA%3D%3D" 
                alt="Plaguie Dashboard Preview"
                className="rounded-xl w-full h-auto object-cover shadow-inner"
            />
            
            {/* Badge flotante sobre la imagen */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#75C79E] rounded-full flex items-center justify-center text-white">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                </div>
                <div>
                <p className="text-xs text-gray-500 font-medium">Reportes hoy</p>
                <p className="text-sm font-bold text-gray-800">+24 Plagas detectadas</p>
                </div>
            </div>
            </div>

            {/* Texto inferior opcional */}
            <div className="mt-12 text-center lg:text-left">
            <h1 className="text-4xl font-black text-[#0F172A] mb-2">Plaguie</h1>
            <p className="text-[#334155] font-medium text-lg">
                Control total sobre tus cultivos en tiempo real.
            </p>
            </div>
        </div>
    </div>

      {/* Right Side */}
      <div className="w-1/2 bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex justify-center items-center p-6 relative">
        <div className="w-4/6 space-y-10">
          {/* Welcome */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black leading-9 tracking-[-0.75px] text-[#0F172A]">
              Bienvenido
            </h2>
            <p className="text-base font-normal leading-6 text-[#64748B]">
              Inicia sesión para continuar en la plataforma
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            {errorMessage && (
              <div
                role="alert"
                data-testid="login-error"
                className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            )}
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#334155]">
                Correo electrónico
              </label>
              <InputField
                type="email"
                placeholder="nombre@ejemplo.com"
                height="h-13"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
                <div className="flex flex-col lg:flex-row justify-between items-start sm:items-center gap-2">
                    <label className="text-sm font-semibold leading-5 text-[#334155]">
                        Contraseña
                    </label>
                    <a href="#" className="text-sm font-semibold leading-5 text-[#75C79E]">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
              <div className="relative">
                <InputField
                  type={fieldType}
                  placeholder="••••••••"
                  height="h-13"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2" onClick={() => setFieldType(fieldType === 'password' ? 'text' : 'password')}>
                  <svg width="20.17" height="13.75" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C6.13 0 2.96 2.3 1.5 5.5C2.96 8.7 6.13 11 10 11S17.04 8.7 18.5 5.5C17.04 2.3 13.87 0 10 0ZM10 9C7.79 9 6 7.21 6 5S7.79 1 10 1 14 2.79 14 5 12.21 9 10 9ZM10 3C8.34 3 7 4.34 7 6S8.34 9 10 9 13 7.66 13 6 11.66 3 10 3Z" fill="#94A3B8"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember */}
            <CheckButton
                remember={remember}
                setRemember={setRemember}
                text="Recordar sesión"
            />

            {/* Submit Button */}
            <CustomButton
              title={isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              onPress={() => console.log('Button Pressed inside form')}
              enabled={!isSubmitting}
              bgColor="bg-[#75C79E]"
              fgColor="text-[#0F172A]"
            />
          </form>

          {/* Register */}
          <p className="text-center text-sm font-normal leading-5 text-[#64748B]">
            ¿No tienes cuenta?{' '}
            <a href="#" className="font-bold text-[#75C79E] underline">
              Registrar cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;