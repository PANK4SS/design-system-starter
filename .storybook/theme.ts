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
  // Couleur d'accent de Storybook (liens, clés JSON, sélection) : le bleu « info » de nos tokens
  colorSecondary: light.ColorFeedbackInfo,
  // Bouton actif de la barre d'outils (ex. « Sombre ») : lisible sur son fond teinté
  barSelectedColor: light.ColorFeedbackInfo,
  barHoverColor: light.ColorFeedbackInfo,
  appBg: light.ColorBackgroundSurface,
  appContentBg: light.ColorBackgroundSurface,
  appPreviewBg: light.ColorBackgroundPage,
  appBorderColor: light.ColorBorderDefault,
  textColor: light.ColorTextDefault,
  textMutedColor: light.ColorTextSubtle,
  barBg: light.ColorBackgroundPage,
  inputBg: light.ColorBackgroundPage,
  inputBorder: light.ColorBorderStrong,
  inputTextColor: light.ColorTextDefault,
  // Interrupteurs « True / False » du tableau des props
  booleanBg: light.ColorBackgroundSurface,
  booleanSelectedBg: light.ColorBackgroundPage,
});

export const darkTheme = create({
  ...shared,
  base: 'dark',
  // Couleur d'accent de Storybook (liens, clés JSON, sélection) : le bleu « info » de nos tokens
  colorSecondary: dark.ColorFeedbackInfo,
  // Bouton actif de la barre d'outils (ex. « Sombre ») : lisible sur son fond teinté
  barSelectedColor: dark.ColorTextDefault,
  barHoverColor: dark.ColorTextDefault,
  appBg: dark.ColorBackgroundSurface,
  appContentBg: dark.ColorBackgroundSurface,
  appPreviewBg: dark.ColorBackgroundPage,
  appBorderColor: dark.ColorBorderDefault,
  textColor: dark.ColorTextDefault,
  textMutedColor: dark.ColorTextSubtle,
  barBg: dark.ColorBackgroundSurface,
  inputBg: dark.ColorBackgroundSurface,
  inputBorder: dark.ColorBorderStrong,
  inputTextColor: dark.ColorTextDefault,
  // Interrupteurs « True / False » du tableau des props
  booleanBg: dark.ColorBackgroundSurface,
  booleanSelectedBg: dark.ColorBackgroundPage,
});
