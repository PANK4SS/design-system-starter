// Formats Kotlin pour Android Jetpack Compose.
import { HEADER, px, ms, round, firstFamily, isFontSize } from './helpers.mjs';

const IMPORTS = [
  'androidx.compose.animation.core.CubicBezierEasing',
  'androidx.compose.ui.graphics.Color',
  'androidx.compose.ui.text.TextStyle',
  'androidx.compose.ui.text.font.FontWeight',
  'androidx.compose.ui.unit.dp',
  'androidx.compose.ui.unit.sp',
];

// Convertit la valeur d'un token en expression Kotlin, selon son $type.
function toKotlin(token) {
  const v = token.$value;
  switch (token.$type) {
    case 'color':
      return `Color(0xFF${v.replace('#', '').toUpperCase()})`;
    case 'dimension':
      return `${px(v)}.${isFontSize(token) ? 'sp' : 'dp'}`;
    case 'fontFamily':
      return `"${firstFamily(v)}"`;
    case 'fontWeight':
      return `FontWeight(${v})`;
    case 'number':
      return `${v}f`;
    case 'duration':
      return `${ms(v)} // ms`;
    case 'cubicBezier':
      return `CubicBezierEasing(${v.map((n) => `${n}f`).join(', ')})`;
    case 'typography':
      // La police n'est pas incluse : en Compose, une FontFamily dépend des ressources de l'app.
      // Utilisation : DSTokens.typographyHeadingLg.copy(fontFamily = maPolice)
      return (
        `TextStyle(fontSize = ${px(v.fontSize)}.sp, fontWeight = FontWeight(${v.fontWeight}), ` +
        `lineHeight = ${round(px(v.fontSize) * v.lineHeight)}.sp, letterSpacing = ${px(v.letterSpacing)}.sp) ` +
        `// police : ${firstFamily(v.fontFamily)}`
      );
    default:
      throw new Error(`Type non géré en Kotlin : ${token.$type} (${token.name})`);
  }
}

const header = (pkg) => [`// ${HEADER}`, `package ${pkg}`, '', ...IMPORTS.map((i) => `import ${i}`), ''].join('\n');

// object DSTokens { val ... }  ou  object DSColorsLight : DSColors { override val ... }
export const kotlinObject = {
  name: 'ds/kotlin-object',
  format: ({ dictionary, options }) => {
    const extend = options.implements ? ` : ${options.implements}` : '';
    const keyword = options.implements ? 'override val' : 'val';
    const lines = dictionary.allTokens.map((t) => `    ${keyword} ${t.name} = ${toKotlin(t)}`);
    return `${header(options.package)}\nobject ${options.name}${extend} {\n${lines.join('\n')}\n}\n`;
  },
};

// interface DSColors { val colorBackgroundPage: Color }
export const kotlinInterface = {
  name: 'ds/kotlin-interface',
  format: ({ dictionary, options }) => {
    const lines = dictionary.allTokens.map((t) => `    val ${t.name}: Color`);
    return `${header(options.package)}\ninterface ${options.name} {\n${lines.join('\n')}\n}\n`;
  },
};
