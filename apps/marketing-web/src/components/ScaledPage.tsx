import React, { PropsWithChildren, useCallback, useState } from 'react';
import { Dimensions, LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';

import { FRAME } from '../theme';

/**
 * The site is authored on a fixed 1440-wide canvas of stacked sections. This
 * scales that canvas to the viewport width — so the composition is never
 * re-flowed — and lets it scroll vertically.
 *
 * Width is seeded synchronously from the window and refined from this view's own
 * layout, and a Dimensions listener catches live resizes that `onLayout` alone
 * was observed to miss on web.
 */

function initialWidth() {
  const { width } = Dimensions.get('window');
  return width > 0 ? width : FRAME.width;
}

export type ScaledPageProps = PropsWithChildren<{
  /** Total height of the stacked sections, in design pixels. */
  contentHeight: number;
  backgroundColor: string;
}>;

export function ScaledPage({ children, contentHeight, backgroundColor }: ScaledPageProps) {
  const [width, setWidth] = useState(initialWidth);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setWidth(prev => (Math.abs(prev - next) < 0.5 || next <= 0 ? prev : next));
  }, []);

  React.useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > 0) setWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  const scale = width / FRAME.width;

  return (
    <View style={[styles.viewport, { backgroundColor }]} onLayout={handleLayout}>
      <ScrollView contentContainerStyle={{ height: contentHeight * scale }}>
        <View
          style={[
            styles.canvas,
            { height: contentHeight, transform: [{ scale }], transformOrigin: 'top left' },
          ]}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    width: FRAME.width,
  },
});
