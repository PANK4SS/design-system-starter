import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Radio, RadioGroup } from './RadioGroup';

const niveaux = [
  { value: 'standard', label: 'Standard', description: 'Intervention sous 4 heures, en jours ouvrés.' },
  { value: 'renforce', label: 'Renforcé', description: 'Intervention sous 1 heure, 7 jours sur 7.' },
  { value: 'critique', label: 'Critique', description: 'Agent sur site en permanence.' },
];

const meta = {
  title: 'Formulaires/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  args: { label: 'Niveau de protection', options: niveaux, defaultValue: 'standard', onChange: fn() },
  argTypes: {
    orientation: { control: 'inline-radio' },
    options: { control: false },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
Groupe de boutons radio : un **choix unique** parmi quelques options, toutes visibles d'un coup d'œil.
Au clavier : \`Tab\` entre dans le groupe, les flèches changent la sélection.

| À faire | À éviter |
|---|---|
| 2 à 6 options, toutes visibles | Plus de 7 options (préférer \`Select\`) |
| Une \`legend\` qui pose la question : « Niveau de protection » | Un groupe sans question |
| Une option présélectionnée quand un choix par défaut est raisonnable | Un bouton radio seul (préférer \`Checkbox\`) |
| \`horizontal\` pour 2 ou 3 choix courts (« Oui / Non ») | \`horizontal\` avec des libellés longs |
`,
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'Vous pourrez changer de niveau à tout moment.' },
};

export const Horizontal: Story = {
  args: {
    label: "Badge d'accès remis ?",
    orientation: 'horizontal',
    defaultValue: undefined,
    options: [
      { value: 'oui', label: 'Oui' },
      { value: 'non', label: 'Non' },
    ],
  },
};

export const WithError: Story = {
  args: {
    defaultValue: undefined,
    required: true,
    error: 'Choisissez un niveau de protection pour continuer.',
  },
};

export const DisabledOption: Story = {
  args: {
    options: [...niveaux.slice(0, 2), { ...niveaux[2], disabled: true, description: 'Indisponible sur ce site.' }],
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Écriture alternative avec des `<Radio>` enfants, en mode contrôlé. */
export const WithChildrenControlled: Story = {
  args: { options: undefined },
  render: function Render(args) {
    const [value, setValue] = useState('jour');
    return (
      <RadioGroup
        {...args}
        label="Créneau de ronde"
        value={value}
        onChange={(next) => {
          setValue(next);
          args.onChange?.(next);
        }}
      >
        <Radio value="jour" label="Jour (6 h – 18 h)" />
        <Radio value="nuit" label="Nuit (18 h – 6 h)" />
        <Radio value="continu" label="En continu" />
      </RadioGroup>
    );
  },
};
