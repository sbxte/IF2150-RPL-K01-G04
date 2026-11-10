import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ajukanPertanyaan } from '@/api';
import { AppBar, AreaTeks, Banner, Teks, Tombol } from '@/components';
import { jarak, warna } from '@/theme';

/** I-10-04: character counter limit. */
const BATAS_KARAKTER = 500;

/**
 * I-10 Form Pengajuan Pertanyaan (`FAQView`), UC-12.
 * The question is stored by the Administrator for follow-up (Q-040).
 */
export default function Pertanyaan() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [isi, setIsi] = useState('');
  const [memuat, setMemuat] = useState(false);
  // I-10-06 / I-10-07 banners; only one shows at a time.
  const [sukses, setSukses] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  // Algo-026 `validasiInput`: not empty, not just spaces.
  const valid = isi.trim().length > 0;

  // `FAQController.kirimPertanyaan(isi)` -> POST /api/questions.
  const kirim = async () => {
    setSukses(false);
    setGalat(null);
    setMemuat(true);
    try {
      await ajukanPertanyaan(isi.trim());
      setSukses(true); // I-10-06
      setIsi('');
    } catch {
      // UC-12 alternative scenario 1: not saved, try again.
      setGalat('Pertanyaan gagal disimpan. Silakan coba lagi.');
    } finally {
      setMemuat(false);
    }
  };

  return (
    <View style={styles.layar}>
      <AppBar judul="Ajukan Pertanyaan" onKembali={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.fleksibel}
        keyboardVerticalOffset={top}
      >
        <ScrollView contentContainerStyle={styles.isi}>
          {/* I-10-02 */}
          <Teks warna="teksSekunder">
            Pertanyaanmu akan dikirim ke Administrator Sehati untuk dijawab. Jawaban atas pertanyaan yang sering
            diajukan akan ditambahkan ke FAQ.
          </Teks>

          {/* I-10-03, I-10-04 */}
          <AreaTeks
            label="Pertanyaan"
            placeholder="Tulis pertanyaanmu di sini…"
            value={isi}
            onChangeText={(teks) => {
              setSukses(false);
              setGalat(null);
              setIsi(teks.slice(0, BATAS_KARAKTER));
            }}
            maxLength={BATAS_KARAKTER}
          />
          <Teks gaya="keterangan" warna="teksSekunder" style={styles.penghitung}>
            {isi.length}/{BATAS_KARAKTER} karakter
          </Teks>

          {sukses && (
            <Banner jenis="sukses">Pertanyaan berhasil dikirim. Terima kasih!</Banner>
          )}
          {galat && <Banner jenis="galat">{galat}</Banner>}

          {/* I-10-05 */}
          <Tombol
            judul="Kirim Pertanyaan"
            onPress={() => void kirim()}
            disabled={!valid}
            memuat={memuat}
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
  penghitung: { textAlign: 'right', marginTop: -jarak.xs },
});
