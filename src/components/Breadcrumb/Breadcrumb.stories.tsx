import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'Accueil', href: '#' },
      { label: 'Projets', href: '#' },
      { label: 'Audit réseau 2026', href: '#' },
      { label: 'Rapport final' },
    ],
  },
  argTypes: { items: { control: 'object' } },
  parameters: {
    docs: {
      description: {
        component: `
**Situe** la page courante dans l'arborescence du site et permet de remonter d'un ou plusieurs niveaux.
Rendu dans un \`<nav aria-label="Fil d'Ariane">\` avec une liste ordonnée ; la dernière étape porte
\`aria-current="page"\`.

| À faire | À éviter |
|---|---|
| Partir de l'accueil et finir sur la page courante | Reproduire l'historique de navigation |
| Reprendre exactement le titre de chaque page | Des libellés différents des titres des pages |
| L'utiliser à partir de deux niveaux de profondeur | Un fil d'Ariane sur la page d'accueil |
`,
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DeuxNiveaux: Story = {
  name: 'Deux niveaux',
  args: {
    items: [
      { label: 'Accueil', href: '#' },
      { label: 'Paramètres' },
    ],
  },
};

export const Long: Story = {
  name: 'Long (retour à la ligne)',
  render: (args) => (
    <div style={{ maxWidth: 'calc(var(--space-16) * 5)' }}>
      <Breadcrumb
        {...args}
        items={[
          { label: 'Accueil', href: '#' },
          { label: 'Clients', href: '#' },
          { label: 'Banque Régionale du Centre', href: '#' },
          { label: 'Tests d’intrusion', href: '#' },
          { label: 'Campagne de mars 2026' },
        ]}
      />
    </div>
  ),
};
