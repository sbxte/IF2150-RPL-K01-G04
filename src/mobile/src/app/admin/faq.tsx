import { useFocusEffect, useRouter } from 'expo-router';
import Pencil from 'lucide-react-native/icons/pencil';
import Trash from 'lucide-react-native/icons/trash';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ambilFaq, hapusFaq, tambahFaq, ubahFaq, type Faq } from '@/api';
import { AppBar, AreaTeks, Banner, IsianTeks, Teks, Tombol } from '@/components';
import { jarak, sudut, ukuran, warna } from '@/theme';

/** Icon button on an FAQ card (I-13-03 ubah, I-13-04 hapus). */
function TombolIkon({
  ikon: Ikon,
  label,
  onPress,
}: {
  ikon: typeof Pencil;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={jarak.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.ikon, pressed && { opacity: 0.6 }]}
    >
      <Ikon size={20} color={warna.merah} />
    </Pressable>
  );
}

/**
 * I-13 Kelola FAQ (`FAQView`), UC-07.
 *
 * The list reloads on focus and after every change; the form at the bottom adds
 * a new FAQ, or edits the one whose pencil icon was tapped (I-13-05).
 */
export default function KelolaFaq() {
  const router = useRouter();
  const [daftar, setDaftar] = useState<Faq[] | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galatMuat, setGalatMuat] = useState<string | null>(null);
  // The FAQ being edited, or null when the form adds a new one.
  const [diedit, setDiedit] = useState<Faq | null>(null);
  const [pertanyaan, setPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const [menghapus, setMenghapus] = useState<string | null>(null);
  // I-13-07: shown when add, edit, or delete fails (UC-07 alternative scenario 1).
  const [galatSimpan, setGalatSimpan] = useState<string | null>(null);
  const permintaanTerakhir = useRef(0);

  // `FAQController.tampilkanFAQ()` -> GET /api/faq, again each time the screen
  // gains focus. `tampilkanMemuat` is false for focus reloads (the state already
  // shows the data, or the initial "memuat").
  const muat = useCallback(async (tampilkanMemuat: boolean) => {
    const ke = ++permintaanTerakhir.current;
    if (tampilkanMemuat) {
      setMemuat(true);
      setGalatMuat(null);
    }
    try {
      const hasil = await ambilFaq();
      if (ke === permintaanTerakhir.current) {
        setDaftar(hasil);
        setMemuat(false);
      }
    } catch {
      if (ke !== permintaanTerakhir.current) return;
      setDaftar(null);
      setGalatMuat('FAQ gagal dimuat. Periksa koneksi internet, lalu coba lagi.');
      setMemuat(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void muat(false);
      // Ignore a request still in flight when the screen loses focus or unmounts.
      return () => {
        permintaanTerakhir.current++;
      };
    }, [muat]),
  );

  const kosongkanForm = () => {
    setDiedit(null);
    setPertanyaan('');
    setJawaban('');
  };

  // I-13-03: fills the form with the chosen FAQ.
  const mulaiUbah = (faq: Faq) => {
    setDiedit(faq);
    setPertanyaan(faq.pertanyaan);
    setJawaban(faq.jawaban);
    setGalatSimpan(null);
  };

  // Algo-026 `validasiInput` for the two form fields.
  const valid = pertanyaan.trim().length > 0 && jawaban.trim().length > 0;

  // `FAQController.tambahFAQ` (Q-035) or `FAQController.ubahFAQ` (Q-036).
  const simpan = async () => {
    setGalatSimpan(null);
    setMenyimpan(true);
    try {
      const data = { pertanyaan: pertanyaan.trim(), jawaban: jawaban.trim() };
      if (diedit) await ubahFaq(diedit.idFaq, data);
      else await tambahFaq(data);
      kosongkanForm();
      await muat(true);
    } catch {
      // UC-07 alternative scenario 1: not saved, try again.
      setGalatSimpan('FAQ gagal disimpan. Silakan coba lagi.');
    } finally {
      setMenyimpan(false);
    }
  };

  // I-13-04: confirm, then `FAQController.hapusFAQ` (Q-037).
  const konfirmasiHapus = (faq: Faq) => {
    Alert.alert('Hapus FAQ', `"${faq.pertanyaan}" akan dihapus permanen.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => void hapus(faq),
      },
    ]);
  };

  const hapus = async (faq: Faq) => {
    setGalatSimpan(null);
    setMenghapus(faq.idFaq);
    try {
      await hapusFaq(faq.idFaq);
      if (diedit?.idFaq === faq.idFaq) kosongkanForm();
      await muat(true);
    } catch {
      setGalatSimpan('FAQ gagal disimpan. Silakan coba lagi.');
    } finally {
      setMenghapus(null);
    }
  };

  return (
    <View style={styles.layar}>
      <AppBar judul="Kelola FAQ" onKembali={() => router.back()} varian="gelap" />

      <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
        {/* I-13-07 */}
        {galatSimpan && <Banner jenis="galat">{galatSimpan}</Banner>}

        {/* I-13-02 */}
        <Teks gaya="label">Daftar FAQ</Teks>
        {memuat && <ActivityIndicator size="large" color={warna.merah} style={styles.memuat} />}
        {galatMuat && (
          <View style={styles.tengah}>
            <Teks warna="teksSekunder">{galatMuat}</Teks>
            <Tombol judul="Coba Lagi" varian="sekunder" onPress={() => void muat(true)} />
          </View>
        )}
        {!memuat && !galatMuat && daftar !== null && daftar.length === 0 && (
          <Teks warna="teksSekunder">Belum ada FAQ. Tambahkan yang pertama di bawah.</Teks>
        )}
        {!memuat &&
          !galatMuat &&
          daftar?.map((faq) => (
            <View key={faq.idFaq} style={styles.kartu}>
              <View style={styles.kepala}>
                <View style={styles.teksKartu}>
                  <Teks gaya="label">{faq.pertanyaan}</Teks>
                  <Teks warna="teksSekunder" numberOfLines={2}>
                    {faq.jawaban}
                  </Teks>
                </View>
                {menghapus !== faq.idFaq && (
                  <View style={styles.aksi}>
                    <TombolIkon ikon={Pencil} label={`Ubah ${faq.pertanyaan}`} onPress={() => mulaiUbah(faq)} />
                    <TombolIkon
                      ikon={Trash}
                      label={`Hapus ${faq.pertanyaan}`}
                      onPress={() => konfirmasiHapus(faq)}
                    />
                  </View>
                )}
                {menghapus === faq.idFaq && (
                  <ActivityIndicator size="small" color={warna.merah} style={styles.aksiMemuat} />
                )}
              </View>
            </View>
          ))}

        {/* I-13-05 */}
        <View style={styles.formulir}>
          <Teks gaya="label">{diedit ? 'Ubah FAQ' : 'Tambah FAQ'}</Teks>
          <IsianTeks
            label="Pertanyaan"
            placeholder="Tulis pertanyaan…"
            value={pertanyaan}
            onChangeText={(teks) => {
              setGalatSimpan(null);
              setPertanyaan(teks);
            }}
          />
          <AreaTeks
            label="Jawaban"
            placeholder="Tulis jawaban…"
            value={jawaban}
            onChangeText={(teks) => {
              setGalatSimpan(null);
              setJawaban(teks);
            }}
          />
          <View style={styles.barisTombol}>
            {diedit && (
              <Tombol judul="Batal" varian="teks" onPress={kosongkanForm} disabled={menyimpan} />
            )}
            {/* I-13-06 */}
            <Tombol
              judul="Simpan FAQ"
              onPress={() => void simpan()}
              disabled={!valid}
              memuat={menyimpan}
              style={styles.tombolSimpan}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { paddingHorizontal: jarak.md, paddingVertical: jarak.md, gap: jarak.sm },
  memuat: { marginTop: jarak.xl },
  tengah: { alignItems: 'center', gap: jarak.sm },
  kartu: {
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
    padding: jarak.md,
  },
  kepala: { flexDirection: 'row', alignItems: 'flex-start', gap: jarak.sm },
  teksKartu: { flex: 1, gap: jarak.xxs },
  aksi: { flexDirection: 'row', gap: jarak.xs },
  aksiMemuat: { marginLeft: jarak.sm },
  formulir: {
    marginTop: jarak.md,
    padding: jarak.md,
    gap: jarak.sm,
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
  },
  barisTombol: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  tombolSimpan: { flex: 1 },
  ikon: {
    width: ukuran.tinggiKontrol / 2,
    height: ukuran.tinggiKontrol / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sudut.sm,
  },
});
