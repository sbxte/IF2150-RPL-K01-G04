import DateTimePicker from '@react-native-community/datetimepicker';
import Dumbbell from 'lucide-react-native/icons/dumbbell';
import Moon from 'lucide-react-native/icons/moon';
import Utensils from 'lucide-react-native/icons/utensils';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import {
  ambilPengingat,
  hapusPengingat,
  simpanPengingat,
  type JenisPengingat,
  type Pengingat as ItemPengingat,
} from '@/api';
import { AppBar, Banner, Teks, Tombol } from '@/components';
import { useMuatan } from '@/lib/muatan';
import { formatWaktuHarian } from '@/lib/waktu';
import { jarak, sudut, ukuran, warna } from '@/theme';

/** I-05-03: one card per reminder type, with the DPPL's default time (I-05-04). */
const KARTU: readonly {
  jenis: JenisPengingat;
  judul: string;
  keterangan: string;
  ikon: typeof Utensils;
  bawaan: string;
}[] = [
  {
    jenis: 'makan',
    judul: 'Makan',
    keterangan: 'Pengingat untuk makan teratur setiap hari.',
    ikon: Utensils,
    bawaan: '12:00',
  },
  {
    jenis: 'tidur',
    judul: 'Tidur',
    keterangan: 'Pengingat untuk beristirahat cukup setiap malam.',
    ikon: Moon,
    bawaan: '22:00',
  },
  {
    jenis: 'olahraga',
    judul: 'Olahraga',
    keterangan: 'Pengingat untuk bergerak atau berolahraga.',
    ikon: Dumbbell,
    bawaan: '17:00',
  },
];

type Setelan = Record<JenisPengingat, { waktu: string; aktif: boolean }>;

/** "HH:MM" -> a Date at that local time, for opening the picker. */
function keTanggal(hhmm: string): Date {
  const [jam, menit] = hhmm.split(':').map(Number);
  const tanggal = new Date();
  tanggal.setHours(jam, menit, 0, 0);
  return tanggal;
}

/** A picker Date back to "HH:MM" for storage. */
function jamMenit(tanggal: Date): string {
  const dua = (n: number) => String(n).padStart(2, '0');
  return `${dua(tanggal.getHours())}:${dua(tanggal.getMinutes())}`;
}

/** Saved reminders -> form state; a `null` waktu means that reminder is off. */
function setelanAwal(data: ItemPengingat[]): Setelan {
  const tersimpan = new Map(data.map((p) => [p.jenis, p.waktu]));
  return Object.fromEntries(
    KARTU.map(({ jenis, bawaan }) => {
      const waktu = tersimpan.get(jenis);
      return [jenis, { waktu: waktu ?? bawaan, aktif: typeof waktu === 'string' }];
    }),
  ) as Setelan;
}

/**
 * The form half of I-05. Mounted with a key derived from the saved reminders so
 * it re-initializes whenever they change on the server, while keeping the
 * user's in-progress edits otherwise.
 */
