import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search } from 'lucide-react';
import { fn } from 'storybook/test';
import { Icon } from '../Icon';
import { Input } from './Input';

const meta = {
  title: 'Formulaires/Input',
  component: Input,
  args: { label: 'Adresse e-mail', placeholder: 'prenom.nom@exemple.fr', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio' },
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'url', 'number'] },
    iconStart: { control: false },
  },
  // Les champs prennent la largeur de leur conteneur : on leur en donne une raisonnable
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
Champ de saisie **d'une ligne** (nom, e-mail, mot de passe…), avec son libellé, son aide et son message d'erreur.

| À faire | À éviter |
|---|---|
| Un \`label\` visible et explicite : « Adresse e-mail » | Un placeholder à la place du label |
| Un \`hint\` pour le format attendu : « 10 chiffres » | Expliquer le format seulement dans l'erreur |
| Une erreur qui dit comment corriger : « Saisissez une adresse e-mail valide » | « Champ invalide » |
| Le bon \`type\` (\`email\`, \`tel\`, \`password\`) pour le clavier mobile | \`type="text"\` pour tout |
`,
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Nous ne partagerons jamais votre adresse.' },
};

export const WithError: Story = {
  args: {
    defaultValue: 'prenom.nom@',
    error: 'Saisissez une adresse e-mail valide, par exemple prenom.nom@exemple.fr.',
  },
};

export const Required: Story = {
  args: { required: true, hint: 'Champ obligatoire.' },
};

export const WithIcon: Story = {
  args: { type: 'email', iconStart: <Icon icon={Mail} size="sm" /> },
};

export const Password: Story = {
  args: {
    label: 'Mot de passe',
    type: 'password',
    placeholder: undefined,
    defaultValue: 'Sécurité2026',
    hint: '12 caractères minimum, dont un chiffre.',
    autoComplete: 'current-password',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Input {...args} size="sm" label="Petit" iconStart={<Icon icon={Search} size="sm" />} />
      <Input {...args} size="md" label="Moyen" iconStart={<Icon icon={Search} size="sm" />} />
      <Input {...args} size="lg" label="Grand" iconStart={<Icon icon={Search} size="sm" />} />
    </div>
  ),
};

export const ReadOnly: Story = {
  args: { label: 'Identifiant client', readOnly: true, defaultValue: 'CLI-2026-00412', placeholder: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'prenom.nom@exemple.fr' },
};
