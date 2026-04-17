import type { Meta, StoryObj } from '@storybook/react';
import { TokenSelect } from '../components/TokenSelect';
import type { Token } from '../types';

const meta: Meta<typeof TokenSelect> = {
  title: 'Components/TokenSelect',
  component: TokenSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTokens: Token[] = [
  { currency: 'BTC', price: 45000, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BTC.svg' },
  { currency: 'ETH', price: 3000, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg' },
  { currency: 'USDC', price: 1, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USDC.svg' },
  { currency: 'ATOM', price: 10, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ATOM.svg' },
];

export const Default: Story = {
  args: {
    tokens: mockTokens,
    value: null,
    onChange: (token: Token) => console.log('Selected:', token),
    label: 'Token',
  },
};

export const WithSelectedToken: Story = {
  args: {
    tokens: mockTokens,
    value: mockTokens[0],
    onChange: (token: Token) => console.log('Selected:', token),
    label: 'Token',
  },
};

export const WithDifferentToken: Story = {
  args: {
    tokens: mockTokens,
    value: mockTokens[1],
    onChange: (token: Token) => console.log('Selected:', token),
    label: 'Token',
  },
};
