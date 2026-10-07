import StyleDictionary from 'style-dictionary';
import { isThemed, isComponent } from './build/helpers.mjs';
import { kotlinObject, kotlinInterface } from './build/kotlin.mjs';
import { swiftEnum, swiftProtocol, swiftStruct, swiftSupport } from './build/swift.mjs';
import { tokensJson } from './build/json.mjs';

// ─── À adapter quand on clone le starter ──────────────────────────────────────
const PREFIX = 'DS'; // préfixe des types générés : DSTokens, DSColorsLight…
const ANDROID_PACKAGE = 'com.example.designsystem'; // package Kotlin
// ──────────────────────────────────────────────────────────────────────────────

// Nos tailles sont écrites en px ("16px"). Les transforms Android fournis par
// Style Dictionary attendent des rem et multiplieraient par 16 (16px -> 256dp).
StyleDictionary.registerTransform({
  name: 'size/pxToDpSp',
  type: 'value',
  filter: (token) => token.$type === 'dimension',
  transform: (token) => {
    const unit = token.path[0] === 'font' && token.path[1] === 'size' ? 'sp' : 'dp';
    return `${parseFloat(token.$value)}${unit}`;
  },
});

for (const format of [kotlinObject, kotlinInterface, swiftEnum, swiftProtocol, swiftStruct, swiftSupport, tokensJson]) {
  StyleDictionary.registerFormat(format);
}

// Mobile : pas de component tokens (les composants sont en React, donc web uniquement).
const isColor = (token) => token.$type === 'color' && !isComponent(token);
// Les ombres ne sont pas générées sur mobile : chaque OS a son propre modèle (élévation Android, shadow iOS).
const isMobile = (token) => !isComponent(token) && token.$type !== 'shadow';
// Primitifs + typographie : identiques dans tous les thèmes
const isShared = (token) => !isThemed(token) && isMobile(token);

const themes = ['light', 'dark'];

for (const theme of themes) {
  const isLight = theme === 'light';
  const Theme = isLight ? 'Light' : 'Dark';

  const sd = new StyleDictionary({
    source: [
      'tokens/primitive/**/*.json',
      'tokens/semantic/*.json', // sémantiques communs à tous les thèmes (typographie)
      `tokens/semantic/${theme}/**/*.json`, // sémantiques du thème
      'tokens/component/**/*.json', // component tokens (pointent vers les sémantiques)
    ],
    platforms: {
      // 🌐 Web : variables CSS. Le thème dark ne redéfinit que ce qui change.
      css: {
        transformGroup: 'css',
        // Une typographie composite est éclatée en 5 variables (font-family, font-size…) :
        // la propriété CSS raccourcie « font » ne sait pas porter le letter-spacing.
        expand: { include: ['typography'] },
        buildPath: 'dist/web/css/',
        files: [
          {
            destination: `${theme}.css`,
            format: 'css/variables',
            filter: isLight ? undefined : isThemed,
            options: {
              selector: isLight ? ':root' : `[data-theme="${theme}"]`,
              outputReferences: true,
            },
          },
        ],
      },

      // 🤖 Pour les outils et les IA : tous les tokens du thème, avec leur nom de variable CSS (lu par le manifeste).
      json: {
        transformGroup: 'css',
        expand: { include: ['typography'] },
        buildPath: 'dist/web/json/',
        files: [{ destination: `${theme}.json`, format: 'ds/tokens-json' }],
      },

      // 🌐 Web : constantes JavaScript (utile quand une lib, ex. de graphiques, veut les valeurs en JS).
      js: {
        transformGroup: 'js',
        buildPath: 'dist/web/js/',
        files: [
          { destination: `${theme}.js`, format: 'javascript/es6' },
          { destination: `${theme}.d.ts`, format: 'typescript/es6-declarations' }, // types pour TypeScript
        ],
      },

      // 🤖 Android, ancien système de vues (XML) : values/ = light, values-night/ = dark.
      androidXml: {
        transforms: ['attribute/cti', 'name/snake', 'color/hex8android', 'size/pxToDpSp'],
        buildPath: `dist/android/xml/${isLight ? 'values' : 'values-night'}/`,
        files: isLight
          ? [
              { destination: 'colors.xml', format: 'android/resources', filter: isColor },
              {
                destination: 'dimens.xml',
                format: 'android/resources',
                filter: (token) => token.$type === 'dimension' && !isComponent(token),
              },
            ]
          : [
              {
                destination: 'colors.xml',
                format: 'android/resources',
                filter: (token) => isColor(token) && isThemed(token),
              },
            ],
      },

      // 🤖 Android Jetpack Compose (Kotlin).
      // DSTokens = tout ce qui est commun · DSColors = l'interface des couleurs de thème
      // DSColorsLight / DSColorsDark = ses deux implémentations.
      compose: {
        transforms: ['name/camel'],
        buildPath: 'dist/android/compose/',
        files: [
          ...(isLight
            ? [
                {
                  destination: `${PREFIX}Tokens.kt`,
                  format: 'ds/kotlin-object',
                  filter: isShared,
                  options: { name: `${PREFIX}Tokens`, package: ANDROID_PACKAGE },
                },
                {
                  destination: `${PREFIX}Colors.kt`,
                  format: 'ds/kotlin-interface',
                  filter: isThemed,
                  options: { name: `${PREFIX}Colors`, package: ANDROID_PACKAGE },
                },
              ]
            : []),
          {
            destination: `${PREFIX}Colors${Theme}.kt`,
            format: 'ds/kotlin-object',
            filter: isThemed,
            options: { name: `${PREFIX}Colors${Theme}`, implements: `${PREFIX}Colors`, package: ANDROID_PACKAGE },
          },
        ],
      },

      // 🍎 iOS SwiftUI. Même découpage que Compose.
      swift: {
        transforms: ['name/camel'],
        buildPath: 'dist/ios/',
        files: [
          ...(isLight
            ? [
                {
                  destination: `${PREFIX}Tokens.swift`,
                  format: 'ds/swift-enum',
                  filter: isShared,
                  options: { name: `${PREFIX}Tokens`, prefix: PREFIX },
                },
                {
                  destination: `${PREFIX}Colors.swift`,
                  format: 'ds/swift-protocol',
                  filter: isThemed,
                  options: { name: `${PREFIX}Colors` },
                },
                { destination: `${PREFIX}Support.swift`, format: 'ds/swift-support', options: { prefix: PREFIX } },
              ]
            : []),
          {
            destination: `${PREFIX}Colors${Theme}.swift`,
            format: 'ds/swift-struct',
            filter: isThemed,
            options: { name: `${PREFIX}Colors${Theme}`, implements: `${PREFIX}Colors`, prefix: PREFIX },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}
