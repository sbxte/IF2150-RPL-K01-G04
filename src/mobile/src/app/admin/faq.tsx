import { useFocusEffect, useRouter } from "expo-router";
import Inbox from "lucide-react-native/icons/inbox";
import Pencil from "lucide-react-native/icons/pencil";
import Plus from "lucide-react-native/icons/plus";
import Trash from "lucide-react-native/icons/trash";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ambilFaq, hapusFaq, type Faq, type UrutFaq } from "@/api";
import { AppBar, Banner, Chip, IsianTeks, Teks, Tombol } from "@/components";
import { jarak, sudut, ukuran, warna } from "@/theme";

/** Jeda pencarian setelah pengguna berhenti mengetik. */
const JEDA_CARI_MS = 300;

/** Sort choices above the list (M9 B.1 no. 12). */
const URUTAN: { nilai: UrutFaq; label: string }[] = [
  { nilai: "az", label: "A–Z" },
  { nilai: "za", label: "Z–A" },
  { nilai: "baru", label: "Terbaru" },
];

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
 * The list reloads on focus and after every change, and is filtered by the
 * keyword above it (M9 B.1 no. 12), with the sort chips right below it. Adding
 * and editing happen on their own view (M9 B.1 no. 13): the top button and the
 * pencil icon open `faq-form`.
 */
