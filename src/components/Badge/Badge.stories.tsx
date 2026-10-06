import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert, CircleCheck, Clock, Info, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Badge } from './Badge';

const meta = {
  title: 'Affichage/Badge',
  component: Badge,
  args: { children: 'En service', variant: 'success', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio' },
    size: { control: 'inline-radio' },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
Courte étiquette qui indique un **statut** ou une **catégorie** (état d'un site, niveau d'alerte…). Le badge n'est pas cliquable.

| À faire | À éviter |
|---|---|
| Un ou deux mots : « En service », « Critique » | Une phrase complète |
| La couleur ET le texte portent le sens | Un badge vide où seule la couleur parle |
| \`danger\` pour un vrai problème | \`danger\` pour attirer l'œil |
| Un bouton ou un lien pour une action | Un badge cliquable |
`,
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Badge {...args} variant="neutral">Brouillon</Badge>
      <Badge {...args} variant="brand">Premium</Badge>
      <Badge {...args} variant="info">Planifiée</Badge>
      <Badge {...args} variant="success">En service</Badge>
      <Badge {...args} variant="warning">Maintenance</Badge>
      <Badge {...args} variant="danger">Intrusion</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Badge {...args} variant="neutral" icon={Clock}>En attente</Badge>
      <Badge {...args} variant="brand" icon={ShieldCheck}>Certifié</Badge>
      <Badge {...args} variant="info" icon={Info}>Information</Badge>
      <Badge {...args} variant="success" icon={CircleCheck}>Ronde validée</Badge>
      <Badge {...args} variant="warning" icon={TriangleAlert}>Batterie faible</Badge>
      <Badge {...args} variant="danger" icon={CircleAlert}>Alarme déclenchée</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
      <Badge {...args} size="sm" icon={CircleCheck}>Petit</Badge>
      <Badge {...args} size="md" icon={CircleCheck}>Moyen</Badge>
    </div>
  ),
};
