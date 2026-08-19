import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryData, CategoryPanel, PANEL_WIDTH } from '../components/CategoryPanel';
import { ChevronCircleIcon } from '../components/icons/ChevronCircleIcon';
import { ScaledFrame } from '../components/ScaledFrame';

/**
 * A six-column "shop by category" rail, numbered 01-06 left to right. Ported
 * from an Anima (Figma -> React) export supplied as a .rar; see the README for
 * the defects that export had (an unclickable CTA in 4 of 6 columns, 2 columns
 * with no visible photo, an invalid stroke color) and how CategoryPanel now
 * lays every column out on one consistent grid instead of reproducing them.
 */
const CATEGORIES: CategoryData[] = [
  {
    id: 'food-beverages',
    number: '01',
    title: 'Food & Beverages',
    numberColor: '#f2bd1e',
    image: require('../../assets/categories/burger.png'),
  },
  {
    id: 'fashion-apparel',
    number: '02',
    title: 'Fashion & Apparel',
    numberColor: '#858585',
    image: require('../../assets/categories/hoodie.png'),
  },
  {
    id: 'beauty-health',
    number: '03',
    title: 'Beauty & Health',
    numberColor: '#ff00d0',
    image: require('../../assets/categories/cent.png'),
  },
  {
    id: 'electronics-accessories',
    number: '04',
    title: 'Electronics & Accessories',
    numberColor: '#00d2ff',
    image: require('../../assets/categories/headphone.png'),
  },
  {
    id: 'home-lifestyle',
    number: '05',
    title: 'Home & Lifestyle',
    numberColor: '#e9d9c3',
    image: require('../../assets/categories/lamp.png'),
  },
  {
    id: 'general-store',
    number: '06',
    title: 'General Store',
    numberColor: '#93836f',
    image: require('../../assets/categories/bag.png'),
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