export default function KelolaFaq() {
  const router = useRouter();
  const [daftar, setDaftar] = useState<Faq[] | null>(null);
  const [memuat, setMemuat] = useState(true);
  const [galatMuat, setGalatMuat] = useState<string | null>(null);
  const [menghapus, setMenghapus] = useState<string | null>(null);
  // I-13-07: shown when delete fails (UC-07 alternative scenario 1).
  const [galatHapus, setGalatHapus] = useState<string | null>(null);
  const [kataKunci, setKataKunci] = useState("");
  const [urut, setUrut] = useState<UrutFaq>("az");
  const permintaanTerakhir = useRef(0);

  // `FAQController.tampilkanFAQ()` / `cariFAQ(kataKunci)` -> GET /api/faq,
  // again each time the screen gains focus, the keyword changes, or the sort
  // chip changes (M9 B.1 no. 12).
  // `tampilkanMemuat` is false for background reloads.
  const muat = useCallback(
    async (tampilkanMemuat: boolean, kunci: string, urutan: UrutFaq) => {
      const ke = ++permintaanTerakhir.current;
      if (tampilkanMemuat) {
        setMemuat(true);
        setGalatMuat(null);
      }
      try {
        const hasil = await ambilFaq({ q: kunci, urut: urutan });
        if (ke === permintaanTerakhir.current) {
          setDaftar(hasil);
          setMemuat(false);
        }
      } catch {
        if (ke !== permintaanTerakhir.current) return;
        setDaftar(null);
        setGalatMuat(
          "FAQ gagal dimuat. Periksa koneksi internet, lalu coba lagi.",
        );
        setMemuat(false);
      }
    },
    [],
  );

  // Also re-runs when `kataKunci`/`urut` change (the callback identity changes
  // while focused), which gives the search its 300 ms debounce.
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(
        () => void muat(true, kataKunci, urut),
        kataKunci.trim() ? JEDA_CARI_MS : 0,
      );
      return () => {
        clearTimeout(timer);
        // Ignore a request still in flight when the keyword changes, the screen
        // loses focus, or it unmounts.
        permintaanTerakhir.current++;
      };
    }, [muat, kataKunci, urut]),
  );

  // M9 B.1 no. 13: adding and editing share one form view.
  const tambahBaru = () => {
    router.push("/admin/faq-form");
  };

  // I-13-03: open the form with the chosen FAQ.
  const mulaiUbah = (faq: Faq) => {
    router.push({
      pathname: "/admin/faq-form",
      params: {
        idFaq: faq.idFaq,
        pertanyaan: faq.pertanyaan,
        jawaban: faq.jawaban,
      },
    });
  };

  // I-13-04: confirm, then `FAQController.hapusFAQ` (Q-037).
  const konfirmasiHapus = (faq: Faq) => {
    Alert.alert("Hapus FAQ", `"${faq.pertanyaan}" akan dihapus permanen.`, [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => void hapus(faq),
      },
    ]);
  };

  const hapus = async (faq: Faq) => {
    setGalatHapus(null);
    setMenghapus(faq.idFaq);
    try {
      await hapusFaq(faq.idFaq);
      await muat(true, kataKunci, urut);
    } catch {
      setGalatHapus("FAQ gagal dihapus. Silakan coba lagi.");
    } finally {
      setMenghapus(null);
    }
  };

  const adaFilter = kataKunci.trim() !== "" || urut !== "az";

  return (
    <View style={styles.layar}>
      <AppBar
        judul="Kelola FAQ"
        onKembali={() => router.back()}
        varian="gelap"
      />

      <ScrollView
        contentContainerStyle={styles.isi}
        keyboardShouldPersistTaps="handled"
      >
        {/* I-13-07 */}
        {galatHapus && <Banner jenis="galat">{galatHapus}</Banner>}

        {/* I-13-02 */}
        <View style={styles.kepalaDaftar}>
          <View style={styles.aksiDaftar}>
            {/* M9 B.1 no. 11: the incoming-question queue lives here instead of a fifth I-03 tile. */}
            <Tombol
              judul="Pertanyaan Masuk"
              varian="sekunder"
              ikon={Inbox}
              onPress={() => router.push("/admin/pertanyaan")}
              style={styles.tombolAksi}
            />
            <Tombol
              judul="Tambah FAQ"
              varian="sekunder"
              ikon={Plus}
              onPress={tambahBaru}
              style={styles.tombolAksi}
            />
          </View>
        </View>

        {/* M9 B.1 no. 12: keyword filter, reusing Q-015, plus the sort chips. */}
        <IsianTeks
          label="Daftar FAQ"
          placeholder="Cari FAQ..."
          value={kataKunci}
          onChangeText={setKataKunci}
          autoCorrect={false}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.barisChip}
          keyboardShouldPersistTaps="handled"
        >
          {URUTAN.map((u) => (
            <Chip
              key={u.nilai}
              label={u.label}
              selected={urut === u.nilai}
              onPress={() => setUrut(u.nilai)}
            />
          ))}
        </ScrollView>
        {memuat && (
          <ActivityIndicator
            size="large"
            color={warna.merah}
            style={styles.memuat}
          />
        )}
        {galatMuat && (
          <View style={styles.tengah}>
            <Teks warna="teksSekunder">{galatMuat}</Teks>
            <Tombol
              judul="Coba Lagi"
              varian="sekunder"
              onPress={() => void muat(true, kataKunci, urut)}
            />
          </View>
        )}
        {!memuat && !galatMuat && daftar !== null && daftar.length === 0 && (
          <Teks warna="teksSekunder">
            {kataKunci.trim()
              ? `Tidak ada FAQ yang cocok dengan "${kataKunci.trim()}".`
              : "Belum ada FAQ. Tambahkan yang pertama lewat tombol Tambah FAQ di atas."}
          </Teks>
        )}
        {!memuat &&
          !galatMuat &&
          daftar !== null &&
          daftar.length > 0 &&
          adaFilter && (
            <Teks gaya="keterangan" warna="teksSekunder">
              {daftar.length} FAQ ditemukan
            </Teks>
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
                    <TombolIkon
                      ikon={Pencil}
                      label={`Ubah ${faq.pertanyaan}`}
                      onPress={() => mulaiUbah(faq)}
                    />
                    <TombolIkon
                      ikon={Trash}
                      label={`Hapus ${faq.pertanyaan}`}
                      onPress={() => konfirmasiHapus(faq)}
                    />
                  </View>
                )}
                {menghapus === faq.idFaq && (
                  <ActivityIndicator
                    size="small"
                    color={warna.merah}
                    style={styles.aksiMemuat}
                  />
                )}
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.latar },
  isi: {
    paddingHorizontal: jarak.md,
    paddingVertical: jarak.md,
    gap: jarak.sm,
  },
  memuat: { marginTop: jarak.xl },
  barisChip: { gap: jarak.xs, paddingVertical: jarak.xxs },
  tengah: { alignItems: "center", gap: jarak.sm },
  kepalaDaftar: { gap: jarak.sm },
  aksiDaftar: { flexDirection: "row", gap: jarak.sm },
  tombolAksi: { flex: 1, paddingHorizontal: jarak.sm },
  kartu: {
    backgroundColor: warna.kartu,
    borderColor: warna.garis,
    borderWidth: ukuran.garis,
    borderRadius: sudut.lg,
    borderCurve: "continuous",
    padding: jarak.md,
  },
  kepala: { flexDirection: "row", alignItems: "flex-start", gap: jarak.sm },
  teksKartu: { flex: 1, gap: jarak.xxs },
  aksi: { flexDirection: "row", gap: jarak.xs },
  aksiMemuat: { marginLeft: jarak.sm },
  ikon: {
    width: ukuran.tinggiKontrol / 2,
    height: ukuran.tinggiKontrol / 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sudut.sm,
  },
});
