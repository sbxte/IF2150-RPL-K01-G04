import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import {
  ambilUmpanBalikSaya,
  kirimUmpanBalik,
  type UmpanBalikSaya as ItemUmpanBalik,
} from '@/api';
import { AppBar, AreaTeks, Banner, Lencana, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { jarak, sudut, warna } from '@/theme';

/** I-11-03 limit; the backend accepts any non-empty text, this is a UI guard. */
const MAKS_ISI = 500;

/** One past entry (I-11-06): the text, whether it was answered, and the answer. */
function KartuUmpanBalik({ umpan }: { umpan: ItemUmpanBalik }) {
  const dijawab = umpan.tanggapan !== null;
  return (
    <View style={styles.kartu}>
      <View style={styles.kepalaKartu}>
        <Teks gaya="label" style={styles.judulKartu}>
          Umpan balik
        </Teks>
        <Lencana
          label={dijawab ? 'Ditanggapi' : 'Belum ditanggapi'}
          jenis={dijawab ? 'sukses' : 'netral'}
        />
      </View>
      <Teks>{umpan.isi}</Teks>
      {dijawab && (
        <View style={styles.tanggapan}>
          <Teks gaya="label">Tanggapan Administrator</Teks>
          <Teks>{umpan.tanggapan}</Teks>
        </View>
      )}
    </View>
  );
}

/** I-11 Umpan Balik (`FeedbackView`, UC-08). */
export default function UmpanBalik() {
  const router = useRouter();
  const [daftar, muatUlang] = useMuatan(ambilUmpanBalikSaya);

  const [isi, setIsi] = useState('');
  const [mengirim, setMengirim] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [galat, setGalat] = useState(false);

  /** I-11-04: `kirimFeedback(isi)` (Q-038); the list reloads so the new row shows. */
  const kirim = useCallback(async () => {
    setMengirim(true);
    setSukses(false);
    setGalat(false);
    try {
      await kirimUmpanBalik(isi.trim());
      setIsi('');
      setSukses(true);
      muatUlang();
    } catch {
      setGalat(true); // I-11-05, UC-08 alternative scenario 1.
    } finally {
      setMengirim(false);
    }
  }, [isi, muatUlang]);

  const bisaKirim = isi.trim().length > 0 && !mengirim;

  return (
    <View style={styles.layar}>
      <AppBar judul="Umpan Balik" onKembali={() => router.back()} />
      <ScrollView
        contentContainerStyle={[styles.isi, { paddingBottom: jarak.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* I-11-02 */}
        <Teks warna="teksSekunder">
          Umpan balikmu dibaca dan ditanggapi oleh Administrator.
        </Teks>

        {/* I-11-05 */}
        {galat && <Banner jenis="galat">Umpan balik gagal disimpan. Silakan coba lagi.</Banner>}
        {sukses && <Banner jenis="sukses">Umpan balik terkirim. Terima kasih!</Banner>}

        {/* I-11-03 / I-11-04 */}
        <AreaTeks
          label="Umpan balik"
          value={isi}
          onChangeText={setIsi}
          maxLength={MAKS_ISI}
          keterangan={`${isi.length}/${MAKS_ISI}`}
          editable={!mengirim}
        />
        <Tombol
          judul="Kirim Umpan Balik"
          onPress={() => void kirim()}
          disabled={!bisaKirim}
          memuat={mengirim}
        />

        {/* I-11-06 */}
        <Teks gaya="isiTebal" style={styles.judulDaftar}>
          Umpan balik sebelumnya
        </Teks>

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
          <Teks warna="teksSekunder">Belum ada umpan balik yang kamu kirim.</Teks>
        )}
        {daftar.status === 'siap' && daftar.data.map((u) => <KartuUmpanBalik key={u.idUmpanBalik} umpan={u} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: jarak.md, gap: jarak.md },
  kartu: {
    backgroundColor: warna.kartu,
    borderRadius: sudut.md,
    padding: jarak.md,
    gap: jarak.xs,
    borderWidth: 1,
    borderColor: warna.garis,
  },
  kepalaKartu: { flexDirection: 'row', alignItems: 'center', gap: jarak.xs },
  judulKartu: { flex: 1 },
  tanggapan: {
    borderTopWidth: 1,
    borderTopColor: warna.garis,
    paddingTop: jarak.xs,
    marginTop: jarak.xs,
    gap: jarak.xxs,
  },
  judulDaftar: { marginTop: jarak.sm },
  tombolKiri: { alignSelf: 'flex-start', paddingHorizontal: 0 },
});
