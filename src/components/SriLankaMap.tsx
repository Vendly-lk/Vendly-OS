import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors, fonts } from '../theme';
import { DISTRICTS, SRI_LANKA_BBOX, SRI_LANKA_OUTLINE } from '../data/sriLanka';

/**
 * The native stand-in for the WebGL map.
 *
 * `SriLankaMap.web.tsx` renders a lit, rotating, extruded relief through
 * react-three-fiber. That stack is web-only here — drei's `Html` needs the DOM,
 * and a native build would need expo-gl and a different entry point — so rather
 * than ship something half-working on iOS and Android, those platforms get the
 * same coastline drawn flat.
 *
 * It is the *same* geography either way: both read `SRI_LANKA_OUTLINE`, so the
 * island and its districts cannot drift apart between platforms.
 */

export type SriLankaMapProps = { width: number; height: number };

const PAD = 24;

export function SriLankaMap({ width, height }: SriLankaMapProps) {
  const spanLon = SRI_LANKA_BBOX.maxLon - SRI_LANKA_BBOX.minLon;
  const spanLat = SRI_LANKA_BBOX.maxLat - SRI_LANKA_BBOX.minLat;
  // Latitude is the long axis, so fit to height and centre the narrow axis.
  const scale = Math.min((width - PAD * 2) / spanLon, (height - PAD * 2) / spanLat);
  const offsetX = (width - spanLon * scale) / 2;
  const offsetY = (height - spanLat * scale) / 2;

  const toXY = (lon: number, lat: number): [number, number] => [
    offsetX + (lon - SRI_LANKA_BBOX.minLon) * scale,
    offsetY + (SRI_LANKA_BBOX.maxLat - lat) * scale,
  ];

  const path =
    SRI_LANKA_OUTLINE.map(([lon, lat], i) => {
      const [x, y] = toXY(lon, lat);
      return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
    }).join(' ') + ' Z';

  return (
    <View style={[styles.plate, { width, height }]}>
      <Svg width={width} height={height}>
        <Path d={path} fill="rgba(0,178,255,0.14)" stroke={colors.accent} strokeWidth={1.5} />
        {DISTRICTS.map(district => {
          const [x, y] = toXY(district.at[0], district.at[1]);
          return (
            <Circle
              key={district.name}
              cx={x}
              cy={y}
              r={3 + district.weight * 3}
              fill={colors.accent}
            />
          );
        })}
      </Svg>

      {DISTRICTS.filter(d => d.weight >= 0.6).map(district => {
        const [x, y] = toXY(district.at[0], district.at[1]);
        return (
          <Text key={district.name} style={[styles.label, { left: x + 12, top: y - 9 }]}>
            {district.name}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    color: 'rgba(160,225,255,0.9)',
    fontFamily: fonts.ui,
    fontSize: 13,
  },
});
