import { createTheme } from '@mui/material/styles';

import { BASE, THEME, type ThemeSite } from '@/lib/theme/colors';
import { PRETENDARD_FONT } from '@/lib/theme/styles';

export function createMuiTheme(site: ThemeSite | null) {
  const palette = { ...BASE, ...(THEME[site ?? 'm'] || THEME.m) };

  return createTheme({
    palette: {
      primary: { main: palette.pri },
      secondary: { main: palette.sec },
      error: { main: palette.red },
      success: { main: palette.green },
      background: {
        default: palette.bg,
        paper: palette.white,
      },
      text: {
        primary: palette.txt,
        secondary: palette.txS,
      },
      divider: palette.brd,
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: PRETENDARD_FONT,
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
      h1: {
        fontSize: '1.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1.25rem',
        fontWeight: 700,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: '100%',
          },
          body: {
            minHeight: '100%',
            backgroundColor: palette.bg,
            color: palette.txt,
          },
          '#__next': {
            minHeight: '100%',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            backgroundColor: palette.white,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontSize: 14,
            fontWeight: 500,
            color: palette.txL,
          },
          body: {
            fontSize: 14,
            color: palette.txt,
          },
        },
      },
    },
  });
}
