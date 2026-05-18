import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

export type IconName =
  | 'alert' | 'back' | 'bell' | 'building' | 'calendar' | 'camera' | 'chart' | 'dashboard'
  | 'check' | 'chevron-down' | 'chevron-up' | 'clipboard' | 'clock' | 'close' | 'door'
  | 'edit' | 'eye' | 'eye-off' | 'hotel' | 'id-card' | 'lock' | 'mail'
  | 'money' | 'occupancy' | 'plane' | 'plus' | 'receipt' | 'refresh'
  | 'scan' | 'search' | 'settings' | 'tag' | 'user' | 'users' | 'whatsapp';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 22, color = colors.textPrimary, strokeWidth = 2 }: IconProps) {
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

  const render = () => {
    switch (name) {
      case 'hotel':
        return <><Rect {...common} x="4" y="4" width="16" height="18" rx="2" /><Path {...common} d="M9 22v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" /></>;
      case 'building':
        return <><Rect {...common} x="3" y="7" width="18" height="14" rx="2" /><Path {...common} d="M8 21V3h8v18M7 11h.01M12 11h.01M17 11h.01M7 15h.01M12 15h.01M17 15h.01" /></>;
      case 'dashboard':
      case 'chart':
        return <><Path {...common} d="M4 19V5M4 19h16" /><Rect {...common} x="7" y="11" width="3" height="5" /><Rect {...common} x="12" y="7" width="3" height="9" /><Rect {...common} x="17" y="4" width="3" height="12" /></>;
      case 'users':
        return <><Circle {...common} cx="9" cy="8" r="3" /><Path {...common} d="M3 20c.7-3 3-5 6-5s5.3 2 6 5" /><Path {...common} d="M16 11a3 3 0 1 0-.6-5.9M18 20c-.3-1.7-1.1-3-2.4-4" /></>;
      case 'user':
        return <><Circle {...common} cx="12" cy="8" r="4" /><Path {...common} d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>;
      case 'plus':
        return <><Circle {...common} cx="12" cy="12" r="9" /><Path {...common} d="M12 8v8M8 12h8" /></>;
      case 'settings':
        return <><Circle {...common} cx="12" cy="12" r="3" /><Path {...common} d="M19.4 15a8 8 0 0 0 .1-6l-2.1.4a7 7 0 0 0-1.2-1.2l.4-2.1a8 8 0 0 0-6 0l.4 2.1a7 7 0 0 0-1.2 1.2L7.6 9a8 8 0 0 0 0 6l2.1-.4a7 7 0 0 0 1.2 1.2l-.4 2.1a8 8 0 0 0 6 0l-.4-2.1a7 7 0 0 0 1.2-1.2z" /></>;
      case 'refresh':
        return <><Path {...common} d="M20 6v5h-5M4 18v-5h5" /><Path {...common} d="M6.5 9A6 6 0 0 1 17 6l3 5M17.5 15A6 6 0 0 1 7 18l-3-5" /></>;
      case 'search':
        return <><Circle {...common} cx="11" cy="11" r="7" /><Path {...common} d="M20 20l-4-4" /></>;
      case 'bell':
        return <><Path {...common} d="M18 16H6c1.5-2 2-4 2-7a4 4 0 0 1 8 0c0 3 .5 5 2 7z" /><Path {...common} d="M10 19a2 2 0 0 0 4 0" /></>;
      case 'money':
        return <><Rect {...common} x="3" y="6" width="18" height="12" rx="2" /><Circle {...common} cx="12" cy="12" r="3" /><Path {...common} d="M6 9h.01M18 15h.01" /></>;
      case 'occupancy':
        return <><Path {...common} d="M4 20V8l8-5 8 5v12" /><Path {...common} d="M9 20v-6h6v6" /></>;
      case 'door':
        return <><Path {...common} d="M7 21V4h10v17M10 12h.01" /><Path {...common} d="M5 21h14" /></>;
      case 'clock':
        return <><Circle {...common} cx="12" cy="12" r="9" /><Path {...common} d="M12 7v5l3 2" /></>;
      case 'alert':
        return <><Path {...common} d="M12 3 2 21h20L12 3z" /><Path {...common} d="M12 9v5M12 18h.01" /></>;
      case 'clipboard':
        return <><Rect {...common} x="5" y="4" width="14" height="17" rx="2" /><Path {...common} d="M9 4a3 3 0 0 1 6 0M9 9h6M9 13h6M9 17h3" /></>;
      case 'camera':
        return <><Path {...common} d="M4 8h4l2-3h4l2 3h4v11H4z" /><Circle {...common} cx="12" cy="14" r="3" /></>;
      case 'check':
        return <Path {...common} d="M20 6 9 17l-5-5" />;
      case 'whatsapp':
        return <><Circle {...common} cx="12" cy="12" r="9" /><Path {...common} d="m8 20 1-3M9 8c2 5 4 7 7 8M10 8l1.2 2-1 1M15 14l1.8.8-.8 1.2" /></>;
      case 'scan':
        return <><Path {...common} d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><Path {...common} d="M7 12h10" /></>;
      case 'plane':
        return <Path {...common} d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />;
      case 'receipt':
        return <><Path {...common} d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><Path {...common} d="M9 8h6M9 12h6M9 16h3" /></>;
      case 'tag':
        return <><Path {...common} d="M20 13 13 20 4 11V4h7z" /><Circle {...common} cx="8" cy="8" r="1" /></>;
      case 'calendar':
        return <><Rect {...common} x="4" y="5" width="16" height="15" rx="2" /><Path {...common} d="M8 3v4M16 3v4M4 10h16" /></>;
      case 'mail':
        return <><Rect {...common} x="3" y="5" width="18" height="14" rx="2" /><Path {...common} d="m4 7 8 6 8-6" /></>;
      case 'edit':
        return <><Path {...common} d="M4 20h4l11-11-4-4L4 16z" /><Path {...common} d="M13 7l4 4" /></>;
      case 'id-card':
        return <><Rect {...common} x="3" y="5" width="18" height="14" rx="2" /><Circle {...common} cx="9" cy="12" r="2" /><Path {...common} d="M14 10h4M14 14h3M6 17c.5-2 5.5-2 6 0" /></>;
      case 'lock':
        return <><Rect {...common} x="5" y="10" width="14" height="10" rx="2" /><Path {...common} d="M8 10V7a4 4 0 0 1 8 0v3" /></>;
      case 'eye':
        return <><Path {...common} d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><Circle {...common} cx="12" cy="12" r="3" /></>;
      case 'eye-off':
        return <><Path {...common} d="M3 3l18 18M10.5 10.5a3 3 0 0 0 4 4" /><Path {...common} d="M7 7C4 8.8 2 12 2 12s4 7 10 7c1.6 0 3-.5 4.2-1.2M17 17c3-1.8 5-5 5-5s-4-7-10-7c-1.4 0-2.7.4-3.8 1" /></>;
      case 'back':
        return <Path {...common} d="M15 18 9 12l6-6" />;
      case 'chevron-up':
        return <Path {...common} d="m6 15 6-6 6 6" />;
      case 'chevron-down':
        return <Path {...common} d="m6 9 6 6 6-6" />;
      case 'close':
        return <Path {...common} d="M6 6l12 12M18 6 6 18" />;
      default:
        return <Circle {...common} cx="12" cy="12" r="8" />;
    }
  };

  return <Svg width={size} height={size} viewBox="0 0 24 24">{render()}</Svg>;
}
