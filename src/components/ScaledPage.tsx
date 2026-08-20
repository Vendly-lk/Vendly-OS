import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { FRAME } from '../theme';
import { SectionId } from '../layout';

/**
 * Every screen is authored on a fixed 1440-wide canvas, and each one is a whole
 * page of the design rather than a band of a longer document.
 *
 * So each is given exactly one screenful and scaled to *fit* inside it —
 * `min(vw / 1440, vh / pageHeight)` — instead of being scaled to the viewport's
 * width. Scaling to width blows a 1440 canvas up by a third on a 1920 display
 * and pushes the lower half of every page off the bottom edge; fitting keeps a
 * whole page visible at once, which is how these were drawn to be read.
 *
 * The canvas is never re-flowed, so components still position themselves in raw
 * design pixels. Scrolling moves between pages rather than through one, and
 * paging makes it settle on a page instead of between two.
 */

type PageScroll = { scrollToSection: (id: SectionId) => void };

const PageScrollCtx = createContext<PageScroll>({ scrollToSection: () => {} });

export function usePageScroll(): PageScroll {
  return useContext(PageScrollCtx);
}

/**
 * Which page the reader is actually on. Sections use it to run their entrance
 * when they are arrived at rather than when they mount, since every page is
 * mounted from the start.
 */
const ActiveSectionCtx = createContext<SectionId | null>(null);

export function useIsSectionActive(id: SectionId): boolean {
  return useContext(ActiveSectionCtx) === id;
}

/**
 * On web the document's own viewport is the authority. `Dimensions` has been
 * observed to hand back a stale size at mount, and when that happens the whole
 * page renders at the wrong scale until something else forces a re-measure —
 * which `onLayout` will not always do, since it rides on a ResizeObserver.
 */
function readViewport() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth > 0) {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  const { width, height } = Dimensions.get('window');
  return {
    width: width > 0 ? width : FRAME.width,
    height: height > 0 ? height : FRAME.height,
  };
}

export type PageSection = {
  id: SectionId;
  /** The page's own height on the 1440-wide canvas. */
  height: number;
  content: React.ReactNode;
  /**
   * Painted edge to edge behind the page, so a viewport wider than the design
   * shows more of the page's own ground rather than bars beside it. A colour
   * covers most pages; give a node when the ground is a gradient or an image.
   */
  background?: string;
  backgroundNode?: React.ReactNode;
};

export type ScaledPageProps = {
  sections: PageSection[];
  backgroundColor: string;
};

export function ScaledPage({ sections, backgroundColor }: ScaledPageProps) {
  const [viewport, setViewport] = useState(readViewport);
  const scrollRef = useRef<ScrollView>(null);
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport(prev =>
      (Math.abs(prev.width - width) < 0.5 && Math.abs(prev.height - height) < 0.5) ||
      width <= 0 ||
      height <= 0
        ? prev
        : { width, height },
    );
  }, []);

  const applyViewport = useCallback((next: { width: number; height: number }) => {
    setViewport(prev =>
      (Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.height - next.height) < 0.5) ||
      next.width <= 0 ||
      next.height <= 0
        ? prev
        : next,
    );
  }, []);

  React.useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) =>
      applyViewport({ width: window.width, height: window.height }),
    );
    return () => sub.remove();
  }, [applyViewport]);

  // Third signal, and the only authoritative one on web: the document itself.
  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onResize = () => applyViewport(readViewport());
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [applyViewport]);

  const ids = useMemo(() => sections.map(section => section.id), [sections]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      const page = layoutMeasurement.height;
      if (page <= 0) return;
      // Count a page as arrived at once it covers most of the viewport, so the
      // entrance fires as it settles rather than as it starts to appear.
      const next = Math.round(contentOffset.y / page);
      setActiveIndex(prev => (prev === next ? prev : next));
    },
    [],
  );

  const scrollToSection = useCallback(
    (id: SectionId) => {
      const index = ids.indexOf(id);
      if (index < 0) return;
      scrollRef.current?.scrollTo({ y: index * viewportRef.current.height, animated: true });
    },
    [ids],
  );

  const pageScroll = useMemo(() => ({ scrollToSection }), [scrollToSection]);

  return (
    <View style={[styles.viewport, { backgroundColor }]} onLayout={handleLayout}>
      <PageScrollCtx.Provider value={pageScroll}>
        <ScrollView
          ref={scrollRef}
          pagingEnabled={sections.length > 1}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          {sections.map(section => {
            // Contain, never cover: the page is scaled to whichever axis runs
            // out first, so nothing is cropped and nothing is enlarged past the
            // point where it would soften.
            const scale = Math.min(
              viewport.width / FRAME.width,
              viewport.height / section.height,
            );
            // The canvas is then grown, in design units, to whatever the
            // viewport actually is. The page composes at 1440 as drawn; the
            // extra width exists purely so its ground can reach the edges.
            const canvasWidth = viewport.width / scale;
            const canvasHeight = viewport.height / scale;

            return (
              <View
                key={section.id}
                style={[styles.slot, { width: viewport.width, height: viewport.height }]}
              >
                <View
                  style={[
                    styles.canvas,
                    {
                      width: canvasWidth,
                      height: canvasHeight,
                      transform: [{ scale }],
                      transformOrigin: 'top left',
                      backgroundColor: section.background,
                    },
                  ]}
                >
                  {section.backgroundNode ?? null}

                  <View
                    style={{
                      position: 'absolute',
                      left: (canvasWidth - FRAME.width) / 2,
                      top: (canvasHeight - section.height) / 2,
                      width: FRAME.width,
                      height: section.height,
                    }}
                  >
                    <ActiveSectionCtx.Provider value={ids[activeIndex] ?? null}>
                      {section.content}
                    </ActiveSectionCtx.Provider>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </PageScrollCtx.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  slot: {
    overflow: 'hidden',
  },
  canvas: {
    overflow: 'hidden',
  },
});
