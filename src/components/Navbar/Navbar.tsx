import React from 'react';
import CustomButton from '../button/CustomButton';

type NavLink = {
  title: string;
  href: string;
};

type NavbarProps = {
  links: NavLink[];
  onLogin?: () => void;
  onSignUp?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ links, onLogin, onSignUp }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-auto min-h-[73px] flex flex-row justify-between items-center px-10 bg-[rgba(246,247,247,0.8)] border-b border-[#E2E8F0] backdrop-blur-[6px] z-50 box-border">
      {/* Logo  */}
      <div className="flex flex-row items-center gap-2">
        {/* Icon */}
        <div className="flex flex-col items-start">
          <svg
            width="21"
            height="22"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 0C7.5 0 5 2.5 5 5.5C5 7.5 4 9 2.5 10C1 11 0 12.5 0 14.5C0 17.5 2.5 20 5.5 20H6C6 21.1 6.9 22 8 22H13C14.1 22 15 21.1 15 20H15.5C18.5 20 21 17.5 21 14.5C21 12.5 20 11 18.5 10C17 9 16 7.5 16 5.5C16 2.5 13.5 0 10.5 0Z"
              fill="#75C79E"
            />
          </svg>
        </div>
        <span className="font-inter font-bold text-[20px] text-[#0F172A]">
          Plaguie
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-row justify-center items-start gap-10 flex-1">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="font-inter font-medium text-[14px] text-[#334155] hover:text-[#0F172A] transition-colors duration-200 no-underline"
          >
            {link.title}
          </a>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row items-start gap-3">
          <CustomButton
            title="Iniciar Sesión"
            onPress={onLogin}
            enabled={true}
            bgColor="bg-[#E2E8F0]"
            fgColor="text-[#0F172A]"
            width="w-60"
            height="h-10"
          />
          <CustomButton
            title="Crear Cuenta"
            onPress={onSignUp}
            enabled={true}
            bgColor="bg-[#75C79E]"
            fgColor="text-[#0F172A]"
            width="w-50"
            height="h-10"
          />
      </div>
    </nav>
  );
};

export default Navbar;
