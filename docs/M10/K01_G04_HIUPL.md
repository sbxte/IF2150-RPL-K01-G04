<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## Sehati

<p align="center">
<img alt="Logo Sehati" src="./assets/sehati-logo.png" width="160">
</p>

### Untuk: Aurelia Jennifer Gunawan

Dipersiapkan oleh:

| Informasi | Keterangan |
| --------- | ---------- |
| Kelas     | K01        |
| Kelompok  | G04        |

| NIM      | Nama                         |
| -------- | ---------------------------- |
| 13525052 | Daniel Charisma Christian    |
| 13525061 | Rifqi Irfan Indrawan         |
| 13525082 | Ausa Haadiyaan Mukhtar Yusuf |
| 13525058 | Farish Firstian Erifiawan    |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| ------ | --------- |
| REV-M10-01 | Menambahkan layar **Pertanyaan Masuk** untuk Administrator (`src/mobile/src/app/admin/pertanyaan.tsx`) yang tidak terdapat pada rancangan antarmuka DPPL. Pada DPPL, pertanyaan yang dikirim Mahasiswa lewat I-10 (UC-12) hanya disimpan ke `PengajuanPertanyaan` (C-13) tanpa layar untuk membacanya, dan I-13 hanya mengelola FAQ. Layar ini menampilkan pertanyaan masuk beserta nama pengirim dan waktu pengajuan, dengan pencarian dan penyaring rentang waktu, serta memungkinkan Administrator menjawab pertanyaan sehingga menjadi FAQ baru atau menghapusnya. Layar ini dilayani rute tambahan `GET /api/questions` dan `DELETE /api/questions/:id` khusus Administrator pada `FAQController` (C-30), dan termasuk kelas `FAQView` (C-22). Perubahan ini tercatat pada Tabel B.1 no. 15 dokumen Implementasi (Tugas 9) dan tampak pada Tabel 3.2 dan Tabel 3.3 (BAB 3). |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini melaporkan hasil implementasi perangkat lunak Sehati beserta hasil pengujiannya, sebagai lanjutan dari dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL), Arsitektur Perangkat Lunak (APL), Deskripsi Perancangan Perangkat Lunak (DPPL), dan dokumen Implementasi (Tugas 9). Dokumen ini memetakan setiap kelas dan antarmuka rancangan DPPL ke berkas kode pada repositori, lalu melaporkan pengujian pada level unit, integrasi, _use case_, dan kebutuhan nonfungsional terhadap _tag release_ terakhir Tugas 9.

Dokumen ini ditujukan kepada tim pengembang sebagai catatan kondisi P/L yang telah dibangun dan diuji, kepada asisten dan penguji sebagai bukti bahwa implementasi memenuhi kebutuhan dan rancangan, serta kepada pemangku kepentingan yang perlu menilai kesiapan Sehati untuk digunakan.

## 1.2 Lingkup Masalah

Sehati adalah aplikasi _mobile_ (Android dan iOS) yang mempromosikan kesejahteraan mahasiswa, sejalan dengan SDG 3. Mahasiswa masuk melalui akun Google, lalu dapat mengatur dan menerima _daily affirmations_, mengatur pengingat makan, tidur, dan olahraga, melihat kalender harian yang terintegrasi dengan Google Calendar, memesan sesi konsultasi, membaca FAQ, mengajukan pertanyaan, dan memberi umpan balik. Administrator mengelola jadwal konsultan, FAQ, dan umpan balik, serta memantau status _server_. Sehati terdiri atas aplikasi _client_ React Native (Expo) dan _server_ Hono di Cloudflare Workers dengan basis data Cloudflare D1, serta berinteraksi dengan Google OAuth 2.0, Google Calendar API, dan Expo Push Service sebagai sistem eksternal. Dokumen ini membatasi pembahasannya pada hasil implementasi dan pengujian P/L tersebut, dan tidak membahas ulang analisis kebutuhan maupun perancangannya.

## 1.3 Definisi, Istilah, dan Singkatan

Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| -------------------------------- | ---------- |
| P/L | Singkatan dari **Perangkat Lunak**, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu. |
| SKPL | Singkatan dari **Spesifikasi Kebutuhan Perangkat Lunak**, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya. |
| APL | Singkatan dari **Arsitektur Perangkat Lunak**, yaitu dokumen yang menjabarkan arsitektur dan komponen P/L. |
| DPPL | Singkatan dari **Deskripsi Perancangan Perangkat Lunak**, yaitu dokumen yang menjabarkan rancangan arsitektur, komponen, kelas, dan antarmuka P/L. |
| HIUPL | Singkatan dari **Hasil Implementasi dan Uji Perangkat Lunak**, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L. |
| KF | Singkatan dari **Kebutuhan Fungsional**, yaitu kebutuhan yang menjelaskan apa yang harus dapat dilakukan oleh sistem. |
| KNF | Singkatan dari **Kebutuhan Nonfungsional**, yaitu kebutuhan yang menjelaskan kualitas sistem, seperti ketersediaan, keamanan, dan kemudahan penggunaan. |
| UC | Singkatan dari **_Use Case_**, yaitu gambaran interaksi antara aktor dan sistem untuk mencapai suatu tujuan. |
| TC | Singkatan dari **_Test Case_**, yaitu satu kasus uji untuk skenario tertentu, lengkap dengan masukan, hasil yang diharapkan, dan hasil aktual. |
| UT | Singkatan dari **_Unit Test_**, yaitu _test case_ pada tingkat kelas atau operasi. |
| INT | Singkatan dari **_Integration Test_**, yaitu _test case_ yang menguji interaksi antarkomponen, misalnya rute Hono bersama basis data. |
| _Boundary_ | Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan. |
| _Coverage_ | Persentase baris atau cabang kode yang dieksekusi oleh pengujian. |
| _Tag release_ | Penanda versi pada repositori Git (misalnya `v9.1`) yang menunjuk satu _commit_ tertentu sebagai versi rilis. |
| APK | Singkatan dari **_Android Package Kit_**, yaitu berkas paket instalasi aplikasi Android. |
| Sehati | **Nama perangkat lunak yang dikembangkan** untuk mendukung kesehatan mental dan kesejahteraan mahasiswa. |
| Mahasiswa | **Aktor pengguna utama** Sehati yang menggunakan pengingat, _daily affirmations_, kalender, dan pemesanan sesi konsultasi. |
| Administrator | **Aktor yang mengelola** Sehati, termasuk jadwal konsultan, FAQ, dan umpan balik, serta memantau status _server_. |
| Konsultan | Tenaga profesional yang menyediakan sesi konsultasi. Konsultan bukan aktor sistem; data dan jadwalnya dikelola oleh Administrator. |
| _Daily Affirmations_ | Pesan positif yang dikirimkan kepada pengguna pada waktu yang diatur pengguna untuk menjaga suasana hati dan kepercayaan diri. |
| Pengingat | Notifikasi dengan waktu yang diatur pengguna untuk makan, tidur, dan berolahraga. |
| _Push notification_ | Notifikasi yang dikirim _server_ ke perangkat pengguna melalui Expo Push Service, walaupun aplikasi sedang tidak dibuka. |
| Google Calendar | Layanan kalender milik Google yang datanya diintegrasikan ke Sehati untuk menampilkan jadwal pengguna. |
| API | Singkatan dari **_Application Programming Interface_**, yaitu antarmuka yang memungkinkan satu perangkat lunak berkomunikasi dengan perangkat lunak lain. |
| REST API | Gaya API berbasis HTTP yang dipakai _server_ Sehati untuk melayani permintaan aplikasi _client_ dalam format JSON. |
| OAuth | Protokol otorisasi yang memungkinkan aplikasi mendapat akses terbatas ke akun pengguna di layanan lain (misalnya Google) tanpa mengetahui kata sandi pengguna. |
| Bentrok jadwal | Kondisi ketika waktu sesi konsultasi yang dipilih tumpang tindih dengan acara lain di kalender pengguna. |
| _Uptime_ | Persentase waktu sistem dapat diakses dan beroperasi dalam suatu periode. |
| _Cron_ | Penjadwal tugas berkala; pada Sehati diwujudkan oleh Cloudflare Cron Trigger untuk mengirim notifikasi, memeriksa status _server_, dan membersihkan data lama. |
| FAQ | Singkatan dari **_Frequently Asked Questions_**, yaitu daftar pertanyaan yang sering diajukan beserta jawabannya. |
| Umpan balik | Masukan dari pengguna terhadap aplikasi, yang dapat ditanggapi oleh Administrator. |
| MVC | Singkatan dari **_Model-View-Controller_**, yaitu pattern arsitektur yang memisahkan penyimpanan data (_model_), tampilan (_view_), dan pemrosesan permintaan (_controller_). |
| Expo | _Framework_ dan perangkat pengembangan untuk aplikasi React Native, termasuk Expo Router (navigasi) dan EAS Build (pembuatan APK). |
| Hono | _Framework web_ TypeScript yang dipakai untuk membangun REST API Sehati di Cloudflare Workers. |
| Cloudflare D1 | Basis data SQLite terkelola milik Cloudflare yang dipakai sebagai DBMS Sehati. |
| Vitest | _Framework_ pengujian unit dan integrasi untuk TypeScript yang dipakai pada _server_ dan _client_ Sehati. |
| _Traceability_ | Keterlacakan hubungan antara kebutuhan, _use case_, kelas, implementasi, dan _test case_. |

