import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  args: {
    variant: 'info',
    title: 'Maintenance planifiée',
    children: 'Les caméras du site de Lyon seront redémarrées dimanche entre 3 h et 4 h.',
  },
  argTypes: {
    variant: { control: 'inline-radio' },
    actions: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'calc(var(--space-16) * 8)', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
Message **en ligne**, dans le flux de la page : information, confirmation, avertissement ou erreur.
Chaque variante a sa couleur ET son icône.

**Annonce aux lecteurs d'écran** : \`danger\` utilise \`role="alert"\`, qui interrompt immédiatement
l'utilisateur, car l'information est urgente. Les autres variantes utilisent \`role="status"\`, annoncé
poliment à la fin de la phrase en cours : une simple information ne doit pas couper la parole.

| À faire | À éviter |
|---|---|
| Un titre court + une phrase qui dit quoi faire | Un long paragraphe technique |
| \`danger\` pour une erreur qui bloque | \`danger\` pour une simple information |
| Un \`Toast\` pour une confirmation passagère | Une alerte qui reste affichée pour « Enregistré » |
| \`onDismiss\` si le message peut être ignoré | Fermer automatiquement une erreur |
`,
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Ronde validée',
    children: 'Les 14 points de contrôle de l’entrepôt Nord ont été scannés.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Batterie faible',
    children: 'Le détecteur de mouvement du hall B doit être rechargé sous 48 heures.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Intrusion détectée',
    children: 'Le capteur de la porte arrière s’est déclenché à 02 h 14. Une patrouille a été prévenue.',
  },
};

export const WithoutTitle: Story = {
  args: { title: undefined, children: 'Vos modifications seront visibles par toute l’équipe de nuit.' },
};

export const WithActions: Story = {
  args: {
    variant: 'warning',
    title: 'Caméra hors ligne',
    children: 'La caméra du quai de chargement ne répond plus depuis 01 h 12.',
    actions: (
      <>
        <Button size="sm" variant="secondary" onClick={fn()}>
          Voir le journal
        </Button>
        <Button size="sm" onClick={fn()}>
          Prévenir le technicien
        </Button>
      </>
    ),
  },
};

export const Dismissible: Story = {
  render: function Render(args) {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} onDismiss={() => setVisible(false)} />
    ) : (
      <Button variant="secondary" onClick={() => setVisible(true)}>
        Réafficher le message
      </Button>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Alert variant="info" title="Information" onDismiss={fn()}>
        Nouveau planning disponible.
      </Alert>
      <Alert variant="success" title="Succès" onDismiss={fn()}>
        Badge d’accès activé.
      </Alert>
      <Alert variant="warning" title="Attention" onDismiss={fn()}>
        Certificat expirant dans 7 jours.
      </Alert>
      <Alert variant="danger" title="Erreur" onDismiss={fn()}>
        Impossible de joindre le boîtier d’alarme.
      </Alert>
    </div>
  ),
};
