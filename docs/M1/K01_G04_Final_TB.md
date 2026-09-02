<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## _Nama Perangkat Lunak_

### Untuk: Aurelia Jennifer Gunawan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K01 |
| Kelompok | G04 |

| NIM      | Nama                         |
| -------- | ---------------------------- |
| 13525052 | Daniel Charisma Christian    |
| 13525061 | Rifqi Irfan Indrawan         |
| 13525082 | Ausa Haadiyaan Mukhtar Yusuf |
| 13525058 | Farish Firstian Erifiawan    |

---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah

Perkembangan _Internet of Things_ (IoT) membawa banyak dampak, baik itu negatif maupun positif, semua hal yang berkaitan dengan perkembangan teknologi memengaruhi cara masyarakat melakukan kegiatan sehari-hari mereka. IoT memengaruhi banyak sektor dari kehidupan masyarakat, termasuk kesehatan. Salah satu contoh konkret adalah seperti sistem _ticketing_ yang sudah diimplementasikan di berbagai puskesmas saat ini. Hal tersebut juga berhubungan dengan Tujuan Pembangunan Berkelanjutan (SDGs) yang kami ambil, yaitu Kehidupan Sehat dan Sejahtera yang di dalamnya bertujuan untuk memberikan fasilitas kesehatan untuk semua, tanpa memandang ekonomi. Layanan puskesmas tersebut membantu berbagai macam masyarakat dengan latar belakang ekonomi yang dapat tergolong kurang. Tentu, kehadiran puskesmas sendiri sudah membantu berbagai kaum masyarakat dengan memberikan bantuan kesehatan yang cukup. Namun, dengan adanya perkembagan IoT yang semakin berkembang pesat, diperlukan inovasi supaya proses pemeriksaan kesehatan maupun pemberdayaan kesehatan masyarakat terlaksana seefisien dan seefektif mungkin.

## 1.2 Analisis Kondisi Saat Ini

