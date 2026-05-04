export const colors = {
  // Text
  text: {
    primary: '#0F172B',
    secondary: '#45556C',
    muted: '#62748E',
    placeholder: '#90A1B9',
  },

  // Borders & backgrounds
  border: {
    light: '#F1F5F9',
    default: '#CBD5E1',
    medium: '#E2E8F0',
  },
  surface: {
    white: '#FFFFFF',
    light: '#F8FAFC',
  },

  // Brand
  brand: {
    green: '#75C79E',
    greenHover: '#6ab080',
  },

  // Alert variants
  alert: {
    critico: {
      bg: '#FEF2F2',
      border: '#FFC9C9',
      icon: '#FB2C36',
      badge: '#FFE2E2',
      badgeText: '#C10007',
    },
    advertencia: {
      bg: '#FFF7ED',
      border: '#FFD6A8',
      icon: '#FF6900',
      badge: '#FFEDD4',
      badgeText: '#CA3500',
    },
    informacion: {
      bg: '#EFF6FF',
      border: '#BEDBFF',
      icon: '#2B7FFF',
      badge: '#DBEAFE',
      badgeText: '#1447E6',
    },
  },
} as const;
