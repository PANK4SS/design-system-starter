import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Select } from './Select';

const sites = [
  { value: 'paris', label: 'Paris – Siège' },
  { value: 'lyon', label: 'Lyon – Entrepôt' },
  { value: 'marseille', label: 'Marseille – Port' },
  { value: 'lille', label: 'Lille – Agence (fermée)', disabled: true },
];

const meta = {
  title: 'Formulaires/Select',
  component: Select,
  args: { label: 'Site d\'intervention', options: sites, placeholder: 'Choisir un site', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Liste déroulante **native** habillée aux couleurs du système : un choix unique parmi une liste connue.

| À faire | À éviter |
|---|---|
| Entre 5 et 15 options environ | 2 ou 3 options (préférer \`RadioGroup\`) |
| Un \`placeholder\` qui invite à choisir : « Choisir un site » | Pré-sélectionner un choix arbitraire |
| Des libellés courts, triés logiquement | Une liste de 200 éléments sans recherche |
`,
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'lyon', hint: 'Le site où l\'agent sera affecté.' },
};

export const WithError: Story = {
  args: { required: true, error: 'Choisissez le site d\'intervention.' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Select {...args} size="sm" label="Petit" />
      <Select {...args} size="md" label="Moyen" />
      <Select {...args} size="lg" label="Grand" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'paris' },
};
