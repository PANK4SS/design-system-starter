import type { Meta, StoryObj } from '@storybook/react-vite';
import { Copy, Download, Settings, Share2 } from 'lucide-react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Superpositions/Tooltip',
  component: Tooltip,
  args: {
    content: 'Copie le lien dans le presse-papiers',
    placement: 'top',
    children: <Button variant="secondary" iconStart={<Icon icon={Copy} size="sm" />}>Copier le lien</Button>,
  },
  argTypes: {
    placement: { control: 'inline-radio' },
    content: { control: 'text' },
    children: { control: false },
  },
  parameters: {
    // Laisse de la place autour du déclencheur pour voir l'infobulle quel que soit son placement
    layout: 'centered',
    docs: {
      description: {
        component: `
Courte **description complémentaire** d'un élément, affichée au survol de la souris (après un court délai)
et au focus clavier. Échap la masque. Elle est reliée au déclencheur par \`aria-describedby\`.

\`\`\`tsx
<Tooltip content="Exporter en PDF">
  <Button variant="ghost">Exporter</Button>
</Tooltip>
\`\`\`

| À faire | À éviter |
|---|---|
| Un texte court qui complète le nom de l'élément | Répéter mot pour mot le libellé du bouton |
| Un déclencheur focalisable (bouton, lien) | Une infobulle sur un texte ou une icône non focalisable |
| Toujours donner un nom accessible aux boutons-icônes (\`label\` de \`Icon\`) | Compter sur l'infobulle pour nommer le bouton |
| Du texte simple | Un lien, un bouton ou un formulaire dans l'infobulle |
| Une information accessoire | Une information indispensable (invisible sur écran tactile) |
`,
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Boutons-icônes : le nom vient du `label` de l'icône, l'infobulle ajoute une précision. */
export const BoutonsIcones: Story = {
  name: 'Boutons-icônes',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      <Tooltip content="Format PDF, 2 Mo">
        <Button variant="ghost" size="sm" aria-label="Télécharger le rapport">
          <Icon icon={Download} size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Générer un lien valable 7 jours">
        <Button variant="ghost" size="sm" aria-label="Partager">
          <Icon icon={Share2} size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Notifications, langue, sécurité">
        <Button variant="ghost" size="sm" aria-label="Paramètres">
          <Icon icon={Settings} size="sm" />
        </Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 'var(--space-16)', padding: 'var(--space-12)' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} {...args} placement={placement} content={`Infobulle « ${placement} »`}>
          <Button variant="secondary">Placement {placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Infobulle visible d'office (focus posé sur le déclencheur au chargement),
 * pour vérifier le contraste et le rendu sans interaction.
 * Exclue de la page Docs (`!autodocs`) : l'autofocus y volerait le focus et ferait défiler la page.
 */
export const Visible: Story = {
  tags: ['!autodocs'],
  args: { content: 'Dernière modification il y a 5 minutes' },
  render: (args) => (
    <Tooltip {...args}>
      {/* oxlint-disable-next-line jsx-a11y/no-autofocus -- story d'audit uniquement : affiche l'infobulle ouverte (exclue des Docs) */}
      <Button variant="secondary" autoFocus>
        Historique
      </Button>
    </Tooltip>
  ),
};
