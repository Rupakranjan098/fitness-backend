// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, string>;
type IconSymbolName = SymbolViewProps['name'];

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  // Existing ones
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'person.circle.fill': 'account-circle',
  'location.fill': 'location-on',
  
  // Login/Signup
  'envelope.fill': 'mail',
  'eye.slash.fill': 'visibility-off',
  'eye.fill': 'visibility',
  'checkmark': 'check',
  'g.circle.fill': 'account-circle',
  'applelogo': 'person',

  // Profile
  'arrow.left': 'arrow-back',
  'person.fill': 'person',
  'camera.fill': 'camera-alt',
  'phone.fill': 'phone',
  'chevron.down': 'keyboard-arrow-down',
  'calendar': 'calendar-today',

  // Theme Toggle
  'sun.max.fill': 'wb-sunny',
  'moon.fill': 'nights-stay',

  // Home (index.tsx)
  'bell.fill': 'notifications',
  'plus.app.fill': 'add-box',
  'heart.fill': 'favorite',
  'drop.fill': 'water-drop',
  'star.fill': 'star',
  'figure.walk': 'directions-walk',
  'fork.knife': 'restaurant',

  // BMI Calculator (bmi.tsx)
  'ruler.fill': 'straighten',
  'scalemass.fill': 'monitor-weight',
  'lightbulb.fill': 'lightbulb',

  // Explore (explore.tsx)
  'magnifyingglass': 'search',
  'line.3.horizontal.decrease': 'filter-list',
  'figure.yoga': 'self-improvement',
  'clock.fill': 'access-time',
  'flame.fill': 'local-fire-department',
  'book.fill': 'book',
  'figure.run': 'directions-run',
  'leaf.fill': 'eco',

  // Exercises (Body Parts)
  'bolt.fill': 'bolt',
  'shield.fill': 'shield',

  // Close / Dismiss
  'xmark.circle.fill': 'cancel',

  // Workout Summary & Tracking
  'flag.checkered': 'flag',
  'timer': 'timer',
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'play.circle.fill': 'play-circle-filled',
  'figure.hiking': 'hiking',
  'figure.outdoor.cycle': 'directions-bike',
  'figure.back.outdoor': 'arrow-back',
  'slider.horizontal.3': 'filter-list',
  'egg.fill': 'egg',
  'bowl.fill': 'soup-kitchen',
  'target': 'track-changes',
  'figure.strengthtraining.traditional': 'fitness-center',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialName = MAPPING[name as string] || 'help';

  return <MaterialIcons color={color} size={size} name={materialName as any} style={style} />;
}
