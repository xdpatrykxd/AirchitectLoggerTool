import { GraphDataProperty } from './types';

interface BaseColors {
  primary: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
  };
  neutral: {
    100: string;
    150: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
  };
  feedback: {
    success: string;
    warning: string;
    error: string;
  };
}

const baseColors: BaseColors = {
  primary: {
    100: '#EFF9FD',
    200: '#D4F3FF',
    300: '#AADEF2',
    400: '#0099CC',
    500: '#0078A1',
    600: '#004157',
  },
  neutral: {
    100: '#FFFFFF',
    150: '#F4F5F6',
    200: '#EAEBEC',
    300: '#D2D2D2',
    400: '#A0A0A0',
    500: '#5A5D60',
    600: '#1D282C',
  },
  feedback: {
    success: '#43B02A',
    warning: '#FFCD00',
    error: '#C8102E',
  },
};

type GraphDataPropertyColors = {
  [key in GraphDataProperty]: string;
};

export type GraphColors = GraphDataPropertyColors & {
  Area: string;
  Highlight: string;
};

const graphColors: GraphColors = {
  Pressure: '#1A8DFF',
  Flow: '#00CC8F',
  Speed: '#EE7D33',
  Unloaded: '#F5B653',
  Stopped: '#3F8EF7',
  Loaded: '#72C54D',
  DeviceUnavailable: '#C8102E',
  None: '#E6E6E6',
  Current: '#E6E6E6',
  DewPoint: '#E6E6E6',
  SpecificEnergyRequirement: '#E6E6E6',
  Temperature: '#E6E6E6',
  Area: '#E6E6E6',
  Highlight: '#EE7D33',
  Time: '#E6E6E6',
};

function LightenDarkenColor(color: string, amt: number): string {
  let usePound = false;
  let col = color;
  if (color[0] === '#') {
    col = color.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  // eslint-disable-next-line no-bitwise
  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  // eslint-disable-next-line no-bitwise
  let b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  // eslint-disable-next-line no-bitwise
  let g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  // eslint-disable-next-line no-bitwise
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

export const darkenedGraphColor = (
  key: string,
  colors: Record<string, string>,
  fraction: number
): string => {
  const originKey = Object.keys(GraphDataProperty).find((graphType) => key.includes(graphType));
  const originColor = colors[originKey ?? GraphDataProperty.Loaded];
  if (originKey === key || !originKey) return originColor;
  return LightenDarkenColor(originColor, fraction);
};

export interface ACColors extends BaseColors, GraphColors {
  blue: {
    main: string;
    dark: string;
    light: string;
    lighter: string;
    translucent: string;
  };
  white: string;
  yellow: string;
  grey: {
    dark: string;
    offWhite: string;
    lighter: string;
    light: string;
    regular: string;
    medium: string;
  };
  black: string;
  font: {
    main: string;
    sub: string;
  };
  peach: string;
  orange: string;
  ruby: string;
  violet: string;
  leaf: string;
  petrol: string;
  surface: {
    0: string;
    1: string;
  };
  icon: {
    Color1: string;
    Color2: string;
    Color3: string;
    Color4: string;
    Color5: string;
    Color6: string;
  };
  neutrals: {
    secondary: {
      rest: string;
      hover: string;
      selected: string;
      disabled: string;
    };
    onSecondary: {
      onPrimary: string;
    };
    background: {
      surface: string;
      bright: string;
      sky: string;
      dim: string;
      dark: string;
    };
    text: {
      primary: string;
      secondary: string;
      inverted: string;
      disabled: string;
    };
    border: {
      rest: string;
      hover: string;
      selected: string;
    };
  };
  brand: {
    primary: {
      rest: string;
      hover: string;
      selected: string;
    };
    onPrimary: {
      onPrimary: string;
    };
    selected: {
      rest: string;
      hover: string;
      selected: string;
    };
    onSelected: {
      onSelected: string;
    };
    border: {
      rest: string;
      hover: string;
      selected: string;
    };
    text: {
      rest: string;
      hover: string;
      selected: string;
    };
  };
}

export const colors: ACColors = {
  ...baseColors,
  ...graphColors,
  blue: {
    main: '#0099cc',
    dark: '#0078a1',
    light: '#8dc8e8',
    lighter: '#EFF9FD',
    translucent: '#e5f1f5',
  },
  white: '#FFFFFF',
  yellow: '#FFCD00',
  grey: {
    dark: '#373D41',
    offWhite: '#FCFCFC',
    lighter: '#F3F3F3',
    light: '#E6E6E6;',
    regular: '#BBBDC0;',
    medium: '#9F9F9F;',
  },
  black: '#0D0D0D',
  font: {
    main: '#0D0D0D',
    sub: '#5A5D60',
  },
  peach: '#F68D76',
  orange: '#F26522',
  ruby: '#C8102E',
  violet: '#6D2077',
  leaf: '#43B02A',
  petrol: '#008C95',
  surface: {
    0: '#FCFCFC',
    1: '#FFFFFF',
  },
  icon: {
    Color1: '#1678FF',
    Color2: '#DD06AE',
    Color3: '#FF7A00',
    Color4: '#46D166',
    Color5: '#8464F0',
    Color6: '#12D1E1',
  },
  neutrals: {
    secondary: {
      rest: baseColors.neutral[200],
      hover: baseColors.neutral[300],
      selected: baseColors.neutral[200],
      disabled: baseColors.neutral[200],
    },
    onSecondary: {
      onPrimary: baseColors.neutral[600],
    },
    background: {
      bright: baseColors.neutral[100],
      surface: baseColors.neutral[150],
      sky: baseColors.primary[100],
      dim: baseColors.neutral[200],
      dark: baseColors.neutral[600],
    },
    text: {
      primary: baseColors.neutral[600],
      secondary: baseColors.neutral[500],
      inverted: baseColors.neutral[100],
      disabled: baseColors.neutral[400],
    },
    border: {
      rest: baseColors.neutral[300],
      hover: baseColors.neutral[400],
      selected: baseColors.neutral[300],
    },
  },
  brand: {
    text: {
      rest: baseColors.primary[400],
      hover: baseColors.primary[500],
      selected: baseColors.primary[400],
    },
    border: {
      rest: baseColors.primary[400],
      hover: baseColors.primary[500],
      selected: baseColors.primary[400],
    },
    primary: {
      rest: baseColors.primary[400],
      hover: baseColors.primary[500],
      selected: baseColors.primary[400],
    },
    onPrimary: {
      onPrimary: baseColors.neutral[100],
    },
    selected: {
      rest: baseColors.primary[200],
      hover: baseColors.primary[300],
      selected: baseColors.primary[200],
    },
    onSelected: {
      onSelected: baseColors.primary[600],
    },
  },
};

interface ACSpacing {
  fixedOverlaySpacing: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
}

export const spacing: ACSpacing = {
  fixedOverlaySpacing: '10rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.5rem',
  6: '2rem',
  7: '3rem',
  8: '4rem',
};

interface ACBorder {
  1: string;
  2: string;
  circular: string;
}

export const border: ACBorder = {
  1: '8px',
  2: '16px',
  circular: '99',
};

export interface ACTheme {
  colors: ACColors;
  spacing: ACSpacing;
  border: ACBorder;
}
