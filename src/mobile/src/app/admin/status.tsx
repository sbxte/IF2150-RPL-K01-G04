import { useRouter } from 'expo-router';
import Server from 'lucide-react-native/icons/server';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ambilStatusLayanan, periksaStatusSekarang } from '@/api';
import { AppBar, Lencana, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { semuaBarisStatus, waktuCekTerakhir } from '@/lib/status';
import { formatRelatif } from '@/lib/waktu';
import { jarak, sudut, warna } from '@/theme';

/** I-15 Status Server (`ServerStatusController.tampilkanStatusServer`, Algo-020). */
export default function StatusServer() {
  const router = useRouter();
  const [status, muatUlang] = useMuatan(ambilStatusLayanan);
  const [memeriksa, setMemeriksa] = useState(false);
  // `true` when the backend reused a check newer than its freshness window.
  const [dilewati, setDilewati] = useState(false);

  /** I-15: probe on demand instead of waiting up to 5 minutes for the cron. */
  const periksa = async () => {
    setMemeriksa(true);
    setDilewati(false);
    try {
      const { diperiksa } = await periksaStatusSekarang();
      setDilewati(!diperiksa);
      muatUlang(); // reread so the table shows what the probe wrote
    } catch {
      // The banner state comes from `useMuatan` on the next load.
      muatUlang();
    } finally {
      setMemeriksa(false);
    }
  };

  return (
    <View style={styles.layar}>
      <AppBar judul="Status Server" varian="gelap" onKembali={() => router.back()} />

      <ScrollView contentContainerStyle={styles.isi}>
        {status.status === 'memuat' && (
          <ActivityIndicator color={warna.merah} accessibilityLabel="Memuat status layanan" />
        )}

        {status.status === 'galat' && (
          <View style={styles.kartu}>
            <Teks gaya="isiTebal">Gagal memuat status</Teks>
            <Teks>{status.pesan}</Teks>
            <Tombol judul="Coba lagi" varian="teks" onPress={muatUlang} style={styles.tombolKiri} />
          </View>
        )}

        {status.status === 'siap' && (
          <>
            {semuaBarisStatus(status.data).map((baris) => (
              <View key={baris.jenis} style={styles.kartu}>
                <View style={styles.kepala}>
                  <Server size={18} color={warna.teksSekunder} />
                  <Teks gaya="isiTebal" style={styles.judul}>
                    {baris.judul}
                  </Teks>
                  <Lencana label={baris.label} jenis={baris.warna} />
                </View>
                <Teks gaya="keterangan">{baris.keterangan}</Teks>
                <Teks gaya="keterangan">{baris.waktu}</Teks>
              </View>
            ))}

            <Teks gaya="keterangan" style={styles.ringkasan}>
              {(() => {
                const terakhir = waktuCekTerakhir(status.data);
                // The cron probes every 5 minutes; an empty table is normal right after a deploy.
                return terakhir
                  ? `Pemeriksaan terakhir ${formatRelatif(terakhir)}. Diperiksa otomatis setiap 5 menit.`
                  : 'Belum ada pemeriksaan. Pemeriksaan berjalan otomatis setiap 5 menit setelah Worker aktif.';
              })()}
            </Teks>

            {/* I-15 "Periksa Sekarang": asks the backend to probe now (Algo-021). */}
            <Tombol
              judul="Periksa Sekarang"
              varian="sekunder"
              onPress={() => void periksa()}
              memuat={memeriksa}
            />
            {dilewati && (
              <Teks gaya="keterangan" style={styles.ringkasan}>
                Pemeriksaan sebelumnya masih baru, jadi tidak diperiksa ulang.
              </Teks>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
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
  judul: { flex: 1 },
  ringkasan: { textAlign: 'center' },
  tombolKiri: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
