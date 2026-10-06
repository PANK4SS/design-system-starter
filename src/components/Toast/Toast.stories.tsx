import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ToastProvider, useToast } from './Toast';

const meta = {
  title: 'Feedback/Toast',
  component: ToastProvider,
  args: { label: 'Notifications', children: null },
  argTypes: { children: { control: false } },
  // Chaque story est enveloppée dans le provider, comme le serait l'application entière
  decorators: [
    (Story, context) => (
      <ToastProvider label={context.args.label}>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    // Chaque exemple dans sa propre iframe : sinon toutes les piles de toasts se superposent dans la page Docs
    docs: {
      story: { inline: false, iframeHeight: 360 },
      description: {
        component: `
Notification **passagère** qui confirme une action (« Rapport envoyé ») sans interrompre le travail.
On enveloppe l'application dans \`ToastProvider\`, puis on appelle \`toast()\` depuis n'importe quel composant :

\`\`\`tsx
const { toast, dismiss } = useToast();
toast({ title: 'Rapport envoyé', description: 'Le client le recevra sous 5 minutes.', variant: 'success' });
\`\`\`

Les toasts s'empilent en bas à droite et se ferment seuls après \`duration\` (5 s par défaut). Le décompte
se met **en pause** au survol et au focus, pour laisser le temps de lire. La zone est \`aria-live="polite"\` :
le message est annoncé sans couper la parole.

| À faire | À éviter |
|---|---|
| Confirmer une action réussie : « Badge activé » | Un toast pour une erreur bloquante (préférer \`Alert\`) |
| Un titre de quelques mots | Une information indispensable qui disparaît seule |
| \`duration: Infinity\` si le message contient une action | Un bouton important dans un toast qui se ferme seul |
| Un toast à la fois pour une même action | Une rafale de toasts identiques |
`,
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Triggers() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Nouveau planning publié', description: 'Semaine 42, équipe de nuit.' })}
      >
        Information
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({ title: 'Rapport envoyé', description: 'Le client le recevra sous 5 minutes.', variant: 'success' })
        }
      >
        Succès
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Connexion instable', description: 'Nouvelle tentative en cours.', variant: 'warning' })}
      >
        Avertissement
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ title: 'Envoi impossible', description: 'Vérifiez votre connexion.', variant: 'danger' })}
      >
        Erreur
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => <Triggers />,
};

function PersistentDemo() {
  const { toast, dismiss } = useToast();
  const lastId = useRef<string | null>(null);
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      <Button
        onClick={() => {
          lastId.current = toast({
            title: 'Export en cours',
            description: 'Le toast reste affiché jusqu’à sa fermeture.',
            duration: Infinity,
          });
        }}
      >
        Afficher un toast persistant
      </Button>
      <Button variant="secondary" onClick={() => lastId.current && dismiss(lastId.current)}>
        Fermer le dernier
      </Button>
    </div>
  );
}

export const Persistent: Story = {
  render: () => <PersistentDemo />,
};

// Affiche une pile dès l'ouverture, pour voir l'apparence sans cliquer
function StackDemo() {
  const { toast } = useToast();
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast({ title: 'Badge d’accès activé', description: 'Karim Benali, entrepôt Nord.', variant: 'success', duration: Infinity });
    toast({ title: 'Maintenance ce soir', description: 'Caméras indisponibles de 3 h à 4 h.', variant: 'info', duration: Infinity });
    toast({ title: 'Batterie faible', description: 'Détecteur du hall B.', variant: 'warning', duration: Infinity });
    toast({ title: 'Synchronisation échouée', variant: 'danger', duration: Infinity });
  }, [toast]);
  return <Triggers />;
}

export const Stack: Story = {
  render: () => <StackDemo />,
};
