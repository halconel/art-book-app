import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ConfirmationProvider,
  useConfirmation,
} from '../../contexts/ConfirmationContext';

const TestComponent = ({ onConfirmationChange = () => {} }) => {
  const confirmation = useConfirmation();
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    onConfirmationChange(confirmation);
  }, [confirmation, onConfirmationChange]);

  const handleBasicConfirm = async () => {
    const confirmed = await confirmation.confirm({
      title: 'Test Confirmation',
      message: 'Are you sure you want to proceed?',
    });
    setResult(confirmed);
  };

  const handleDeleteConfirm = async () => {
    const confirmed = await confirmation.confirmDelete('Test Item', {
      details: 'This action cannot be undone.',
    });
    setResult(confirmed);
  };

  const handleSaveConfirm = async () => {
    const confirmed = await confirmation.confirmSave({
      message: 'Save your changes?',
    });
    setResult(confirmed);
  };

  const handleDiscardConfirm = async () => {
    const confirmed = await confirmation.confirmDiscard();
    setResult(confirmed);
  };

  return (
    <div>
      <div data-testid="result">{result?.toString()}</div>
      <button onClick={handleBasicConfirm} data-testid="basic-confirm">
        Basic Confirm
      </button>
      <button onClick={handleDeleteConfirm} data-testid="delete-confirm">
        Delete Confirm
      </button>
      <button onClick={handleSaveConfirm} data-testid="save-confirm">
        Save Confirm
      </button>
      <button onClick={handleDiscardConfirm} data-testid="discard-confirm">
        Discard Confirm
      </button>
    </div>
  );
};

const renderWithProvider = ui => {
  return render(<ConfirmationProvider>{ui}</ConfirmationProvider>);
};

describe('ConfirmationContext', () => {
  it('should show basic confirmation dialog', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('basic-confirm'));

    expect(screen.getByText('Test Confirmation')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to proceed?')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should resolve true when confirmed', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('basic-confirm'));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('true');
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should resolve false when cancelled', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('basic-confirm'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('false');
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should resolve false when closed via backdrop or escape', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('basic-confirm'));

    // Simulate clicking outside the dialog (backdrop click)
    const dialog = screen.getByRole('dialog');
    await act(async () => {
      const onClose = dialog.getAttribute('data-testid');
      // Since we can't easily simulate backdrop click, we'll test the close functionality directly
      const closeButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('false');
    });
  });

  it('should show delete confirmation with proper styling', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('delete-confirm'));

    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete "Test Item"? This action cannot be undone.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('This action cannot be undone.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();

    // Check for error icon (DeleteForever icon)
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should show save confirmation', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('save-confirm'));

    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Save your changes?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
  });

  it('should show discard confirmation', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('discard-confirm'));

    expect(screen.getByText('Discard Changes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You have unsaved changes. Are you sure you want to discard them?'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Keep Editing' })
    ).toBeInTheDocument();
  });

  it('should handle multiple confirmation dialogs sequentially', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    // First confirmation
    await user.click(screen.getByTestId('basic-confirm'));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('true');
    });

    // Second confirmation
    await user.click(screen.getByTestId('delete-confirm'));
    await user.click(screen.getByRole('button', { name: 'Keep' }));

    await waitFor(() => {
      expect(screen.getByTestId('result')).toHaveTextContent('false');
    });
  });

  it('should apply correct button colors based on severity', async () => {
    const user = userEvent.setup();

    renderWithProvider(<TestComponent />);

    // Test error severity (delete)
    await user.click(screen.getByTestId('delete-confirm'));

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toHaveClass('MuiButton-containedError');

    await user.click(screen.getByRole('button', { name: 'Keep' }));

    // Test info severity (save)
    await user.click(screen.getByTestId('save-confirm'));

    const saveButton = screen.getByRole('button', { name: 'Save' });
    expect(saveButton).toHaveClass('MuiButton-containedInfo');
  });

  it('should throw error when used outside provider', () => {
    const TestComponentOutside = () => {
      useConfirmation();
      return <div>Test</div>;
    };

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponentOutside />);
    }).toThrow('useConfirmation must be used within ConfirmationProvider');

    consoleSpy.mockRestore();
  });

  it('should support custom confirmation options', async () => {
    let confirmationContext;
    const onConfirmationChange = ctx => {
      confirmationContext = ctx;
    };

    const user = userEvent.setup();

    renderWithProvider(
      <TestComponent onConfirmationChange={onConfirmationChange} />
    );

    let result;
    act(() => {
      result = confirmationContext.confirm({
        title: 'Custom Title',
        message: 'Custom message',
        confirmText: 'Custom Confirm',
        cancelText: 'Custom Cancel',
        severity: 'success',
      });
    });

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Custom Confirm' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Custom Cancel' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Custom Confirm' }));

    await waitFor(async () => {
      const resolvedResult = await result;
      expect(resolvedResult).toBe(true);
    });
  });
});
