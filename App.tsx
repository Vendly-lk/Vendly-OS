import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { Arimo_400Regular } from '@expo-google-fonts/arimo';
import { BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { Outfit_400Regular } from '@expo-google-fonts/outfit';
import { Suwannaphum_400Regular } from '@expo-google-fonts/suwannaphum';
import { TenaliRamakrishna_400Regular } from '@expo-google-fonts/tenali-ramakrishna';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { WendyOne_400Regular } from '@expo-google-fonts/wendy-one';

import { DesktopThree } from './src/screens/DesktopThree';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Arimo_400Regular,
    BeVietnamPro_700Bold,
    Outfit_400Regular,
    Suwannaphum_400Regular,
    TenaliRamakrishna_400Regular,
    VarelaRound_400Regular,
    WendyOne_400Regular,
  });

  // Hold on black until the faces are ready — the layout is pinned to the metrics
  // of these specific fonts, so a fallback pass would visibly reflow.
  if (!fontsLoaded) {
    return <View style={styles.placeholder} />;
  }

  return (
    <>
      <StatusBar style="light" />
      <DesktopThree />
    </>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