[Riliv](https://riliv.co/), [bicarakan.id](http://Bicarakan.id), KALM, 7 Cups, [Headspace](https://www.headspace.com/), BetterHelp, dan Woebot menawarkan beberapa solusi perangkat lunak yang telah dikembangkan sebelumnya. Ada pun _hotline_ yang disediakan oleh pemerintah (SEJIWA, yang dapat diakses via nomor telepon 119 _extension_ 8\) dan lembaga lainnya, seperti LISA Suicide Prevention Helpline, yang diprakarsai oleh 11 LSM dalam kolektif Bali Bersama Bisa.

Namun, terdapat beberapa keluhan yang diberikan oleh _review online_ yang diberikan pengguna. Beberapa hal seperti:

- AK1: Aplikasi Riliv tergolong sulit dan kurang sesuai dalam pemakaiannya, terdapat fitur pemesanan konsultasi namun harus mengikuti jadwal yang tersedia dan tidak langsung.
- AK2: Aplikasi [Bicarakan.id](http://Bicarakan.id) yang memiliki kekurangan pada bug aplikasi yang dapat terjadi kapan saja, seperti terjadi pemesanan yang tulisannya selesai namun gagal, pembuatan akun yang terus gagal, pendaftaran yang menggunakan nomor baru namun dituliskan sudah dipakai.
- AK3: Sebagian besar layanan konseling memiliki tarif yang dapat tergolong cukup tinggi maka tidak dapat meng-_cover_ keseluruhan demografi
- AK4: Layanan BetterHelp yang memiliki marketplace konseling memiliki masalah menaruh iklan yang bersangkutan dengan pihak ketiga yang menjual data pribadi pengguna
- AK5: Chatbot Woebot yang pada awalnya memiliki basis pengguna yang cukup tinggi namun karena perusahaan beralih ke model enterprise pengguna-pengguna tersebut ditinggalkan begitu saja tanpa adanya pengganti

---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak

Solusi perangkat lunak yang kami berikan merupakan desktop application yang akan mempromosikan well-being pengguna. Solusi tersebut merupakan solusi yang berkaitan dengan SDG kami yaitu SDG 3, ensure healthy lives and promote well-being for all at all ages. Aplikasi kami akan memfokuskan target berupa mahasiswa sebagai target pengguna, mengingat latar belakang kami yang masih menargetkan kalangan secara umum dan kami rasa hal tersebut masih kurang, maka dari itu kami memfokuskan target pengguna kami adalah mahasiswa. Penargetan tersebut juga akan membantu kami untuk memfokuskan/mempersempit operasional ke dalam kajian mahasiswa saja. Fitur-fitur utama yang kami berupa daily affirmations, pengingat waktu makan, tidur, dan juga pembantu jadwal serta pemesanan sesi konsultasi.

## 2.2 Asumsi dan Batasan

### 2.2.1 Asumsi

| ID | Asumsi |
| --- | --- |
| AB-A-1 | Pengguna (mahasiswa) memiliki akun Google aktif dan bersedia memberikan izin akses ke Google Calendar mereka untuk keperluan integrasi jadwal |
| AB-A-2 | Pengguna memiliki koneksi internet yang stabil selama menggunakan aplikasi, mengingat fitur-fitur utama (sinkronisasi kalender, pemesanan konsultasi) bergantung pada komunikasi real-time dengan server  |
| AB-A-3 | Konselor yang terdaftar bersedia memperbarui ketersediaan jadwal mereka secara berkala melalui sistem |
| AB-A-4 | Data jadwal dan preferensi yang dimasukkan pengguna (waktu makan, tidur, olahraga) mencerminkan kondisi dan kebutuhan nyata mereka |
| AB-A-5 | Pengguna memiliki perangkat yang mendukung environment desktop aplikasi (OS dan spesifikasi minimum yang akan ditentukan) |

### 2.2.2 Regulasi

| ID | Asumsi |
| --- | --- |
| AB-R-1 | UUD 1945 pasal 28H ayat (1) |
| AB-R-2 | UU No. 39/1999 tentang HAM |
| AB-R-3 | UU No. 3/1966 tentang Kesehatan Jiwa |
| AB-R-4 | UU No. 18/2014 tentang Kesehatan Jiwa |
| AB-R-5 | UU No. 17/2023 tentang Kesehatan (uu kesehatan omnibus) |
| AB-R-6 | Permenkes No. 54/2017 |

### 2.2.3 Keterbatasan

| ID | Asumsi |
| --- | --- |
| AB-K-1 | Aplikasi bukan pengganti layanan intervensi krisis atau hotline darurat (seperti SEJIWA 119 ext 8\) — tidak dirancang untuk menangani situasi darurat kesehatan mental |
| AB-K-2 | Fitur integrasi jadwal bergantung pada ketersediaan dan kebijakan API pihak ketiga (Google Calendar API); jika pengguna mencabut izin akses atau layanan API mengalami gangguan, sinkronisasi jadwal tidak akan berfungsi |
| AB-K-3 | Verifikasi kredensial profesional konselor dilakukan secara manual oleh administrator, bukan otomatis |
| AB-K-4 | Konselor yang tersedia terbatas pada mitra yang telah terdaftar dan diverifikasi di dalam sistem, bukan direktori terbuka |
| AB-K-5 | Sebagai aplikasi desktop, rilis awal tidak mencakup versi mobile |
| AB-K-6 | Aplikasi tidak menyediakan rekam medis elektronik atau fitur diagnosis klinis |

### 2.2.4 Ruang Lingkup Solusi

#### 2.2.4.1 Termasuk dalam ruang lingkup

| ID | Asumsi |
| --- | --- |
| AB-RLS-D-1 | Pengaturan dan pengiriman daily affirmations sesuai jadwal yang ditentukan pengguna |
| AB-RLS-D-2 | Pengingat (reminder) makan, tidur, dan olahraga yang dapat dikustomisasi |
| AB-RLS-D-3 | Tampilan jadwal harian terintegrasi dengan Google Calendar pengguna (read access) |
| AB-RLS-D-4 | Pemesanan sesi konsultasi dengan konselor, termasuk deteksi bentrok (overlap) antara slot yang dipilih dengan event yang sudah ada di Google Calendar pengguna |
| AB-RLS-D-5 | Panel administrator untuk mengelola ketersediaan konselor dan data pengguna |

#### 2.2.4.2 Di luar ruang lingkup

| ID | Asumsi |
| --- | --- |
| AB-RLS-L-1 | Layanan konseling darurat atau intervensi krisis real-time |
| AB-RLS-L-2 | Rekam medis elektronik atau riwayat diagnosis klinis pengguna |
| AB-RLS-L-3 | Sistem pembayaran/billing (belum disebutkan sebagai fitur utama) |
| AB-RLS-L-4 | Aplikasi versi mobile (native Android/iOS) pada rilis awal |
| AB-RLS-L-5 | Fitur komunitas atau forum antar-pengguna |

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor

Buatlah daftar seluruh aktor (pengguna) yang akan berinteraksi langsung dengan sistem solusi yang kalian kembangkan. Berikan penjelasan singkat mengenai peran dan karakteristik dari masing-masing aktor tersebut.

| Aktor   | Deskripsi                                                                                                                                                                                                                         |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Kasir_ | _Pengguna ini bertindak sebagai pihak yang bertanggung jawab untuk memproses transaksi harian dan melayani pembayaran pelanggan. Karakteristik dari pengguna ini adalah mengutamakan kecepatan dan keakuratan saat bertransaksi._ |
| ...     | ...                                                                                                                                                                                                                               |

## 3.2 Kebutuhan Pengguna Awal

Definisikan apa yang ingin dicapai oleh pengguna saat menggunakan sistem ini dalam format _User Story_ (Sebagai [Aktor], saya ingin [Aktivitas/Kebutuhan], sehingga [Tujuan/Nilai]). Pastikan kalian berfokus pada "apa yang ingin dilakukan pengguna".

| ID    | Aktor          | Kebutuhan / Aktivitas     | Tujuan / Nilai                                |
| :---- | :------------- | :------------------------ | :-------------------------------------------- |
| US-01 | _Kasir_        | _Memindai barcode barang_ | _Proses pembayaran berjalan cepat dan akurat_ |
| US-02 | _[Nama Aktor]_ | _[Kebutuhan pengguna]_    | _[Tujuan yang dicapai pengguna]_              |
| ...   | ...            | ...                       | ...                                           |

## 3.3 Deskripsi Aktivitas

| ID | Aktivitas | Penjelasan | ID User Story |
| ----- | ----- | ----- | ----- |
| A-01 | Menyetel daily affirmations | Pengguna dapat mengatur kapan mendapatkan daily affirmations lewat aplikasi. | US-01 |
| A-02 | Melihat jadwal sehari-hari secara keseluruhan | Pengguna dapat melihat jadwal sehari-hari lewat integrasi dengan google calendar termasuk jadwal reminder dan event-event lain yang ada di jadwal google calendar pengguna. | US-04 |
| A-03 | Menyetel reminder makan | Pengguna dapat mengatur kapan diberikan reminder lewat aplikasi. | US-02 |
| A-04 | Menyetel reminder tidur | Pengguna dapat mengatur kapan diberikan reminder lewat aplikasi. | US-03 |
| A-05 | Mengatur reminder olahraga | Pengguna dapat mengatur kapan diberikan reminder lewat aplikasi. | US-06 |
| A-06 | Menjadwalkan konsultasi dengan tenaga medis | Pengguna dapat melihat jadwal konsultasi yang tersedia sekaligus melihat apakah jadwal tersebut bertabrakan dengan jadwal yang sudah ada di kalender pengguna di google calendar. | US-05 |

## 3.4 Model Proses Bisnis

Buatlah _Activity Diagram_ atau _Swimlane Diagram_ yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/diagram-act-1.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Contoh Activity Diagram</i>
</p>

<br>

# Referensi

- Diagram UML: https://www.drawio.com/, https://staruml.io/
- Konflik Riliv: [Garuda Kemdiktisaintek](https://garuda.kemdiktisaintek.go.id/documents/detail/4396353)
- Ulasan Bicarakan.id: [https://play.google.com/store/apps/details?id=id.bicarakan.client_app](https://play.google.com/store/apps/details?id=id.bicarakan.client_app)
- Ulasan Sahabatku: [https://play.google.com/store/apps/details?id=com.icreativelabs.sahabatku](https://play.google.com/store/apps/details?id=com.icreativelabs.sahabatku&hl=id)
- Ulasan BetterHelp: [https://play.google.com/store/apps/details?id=com.betterhelp\&hl=id](https://play.google.com/store/apps/details?id=com.betterhelp&hl=id)
