import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

// กำหนด type สำหรับ return value ของ hook
type UseResponsiveReturn = {
  width: number;
  height: number;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  breakpoints: {
    phone: number;
    tablet: number;
    desktop: number;
  };
  responsiveFontSize: (size: number) => number;
  responsiveSpacing: (space: number) => number;
};

export const useResponsive = (): UseResponsiveReturn => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        setDimensions({
          width: window.width,
          height: window.height
        });
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  const { width, height } = dimensions;

  // กำหนด breakpoints
  const breakpoints = {
    phone: 480,
    tablet: 768,
    desktop: 1024,
  };

  // ตรวจสอบประเภทอุปกรณ์
  const isPhone = width <= breakpoints.phone;
  const isTablet = width > breakpoints.phone && width <= breakpoints.tablet;
  const isDesktop = width > breakpoints.tablet;
  const isLandscape = width > height;

  // คำนวณขนาดฟอนต์ responsive
  const responsiveFontSize = (size: number): number => {
    const baseWidth = 375; // iPhone SE
    const scaleFactor = width / baseWidth;
    const newSize = size * Math.min(scaleFactor, 1.5); // Limit scaling to 1.5x
    return Math.round(newSize);
  };

  // คำนวณ spacing responsive
  const responsiveSpacing = (space: number): number => {
    const baseWidth = 375;
    const scaleFactor = width / baseWidth;
    return Math.round(space * Math.min(scaleFactor, 1.3));
  };

  return {
    width,
    height,
    isPhone,
    isTablet,
    isDesktop,
    isLandscape,
    breakpoints,
    responsiveFontSize,
    responsiveSpacing,
  };
};

export default useResponsive;