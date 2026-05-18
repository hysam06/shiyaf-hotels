import AsyncStorage from '@react-native-async-storage/async-storage';
import { StaffUser, UserRole } from '../types';

// Demo staff users
export const DEMO_USERS: StaffUser[] = [
  {
    id: 'user_admin',
    name: 'Shiyaf (Admin)',
    email: 'admin@shiyaf.com',
    phone: '9876543210',
    role: 'admin',
    isActive: true,
  },
  {
    id: 'user_manager_plaza',
    name: 'Rahul (Manager - Plaza)',
    email: 'manager.plaza@shiyaf.com',
    phone: '9876543211',
    role: 'manager',
    property: 'plaza',
    isActive: true,
  },
  {
    id: 'user_manager_century',
    name: 'Nitin (Manager - Century)',
    email: 'manager.century@shiyaf.com',
    phone: '9876543212',
    role: 'manager',
    property: 'century',
    isActive: true,
  },
  {
    id: 'user_staff',
    name: 'Ajay (Front Desk)',
    email: 'staff@shiyaf.com',
    phone: '9876543213',
    role: 'staff',
    isActive: true,
  },
];

export const authService = {
  // Simple check for demo login
  async login(emailOrPhone: string, password: string): Promise<StaffUser> {
    // Artificial delay to mimic API call and show button loading states
    await new Promise((resolve) => setTimeout(resolve, 800));

    const query = emailOrPhone.trim().toLowerCase();
    const user = DEMO_USERS.find(
      (u) => (u.email.toLowerCase() === query || u.phone === query)
    );

    if (!user) {
      throw new Error('Invalid email or phone number');
    }

    // Accept password matching the role (e.g., admin123, manager123, staff123)
    const expectedPassword = `${user.role}123`;
    if (password !== expectedPassword && password !== '1234') {
      throw new Error('Incorrect password');
    }

    if (!user.isActive) {
      throw new Error('This account has been deactivated');
    }

    // Save auth session in storage
    await AsyncStorage.setItem('staffUser', JSON.stringify(user));
    await AsyncStorage.setItem('staffLoggedIn', 'true');
    return user;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('staffUser');
    await AsyncStorage.removeItem('staffLoggedIn');
  },

  async getCurrentUser(): Promise<StaffUser | null> {
    try {
      const data = await AsyncStorage.getItem('staffUser');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async getStaffList(): Promise<StaffUser[]> {
    try {
      const stored = await AsyncStorage.getItem('custom_staff_list');
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with demo users
      await AsyncStorage.setItem('custom_staff_list', JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  },

  async saveStaffList(list: StaffUser[]): Promise<void> {
    await AsyncStorage.setItem('custom_staff_list', JSON.stringify(list));
  }
};
