import type { Meta, StoryObj } from '@storybook/react';
import { SwapInputGroup } from '../components/SwapInputGroup';
import type { Token } from '../types';

const meta: Meta<typeof SwapInputGroup> = {
  title: 'Components/SwapInputGroup',
  component: SwapInputGroup,
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
];

export const Default: Story = {
  args: {
    id: 'from-amount',
    label: 'You send',
    amount: '',
    token: null,
    tokens: mockTokens,
    onAmountChange: (value: string) => console.log('Amount changed:', value),
    onTokenChange: (token: Token) => console.log('Token changed:', token),
  },
};

export const WithAmount: Story = {
  args: {
    id: 'from-amount',
    label: 'You send',
    amount: '1.5',
    token: mockTokens[0],
    tokens: mockTokens,
    onAmountChange: (value: string) => console.log('Amount changed:', value),
    onTokenChange: (token: Token) => console.log('Token changed:', token),
    usdValue: '≈ $67,500.00 USD',
  },
};

export const ReadOnly: Story = {
  args: {
    id: 'to-amount',
    label: 'You receive',
    amount: '22.5',
    token: mockTokens[1],
    tokens: mockTokens,
    onTokenChange: (token: Token) => console.log('Token changed:', token),
    readOnly: true,
    usdValue: '≈ $67,500.00 USD',
  },
};

export const WithError: Story = {
  args: {
    id: 'from-amount',
    label: 'You send',
    amount: '-1',
    token: null,
    tokens: mockTokens,
    onAmountChange: (value: string) => console.log('Amount changed:', value),
    onTokenChange: (token: Token) => console.log('Token changed:', token),
    error: 'Amount must be greater than 0',
  },
};
