import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUser } from '../types';

const USERS: AppUser[] = [
  {
    id: 'user_admin',
    name: 'Administrator',
    email: 'admin@shiyafhotels.com',
    phone: '9876543210',
    role: 'admin',
    isActive: true,
  },
  {
    id: 'user_manager',
    name: 'Manager',
    email: 'manager@shiyafhotels.com',
    phone: '9876543211',
    role: 'manager',
    isActive: true,
  },
];

export const authService = {
  async login(emailOrPhone: string, password: string): Promise<AppUser> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const query = emailOrPhone.trim().toLowerCase();
    const user = USERS.find(
      (u) => (u.email.toLowerCase() === query || u.phone === query)
    );

    if (!user) {
      throw new Error('Invalid email or phone number');
    }

    const expectedPassword = `${user.role}123`;
    if (password !== expectedPassword && password !== '1234') {
      throw new Error('Incorrect password');
    }

    if (!user.isActive) {
      throw new Error('This account has been deactivated');
    }

    // Save auth session in storage
    await AsyncStorage.setItem('appUser', JSON.stringify(user));
    await AsyncStorage.setItem('appLoggedIn', 'true');
    return user;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('appUser');
    await AsyncStorage.removeItem('appLoggedIn');
  },

  async getCurrentUser(): Promise<AppUser | null> {
    try {
      const data = await AsyncStorage.getItem('appUser');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
};
