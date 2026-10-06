import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Fondations/VisuallyHidden',
  component: VisuallyHidden,
  parameters: {
    docs: {
      description: {
        component: `
Texte **invisible à l'écran** mais **lu par les lecteurs d'écran**.

| À faire | À éviter |
|---|---|
| Compléter une information visuelle : « (nouvel onglet) », « En hausse : » | Cacher un texte utile à tout le monde |
| Utiliser ce composant (ou la classe partagée) | Recopier le CSS de masquage dans un composant |
`,
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <p>
      Rapport mensuel
      <VisuallyHidden> (format PDF, 2 Mo)</VisuallyHidden>
      <br />
      <small>Le texte « (format PDF, 2 Mo) » est lu par un lecteur d'écran mais ne s'affiche pas.</small>
    </p>
  ),
};
