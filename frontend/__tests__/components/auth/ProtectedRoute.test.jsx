import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
  isClient: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
};

jest.mock('../../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockAuthContext,
}));

const MockChildren = () => (
  <div data-testid="protected-content">Protected Content</div>
);

const renderWithRouter = (ui, initialEntries = ['/protected']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock context to default state
    Object.assign(mockAuthContext, {
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      isClient: false,
    });
  });

  it('should show loading spinner when auth is loading', () => {
    mockAuthContext.loading = true;

    renderWithRouter(
      <ProtectedRoute>
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = false;

    renderWithRouter(
      <ProtectedRoute>
        <MockChildren />
      </ProtectedRoute>
    );

    // The redirect happens, so protected content shouldn't be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

    // In a real app, this would redirect to /login
    // Since we're using MemoryRouter, we can't easily test the redirect
    // but we can verify the content is not rendered
  });

  it('should render children when authenticated and no role required', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { id: 1, email: 'test@example.com', role: 'client' };

    renderWithRouter(
      <ProtectedRoute>
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should render children when user has admin role and admin required', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isAdmin = true;
    mockAuthContext.user = { id: 1, email: 'admin@example.com', role: 'admin' };

    renderWithRouter(
      <ProtectedRoute requireRole="admin">
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should render children when user has client role and client required', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isClient = true;
    mockAuthContext.user = {
      id: 1,
      email: 'client@example.com',
      role: 'client',
    };

    renderWithRouter(
      <ProtectedRoute requireRole="client">
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should show unauthorized message when user lacks required admin role', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isAdmin = false;
    mockAuthContext.isClient = true;
    mockAuthContext.user = {
      id: 1,
      email: 'client@example.com',
      role: 'client',
    };

    renderWithRouter(
      <ProtectedRoute requireRole="admin">
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(
      screen.getByText('You do not have permission to access this page.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should show unauthorized message when user lacks required client role', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.isAdmin = true;
    mockAuthContext.isClient = false;
    mockAuthContext.user = { id: 1, email: 'admin@example.com', role: 'admin' };

    renderWithRouter(
      <ProtectedRoute requireRole="client">
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(
      screen.getByText('You do not have permission to access this page.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should handle invalid role requirement gracefully', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { id: 1, email: 'test@example.com', role: 'admin' };

    renderWithRouter(
      <ProtectedRoute requireRole="invalid-role">
        <MockChildren />
      </ProtectedRoute>
    );

    // Should show unauthorized for unknown roles
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render multiple children components', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { id: 1, email: 'test@example.com', role: 'admin' };

    renderWithRouter(
      <ProtectedRoute>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('should work with functional components as children', () => {
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { id: 1, email: 'test@example.com', role: 'admin' };

    const FunctionalChild = () => (
      <div data-testid="functional-child">Functional Component</div>
    );

    renderWithRouter(
      <ProtectedRoute>
        <FunctionalChild />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('functional-child')).toBeInTheDocument();
  });

  it('should maintain loading state consistency', () => {
    // Start with loading state
    mockAuthContext.loading = true;
    mockAuthContext.isAuthenticated = false;

    const { rerender } = renderWithRouter(
      <ProtectedRoute>
        <MockChildren />
      </ProtectedRoute>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Update to loaded state
    mockAuthContext.loading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { id: 1, email: 'test@example.com', role: 'admin' };

    rerender(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthProvider>
          <ProtectedRoute>
            <MockChildren />
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
