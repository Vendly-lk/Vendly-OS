import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native';

import { FRAME } from '../theme';

/**
 * Lets anything inside the page jump to a position on the design canvas — the
 * nav links and the scroll-cue chevrons, which are affordances that have to
 * actually move the page to mean anything. Callers pass design pixels; the
 * scale conversion happens here so they never have to know about it.
 */
type PageScroll = { scrollToY: (designY: number) => void };

const PageScrollCtx = createContext<PageScroll>({ scrollToY: () => {} });

export function usePageScroll(): PageScroll {
  return useContext(PageScrollCtx);
}

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
  const scrollRef = useRef<ScrollView>(null);
  const scaleRef = useRef(1);

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
  scaleRef.current = scale;

  const scrollToY = useCallback((designY: number) => {
    scrollRef.current?.scrollTo({ y: designY * scaleRef.current, animated: true });
  }, []);
  const pageScroll = useMemo(() => ({ scrollToY }), [scrollToY]);

  return (
    <View style={[styles.viewport, { backgroundColor }]} onLayout={handleLayout}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ height: contentHeight * scale }}>
        <View
          style={[
            styles.canvas,
            { height: contentHeight, transform: [{ scale }], transformOrigin: 'top left' },
          ]}
        >
          <PageScrollCtx.Provider value={pageScroll}>{children}</PageScrollCtx.Provider>
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
