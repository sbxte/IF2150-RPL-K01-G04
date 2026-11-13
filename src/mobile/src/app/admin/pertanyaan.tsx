import { useFocusEffect, useRouter } from 'expo-router';
import Trash from 'lucide-react-native/icons/trash';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ambilPertanyaan, hapusPertanyaan, tambahFaq, type Pertanyaan } from '@/api';
import { AppBar, AreaTeks, Banner, Teks, Tombol } from '@/components';
import { formatRelatif } from '@/lib/waktu';
import { jarak, sudut, ukuran, warna } from '@/theme';

/** Delete button on a question card. */
function TombolHapus({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={jarak.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.ikon, pressed && { opacity: 0.6 }]}
    >
      <Trash size={20} color={warna.merah} />
    </Pressable>
  );
}

/**
 * Questions submitted through I-10, for the administrator (M9 B.1 no. 9).
 *
 * A separate screen outside I-01..I-15 so I-13 stays focused on FAQ management.
 * Answering happens inline: saving creates the FAQ (Q-035) and then deletes the
 * submission (Q-040's row), so the question leaves the queue.
 */
export default function PertanyaanMasuk() {
  const router = useRouter();
  const [daftar, setDaftar] = useState<Pertanyaan[] | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galatMuat, setGalatMuat] = useState<string | null>(null);
  const [galatAksi, setGalatAksi] = useState<string | null>(null);
  const [menghapus, setMenghapus] = useState<string | null>(null);
  // Question whose answer form is open, and the answer being written.
  const [dijawab, setDijawab] = useState<Pertanyaan | null>(null);
  const [jawaban, setJawaban] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);
  const permintaanTerakhir = useRef(0);

  const muat = useCallback(async (tampilkanMemuat: boolean) => {
    const ke = ++permintaanTerakhir.current;
    if (tampilkanMemuat) {
      setMemuat(true);
      setGalatMuat(null);
    }
    try {
      const hasil = await ambilPertanyaan();
      if (ke === permintaanTerakhir.current) {
        setDaftar(hasil);
        setMemuat(false);
      }
    } catch {
      if (ke !== permintaanTerakhir.current) return;
      setDaftar(null);
      setGalatMuat('Pertanyaan masuk gagal dimuat. Periksa koneksi internet, lalu coba lagi.');
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

  const mulaiJawab = (p: Pertanyaan) => {
    setDijawab(p);
    setJawaban('');
    setGalatAksi(null);
  };

  const batalJawab = () => {
    setDijawab(null);
    setJawaban('');
  };

  // B.1 no. 9: the answer becomes an FAQ, then the submission is consumed.
  const simpanJawaban = async () => {
    const sumber = dijawab;
    if (menyimpan || !sumber || jawaban.trim().length === 0) return;

    setGalatAksi(null);
    setMenyimpan(true);
    try {
      await tambahFaq({ pertanyaan: sumber.isiPertanyaan, jawaban: jawaban.trim() });
      try {
        await hapusPertanyaan(sumber.idPertanyaan);
      } catch {
        // Keep the FAQ saved; the question stays so it can be deleted manually.
        setGalatAksi(
          'FAQ tersimpan, tetapi pertanyaan gagal dihapus. Hapus manual lewat ikon tong sampah.',
        );
      }
      batalJawab();
      await muat(false);
    } catch {
      setGalatAksi('FAQ gagal disimpan. Silakan coba lagi.');
    } finally {
      setMenyimpan(false);
    }
  };

  const konfirmasiHapus = (p: Pertanyaan) => {
    Alert.alert('Hapus pertanyaan', `Pertanyaan dari ${p.nama} akan dihapus permanen.`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => void hapus(p),
      },
    ]);
  };

  const hapus = async (p: Pertanyaan) => {
    if (menyimpan) return;
    setGalatAksi(null);
    setMenghapus(p.idPertanyaan);
    try {
      await hapusPertanyaan(p.idPertanyaan);
      if (dijawab?.idPertanyaan === p.idPertanyaan) batalJawab();
      await muat(false);
    } catch {
      setGalatAksi('Pertanyaan gagal dihapus. Silakan coba lagi.');
    } finally {
      setMenghapus(null);
    }
  };

  return (
    <View style={styles.layar}>
      <AppBar judul="Pertanyaan Masuk" onKembali={() => router.back()} varian="gelap" />

      <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
        {galatAksi && <Banner jenis="galat">{galatAksi}</Banner>}
        <Teks warna="teksSekunder">
          Pertanyaan yang dikirim Mahasiswa lewat formulir pengajuan akan muncul di sini.
        </Teks>

        {memuat && <ActivityIndicator size="large" color={warna.merah} style={styles.memuat} />}
        {galatMuat && (
          <View style={styles.tengah}>
            <Teks warna="teksSekunder">{galatMuat}</Teks>
            <Tombol judul="Coba Lagi" varian="sekunder" onPress={() => void muat(true)} />
          </View>
        )}
        {!memuat && !galatMuat && daftar !== null && daftar.length === 0 && (
          <Teks warna="teksSekunder">Belum ada pertanyaan masuk.</Teks>
        )}
        {!memuat &&
          !galatMuat &&
          daftar?.map((p) => {
            const sedangDijawab = dijawab?.idPertanyaan === p.idPertanyaan;
            return (
              <View key={p.idPertanyaan} style={styles.kartu}>
                <View style={styles.kepala}>
                  <View style={styles.teksKartu}>
                    <Teks gaya="label">{p.isiPertanyaan}</Teks>
                    <Teks gaya="keterangan" warna="teksSekunder">
                      {p.nama}
                      {p.waktuPengajuan ? ` · ${formatRelatif(p.waktuPengajuan)}` : ''}
                    </Teks>
                  </View>
                  {menghapus !== p.idPertanyaan && (
                    <TombolHapus
                      label={`Hapus pertanyaan ${p.nama}`}
                      onPress={() => konfirmasiHapus(p)}
                    />
                  )}
                  {menghapus === p.idPertanyaan && (
                    <ActivityIndicator size="small" color={warna.merah} style={styles.aksiMemuat} />
                  )}
                </View>

                {sedangDijawab ? (
                  <View style={styles.formulir}>
                    <AreaTeks
                      label="Jawaban"
                      placeholder="Tulis jawaban yang akan menjadi FAQ…"
                      value={jawaban}
                      onChangeText={(teks) => {
                        setGalatAksi(null);
                        setJawaban(teks);
                      }}
                    />
                    <View style={styles.barisTombol}>
                      <Tombol judul="Batal" varian="teks" onPress={batalJawab} disabled={menyimpan} />
                      <Tombol
                        judul="Simpan & Hapus Pertanyaan"
                        onPress={() => void simpanJawaban()}
                        disabled={jawaban.trim().length === 0}
                        memuat={menyimpan}
                        style={styles.tombolSimpan}
                      />
                    </View>
                  </View>
                ) : (
                  <Tombol
                    judul="Jawab"
                    varian="sekunder"
                    onPress={() => mulaiJawab(p)}
                    style={styles.tombol}
                  />
                )}
              </View>
            );
          })}
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
  aksiMemuat: { marginLeft: jarak.sm },
  tombol: { marginTop: jarak.sm },
  formulir: { marginTop: jarak.sm, gap: jarak.sm },
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
