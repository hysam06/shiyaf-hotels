// Design System - Premium SaaS Colors (Light Theme + Orange Accent)
export const colors = {
  // Brand Colors
  primary: '#FF6B35', // Premium SaaS Orange
  primaryLight: '#FFF2EC', // Subtle warm background tint
  primaryGradient: ['#FF6B35', '#FF8E53'] as const, // Gorgeous orange gradient
  
  // Neutral Colors (Slate Scale)
  background: '#F8F9FC', // Soft, clean canvas background
  card: '#FFFFFF', // Pure white for cards with soft shadows
  border: '#E5E7EB', // Ultra-light border (rarely used, shadows preferred)
  
  // Text Hierarchy
  textPrimary: '#1E293B', // Slate 800 - High contrast, extremely readable
  textSecondary: '#64748B', // Slate 500 - Subheadings, labels
  textMuted: '#94A3B8', // Slate 400 - Placeholder, inactive tabs
  textOnDark: '#FFFFFF', // High contrast white for colored backgrounds
  
  // Interactive / State Colors
  success: '#10B981', // Emerald 500
  successLight: '#D1FAE5',
  error: '#EF4444', // Red 500
  errorLight: '#FEE2E2',
  warning: '#F59E0B', // Amber 500
  warningLight: '#FEF3C7',
  info: '#3B82F6', // Blue 500
  infoLight: '#DBEAFE',

  // Legacy compatibility tags
  navy: '#1E293B', // Slate 800
  gold: '#FF6B35', // Map legacy gold to SaaS orange
  lightGray: '#F1F5F9',
  mediumGray: '#E2E8F0',
  darkGray: '#1E293B',
  checkedIn: '#10B981',
  checkedOut: '#64748B',
  cancelled: '#EF4444',
  cardBackground: '#FFFFFF',
};
