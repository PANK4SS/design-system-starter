import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

// Portrait d'exemple embarqué (pas de dépendance réseau) : une silhouette stylisée
const portrait = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
    <rect width="96" height="96" fill="#2a78d6"/>
    <circle cx="48" cy="38" r="18" fill="#f2d466"/>
    <path d="M14 96c4-22 18-32 34-32s30 10 34 32z" fill="#1c1d22"/>
  </svg>`,
)}`;

const meta = {
  title: 'Affichage/Avatar',
  component: Avatar,
  args: { name: 'Léa Morel', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio' },
    status: { control: 'inline-radio', options: [undefined, 'online', 'away', 'busy', 'offline'] },
  },
  parameters: {
    docs: {
      description: {
        component: `
Représente une personne (agent, client, opérateur). Affiche la photo ; à défaut (pas d'image ou image
cassée), les **initiales** du nom ; à défaut de nom, une icône générique.

| À faire | À éviter |
|---|---|
| Toujours fournir \`name\` (initiales + texte alternatif) | Un avatar sans nom ni \`alt\` |
| \`alt=""\` si le nom est écrit juste à côté | Faire lire deux fois le même nom |
| \`status\` pour la disponibilité, annoncé en texte | Une pastille de couleur sans équivalent texte |
| Les tailles prévues (\`sm\` à \`xl\`) | Une taille forcée en CSS |
`,
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: { src: portrait, name: 'Karim Benali' },
};

export const Initials: Story = {};

export const BrokenImage: Story = {
  args: { src: '/photo-introuvable.jpg', name: 'Sophie Laurent-Dubois' },
  parameters: { docs: { description: { story: "L'image ne se charge pas : les initiales prennent le relais." } } },
};

export const NoName: Story = {
  args: { name: undefined, alt: 'Utilisateur anonyme' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
};

export const Status: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
      <Avatar {...args} name="Léa Morel" status="online" />
      <Avatar {...args} name="Karim Benali" src={portrait} status="away" />
      <Avatar {...args} name="Hugo Petit" status="busy" />
      <Avatar {...args} name={undefined} alt="Agent de nuit" status="offline" />
    </div>
  ),
};

export const WithNameNextToIt: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      <Avatar {...args} alt="" size="lg" />
      <div>
        <div style={{ fontWeight: 'var(--font-weight-bold)' }}>Léa Morel</div>
        <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-200)' }}>Cheffe de poste</div>
      </div>
    </div>
  ),
};
