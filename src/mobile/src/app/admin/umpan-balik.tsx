import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  ambilUmpanBalik,
  tanggapiUmpanBalik,
  type StatusUmpanBalik,
  type UmpanBalikAdmin,
} from '@/api';
import { AppBar, AreaTeks, Banner, Lencana, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { jarak, sudut, warna } from '@/theme';

/** I-14-02: the three filter chips, in screen order. */
const FILTER: { kunci: StatusUmpanBalik | undefined; label: string }[] = [
  { kunci: undefined, label: 'Semua' },
  { kunci: 'belum', label: 'Belum ditanggapi' },
  { kunci: 'sudah', label: 'Ditanggapi' },
];

/** Initials for the avatar in I-14-03. */
function inisial(nama: string): string {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]?.toUpperCase() ?? '')
    .join('');
}

/** One feedback card with its inline response form (I-14-03 / I-14-04 / I-14-05). */
function KartuUmpanBalik({
  umpan,
  onTersimpan,
}: {
  umpan: UmpanBalikAdmin;
  onTersimpan: () => void;
}) {
  const [tanggapan, setTanggapan] = useState(umpan.tanggapan ?? '');
  const [menyimpan, setMenyimpan] = useState(false);
  const [galat, setGalat] = useState(false);

  /** I-14-05: `kirimTanggapan(tanggapan)` (Q-039). */
  const kirim = useCallback(async () => {
    setMenyimpan(true);
    setGalat(false);
    try {
      await tanggapiUmpanBalik(umpan.idUmpanBalik, tanggapan.trim());
      onTersimpan(); // the list reloads so the badge flips
    } catch {
      setGalat(true);
    } finally {
      setMenyimpan(false);
    }
  }, [tanggapan, umpan.idUmpanBalik, onTersimpan]);

  const dijawab = umpan.tanggapan !== null;

  return (
    <View style={styles.kartu}>
      <View style={styles.kepala}>
        <View style={styles.avatar}>
          <Teks gaya="label" warna="merah">
            {inisial(umpan.namaMahasiswa)}
          </Teks>
        </View>
        <Teks gaya="isiTebal" style={styles.nama}>
          {umpan.namaMahasiswa}
        </Teks>
        <Lencana
          label={dijawab ? 'Ditanggapi' : 'Belum ditanggapi'}
          jenis={dijawab ? 'sukses' : 'netral'}
        />
      </View>

      <Teks>{umpan.isi}</Teks>

      {galat && <Banner jenis="galat">Tanggapan gagal disimpan. Silakan coba lagi.</Banner>}

      <AreaTeks
        label="Tanggapan"
        value={tanggapan}
        onChangeText={setTanggapan}
        editable={!menyimpan}
      />
      <Tombol
        judul={dijawab ? 'Perbarui Tanggapan' : 'Kirim Tanggapan'}
        varian="sekunder"
        onPress={() => void kirim()}
        disabled={tanggapan.trim().length === 0 || menyimpan}
        memuat={menyimpan}
      />
    </View>
  );
}

/** I-14 Tanggapi Umpan Balik (`FeedbackView`, UC-09). */
export default function TanggapiUmpanBalik() {
  const router = useRouter();
  const [filter, setFilter] = useState<StatusUmpanBalik | undefined>(undefined);

  // Filtering server-side keeps the chip counts honest once pagination matters;
  // `ambil` must be stable, so the filter is baked into the closure.
  const ambil = useCallback(() => ambilUmpanBalik({ status: filter }), [filter]);
  const [daftar, muatUlang] = useMuatan(ambil);

  return (
    <View style={styles.layar}>
      <AppBar judul="Umpan Balik" varian="gelap" onKembali={() => router.back()} />

      {/* I-14-02 */}
      <View style={styles.chips}>
        {FILTER.map(({ kunci, label }) => {
          const aktif = filter === kunci;
          return (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: aktif }}
              onPress={() => setFilter(kunci)}
              style={({ pressed }) => [
                styles.chip,
                aktif ? styles.chipAktif : styles.chipNonaktif,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Teks gaya="label" warna={aktif ? 'inversi' : 'teksSekunder'}>
                {label}
              </Teks>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.isi}>
        {daftar.status === 'memuat' && (
          <ActivityIndicator color={warna.merah} accessibilityLabel="Memuat umpan balik" />
        )}
        {daftar.status === 'galat' && (
          <View style={styles.kartu}>
            <Teks warna="teksSekunder">{daftar.pesan}</Teks>
            <Tombol judul="Coba lagi" varian="teks" onPress={muatUlang} style={styles.tombolKiri} />
          </View>
        )}
        {daftar.status === 'siap' && daftar.data.length === 0 && (
          <Teks warna="teksSekunder">
            {filter ? 'Tidak ada umpan balik pada filter ini.' : 'Belum ada umpan balik.'}
          </Teks>
        )}
        {daftar.status === 'siap' &&
          daftar.data.map((u) => (
            <KartuUmpanBalik key={`${u.idUmpanBalik}-${u.tanggapan ?? ''}`} umpan={u} onTersimpan={muatUlang} />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  chips: { flexDirection: 'row', gap: jarak.xs, padding: jarak.md, paddingBottom: 0 },
  chip: { paddingHorizontal: jarak.sm, paddingVertical: jarak.xxs, borderRadius: sudut.penuh },
  chipAktif: { backgroundColor: warna.merah },
  chipNonaktif: { backgroundColor: warna.kartu, borderWidth: 1, borderColor: warna.garis },
  isi: { padding: jarak.md, gap: jarak.md, paddingBottom: jarak.xl },
  kartu: {
    backgroundColor: warna.kartu,
    borderRadius: sudut.md,
    padding: jarak.md,
    gap: jarak.xs,
    borderWidth: 1,
    borderColor: warna.garis,
  },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: jarak.xs },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: sudut.penuh,
    backgroundColor: warna.merahLembut,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nama: { flex: 1 },
  tombolKiri: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
