import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { Arimo_400Regular } from '@expo-google-fonts/arimo';
import { BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Outfit_400Regular } from '@expo-google-fonts/outfit';
import { Suwannaphum_400Regular } from '@expo-google-fonts/suwannaphum';
import { TenaliRamakrishna_400Regular } from '@expo-google-fonts/tenali-ramakrishna';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { WendyOne_400Regular } from '@expo-google-fonts/wendy-one';

import { DesktopThree } from './src/screens/DesktopThree';
import { ProductCategories } from './src/screens/ProductCategories';
import { colors } from './src/theme';

type ScreenKey = 'desktop3' | 'categories';

const SCREENS: { key: ScreenKey; label: string; Component: React.ComponentType }[] = [
  { key: 'desktop3', label: 'Desktop 3', Component: DesktopThree },
  { key: 'categories', label: 'Categories', Component: ProductCategories },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Arimo_400Regular,
    BeVietnamPro_700Bold,
    Inter_400Regular,
    Outfit_400Regular,
    Suwannaphum_400Regular,
    TenaliRamakrishna_400Regular,
    VarelaRound_400Regular,
    WendyOne_400Regular,
  });
  const [active, setActive] = useState<ScreenKey>('desktop3');

  // Hold on black until the faces are ready — the layout is pinned to the metrics
  // of these specific fonts, so a fallback pass would visibly reflow.
  if (!fontsLoaded) {
    return <View style={styles.placeholder} />;
  }

  const Active = SCREENS.find(s => s.key === active)!.Component;

  return (
    <>
      <StatusBar style="light" />
      <Active />

      {/* Dev-only screen switcher. The site doesn't have real navigation wired
       *  up yet — sections are being built and verified one at a time. */}
      <View style={styles.switcher} pointerEvents="box-none">
        {SCREENS.map(s => (
          <Pressable
            key={s.key}
            onPress={() => setActive(s.key)}
            style={[styles.switcherButton, active === s.key && styles.switcherButtonActive]}
          >
            <Text style={styles.switcherLabel}>{s.label}</Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.background,
  },
  switcher: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  switcherButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  switcherButtonActive: {
    backgroundColor: 'rgba(0,120,255,0.85)',
  },
  switcherLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});
