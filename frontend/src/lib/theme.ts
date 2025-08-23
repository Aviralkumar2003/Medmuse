// Theme utility functions
export const getThemeFromStorage = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
};

export const setThemeInStorage = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: 'light' | 'dark'): void => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

// Theme-aware class names for consistent theming
export const themeClasses = {
  background: 'bg-background',
  foreground: 'text-foreground',
  muted: 'text-muted-foreground',
  border: 'border-border',
  card: 'bg-card text-card-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  input: 'bg-background border border-input',
  button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  buttonSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
} as const;
