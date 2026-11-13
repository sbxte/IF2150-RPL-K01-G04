import { useRouter } from 'expo-router';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import Pencil from 'lucide-react-native/icons/pencil';
import Plus from 'lucide-react-native/icons/plus';
import RefreshCw from 'lucide-react-native/icons/refresh-cw';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  ambilDaftarKonsultan,
  ambilSlotKonsultan,
  perbaruiJadwal,
  simpanJadwal,
  type Konsultan,
  type SlotKonsultasi,
} from '@/api/konsultasi';
import { AppBar, Banner, IsianTeks, Lencana, Teks, Tombol } from '@/components';
import {
  PESAN_GAGAL_MUAT,
  PESAN_GAGAL_SIMPAN,
  daftarTanggal,
  jamWib,
  klasifikasiGalatSimpan,
  labelTanggal,
  rentangJamWib,
  tanggalWib,
  validasiFormJadwal,
  type GalatForm,
} from '@/lib/jadwal';
import { useMuatan } from '@/lib/muatan';
import { jarak, sudut, warna } from '@/theme';

/**
 * I-12 Kelola Jadwal Konsultan (UC-05), `ConsultationManagementView`.
 *
 *  - `bukaPageKonsultasi` / `tampilkanOpsiKonsultasi`: loads the consultants (Algo-014).
 *  - `pilihKonsultan`: picks one and loads that consultant's slots (Algo-024, Algo-015).
 *  - `perbaruiJadwal`: "Ubah" on a slot edits it; "Tambah Slot" adds one (`simpanJadwal`).
 *    Both go through Algo-025 `validasiJadwal` on the server.
 *  - `showError`: the two banners, I-12-08 (loading failed) and I-12-07 (saving failed).
 *  - `tampilkanSetelanTersimpan`: the success banner after a save.
 */
