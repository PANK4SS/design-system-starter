import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardBody } from '../Card';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  args: { variant: 'text', lines: 3 },
  argTypes: {
    variant: { control: 'inline-radio' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'calc(var(--space-16) * 5)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Silhouette grise qui reprend la **forme** d'un contenu pendant son chargement, pour éviter que la page ne
saute à l'arrivée des données. Le reflet animé disparaît si l'utilisateur a demandé à réduire les animations.
Le squelette est \`aria-hidden\` : le conteneur porte \`aria-busy="true"\` et un texte annonce le chargement.

| À faire | À éviter |
|---|---|
| Reproduire la mise en page réelle (avatar, titre, lignes) | Un gros rectangle unique pour toute la page |
| \`aria-busy="true"\` sur le conteneur en chargement | Compter sur le squelette pour informer un lecteur d'écran |
| Des durées de chargement courtes | Un squelette affiché indéfiniment en cas d'erreur |
`,
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const Circle: Story = {
  args: { variant: 'circle', width: 'var(--space-12)' },
};

export const Rect: Story = {
  args: { variant: 'rect', height: 'calc(var(--space-16) * 2)' },
};

export const CardPlaceholder: Story = {
  render: () => (
    <Card as="section" aria-busy="true" aria-label="Fiche agent en cours de chargement">
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
        <Skeleton variant="circle" width="var(--space-12)" />
        <Skeleton variant="text" lines={2} width="calc(var(--space-16) * 2)" />
      </div>
      <Skeleton variant="rect" height="var(--space-16)" />
      <CardBody>
        <Skeleton variant="text" lines={3} />
      </CardBody>
    </Card>
  ),
};
