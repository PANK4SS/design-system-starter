import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowRight, Bell, Check, ChevronDown, CircleAlert, CircleCheck, Eye, Info, Lock, Menu, Search, Settings,
  Shield, Trash2, TriangleAlert, User, X,
} from 'lucide-react';
import { Icon } from './Icon';

const meta = {
  title: 'Fondations/Icon',
  component: Icon,
  args: { icon: Shield, size: 'lg' },
  argTypes: {
    icon: { control: false },
    size: { control: 'inline-radio' },
    stroke: { control: 'inline-radio' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Affiche une icône SVG de la bibliothèque [Lucide](https://lucide.dev/icons), aux tailles et épaisseurs des tokens.

\`\`\`tsx
import { Search } from 'lucide-react';
<Icon icon={Search} size="md" />
\`\`\`

| À faire | À éviter |
|---|---|
| Une icône à côté d'un texte : décorative, sans \`label\` | Une icône seule sans \`label\` (invisible pour un lecteur d'écran) |
| Les tailles des tokens (\`sm\`, \`md\`, \`lg\`, \`xl\`) | Une taille en pixels écrite à la main |
| Des icônes SVG | Des emojis dans l'interface |
`,
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Icon {...args} size="sm" />
      <Icon {...args} size="md" />
      <Icon {...args} size="lg" />
      <Icon {...args} size="xl" />
    </div>
  ),
};

const gallery = {
  ArrowRight, Bell, Check, ChevronDown, CircleAlert, CircleCheck, Eye, Info, Lock, Menu, Search, Settings, Shield,
  Trash2, TriangleAlert, User, X,
};

export const Gallery: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 96px)', gap: 16 }}>
      {Object.entries(gallery).map(([name, glyph]) => (
        <div key={name} style={{ display: 'grid', justifyItems: 'center', gap: 8, fontSize: 12 }}>
          <Icon {...args} icon={glyph} />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
