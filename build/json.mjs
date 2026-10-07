// Format JSON des tokens, pour les outils et les IA : nom de variable CSS, valeur, type, chemin.
export const tokensJson = {
  name: 'ds/tokens-json',
  format: ({ dictionary }) =>
    JSON.stringify(
      dictionary.allTokens.map((t) => ({ name: `--${t.name}`, value: t.$value, type: t.$type, path: t.path })),
      null,
      2,
    ) + '\n',
};
