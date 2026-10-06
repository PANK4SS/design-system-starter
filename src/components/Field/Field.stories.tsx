import type { Meta, StoryObj } from '@storybook/react-vite';
import { cx } from '../../utils/cx';
import { Field, useFieldIds, type FieldProps } from './Field';
import control from './control.module.css';

/** Exemple d'utilisation : un contrôle maison branché sur Field et useFieldIds. */
function DemoField({ label, hint, error, required }: Pick<FieldProps, 'label' | 'hint' | 'error' | 'required'>) {
  const ids = useFieldIds({ hasHint: Boolean(hint), hasError: Boolean(error) });
  return (
    <Field label={label} hint={hint} error={error} ids={ids} required={required}>
      <div className={cx(control.control, control.md, error && control.invalid)}>
        <input
          id={ids.controlId}
          className={control.native}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        />
      </div>
    </Field>
  );
}

const meta = {
  title: 'Formulaires/Field',
  component: DemoField,
  args: { label: 'Numéro de badge', hint: 'Il figure au dos de votre badge, sous le code-barres.' },
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
Brique **interne** partagée par \`Input\`, \`Textarea\` et \`Select\` : libellé, texte d'aide et message d'erreur,
reliés au contrôle par \`useFieldIds\` (\`htmlFor\`, \`aria-describedby\`). La « boîte » visuelle commune
est dans \`control.module.css\`. À utiliser pour créer un nouveau type de champ, pas directement dans un écran.

| À faire | À éviter |
|---|---|
| Passer \`ids.describedBy\` et \`aria-invalid\` au contrôle | Afficher une erreur non reliée au champ |
| Réutiliser \`control.module.css\` pour un nouveau champ | Recopier les styles de bordure et de focus |
| Utiliser \`Input\`, \`Select\`… dans les écrans | Assembler un champ à la main dans une page |
`,
      },
    },
  },
} satisfies Meta<typeof DemoField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { required: true, error: 'Le numéro de badge comporte 8 chiffres.' },
};
