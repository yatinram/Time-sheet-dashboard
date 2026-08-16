import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { ToastProvider } from './ToastContext';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme_mode') || 'dark';
  });

  const isDark = mode === 'dark';

  const toggleTheme = () => {
    setMode((prev) => {
      const nextMode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme_mode', nextMode);
      return nextMode;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.backgroundColor = isDark ? '#0f172a' : '#f1f5f9';
    document.body.style.color = isDark ? '#f8fafc' : '#0f172a';
  }, [mode, isDark]);

  return (
    <ThemeContext.Provider value={{ mode, isDark, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#2563eb',
            colorBgBase: isDark ? '#0f172a' : '#f1f5f9',
            colorBgContainer: isDark ? '#1e293b' : '#f8fafc',
            colorBgElevated: isDark ? '#334155' : '#e2e8f0',
            colorText: isDark ? '#f8fafc' : '#0f172a',
            colorTextSecondary: isDark ? '#94a3b8' : '#475569',
            colorBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#cbd5e1',
            borderRadius: 10,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          },
        }}
      >
        <AntdApp>
          <ToastProvider>{children}</ToastProvider>
        </AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
