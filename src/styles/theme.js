import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontSize: '1.2rem',
    fontFamily: 'Noto Sans KR, sans-serif',
  },
  cssVariables: true,
  palette: {
    primary: {
      light: 'var(--color-main-light)',
      main: 'var(--color-main)',
      dark: 'var(--color-main-dark)',
      contrastText: 'var(--color-white)',
    },
    primaryDark: {
      light: 'var(--color-main)',
      main: 'var(--color-main-dark)',
      dark: 'var(--color-main-darker)',
      contrastText: 'var(--color-white)',
    },
    primaryLight: {
      light: 'var(--color-main-lighter)',
      main: 'var(--color-main-light)',
      dark: 'var(--color-main)',
      contrastText: 'var(--color-white)',
    },
    primaryLighter: {
      light: 'var(--color-main-faint)',
      main: 'var(--color-main-lighter)',
      dark: 'var(--color-main-light)',
      constrastText: 'var(--color-main)',
    },
    primaryFaint: {
      light: 'var(--color-white)',
      main: 'var(--color-main-faint)',
      dark: 'var(--color-main-lighter)',
      constrastText: 'var(--color-main)',
    },
    textBlack: {
      light: 'var(--color-text-lightblack)',
      main: 'var(--color-text-black)',
      dark: '#141414',
      contrastText: 'var(--color-white)',
    },
    textLightblack: {
      light: 'var(--color-text-darkgray)',
      main: 'var(--color-text-lightblack)',
      dark: 'var(--color-text-black)',
      contrastText: 'var(--color-white)',
    },
    textDarkgray: {
      light: 'var(--color-text-gray)',
      main: 'var(--color-text-darkgray)',
      dark: 'var(--color-text-lightblack)',
      contrastText: 'var(--color-white)',
    },
    textGray: {
      light: 'var(--color-lightgray)',
      main: 'var(--color-text-gray)',
      dark: 'var(--color-text-darkgray)',
      contrastText: 'var(--color-white)',
    },
    lightgray: {
      light: 'var(--color-faintgray)',
      main: 'var(--color-lightgray)',
      dark: 'var(--color-text-gray)',
      contrastText: 'var(--color-text-lightblack)',
    },
    faintgray: {
      light: 'var(--color-white)',
      main: 'var(--color-faintgray)',
      dark: 'var(--color-lightgray)',
      contrastText: 'var(--color-text-lightblack)',
    },
    white: {
      main: 'var(--color-white)',
      dark: 'var(--color-faintgray)',
      contrastText: 'var(--color-text-lightblack)',
    },
    red: { main: 'var(--color-red)', contrastText: 'var(--color-white)' },
    blue: { main: 'var(--color-blue)', contrastText: 'var(--color-white)' },
  },
});

export default theme;
