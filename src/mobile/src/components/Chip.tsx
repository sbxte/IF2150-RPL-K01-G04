import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { jarak, sudut, ukuran, warna } from '@/theme';

import { Teks } from './Teks';

type Props = {
  label: string;
  /** Filled red when true; outlined otherwise. */
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Pill-shaped filter choice, e.g. the FAQ sort order on I-13 (M9 B.1 no. 12). */
export function Chip({ label, selected = false, onPress, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={jarak.xxs}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wadah,
        selected ? styles.aktif : styles.nonaktif,
        pressed && styles.ditekan,
        style,
      ]}
    >
      <Teks gaya="keterangan" warna={selected ? 'inversi' : 'merah'}>
        {label}
      </Teks>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wadah: {
    paddingHorizontal: jarak.sm,
    paddingVertical: jarak.xs,
    borderWidth: ukuran.garis,
    borderRadius: sudut.penuh,
  },
  aktif: { backgroundColor: warna.merah, borderColor: warna.merah },
  nonaktif: { backgroundColor: warna.kartu, borderColor: warna.garis },
  ditekan: { opacity: 0.7 },
});
