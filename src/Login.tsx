import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password, 'Remember:', remember);
  };

  return (
    <div className="w-7xl h-256 bg-[#F6F7F7] flex mx-auto">
      {/* Left Side */}
      <div className="w-3xl h-full bg-[rgba(117,199,158,0.1)] flex justify-center items-center p-12 relative">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/768x1024.jpg?text=Background')] opacity-20"></div>

        {/* Content */}
        <div className="max-w-md h-[287.75px] relative z-10">
          {/* Icon Background */}
          <div className="w-24 h-[78.48px] bg-[#75C79E] rounded-3xl shadow-[0px_10px_15px_-3px_rgba(117,199,158,0.2),0px_4px_6px_-4px_rgba(117,199,158,0.2)] flex justify-center items-center mb-4">
            <div className="w-[42.49px] h-[42.48px] bg-white rounded-full flex justify-center items-center">
              {/* Simple Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#75C79E"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black leading-12 tracking-[-1.2px] text-[#0F172A] text-center mb-4">
            Plaguie
          </h1>

          {/* Subtitle */}
          <p className="text-lg font-medium leading-7 text-[#334155] text-center">
            Sistema de gestión de plagas
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-lg h-full bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex justify-center items-center p-12 relative">
        <div className="w-[320px] space-y-10">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold leading-5 text-[#334155]">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full h-13 px-4 py-4 bg-white border border-[#CBD5E1] rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-sm text-[#94A3B8]"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold leading-5 text-[#334155]">
                  Contraseña
                </label>
                <a href="#" className="text-sm font-semibold leading-5 text-[#75C79E]">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-13 px-4 pr-12 py-4 bg-white border border-[#CBD5E1] rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-sm text-[#94A3B8]"
                  required
                />
                <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg width="20.17" height="13.75" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C6.13 0 2.96 2.3 1.5 5.5C2.96 8.7 6.13 11 10 11S17.04 8.7 18.5 5.5C17.04 2.3 13.87 0 10 0ZM10 9C7.79 9 6 7.21 6 5S7.79 1 10 1 14 2.79 14 5 12.21 9 10 9ZM10 3C8.34 3 7 4.34 7 6S8.34 9 10 9 13 7.66 13 6 11.66 3 10 3Z" fill="#94A3B8"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 border border-[#CBD5E1] rounded"
              />
              <label className="text-sm font-normal leading-5 text-[#475569]">
                Recordar sesión
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-13 bg-[#75C79E] text-[#0F172A] font-bold text-sm leading-6 rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 text-sm font-medium leading-6 text-[#94A3B8]">
                O continúa con
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 h-10 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg flex justify-center items-center space-x-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.99 10.187c0-.82-.069-1.417-.198-2.037H10.2v3.84h5.519c-.237 1.28-.904 2.364-1.927 3.094v2.571h3.12c1.827-1.68 2.878-4.154 2.878-7.468z" fill="#4285F4"/>
                <path d="M10.2 20c2.601 0 4.779-.859 6.371-2.32l-3.12-2.571c-.864.578-1.971.917-3.251.917-2.502 0-4.622-1.688-5.377-3.955H1.63v2.615C3.218 17.618 6.406 20 10.2 20z" fill="#34A853"/>
                <path d="M4.823 11.711c-.193-.578-.303-1.197-.303-1.836s.11-1.258.303-1.836V5.424H1.63C.584 6.154 0 7.516 0 9s.584 2.846 1.63 3.576l3.193-2.615z" fill="#FBBC05"/>
                <path d="M10.2 3.98c1.414 0 2.683.486 3.68 1.44l2.76-2.76C14.975.923 12.797 0 10.2 0 6.406 0 3.218 2.382 1.63 5.576L4.823 8.19C5.578 5.923 7.698 3.98 10.2 3.98z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-semibold text-[#0F172A]">Google</span>
            </button>
            <button className="flex-1 h-10 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg flex justify-center items-center space-x-3">
              <svg width="16.67" height="13.33" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5 0C3.805 0 0 3.582 0 8c0 3.972 2.942 7.235 6.836 7.835.5.085.683-.207.683-.465 0-.232-.009-.845-.014-1.66-2.782.602-3.369-1.34-3.369-1.34-.454-1.152-1.11-1.46-1.11-1.46-.907-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 018.5 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.393.1 2.646.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.31.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .258.18.553.687.465C15.058 15.235 18 11.972 18 8c0-4.418-3.805-8-8.5-8z" fill="#0F172A"/>
              </svg>
              <span className="text-sm font-semibold text-[#0F172A]">GitHub</span>
            </button>
          </div>

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