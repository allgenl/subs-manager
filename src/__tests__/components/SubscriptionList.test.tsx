import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscriptionList from '@/components/subscriptions/SubscriptionList';
import { Subscription } from '@/types/subscription';

const baseSub: Subscription = {
  id: '1',
  name: 'Netflix',
  price: 999,
  currency: 'RUB',
  frequency: 'monthly',
  category: 'streaming',
  nextPaymentDate: '2026-04-01',
  startDate: '2026-01-01',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockSubscriptions: Subscription[] = [
  baseSub,
  {
    ...baseSub,
    id: '2',
    name: 'Spotify',
    price: 199,
    category: 'music',
    nextPaymentDate: '2026-04-05',
  },
  {
    ...baseSub,
    id: '3',
    name: 'Xbox Game Pass',
    price: 799,
    category: 'gaming',
    isActive: false,
    nextPaymentDate: '2026-04-10',
  },
];

vi.mock('@/context/SubscriptionContext', () => ({
  useSubscriptions: () => ({
    subscriptions: mockSubscriptions,
    deleteSubscription: vi.fn(),
    toggleActive: vi.fn(),
    settings: { defaultCurrency: 'RUB', theme: 'system' },
  }),
}));

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: (val: unknown) => val,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/subscriptions',
}));

describe('SubscriptionList', () => {
  it('renders all subscriptions', () => {
    render(<SubscriptionList />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.getByText('Xbox Game Pass')).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    render(<SubscriptionList />);
    const search = screen.getByPlaceholderText('Поиск...');
    await user.type(search, 'Netflix');
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.queryByText('Spotify')).not.toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    render(<SubscriptionList />);
    const musicBtns = screen.getAllByText('Музыка');
    // Click the filter button (first match), not the badge
    await user.click(musicBtns[0]);
    expect(screen.queryByText('Netflix')).not.toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
  });
});
