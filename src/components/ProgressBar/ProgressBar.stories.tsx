import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  args: { label: "Import des badges d'accès", value: 45, max: 100, showValue: true, variant: 'brand' },
  argTypes: {
    variant: { control: 'inline-radio' },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'calc(var(--space-16) * 6)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Montre l'**avancement** d'une opération longue (import, export, mise à jour des boîtiers).
Sans \`value\`, la barre est **indéterminée** : l'opération progresse mais on ne sait pas de combien.

| À faire | À éviter |
|---|---|
| Un libellé qui dit ce qui progresse | Une barre sans libellé |
| \`valueText\` quand le pourcentage parle peu : « 18 fichiers sur 40 » | Un pourcentage qui recule |
| \`danger\` + un message d'erreur quand l'opération échoue | La couleur seule pour signaler l'échec |
| Un \`Spinner\` pour une attente courte | Une barre pour une attente d'une seconde |
`,
      },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomValueText: Story = {
  args: { label: 'Export des rapports de ronde', value: 18, max: 40, valueText: '18 fichiers sur 40' },
};

export const Indeterminate: Story = {
  args: { label: 'Connexion au boîtier d’alarme…', value: undefined },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <ProgressBar {...args} variant="brand" label="Mise à jour des caméras" value={62} />
      <ProgressBar {...args} variant="success" label="Sauvegarde terminée" value={100} />
      <ProgressBar {...args} variant="danger" label="Synchronisation interrompue" value={30} valueText="Échec à 30 %" />
    </div>
  ),
};
