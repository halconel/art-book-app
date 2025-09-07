import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NotificationProvider,
  useNotification,
} from '../../contexts/NotificationContext';

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

const TestComponent = ({ onNotificationChange = () => {} }) => {
  const notifications = useNotification();

  React.useEffect(() => {
    onNotificationChange(notifications);
  }, [notifications, onNotificationChange]);

  return (
    <div>
      <button
        onClick={() => notifications.showSuccess('Success message')}
        data-testid="success-btn"
      >
        Show Success
      </button>
      <button
        onClick={() => notifications.showError('Error message')}
        data-testid="error-btn"
      >
        Show Error
      </button>
      <button
        onClick={() => notifications.showWarning('Warning message')}
        data-testid="warning-btn"
      >
        Show Warning
      </button>
      <button
        onClick={() => notifications.showInfo('Info message')}
        data-testid="info-btn"
      >
        Show Info
      </button>
      <button
        onClick={() => notifications.clearAllNotifications()}
        data-testid="clear-btn"
      >
        Clear All
      </button>
    </div>
  );
};

const renderWithProvider = ui => {
  return render(<NotificationProvider>{ui}</NotificationProvider>);
};

describe('NotificationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('should show success notification', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('success-btn'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledSuccess');
  });

  it('should show error notification', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('error-btn'));

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledError');
  });

  it('should show warning notification', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('warning-btn'));

    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledWarning');
  });

  it('should show info notification', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimers });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('info-btn'));

    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledInfo');
  });

  it('should auto-dismiss notifications after timeout', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('success-btn'));

    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Fast forward time to trigger auto-dismissal
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should keep error notifications longer', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('error-btn'));

    expect(screen.getByText('Error message')).toBeInTheDocument();

    // Fast forward 5 seconds (normal timeout)
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Error should still be visible
    expect(screen.getByText('Error message')).toBeInTheDocument();

    // Fast forward to 7 seconds (error timeout)
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });
  });

  it('should allow manual dismissal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('success-btn'));

    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Click the close button
    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should show multiple notifications', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('success-btn'));
    await user.click(screen.getByTestId('error-btn'));
    await user.click(screen.getByTestId('warning-btn'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should clear all notifications', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('success-btn'));
    await user.click(screen.getByTestId('error-btn'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();

    await user.click(screen.getByTestId('clear-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });
  });

  it('should support custom options', async () => {
    let notificationContext;
    const onNotificationChange = ctx => {
      notificationContext = ctx;
    };

    renderWithProvider(
      <TestComponent onNotificationChange={onNotificationChange} />
    );

    await act(async () => {
      notificationContext.addNotification({
        message: 'Custom notification',
        severity: 'success',
        title: 'Custom Title',
        autoHideDuration: null, // No auto hide
      });
    });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom notification')).toBeInTheDocument();

    // Should not auto-dismiss
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText('Custom notification')).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    const TestComponentOutside = () => {
      useNotification();
      return <div>Test</div>;
    };

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponentOutside />);
    }).toThrow('useNotification must be used within NotificationProvider');

    consoleSpy.mockRestore();
  });
});
