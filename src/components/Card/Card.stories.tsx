import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MapPin } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardMedia } from './Card';

// Image d'exemple embarquée (pas de dépendance réseau) : une façade de bâtiment stylisée
const buildingImage = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280">
    <rect width="640" height="280" fill="#1c1d22"/>
    <rect x="120" y="60" width="400" height="220" fill="#40434e"/>
    <g fill="#d8aa00">
      <rect x="160" y="100" width="60" height="40"/><rect x="260" y="100" width="60" height="40"/>
      <rect x="360" y="100" width="60" height="40"/><rect x="160" y="170" width="60" height="40"/>
      <rect x="420" y="170" width="60" height="40"/>
    </g>
    <rect x="290" y="200" width="60" height="80" fill="#070707"/>
  </svg>`,
)}`;

const meta = {
  title: 'Affichage/Card',
  component: Card,
  args: { variant: 'outlined', padding: 'md', interactive: false, as: 'div' },
  argTypes: {
    variant: { control: 'inline-radio' },
    padding: { control: 'inline-radio' },
    as: { control: 'inline-radio', options: ['div', 'article', 'section'] },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Conteneur qui regroupe des informations liées (un site surveillé, un rapport, un agent).
Se compose avec \`CardHeader\`, \`CardBody\`, \`CardFooter\`, \`CardMedia\` et \`CardLink\`.

**Carte cliquable** : on passe \`interactive\` et on place un \`CardLink\` dans le titre. Ce vrai lien
(\`href\`) ou vrai bouton (sans \`href\`) s'étend sur toute la carte : un seul arrêt au clavier, un nom
accessible court (le titre), et les boutons de la carte restent utilisables.

| À faire | À éviter |
|---|---|
| \`CardLink\` dans le titre pour une carte cliquable | \`onClick\` sur la carte (non focusable, non annoncé) |
| Un \`alt\` qui décrit l'image de \`CardMedia\` | Une image sans texte alternatif |
| \`as="article"\` pour un contenu autonome | Des cartes imbriquées dans des cartes |
| \`elevated\` pour un élément mis en avant | \`elevated\` partout (plus rien ne ressort) |
`,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const siteContent = (
  <>
    <CardHeader
      title="Entrepôt Nord"
      subtitle="Zone industrielle des Tanneries, Lyon"
      actions={<Badge variant="success">Sous surveillance</Badge>}
    />
    <CardBody>
      <p>
        Dernière ronde à 02 h 40 par l'agent Karim Benali. Aucun incident signalé, toutes les issues de secours sont
        verrouillées.
      </p>
    </CardBody>
  </>
);

export const Outlined: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 'calc(var(--space-16) * 6)' }}>
      {siteContent}
      <CardFooter>
        <Button variant="secondary" size="sm" onClick={fn()}>
          Voir l'historique
        </Button>
        <Button size="sm" onClick={fn()}>
          Lancer une ronde
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  ...Outlined,
  args: { variant: 'elevated' },
};

export const Paddings: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} {...args} padding={padding} style={{ width: 'calc(var(--space-16) * 4)' }}>
          <CardHeader title={`Marge ${padding}`} subtitle="Rapport hebdomadaire" />
          <CardBody>
            <p>12 rondes effectuées, 0 incident.</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const WithMedia: Story = {
  args: { as: 'article' },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 'calc(var(--space-16) * 6)' }}>
      <CardMedia src={buildingImage} alt="Façade de l'entrepôt Nord, de nuit, fenêtres éclairées" height={168} />
      {siteContent}
    </Card>
  ),
};

export const InteractiveLink: Story = {
  args: { interactive: true, as: 'article' },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 'calc(var(--space-16) * 6)' }}>
      <CardHeader
        title={<CardLink href="#site-entrepot-nord">Entrepôt Nord</CardLink>}
        subtitle={
          <span style={{ display: 'inline-flex', gap: 'var(--space-1)', alignItems: 'center' }}>
            <Icon icon={MapPin} size="sm" /> Lyon, 7e arrondissement
          </span>
        }
        actions={<Badge variant="warning">Caméra hors ligne</Badge>}
      />
      <CardBody>
        <p>La caméra du quai de chargement ne répond plus depuis 01 h 12. Cliquez sur la carte pour ouvrir le site.</p>
      </CardBody>
      <CardFooter align="start">
        <Button variant="secondary" size="sm" onClick={fn()}>
          Prévenir le technicien
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const InteractiveButton: Story = {
  args: { interactive: true, variant: 'elevated' },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 'calc(var(--space-16) * 5)' }}>
      <CardHeader
        title={<CardLink onClick={fn()}>Rapport d'incident n° 2024-118</CardLink>}
        subtitle="Signalé le 3 octobre à 23 h 05"
      />
      <CardBody>
        <p>Tentative d'effraction sur le portail arrière. Ouvre le détail dans un panneau latéral.</p>
      </CardBody>
    </Card>
  ),
};

export const Grid: Story = {
  args: { interactive: true, as: 'article' },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(calc(var(--space-16) * 4), 1fr))',
        gap: 'var(--space-4)',
      }}
    >
      {[
        { name: 'Siège social', city: 'Paris 8e', status: <Badge variant="success">Sécurisé</Badge> },
        { name: 'Data center Est', city: 'Strasbourg', status: <Badge variant="danger">Alarme</Badge> },
        { name: 'Agence Sud', city: 'Marseille', status: <Badge variant="neutral">Fermé</Badge> },
      ].map((site) => (
        <Card key={site.name} {...args}>
          <CardHeader
            title={<CardLink href={`#${site.name}`}>{site.name}</CardLink>}
            subtitle={site.city}
            actions={site.status}
          />
        </Card>
      ))}
    </div>
  ),
};
