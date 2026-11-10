import { useRouter } from 'expo-router';
import Server from 'lucide-react-native/icons/server';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ambilStatusLayanan } from '@/api';
import { AppBar, Lencana, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { semuaBarisStatus, waktuCekTerakhir } from '@/lib/status';
import { formatRelatif } from '@/lib/waktu';
import { jarak, sudut, warna } from '@/theme';

/** I-15 Status Server (`ServerStatusController.tampilkanStatusServer`, Algo-020). */
export default function StatusServer() {
  const router = useRouter();
  const [status, muatUlang] = useMuatan(ambilStatusLayanan);

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
                // The cron probes every minute; an empty table is normal right after a deploy.
                return terakhir
                  ? `Pemeriksaan terakhir ${formatRelatif(terakhir)}. Diperiksa otomatis setiap menit.`
                  : 'Belum ada pemeriksaan. Pemeriksaan berjalan otomatis setiap menit setelah Worker aktif.';
              })()}
            </Teks>

            <Tombol judul="Muat ulang" varian="sekunder" onPress={muatUlang} />
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
