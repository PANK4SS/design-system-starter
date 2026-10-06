import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Table, type TableColumn, type TableSort } from './Table';

interface Incident {
  id: string;
  site: string;
  type: string;
  agent: string;
  date: string;
  duree: number;
}

const incidents: Incident[] = [
  { id: 'INC-2041', site: 'Lyon Part-Dieu', type: 'Intrusion', agent: 'Karim Benali', date: '2026-09-28', duree: 42 },
  {
    id: 'INC-2042',
    site: 'Marseille Euroméditerranée',
    type: 'Alarme incendie',
    agent: 'Julie Martin',
    date: '2026-09-29',
    duree: 18,
  },
  { id: 'INC-2043', site: 'Lille Europe', type: 'Badge refusé', agent: 'Thomas Leroy', date: '2026-09-30', duree: 5 },
  { id: 'INC-2044', site: 'Nantes Atlantis', type: 'Intrusion', agent: 'Awa Diallo', date: '2026-10-01', duree: 63 },
  { id: 'INC-2045', site: 'Bordeaux Mériadeck', type: 'Malaise', agent: 'Lucas Petit', date: '2026-10-02', duree: 27 },
  {
    id: 'INC-2046',
    site: 'Toulouse Blagnac',
    type: 'Porte forcée',
    agent: 'Inès Moreau',
    date: '2026-10-03',
    duree: 34,
  },
  {
    id: 'INC-2047',
    site: 'Strasbourg Wacken',
    type: 'Alarme technique',
    agent: 'Hugo Fontaine',
    date: '2026-10-04',
    duree: 12,
  },
  { id: 'INC-2048', site: 'Rennes Cesson', type: 'Intrusion', agent: 'Sarah Lambert', date: '2026-10-05', duree: 51 },
];

const dateFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const columns: TableColumn<Incident>[] = [
  { key: 'id', header: 'Référence', sortable: true },
  { key: 'site', header: 'Site', sortable: true },
  { key: 'type', header: 'Type' },
  { key: 'agent', header: 'Agent intervenant' },
  { key: 'date', header: 'Date', sortable: true, render: (row) => dateFormat.format(new Date(row.date)) },
  { key: 'duree', header: 'Durée (min)', align: 'end', sortable: true },
];

/** Tri local pour la démonstration : dans une application, le parent (ou le serveur) trie. */
function sortRows(rows: Incident[], sort: TableSort | null) {
  if (!sort) return rows;
  const factor = sort.direction === 'ascending' ? 1 : -1;
  const key = sort.key as keyof Incident;
  return [...rows].sort((a, b) => {
    const left = a[key];
    const right = b[key];
    return (
      (typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), 'fr')) * factor
    );
  });
}

const meta = {
  title: 'Données/Table',
  component: Table,
  args: {
    caption: 'Incidents de la semaine',
    columns: columns as TableColumn<unknown>[],
    rows: incidents,
    density: 'comfortable',
    striped: false,
    stickyHeader: false,
    hideCaption: false,
  },
  argTypes: {
    density: { control: 'inline-radio' },
    columns: { control: false },
    rows: { control: false },
    sort: { control: false },
    emptyState: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Affiche des **données en lignes et colonnes** (incidents, rondes, agents…), avec tri optionnel.
Le tableau est « contrôlé » : il affiche le tri reçu dans \`sort\` et prévient le parent avec \`onSortChange\`, qui trie les lignes.

| À faire | À éviter |
|---|---|
| Un \`caption\` qui dit ce que contient le tableau | Un tableau sans titre (incompréhensible au lecteur d'écran) |
| \`align: 'end'\` pour les colonnes de nombres | Des nombres alignés à gauche |
| \`density="compact"\` pour de longues listes | Un tableau pour **mettre en page** des éléments |
| Un état vide qui explique quoi faire | Un tableau vide sans message |
`,
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParDefaut: Story = { name: 'Par défaut' };

export const Triable: Story = {
  args: { onSortChange: fn() },
  render: function Render(args) {
    const [sort, setSort] = useState<TableSort | null>({ key: 'date', direction: 'descending' });
    const rows = useMemo(() => sortRows(incidents, sort), [sort]);
    return (
      <Table
        {...args}
        rows={rows}
        sort={sort}
        onSortChange={(next) => {
          setSort(next);
          args.onSortChange?.(next);
        }}
      />
    );
  },
};

export const Compact: Story = {
  args: { density: 'compact', striped: true },
};

export const EnTeteCollant: Story = {
  name: 'En-tête collant',
  args: {
    stickyHeader: true,
    maxHeight: '16rem',
    rows: [...incidents, ...incidents.map((i) => ({ ...i, id: i.id.replace('20', '19') }))],
  },
};

export const TitreMasque: Story = {
  name: 'Titre masqué visuellement',
  args: { hideCaption: true },
};

export const Vide: Story = {
  args: {
    rows: [],
    emptyState: 'Aucun incident sur la période. Élargissez la plage de dates pour voir l’historique.',
  },
};

export const PetitEcran: Story = {
  name: 'Défilement sur petit écran',
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <Table {...args} />
    </div>
  ),
};
