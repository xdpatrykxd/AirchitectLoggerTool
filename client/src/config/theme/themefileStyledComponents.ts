import { DefaultTheme } from "styled-components";

import { ACTheme, border, colors, spacing } from "./colors";
import materialTheme, { MaterialThemeOptions } from "./themefileMui";

const muiTheme = materialTheme as unknown as MaterialThemeOptions;

export interface StyledComponentsTheme extends MaterialThemeOptions, ACTheme {
  borderRadius: {
    1: string;
    2: string;
  };
  boxShadow: {
    card: string;
    panel: string;
    top: string;
    bottom: string;
    wide: string;
    right: string;
  };
  padding: {
    innerRowPadding: string;
    rowPadding: string;
  };
}

// Want to add something to the theme? Add the key to the interface above!
const theme: DefaultTheme = {
  ...muiTheme,
  colors,
  borderRadius: {
    1: "8px",
    2: "16px",
  },
  boxShadow: {
    card: "0 1px 4px 0 rgb(0 0 0 / 10%)",
    panel: "0 0 6px 2px rgba(230,230,230, 0.5)",
    top: "0px -7px 6px -4px rgb(54 54 54 / 4%)",
    bottom: "0px 7px 6px -4px rgb(54 54 54 / 4%)",
    wide: "0 0 40px 20px rgba(0,0,0,0.03)",
    right: "10px 4px 20px 0 rgba(0,0,0,0.04)",
  },
  padding: {
    innerRowPadding: "1rem 0",
    rowPadding: "2rem 0",
  },
  spacing,
  border,
};

export default theme;
