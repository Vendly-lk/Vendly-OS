import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
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
 *
 * Resizing after mount is tracked two ways: `onLayout` (this view's own size,
 * correct even when embedded or split) and `Dimensions`' `change` event, added
 * because a live browser-window resize was observed to leave `onLayout` silent
 * on web — belt and braces, since a stale scale mispositions the whole artboard.
 *
 * `backgroundColor` covers both the letterboxed viewport and the artboard
 * itself, since different frames in this file are authored on different
 * grounds (Desktop-3 is black, the category showcase is white).
 */
type ScaledFrameProps = PropsWithChildren<{ backgroundColor?: string }>;

export function ScaledFrame({ children, backgroundColor = colors.background }: ScaledFrameProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(initialViewport);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize(prev =>
      prev && prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > 0 && window.height > 0) {
        setSize(prev =>
          prev && prev.width === window.width && prev.height === window.height
            ? prev
            : { width: window.width, height: window.height },
        );
      }
    });
    return () => subscription.remove();
  }, []);

  const scale =
    size && size.width > 0 && size.height > 0
      ? Math.min(size.width / FRAME.width, size.height / FRAME.height)
      : 1;

  return (
    <View style={[styles.viewport, { backgroundColor }]} onLayout={handleLayout}>
      <View style={[styles.frame, { backgroundColor, transform: [{ scale }] }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frame: {
    width: FRAME.width,
    height: FRAME.height,
    overflow: 'hidden',
  },
});