## 1.4 Aturan Penomoran

Dokumen ini memakai pola penomoran ID yang sama dengan dokumen SKPL, APL, dan DPPL, sehingga setiap rujukan kebutuhan, _use case_, kelas, dan antarmuka tetap konsisten antardokumen. ID _test case_ diperkenalkan pada dokumen ini dan mengikuti pola bertanda hubung yang sama.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| ---------- | --------- | ---------- |
| Kebutuhan Fungsional | KF-XX | Sesuai SKPL. Nomor urut dua digit mulai dari 01 (contoh: KF-01). |
| Kebutuhan Non-Fungsional | KNF-XX | Sesuai SKPL. Nomor urut dua digit mulai dari 01 (contoh: KNF-01). |
| _Use Case_ | UC-XX | Sesuai SKPL. Nomor urut dua digit mulai dari 01 (contoh: UC-01). |
| Kelas | C-XX | Sesuai DPPL. Nomor urut dua digit mulai dari 01 (contoh: C-01). |
| Algoritma | Algo-XXX | Sesuai DPPL. Nomor urut tiga digit mulai dari 001 (contoh: Algo-001). |
| _Query_ | Q-XXX | Sesuai DPPL. Nomor urut tiga digit mulai dari 001 (contoh: Q-001). |
| Antarmuka | I-XX | Sesuai DPPL. Nomor urut dua digit mulai dari 01 (contoh: I-01). |
| Objek antarmuka | I-XX-YY | Sesuai DPPL. ID antarmuka diikuti nomor urut objek dua digit (contoh: I-04-07). |
| _Test Case_ Unit | C-XX-UTYY | XX adalah nomor kelas, YY adalah nomor urut _test case_ unit pada kelas tersebut (contoh: C-05-UT01). |
| _Test Case_ Integrasi | INT-TCYY | YY adalah nomor urut _test case_ integrasi (contoh: INT-TC01). |
| _Test Case_ _Use Case_ | UC-XX-TCYY | XX adalah nomor _use case_, YY adalah nomor urut _test case_ pada _use case_ tersebut (contoh: UC-04-TC02). |
| _Test Case_ KNF | KNF-XX-TCYY | XX adalah nomor KNF, YY adalah nomor urut _test case_ pada KNF tersebut (contoh: KNF-01-TC01). |

## 1.5 Referensi

Dokumen ini merujuk pada sumber-sumber berikut.

1. Kelompok G04 K01, dokumen _Spesifikasi Kebutuhan Perangkat Lunak (SKPL)_ untuk Sehati, IF2150 Rekayasa Perangkat Lunak.
2. Kelompok G04 K01, dokumen _Arsitektur Perangkat Lunak (APL)_ untuk Sehati, IF2150 Rekayasa Perangkat Lunak.
3. Kelompok G04 K01, dokumen _Deskripsi Perancangan Perangkat Lunak (DPPL)_ untuk Sehati, IF2150 Rekayasa Perangkat Lunak.
4. Kelompok G04 K01, dokumen _Implementasi_ (Tugas 9) untuk Sehati, IF2150 Rekayasa Perangkat Lunak.
5. Kelompok G04 K01, repositori kode Sehati beserta panduan menjalankan aplikasi pada `src/README.md`. https://github.com/sbxte/IF2150-RPL-K01-G04
6. Google, _Google Calendar API Documentation_. https://developers.google.com/calendar
7. Google, _Google Identity: OAuth 2.0_. https://developers.google.com/identity/protocols/oauth2
8. Cloudflare, _Cloudflare Workers Documentation_. https://developers.cloudflare.com/workers/
9. Cloudflare, _Cloudflare D1 Documentation_. https://developers.cloudflare.com/d1/
10. Hono, _Hono Documentation_. https://hono.dev/
11. Expo, _Expo Documentation_ (Expo Router, Notifications, EAS Build). https://docs.expo.dev/
12. Vitest, _Vitest Documentation_. https://vitest.dev/

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)

Dokumen ini disusun dalam lima bab. BAB 1 memuat pendahuluan yang mencakup tujuan, lingkup masalah, definisi istilah, aturan penomoran, referensi, dan ikhtisar dokumen. BAB 2 memberikan gambaran umum Sehati, batasannya terhadap sistem eksternal, serta _use case diagram_-nya. BAB 3 menjabarkan hasil implementasi, yaitu lingkungan implementasi, pemetaan kelas dan antarmuka DPPL ke berkas kode, serta berkas pendukung lainnya. BAB 4 melaporkan hasil pengujian, mulai dari strategi pengujian, pengujian unit kelas, pengujian integrasi, pengujian _use case_, pengujian kebutuhan nonfungsional, hingga tangkapan layar sebagai bukti. BAB 5 menutup dokumen dengan matriks _traceability_ yang menghubungkan kebutuhan, _use case_, kelas, dan _test case_.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Sehati adalah aplikasi _mobile_ (Android dan iOS) yang mendukung kesehatan mental dan kesejahteraan mahasiswa, sejalan dengan SDG 3 (_ensure healthy lives and promote well-being for all at all ages_). Aplikasi ini digunakan oleh dua aktor. Mahasiswa memakai Sehati untuk menerima _daily affirmations_, mengatur pengingat makan, tidur, dan olahraga, melihat kalender gabungan, memesan sesi konsultasi, membaca FAQ, mengajukan pertanyaan, dan memberi umpan balik. Administrator memakai aplikasi yang sama untuk mengelola jadwal konsultan, FAQ, dan umpan balik, serta memantau status _server_. Kedua aktor masuk melalui akun Google.

Sesuai DPPL, Sehati dibangun dengan gabungan pattern _Client-Server_ dan MVC. Seluruh _View_ berjalan di aplikasi React Native (Expo) pada perangkat pengguna, sedangkan _Controller_, _Model_, dan integrasi eksternal berjalan di _server_ Hono pada Cloudflare Workers dengan data tersimpan di Cloudflare D1. Gambar 2.1 menunjukkan batas sistem Sehati beserta keterkaitannya dengan sistem di luarnya.

```mermaid
---
config:
  layout: elk
---
flowchart LR
    MHS(["Mahasiswa"])
    ADM(["Administrator"])

    subgraph SEHATI["Sistem Sehati"]
        direction TB
        APP["Aplikasi Mobile<br/>React Native (Expo), Android dan iOS<br/>(View)"]
        API["Server REST API<br/>Hono di Cloudflare Workers<br/>(Controller dan Model)"]
        CRON["Cloudflare Cron Trigger<br/>afirmasi, pengingat, status, pembersihan"]
        DB[("Cloudflare D1")]
        APP -->|"HTTP request / JSON response"| API
        CRON -->|"menjalankan tugas terjadwal"| API
        API -->|"baca/tulis"| DB
    end

    GAUTH["Google OAuth 2.0<br/>(sistem eksternal)"]
    GCAL["Google Calendar API<br/>(sistem eksternal)"]
    PUSH["Expo Push Service<br/>(sistem eksternal)"]

    MHS --> APP
    ADM --> APP
    APP -.->|"halaman login Google"| GAUTH
    API -.->|"tukar kode otorisasi"| GAUTH
    API -.->|"ambil event kalender"| GCAL
    API -.->|"kirim push notification"| PUSH
    PUSH -.->|"notifikasi ke perangkat"| APP

    style GAUTH stroke-dasharray: 5 5
    style GCAL stroke-dasharray: 5 5
    style PUSH stroke-dasharray: 5 5
```

<p align="center">
<i>Gambar 2.1. System Overview P/L Sehati</i>
</p>

Batas sistem pada Gambar 2.1 adalah sebagai berikut.

