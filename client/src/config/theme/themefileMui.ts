import { Components, Theme, ThemeOptions } from '@mui/material';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { CSSObject, DefaultTheme } from 'styled-components';

import { border, colors, spacing } from './colors';

// custom typography variants
declare module '@mui/material/styles' {
  interface TypographyVariants {
    'Xs/Regular': React.CSSProperties;
    'Xs/Bold': React.CSSProperties;
    'S/Base': React.CSSProperties;
    'S/Bold': React.CSSProperties;
    'M/Regular': React.CSSProperties;
    'M/Bold': React.CSSProperties;
    'L/Regular': React.CSSProperties;
    'L/Bold': React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    'Xs/Regular'?: React.CSSProperties;
    'Xs/Bold'?: React.CSSProperties;
    'S/Base'?: React.CSSProperties;
    'S/Bold'?: React.CSSProperties;
    'M/Regular'?: React.CSSProperties;
    'M/Bold'?: React.CSSProperties;
    'L/Regular'?: React.CSSProperties;
    'L/Bold'?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'Xs/Regular': true;
    'Xs/Bold': true;
    'S/Base': true;
    'S/Bold': true;
    'M/Regular': true;
    'M/Bold': true;
    'L/Regular': true;
    'L/Bold': true;
  }
}

interface CustomAcComponents {
  CustomACLink: {
    styleOverrides: {
      root: ({
        theme,
      }: {
        theme: Omit<Theme, 'components'> | DefaultTheme;
      }) => Record<string, string>;
    };
  };
  CustomSearchField: {
    styleOverrides: {
      root: ({
        theme,
      }: {
        theme: Omit<Theme, 'components'> | DefaultTheme;
      }) => Record<string, CSSObject>;
    };
  };
}

// The material theme interface keys are almost all optional, this is very annoying to work with when we type
// our styled-components Default theme (styled.d.ts) and would mean having to write checks everytime you want to use a material theme prop in your css.
// We also know for SURE that all the values declared here exist, so we declare a "copy" of the theme options we actually use here to use as an interface to extend the DefaultTheme from.
export interface MaterialThemeOptions {
  components: CustomAcComponents;
  palette: {
    primary: {
      main: string;
      dark: string;
      light: string;
    };
    secondary: {
      main: string;
    };
    warning: {
      main: string;
    };
    error: {
      main: string;
    };
    success: {
      main: string;
    };
    info: {
      main: string;
      dark: string;
    };
    divider: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    h1: {
      fontSize: string;
      fontWeight: string;
      color: string;
    };
    h2: {
      fontSize: string;
      fontWeight: string;
      color: string;
    };
    h3: {
      fontSize: string;
      fontWeight: string;
      color: string;
    };
    subtitle2: {
      opacity: string;
    };
    body1: {
      fontSize: string;
    };
    body2: {
      fontSize: string;
    };
  };
}

