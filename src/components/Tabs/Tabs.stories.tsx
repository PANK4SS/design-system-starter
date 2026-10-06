import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Bell, Lock, User } from 'lucide-react';
import { Tabs, type TabItem } from './Tabs';

const accountTabs: TabItem[] = [
  {
    value: 'profil',
    label: 'Profil',
    icon: User,
    content: <p style={{ margin: 0 }}>Nom, adresse e-mail et photo visibles par les membres de votre équipe.</p>,
  },
  {
    value: 'securite',
    label: 'Sécurité',
    icon: Lock,
    content: <p style={{ margin: 0 }}>Mot de passe, double authentification et sessions actives.</p>,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: Bell,
    content: <p style={{ margin: 0 }}>Choisissez les alertes reçues par e-mail et sur mobile.</p>,
  },
];

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: { items: accountTabs, label: 'Paramètres du compte', onChange: fn() },
  argTypes: { items: { control: false } },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Répartit un contenu en **sections de même niveau**, une seule visible à la fois (motif « tabs » des WAI-ARIA APG).

Les onglets sont décrits par un tableau \`items\` (\`{ value, label, icon?, disabled?, content }\`) : un seul
composant à importer, et les liens ARIA (\`aria-controls\`, \`aria-labelledby\`) sont posés automatiquement.

Clavier : Tab entre dans la liste sur l'onglet actif, Flèches gauche/droite changent d'onglet (le panneau
suit immédiatement), Début/Fin vont au premier/dernier, Tab suivant entre dans le panneau.

Mode **non contrôlé** avec \`defaultValue\`, ou **contrôlé** avec \`value\` + \`onChange\`.

| À faire | À éviter |
|---|---|
| Des libellés courts (un ou deux mots) | Des phrases dans les onglets |
| Entre 2 et 6 onglets | Un seul onglet, ou une rangée qui déborde |
| Des contenus indépendants les uns des autres | Des étapes successives (préférer un parcours en étapes) |
| Nommer la liste avec \`label\` | Des onglets pour naviguer vers d'autres pages (préférer des liens) |
`,
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OngletDesactive: Story = {
  name: 'Onglet désactivé',
  args: {
    items: [...accountTabs.slice(0, 2), { ...accountTabs[2], disabled: true }],
  },
};

export const SansIcones: Story = {
  name: 'Sans icônes',
  args: {
    label: 'Rapport d’audit',
    defaultValue: 'vulnerabilites',
    items: [
      { value: 'resume', label: 'Résumé', content: 'Trois points critiques relevés sur le périmètre réseau.' },
      {
        value: 'vulnerabilites',
        label: 'Vulnérabilités',
        content: '12 vulnérabilités, dont 3 critiques et 5 moyennes.',
      },
      {
        value: 'recommandations',
        label: 'Recommandations',
        content: 'Mettre à jour le pare-feu et activer la double authentification.',
      },
    ],
  },
};

export const PleineLargeur: Story = {
  name: 'Pleine largeur',
  args: { fullWidth: true },
};

/** Le parent garde l'onglet actif dans son état et peut le changer de l'extérieur. */
export const Controle: Story = {
  name: 'Contrôlé',
  render: function Render(args) {
    const [value, setValue] = useState('securite');
    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Tabs
          {...args}
          value={value}
          onChange={(next) => {
            setValue(next);
            args.onChange?.(next);
          }}
        />
        <p style={{ margin: 0, color: 'var(--color-text-subtle)' }}>Onglet actif : {value}</p>
      </div>
    );
  },
};
