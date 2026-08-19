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

function initialViewport() {
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
};

export type ScaledPageProps = {
  sections: PageSection[];
  backgroundColor: string;
};

export function ScaledPage({ sections, backgroundColor }: ScaledPageProps) {
  const [viewport, setViewport] = useState(initialViewport);
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

  React.useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      if (window.width > 0 && window.height > 0) {
        setViewport({ width: window.width, height: window.height });
      }
    });
    return () => sub.remove();
  }, []);

  const ids = useMemo(() => sections.map(section => section.id), [sections]);

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
        >
          {sections.map(section => (
            <View
              key={section.id}
              style={[styles.slot, { width: viewport.width, height: viewport.height }]}
            >
              <View
                style={[
                  styles.canvas,
                  {
                    height: section.height,
                    transform: [
                      {
                        scale: Math.min(
                          viewport.width / FRAME.width,
                          viewport.height / section.height,
                        ),
                      },
                    ],
                  },
                ]}
              >
                {section.content}
              </View>
            </View>
          ))}
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  canvas: {
    width: FRAME.width,
  },
});
