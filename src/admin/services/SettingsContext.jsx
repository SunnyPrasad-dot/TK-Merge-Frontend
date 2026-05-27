import { createContext, useContext, useEffect, useState } from 'react';

const defaultSettings = {
  themeMode: 'light',
  themeColor: '#D6AD60', // Gold
  collapseSidebar: false,
  inquiryAlerts: true,
  bookingAlerts: true,
  currency: 'inr',
  timezone: 'ist',
  dateFormat: 'ddmm',
  sidebarColor: ''
};

function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const SettingsContext = createContext(undefined);

export function SettingsProvider({ children }) {
  // Load initial settings from localStorage, or fallback to defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('tk_admin_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to parse settings from local storage', error);
    }
    return defaultSettings;
  });

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('tk_admin_settings');
  };

  // Persist to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('tk_admin_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply Theme Mode (Light/Dark) to HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.themeMode]);

  // Apply Theme Colors to HTML element
  useEffect(() => {
    const root = document.documentElement;
    
    const clearCustomTheme = () => {
       root.style.removeProperty('--primary');
       root.style.removeProperty('--sidebar-primary');
       root.style.removeProperty('--accent');
       root.style.removeProperty('--ring');
       root.style.removeProperty('--primary-foreground');
       root.style.removeProperty('--sidebar-primary-foreground');
       root.style.removeProperty('--accent-foreground');
    };

    if (settings.themeMode === 'dark') {
      clearCustomTheme();
      root.removeAttribute('data-theme');
      return;
    }

    if (settings.themeColor === '#F4EBD0') {
      clearCustomTheme();
      root.setAttribute('data-theme', 'cream');
    } else if (settings.themeColor === '#D6AD60') {
      clearCustomTheme();
      root.setAttribute('data-theme', 'gold');
    } else if (settings.themeColor === '#122620') {
      clearCustomTheme();
      root.setAttribute('data-theme', 'green');
    } else {
       root.removeAttribute('data-theme');
       const hsl = hexToHsl(settings.themeColor);
       root.style.setProperty('--primary', hsl);
       root.style.setProperty('--sidebar-primary', hsl);
       root.style.setProperty('--accent', hsl);
       root.style.setProperty('--ring', hsl);
       
       const l = parseInt(hsl.split(' ')[2]);
       if (l > 60) {
         root.style.setProperty('--primary-foreground', '162 36% 11%');
         root.style.setProperty('--sidebar-primary-foreground', '162 36% 11%');
         root.style.setProperty('--accent-foreground', '162 36% 11%');
       } else {
         root.style.setProperty('--primary-foreground', '45 62% 95%');
         root.style.setProperty('--sidebar-primary-foreground', '45 62% 95%');
         root.style.setProperty('--accent-foreground', '45 62% 95%');
       }
    }
  }, [settings.themeColor, settings.themeMode]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
