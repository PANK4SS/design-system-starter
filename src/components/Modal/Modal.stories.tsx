import { useEffect, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, type ButtonVariant } from '../Button';
import { Modal, type ModalProps } from './Modal';

const meta = {
  title: 'Superpositions/Modal',
  component: Modal,
  args: {
    open: false,
    onClose: fn(),
    title: 'Supprimer le projet ?',
    description: 'Le projet « Audit réseau 2026 » et ses 14 rapports seront définitivement supprimés.',
    size: 'sm',
  },
  argTypes: {
    size: { control: 'inline-radio' },
    title: { control: 'text' },
    description: { control: 'text' },
    footer: { control: false },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
Fenêtre qui **interrompt** l'utilisateur pour une décision ou une saisie courte. Construite sur l'élément natif
\`<dialog>\` (\`showModal()\`) : le focus reste piégé dans la fenêtre, Échap la ferme, la page derrière est inerte
et ne défile plus. À la fermeture, le focus revient sur le bouton qui l'a ouverte.

Le composant est **contrôlé** : le parent garde l'état \`open\` et le remet à \`false\` dans \`onClose\`.

| À faire | À éviter |
|---|---|
| Un titre qui dit l'enjeu : « Supprimer le projet ? » | Un titre vague : « Attention » |
| Des actions explicites dans \`footer\` : « Supprimer », « Annuler » | « OK » / « Oui » / « Non » |
| \`closeOnBackdropClick={false}\` si une saisie peut être perdue | Ouvrir une modale par-dessus une autre modale |
| Réserver la modale aux décisions bloquantes | Afficher une information secondaire dans une modale (préférer un message en ligne) |

Les exemples « ouverts » s'affichent dans un cadre séparé sur cette page, pour ne pas bloquer la documentation.
`,
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Exemple complet : un bouton ouvre la fenêtre, le parent garde l'état `open`.
 * `renderFooter` reçoit la fonction de fermeture pour câbler les boutons d'action.
 */
function ModalDemo({
  triggerLabel,
  triggerVariant = 'secondary',
  renderFooter,
  ...args
}: ModalProps & {
  triggerLabel: string;
  triggerVariant?: ButtonVariant;
  renderFooter?: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(args.open);
  // Le contrôle « open » du panneau Controls pilote aussi la fenêtre
  // oxlint-disable-next-line react/set-state-in-effect -- story uniquement : synchronise le contrôle « open » de Storybook
  useEffect(() => setOpen(args.open), [args.open]);
  const close = () => {
    setOpen(false);
    args.onClose();
  };
  return (
    <>
      <Button variant={triggerVariant} onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Modal {...args} open={open} onClose={close} footer={renderFooter?.(close)} />
    </>
  );
}

const confirmFooter = (close: () => void) => (
  <>
    <Button variant="secondary" onClick={close}>Annuler</Button>
    <Button variant="danger" onClick={close}>Supprimer le projet</Button>
  </>
);

export const Confirmation: Story = {
  render: (args) => (
    <ModalDemo {...args} triggerLabel="Supprimer le projet" triggerVariant="danger" renderFooter={confirmFooter}>
      Cette action est irréversible. Les membres de l'équipe perdront l'accès aux rapports.
    </ModalDemo>
  ),
};

/** Même fenêtre, ouverte d'office : pour vérifier l'état ouvert (contraste, focus, lecteur d'écran). */
export const OuverteParDefaut: Story = {
  name: 'Ouverte par défaut',
  args: { open: true },
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: Confirmation.render,
};

export const Formulaire: Story = {
  args: {
    size: 'md',
    title: 'Inviter un membre',
    description: "La personne recevra un e-mail pour rejoindre l'espace « Sécurité Paris ».",
    closeOnBackdropClick: false,
  },
  render: (args) => (
    <ModalDemo
      {...args}
      triggerLabel="Inviter un membre"
      triggerVariant="primary"
      renderFooter={(close) => (
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button onClick={close}>Envoyer l'invitation</Button>
        </>
      )}
    >
      <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
        Adresse e-mail
        <input
          type="email"
          placeholder="prenom.nom@exemple.fr"
          style={{
            padding: 'var(--space-2) var(--space-3)',
            border: '1px solid var(--color-border-strong)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-background-page)',
            color: 'var(--color-text-default)',
            font: 'inherit',
          }}
        />
      </label>
    </ModalDemo>
  ),
};

const longText = Array.from({ length: 8 }, (_, i) => (
  <p key={i}>
    Article {i + 1}. Les journaux d'accès sont conservés douze mois puis anonymisés. Chaque consultation des
    données sensibles est tracée et peut faire l'objet d'un contrôle par le responsable de la sécurité.
  </p>
));

export const ContenuLong: Story = {
  name: 'Contenu long (défilement)',
  args: {
    size: 'lg',
    title: "Conditions d'utilisation",
    description: 'Version du 6 octobre 2026.',
  },
  render: (args) => (
    <ModalDemo
      {...args}
      triggerLabel="Lire les conditions"
      renderFooter={(close) => <Button onClick={close}>J'ai compris</Button>}
    >
      {longText}
    </ModalDemo>
  ),
};

export const Tailles: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      <ModalDemo {...args} size="sm" title="Petite fenêtre" description={undefined} triggerLabel="Taille sm">
        Pour une confirmation en une phrase.
      </ModalDemo>
      <ModalDemo {...args} size="md" title="Fenêtre moyenne" description={undefined} triggerLabel="Taille md">
        Pour un formulaire court.
      </ModalDemo>
      <ModalDemo {...args} size="lg" title="Grande fenêtre" description={undefined} triggerLabel="Taille lg">
        Pour un contenu riche ou un tableau.
      </ModalDemo>
    </div>
  ),
};
