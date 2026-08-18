import React, { PropsWithChildren, useCallback, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { FRAME, colors } from '../theme';

/** Seed the fit from the window so the first paint is already correct. */
function initialViewport() {
  const { width, height } = Dimensions.get('window');
  return width > 0 && height > 0 ? { width, height } : null;
}

/**
 * "Desktop - 3" is drawn on a fixed 1440 x 1024 artboard. Rather than re-flow the
 * composition — which would stop it being the design — this renders the artboard
 * at its true size and applies a single uniform scale so it fits the viewport
 * without distortion. Every child can therefore use raw Figma coordinates.
 *
 * The fit is refined from this view's own layout rather than the window, so the
 * screen also behaves when it is embedded, split, or inset by safe areas. Layout
 * is seeded synchronously from the window and falls back to 1:1 rather than to
 * zero, so the composition is never withheld waiting on an async measurement.
 */
export function ScaledFrame({ children }: PropsWithChildren) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(initialViewport);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize(prev =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const scale =
    size && size.width > 0 && size.height > 0
      ? Math.min(size.width / FRAME.width, size.height / FRAME.height)
      : 1;

  return (
    <View style={styles.viewport} onLayout={handleLayout}>
      <View style={[styles.frame, { transform: [{ scale }] }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  frame: {
    width: FRAME.width,
    height: FRAME.height,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
});
