import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Textarea } from './Textarea';

const meta = {
  title: 'Formulaires/Textarea',
  component: Textarea,
  args: {
    label: "Description de l'incident",
    placeholder: 'Décrivez ce que vous avez constaté, où et à quelle heure.',
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Champ de saisie **sur plusieurs lignes** : message, commentaire, compte rendu. Même structure que \`Input\` (label, aide, erreur).

| À faire | À éviter |
|---|---|
| Indiquer la longueur attendue dans le \`hint\` | Couper le texte sans prévenir |
| Une hauteur (\`rows\`) adaptée au contenu attendu | Un textarea d'une ligne (utiliser \`Input\`) |
| Laisser l'utilisateur agrandir le champ | Bloquer le redimensionnement sans raison |
`,
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: '500 caractères maximum.', maxLength: 500 },
};

export const WithError: Story = {
  args: {
    required: true,
    error: "Décrivez l'incident en quelques mots pour que l'équipe puisse intervenir.",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Porte du local technique trouvée ouverte à 22 h 15. Aucun matériel manquant constaté.',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Ronde effectuée sans anomalie.' },
};

export const NotResizable: Story = {
  args: { resizable: false, rows: 3, label: 'Commentaire' },
};
