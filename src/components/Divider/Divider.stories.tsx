import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta = {
  title: 'Affichage/Divider',
  component: Divider,
  args: { orientation: 'horizontal', spacing: 'md' },
  argTypes: {
    orientation: { control: 'inline-radio' },
    spacing: { control: 'inline-radio' },
    label: { control: 'text' },
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
Trait fin qui **sépare** deux groupes de contenus, horizontalement ou verticalement, avec un libellé centré facultatif.

| À faire | À éviter |
|---|---|
| Séparer deux groupes de nature différente | Un trait entre chaque ligne d'une liste |
| Un libellé court : « ou », « Hier » | Utiliser le libellé comme titre de section |
| De l'espace blanc quand il suffit | Empiler bordures, ombres et séparateurs |
`,
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div>
      <p style={{ margin: 0 }}>Rondes de jour : 8 agents mobilisés.</p>
      <Divider {...args} />
      <p style={{ margin: 0 }}>Rondes de nuit : 5 agents mobilisés.</p>
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Hier' },
  render: (args) => (
    <div>
      <p style={{ margin: 0 }}>07 h 15 : ouverture du site par l'agent d'accueil.</p>
      <Divider {...args} />
      <p style={{ margin: 0 }}>22 h 40 : fermeture et activation de l'alarme.</p>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', spacing: 'sm' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>12 sites</span>
      <Divider {...args} />
      <span>34 agents</span>
      <Divider {...args} />
      <span>2 alertes</span>
    </div>
  ),
};

export const Spacings: Story = {
  render: (args) => (
    <div>
      {(['none', 'sm', 'md', 'lg'] as const).map((spacing) => (
        <div key={spacing}>
          <p style={{ margin: 0 }}>Espacement {spacing}</p>
          <Divider {...args} spacing={spacing} />
        </div>
      ))}
    </div>
  ),
};
