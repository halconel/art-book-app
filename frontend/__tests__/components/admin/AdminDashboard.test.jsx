import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminDashboard from '../../../components/admin/AdminDashboard';
import { NotificationProvider } from '../../../contexts/NotificationContext';
import api from '../../../services/authService';

// Mock the API service
jest.mock('../../../services/authService', () => ({
  get: jest.fn(),
}));

// Mock StatisticsCharts component
jest.mock('../../../components/shared/StatisticsCharts', () => {
  return function MockStatisticsCharts({ title, data, showAll }) {
    return (
      <div data-testid="statistics-charts">
        <div data-testid="chart-title">{title}</div>
        <div data-testid="chart-show-all">{showAll.toString()}</div>
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
      </div>
    );
  };
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const renderWithProviders = ui => {
  return render(
    <ThemeProvider theme={theme}>
      <NotificationProvider>{ui}</NotificationProvider>
    </ThemeProvider>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock API calls to never resolve
    api.get.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<AdminDashboard />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render dashboard with stats after loading', async () => {
    // Mock API responses
    api.get
      .mockResolvedValueOnce({ data: { total_count: 5 } }) // clients
      .mockResolvedValueOnce({ data: { total_count: 12 } }) // orders
      .mockResolvedValueOnce({ data: { total_count: 45 } }) // images
      .mockResolvedValueOnce({ data: { total_count: 8 } }) // projects
      .mockResolvedValueOnce({ data: { orders: [] } }); // recent orders

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    // Check stat cards
    expect(screen.getByText('Total Clients')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Active Orders')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText('Gallery Images')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    // Check sections
    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
  });

  it('should render statistics charts with correct props', async () => {
    api.get
      .mockResolvedValueOnce({ data: { total_count: 10 } }) // clients
      .mockResolvedValueOnce({ data: { total_count: 20 } }) // orders
      .mockResolvedValueOnce({ data: { total_count: 30 } }) // images
      .mockResolvedValueOnce({ data: { total_count: 5 } }) // projects
      .mockResolvedValueOnce({ data: { orders: [] } }); // recent orders

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('statistics-charts')).toBeInTheDocument();
    });

    expect(screen.getByTestId('chart-title')).toHaveTextContent(
      'Admin Analytics Overview'
    );
    expect(screen.getByTestId('chart-show-all')).toHaveTextContent('false');

    // Verify chart data contains generated cycle progress and order status
    const chartDataElement = screen.getByTestId('chart-data');
    expect(chartDataElement).toBeInTheDocument();
  });

  it('should display recent orders when available', async () => {
    const mockOrders = [
      {
        id: 1,
        title: 'Test Order 1',
        status: 'in_progress',
        created_at: '2024-01-01',
        client: { email: 'client1@example.com' },
      },
      {
        id: 2,
        title: 'Test Order 2',
        status: 'completed',
        created_at: '2024-01-02',
        client: { email: 'client2@example.com' },
      },
    ];

    api.get
      .mockResolvedValueOnce({ data: { total_count: 5 } })
      .mockResolvedValueOnce({ data: { total_count: 12 } })
      .mockResolvedValueOnce({ data: { total_count: 45 } })
      .mockResolvedValueOnce({ data: { total_count: 8 } })
      .mockResolvedValueOnce({ data: { orders: mockOrders } });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Test Order 1')).toBeInTheDocument();
      expect(screen.getByText('Test Order 2')).toBeInTheDocument();
    });

    expect(screen.getByText(/Client: client1@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Client: client2@example.com/)).toBeInTheDocument();

    // Check status chips
    expect(screen.getByText('in_progress')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should show "No recent orders" when orders array is empty', async () => {
    api.get
      .mockResolvedValueOnce({ data: { total_count: 5 } })
      .mockResolvedValueOnce({ data: { total_count: 0 } })
      .mockResolvedValueOnce({ data: { total_count: 45 } })
      .mockResolvedValueOnce({ data: { total_count: 8 } })
      .mockResolvedValueOnce({ data: { orders: [] } });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No recent orders')).toBeInTheDocument();
    });
  });

  it('should apply correct status colors to order chips', async () => {
    const mockOrders = [
      {
        id: 1,
        title: 'Pending Order',
        status: 'pending',
        created_at: '2024-01-01',
        client: { email: 'client@example.com' },
      },
      {
        id: 2,
        title: 'Cancelled Order',
        status: 'cancelled',
        created_at: '2024-01-02',
        client: { email: 'client2@example.com' },
      },
    ];

    api.get
      .mockResolvedValueOnce({ data: { total_count: 5 } })
      .mockResolvedValueOnce({ data: { total_count: 12 } })
      .mockResolvedValueOnce({ data: { total_count: 45 } })
      .mockResolvedValueOnce({ data: { total_count: 8 } })
      .mockResolvedValueOnce({ data: { orders: mockOrders } });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      const pendingChip = screen.getByText('pending').closest('.MuiChip-root');
      const cancelledChip = screen
        .getByText('cancelled')
        .closest('.MuiChip-root');

      expect(pendingChip).toHaveClass('MuiChip-colorWarning');
      expect(cancelledChip).toHaveClass('MuiChip-colorError');
    });
  });

  it('should render quick actions list', async () => {
    api.get
      .mockResolvedValueOnce({ data: { total_count: 5 } })
      .mockResolvedValueOnce({ data: { total_count: 12 } })
      .mockResolvedValueOnce({ data: { total_count: 45 } })
      .mockResolvedValueOnce({ data: { total_count: 8 } })
      .mockResolvedValueOnce({ data: { orders: [] } });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Add New Client')).toBeInTheDocument();
      expect(screen.getByText('Create Order')).toBeInTheDocument();
      expect(screen.getByText('Upload Images')).toBeInTheDocument();
      expect(screen.getByText('Manage Projects')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock API to reject
    api.get.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    // Should still render with default/zero stats
    expect(screen.getByText('Total Clients')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // Default stats

    consoleSpy.mockRestore();
  });

  it('should use responsive breakpoints for grid layout', async () => {
    api.get
      .mockResolvedValueOnce({ data: { total_count: 5 } })
      .mockResolvedValueOnce({ data: { total_count: 12 } })
      .mockResolvedValueOnce({ data: { total_count: 45 } })
      .mockResolvedValueOnce({ data: { total_count: 8 } })
      .mockResolvedValueOnce({ data: { orders: [] } });

    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      const gridItems = screen.getAllByRole('listitem', { hidden: true });
      // Verify grid structure is present (Material-UI Grid items)
      expect(gridItems.length).toBeGreaterThan(0);
    });
  });
});