export default function KelolaJadwal() {
  const router = useRouter();
  const [muatan, muatUlang] = useMuatan(ambilDaftarKonsultan);
  const [idPilihan, setIdPilihan] = useState<string | null>(null);
  const [daftarTerbuka, setDaftarTerbuka] = useState(false);

  const daftar = muatan.status === 'siap' ? muatan.data : [];
  const konsultan = daftar.find((k) => k.idKonsultan === idPilihan) ?? daftar[0] ?? null;

  return (
    <View style={styles.layar}>
      <AppBar judul="Jadwal Konsultan" onKembali={() => router.back()} varian="gelap" />
      <ScrollView contentContainerStyle={styles.konten} keyboardShouldPersistTaps="handled">
        {/* I-12-08, UC-05 alternative 1: the consultants could not be loaded. */}
        {muatan.status === 'galat' ? (
          <>
            <Banner jenis="galat">{PESAN_GAGAL_MUAT}</Banner>
            <Tombol judul="Muat ulang" varian="sekunder" ikon={RefreshCw} onPress={muatUlang} />
          </>
        ) : null}
        {muatan.status === 'memuat' ? <Teks warna="teksSekunder">Memuat daftar konsultan…</Teks> : null}
        {muatan.status === 'siap' && daftar.length === 0 ? (
          <View style={styles.kosong}>
            <CalendarDays size={28} color={warna.teksSekunder} />
            <Teks gaya="isiTebal">Belum ada konsultan</Teks>
            <Teks gaya="keterangan">Tambahkan konsultan lebih dulu agar jadwalnya bisa diatur.</Teks>
          </View>
        ) : null}

        {konsultan ? (
          <>
            {/* I-12-02: ConsultationManagementView.pilihKonsultan */}
            <View style={styles.pilihan}>
              <Teks gaya="label">Konsultan</Teks>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Konsultan: ${konsultan.nama}`}
                onPress={() => setDaftarTerbuka((b) => !b)}
                style={styles.isianPilihan}
              >
                <View style={styles.isi}>
                  <Teks>{konsultan.nama}</Teks>
                  <Teks gaya="keterangan">{konsultan.spesialisasi}</Teks>
                </View>
                {daftarTerbuka ? (
                  <ChevronUp size={20} color={warna.teksSekunder} />
                ) : (
                  <ChevronDown size={20} color={warna.teksSekunder} />
                )}
              </Pressable>
              {daftarTerbuka
                ? daftar.map((k) => (
                    <Pressable
                      key={k.idKonsultan}
                      accessibilityRole="button"
                      onPress={() => {
                        setIdPilihan(k.idKonsultan);
                        setDaftarTerbuka(false);
                      }}
                      style={[styles.opsi, k.idKonsultan === konsultan.idKonsultan && styles.opsiAktif]}
                    >
                      <Teks gaya="isiTebal">{k.nama}</Teks>
                      <Teks gaya="keterangan">{k.spesialisasi}</Teks>
                    </Pressable>
                  ))
                : null}
            </View>

            {/* Keyed by consultant: switching consultants starts from a clean list and a closed panel. */}
            <JadwalKonsultan key={konsultan.idKonsultan} konsultan={konsultan} />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

type Panel = { idJadwal: string | null };

function JadwalKonsultan({ konsultan }: { konsultan: Konsultan }) {
  const { idKonsultan } = konsultan;
  const ambil = useCallback(() => ambilSlotKonsultan(idKonsultan), [idKonsultan]);
  const [muatan, muatUlang] = useMuatan(ambil);

  const chip = useMemo(() => daftarTanggal(), []);
  const [tanggal, setTanggal] = useState(chip[0]);

  const [panel, setPanel] = useState<Panel | null>(null);
  const [mulai, setMulai] = useState('');
  const [selesai, setSelesai] = useState('');
  const [galat, setGalat] = useState<GalatForm>({});
  const [gagalSimpan, setGagalSimpan] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [tersimpan, setTersimpan] = useState(false);

  const slots: SlotKonsultasi[] = muatan.status === 'siap' ? muatan.data : [];
  const slotHari = slots
    .filter((s) => tanggalWib(s.waktu) === tanggal)
    .sort((a, b) => Date.parse(a.waktu) - Date.parse(b.waktu));

  const tutupPanel = () => {
    setPanel(null);
    setGalat({});
    setGagalSimpan(false);
  };

  /** I-12-04 "Ubah" opens the panel for that slot; I-12-09 "Tambah Slot" opens it empty. */
  const bukaPanel = (slot?: SlotKonsultasi) => {
    setPanel({ idJadwal: slot?.idJadwal ?? null });
    setMulai(slot ? jamWib(slot.waktu) : '');
    setSelesai(slot ? jamWib(slot.waktuSelesai) : '');
    setGalat({});
    setGagalSimpan(false);
    setTersimpan(false);
  };

  const pilihTanggal = (t: string) => {
    setTanggal(t);
    tutupPanel();
    setTersimpan(false);
  };

  /** I-12-06 "Simpan": check the input, then `perbaruiJadwal` (edit) or `simpanJadwal` (new). */
  const simpan = async () => {
    if (!panel || menyimpan) return;
    setGalat({});
    setGagalSimpan(false);

    const hasil = validasiFormJadwal(tanggal, mulai, selesai, slots, panel.idJadwal ?? undefined);
    if (!hasil.ok) {
      setGalat(hasil.galat);
      return;
    }

    setMenyimpan(true);
    try {
      if (panel.idJadwal) {
        await perbaruiJadwal(panel.idJadwal, { waktu: hasil.waktu, waktuSelesai: hasil.waktuSelesai });
      } else {
        await simpanJadwal({ idKonsultan, waktu: hasil.waktu, waktuSelesai: hasil.waktuSelesai });
      }
      tutupPanel();
      setTersimpan(true);
      muatUlang();
    } catch (e) {
      const g = klasifikasiGalatSimpan(e);
      if (g.jenis === 'ditolak') setGalat({ umum: g.pesan });
      else setGagalSimpan(true); // I-12-07, UC-05 alternative 2
    } finally {
      setMenyimpan(false);
    }
  };

  const slotDiedit = panel?.idJadwal ? slots.find((s) => s.idJadwal === panel.idJadwal) : undefined;

  return (
    <>
      {/* I-12-03 */}
      <View style={styles.strip}>
        {chip.map((t) => {
          const aktif = t === tanggal;
          return (
            <Pressable
              key={t}
              accessibilityRole="button"
              accessibilityState={{ selected: aktif }}
              onPress={() => pilihTanggal(t)}
              style={[styles.chip, aktif && styles.chipAktif]}
            >
              <Teks gaya="label" warna={aktif ? 'inversi' : 'teks'}>
                {labelTanggal(t)}
              </Teks>
            </Pressable>
          );
        })}
      </View>

      {tersimpan ? <Banner jenis="sukses">Jadwal tersimpan.</Banner> : null}

      {/* I-12-08, UC-05 alternative 1: the slots could not be loaded. */}
      {muatan.status === 'galat' ? (
        <>
          <Banner jenis="galat">{PESAN_GAGAL_MUAT}</Banner>
          <Tombol judul="Muat ulang" varian="sekunder" ikon={RefreshCw} onPress={muatUlang} />
        </>
      ) : null}
      {muatan.status === 'memuat' ? <Teks warna="teksSekunder">Memuat jadwal…</Teks> : null}

      {muatan.status === 'siap' && slotHari.length === 0 ? (
        <View style={styles.kosong}>
          <CalendarDays size={28} color={warna.teksSekunder} />
          <Teks gaya="keterangan">Belum ada slot pada tanggal ini.</Teks>
        </View>
      ) : null}

      {/* I-12-04 */}
      {slotHari.map((slot) => {
        const terpesan = slot.status === 'terpesan';
        return (
          <View key={slot.idJadwal} style={[styles.slot, panel?.idJadwal === slot.idJadwal && styles.slotAktif]}>
            <View style={styles.isi}>
              <Teks gaya="isiTebal">{rentangJamWib(slot.waktu, slot.waktuSelesai)}</Teks>
              <Lencana label={terpesan ? 'Terpesan' : 'Tersedia'} jenis={terpesan ? 'peringatan' : 'sukses'} />
            </View>
            <Tombol judul="Ubah" varian="sekunder" ikon={Pencil} onPress={() => bukaPanel(slot)} />
          </View>
        );
      })}

      {/* I-12-05 */}
      {panel ? (
        <View style={styles.panel}>
          <Teks gaya="h3">{panel.idJadwal ? 'Ubah slot' : 'Tambah slot'}</Teks>
          <Teks gaya="keterangan">{labelTanggal(tanggal)} · waktu WIB</Teks>
          {slotDiedit?.status === 'terpesan' ? (
            <Banner jenis="info">Slot ini sudah dipesan. Mengubah jamnya juga mengubah jam sesi mahasiswa.</Banner>
          ) : null}
          <IsianTeks
            label="Mulai"
            value={mulai}
            onChangeText={setMulai}
            placeholder="09.00"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            galat={galat.mulai}
          />
          <IsianTeks
            label="Selesai"
            value={selesai}
            onChangeText={setSelesai}
            placeholder="10.00"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            galat={galat.selesai}
          />
          {galat.umum ? <Teks gaya="keterangan" warna="galat" accessibilityLiveRegion="polite">{galat.umum}</Teks> : null}
          {/* I-12-07, UC-05 alternative 2: the change could not be saved. */}
          {gagalSimpan ? <Banner jenis="galat">{PESAN_GAGAL_SIMPAN}</Banner> : null}
          <Tombol judul="Simpan" onPress={() => void simpan()} memuat={menyimpan} />
          <Tombol judul="Batal" varian="teks" onPress={tutupPanel} disabled={menyimpan} />
        </View>
      ) : null}

      {/* I-12-09 */}
      {!panel ? <Tombol judul="Tambah Slot" ikon={Plus} onPress={() => bukaPanel()} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  konten: { padding: jarak.md, gap: jarak.md, paddingBottom: jarak.xxl },
  isi: { flex: 1, gap: jarak.xxs },
  kosong: { alignItems: 'center', gap: jarak.sm, padding: jarak.xl, backgroundColor: warna.kartu, borderRadius: sudut.lg },
  pilihan: { gap: jarak.xxs },
  isianPilihan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.sm,
    paddingHorizontal: jarak.md,
    paddingVertical: jarak.xs,
    minHeight: 48,
    backgroundColor: warna.kartu,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: sudut.md,
  },
  opsi: { padding: jarak.md, gap: jarak.xxs, backgroundColor: warna.kartu, borderWidth: 1, borderColor: warna.garis, borderRadius: sudut.md },
  opsiAktif: { borderColor: warna.merah, backgroundColor: warna.merahLembut },
  strip: { flexDirection: 'row', gap: jarak.xs },
  chip: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warna.kartu,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: sudut.penuh,
  },
  chipAktif: { backgroundColor: warna.merah, borderColor: warna.merah },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: jarak.sm,
    padding: jarak.md,
    backgroundColor: warna.kartu,
    borderWidth: 1,
    borderColor: warna.garis,
    borderRadius: sudut.lg,
  },
  slotAktif: { borderColor: warna.merah, backgroundColor: warna.merahLembut },
  panel: { gap: jarak.sm, padding: jarak.md, backgroundColor: warna.kartu, borderWidth: 1, borderColor: warna.garis, borderRadius: sudut.lg },
});
