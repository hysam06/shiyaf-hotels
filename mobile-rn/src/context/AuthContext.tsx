import React, { createContext, useState, useEffect, useContext } from 'react';
import { StaffUser, UserRole } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: StaffUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<StaffUser>;
  logout: () => Promise<void>;
  hasPermission: (action: PermissionAction) => boolean;
}

export type PermissionAction =
  | 'view_reports'   // Admin & Manager
  | 'manage_staff'   // Admin only
  | 'register_guest' // All roles
  | 'view_guests'    // All roles
  | 'checkout_guest' // All roles
  | 'edit_guest'     // Admin & Manager
  | 'view_settings'  // Admin only
  | 'daily_notifications'; // Admin only

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role action map
const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  admin: [
    'view_reports',
    'manage_staff',
    'register_guest',
    'view_guests',
    'checkout_guest',
    'edit_guest',
    'view_settings',
    'daily_notifications',
  ],
  manager: [
    'view_reports',
    'register_guest',
    'view_guests',
    'checkout_guest',
    'edit_guest',
  ],
  staff: [
    'register_guest',
    'view_guests',
    'checkout_guest',
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local session on load
    const initializeAuth = async () => {
      try {
        const storedUser = await authService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<StaffUser> => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(emailOrPhone, password);
      setUser(loggedUser);
      setIsLoggedIn(true);
      return loggedUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (action: PermissionAction): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions ? permissions.includes(action) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
