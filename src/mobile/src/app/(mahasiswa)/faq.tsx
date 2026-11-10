import { useRouter } from 'expo-router';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import CircleQuestionMark from 'lucide-react-native/icons/circle-question-mark';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ambilFaq, type Faq as ItemFaq } from '@/api';
import { IsianTeks, Teks, Tombol } from '@/components';
import { jarak, sudut, ukuran, warna } from '@/theme';

/** Jeda pencarian setelah pengguna berhenti mengetik. */
const JEDA_CARI_MS = 300;

/** I-09-04: one collapsible FAQ card. */
function KartuFaq({ faq, terbuka, onTekan }: { faq: ItemFaq; terbuka: boolean; onTekan: () => void }) {
  return (
    <View style={styles.kartu}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={faq.pertanyaan}
        accessibilityState={{ expanded: terbuka }}
        onPress={onTekan}
        style={({ pressed }) => [styles.kepala, pressed && { opacity: 0.7 }]}
      >
        <Teks gaya="label" style={styles.pertanyaan}>
          {faq.pertanyaan}
        </Teks>
        <ChevronDown
          size={20}
          color={warna.teksSekunder}
          style={terbuka && styles.chevronTerbuka}
        />
      </Pressable>
      {terbuka && <Teks style={styles.jawaban}>{faq.jawaban}</Teks>}
    </View>
  );
}

/**
 * I-09 FAQ dan Pencarian (`FAQView`), UC-06.
 *
 * Search is debounced (300 ms) and only the latest request may update the
 * list, so a slow earlier request cannot overwrite the newest results.
 */
export default function Faq() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [kataKunci, setKataKunci] = useState('');
  const [daftar, setDaftar] = useState<ItemFaq[] | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [terbuka, setTerbuka] = useState<string | null>(null);
  // The request whose response is still allowed to update the screen.
  const permintaanTerakhir = useRef(0);

  // `FAQView.cariFAQ(kataKunci)` -> GET /api/faq?q=... (Algo-017).
  const muat = useCallback(async (kunci: string) => {
    const ke = ++permintaanTerakhir.current;
    setMemuat(true);
    setGalat(null);
    try {
      const hasil = await ambilFaq(kunci);
      if (ke === permintaanTerakhir.current) {
        setDaftar(hasil);
        setMemuat(false);
      }
    } catch {
      if (ke !== permintaanTerakhir.current) return;
      setDaftar(null);
      setGalat('FAQ gagal dimuat. Periksa koneksi internet, lalu coba lagi.');
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void muat(kataKunci), kataKunci ? JEDA_CARI_MS : 0);
    return () => clearTimeout(timer);
  }, [kataKunci, muat]);

  // I-09-05: highlighted when a search has no results (UC-06 alternative scenario 1).
  const tanpaHasil = !memuat && !galat && daftar !== null && daftar.length === 0 && kataKunci.trim() !== '';

  return (
    <View style={[styles.layar, { paddingTop: top }]}>
      <View style={styles.appbar}>
        <Teks gaya="h3" accessibilityRole="header">
          FAQ
        </Teks>
      </View>

      <ScrollView
        style={styles.gulir}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.isi}
      >
        <IsianTeks
          label="Cari pertanyaan"
          placeholder="Ketik kata kunci…"
          value={kataKunci}
          onChangeText={setKataKunci}
          autoCorrect={false}
        />

        {memuat && <ActivityIndicator size="large" color={warna.merah} style={styles.memuat} />}

        {galat && (
          <View style={styles.tengah}>
            <Teks warna="teksSekunder" style={styles.rataTengah}>
              {galat}
            </Teks>
            <Tombol judul="Coba Lagi" varian="sekunder" onPress={() => void muat(kataKunci)} />
          </View>
        )}

        {!memuat && !galat && daftar !== null && (
          <>
            <Teks gaya="keterangan" warna="teksSekunder">
              {daftar.length} pertanyaan ditemukan
            </Teks>
            {daftar.map((faq) => (
              <KartuFaq
                key={faq.idFaq}
                faq={faq}
                terbuka={terbuka === faq.idFaq}
                onTekan={() => setTerbuka(terbuka === faq.idFaq ? null : faq.idFaq)}
              />
            ))}
          </>
        )}

        {!memuat && !galat && daftar !== null && (
          <View style={[styles.tawaran, tanpaHasil && styles.tawaranDisorot]}>
            <CircleQuestionMark size={24} color={warna.merah} />
            <Teks gaya="label">Tidak menemukan jawaban?</Teks>
            <Teks warna="teksSekunder" style={styles.rataTengah}>
              Ajukan pertanyaanmu; Administrator akan menjawabnya.
            </Teks>
            <Tombol
              judul="Ajukan Pertanyaan"
              onPress={() => router.push('/pertanyaan')}
              style={styles.tombolAjukan}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  appbar: {
    alignItems: 'center',
    paddingHorizontal: jarak.md,
    paddingTop: jarak.xs,
    paddingBottom: jarak.sm,
    backgroundColor: warna.kartu,
    borderBottomColor: warna.garis,
    borderBottomWidth: ukuran.garis,
  },
  gulir: { flex: 1 },
  isi: { paddingHorizontal: jarak.md, paddingVertical: jarak.md, gap: jarak.sm },
  memuat: { marginTop: jarak.xl },
  tengah: { alignItems: 'center', gap: jarak.sm, marginTop: jarak.xs },
  rataTengah: { textAlign: 'center' },
  kartu: {
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
    paddingHorizontal: jarak.md,
    paddingVertical: jarak.sm,
  },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: jarak.sm },
  pertanyaan: { flex: 1 },
  chevronTerbuka: { transform: [{ rotate: '180deg' }] },
  jawaban: { marginTop: jarak.xs },
  tawaran: {
    alignItems: 'center',
    gap: jarak.xs,
    padding: jarak.lg,
    marginTop: jarak.xs,
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
  },
  tawaranDisorot: {
    backgroundColor: warna.merahLembut,
    borderColor: warna.merah,
  },
  tombolAjukan: { alignSelf: 'stretch' },
});
