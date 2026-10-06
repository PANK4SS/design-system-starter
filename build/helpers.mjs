// Petites fonctions partagées par les formats Kotlin et Swift.

export const HEADER = 'Ne pas modifier : fichier généré par build-tokens.mjs à partir de tokens/';

// "16px" -> 16
export const px = (value) => parseFloat(value);

// "100ms" -> 100
export const ms = (value) => parseFloat(value);

// Arrondi à 3 décimales, sans zéros inutiles : 38.400000001 -> 38.4
export const round = (n) => Number(n.toFixed(3));

// "#D8AA00" -> [0.847, 0.667, 0]
export const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => round(parseInt(h.slice(i, i + 2), 16) / 255));
};

// ["Orbitron", "Orbit", "sans-serif"] -> "Orbitron" (le mobile n'a pas de liste de secours)
export const firstFamily = (family) => (Array.isArray(family) ? family[0] : family);

// font.size.* est en sp sur Android (respecte la taille de texte choisie par l'utilisateur)
export const isFontSize = (token) => token.path[0] === 'font' && token.path[1] === 'size';

// Les tokens qui changent selon le thème : tokens/semantic/<theme>/
export const isThemed = (token) => /semantic\/(light|dark)\//.test(token.filePath);

// Les component tokens (tokens/component/) ne servent qu'aux composants React : web uniquement.
export const isComponent = (token) => token.filePath.includes('tokens/component/');
