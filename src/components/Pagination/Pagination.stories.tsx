import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  args: { page: 6, totalPages: 20, siblingCount: 1, onPageChange: fn() },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Permet de parcourir une **longue liste découpée en pages** (résultats de recherche, journal d'événements…).
Rendu dans un \`<nav aria-label="Pagination">\`. La page courante porte \`aria-current="page"\`, les boutons
« Précédente » et « Suivante » sont désactivés aux extrémités, et les longues séries sont abrégées par des
points de suspension (\`siblingCount\` règle le nombre de voisines affichées).

Le composant est **contrôlé** : le parent garde \`page\` et la met à jour dans \`onPageChange\`.

| À faire | À éviter |
|---|---|
| Afficher le nombre total de résultats à côté | Paginer une liste de moins de deux pages |
| Garder la pagination à la même place d'une page à l'autre | Déplacer la pagination selon le contenu |
| Remonter le focus en haut de la liste après un changement de page | Laisser l'utilisateur en bas d'une liste vide |
`,
      },
    },
  },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(next) => {
          setPage(next);
          args.onPageChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PremierePage: Story = {
  name: 'Première page',
  args: { page: 1 },
};

export const DernierePage: Story = {
  name: 'Dernière page',
  args: { page: 20 },
};

export const PeuDePages: Story = {
  name: 'Peu de pages',
  args: { page: 2, totalPages: 5 },
};

export const PlusDeVoisines: Story = {
  name: 'Plus de voisines (siblingCount = 2)',
  args: { page: 50, totalPages: 120, siblingCount: 2 },
};