function Formulir({ awal }: { awal: ItemPengingat[] }) {
  const [setelan, setSetelan] = useState<Setelan>(() => setelanAwal(awal));
  const [picker, setPicker] = useState<JenisPengingat | null>(null);
  /** The jenis being saved, or `semua` for "Simpan Setelan". */
  const [menyimpan, setMenyimpan] = useState<JenisPengingat | 'semua' | null>(null);
  // I-05-06 success / I-05-07 error; only one shows at a time.
  const [sukses, setSukses] = useState<string | null>(null);
  const [galat, setGalat] = useState(false);

  const ubahWaktu = (jenis: JenisPengingat, waktu: string) => {
    setSetelan((lama) => ({ ...lama, [jenis]: { ...lama[jenis], waktu } }));
  };

  /** I-05-05: off deletes that reminder; on saves it at the picked time. */
  const ubahAktif = async (jenis: JenisPengingat, berikutnya: boolean) => {
    setMenyimpan(jenis);
    setSukses(null);
    setGalat(false);
    try {
      await (berikutnya ? simpanPengingat(jenis, setelan[jenis].waktu) : hapusPengingat(jenis));
      setSetelan((lama) => ({ ...lama, [jenis]: { ...lama[jenis], aktif: berikutnya } }));
      setSukses(
        berikutnya
          ? 'Pengingat diaktifkan.'
          : `Pengingat ${KARTU.find((k) => k.jenis === jenis)?.judul.toLowerCase()} dimatikan.`,
      );
    } catch {
      setGalat(true); // I-05-07, UC-02 alternative scenario 1.
    } finally {
      setMenyimpan(null);
    }
  };

  /** I-05-06 `submitWaktuPengiriman`: saves the time of every active reminder. */
  const simpan = async () => {
    setMenyimpan('semua');
    setSukses(null);
    setGalat(false);
    try {
      for (const { jenis } of KARTU) {
        if (setelan[jenis].aktif) await simpanPengingat(jenis, setelan[jenis].waktu);
      }
      setSukses('Setelan tersimpan.');
    } catch {
      setGalat(true);
    } finally {
      setMenyimpan(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
      {/* I-05-02 */}
      <Teks gaya="keterangan" warna="teksSekunder">
        Atur waktu pengingat makan, tidur, dan olahraga. Pengingat dikirim setiap hari lewat
        notifikasi.
      </Teks>

      {/* I-05-03 */}
      {KARTU.map(({ jenis, judul, keterangan, ikon: Ikon }) => {
        const { waktu, aktif } = setelan[jenis];
        return (
          <View key={jenis} style={styles.kartu}>
            <View style={styles.barisKartu}>
              <View style={styles.ikon}>
                <Ikon size={20} color={warna.merah} />
              </View>
              <View style={styles.teksKartu}>
                <Teks gaya="label">{judul}</Teks>
                <Teks gaya="keterangan" warna="teksSekunder">
                  {keterangan}
                </Teks>
              </View>
              {/* I-05-05 */}
              <Switch
                accessibilityLabel={`Pengingat ${judul.toLowerCase()}`}
                value={aktif}
                onValueChange={(nilai) => void ubahAktif(jenis, nilai)}
                disabled={menyimpan !== null}
                trackColor={{ false: warna.garis, true: warna.merah }}
                thumbColor={warna.inversi}
              />
            </View>

            {/* I-05-04 */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Waktu pengingat ${judul.toLowerCase()}`}
              accessibilityHint="Membuka pemilih waktu"
              disabled={menyimpan !== null}
              onPress={() => setPicker(jenis)}
              style={({ pressed }) => [styles.isianWaktu, pressed && { opacity: 0.7 }]}
            >
              <Teks gaya="isiTebal" style={styles.teksWaktu}>
                {waktu}
              </Teks>
              <Teks gaya="keterangan" warna="teksSekunder">
                Ubah
              </Teks>
            </Pressable>

            <Teks gaya="keterangan" warna="teksSekunder">
              {aktif
                ? `Dikirim setiap hari pukul ${formatWaktuHarian(waktu)}.`
                : 'Pengingat nonaktif.'}
            </Teks>

            {picker === jenis && (
              <>
                <DateTimePicker
                  value={keTanggal(waktu)}
                  mode="time"
                  is24Hour
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, tanggal) => {
                    if (tanggal) ubahWaktu(jenis, jamMenit(tanggal));
                    if (Platform.OS === 'android') setPicker(null);
                  }}
                />
                {Platform.OS === 'ios' && (
                  <Tombol judul="Selesai" varian="teks" onPress={() => setPicker(null)} />
                )}
              </>
            )}
          </View>
        );
      })}

      {/* I-05-06 */}
      <Tombol judul="Simpan Setelan" memuat={menyimpan === 'semua'} onPress={() => void simpan()} />

      {sukses && <Banner jenis="sukses">{sukses}</Banner>}
      {/* I-05-07 */}
      {galat && <Banner jenis="galat">Setelan gagal disimpan. Silakan coba lagi.</Banner>}
    </ScrollView>
  );
}

/** I-05 Pengingat Kesehatan (`ReminderView`), UC-02. */
export default function Pengingat() {
  const [muatan, muatUlang] = useMuatan(ambilPengingat);

  return (
    <View style={styles.layar}>
      {/* I-05-01. No back button: this is a tab (M9 B.5 C-18). */}
      <AppBar judul="Pengingat Kesehatan" />

      {muatan.status === 'memuat' ? (
        <ActivityIndicator size="large" color={warna.merah} style={styles.memuat} />
      ) : muatan.status === 'galat' ? (
        <View style={styles.tengah}>
          <Banner jenis="galat">{muatan.pesan}</Banner>
          <Tombol judul="Coba Lagi" varian="sekunder" onPress={muatUlang} />
        </View>
      ) : (
        <Formulir
          key={muatan.data.map((p) => `${p.jenis}:${p.waktu ?? '-'}`).join('|')}
          awal={muatan.data}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: { padding: jarak.md, gap: jarak.sm },
  memuat: { marginTop: jarak.xl },
  tengah: { padding: jarak.md, gap: jarak.sm },
  kartu: {
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: 'continuous',
    padding: jarak.md,
    gap: jarak.sm,
  },
  barisKartu: { flexDirection: 'row', alignItems: 'center', gap: jarak.sm },
  ikon: {
    width: 40,
    height: 40,
    borderRadius: sudut.penuh,
    backgroundColor: warna.latar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teksKartu: { flex: 1, gap: 2 },
  isianWaktu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ukuran.tinggiKontrol,
    paddingHorizontal: jarak.md,
    backgroundColor: warna.latar,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.md,
    borderCurve: 'continuous',
  },
  teksWaktu: { flex: 1 },
});