- **Di dalam sistem** terdapat aplikasi _mobile_, _server_ REST API, tugas terjadwal (_cron_), dan basis data D1. Seluruh data Sehati, seperti jadwal konsultasi, afirmasi, pengingat, FAQ, umpan balik, dan status _server_, disimpan di D1 dan hanya diakses melalui _server_. Aplikasi _mobile_ tidak pernah mengakses basis data secara langsung.
- **Google OAuth 2.0** dipakai untuk autentikasi (UC-11). Aplikasi membuka halaman login Google, lalu _server_ menukar kode otorisasi dengan token dan menyimpan token Google pengguna dalam bentuk terenkripsi. Sehati tidak pernah mengetahui kata sandi pengguna.
- **Google Calendar API** dipakai dengan akses baca untuk menampilkan kalender gabungan (UC-03) dan mendeteksi bentrok jadwal saat pemesanan sesi (UC-04). Bila layanan ini tidak tersedia, kalender tetap menampilkan jadwal konsultasi dari D1.
- **Expo Push Service** meneruskan _push notification_ afirmasi (UC-01) dan pengingat (UC-02) dari _server_ ke perangkat pengguna yang sudah terdaftar setelah login.
- Sesuai batasan SKPL, Sehati **tidak** mencakup layanan konseling darurat, rekam medis, sistem pembayaran, versi web atau desktop, maupun forum antarpengguna.

Interaksi kedua aktor dengan Sehati dimodelkan dalam dua belas _use case_ pada Tabel 2.1 dan Gambar 2.2.

Tabel 2.1. Daftar _Use Case_

| ID UC | Nama _Use Case_ | Deskripsi Singkat | Aktor Terlibat |
| ----- | --------------- | ----------------- | -------------- |
| UC-01 | Menyetel _Daily Affirmations_ | Mahasiswa mengatur waktu penerimaan _daily affirmations_ dan menerima notifikasinya. | Mahasiswa |
| UC-02 | Menyetel Pengingat Kesehatan | Mahasiswa mengatur waktu pengingat makan, tidur, dan olahraga, serta menerima notifikasinya. | Mahasiswa |
| UC-03 | Melihat Kalender Terintegrasi | Mahasiswa melihat jadwal gabungan antara Google Calendar dan jadwal sesi konsultasi dalam satu tampilan. | Mahasiswa |
| UC-04 | Memesan Sesi Konsultasi | Mahasiswa memilih dan memesan sesi konsultasi pada jadwal yang tersedia. | Mahasiswa |
| UC-05 | Mengelola Jadwal Konsultan | Administrator memasukkan dan memperbarui jadwal sesi konsultasi tanpa mengubah _source code_. | Administrator |
| UC-06 | Melihat FAQ | Mahasiswa membuka dan mencari daftar pertanyaan yang sering diajukan. | Mahasiswa |
| UC-07 | Mengelola FAQ | Administrator menambah, mengubah, atau menghapus daftar FAQ. | Administrator |
| UC-08 | Memberikan Umpan Balik | Mahasiswa mengirimkan umpan balik terhadap aplikasi. | Mahasiswa |
| UC-09 | Menanggapi Umpan Balik | Administrator melihat dan memberikan tanggapan atas umpan balik yang masuk. | Administrator |
| UC-10 | Memantau Status _Server_ | Administrator memeriksa status _up/down_ _server_ secara berkala. | Administrator |
| UC-11 | Masuk Melalui Akun Google | Pengguna _log in_ ke aplikasi menggunakan akun Google sebelum mengakses fitur lainnya. | Mahasiswa, Administrator |
| UC-12 | Form Pengajuan Pertanyaan | Mahasiswa mengajukan pertanyaan di luar yang ada di FAQ. | Mahasiswa |

<p align="center">
<img alt="Use Case Diagram Sehati" src="./assets/UCD.png" width="90%">
</p>
<p align="center">
<i>Gambar 2.2. Use Case Diagram Sehati</i>
</p>

Gambar 2.2 menunjukkan bahwa UC-11 (Masuk Melalui Akun Google) terhubung dengan kedua aktor dan menjadi pintu masuk sebelum fitur lain dapat diakses. Mahasiswa terhubung langsung dengan _use case_ kesejahteraan pribadi dan layanan konsultasi (UC-01 sampai UC-04, UC-06, dan UC-08). UC-04 (Memesan Sesi Konsultasi) meng-_include_ UC-03 (Melihat Kalender Terintegrasi) karena pemesanan memeriksa bentrok terhadap kalender pengguna, sedangkan UC-12 (Form Pengajuan Pertanyaan) meng-_extend_ UC-06 (Melihat FAQ) karena formulir hanya dibuka bila jawaban tidak ditemukan di FAQ. Administrator terhubung dengan _use case_ pengelolaan (UC-05, UC-07, UC-09, dan UC-10). Pengujian _use case_ pada BAB 4 mengikuti daftar ini.

<br>

---

# BAB 3: Implementasi

Bab ini menjabarkan elemen P/L Sehati yang telah dikembangkan pada _tag release_ `v9.1`, yaitu lingkungan implementasi, pemetaan kelas dan antarmuka DPPL ke berkas kode, serta berkas pendukung lainnya. Kode sumber berada pada folder `src/` repositori, terbagi menjadi `src/backend/` (_server_) dan `src/mobile/` (aplikasi _mobile_). Hasil eksekusinya ada dua: Worker `sehati-backend` yang di-_deploy_ ke Cloudflare pada `https://sehati.sbxte.net`, dan berkas `sehati-v9.1.apk` yang dilampirkan pada rilis `v9.1`. Perubahan implementasi terhadap rancangan DPPL tercatat pada Tabel B.1 dokumen Implementasi (Tugas 9).

## 3.1 Lingkungan Implementasi

Lingkungan implementasi mengikuti Subbab 2.1 DPPL, yaitu _server_ Hono di Cloudflare Workers dengan basis data Cloudflare D1 dan aplikasi React Native (Expo) untuk Android dan iOS. Terdapat beberapa tambahan dibanding DPPL. Drizzle ORM dipakai untuk mendefinisikan skema dan kueri D1. Bun dipakai sebagai _package manager_. EAS Build dipakai untuk membuat APK. Expo Push Service menjadi sistem eksternal untuk mengirim _push notification_. Vitest dipakai sebagai alat pengujian. Versi Android dan iOS pada Tabel 3.1 adalah versi terbaru yang menjadi sasaran aplikasi.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| --- | --- |
| _Hardware_ | _Client_: ponsel pintar Android dan iPhone. _Server_: jaringan _edge_ Cloudflare (Cloudflare Workers dan Cloudflare D1), tanpa _server_ fisik yang dikelola sendiri. |
| _Operating System_ | _Client_: Android 17 dan iOS 27.2.1. _Server_: Cloudflare Workers (V8 _isolates_), tanpa OS tradisional. |
| _Bahasa Pemrograman_ | TypeScript 7 (_server_) dan TypeScript 6 (_client_) |
| _Framework/Library_ | _Server_: Hono 4.13, Drizzle ORM 0.45. _Client_: Expo SDK 58, React Native 0.88.1, React 19.3, Expo Router 58, expo-notifications 58.1, expo-secure-store 58, expo-web-browser 58, @react-native-community/datetimepicker 9.2, lucide-react-native 1.69 |
| _DBMS_ | Cloudflare D1 (SQLite terkelola); migrasi dibuat dengan drizzle-kit 0.31 |
| _Development Tools_ | Git dan GitHub, Bun 1.4.4, Wrangler 4.160 (Cloudflare Workers), Expo CLI, EAS CLI dan EAS Build, ESLint 9 |
| _Testing Tools_ | Vitest 5.1 (unit dan integrasi, _server_ dan _client_), better-sqlite3 13 (D1 tiruan di memori untuk pengujian _server_), `tsc --noEmit` (pemeriksaan tipe), `expo lint`, Expo Go dan APK pada perangkat fisik untuk pengujian _use case_ |

## 3.2 Implementasi Modul