// If you add something to the theme: please add the key to the interface above as well.
const themeMUI: ThemeOptions & {
  components: Components<Omit<Theme, 'components'>> & CustomAcComponents;
} = {
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: colors.grey.regular,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 4,
          opacity: 1,
        },
        track: {
          borderRadius: 99,
          opacity: '1 !important',
          backgroundColor: colors.grey.light,
          '.Mui-checked': {
            backgroundColor: colors.blue.main,
          },
        },
        thumb: {
          backgroundColor: colors.white,
        },
      },
    },
    MuiToggleButton: {
      defaultProps: {
        // When we are testing, we want to disable the ripple as many snapshots fail because of this.
        disableRipple: !!import.meta.env.VITEST,
        disableTouchRipple: !!import.meta.env.VITEST,
      },
    },
    MuiButton: {
      defaultProps: {
        // When we are testing, we want to disable the ripple as many snapshots fail because of this.
        disableRipple: !!import.meta.env.VITEST,
        disableTouchRipple: !!import.meta.env.VITEST,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none !important',
        },
        sizeSmall: {
          borderRadius: '8px',
          fontWeight: 600,
          padding: `${spacing[2]} ${spacing[4]}`,
        },
        sizeMedium: () => ({
          fontWeight: 600,
          fontSize: '1.1rem',
          padding: `${spacing[3]} ${spacing[5]}`,
          borderRadius: '8px',
        }),
        sizeLarge: {
          fontWeight: 600,
          padding: '6px 21px',
          paddingTop: '5px',
        },
        containedPrimary: () => ({
          backgroundColor: colors.brand.primary.rest,
          svg: {
            stroke: '#fff',
          },
          ':disabled': {
            svg: {
              stroke: colors.neutrals.text.disabled,
            },
          },
        }),
        outlined: () => ({
          color: colors.neutrals.text.primary,
          borderColor: colors.neutrals.border.rest,
          svg: {
            stroke: colors.neutrals.text.primary,
          },
          ':disabled': {
            svg: {
              stroke: colors.neutrals.text.disabled,
            },
          },
        }),
        text: () => ({
          color: colors.neutrals.text.primary,
          fontWeight: 600,
          svg: {
            stroke: colors.neutrals.text.primary,
          },
          ':disabled': {
            svg: {
              stroke: colors.neutrals.text.disabled,
            },
          },
        }),
        containedSecondary: {
          color: colors.white,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${colors.neutrals.border.rest}`,
          borderRadius: border[1],
          ShadowBox: '0px 16px 32px 0px #021F2833',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        // When we are testing, we want to disable the ripple as many snapshots fail because of this.
        disableRipple: !!import.meta.env.VITEST,
        disableTouchRipple: !!import.meta.env.VITEST,
      },
      styleOverrides: {
        sizeSmall: {
          padding: '11px 15px',
          borderRadius: '3px',
        },
        sizeMedium: {
          padding: '13px 18px',
          borderRadius: '3px',
        },
        sizeLarge: {
          padding: '15px 21px',
          borderRadius: '3px',
        },
      },
    },
    MuiChip: {
      defaultProps: {
        // this removes the ripple from the button, the on click action stays
        clickable: import.meta.env.VITEST ? false : undefined,
      },
      styleOverrides: {
        root: {
          borderRadius: border[1],
          backgroundColor: colors.neutrals.secondary.rest,
          padding: `${spacing[2]} ${spacing[2]}`,
        },
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: colors.blue.lighter,
          borderBottom: `4px solid ${colors.blue.dark}`,
        },
        pinnedColumnHeaders: {
          boxShadow: 'none',
          backgroundColor: colors.blue.translucent,
        },
        pinnedColumns: {
          borderRight: 'none',
          boxShadow: 'none',
        },
        columnHeaderTitle: {
          fontWeight: 600,
          fontSize: '0.875rem',
        },
        columnSeparator: {
          svg: {
            fill: colors.blue.lighter,
          },
        },
        row: {
          borderBottom: `2px solid ${colors.grey.lighter}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: '1rem',
          maxWidth: '100%',
          borderRadius: border[2],
        },
        root: ({ theme }) => ({
          h2: {
            fontSize: theme.typography.h2.fontSize,
            color: theme.typography.h2.color,
          },
        }),
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.grey.lighter}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: colors.blue.lighter,
          borderBottom: `4px solid ${colors.blue.dark}`,
          '.MuiTableCell-head': {
            fontWeight: theme.typography.h3.fontWeight,
          },
        }),
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          position: 'relative',
          '.MuiTableRow-root:not(MuiTableRow-root:last-child)': {
            borderBottom: `2px solid ${colors.grey.lighter}`,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          color: colors.blue.dark,
          fontWeight: 400,
          borderBottom: `3px solid ${theme.palette.divider}`,
          '&.Mui-selected': {
            fontWeight: 600,
            color: colors.font.main,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: colors.blue.dark,
          height: '4px',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          // display: ${(props) => (props.$expanded ? 'grid' : 'block')};
          boxShadow: 'none',
          marginBottom: '1rem',
          backgroundColor: colors.neutrals.background.surface,

          borderRadius: border[2],
          ':before': {
            content: 'normal',
          },
          ':last-of-type': {
            borderRadius: border[2],
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          flexDirection: 'row-reverse',
          gap: '1rem',
          minHeight: '64px',
          svg: {
            fill: colors.black,
          },
          borderRadius: border[2],
          transition: 'background-color .3s ease',
          ':hover': {
            backgroundColor: colors.neutrals.secondary.hover,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        track: {
          height: '0.5rem',
          borderRadius: '99px',
        },
        rail: {
          height: '0.5rem',
          borderRadius: '99px',
          backgroundColor: colors.grey.light,
        },
        thumb: {
          backgroundColor: colors.neutrals.background.bright,
          border: `1px solid ${colors.neutrals.border.rest}`,
          '&:hover': {},
        },
        valueLabel: {
          backgroundColor: colors.neutrals.background.dark,
          borderRadius: '0.25rem',
        },
        mark: {
          visibility: 'hidden',
        },
      },
    },

    MuiCheckbox: {
      defaultProps: {
        disableRipple: !!import.meta.env.VITEST,
        disableTouchRipple: !!import.meta.env.VITEST,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-checked': {
            color: theme.palette.primary.dark,
          },
          '&.MuiCheckbox-indeterminate': {
            color: theme.palette.primary.dark,
          },
          '&.Mui-disabled.Mui-checked': {
            color: colors.neutrals.secondary.disabled,
          },
        }),
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: !!import.meta.env.VITEST,
        disableTouchRipple: !!import.meta.env.VITEST,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-checked': {
            color: theme.palette.primary.dark,
            '&.Error': {
              color: colors.feedback.error,
            },
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          svg: {
            stroke: colors.font.main,
          },
          '.MuiInputBase-root': {
            backgroundColor: colors.white,
            borderRadius: 8,
            '&.Mui-disabled': {
              background: colors.grey.lighter,
              input: {
                WebkitTextFillColor: 'unset',
                color: colors.font.sub,
              },
            },
          },
          '.MuiInputAdornment-positionEnd': {
            svg: {
              stroke: colors.neutrals.text.secondary,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: colors.white,
          borderRadius: 8,
          '&.Mui-disabled': {
            backgroundColor: colors.grey.lighter,
            WebkitTextFillColor: 'unset',
            color: colors.font.sub,
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '.MuiPaginationItem-previousNext': {
            color: colors.blue.dark,
          },
          '.MuiPaginationItem-root.MuiPaginationItem-page': {
            borderBottom: '2px solid #e6e6e6',
            borderRadius: 0,
            margin: 0,
            padding: '1rem',
            color: colors.blue.dark,
            '&.Mui-selected': {
              background: 'none',
              borderBottom: `4px solid ${colors.blue.dark}`,
              color: colors.black,
              fontWeight: 'bold',
            },
          },
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiStepLabel-labelContainer .MuiStepLabel-label': {
            fontWeight: 700,
          },
          '.MuiStepIcon-root': {
            color: colors.grey.light,
            '&.Mui-active': {
              color: theme.palette.primary.dark,
            },
          },
        }),
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        color: 'primary',
      },
    },
    CustomSearchField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiTextField-root': {
            'background-color': colors.white,
          },
          input: {
            'margin-left': '0.4rem',
            'padding-left': '0.4rem',

            '&:hover': {
              'border-left-color': colors.black,
            },

            '&:focus,&:active': {
              'border-left-width': '2px',
              'border-left-color': theme.palette.primary.main,
            },
          },
          svg: {
            'background-color': colors.white,
            stroke: colors.font.main,
          },
        }),
      },
    },
    CustomACLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          'text-decoration-color': theme.palette.primary.dark,
          'font-size': '1.1rem',
          color: theme.palette.primary.dark,
        }),
      },
    },
  },
  palette: {
    primary: {
      main: colors.blue.main,
      dark: colors.blue.dark,
      light: colors.blue.light,
    },
    secondary: {
      main: '#ffcd00',
    },
    warning: {
      main: '#f26522',
    },
    error: {
      main: '#c8102e',
    },
    success: {
      main: '#43b02a',
    },
    info: {
      main: '#0099cc',
      dark: '#0078a1',
    },
    divider: '#e6e6e6',
  },
  typography: {
    'Xs/Regular': {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: colors.neutrals.text.primary,
    },
    'Xs/Bold': {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: colors.neutrals.text.primary,
    },
    'S/Base': {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: colors.neutrals.text.primary,
    },
    'S/Bold': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.neutrals.text.primary,
    },
    'M/Regular': {
      fontSize: '1rem',
      fontWeight: 400,
      color: colors.neutrals.text.primary,
    },
    'M/Bold': {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.neutrals.text.primary,
    },
    'L/Regular': {
      fontSize: '1.125rem',
      fontWeight: 400,
      color: colors.neutrals.text.primary,
    },
    'L/Bold': {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: colors.neutrals.text.primary,
    },
    // Change naming when refactoring headings in themme
    h1: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: colors.neutrals.text.primary,
    },
    h2: {
      fontSize: '1.375rem',
      fontWeight: 700,
      color: colors.neutrals.text.primary,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: colors.neutrals.text.primary,
    },
    fontFamily: [
      'Source Sans Pro',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
    fontSize: 16,
    subtitle2: {
      opacity: 0.4,
    },
    body1: {
      fontSize: 18,
    },
    body2: {
      fontSize: 16,
    },
  },
};

export default themeMUI;
