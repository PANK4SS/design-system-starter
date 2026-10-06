import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Settings, Trash2, X } from 'lucide-react';
import { Button } from './Button';
import { IconButton } from './IconButton';

// Petite icône pour les exemples (dans un vrai projet : la bibliothèque d'icônes)
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Enregistrer', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio' },
    size: { control: 'inline-radio' },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
Déclenche une **action** (enregistrer, envoyer, supprimer…).

| À faire | À éviter |
|---|---|
| Un seul bouton \`primary\` par écran | Plusieurs \`primary\` côte à côte |
| Un verbe d'action : « Supprimer le projet » | « OK », « Oui » |
| \`danger\` + une confirmation pour une action irréversible | \`danger\` pour attirer l'attention |
| Un lien (\`<a>\`) pour **naviguer** vers une page | Un bouton pour naviguer |
`,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Annuler' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'En savoir plus' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Supprimer le projet' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button {...args} size="sm">
        Petit
      </Button>
      <Button {...args} size="md">
        Moyen
      </Button>
      <Button {...args} size="lg">
        Grand
      </Button>
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { children: 'Continuer', iconEnd: <ArrowIcon /> },
};

export const Loading: Story = {
  args: { loading: true, children: 'Envoi en cours…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Créer mon compte' },
  parameters: { layout: 'padded' },
};

export const IconOnly: Story = {
  name: 'Icône seule (IconButton)',
  parameters: {
    docs: {
      description: {
        story:
          "`IconButton` : bouton carré sans texte. Son `label` est obligatoire, il est lu par les lecteurs d'écran.",
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton icon={Settings} label="Paramètres" variant="secondary" size="sm" />
      <IconButton icon={X} label="Fermer" />
      <IconButton icon={Trash2} label="Supprimer le site" variant="danger" size="lg" />
    </div>
  ),
};
