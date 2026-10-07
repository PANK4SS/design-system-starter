import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Formulaires/SearchBar',
  component: SearchBar,
  args: {
    label: 'Rechercher un site',
    placeholder: 'Nom, ville ou code du site',
    onSearch: fn(),
    onValueChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio' },
    shape: { control: 'inline-radio' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Barre de recherche : un repère \`role="search"\` avec un champ \`type="search"\`.
**Entrée** lance la recherche (\`onSearch\`), la croix vide le champ et rend le focus au clavier.

| À faire | À éviter |
|---|---|
| Un \`label\` précis, même masqué : « Rechercher un site » | Un champ sans nom accessible |
| Un placeholder qui donne des exemples : « Nom, ville ou code » | Un placeholder qui répète le label |
| Une seule barre de recherche principale par page | Plusieurs repères \`search\` sans libellés distincts |
| \`showLabel\` dans un formulaire de filtres | Une loupe seule, sans libellé, comme unique indice |
`,
      },
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'Entrepôt de Lyon' },
};

export const VisibleLabel: Story = {
  args: { showLabel: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <SearchBar {...args} size="sm" label="Recherche (petite)" defaultValue="Parking" />
      <SearchBar {...args} size="md" label="Recherche (moyenne)" defaultValue="Parking" />
      <SearchBar {...args} size="lg" label="Recherche (grande)" defaultValue="Parking" />
    </div>
  ),
};

/** `pill` : bords entièrement ronds, par exemple pour la recherche principale d'un en-tête. */
export const Shapes: Story = {
  name: 'Formes',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <SearchBar {...args} shape="rounded" label="Recherche (arrondie)" defaultValue="Parking" />
      <SearchBar {...args} shape="pill" label="Recherche (pilule)" defaultValue="Parking" />
      <SearchBar {...args} shape="pill" size="lg" label="Recherche (pilule, grande)" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Mode contrôlé : le parent garde le texte et affiche la dernière recherche lancée. */
export const Controlled: Story = {
  render: function Render(args) {
    const [query, setQuery] = useState('badge');
    const [submitted, setSubmitted] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <SearchBar
          {...args}
          label="Rechercher un incident"
          placeholder="Mot-clé, numéro d'incident"
          value={query}
          onValueChange={setQuery}
          onSearch={(text) => {
            setSubmitted(text);
            args.onSearch?.(text);
          }}
        />
        <p style={{ margin: 0 }}>Dernière recherche : {submitted || 'aucune'}</p>
      </div>
    );
  },
};