Tabel 3.2 memetakan seluruh 36 kelas perancangan DPPL ke berkas kode, konsisten dengan Tabel B.5 dokumen Implementasi (Tugas 9). Kelas _model_ dan _controller_ dijalankan sebagai bagian Worker `sehati-backend`, sedangkan kelas _view_ dijalankan dalam aplikasi `sehati-v9.1.apk`. Satu kelas dapat terwujud dalam beberapa berkas, misalnya tabel basis data di `schema.ts` dan kuerinya di `queries.ts`.

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| --- | --- | --- | --- | --- |
| 1 | C-01 | `Pengguna` | `src/backend/src/db/schema.ts` (`pengguna`) | Worker `sehati-backend` |
| 2 | C-02 | `Mahasiswa` | `src/backend/src/db/schema.ts` (`mahasiswa`) | Worker `sehati-backend` |
| 3 | C-03 | `Administrator` | `src/backend/src/db/schema.ts` (`pengguna.peran`), `src/backend/src/middleware/auth.ts` (`requireRole`) | Worker `sehati-backend` |
| 4 | C-04 | `SesiAutentikasi` | `src/backend/src/db/schema.ts`, `src/backend/src/middleware/auth.ts`, `src/backend/src/routes/auth.ts`; `src/mobile/src/api/sesi.ts`, `src/mobile/src/lib/sesi.tsx` | Worker `sehati-backend`; `sehati-v9.1.apk` |
| 5 | C-05 | `DailyAffirmation` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/jobs/scheduler.ts` | Worker `sehati-backend` |
| 6 | C-06 | `Reminder` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/jobs/scheduler.ts` | Worker `sehati-backend` |
| 7 | C-07 | `Notifikasi` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/jobs/scheduler.ts`; `src/mobile/src/lib/notifikasi.ts` | Worker `sehati-backend`; `sehati-v9.1.apk` |
| 8 | C-08 | `GoogleCalendarService` | `src/backend/src/lib/google.ts` | Worker `sehati-backend` |
| 9 | C-09 | `KalenderGabungan` | `src/backend/src/lib/kalender.ts` | Worker `sehati-backend` |
| 10 | C-10 | `Konsultan` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts` | Worker `sehati-backend` |
| 11 | C-11 | `JadwalKonsultasi` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/lib/jadwal-konsultasi.ts` | Worker `sehati-backend` |
| 12 | C-12 | `FAQ` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts` | Worker `sehati-backend` |
| 13 | C-13 | `PengajuanPertanyaan` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts` | Worker `sehati-backend` |
| 14 | C-14 | `UmpanBalik` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts` | Worker `sehati-backend` |
| 15 | C-15 | `StatusServer` | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts` | Worker `sehati-backend` |
| 16 | C-16 | `LoginView` | `src/mobile/src/app/index.tsx`, `src/mobile/src/api/auth.ts` | `sehati-v9.1.apk` |
| 17 | C-17 | `AffirmationView` | `src/mobile/src/app/(mahasiswa)/afirmasi.tsx`, `src/mobile/src/api/afirmasi.ts` | `sehati-v9.1.apk` |
| 18 | C-18 | `ReminderView` | `src/mobile/src/app/(mahasiswa)/pengingat.tsx`, `src/mobile/src/api/pengingat.ts` | `sehati-v9.1.apk` |
| 19 | C-19 | `CalendarView` | `src/mobile/src/app/(mahasiswa)/kalender.tsx`, `src/mobile/src/api/kalender.ts`, `src/mobile/src/lib/kalender.ts` | `sehati-v9.1.apk` |
| 20 | C-20 | `ConsultationBookingView` | `src/mobile/src/app/(mahasiswa)/konsultasi.tsx`, `src/mobile/src/app/(mahasiswa)/sesi.tsx`, `src/mobile/src/api/konsultasi.ts` | `sehati-v9.1.apk` |
| 21 | C-21 | `ConsultationManagementView` | `src/mobile/src/app/admin/jadwal.tsx`, `src/mobile/src/lib/jadwal.ts` | `sehati-v9.1.apk` |
| 22 | C-22 | `FAQView` | `src/mobile/src/app/(mahasiswa)/faq.tsx`, `src/mobile/src/app/(mahasiswa)/pertanyaan.tsx`, `src/mobile/src/app/admin/faq.tsx`, `src/mobile/src/app/admin/faq-form.tsx`, `src/mobile/src/app/admin/pertanyaan.tsx`, `src/mobile/src/api/faq.ts` | `sehati-v9.1.apk` |
| 23 | C-23 | `FeedbackView` | `src/mobile/src/app/(mahasiswa)/umpan-balik.tsx`, `src/mobile/src/app/admin/umpan-balik.tsx`, `src/mobile/src/api/umpan-balik.ts` | `sehati-v9.1.apk` |
| 24 | C-24 | `ServerStatusView` | `src/mobile/src/app/admin/status.tsx`, `src/mobile/src/lib/status.ts`, `src/mobile/src/api/status.ts` | `sehati-v9.1.apk` |
| 25 | C-25 | `AuthController` | `src/backend/src/routes/auth.ts` | Worker `sehati-backend` |
| 26 | C-26 | `AffirmationController` | `src/backend/src/routes/affirmation.ts` (`affirmationRoutes`) | Worker `sehati-backend` |
| 27 | C-27 | `ReminderController` | `src/backend/src/routes/affirmation.ts` (`reminderRoutes`) | Worker `sehati-backend` |
| 28 | C-28 | `CalendarController` | `src/backend/src/routes/consultation.ts` (`calendarRoutes`) | Worker `sehati-backend` |
| 29 | C-29 | `ConsultationController` | `src/backend/src/routes/consultation.ts` (`consultantRoutes`, `slotRoutes`, `sessionRoutes`) | Worker `sehati-backend` |
| 30 | C-30 | `FAQController` | `src/backend/src/routes/faq.ts`, `src/backend/src/routes/questions.ts` | Worker `sehati-backend` |
| 31 | C-31 | `FeedbackController` | `src/backend/src/routes/feedback.ts` | Worker `sehati-backend` |
| 32 | C-32 | `ServerStatusController` | `src/backend/src/routes/status.ts`, `src/backend/src/lib/status-probe.ts`, `src/backend/src/jobs/scheduler.ts` | Worker `sehati-backend` |
| 33 | C-33 | `Validasi` | `src/backend/src/lib/validasi.ts` | Worker `sehati-backend` |
| 34 | C-34 | `GoogleAuthService` | `src/backend/src/lib/google.ts`, `src/backend/src/lib/crypto.ts` | Worker `sehati-backend` |
| 35 | C-35 | `CloudflareD1Database` | `src/backend/wrangler.jsonc` (_binding_ `D1`), `src/backend/src/index.ts` | Worker `sehati-backend` |
| 36 | C-36 | `HomeView` | `src/mobile/src/app/(mahasiswa)/beranda.tsx`, `src/mobile/src/app/admin/index.tsx`, `src/mobile/src/views/beranda/`, `src/mobile/src/lib/muatan.ts` | `sehati-v9.1.apk` |

## 3.3 Implementasi Antarmuka

Seluruh 15 antarmuka DPPL telah diimplementasikan sebagai layar Expo Router di `src/mobile/src/app/`. Satu berkas `.tsx` pada folder tersebut adalah satu layar (_route_). Layar Mahasiswa berada pada grup `(mahasiswa)` dengan _tab bar_, sedangkan layar Administrator berada pada _stack_ `admin`. Selain itu terdapat satu layar tambahan di luar DPPL, yaitu Pertanyaan Masuk untuk Administrator (lihat Daftar Perubahan REV-M10-01).

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| --- | --- | --- | --- | --- |
| 1 | I-01 | Masuk | `src/mobile/src/app/index.tsx` | `sehati-v9.1.apk` |
| 2 | I-02 | Beranda Mahasiswa | `src/mobile/src/app/(mahasiswa)/beranda.tsx` | `sehati-v9.1.apk` |
| 3 | I-03 | Beranda Administrator | `src/mobile/src/app/admin/index.tsx` | `sehati-v9.1.apk` |
| 4 | I-04 | Daily Affirmations | `src/mobile/src/app/(mahasiswa)/afirmasi.tsx` | `sehati-v9.1.apk` |
| 5 | I-05 | Pengingat Kesehatan | `src/mobile/src/app/(mahasiswa)/pengingat.tsx` | `sehati-v9.1.apk` |
| 6 | I-06 | Kalender Terintegrasi | `src/mobile/src/app/(mahasiswa)/kalender.tsx` | `sehati-v9.1.apk` |
| 7 | I-07 | Pilih Konsultan | `src/mobile/src/app/(mahasiswa)/konsultasi.tsx` | `sehati-v9.1.apk` |
| 8 | I-08 | Pilih Sesi dan Konfirmasi | `src/mobile/src/app/(mahasiswa)/sesi.tsx` | `sehati-v9.1.apk` |
| 9 | I-09 | FAQ dan Pencarian | `src/mobile/src/app/(mahasiswa)/faq.tsx` | `sehati-v9.1.apk` |
| 10 | I-10 | Form Pengajuan Pertanyaan | `src/mobile/src/app/(mahasiswa)/pertanyaan.tsx` | `sehati-v9.1.apk` |
| 11 | I-11 | Umpan Balik | `src/mobile/src/app/(mahasiswa)/umpan-balik.tsx` | `sehati-v9.1.apk` |
| 12 | I-12 | Kelola Jadwal Konsultan | `src/mobile/src/app/admin/jadwal.tsx` | `sehati-v9.1.apk` |
| 13 | I-13 | Kelola FAQ | `src/mobile/src/app/admin/faq.tsx`, `src/mobile/src/app/admin/faq-form.tsx` (formulir I-13-05) | `sehati-v9.1.apk` |
| 14 | I-14 | Tanggapi Umpan Balik | `src/mobile/src/app/admin/umpan-balik.tsx` | `sehati-v9.1.apk` |
| 15 | I-15 | Status Server | `src/mobile/src/app/admin/status.tsx` | `sehati-v9.1.apk` |
| 16 | - | Pertanyaan Masuk (tambahan, Administrator) | `src/mobile/src/app/admin/pertanyaan.tsx` | `sehati-v9.1.apk` |

Komponen antarmuka bersama yang dipakai lintas layar (`AppBar`, `Tombol`, `Banner`, `Lencana`, `TabBar`, dan lain-lain) berada di `src/mobile/src/components/`, dengan token warna, jarak, dan tipografi dari rancangan Figma di `src/mobile/src/theme/`.

## 3.4 File Lain

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| --- | --- | --- |
| 1 | `src/backend/src/index.ts` | Titik masuk Worker: _middleware_ CORS dan basis data, pemasangan seluruh rute `/api/*`, rute `/health` dan `/health/db`, serta _handler_ `scheduled` untuk _cron_. |
| 2 | `src/backend/src/config.ts` | Konstanta aplikasi (`BATAS_SESI_HARI`, `KONTEN_BAWAAN`, jenis pengingat dan status) dan pembacaan variabel lingkungan. |
| 3 | `src/backend/src/lib/errors.ts`, `src/backend/src/lib/http.ts` | Format galat API yang seragam (kode status dan pesan) serta pembacaan _body_ dan _query_ permintaan. |
| 4 | `src/backend/src/lib/crypto.ts` | Enkripsi dan dekripsi AES-256-GCM untuk token Google yang disimpan. |
| 5 | `src/backend/wrangler.jsonc` | Konfigurasi Worker: nama, _binding_ D1, tiga Cron Trigger, dan variabel `API_BASE_URL`, `GOOGLE_REDIRECT_URI`, `MODE_DEMO`. |
| 6 | `src/backend/.env.example` | Contoh variabel rahasia (`KUNCI_TOKEN`, kredensial Google) tanpa nilai asli. |
| 7 | `src/backend/migrations/0000_*.sql` s.d. `0004_*.sql`, `migrations/meta/` | Migrasi skema D1 yang dihasilkan drizzle-kit dari `schema.ts`. |
| 8 | `src/backend/seed/seed.sql` | Data uji: akun Mahasiswa dan Administrator demo, konsultan, slot jadwal, dan contoh FAQ. |
| 9 | `src/backend/test/*.test.ts`, `src/backend/test/harness.ts`, `src/backend/src/index.test.ts` | Pengujian _server_ dengan Vitest; _harness_ membuat D1 tiruan di memori dari berkas migrasi. |
| 10 | `src/backend/package.json`, `bun.lock`, `tsconfig.json` | Dependensi, skrip (`dev`, `test`, `typecheck`, `db:*`), dan konfigurasi TypeScript _server_. |
| 11 | `src/mobile/app.json`, `src/mobile/app.config.ts` | Konfigurasi aplikasi Expo: nama, _scheme_ `sehati`, _package_ Android `com.k01g04.sehati`, _plugin_, dan pembacaan `google-services.json` dari _secret_ EAS. |
| 12 | `src/mobile/eas.json` | Profil EAS Build `development` dan `production` (APK, alamat _backend_, mode demo). |
| 13 | `src/mobile/.env.example` | Contoh variabel `EXPO_PUBLIC_API_URL` dan `EXPO_PUBLIC_MODE_DEMO`. |
| 14 | `src/mobile/src/app/_layout.tsx`, `(mahasiswa)/_layout.tsx`, `admin/_layout.tsx`, `+native-intent.tsx` | Navigasi: pemuatan font dan sesi, _handler_ notifikasi, grup _tab_ Mahasiswa, _stack_ Administrator, dan penanganan _deep link_ login. |
| 15 | `src/mobile/src/api/client.ts` | Klien HTTP ke REST API: alamat dasar, token sesi, dan penerjemahan galat. |
| 16 | `src/mobile/src/api/perangkat.ts`, `src/mobile/src/lib/waktu.ts` | Pendaftaran token _push_ ke _server_ dan format tanggal/jam WIB. |
| 17 | `src/mobile/src/components/`, `src/mobile/src/theme/`, `src/mobile/src/views/beranda/` | Komponen antarmuka bersama, token desain, dan kartu-kartu Beranda. |
| 18 | `src/mobile/assets/` | Logo, ikon aplikasi, dan _splash screen_. |
| 19 | `src/mobile/test/*.test.ts`, `src/mobile/vitest.config.mts` | Pengujian _client_ dengan Vitest (klien API dan logika tampilan, tanpa _render_ komponen). |
| 20 | `src/mobile/package.json`, `bun.lock`, `tsconfig.json`, `eslint.config.js` | Dependensi, skrip (`go`, `test`, `lint`, `typecheck`), dan konfigurasi TypeScript serta ESLint _client_. |
| 21 | `src/README.md`, `src/backend/README.md` | Panduan instalasi, konfigurasi, menjalankan, menguji, dan merilis aplikasi. |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti _entity/DTO_ dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| -------- | ---------- | ------- | ------ | ----------------- |
| C-01 | `Pengguna` | Tidak perlu | Entitas data akun (nama, email, peran) tanpa logika; dibuat dan dibaca oleh `AuthController`. | - (teruji lewat UC-11-TC01) |
| C-02 | `Mahasiswa` | Tidak perlu | Entitas data Mahasiswa (NIM) tanpa logika. | - (teruji lewat UC-11-TC01) |
| C-03 | `Administrator` | Tidak perlu | Peran pada data pengguna tanpa logika; pembatasan aksesnya diuji pada kelas _controller_ dan _middleware_. | - (teruji lewat UC-11-TC01) |
| C-04 | `SesiAutentikasi` | Mendalam | Memuat aturan keamanan: verifikasi token dan batas umur sesi 30 hari (`verifikasiToken`), _logout_, serta validasi dan penyimpanan token _push_ (`daftarkanPerangkat`). | C-04-UT01 dst. |
| C-05 | `DailyAffirmation` | Mendalam | Memuat `aturWaktuKirim` (Algo-004, buat atau perbarui dengan konten bawaan) dan pencarian afirmasi jatuh tempo per menit WIB (Algo-005, Q-004). | C-05-UT01 dst. |
| C-06 | `Reminder` | Mendalam | Memuat `aturWaktuKirim` per jenis (Algo-006), penghapusan per jenis, dan pencarian pengingat jatuh tempo (Algo-007, Q-005). | C-06-UT01 dst. |
| C-07 | `Notifikasi` | Mendalam | Memuat `kirimNotifikasi` (Algo-008): pencatatan dengan tepat satu sumber, pembagian _batch_ maksimal 100 pesan, dan pengosongan token yang ditolak `DeviceNotRegistered`. | C-07-UT01 dst. |
| C-08 | `GoogleCalendarService` | Mendalam | Integrasi eksternal: mengambil _event_ Google Calendar (Algo-009), memperbarui token, dan mendeteksi bentrok terhadap kalender pengguna. | C-08-UT01 dst. |
| C-09 | `KalenderGabungan` | Mendalam | Memuat algoritma penggabungan _event_ Google dengan jadwal konsultasi (Algo-011) dan aturan bentrok jadwal. | C-09-UT01 dst. |
| C-10 | `Konsultan` | Tidak perlu | Entitas data konsultan tanpa logika; daftarnya hanya dibaca. | - (teruji lewat UC-04-TC01, UC-05-TC01) |
| C-11 | `JadwalKonsultasi` | Mendalam | Memuat aturan status slot (tersedia/terpesan), pemesanan, serta penyimpanan dan pengubahan slot yang menolak tumpang tindih di dalam _statement_ agar aman terhadap _race condition_ (Algo-029, Q-027). | C-11-UT01 dst. |
| C-12 | `FAQ` | Sedang | Kueri daftar, pencarian kata kunci, dan pengurutan (Q-015) tanpa aturan bisnis; _escaping_ pola pencarian berada di `Validasi`. | C-12-UT01 dst. |
| C-13 | `PengajuanPertanyaan` | Tidak perlu | Entitas pertanyaan dengan kueri simpan, daftar, dan hapus sederhana; perilakunya diuji melalui `FAQController`. | - (teruji lewat UC-12-TC01) |
| C-14 | `UmpanBalik` | Sedang | Kueri simpan, daftar dengan penyaring status, dan tanggapan; penyaring status dan pembatasan milik pengguna perlu dipastikan. | C-14-UT01 dst. |
| C-15 | `StatusServer` | Tidak perlu | Entitas hasil pemeriksaan (`jenis`, `statusUptime`, `waktuCek`) tanpa logika; logika pemeriksaan berada di `ServerStatusController`. | - (teruji lewat UC-10-TC01) |
| C-16 | `LoginView` | Sedang | Mengoordinasikan alur login Google di peramban aplikasi: menunggu _redirect_ atau _deep link_ dan menangani pembatalan. | C-16-UT01 dst. |
| C-17 | `AffirmationView` | Tidak perlu | Layar I-04 yang hanya menampilkan data dan meneruskan aksi ke klien API. | - (teruji lewat UC-01-TC01, UC-01-TC02) |
| C-18 | `ReminderView` | Tidak perlu | Layar I-05 yang hanya menampilkan data dan meneruskan aksi ke klien API. | - (teruji lewat UC-02-TC01, UC-02-TC02) |
| C-19 | `CalendarView` | Sedang | Memuat logika tampilan kalender, yaitu penyaringan _event_ per hari, label waktu, dan penanda sumber _event_. | C-19-UT01 dst. |
| C-20 | `ConsultationBookingView` | Tidak perlu | Layar I-07 dan I-08 yang hanya menampilkan slot dan meneruskan pemesanan ke klien API. | - (teruji lewat UC-04-TC01 s.d. UC-04-TC03) |
| C-21 | `ConsultationManagementView` | Sedang | Memuat logika tampilan I-12: daftar tanggal dan jam dalam WIB, pembacaan masukan jam, serta validasi slot di sisi _client_. | C-21-UT01 dst. |
| C-22 | `FAQView` | Tidak perlu | Layar I-09, I-10, dan I-13 yang hanya menampilkan data dan meneruskan aksi ke klien API. | - (teruji lewat UC-06, UC-07, UC-12) |
| C-23 | `FeedbackView` | Tidak perlu | Layar I-11 dan I-14 yang hanya menampilkan data dan meneruskan aksi ke klien API. | - (teruji lewat UC-08, UC-09) |
| C-24 | `ServerStatusView` | Sedang | Memuat logika tampilan status: lencana Up/Down, status "Belum dicek", dan waktu pemeriksaan terakhir. | C-24-UT01 dst. |
| C-25 | `AuthController` | Sedang | Mengoordinasikan login Google, login demo, _logout_, dan pendaftaran perangkat dengan mendelegasikan ke `GoogleAuthService` dan `SesiAutentikasi`. | C-25-UT01 dst. |
| C-26 | `AffirmationController` | Sedang | Mendelegasikan validasi waktu ke `Validasi` lalu penyimpanan ke `DailyAffirmation`. | C-26-UT01 dst. |
| C-27 | `ReminderController` | Sedang | Mendelegasikan validasi jenis dan waktu ke `Validasi` lalu penyimpanan ke `Reminder`. | C-27-UT01 dst. |
| C-28 | `CalendarController` | Sedang | Mengoordinasikan pengambilan _event_ Google dan jadwal konsultasi lalu penggabungannya, termasuk penurunan ke jadwal saja bila Google gagal. | C-28-UT01 dst. |
| C-29 | `ConsultationController` | Mendalam | Memuat aturan pemesanan: hanya slot tersedia yang dapat dipesan, satu sesi per hari, konfirmasi bentrok Google Calendar, serta perbedaan daftar slot per peran. | C-29-UT01 dst. |
| C-30 | `FAQController` | Sedang | Mendelegasikan validasi masukan ke `Validasi` lalu operasi FAQ dan pengajuan pertanyaan ke kelas _model_, dengan pembatasan peran. | C-30-UT01 dst. |
| C-31 | `FeedbackController` | Sedang | Mendelegasikan validasi masukan ke `Validasi` lalu operasi umpan balik ke `UmpanBalik`, dengan pembatasan peran. | C-31-UT01 dst. |
| C-32 | `ServerStatusController` | Mendalam | Memuat logika pemeriksaan status (Algo-021): dua alamat pemeriksaan, batas waktu 5 detik, hanya 2xx dihitung _up_, dan batas kesegaran 30 detik untuk "Periksa Sekarang". | C-32-UT01 dst. |
| C-33 | `Validasi` | Mendalam | Memuat seluruh aturan validasi masukan (Algo-023, Algo-025, Algo-026): format waktu, rentang jadwal, isian kosong, format token _push_, ISO 8601, dan _escaping_ pola pencarian. | C-33-UT01 dst. |
| C-34 | `GoogleAuthService` | Mendalam | Integrasi eksternal dan keamanan: penukaran kode otorisasi (Algo-027), pembacaan identitas dari `id_token`, serta enkripsi AES-256-GCM token Google. | C-34-UT01 dst. |
| C-35 | `CloudflareD1Database` | Tidak perlu | Kelas infrastruktur (_binding_ D1 dan Drizzle) tanpa logika aplikasi; teruji secara tidak langsung oleh seluruh pengujian integrasi. | - (teruji lewat INT-TC) |
| C-36 | `HomeView` | Tidak perlu | Layar I-02 dan I-03 yang hanya menampilkan ringkasan data dari _controller_ lain. | - (teruji lewat UC-11-TC01) |

Ringkasan: 11 kelas Mendalam, 12 kelas Sedang, dan 13 kelas Tidak perlu.

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai _coverage_ minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: _[tuliskan perintah, mis. `pytest src/tests/`]_.

Lokasi file test: _[path, mis. `src/tests/`]_.

### 4.2.1 Kelas [Nama Kelas 1]

**ID Kelas:** _[C02]_  
**Nama Kelas:** _[Pesanan]_  
**Tingkat:** _[Mendalam]_

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji         | Jenis Kasus | Prosedur/Masukan                                  | Hasil yang Diharapkan                                | Hasil Pengujian  | Kesimpulan  |
| ------------ | -------------------------- | ----------- | ------------------------------------------------- | ---------------------------------------------------- | ---------------- | ----------- |
| _C02-UT01_   | _`hitungTotal(): Decimal`_ | _Normal_    | _Pesanan berisi 2 item: 10.000 x 2 dan 5.000 x 1_ | _Total = 25.000_                                     | _[Hasil aktual]_ | _Pass/Fail_ |
| _C02-UT02_   | _`hitungTotal(): Decimal`_ | _Batas_     | _Pesanan berisi tepat 1 item dengan jumlah 1_     | _Total = harga item tersebut_                        | _[...]_          | _Pass/Fail_ |
| _C02-UT03_   | _`hitungTotal(): Decimal`_ | _Negatif_   | _Pesanan tanpa item_                              | _Total = 0 atau melempar kesalahan sesuai rancangan_ | _[...]_          | _Pass/Fail_ |
| _..._        | _..._                      | _..._       | _..._                                             | _..._                                                | _..._            | _..._       |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi                       | Keterangan                                      |
| ------------------------------- | ----------------------------------------------- |
| Daftar operasi public pada DPPL | _[op1(), op2(), ...]_                           |
| Operasi yang diuji              | _[op1(), op2(), ...]_                           |
| ID Algoritma yang tercakup      | _[Algo-001, ...]_                               |
| Coverage (wajib ≥ 70%)          | _[% baris / % cabang, alat dan bukti pada 4.6]_ |

### 4.2.2 Kelas [Nama Kelas 2]

_[Ulangi pola 4.2.1 untuk setiap kelas bertingkat Mendalam atau Sedang.]_

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu _Controller_ ke _Model_, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan _mock_. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal           | Komponen Tujuan           | Jenis Batas                   | Test Case            |
| ------------ | ----------------------- | ------------------------- | ----------------------------- | -------------------- |
| _I-01_       | _KeranjangController_   | _Keranjang (Model)_       | _Controller - Model_          | _INT-TC01, INT-TC02_ |
| _I-02_       | _Pesanan (Model)_       | _Database_                | _Aplikasi - Basis data_       | _INT-TC03_           |
| _I-03_       | _PaymentGatewayAdapter_ | _Payment Gateway (dummy)_ | _Aplikasi - Sistem eksternal_ | _INT-TC04, INT-TC05_ |
| _[I-XX]_     | _[Komponen asal]_       | _[Komponen tujuan]_       | _[Jenis batas]_               | _[ID test case]_     |
| _..._        | _..._                   | _..._                     | _..._                         | _..._                |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario                                    | Prosedur/Masukan                                                         | Hasil yang Diharapkan                                                              | Hasil Pengujian  | Kesimpulan  |
| ------------ | ------------ | ------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ---------------- | ----------- |
| _INT-TC01_   | _I-01_       | _Normal: tambah item ke keranjang_          | _Panggil `tambahItem()` melalui KeranjangController dengan produk valid_ | _Item tersimpan pada Keranjang dan tampil pada daftar item_                        | _[Hasil aktual]_ | _Pass/Fail_ |
| _INT-TC03_   | _I-02_       | _Normal: simpan pesanan_                    | _Buat pesanan, lalu baca ulang langsung dari basis data_                 | _Baris pesanan ada dengan nilai total dan status yang sama_                        | _[...]_          | _Pass/Fail_ |
| _INT-TC05_   | _I-03_       | _Gagal: gateway mengembalikan status gagal_ | _Kirim otorisasi dengan saldo dummy tidak cukup_                         | _Status pesanan tidak berubah menjadi "Lunas", pesan gagal diteruskan ke pengguna_ | _[...]_          | _Pass/Fail_ |
| _..._        | _..._        | _..._                                       | _..._                                                                    | _..._                                                                              | _..._            | _..._       |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** _[UC01 sesuai SKPL]_  
**Nama Use Case:** _[Nama use case sesuai SKPL]_

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF  | Skenario                        | Prosedur Pengujian                                                             | Masukan                               | Hasil yang Diharapkan                      | Hasil Pengujian                                                         | Kesimpulan                                      |
| ------------ | ------ | ------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------- |
| _UC01-TC01_  | _KF01_ | _Normal_                        | _1. Buka halaman login.<br>2. Masukkan kredensial.<br>3. Klik tombol "Login"._ | _User: rpl@gmail.com<br>Pass: 123456_ | _Pengguna diarahkan ke Halaman Dashboard._ | _Pengguna diarahkan ke Halaman Dashboard sesuai hasil yang diharapkan._ | _Pass_                                          |
| _UC01-TC02_  | _KF01_ | _Alternatif 1: [Nama skenario]_ | _[Langkah-langkah pengujian]_                                                  | _[Data masukan]_                      | _[Hasil yang diharapkan]_                  | _[Hasil aktual]_                                                        | _[Pass/Fail. Jika Fail: penjelasan dan solusi]_ |
| _..._        | _..._  | _..._                           | _..._                                                                          | _..._                                 | _..._                                      | _..._                                                                   | _..._                                           |

### 4.4.2 Use Case [Nama Use Case 2]

_[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]_

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk _response time_ dan inspeksi basis data untuk _security_), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF  | Parameter       | Target Terukur                                                        | Metode dan Alat                                            | Hasil Aktual                            | Kesimpulan  |
| ------------ | ------- | --------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------- | ----------- |
| _KNF01-TC01_ | _KNF01_ | _Reliability_   | _Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi_ | _Simulasi putus koneksi saat bayar, lalu cek status di DB_ | _[Hasil aktual]_                        | _Pass/Fail_ |
| _KNF02-TC01_ | _KNF02_ | _Security_      | _Password tersimpan sebagai hash, bukan plain-text_                   | _Inspeksi tabel pengguna di DB_                            | _[...]_                                 | _Pass/Fail_ |
| _KNFXX-TC01_ | _KNFXX_ | _Response time_ | _Halaman tampil ≤ 4 detik_                                            | _Chrome DevTools, 5 kali ukur, ambil rata-rata_            | _[Rata-rata ... detik, maks ... detik]_ | _Pass/Fail_ |
| _..._        | _..._   | _..._           | _..._                                                                 | _..._                                                      | _..._                                   | _..._       |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran _test runner_, laporan _coverage_ untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian          | Bukti Hasil Pengujian                                            |
| --------------------- | ---------------------------------------------------------------- |
| _C02-UT01 – C02-UT08_ | _[Sisipkan hasil keluaran unit test]_                            |
| _C02 (coverage)_      | _[Sisipkan laporan coverage kelas C02]_                          |
| _INT-TC01_            | _[Sisipkan bukti pengujian integrasi]_                           |
| _UC01-TC01_           | _[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]_ |
| _UC01-TC02_           | _[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]_ |
| _KNF01-TC01_          | _[Sisipkan bukti pengukuran parameter KNF01-TC01]_               |
| _..._                 | _..._                                                            |

<br>

---

# BAB 5: Traceability

Tabel 5.1 memetakan setiap KF ke KNF, _use case_, kelas perancangan, berkas implementasi, dan _test case_, sehingga menjadi sarana verifikasi KF. Daftar KF, KNF, dan pemetaan KF ke _use case_ mengikuti SKPL versi terbaru, pemetaan kelas ke _use case_ mengikuti BAB 7 DPPL, dan berkas implementasi mengikuti Tabel B.5 dokumen Implementasi (Tugas 9) pada _tag release_ `v9.1`. Setiap KF memiliki minimal satu _test case_ dan dinyatakan terpenuhi apabila **seluruh** _test case_ terkaitnya berkesimpulan `Pass`. Seluruh KF telah diimplementasikan.

Setiap skenario _use case_ pada SKPL (skenario normal dan setiap skenario alternatif) diuji oleh satu _test case_ _use case_, dengan nomor urut mengikuti urutan skenario. Pada kolom _Test Case_ (Unit/Integrasi/KNF), `C-XX-UT01 dst.` merujuk seluruh _test case_ unit kelas C-XX pada Subbab 4.2, dan `INT-TC` merujuk _test case_ integrasi pada Subbab 4.3 untuk rute yang disebutkan.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| ----- | ----------- | ----------- | ------------- | ------------------------- | -------------- | ------------------------------ |
| KF-01 | KNF-03 | UC-01 | C-05 - `DailyAffirmation`<br>C-07 - `Notifikasi`<br>C-17 - `AffirmationView`<br>C-26 - `AffirmationController`<br>C-33 - `Validasi` | `src/backend/src/routes/affirmation.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/jobs/scheduler.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/afirmasi.tsx`<br>`src/mobile/src/api/afirmasi.ts` | UC-01-TC01, UC-01-TC02 | C-05-UT01 dst., C-07-UT01 dst., C-26-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/affirmation`)<br>KNF-03-TC01 |
| KF-02 | KNF-03 | UC-03 | C-08 - `GoogleCalendarService`<br>C-09 - `KalenderGabungan`<br>C-19 - `CalendarView`<br>C-28 - `CalendarController` | `src/backend/src/lib/google.ts`<br>`src/backend/src/lib/kalender.ts`<br>`src/backend/src/routes/consultation.ts`<br>`src/mobile/src/app/(mahasiswa)/kalender.tsx`<br>`src/mobile/src/api/kalender.ts`<br>`src/mobile/src/lib/kalender.ts` | UC-03-TC01, UC-03-TC02 | C-08-UT01 dst., C-09-UT01 dst., C-19-UT01 dst., C-28-UT01 dst.<br>INT-TC (rute `/api/calendar`)<br>KNF-03-TC01 |
| KF-03 | KNF-03 | UC-02 | C-06 - `Reminder`<br>C-07 - `Notifikasi`<br>C-18 - `ReminderView`<br>C-27 - `ReminderController`<br>C-33 - `Validasi` | `src/backend/src/routes/affirmation.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/jobs/scheduler.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/pengingat.tsx`<br>`src/mobile/src/api/pengingat.ts` | UC-02-TC01, UC-02-TC02 | C-06-UT01 dst., C-07-UT01 dst., C-27-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/reminders`)<br>KNF-03-TC01 |
| KF-04 | KNF-01 | UC-01<br>UC-02 | C-04 - `SesiAutentikasi`<br>C-07 - `Notifikasi`<br>C-25 - `AuthController` | `src/backend/src/jobs/scheduler.ts`<br>`src/backend/src/routes/auth.ts`<br>`src/mobile/src/lib/notifikasi.ts`<br>`src/mobile/src/api/perangkat.ts`<br>`src/mobile/src/app/_layout.tsx` | UC-01-TC01<br>UC-02-TC01 | C-04-UT01 dst., C-07-UT01 dst., C-25-UT01 dst.<br>INT-TC (rute `/api/auth/device`, tugas _cron_ notifikasi)<br>KNF-01-TC01 |
| KF-05 | KNF-03 | UC-03<br>UC-04 | C-09 - `KalenderGabungan`<br>C-11 - `JadwalKonsultasi`<br>C-19 - `CalendarView`<br>C-28 - `CalendarController` | `src/backend/src/lib/kalender.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/routes/consultation.ts`<br>`src/mobile/src/app/(mahasiswa)/kalender.tsx`<br>`src/mobile/src/lib/kalender.ts` | UC-03-TC01, UC-03-TC02<br>UC-04-TC01, UC-04-TC02, UC-04-TC03 | C-09-UT01 dst., C-11-UT01 dst., C-19-UT01 dst., C-28-UT01 dst.<br>INT-TC (rute `/api/calendar`)<br>KNF-03-TC01 |
| KF-06 | - | UC-03<br>UC-04<br>UC-05 | C-10 - `Konsultan`<br>C-11 - `JadwalKonsultasi`<br>C-20 - `ConsultationBookingView`<br>C-21 - `ConsultationManagementView`<br>C-29 - `ConsultationController` | `src/backend/src/routes/consultation.ts`<br>`src/backend/src/db/queries.ts`<br>`src/mobile/src/app/(mahasiswa)/konsultasi.tsx`<br>`src/mobile/src/app/(mahasiswa)/sesi.tsx`<br>`src/mobile/src/app/admin/jadwal.tsx`<br>`src/mobile/src/api/konsultasi.ts`<br>`src/mobile/src/lib/jadwal.ts` | UC-03-TC01, UC-03-TC02<br>UC-04-TC01, UC-04-TC02, UC-04-TC03<br>UC-05-TC01, UC-05-TC02, UC-05-TC03 | C-11-UT01 dst., C-21-UT01 dst., C-29-UT01 dst.<br>INT-TC (rute `/api/consultants`, `/api/sessions`) |
| KF-07 | KNF-04 | UC-04<br>UC-05 | C-08 - `GoogleCalendarService`<br>C-11 - `JadwalKonsultasi`<br>C-20 - `ConsultationBookingView`<br>C-21 - `ConsultationManagementView`<br>C-29 - `ConsultationController`<br>C-33 - `Validasi` | `src/backend/src/routes/consultation.ts`<br>`src/backend/src/lib/jadwal-konsultasi.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/backend/src/lib/google.ts`<br>`src/mobile/src/app/(mahasiswa)/sesi.tsx`<br>`src/mobile/src/app/admin/jadwal.tsx`<br>`src/mobile/src/lib/jadwal.ts` | UC-04-TC01, UC-04-TC02, UC-04-TC03<br>UC-05-TC01, UC-05-TC02, UC-05-TC03 | C-08-UT01 dst., C-11-UT01 dst., C-21-UT01 dst., C-29-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/slots`, `/api/sessions`)<br>KNF-04-TC01 |
| KF-08 | KNF-03 | UC-06<br>UC-07 | C-12 - `FAQ`<br>C-22 - `FAQView`<br>C-30 - `FAQController`<br>C-33 - `Validasi` | `src/backend/src/routes/faq.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/faq.tsx`<br>`src/mobile/src/app/admin/faq.tsx`<br>`src/mobile/src/app/admin/faq-form.tsx`<br>`src/mobile/src/api/faq.ts` | UC-06-TC01, UC-06-TC02<br>UC-07-TC01, UC-07-TC02 | C-12-UT01 dst., C-30-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/faq`)<br>KNF-03-TC01 |
| KF-09 | KNF-03, KNF-04 | UC-08 | C-14 - `UmpanBalik`<br>C-23 - `FeedbackView`<br>C-31 - `FeedbackController`<br>C-33 - `Validasi` | `src/backend/src/routes/feedback.ts`<br>`src/backend/src/db/queries.ts`<br>`src/mobile/src/app/(mahasiswa)/umpan-balik.tsx`<br>`src/mobile/src/api/umpan-balik.ts` | UC-08-TC01, UC-08-TC02 | C-14-UT01 dst., C-31-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/feedback`)<br>KNF-03-TC01, KNF-04-TC01 |
| KF-10 | KNF-01 | UC-10 | C-15 - `StatusServer`<br>C-24 - `ServerStatusView`<br>C-32 - `ServerStatusController` | `src/backend/src/routes/status.ts`<br>`src/backend/src/lib/status-probe.ts`<br>`src/backend/src/jobs/scheduler.ts`<br>`src/mobile/src/app/admin/status.tsx`<br>`src/mobile/src/lib/status.ts`<br>`src/mobile/src/api/status.ts` | UC-10-TC01 | C-24-UT01 dst., C-32-UT01 dst.<br>INT-TC (rute `/api/status`, tugas _cron_ status)<br>KNF-01-TC01 |
| KF-11 | KNF-04 | UC-09 | C-14 - `UmpanBalik`<br>C-23 - `FeedbackView`<br>C-31 - `FeedbackController`<br>C-33 - `Validasi` | `src/backend/src/routes/feedback.ts`<br>`src/backend/src/db/queries.ts`<br>`src/mobile/src/app/admin/umpan-balik.tsx`<br>`src/mobile/src/api/umpan-balik.ts` | UC-09-TC01, UC-09-TC02 | C-14-UT01 dst., C-31-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/feedback/:id/response`)<br>KNF-04-TC01 |
| KF-12 | KNF-02 | UC-11 | C-01 - `Pengguna`<br>C-02 - `Mahasiswa`<br>C-03 - `Administrator`<br>C-04 - `SesiAutentikasi`<br>C-16 - `LoginView`<br>C-25 - `AuthController`<br>C-34 - `GoogleAuthService`<br>C-36 - `HomeView` | `src/backend/src/routes/auth.ts`<br>`src/backend/src/middleware/auth.ts`<br>`src/backend/src/lib/google.ts`<br>`src/backend/src/lib/crypto.ts`<br>`src/backend/src/db/schema.ts`<br>`src/mobile/src/app/index.tsx`<br>`src/mobile/src/api/auth.ts`<br>`src/mobile/src/api/sesi.ts`<br>`src/mobile/src/lib/sesi.tsx`<br>`src/mobile/src/app/(mahasiswa)/beranda.tsx`<br>`src/mobile/src/app/admin/index.tsx` | UC-11-TC01, UC-11-TC02 | C-04-UT01 dst., C-16-UT01 dst., C-25-UT01 dst., C-34-UT01 dst.<br>INT-TC (rute `/api/auth`)<br>KNF-02-TC01, KNF-02-TC02, KNF-02-TC03 |
| KF-13 | KNF-03 | UC-12 | C-13 - `PengajuanPertanyaan`<br>C-22 - `FAQView`<br>C-30 - `FAQController`<br>C-33 - `Validasi` | `src/backend/src/routes/questions.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/pertanyaan.tsx`<br>`src/mobile/src/app/admin/pertanyaan.tsx`<br>`src/mobile/src/api/faq.ts` | UC-12-TC01, UC-12-TC02 | C-30-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/questions`)<br>KNF-03-TC01 |

Kelas C-35 `CloudflareD1Database` tidak dicantumkan per KF karena dipakai oleh seluruh KF yang menyimpan data. Kelas ini diwujudkan oleh _binding_ D1 pada `src/backend/wrangler.jsonc` dan _middleware_ Drizzle pada `src/backend/src/index.ts`, serta teruji secara tidak langsung melalui seluruh _test case_ integrasi.

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| ------ | --------- | ------------- | --------- |
| KNF-01 | _Availability_ | KF-04, KF-10 / UC-01, UC-02, UC-10 | KNF-01-TC01 |
| KNF-02 | _Security_ | KF-12 / UC-11 | KNF-02-TC01, KNF-02-TC02, KNF-02-TC03 |
| KNF-03 | _Ergonomy_ | KF-01, KF-02, KF-03, KF-05, KF-08, KF-09, KF-13 / UC-01, UC-02, UC-03, UC-04, UC-06, UC-08, UC-12 | KNF-03-TC01 |
| KNF-04 | _Reliability_ | KF-07, KF-09, KF-11 / UC-04, UC-05, UC-08, UC-09 | KNF-04-TC01 |
