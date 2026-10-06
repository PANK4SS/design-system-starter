import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Formulaires/Checkbox',
  component: Checkbox,
  args: { label: 'Recevoir les alertes de sécurité par e-mail', onChange: fn() },
  parameters: {
    docs: {
      description: {
        component: `
Case à cocher : une option **indépendante** que l'on active ou non (accepter des conditions, choisir plusieurs éléments).

| À faire | À éviter |
|---|---|
| Un libellé à l'affirmative : « Recevoir les alertes » | Une négation : « Ne pas recevoir les alertes » |
| Plusieurs cases quand plusieurs choix sont possibles | Des cases pour un choix unique (préférer \`RadioGroup\`) |
| \`indeterminate\` pour une case « Tout sélectionner » partielle | \`indeterminate\` comme troisième valeur métier |
| Un \`Switch\` pour un réglage appliqué immédiatement | Une case qui agit sans validation de formulaire et sans le dire |
`,
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    defaultChecked: true,
    description: 'Un message par incident détecté sur vos sites, au maximum un par heure.',
  },
};

export const WithError: Story = {
  args: {
    label: "J'accepte les conditions générales d'utilisation",
    required: true,
    error: 'Vous devez accepter les conditions pour créer votre compte.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    description: 'Réglage imposé par la politique de sécurité de votre entreprise.',
  },
};

const zones = ['Accueil', 'Parking', 'Salle des serveurs'];

/** Une case « Tout sélectionner » passe en état intermédiaire quand une partie seulement est cochée. */
export const Indeterminate: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['Parking']);
    const all = selected.length === zones.length;
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <Checkbox
          label="Toutes les zones"
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onChange={() => setSelected(all ? [] : zones)}
        />
        <div style={{ display: 'grid', gap: 8, paddingInlineStart: 28 }}>
          {zones.map((zone) => (
            <Checkbox
              key={zone}
              label={zone}
              checked={selected.includes(zone)}
              onChange={(event) =>
                setSelected((current) =>
                  event.target.checked ? [...current, zone] : current.filter((item) => item !== zone),
                )
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
