import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard';
import { Subscription } from '@/types/subscription';

const mockDeleteSubscription = vi.fn();
const mockToggleActive = vi.fn();

vi.mock('@/context/SubscriptionContext', () => ({
  useSubscriptions: () => ({
    deleteSubscription: mockDeleteSubscription,
    toggleActive: mockToggleActive,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));

const mockSub: Subscription = {
  id: 'test-1',
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

describe('SubscriptionCard', () => {
  it('renders subscription name and price', () => {
    render(<SubscriptionCard subscription={mockSub} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText(/999/)).toBeInTheDocument();
  });

  it('shows "на паузе" for inactive subscriptions', () => {
    render(<SubscriptionCard subscription={{ ...mockSub, isActive: false }} />);
    expect(screen.getByText('на паузе')).toBeInTheDocument();
  });

  it('shows category badge', () => {
    render(<SubscriptionCard subscription={mockSub} />);
    expect(screen.getByText('Стриминг')).toBeInTheDocument();
  });

  it('calls toggleActive when pause button clicked', async () => {
    const user = userEvent.setup();
    render(<SubscriptionCard subscription={mockSub} />);
    const pauseBtn = screen.getByTitle('Приостановить');
    await user.click(pauseBtn);
    expect(mockToggleActive).toHaveBeenCalledWith('test-1');
  });
});
