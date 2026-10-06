// Formats Swift pour iOS SwiftUI.
import { HEADER, px, ms, round, hexToRgb, firstFamily } from './helpers.mjs';

const SWIFT_WEIGHTS = {
  100: 'ultraLight',
  200: 'thin',
  300: 'light',
  400: 'regular',
  500: 'medium',
  600: 'semibold',
  700: 'bold',
  800: 'heavy',
  900: 'black',
};

const swiftColor = (hex) => {
  const [r, g, b] = hexToRgb(hex);
  return `Color(red: ${r}, green: ${g}, blue: ${b})`;
};

// Convertit la valeur d'un token en expression Swift, selon son $type.
function toSwift(token, prefix) {
  const v = token.$value;
  switch (token.$type) {
    case 'color':
      return swiftColor(v);
    case 'dimension':
      return `CGFloat(${px(v)})`;
    case 'fontFamily':
      return `"${firstFamily(v)}"`;
    case 'fontWeight':
      return `Font.Weight.${SWIFT_WEIGHTS[v]}`;
    case 'number':
      return `Double(${v})`;
    case 'duration':
      return `TimeInterval(${round(ms(v) / 1000)}) // secondes`;
    case 'cubicBezier':
      return `${prefix}CubicBezier(x1: ${v[0]}, y1: ${v[1]}, x2: ${v[2]}, y2: ${v[3]})`;
    case 'typography':
      return (
        `${prefix}TextStyle(fontFamily: "${firstFamily(v.fontFamily)}", size: ${px(v.fontSize)}, ` +
        `weight: .${SWIFT_WEIGHTS[v.fontWeight]}, lineHeight: ${v.lineHeight})`
      );
    default:
      throw new Error(`Type non géré en Swift : ${token.$type} (${token.name})`);
  }
}

const header = `// ${HEADER}\nimport SwiftUI\n`;

// public enum DSTokens { public static let ... }
export const swiftEnum = {
  name: 'ds/swift-enum',
  format: ({ dictionary, options }) => {
    const lines = dictionary.allTokens.map((t) => `    public static let ${t.name} = ${toSwift(t, options.prefix)}`);
    return `${header}\npublic enum ${options.name} {\n${lines.join('\n')}\n}\n`;
  },
};

// public protocol DSColors { var colorBackgroundPage: Color { get } }
export const swiftProtocol = {
  name: 'ds/swift-protocol',
  format: ({ dictionary, options }) => {
    const lines = dictionary.allTokens.map((t) => `    var ${t.name}: Color { get }`);
    return `${header}\npublic protocol ${options.name} {\n${lines.join('\n')}\n}\n`;
  },
};

// public struct DSColorsLight: DSColors { public let ... }
export const swiftStruct = {
  name: 'ds/swift-struct',
  format: ({ dictionary, options }) => {
    const lines = dictionary.allTokens.map((t) => `    public let ${t.name} = ${toSwift(t, options.prefix)}`);
    return `${header}\npublic struct ${options.name}: ${options.implements} {\n    public init() {}\n\n${lines.join('\n')}\n}\n`;
  },
};

// Types utilitaires utilisés par les tokens (courbe d'animation, style de texte).
export const swiftSupport = {
  name: 'ds/swift-support',
  format: ({ options }) => {
    const p = options.prefix;
    return `${header}
public struct ${p}CubicBezier {
    public let x1, y1, x2, y2: Double

    public func animation(duration: TimeInterval) -> Animation {
        .timingCurve(x1, y1, x2, y2, duration: duration)
    }
}

public struct ${p}TextStyle {
    public let fontFamily: String
    public let size: CGFloat
    public let weight: Font.Weight
    public let lineHeight: CGFloat

    public var font: Font { .custom(fontFamily, size: size).weight(weight) }

    // SwiftUI exprime l'interligne comme un espace AJOUTÉ entre les lignes.
    public var lineSpacing: CGFloat { size * (lineHeight - 1) }
}
`;
  },
};
