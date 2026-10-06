import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Archive, Copy, Download, EllipsisVertical, Pencil, Share2, Trash } from 'lucide-react';
import { Icon } from '../Icon';
import { DropdownMenu, type DropdownMenuItem } from './DropdownMenu';

const projectActions: DropdownMenuItem[] = [
  { label: 'Renommer', icon: Pencil, onSelect: fn() },
  { label: 'Dupliquer', icon: Copy, onSelect: fn() },
  { label: 'Partager', icon: Share2, onSelect: fn() },
  { label: 'Exporter en PDF', icon: Download, onSelect: fn(), disabled: true },
  { type: 'separator' },
  { label: 'Archiver', icon: Archive, onSelect: fn() },
  { label: 'Supprimer le projet', icon: Trash, onSelect: fn(), danger: true },
];

const meta = {
  title: 'Superpositions/DropdownMenu',
  component: DropdownMenu,
  args: { label: 'Actions', items: projectActions, onOpenChange: fn() },
  argTypes: {
    align: { control: 'inline-radio' },
    triggerVariant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    triggerSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    items: { control: false },
  },
  parameters: {
    // Laisse la place au menu ouvert sous le bouton
    layout: 'padded',
    docs: {
      description: {
        component: `
Bouton qui ouvre une **liste d'actions** sur un objet (motif « menu button » des WAI-ARIA APG).

Clavier : Entrée, Espace ou Flèche bas ouvrent le menu sur la première action, Flèche haut sur la dernière ;
Flèches haut/bas pour se déplacer, Début/Fin pour les extrémités, une lettre pour sauter à l'action
correspondante, Échap pour fermer et revenir au bouton. Un clic à l'extérieur ferme le menu.

\`\`\`tsx
<DropdownMenu
  label="Actions"
  items={[
    { label: 'Renommer', icon: Pencil, onSelect: renommer },
    { type: 'separator' },
    { label: 'Supprimer', icon: Trash, onSelect: supprimer, danger: true },
  ]}
/>
\`\`\`

| À faire | À éviter |
|---|---|
| Des actions sur l'objet courant, avec un verbe | Des liens de navigation (préférer une liste de liens) |
| Regrouper avec des séparateurs, action destructrice en dernier | Plus d'une dizaine d'actions |
| Un \`aria-label\` sur un déclencheur icône seule | Un bouton « ... » sans nom accessible |
| Garder visibles mais désactivées les actions indisponibles | Faire apparaître et disparaître des actions selon le contexte |
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 'calc(var(--space-16) * 5)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Menu ouvert d'office (mode non contrôlé, `defaultOpen`) pour vérifier son rendu. */
export const Ouvert: Story = {
  tags: ['!autodocs'],
  args: { defaultOpen: true },
};

/** Déclencheur réduit à une icône : `aria-label` est alors obligatoire. */
export const BoutonIcone: Story = {
  name: 'Bouton-icône',
  args: {
    label: <Icon icon={EllipsisVertical} size="sm" />,
    'aria-label': 'Actions du projet « Audit réseau 2026 »',
    triggerVariant: 'ghost',
    triggerSize: 'sm',
    hideChevron: true,
  },
};

export const AligneADroite: Story = {
  name: 'Aligné à droite',
  args: { align: 'end' },
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <DropdownMenu {...args} />
    </div>
  ),
};
