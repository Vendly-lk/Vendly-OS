import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { Arimo_400Regular } from '@expo-google-fonts/arimo';
import { BeVietnamPro_700Bold } from '@expo-google-fonts/be-vietnam-pro';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Suwannaphum_400Regular } from '@expo-google-fonts/suwannaphum';
import { TenaliRamakrishna_400Regular } from '@expo-google-fonts/tenali-ramakrishna';
import { VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import { WendyOne_400Regular } from '@expo-google-fonts/wendy-one';

import { ScaledPage } from './src/components/ScaledPage';
import { NavigationProvider, Route, useNavigation } from './src/Navigation';
import { About, ABOUT_HEIGHT } from './src/sections/About';
import { Categories, CATEGORIES_HEIGHT } from './src/sections/Categories';
import { GrowFooter, FOOTER_HEIGHT } from './src/sections/GrowFooter';
import { Hero, HERO_HEIGHT } from './src/sections/Hero';
import { Testimonials, TESTIMONIALS_HEIGHT } from './src/sections/Testimonials';
import { SignIn, SIGNIN_HEIGHT } from './src/screens/SignIn';
import { ThemeProvider, useTheme } from './src/ThemeContext';

const HOME_HEIGHT =
  HERO_HEIGHT + ABOUT_HEIGHT + CATEGORIES_HEIGHT + TESTIMONIALS_HEIGHT + FOOTER_HEIGHT;

export default function App() {
  const [fontsLoaded] = useFonts({
    Arimo_400Regular,
    BeVietnamPro_700Bold,
    Inter_400Regular,
    Inter_700Bold,
    Outfit_400Regular,
    Outfit_700Bold,
    Suwannaphum_400Regular,
    TenaliRamakrishna_400Regular,
    VarelaRound_400Regular,
    WendyOne_400Regular,
  });
  const [route, setRoute] = useState<Route>('home');
  const nav = useMemo(() => ({ route, navigate: setRoute }), [route]);

  // Hold until the faces are ready — the layout is pinned to the metrics of
  // these specific fonts, so a fallback pass would visibly reflow.
  if (!fontsLoaded) {
    return <View style={styles.placeholder} />;
  }

  return (
    <ThemeProvider initial="light">
      <NavigationProvider value={nav}>
        <StatusBar style="auto" />
        <Site />
      </NavigationProvider>
    </ThemeProvider>
  );
}

function Site() {
  const { theme } = useTheme();
  const { route, navigate } = useNavigation();

  if (route === 'signin') {
    return (
      <ScaledPage contentHeight={SIGNIN_HEIGHT} backgroundColor="#a2aeb8">
        <SignIn />
        <BackToSite onPress={() => navigate('home')} />
      </ScaledPage>
    );
  }

  return (
    <ScaledPage contentHeight={HOME_HEIGHT} backgroundColor={theme.pageBg}>
      <Hero />
      <About />
      <Categories />
      <Testimonials />
      <GrowFooter />
    </ScaledPage>
  );
}

/** The sign-in frame has no nav of its own, so give it a way back. */
function BackToSite({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.back}>
      <Text style={styles.backLabel}>← Back to site</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#000000',
  },
  back: {
    position: 'absolute',
    left: 89,
    top: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
});
