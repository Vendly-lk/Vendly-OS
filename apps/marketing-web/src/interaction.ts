import { useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';

/**
 * Interaction primitives shared by every control on the site.
 *
 * React Native has no `:hover` / `:focus-visible`, and its Pressable only
 * reports `pressed`. These fill that gap once, so controls do not each
 * reinvent (and diverge on) what a hover or a focus ring looks like.
 */

/**
 * Whether the user is currently driving with the keyboard.
 *
 * Focus fires on mouse clicks too, so keying a focus ring off `onFocus` alone
 * paints a ring on every click — the exact problem CSS added `:focus-visible`
 * to solve. Tracking the last input modality reproduces that behaviour: the
 * ring appears for tab users and stays out of a mouse user's way.
 */
let keyboardModality = false;

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener(
    'keydown',
    event => {
      if ((event as KeyboardEvent).key === 'Tab') keyboardModality = true;
    },
    true,
  );
  const pointerDown = () => {
    keyboardModality = false;
  };
  window.addEventListener('mousedown', pointerDown, true);
  window.addEventListener('touchstart', pointerDown, true);
}

export type Interaction = {
  hovered: boolean;
  pressed: boolean;
  /** Focused *and* reached by keyboard — drives the focus ring. */
  focusVisible: boolean;
  /** Hover or keyboard focus: "the user is pointing at this". */
  highlighted: boolean;
  handlers: {
    onHoverIn: () => void;
    onHoverOut: () => void;
    onPressIn: () => void;
    onPressOut: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
};

export function useInteraction(): Interaction {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const handlers = useMemo(
    () => ({
      onHoverIn: () => setHovered(true),
      onHoverOut: () => {
        setHovered(false);
        setPressed(false);
      },
      onPressIn: () => setPressed(true),
      onPressOut: () => setPressed(false),
      onFocus: () => setFocusVisible(keyboardModality),
      onBlur: () => setFocusVisible(false),
    }),
    [],
  );

  return { hovered, pressed, focusVisible, highlighted: hovered || focusVisible, handlers };
}

/**
 * A ring around the control that never shifts layout.
 *
 * Drawn with a spread shadow rather than `outline`: react-native-web drops the
 * `outline*` style props, so an outline-based ring silently never renders.
 * A negative `offset` draws the ring inside the box, for controls that sit
 * flush against their neighbours and would otherwise clip it.
 */
export function focusRing(color: string, offset = 3) {
  return { boxShadow: `${offset < 0 ? 'inset ' : ''}0 0 0 3px ${color}` } as const;
}

/** Web-only pointer affordance; ignored on native. */
export const clickable = { cursor: 'pointer' } as const;

/**
 * Drives a 0..1 Animated value from a boolean, for hover/press transitions.
 * `useNativeDriver` is off because these mostly animate colour and layout,
 * which the native driver cannot handle.
 */
export function useToggleAnimation(on: boolean, duration = 180) {
  const value = useRef(new Animated.Value(on ? 1 : 0)).current;
  const previous = useRef(on);

  if (previous.current !== on) {
    previous.current = on;
    Animated.timing(value, {
      toValue: on ? 1 : 0,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }

  return value;
}
