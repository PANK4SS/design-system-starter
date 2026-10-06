// Thèmes de l'interface Storybook, construits avec NOS tokens (générés par build:tokens).
import { create } from 'storybook/theming/create';
import * as light from '../dist/web/js/light.js';
import * as dark from '../dist/web/js/dark.js';

const shared = {
  brandTitle: 'design-system-starter',
  fontBase: light.FontFamilyBody.join(', '),
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  appBorderRadius: parseFloat(light.RadiusLg),
  inputBorderRadius: parseFloat(light.RadiusMd),
};

export const lightTheme = create({
  ...shared,
  base: 'light',
  appBg: light.ColorBackgroundSurface,
  appContentBg: light.ColorBackgroundPage,
  appPreviewBg: light.ColorBackgroundPage,
  appBorderColor: light.ColorBorderDefault,
  textColor: light.ColorTextDefault,
  textMutedColor: light.ColorTextSubtle,
  barBg: light.ColorBackgroundPage,
  inputBg: light.ColorBackgroundPage,
  inputBorder: light.ColorBorderStrong,
  inputTextColor: light.ColorTextDefault,
});

export const darkTheme = create({
  ...shared,
  base: 'dark',
  appBg: dark.ColorBackgroundSurface,
  appContentBg: dark.ColorBackgroundPage,
  appPreviewBg: dark.ColorBackgroundPage,
  appBorderColor: dark.ColorBorderDefault,
  textColor: dark.ColorTextDefault,
  textMutedColor: dark.ColorTextSubtle,
  barBg: dark.ColorBackgroundSurface,
  inputBg: dark.ColorBackgroundSurface,
  inputBorder: dark.ColorBorderStrong,
  inputTextColor: dark.ColorTextDefault,
});
