import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tambahFaq, ubahFaq } from '@/api';
import { AppBar, AreaTeks, Banner, IsianTeks, Tombol } from '@/components';
import { jarak, warna } from '@/theme';

/**
 * I-13-05 Formulir FAQ (`FAQView`), UC-07, as its own view (M9 B.1 no. 11).
 *
 * "Tambah FAQ" opens it blank; the pencil icon on I-13 opens it with `idFaq`
 * and the current text. Saving returns to the list, which reloads on focus.
 */
export default function FormulirFaq() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const {
    idFaq,
    pertanyaan: pertanyaanAwal,
    jawaban: jawabanAwal,
  } = useLocalSearchParams<{ idFaq?: string; pertanyaan?: string; jawaban?: string }>();

  const [pertanyaan, setPertanyaan] = useState(pertanyaanAwal ?? '');
  const [jawaban, setJawaban] = useState(jawabanAwal ?? '');
  const [menyimpan, setMenyimpan] = useState(false);
  // I-13-07: shown when saving fails (UC-07 alternative scenario 1).
  const [galat, setGalat] = useState<string | null>(null);

  // Algo-026 `validasiInput` for the two fields.
  const valid = pertanyaan.trim().length > 0 && jawaban.trim().length > 0;

  // `FAQController.tambahFAQ` (Q-035) or `FAQController.ubahFAQ` (Q-036).
  const simpan = async () => {
    setGalat(null);
    setMenyimpan(true);
    try {
      const data = { pertanyaan: pertanyaan.trim(), jawaban: jawaban.trim() };
      if (idFaq) await ubahFaq(idFaq, data);
      else await tambahFaq(data);
      router.back();
    } catch {
      // UC-07 alternative scenario 1: not saved, try again.
      setGalat('FAQ gagal disimpan. Silakan coba lagi.');
    } finally {
      setMenyimpan(false);
    }
  };

  return (
    <View style={styles.layar}>
      <AppBar
        judul={idFaq ? 'Ubah FAQ' : 'Tambah FAQ'}
        onKembali={() => router.back()}
        varian="gelap"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.fleksibel}
        keyboardVerticalOffset={top}
      >
        <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
          {/* I-13-07 */}
          {galat && <Banner jenis="galat">{galat}</Banner>}

          {/* I-13-05 */}
          <IsianTeks
            label="Pertanyaan"
            placeholder="Tulis pertanyaan…"
            value={pertanyaan}
            onChangeText={(teks) => {
              setGalat(null);
              setPertanyaan(teks);
            }}
          />
          <AreaTeks
            label="Jawaban"
            placeholder="Tulis jawaban…"
            value={jawaban}
            onChangeText={(teks) => {
              setGalat(null);
              setJawaban(teks);
            }}
          />

          {/* I-13-06 */}
          <Tombol
            judul="Simpan FAQ"
            onPress={() => void simpan()}
            disabled={!valid}
            memuat={menyimpan}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  fleksibel: { flex: 1 },
  isi: { paddingHorizontal: jarak.md, paddingVertical: jarak.md, gap: jarak.sm },
});
