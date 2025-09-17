import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 13 Pro's scale
const scale = SCREEN_WIDTH / 390;

// Scale the font size based on the screen width
export const scaleFont = (size: number): number => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Scale the width based on the screen width
export const scaleWidth = (size: number): number => {
  return size * (SCREEN_WIDTH / 390);
};

// Scale the height based on the screen height
export const scaleHeight = (size: number): number => {
  return size * (SCREEN_HEIGHT / 844);
};

// Moderate scale - combines width and height scaling
export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

// Vertical scale - for vertical spacing
export const verticalScale = (size: number): number => {
  return (size * SCREEN_HEIGHT) / 812;
};

// Horizontal scale - for horizontal spacing
export const horizontalScale = (size: number): number => {
  return (size * SCREEN_WIDTH) / 375;
};
