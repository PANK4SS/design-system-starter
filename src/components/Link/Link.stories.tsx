import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Navigation/Link',
  component: Link,
  args: { href: '#', children: 'Voir le rapport complet', variant: 'default', external: false },
  argTypes: {
    variant: { control: 'inline-radio' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
**Navigue** vers une autre page ou un autre site. Toujours souligné, pour se distinguer du texte sans
dépendre de la couleur. Avec \`external\`, il s'ouvre dans un nouvel onglet, affiche une icône et annonce
« (nouvel onglet) » aux lecteurs d'écran.

| À faire | À éviter |
|---|---|
| Un texte qui dit où mène le lien : « Lire la politique de confidentialité » | « Cliquez ici », « En savoir plus » seul |
| \`external\` pour tout lien vers un autre site | Ouvrir un nouvel onglet sans prévenir |
| \`subtle\` pour les liens secondaires (pied de page, métadonnées) | Retirer le soulignement d'un lien dans un paragraphe |
| Un \`Button\` pour déclencher une action | Un lien avec \`href="#"\` et un \`onClick\` |
`,
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
  args: { variant: 'subtle', children: 'Mentions légales' },
};

export const External: Story = {
  args: { href: 'https://cyber.gouv.fr', external: true, children: "Guide d'hygiène informatique de l'ANSSI" },
};

/** Dans un paragraphe : le soulignement distingue le lien du texte qui l'entoure. */
export const DansUnParagraphe: Story = {
  name: 'Dans un paragraphe',
  parameters: { layout: 'padded' },
  render: (args) => (
    <p style={{ maxWidth: '60ch', margin: 0, lineHeight: 'var(--font-line-height-normal)' }}>
      Avant de valider votre accès, prenez connaissance de la <Link {...args}>charte informatique</Link> et des
      recommandations du{' '}
      <Link href="https://cyber.gouv.fr" external>
        site de l'ANSSI
      </Link>
      . Vos données sont traitées conformément à notre{' '}
      <Link href="#" variant="subtle">
        politique de confidentialité
      </Link>
      .
    </p>
  ),
};

export const PiedDePage: Story = {
  name: 'Pied de page',
  render: () => (
    <nav aria-label="Liens utiles" style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--font-size-200)' }}>
      <Link href="#" variant="subtle">
        Mentions légales
      </Link>
      <Link href="#" variant="subtle">
        Accessibilité : partiellement conforme
      </Link>
      <Link href="#" variant="subtle">
        Plan du site
      </Link>
    </nav>
  ),
};
