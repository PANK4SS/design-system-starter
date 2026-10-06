import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Formulaires/Switch',
  component: Switch,
  args: { label: 'Authentification à deux facteurs', onChange: fn() },
  parameters: {
    docs: {
      description: {
        component: `
Interrupteur **marche / arrêt** pour un réglage qui s'applique **immédiatement**, sans bouton « Enregistrer ».
Annoncé « activé / désactivé » par les lecteurs d'écran, basculé avec la touche Espace.

| À faire | À éviter |
|---|---|
| Un réglage à effet immédiat : « Notifications push » | Un choix qui attend la validation d'un formulaire (préférer \`Checkbox\`) |
| Un libellé qui nomme la fonction : « Mode hors ligne » | Un libellé qui change selon l'état (« Activé » / « Désactivé ») |
| Une \`description\` pour expliquer la conséquence | Un interrupteur pour une action ponctuelle (préférer \`Button\`) |
`,
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    defaultChecked: true,
    description: 'Un code vous sera demandé à chaque connexion depuis un nouvel appareil.',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    label: 'Journalisation des accès',
    description: 'Ce réglage est géré par votre administrateur.',
  },
};

/** Mode contrôlé : l'état vit dans le composant parent. */
export const Controlled: Story = {
  render: function Render(args) {
    const [enabled, setEnabled] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Switch
          {...args}
          label="Alertes en temps réel"
          checked={enabled}
          onChange={(event) => {
            setEnabled(event.target.checked);
            args.onChange?.(event);
          }}
        />
        <p style={{ margin: 0 }}>Les alertes sont {enabled ? 'activées' : 'désactivées'}.</p>
      </div>
    );
  },
};
