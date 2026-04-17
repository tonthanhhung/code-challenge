import type { Meta, StoryObj } from '@storybook/react';
import { SwapForm } from '../components/SwapForm';
import type { Token } from '../types';

const meta: Meta<typeof SwapForm> = {
  title: 'Components/SwapForm',
  component: SwapForm,
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
  },
};

export const WithManyTokens: Story = {
  args: {
    tokens: [
      ...mockTokens,
      { currency: 'SOL', price: 150, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SOL.svg' },
      { currency: 'DOT', price: 7, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/DOT.svg' },
      { currency: 'LINK', price: 15, iconUrl: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/LINK.svg' },
    ],
  },
};
