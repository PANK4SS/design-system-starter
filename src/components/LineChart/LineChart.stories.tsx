import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';

const mois = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

const meta = {
  title: 'Données/LineChart',
  component: LineChart,
  args: {
    title: 'Alertes reçues par mois',
    description: 'Année 2026, par origine. La vidéosurveillance progresse nettement depuis le printemps.',
    categoryLabel: 'Mois',
    categories: mois,
    series: [
      { name: 'Vidéosurveillance', values: [420, 395, 460, 510, 580, 640, 610, 590, 670, 700, 685, 720] },
      { name: 'Détection intrusion', values: [310, 290, 335, 320, 300, 315, 340, 360, 330, 345, 350, 338] },
      { name: 'Contrôle d’accès', values: [180, 175, 190, 205, 198, 210, 185, 170, 220, 230, 215, 225] },
    ],
    showMarkers: false,
    hideTitle: false,
    height: 280,
  },
  argTypes: {
    series: { control: 'object' },
    categories: { control: 'object' },
    formatValue: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Montre une **évolution dans le temps** (alertes par mois, temps d'intervention…), sur un seul axe Y.
Au survol ou au clavier (flèches gauche/droite), un réticule se cale sur la période la plus proche et l'infobulle liste toutes les séries.
Le bouton « Voir les données » affiche le tableau équivalent.

| À faire | À éviter |
|---|---|
| Des périodes régulières sur l'axe X (jours, mois) | Des catégories sans ordre (sites, équipes) : utilisez un BarChart |
| Des séries de même unité, sur un seul axe | Deux axes Y aux échelles différentes |
| 5 séries au plus, une légende (automatique dès 2 séries) | Des « spaghettis » de 8 courbes |
| \`showMarkers\` pour peu de points ou pour l'impression | Une valeur écrite sur chaque point |
`,
      },
    },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlusieursSeries: Story = { name: 'Plusieurs séries' };

export const UneSerie: Story = {
  name: 'Une seule série',
  args: {
    title: 'Temps moyen d’intervention',
    description: 'En minutes, tous sites confondus, sur les 12 dernières semaines.',
    categoryLabel: 'Semaine',
    categories: ['S29', 'S30', 'S31', 'S32', 'S33', 'S34', 'S35', 'S36', 'S37', 'S38', 'S39', 'S40'],
    series: [{ name: 'Temps moyen (min)', values: [8.4, 8.1, 7.9, 8.6, 7.2, 6.9, 7.1, 6.5, 6.8, 6.2, 6.4, 6.0] }],
    formatValue: (value: number) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value)} min`,
  },
};

export const AvecPoints: Story = {
  name: 'Avec points',
  args: {
    title: 'Rondes effectuées par jour',
    description: 'Semaine 40, sites de Lyon et de Marseille.',
    categoryLabel: 'Jour',
    categories: ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'],
    series: [
      { name: 'Lyon Part-Dieu', values: [24, 26, 25, 27, 28, 18, 16] },
      { name: 'Marseille Euroméditerranée', values: [19, 21, 20, 22, 23, 15, 14] },
    ],
    showMarkers: true,
  },
};

export const Etroit: Story = {
  name: 'Largeur réduite (mobile)',
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <LineChart {...args} />
    </div>
  ),
};
