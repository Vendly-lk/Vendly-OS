import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryData, CategoryPanel, PANEL_WIDTH } from '../components/CategoryPanel';
import { ChevronCircleIcon } from '../components/icons/ChevronCircleIcon';
import { ScaledFrame } from '../components/ScaledFrame';

/**
 * Ported from an Anima (Figma -> React) export of the "Product categories" rail:
 * six 240 x 1024 columns, numbered 01-06 left to right, each with a peeking
 * product photo, a title, and a "View More" pill. All positions below are read
 * off that export's own live, running DOM — not the raw Tailwind source, which
 * has two bugs the browser silently papers over (see CategoryPanel.tsx) and one
 * that it doesn't: the product image, painted after the text, sits on top of
 * and blocks the "View More" button in 4 of 6 columns. CategoryPanel repaints
 * the text above the image to keep the CTA tappable.
 */
const CATEGORIES: CategoryData[] = [
  {
    id: 'food-beverages',
    number: '01',
    title: 'Food & Beverages',
    numberColor: '#f2bd1e',
    numberStroke: '#ffffff',
    image: require('../../assets/categories/burger.png'),
    imageLeft: -71,
    imageTop: 402,
    imageHeight: 205,
    numberInkTop: 380,
    titleInkTop: 450,
    buttonTop: 486,
  },
  {
    id: 'fashion-apparel',
    number: '02',
    title: 'Fashion & Apparel',
    numberColor: '#858585',
    numberStroke: '#ffffff',
    image: require('../../assets/categories/hoodie.png'),
    imageLeft: -123,
    imageTop: 385,
    imageHeight: 261,
    numberInkTop: 380,
    titleInkTop: 450,
    buttonTop: 486,
  },
  {
    id: 'beauty-health',
    number: '03',
    title: 'Beauty & Health',
    numberColor: '#ff00d0',
    numberStroke: '#fff1f1',
    image: require('../../assets/categories/cent.png'),
    imageLeft: -111,
    imageTop: 380,
    imageHeight: 250,
    numberInkTop: 380,
    titleInkTop: 508,
    buttonTop: 600,
  },
  {
    id: 'electronics-accessories',
    number: '04',
    title: 'Electronics & Accessories',
    numberColor: '#00d2ff',
    numberStroke: '#fff5f5',
    image: require('../../assets/categories/headphone.png'),
    imageLeft: -97,
    imageTop: 398,
    imageHeight: 235,
    numberInkTop: 380,
    titleInkTop: 509,
    buttonTop: 601,
  },
  {
    id: 'home-lifestyle',
    number: '05',
    title: 'Home & Lifestyle',
    numberColor: '#e9d9c3',
    numberStroke: '#ffffff',
    image: require('../../assets/categories/lamp.png'),
    imageLeft: -126,
    imageTop: -376,
    imageHeight: 271,
    numberInkTop: 380,
    titleInkTop: 566,
    buttonTop: 603,
  },
  {
    id: 'general-store',
    number: '06',
    title: 'General Store',
    numberColor: '#93836f',
    // Source stroke color is an invalid hex; real browsers drop it. See
    // CategoryData.numberStroke.
    numberStroke: null,
    image: require('../../assets/categories/bag.png'),
    imageLeft: -151,
    imageTop: -357,
    imageHeight: 295,
    numberInkTop: 380,
    titleInkTop: 560,
    buttonTop: 596,
  },
];

export function ProductCategories() {
  return (
    <ScaledFrame backgroundColor="#ffffff">
      <View style={styles.row}>
        {CATEGORIES.map((category, index) => (
          <View key={category.id} style={{ left: index * PANEL_WIDTH, position: 'absolute' }}>
            <CategoryPanel data={category} />
          </View>
        ))}
      </View>

      <View style={styles.chevron}>
        <ChevronCircleIcon />
      </View>
    </ScaledFrame>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
  },
  chevron: {
    position: 'absolute',
    left: 680,
    top: 924,
  },
});
