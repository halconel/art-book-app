import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import api from '../../services/authService';

// Mock the API service
jest.mock('../../services/authService', () => ({
  post: jest.fn(),
  get: jest.fn(),
  setAuthHeader: jest.fn(),
  removeAuthHeader: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Test component to access auth context
const TestComponent = ({ onAuthChange = () => {} }) => {
  const auth = useAuth();

  React.useEffect(() => {
    onAuthChange(auth);
  }, [auth, onAuthChange]);

  return (
    <div>
      <div data-testid="user">{JSON.stringify(auth.user)}</div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="admin">{auth.isAdmin.toString()}</div>
      <div data-testid="client">{auth.isClient.toString()}</div>
      <button
        onClick={() => auth.login('test@example.com', 'password')}
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={auth.logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

const renderWithAuthProvider = (ui, options = {}) => {
  return render(<AuthProvider {...options}>{ui}</AuthProvider>);
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should provide initial auth state', () => {
    renderWithAuthProvider(<TestComponent />);

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
    expect(screen.getByTestId('client')).toHaveTextContent('false');
  });

  it('should restore user from localStorage on mount', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'admin',
    };
    const mockToken = 'mock-jwt-token';

    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);

    renderWithAuthProvider(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('admin')).toHaveTextContent('true');
      expect(screen.getByTestId('client')).toHaveTextContent('false');
    });

    expect(api.setAuthHeader).toHaveBeenCalledWith(mockToken);
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'admin',
    };
    const mockToken = 'mock-jwt-token';

    api.post.mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    renderWithAuthProvider(<TestComponent />);

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('admin')).toHaveTextContent('true');
    });

    expect(api.post).toHaveBeenCalledWith('/login', {
      email: 'test@example.com',
      password: 'password',
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockUser)
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(api.setAuthHeader).toHaveBeenCalledWith(mockToken);
  });

  it('should handle login failure', async () => {
    const user = userEvent.setup();
    const mockError = new Error('Invalid credentials');

    api.post.mockRejectedValueOnce(mockError);

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderWithAuthProvider(<TestComponent />);

    await act(async () => {
      await user.click(screen.getByTestId('login-btn'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Login failed:', mockError);
    consoleSpy.mockRestore();
  });

  it('should handle logout correctly', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      role: 'admin',
    };

    // Start with authenticated user
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce('mock-token');

    renderWithAuthProvider(<TestComponent />);

    // Wait for initial auth state
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Logout
    await act(async () => {
      await user.click(screen.getByTestId('logout-btn'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('admin')).toHaveTextContent('false');
      expect(screen.getByTestId('client')).toHaveTextContent('false');
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(api.removeAuthHeader).toHaveBeenCalled();
  });

  it('should identify client role correctly', async () => {
    const mockUser = {
      id: 1,
      email: 'client@example.com',
      role: 'client',
    };
    const mockToken = 'mock-jwt-token';

    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(mockToken);

    renderWithAuthProvider(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('admin')).toHaveTextContent('false');
      expect(screen.getByTestId('client')).toHaveTextContent('true');
    });
  });

  it('should handle registration', async () => {
    let authContext;
    const onAuthChange = auth => {
      authContext = auth;
    };

    const mockUser = {
      id: 1,
      email: 'newuser@example.com',
      role: 'client',
    };
    const mockToken = 'mock-jwt-token';

    api.post.mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    renderWithAuthProvider(<TestComponent onAuthChange={onAuthChange} />);

    await act(async () => {
      await authContext.register(
        'newuser@example.com',
        'password',
        'Test User'
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('client')).toHaveTextContent('true');
    });

    expect(api.post).toHaveBeenCalledWith('/register', {
      email: 'newuser@example.com',
      password: 'password',
      name: 'Test User',
    });
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
