import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import { useReducedMotion } from '../interaction';

/**
 * The entrance every section uses: content fades up into place rather than
 * being there already.
 *
 * This is the motion language of the reference site the design is chasing —
 * nothing moves until you arrive at it, then the block assembles top-down in a
 * short stagger. Because this site is paged rather than continuously scrolled,
 * "arriving" means the page becoming the active one, not crossing a threshold.
 *
 * Each child that should animate separately gets its own `delay`; ~90ms apart
 * reads as one considered movement rather than a queue of separate ones.
 */

export const REVEAL_MS = 620;
export const REVEAL_STAGGER = 90;
/** Far enough to read as movement, short enough not to feel like a slide-in. */
const RISE = 26;

export type RevealProps = PropsWithChildren<{
  /** Usually "this section is the page you are looking at". */
  visible: boolean;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}>;

export function Reveal({ visible, delay = 0, style, children }: RevealProps) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;
  // Latched on purpose: an entrance plays once. Animating back out would hide
  // a page again every time it stops being the active one, which both fights
  // the reader on the way back up and turns any hiccup in tracking the active
  // page into permanently blank content.
  const shown = useRef(false);

  useEffect(() => {
    if (!visible || shown.current) return;
    shown.current = true;

    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: REVEAL_MS,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [visible, delay, reduced, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [RISE, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
