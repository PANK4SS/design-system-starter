import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  args: { size: 'md', label: 'Chargement des rondes…', showLabel: false },
  argTypes: {
    size: { control: 'inline-radio' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Indique qu'une opération **de durée inconnue** est en cours. Le libellé est annoncé aux lecteurs d'écran
(\`role="status"\`) même s'il n'est pas affiché. Sa couleur suit celle du texte autour.

| À faire | À éviter |
|---|---|
| Un libellé précis : « Chargement des rondes… » | « Chargement » partout, sans contexte |
| \`ProgressBar\` quand l'avancement est connu | Un spinner pour un import de 2 minutes |
| \`Skeleton\` pour une page qui se dessine | Plusieurs spinners sur le même écran |
`,
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithVisibleLabel: Story = {
  args: { showLabel: true, label: 'Connexion aux caméras…' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
      <Spinner {...args} size="xl" />
    </div>
  ),
};

export const InheritsColor: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
      <span style={{ color: 'var(--color-feedback-info)' }}>
        <Spinner {...args} showLabel label="Synchronisation…" />
      </span>
      <span style={{ color: 'var(--color-feedback-success)' }}>
        <Spinner {...args} showLabel label="Vérification…" />
      </span>
    </div>
  ),
};
