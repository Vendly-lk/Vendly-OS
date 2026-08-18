import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AboutSection } from '../components/AboutSection';
import { ScaledFrame } from '../components/ScaledFrame';
import { ScrollCue } from '../components/ScrollCue';
import { TopBar } from '../components/TopBar';

/**
 * Figma "Desktop - 3" (node 27:1324) — a 1440 x 1024 artboard on black.
 */
export function DesktopThree() {
  return (
    <ScaledFrame>
      <TopBar />
      <AboutSection />
      <View style={styles.scrollCue}>
        <ScrollCue />
      </View>
    </ScaledFrame>
  );
}

const styles = StyleSheet.create({
  /** Node 222:62 — the 70px disc is centred on the frame and hung 13px off the bottom. */
  scrollCue: {
    position: 'absolute',
    left: 685,
    top: 941,
  },
});
