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

| Revisi     | Deskripsi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REV-M10-01 | Menambahkan layar **Pertanyaan Masuk** untuk Administrator (`src/mobile/src/app/admin/pertanyaan.tsx`) yang tidak terdapat pada rancangan antarmuka DPPL. Pada DPPL, pertanyaan yang dikirim Mahasiswa lewat I-10 (UC-12) hanya disimpan ke `PengajuanPertanyaan` (C-13) tanpa layar untuk membacanya, dan I-13 hanya mengelola FAQ. Layar ini menampilkan pertanyaan masuk beserta nama pengirim dan waktu pengajuan, dengan pencarian dan penyaring rentang waktu, serta memungkinkan Administrator menjawab pertanyaan sehingga menjadi FAQ baru atau menghapusnya. Layar ini dilayani rute tambahan `GET /api/questions` dan `DELETE /api/questions/:id` khusus Administrator pada `FAQController` (C-30), dan termasuk kelas `FAQView` (C-22). Perubahan ini tercatat pada Tabel B.1 no. 15 dokumen Implementasi (Tugas 9) dan tampak pada Tabel 3.2 dan Tabel 3.3 (BAB 3). |
| REV-M10-02 | Menyesuaikan alur autentikasi dan sesi terhadap Tabel B.1 no. 1, 2, 4, dan 5: kode otorisasi Google dikembalikan ke aplikasi lewat _deep link_ melalui rute `/api/auth/google/mulai` dan `/api/auth/google/callback`; login demo untuk kedua peran ditambahkan pada I-01 (aktif bila `MODE_DEMO=1` dan `EXPO_PUBLIC_MODE_DEMO=1`); pendaftaran token _push_ berjalan di latar belakang dan tidak menggagalkan login; serta tombol keluar ditambahkan pada I-02.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| REV-M10-03 | Menyesuaikan notifikasi dan pemantauan status terhadap Tabel B.1 no. 3, 7, 10, dan 11: tombol lonceng belum membuka daftar notifikasi karena tidak dirancang pada I-01–I-15; UC-10 memeriksa dua alamat (`server` dan `db`) dengan rute `/api/status/:jenis`, `/api/status/refresh`, dan `/api/status/history`; _backend_ mendaftarkan tiga Cron Trigger; serta notifikasi dicatat dengan sumber afirmasi/pengingat, judul khusus, pengiriman per _batch_ 100 pesan, dan pembersihan token `DeviceNotRegistered`.                                                                                                                                                                                                                                                                                                                                                                |
| REV-M10-04 | Menyesuaikan afirmasi, pengingat, dan kalender terhadap Tabel B.1 no. 6, 8, dan 9: penonaktifan afirmasi dan pengingat menghapus baris masing-masing lewat `DELETE /api/affirmation` dan `DELETE /api/reminders/:jenis`; I-06 memakai rentang tanggal eksplisit, penggabungan jadwal di _server_, serta hasil contoh bila kredensial Google tidak tersedia.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| REV-M10-05 | Menyesuaikan umpan balik terhadap Tabel B.1 no. 12 dan 13: Mahasiswa membaca umpan baliknya sendiri lewat `GET /api/feedback/mine`, dan penyaringan status pada I-14 dilakukan di _server_ lewat `?status=belum` atau `?status=sudah`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| REV-M10-06 | Menyesuaikan navigasi dan pengelolaan FAQ terhadap Tabel B.1 no. 14, 16, dan 17: layar yang dibuka lewat navigasi memakai rute tersembunyi agar TabBar tetap tampil; I-13 diberi pencarian dan pengurutan FAQ; serta formulir I-13-05 dipindahkan ke `src/mobile/src/app/admin/faq-form.tsx`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini melaporkan hasil implementasi perangkat lunak Sehati beserta hasil pengujiannya, sebagai lanjutan dari dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL), Arsitektur Perangkat Lunak (APL), Deskripsi Perancangan Perangkat Lunak (DPPL), dan dokumen Implementasi. Dokumen ini memetakan setiap kelas dan antarmuka rancangan DPPL ke berkas kode pada repositori, lalu melaporkan pengujian pada level unit, integrasi, _use case_, dan kebutuhan nonfungsional. Rujukan versi untuk seluruh dokumen ini adalah _tag release_ `v10.0`, yang dibuat setelah dokumen ini dan hasil pengujiannya final.

Dokumen ini ditujukan kepada tim pengembang sebagai catatan kondisi P/L yang telah dibangun dan diuji, kepada asisten dan penguji sebagai bukti bahwa implementasi memenuhi kebutuhan dan rancangan, serta kepada pemangku kepentingan yang perlu menilai kesiapan Sehati untuk digunakan.

## 1.2 Lingkup Masalah

Sehati adalah aplikasi _mobile_ (Android dan iOS) yang mempromosikan kesejahteraan mahasiswa, sejalan dengan SDG 3. Mahasiswa masuk melalui akun Google, lalu dapat mengatur dan menerima _daily affirmations_, mengatur pengingat makan, tidur, dan olahraga, melihat kalender harian yang terintegrasi dengan Google Calendar, memesan sesi konsultasi, membaca FAQ, mengajukan pertanyaan, dan memberi umpan balik. Administrator mengelola jadwal konsultan, FAQ, dan umpan balik, serta memantau status _server_. Sehati terdiri atas aplikasi _client_ React Native (Expo) dan _server_ Hono di Cloudflare Workers dengan basis data Cloudflare D1, serta berinteraksi dengan Google OAuth 2.0, Google Calendar API, dan Expo Push Service sebagai sistem eksternal. Dokumen ini membatasi pembahasannya pada hasil implementasi dan pengujian P/L tersebut, dan tidak membahas ulang analisis kebutuhan maupun perancangannya.

## 1.3 Definisi, Istilah, dan Singkatan

Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan                                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P/L                              | Singkatan dari **Perangkat Lunak**, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.                                                 |
| SKPL                             | Singkatan dari **Spesifikasi Kebutuhan Perangkat Lunak**, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.       |
| APL                              | Singkatan dari **Arsitektur Perangkat Lunak**, yaitu dokumen yang menjabarkan arsitektur dan komponen P/L.                                                                    |
| DPPL                             | Singkatan dari **Deskripsi Perancangan Perangkat Lunak**, yaitu dokumen yang menjabarkan rancangan arsitektur, komponen, kelas, dan antarmuka P/L.                            |
| HIUPL                            | Singkatan dari **Hasil Implementasi dan Uji Perangkat Lunak**, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.                                            |
| KF                               | Singkatan dari **Kebutuhan Fungsional**, yaitu kebutuhan yang menjelaskan apa yang harus dapat dilakukan oleh sistem.                                                         |
| KNF                              | Singkatan dari **Kebutuhan Nonfungsional**, yaitu kebutuhan yang menjelaskan kualitas sistem, seperti ketersediaan, keamanan, dan kemudahan penggunaan.                       |
| UC                               | Singkatan dari **_Use Case_**, yaitu gambaran interaksi antara aktor dan sistem untuk mencapai suatu tujuan.                                                                  |
| TC                               | Singkatan dari **_Test Case_**, yaitu satu kasus uji untuk skenario tertentu, lengkap dengan masukan, hasil yang diharapkan, dan hasil aktual.                                |
| UT                               | Singkatan dari **_Unit Test_**, yaitu _test case_ pada tingkat kelas atau operasi.                                                                                            |
| INT                              | Singkatan dari **_Integration Test_**, yaitu _test case_ yang menguji interaksi antarkomponen, misalnya rute Hono bersama basis data.                                         |
| _Boundary_                       | Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.                                                                            |
| _Coverage_                       | Persentase baris atau cabang kode yang dieksekusi oleh pengujian.                                                                                                             |
| _Tag release_                    | Penanda versi pada repositori Git (misalnya `v10.0`) yang menunjuk satu _commit_ tertentu sebagai versi rilis.                                                                |
| APK                              | Singkatan dari **_Android Package Kit_**, yaitu berkas paket instalasi aplikasi Android.                                                                                      |
| Sehati                           | **Nama perangkat lunak yang dikembangkan** untuk mendukung kesehatan mental dan kesejahteraan mahasiswa.                                                                      |
| Mahasiswa                        | **Aktor pengguna utama** Sehati yang menggunakan pengingat, _daily affirmations_, kalender, dan pemesanan sesi konsultasi.                                                    |
| Administrator                    | **Aktor yang mengelola** Sehati, termasuk jadwal konsultan, FAQ, dan umpan balik, serta memantau status _server_.                                                             |
| Konsultan                        | Tenaga profesional yang menyediakan sesi konsultasi. Konsultan bukan aktor sistem; data dan jadwalnya dikelola oleh Administrator.                                            |
| _Daily Affirmations_             | Pesan positif yang dikirimkan kepada pengguna pada waktu yang diatur pengguna untuk menjaga suasana hati dan kepercayaan diri.                                                |
| Pengingat                        | Notifikasi dengan waktu yang diatur pengguna untuk makan, tidur, dan berolahraga.                                                                                             |
| _Push notification_              | Notifikasi yang dikirim _server_ ke perangkat pengguna melalui Expo Push Service, walaupun aplikasi sedang tidak dibuka.                                                      |
| Google Calendar                  | Layanan kalender milik Google yang datanya diintegrasikan ke Sehati untuk menampilkan jadwal pengguna.                                                                        |
| API                              | Singkatan dari **_Application Programming Interface_**, yaitu antarmuka yang memungkinkan satu perangkat lunak berkomunikasi dengan perangkat lunak lain.                     |
| REST API                         | Gaya API berbasis HTTP yang dipakai _server_ Sehati untuk melayani permintaan aplikasi _client_ dalam format JSON.                                                            |
| OAuth                            | Protokol otorisasi yang memungkinkan aplikasi mendapat akses terbatas ke akun pengguna di layanan lain (misalnya Google) tanpa mengetahui kata sandi pengguna.                |
| Bentrok jadwal                   | Kondisi ketika waktu sesi konsultasi yang dipilih tumpang tindih dengan acara lain di kalender pengguna.                                                                      |
| _Uptime_                         | Persentase waktu sistem dapat diakses dan beroperasi dalam suatu periode.                                                                                                     |
| _Cron_                           | Penjadwal tugas berkala; pada Sehati diwujudkan oleh Cloudflare Cron Trigger untuk mengirim notifikasi, memeriksa status _server_, dan membersihkan data lama.                |
| FAQ                              | Singkatan dari **_Frequently Asked Questions_**, yaitu daftar pertanyaan yang sering diajukan beserta jawabannya.                                                             |
| Umpan balik                      | Masukan dari pengguna terhadap aplikasi, yang dapat ditanggapi oleh Administrator.                                                                                            |
| MVC                              | Singkatan dari **_Model-View-Controller_**, yaitu pattern arsitektur yang memisahkan penyimpanan data (_model_), tampilan (_view_), dan pemrosesan permintaan (_controller_). |
| Expo                             | _Framework_ dan perangkat pengembangan untuk aplikasi React Native, termasuk Expo Router (navigasi) dan EAS Build (pembuatan APK).                                            |
| Hono                             | _Framework web_ TypeScript yang dipakai untuk membangun REST API Sehati di Cloudflare Workers.                                                                                |
| Cloudflare D1                    | Basis data SQLite terkelola milik Cloudflare yang dipakai sebagai DBMS Sehati.                                                                                                |
| Vitest                           | _Framework_ pengujian unit dan integrasi untuk TypeScript yang dipakai pada _server_ dan _client_ Sehati.                                                                     |
| _Traceability_                   | Keterlacakan hubungan antara kebutuhan, _use case_, kelas, implementasi, dan _test case_.                                                                                     |

## 1.4 Aturan Penomoran

Dokumen ini memakai pola penomoran ID yang sama dengan dokumen SKPL, APL, dan DPPL, sehingga setiap rujukan kebutuhan, _use case_, kelas, dan antarmuka tetap konsisten antardokumen. ID _test case_ diperkenalkan pada dokumen ini dan mengikuti pola bertanda hubung yang sama.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian               | Penomoran   | Keterangan                                                                                                  |
| ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------- |
| Kebutuhan Fungsional     | KF-XX       | Sesuai SKPL. Nomor urut dua digit mulai dari 01 (contoh: KF-01).                                            |
| Kebutuhan Non-Fungsional | KNF-XX      | Sesuai SKPL. Nomor urut dua digit mulai dari 01 (contoh: KNF-01).                                           |
| _Use Case_               | UC-XX       | Sesuai SKPL. Nomor urut dua digit mulai dari 01 (contoh: UC-01).                                            |
| Kelas                    | C-XX        | Sesuai DPPL. Nomor urut dua digit mulai dari 01 (contoh: C-01).                                             |
| Algoritma                | Algo-XXX    | Sesuai DPPL. Nomor urut tiga digit mulai dari 001 (contoh: Algo-001).                                       |
| _Query_                  | Q-XXX       | Sesuai DPPL. Nomor urut tiga digit mulai dari 001 (contoh: Q-001).                                          |
| Antarmuka                | I-XX        | Sesuai DPPL. Nomor urut dua digit mulai dari 01 (contoh: I-01).                                             |
| Objek antarmuka          | I-XX-YY     | Sesuai DPPL. ID antarmuka diikuti nomor urut objek dua digit (contoh: I-04-07).                             |
| _Test Case_ Unit         | C-XX-UTYY   | XX adalah nomor kelas, YY adalah nomor urut _test case_ unit pada kelas tersebut (contoh: C-05-UT01).       |
| _Test Case_ Integrasi    | INT-TCYY    | YY adalah nomor urut _test case_ integrasi (contoh: INT-TC01).                                              |
| _Test Case_ _Use Case_   | UC-XX-TCYY  | XX adalah nomor _use case_, YY adalah nomor urut _test case_ pada _use case_ tersebut (contoh: UC-04-TC02). |
| _Test Case_ KNF          | KNF-XX-TCYY | XX adalah nomor KNF, YY adalah nomor urut _test case_ pada KNF tersebut (contoh: KNF-01-TC01).              |

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

| ID UC | Nama _Use Case_               | Deskripsi Singkat                                                                                        | Aktor Terlibat           |
| ----- | ----------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------ |
| UC-01 | Menyetel _Daily Affirmations_ | Mahasiswa mengatur waktu penerimaan _daily affirmations_ dan menerima notifikasinya.                     | Mahasiswa                |
| UC-02 | Menyetel Pengingat Kesehatan  | Mahasiswa mengatur waktu pengingat makan, tidur, dan olahraga, serta menerima notifikasinya.             | Mahasiswa                |
| UC-03 | Melihat Kalender Terintegrasi | Mahasiswa melihat jadwal gabungan antara Google Calendar dan jadwal sesi konsultasi dalam satu tampilan. | Mahasiswa                |
| UC-04 | Memesan Sesi Konsultasi       | Mahasiswa memilih dan memesan sesi konsultasi pada jadwal yang tersedia.                                 | Mahasiswa                |
| UC-05 | Mengelola Jadwal Konsultan    | Administrator memasukkan dan memperbarui jadwal sesi konsultasi tanpa mengubah _source code_.            | Administrator            |
| UC-06 | Melihat FAQ                   | Mahasiswa membuka dan mencari daftar pertanyaan yang sering diajukan.                                    | Mahasiswa                |
| UC-07 | Mengelola FAQ                 | Administrator menambah, mengubah, atau menghapus daftar FAQ.                                             | Administrator            |
| UC-08 | Memberikan Umpan Balik        | Mahasiswa mengirimkan umpan balik terhadap aplikasi.                                                     | Mahasiswa                |
| UC-09 | Menanggapi Umpan Balik        | Administrator melihat dan memberikan tanggapan atas umpan balik yang masuk.                              | Administrator            |
| UC-10 | Memantau Status _Server_      | Administrator memeriksa status _up/down_ _server_ secara berkala.                                        | Administrator            |
| UC-11 | Masuk Melalui Akun Google     | Pengguna _log in_ ke aplikasi menggunakan akun Google sebelum mengakses fitur lainnya.                   | Mahasiswa, Administrator |
| UC-12 | Form Pengajuan Pertanyaan     | Mahasiswa mengajukan pertanyaan di luar yang ada di FAQ.                                                 | Mahasiswa                |

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

Bab ini menjabarkan elemen P/L Sehati pada _tag release_ rujukan `v10.0`, yaitu lingkungan implementasi, pemetaan kelas dan antarmuka DPPL ke berkas kode, serta berkas pendukung lainnya. Kode sumber berada pada folder `src/` repositori, terbagi menjadi `src/backend/` (_server_) dan `src/mobile/` (aplikasi _mobile_). Hasil eksekusinya ada dua: Worker `sehati-backend` yang di-_deploy_ ke Cloudflare pada `https://sehati.sbxte.net`, dan berkas `sehati-v10.0.apk` yang dilampirkan pada rilis `v10.0`. _Tag_ tersebut dibuat setelah dokumen ini dan hasil pengujiannya final. Perubahan implementasi terhadap rancangan DPPL tercatat pada Tabel B.1 dokumen Implementasi (Tugas 9).

## 3.1 Lingkungan Implementasi

Lingkungan implementasi mengikuti Subbab 2.1 DPPL, yaitu _server_ Hono di Cloudflare Workers dengan basis data Cloudflare D1 dan aplikasi React Native (Expo) untuk Android dan iOS. Terdapat beberapa tambahan dibanding DPPL. Drizzle ORM dipakai untuk mendefinisikan skema dan kueri D1. Bun dipakai sebagai _package manager_. EAS Build dipakai untuk membuat APK. Expo Push Service menjadi sistem eksternal untuk mengirim _push notification_. Vitest dipakai sebagai alat pengujian. Versi Android dan iOS pada Tabel 3.1 mengikuti sasaran platform yang ditetapkan pada Tabel 2.1 DPPL, bukan spesifikasi perangkat pengembang.

Tabel 3.1. Lingkungan Implementasi

| Aspek                | Keterangan                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _Hardware_           | _Client_: ponsel pintar Android dan iPhone. _Server_: jaringan _edge_ Cloudflare (Cloudflare Workers dan Cloudflare D1), tanpa _server_ fisik yang dikelola sendiri.                                                                                    |
| _Operating System_   | _Client_: Android 10+ dan iOS 15+ (sasaran platform). _Server_: Cloudflare Workers (V8 _isolates_), tanpa OS tradisional.                                                                                                                               |
| _Bahasa Pemrograman_ | TypeScript 7 (_server_) dan TypeScript 6 (_client_)                                                                                                                                                                                                     |
| _Framework/Library_  | _Server_: Hono 4.13, Drizzle ORM 0.45. _Client_: Expo SDK 58, React Native 0.88.1, React 19.3, Expo Router 58, expo-notifications 58.1, expo-secure-store 58, expo-web-browser 58, @react-native-community/datetimepicker 9.2, lucide-react-native 1.69 |
| _DBMS_               | Cloudflare D1 (SQLite terkelola); migrasi dibuat dengan drizzle-kit 0.31                                                                                                                                                                                |
| _Development Tools_  | Git dan GitHub, Bun 1.4.4, Wrangler 4.160 (Cloudflare Workers), Expo CLI, EAS CLI dan EAS Build, ESLint 9                                                                                                                                               |
| _Testing Tools_      | Vitest 5.1 (unit dan integrasi, _server_ dan _client_), better-sqlite3 13 (D1 tiruan di memori untuk pengujian _server_), `tsc --noEmit` (pemeriksaan tipe), `expo lint`, Expo Go dan APK pada perangkat fisik untuk pengujian _use case_               |

## 3.2 Implementasi Modul

Tabel 3.2 memetakan seluruh 36 kelas perancangan DPPL ke berkas kode, konsisten dengan Tabel B.5 dokumen Implementasi (Tugas 9). Kelas _model_ dan _controller_ dijalankan sebagai bagian Worker `sehati-backend`, sedangkan kelas _view_ dijalankan dalam aplikasi `sehati-v10.0.apk`. Satu kelas dapat terwujud dalam beberapa berkas, misalnya tabel basis data di `schema.ts` dan kuerinya di `queries.ts`.

Tabel 3.2. Implementasi Modul

| No  | ID Kelas | Nama Modul/Kelas             | Nama File Fisik                                                                                                                                                                                                                                | Nama File Executable                        |
| --- | -------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | C-01     | `Pengguna`                   | `src/backend/src/db/schema.ts` (`pengguna`)                                                                                                                                                                                                    | Worker `sehati-backend`                     |
| 2   | C-02     | `Mahasiswa`                  | `src/backend/src/db/schema.ts` (`mahasiswa`)                                                                                                                                                                                                   | Worker `sehati-backend`                     |
| 3   | C-03     | `Administrator`              | `src/backend/src/db/schema.ts` (`pengguna.peran`), `src/backend/src/middleware/auth.ts` (`requireRole`)                                                                                                                                        | Worker `sehati-backend`                     |
| 4   | C-04     | `SesiAutentikasi`            | `src/backend/src/db/schema.ts`, `src/backend/src/middleware/auth.ts`, `src/backend/src/routes/auth.ts`; `src/mobile/src/api/sesi.ts`, `src/mobile/src/lib/sesi.tsx`                                                                            | Worker `sehati-backend`; `sehati-v10.0.apk` |
| 5   | C-05     | `DailyAffirmation`           | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/jobs/scheduler.ts`                                                                                                                                           | Worker `sehati-backend`                     |
| 6   | C-06     | `Reminder`                   | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/jobs/scheduler.ts`                                                                                                                                           | Worker `sehati-backend`                     |
| 7   | C-07     | `Notifikasi`                 | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/jobs/scheduler.ts`; `src/mobile/src/lib/notifikasi.ts`                                                                                                       | Worker `sehati-backend`; `sehati-v10.0.apk` |
| 8   | C-08     | `GoogleCalendarService`      | `src/backend/src/lib/google.ts`                                                                                                                                                                                                                | Worker `sehati-backend`                     |
| 9   | C-09     | `KalenderGabungan`           | `src/backend/src/lib/kalender.ts`                                                                                                                                                                                                              | Worker `sehati-backend`                     |
| 10  | C-10     | `Konsultan`                  | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`                                                                                                                                                                                | Worker `sehati-backend`                     |
| 11  | C-11     | `JadwalKonsultasi`           | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`, `src/backend/src/lib/jadwal-konsultasi.ts`                                                                                                                                    | Worker `sehati-backend`                     |
| 12  | C-12     | `FAQ`                        | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`                                                                                                                                                                                | Worker `sehati-backend`                     |
| 13  | C-13     | `PengajuanPertanyaan`        | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`                                                                                                                                                                                | Worker `sehati-backend`                     |
| 14  | C-14     | `UmpanBalik`                 | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`                                                                                                                                                                                | Worker `sehati-backend`                     |
| 15  | C-15     | `StatusServer`               | `src/backend/src/db/schema.ts`, `src/backend/src/db/queries.ts`                                                                                                                                                                                | Worker `sehati-backend`                     |
| 16  | C-16     | `LoginView`                  | `src/mobile/src/app/index.tsx`, `src/mobile/src/api/auth.ts`                                                                                                                                                                                   | `sehati-v10.0.apk`                          |
| 17  | C-17     | `AffirmationView`            | `src/mobile/src/app/(mahasiswa)/afirmasi.tsx`, `src/mobile/src/api/afirmasi.ts`                                                                                                                                                                | `sehati-v10.0.apk`                          |
| 18  | C-18     | `ReminderView`               | `src/mobile/src/app/(mahasiswa)/pengingat.tsx`, `src/mobile/src/api/pengingat.ts`                                                                                                                                                              | `sehati-v10.0.apk`                          |
| 19  | C-19     | `CalendarView`               | `src/mobile/src/app/(mahasiswa)/kalender.tsx`, `src/mobile/src/api/kalender.ts`, `src/mobile/src/lib/kalender.ts`                                                                                                                              | `sehati-v10.0.apk`                          |
| 20  | C-20     | `ConsultationBookingView`    | `src/mobile/src/app/(mahasiswa)/konsultasi.tsx`, `src/mobile/src/app/(mahasiswa)/sesi.tsx`, `src/mobile/src/api/konsultasi.ts`                                                                                                                 | `sehati-v10.0.apk`                          |
| 21  | C-21     | `ConsultationManagementView` | `src/mobile/src/app/admin/jadwal.tsx`, `src/mobile/src/lib/jadwal.ts`                                                                                                                                                                          | `sehati-v10.0.apk`                          |
| 22  | C-22     | `FAQView`                    | `src/mobile/src/app/(mahasiswa)/faq.tsx`, `src/mobile/src/app/(mahasiswa)/pertanyaan.tsx`, `src/mobile/src/app/admin/faq.tsx`, `src/mobile/src/app/admin/faq-form.tsx`, `src/mobile/src/app/admin/pertanyaan.tsx`, `src/mobile/src/api/faq.ts` | `sehati-v10.0.apk`                          |
| 23  | C-23     | `FeedbackView`               | `src/mobile/src/app/(mahasiswa)/umpan-balik.tsx`, `src/mobile/src/app/admin/umpan-balik.tsx`, `src/mobile/src/api/umpan-balik.ts`                                                                                                              | `sehati-v10.0.apk`                          |
| 24  | C-24     | `ServerStatusView`           | `src/mobile/src/app/admin/status.tsx`, `src/mobile/src/lib/status.ts`, `src/mobile/src/api/status.ts`                                                                                                                                          | `sehati-v10.0.apk`                          |
| 25  | C-25     | `AuthController`             | `src/backend/src/routes/auth.ts`                                                                                                                                                                                                               | Worker `sehati-backend`                     |
| 26  | C-26     | `AffirmationController`      | `src/backend/src/routes/affirmation.ts` (`affirmationRoutes`)                                                                                                                                                                                  | Worker `sehati-backend`                     |
| 27  | C-27     | `ReminderController`         | `src/backend/src/routes/affirmation.ts` (`reminderRoutes`)                                                                                                                                                                                     | Worker `sehati-backend`                     |
| 28  | C-28     | `CalendarController`         | `src/backend/src/routes/consultation.ts` (`calendarRoutes`)                                                                                                                                                                                    | Worker `sehati-backend`                     |
| 29  | C-29     | `ConsultationController`     | `src/backend/src/routes/consultation.ts` (`consultantRoutes`, `slotRoutes`, `sessionRoutes`)                                                                                                                                                   | Worker `sehati-backend`                     |
| 30  | C-30     | `FAQController`              | `src/backend/src/routes/faq.ts`, `src/backend/src/routes/questions.ts`                                                                                                                                                                         | Worker `sehati-backend`                     |
| 31  | C-31     | `FeedbackController`         | `src/backend/src/routes/feedback.ts`                                                                                                                                                                                                           | Worker `sehati-backend`                     |
| 32  | C-32     | `ServerStatusController`     | `src/backend/src/routes/status.ts`, `src/backend/src/lib/status-probe.ts`, `src/backend/src/jobs/scheduler.ts`                                                                                                                                 | Worker `sehati-backend`                     |
| 33  | C-33     | `Validasi`                   | `src/backend/src/lib/validasi.ts`                                                                                                                                                                                                              | Worker `sehati-backend`                     |
| 34  | C-34     | `GoogleAuthService`          | `src/backend/src/lib/google.ts`, `src/backend/src/lib/crypto.ts`                                                                                                                                                                               | Worker `sehati-backend`                     |
| 35  | C-35     | `CloudflareD1Database`       | `src/backend/wrangler.jsonc` (_binding_ `D1`), `src/backend/src/index.ts`                                                                                                                                                                      | Worker `sehati-backend`                     |
| 36  | C-36     | `HomeView`                   | `src/mobile/src/app/(mahasiswa)/beranda.tsx`, `src/mobile/src/app/admin/index.tsx`, `src/mobile/src/views/beranda/`, `src/mobile/src/lib/muatan.ts`                                                                                            | `sehati-v10.0.apk`                          |

## 3.3 Implementasi Antarmuka

Seluruh 15 antarmuka DPPL telah diimplementasikan sebagai layar Expo Router di `src/mobile/src/app/`. Satu berkas `.tsx` pada folder tersebut adalah satu layar (_route_). Layar Mahasiswa berada pada grup `(mahasiswa)` dengan _tab bar_, sedangkan layar Administrator berada pada _stack_ `admin`. Selain itu terdapat satu layar tambahan di luar DPPL, yaitu Pertanyaan Masuk untuk Administrator (lihat Daftar Perubahan REV-M10-01).

Tabel 3.3. Implementasi Antarmuka

| No  | ID Antarmuka | Nama Antarmuka                             | Nama File Fisik                                                                                | Nama File Executable |
| --- | ------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------- |
| 1   | I-01         | Masuk                                      | `src/mobile/src/app/index.tsx`                                                                 | `sehati-v10.0.apk`   |
| 2   | I-02         | Beranda Mahasiswa                          | `src/mobile/src/app/(mahasiswa)/beranda.tsx`                                                   | `sehati-v10.0.apk`   |
| 3   | I-03         | Beranda Administrator                      | `src/mobile/src/app/admin/index.tsx`                                                           | `sehati-v10.0.apk`   |
| 4   | I-04         | Daily Affirmations                         | `src/mobile/src/app/(mahasiswa)/afirmasi.tsx`                                                  | `sehati-v10.0.apk`   |
| 5   | I-05         | Pengingat Kesehatan                        | `src/mobile/src/app/(mahasiswa)/pengingat.tsx`                                                 | `sehati-v10.0.apk`   |
| 6   | I-06         | Kalender Terintegrasi                      | `src/mobile/src/app/(mahasiswa)/kalender.tsx`                                                  | `sehati-v10.0.apk`   |
| 7   | I-07         | Pilih Konsultan                            | `src/mobile/src/app/(mahasiswa)/konsultasi.tsx`                                                | `sehati-v10.0.apk`   |
| 8   | I-08         | Pilih Sesi dan Konfirmasi                  | `src/mobile/src/app/(mahasiswa)/sesi.tsx`                                                      | `sehati-v10.0.apk`   |
| 9   | I-09         | FAQ dan Pencarian                          | `src/mobile/src/app/(mahasiswa)/faq.tsx`                                                       | `sehati-v10.0.apk`   |
| 10  | I-10         | Form Pengajuan Pertanyaan                  | `src/mobile/src/app/(mahasiswa)/pertanyaan.tsx`                                                | `sehati-v10.0.apk`   |
| 11  | I-11         | Umpan Balik                                | `src/mobile/src/app/(mahasiswa)/umpan-balik.tsx`                                               | `sehati-v10.0.apk`   |
| 12  | I-12         | Kelola Jadwal Konsultan                    | `src/mobile/src/app/admin/jadwal.tsx`                                                          | `sehati-v10.0.apk`   |
| 13  | I-13         | Kelola FAQ                                 | `src/mobile/src/app/admin/faq.tsx`, `src/mobile/src/app/admin/faq-form.tsx` (formulir I-13-05) | `sehati-v10.0.apk`   |
| 14  | I-14         | Tanggapi Umpan Balik                       | `src/mobile/src/app/admin/umpan-balik.tsx`                                                     | `sehati-v10.0.apk`   |
| 15  | I-15         | Status Server                              | `src/mobile/src/app/admin/status.tsx`                                                          | `sehati-v10.0.apk`   |
| 16  | -            | Pertanyaan Masuk (tambahan, Administrator) | `src/mobile/src/app/admin/pertanyaan.tsx`                                                      | `sehati-v10.0.apk`   |

Komponen antarmuka bersama yang dipakai lintas layar (`AppBar`, `Tombol`, `Banner`, `Lencana`, `TabBar`, dan lain-lain) berada di `src/mobile/src/components/`, dengan token warna, jarak, dan tipografi dari rancangan Figma di `src/mobile/src/theme/`.

## 3.4 File Lain

Tabel 3.4. File Lain

| No  | Nama File                                                                                              | Keterangan                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `src/backend/src/index.ts`                                                                             | Titik masuk Worker: _middleware_ CORS dan basis data, pemasangan seluruh rute `/api/*`, rute `/health` dan `/health/db`, serta _handler_ `scheduled` untuk _cron_.                                                    |
| 2   | `src/backend/src/config.ts`                                                                            | Konstanta aplikasi (`BATAS_SESI_HARI`, `KONTEN_BAWAAN`, jenis pengingat dan status) dan pembacaan variabel lingkungan.                                                                                                |
| 3   | `src/backend/src/lib/errors.ts`, `src/backend/src/lib/http.ts`                                         | Format galat API yang seragam (kode status dan pesan) serta pembacaan _body_ dan _query_ permintaan.                                                                                                                  |
| 4   | `src/backend/src/lib/crypto.ts`                                                                        | Enkripsi dan dekripsi AES-256-GCM untuk token Google yang disimpan.                                                                                                                                                   |
| 5   | `src/backend/wrangler.jsonc`                                                                           | Konfigurasi Worker: nama, _binding_ D1, tiga Cron Trigger, dan variabel `API_BASE_URL`, `GOOGLE_REDIRECT_URI`. Variabel `MODE_DEMO` untuk login demo dibaca dari `.env`/`.dev.vars` _backend_, bukan dari berkas ini. |
| 6   | `src/backend/.env.example`                                                                             | Contoh variabel rahasia (`KUNCI_TOKEN`, kredensial Google) tanpa nilai asli.                                                                                                                                          |
| 7   | `src/backend/migrations/0000_*.sql` s.d. `0004_*.sql`, `migrations/meta/`                              | Migrasi skema D1 yang dihasilkan drizzle-kit dari `schema.ts`.                                                                                                                                                        |
| 8   | `src/backend/seed/seed.sql`                                                                            | Data uji: akun Mahasiswa dan Administrator demo, konsultan, slot jadwal, dan contoh FAQ.                                                                                                                              |
| 9   | `src/backend/test/*.test.ts`, `src/backend/test/harness.ts`, `src/backend/src/index.test.ts`           | Pengujian _server_ dengan Vitest; _harness_ membuat D1 tiruan di memori dari berkas migrasi.                                                                                                                          |
| 10  | `src/backend/package.json`, `bun.lock`, `tsconfig.json`                                                | Dependensi, skrip (`dev`, `test`, `typecheck`, `db:*`), dan konfigurasi TypeScript _server_.                                                                                                                          |
| 11  | `src/mobile/app.json`, `src/mobile/app.config.ts`                                                      | Konfigurasi aplikasi Expo: nama, _scheme_ `sehati`, _package_ Android `com.k01g04.sehati`, _plugin_, dan pembacaan `google-services.json` dari _secret_ EAS.                                                          |
| 12  | `src/mobile/eas.json`                                                                                  | Profil EAS Build `development` dan `production` (APK, alamat _backend_, mode demo).                                                                                                                                   |
| 13  | `src/mobile/.env.example`                                                                              | Contoh variabel `EXPO_PUBLIC_API_URL` dan `EXPO_PUBLIC_MODE_DEMO`.                                                                                                                                                    |
| 14  | `src/mobile/src/app/_layout.tsx`, `(mahasiswa)/_layout.tsx`, `admin/_layout.tsx`, `+native-intent.tsx` | Navigasi: pemuatan font dan sesi, _handler_ notifikasi, grup _tab_ Mahasiswa, _stack_ Administrator, dan penanganan _deep link_ login.                                                                                |
| 15  | `src/mobile/src/api/client.ts`                                                                         | Klien HTTP ke REST API: alamat dasar, token sesi, dan penerjemahan galat.                                                                                                                                             |
| 16  | `src/mobile/src/api/perangkat.ts`, `src/mobile/src/lib/waktu.ts`                                       | Pendaftaran token _push_ ke _server_ dan format tanggal/jam WIB.                                                                                                                                                      |
| 17  | `src/mobile/src/components/`, `src/mobile/src/theme/`, `src/mobile/src/views/beranda/`                 | Komponen antarmuka bersama, token desain, dan kartu-kartu Beranda.                                                                                                                                                    |
| 18  | `src/mobile/assets/`                                                                                   | Logo, ikon aplikasi, dan _splash screen_.                                                                                                                                                                             |
| 19  | `src/mobile/test/*.test.ts`, `src/mobile/vitest.config.mts`                                            | Pengujian _client_ dengan Vitest (klien API dan logika tampilan, tanpa _render_ komponen).                                                                                                                            |
| 20  | `src/mobile/package.json`, `bun.lock`, `tsconfig.json`, `eslint.config.js`                             | Dependensi, skrip (`go`, `test`, `lint`, `typecheck`), dan konfigurasi TypeScript serta ESLint _client_.                                                                                                              |
| 21  | `src/README.md`, `src/backend/README.md`                                                               | Panduan instalasi, konfigurasi, menjalankan, menguji, dan merilis aplikasi.                                                                                                                                           |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, _use case_, dan KNF. Pengujian dilakukan pada _tag release_ rujukan `v10.0`, yang dibuat setelah dokumen ini dan hasil pengujiannya final. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti _entity/DTO_ dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas                   | Tingkat     | Alasan                                                                                                                                                                                                  | Test Case Terkait                             |
| -------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| C-01     | `Pengguna`                   | Tidak perlu | Entitas data akun (nama, email, peran) tanpa logika; dibuat dan dibaca oleh `AuthController`.                                                                                                           | - (teruji lewat UC-11-TC01)                   |
| C-02     | `Mahasiswa`                  | Tidak perlu | Entitas data Mahasiswa (NIM) tanpa logika.                                                                                                                                                              | - (teruji lewat UC-11-TC01)                   |
| C-03     | `Administrator`              | Tidak perlu | Peran pada data pengguna tanpa logika; pembatasan aksesnya diuji pada kelas _controller_ dan _middleware_.                                                                                              | - (teruji lewat UC-11-TC01)                   |
| C-04     | `SesiAutentikasi`            | Mendalam    | Memuat aturan keamanan: verifikasi token dan batas umur sesi 30 hari (`verifikasiToken`), _logout_, serta validasi dan penyimpanan token _push_ (`daftarkanPerangkat`).                                 | C-04-UT01 dst.                                |
| C-05     | `DailyAffirmation`           | Mendalam    | Memuat `aturWaktuKirim` (Algo-004, buat atau perbarui dengan konten bawaan) dan pencarian afirmasi jatuh tempo per menit WIB (Algo-005, Q-004).                                                         | C-05-UT01 dst.                                |
| C-06     | `Reminder`                   | Mendalam    | Memuat `aturWaktuKirim` per jenis (Algo-006), penghapusan per jenis, dan pencarian pengingat jatuh tempo (Algo-007, Q-005).                                                                             | C-06-UT01 dst.                                |
| C-07     | `Notifikasi`                 | Mendalam    | Memuat `kirimNotifikasi` (Algo-008): pencatatan dengan tepat satu sumber, pembagian _batch_ maksimal 100 pesan, dan pengosongan token yang ditolak `DeviceNotRegistered`.                               | C-07-UT01 dst.                                |
| C-08     | `GoogleCalendarService`      | Mendalam    | Integrasi eksternal: mengambil _event_ Google Calendar (Algo-009), memperbarui token, dan mendeteksi bentrok terhadap kalender pengguna.                                                                | C-08-UT01 dst.                                |
| C-09     | `KalenderGabungan`           | Mendalam    | Memuat algoritma penggabungan _event_ Google dengan jadwal konsultasi (Algo-011) dan aturan bentrok jadwal.                                                                                             | C-09-UT01 dst.                                |
| C-10     | `Konsultan`                  | Tidak perlu | Entitas data konsultan tanpa logika; daftarnya hanya dibaca.                                                                                                                                            | - (teruji lewat UC-04-TC01, UC-05-TC01)       |
| C-11     | `JadwalKonsultasi`           | Mendalam    | Memuat aturan status slot (tersedia/terpesan), pemesanan, serta penyimpanan dan pengubahan slot yang menolak tumpang tindih di dalam _statement_ agar aman terhadap _race condition_ (Algo-029, Q-027). | C-11-UT01 dst.                                |
| C-12     | `FAQ`                        | Sedang      | Kueri daftar, pencarian kata kunci, dan pengurutan (Q-015) tanpa aturan bisnis; _escaping_ pola pencarian berada di `Validasi`.                                                                         | C-12-UT01 dst.                                |
| C-13     | `PengajuanPertanyaan`        | Tidak perlu | Entitas pertanyaan dengan kueri simpan, daftar, dan hapus sederhana; perilakunya diuji melalui `FAQController`.                                                                                         | - (teruji lewat UC-12-TC01)                   |
| C-14     | `UmpanBalik`                 | Sedang      | Kueri simpan, daftar dengan penyaring status, dan tanggapan; penyaring status dan pembatasan milik pengguna perlu dipastikan.                                                                           | C-14-UT01 dst.                                |
| C-15     | `StatusServer`               | Tidak perlu | Entitas hasil pemeriksaan (`jenis`, `statusUptime`, `waktuCek`) tanpa logika; logika pemeriksaan berada di `ServerStatusController`.                                                                    | - (teruji lewat UC-10-TC01)                   |
| C-16     | `LoginView`                  | Sedang      | Mengoordinasikan alur login Google di peramban aplikasi: menunggu _redirect_ atau _deep link_ dan menangani pembatalan.                                                                                 | C-16-UT01 dst.                                |
| C-17     | `AffirmationView`            | Tidak perlu | Layar I-04 yang hanya menampilkan data dan meneruskan aksi ke klien API.                                                                                                                                | - (teruji lewat UC-01-TC01, UC-01-TC02)       |
| C-18     | `ReminderView`               | Tidak perlu | Layar I-05 yang hanya menampilkan data dan meneruskan aksi ke klien API.                                                                                                                                | - (teruji lewat UC-02-TC01, UC-02-TC02)       |
| C-19     | `CalendarView`               | Sedang      | Memuat logika tampilan kalender, yaitu penyaringan _event_ per hari, label waktu, dan penanda sumber _event_.                                                                                           | C-19-UT01 dst.                                |
| C-20     | `ConsultationBookingView`    | Tidak perlu | Layar I-07 dan I-08 yang hanya menampilkan slot dan meneruskan pemesanan ke klien API.                                                                                                                  | - (teruji lewat UC-04-TC01 s.d. UC-04-TC03)   |
| C-21     | `ConsultationManagementView` | Sedang      | Memuat logika tampilan I-12: daftar tanggal dan jam dalam WIB, pembacaan masukan jam, serta validasi slot di sisi _client_.                                                                             | C-21-UT01 dst.                                |
| C-22     | `FAQView`                    | Tidak perlu | Layar I-09, I-10, dan I-13 yang hanya menampilkan data dan meneruskan aksi ke klien API.                                                                                                                | - (teruji lewat UC-06, UC-07, UC-12)          |
| C-23     | `FeedbackView`               | Tidak perlu | Layar I-11 dan I-14 yang hanya menampilkan data dan meneruskan aksi ke klien API.                                                                                                                       | - (teruji lewat UC-08, UC-09)                 |
| C-24     | `ServerStatusView`           | Sedang      | Memuat logika tampilan status: lencana Up/Down, status "Belum dicek", dan waktu pemeriksaan terakhir.                                                                                                   | C-24-UT01 dst.                                |
| C-25     | `AuthController`             | Sedang      | Mengoordinasikan login Google, login demo, _logout_, dan pendaftaran perangkat dengan mendelegasikan ke `GoogleAuthService` dan `SesiAutentikasi`.                                                      | C-25-UT01 dst.                                |
| C-26     | `AffirmationController`      | Sedang      | Mendelegasikan validasi waktu ke `Validasi` lalu penyimpanan ke `DailyAffirmation`.                                                                                                                     | C-26-UT01 dst.                                |
| C-27     | `ReminderController`         | Sedang      | Mendelegasikan validasi jenis dan waktu ke `Validasi` lalu penyimpanan ke `Reminder`.                                                                                                                   | C-27-UT01 dst.                                |
| C-28     | `CalendarController`         | Sedang      | Mengoordinasikan pengambilan _event_ Google dan jadwal konsultasi lalu penggabungannya, termasuk penurunan ke jadwal saja bila Google gagal.                                                            | C-28-UT01 dst.                                |
| C-29     | `ConsultationController`     | Mendalam    | Memuat aturan pemesanan: hanya slot tersedia yang dapat dipesan, satu sesi per hari, konfirmasi bentrok Google Calendar, serta perbedaan daftar slot per peran.                                         | C-29-UT01 dst.                                |
| C-30     | `FAQController`              | Sedang      | Mendelegasikan validasi masukan ke `Validasi` lalu operasi FAQ dan pengajuan pertanyaan ke kelas _model_, dengan pembatasan peran.                                                                      | C-30-UT01 dst.                                |
| C-31     | `FeedbackController`         | Sedang      | Mendelegasikan validasi masukan ke `Validasi` lalu operasi umpan balik ke `UmpanBalik`, dengan pembatasan peran.                                                                                        | C-31-UT01 dst.                                |
| C-32     | `ServerStatusController`     | Mendalam    | Memuat logika pemeriksaan status (Algo-021): dua alamat pemeriksaan, batas waktu 5 detik, hanya 2xx dihitung _up_, dan batas kesegaran 30 detik untuk "Periksa Sekarang".                               | C-32-UT01 dst.                                |
| C-33     | `Validasi`                   | Mendalam    | Memuat seluruh aturan validasi masukan (Algo-023, Algo-025, Algo-026): format waktu, rentang jadwal, isian kosong, format token _push_, ISO 8601, dan _escaping_ pola pencarian.                        | C-33-UT01 dst.                                |
| C-34     | `GoogleAuthService`          | Mendalam    | Integrasi eksternal dan keamanan: penukaran kode otorisasi (Algo-027), pembacaan identitas dari `id_token`, serta enkripsi AES-256-GCM token Google.                                                    | C-34-UT01 dst.                                |
| C-35     | `CloudflareD1Database`       | Tidak perlu | Kelas infrastruktur (_binding_ D1 dan Drizzle) tanpa logika aplikasi; teruji secara tidak langsung oleh seluruh pengujian integrasi.                                                                    | - (teruji lewat INT-TC05, INT-TC06, INT-TC11) |
| C-36     | `HomeView`                   | Tidak perlu | Layar I-02 dan I-03 yang hanya menampilkan ringkasan data dari _controller_ lain.                                                                                                                       | - (teruji lewat UC-11-TC01)                   |

Ringkasan: 11 kelas Mendalam, 12 kelas Sedang, dan 13 kelas Tidak perlu.

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada 23 kelas bertingkat Mendalam dan Sedang pada Tabel 4.1.1. Kelas Mendalam diuji pada operasi public utama dengan kasus normal, batas, dan negatif. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama. Kelas bertingkat Tidak perlu tidak memiliki pengujian unit tersendiri dan teruji tidak langsung melalui pengujian integrasi dan _use case_.

Cara menjalankan unit test: `cd src/backend && bun run test` untuk pengujian _server_, dan `cd src/mobile && bun run test` untuk pengujian _client_. Pemeriksaan tipe dijalankan dengan `bun run typecheck` pada masing-masing direktori.

Hasil pada subbab ini diperoleh dari menjalankan kedua perintah tersebut pada _commit_ `103a26f` di `main` (20 November 2026): _server_ 273 dari 273 kasus uji lulus pada 11 berkas, dan _client_ 167 dari 167 kasus uji lulus pada 14 berkas. Kolom Hasil Pengujian merangkum kasus uji yang menjalankan prosedur pada setiap baris.

Lokasi file test: `src/backend/test/` dan `src/backend/src/index.test.ts` untuk _server_, serta `src/mobile/test/` untuk _client_. Konfigurasi Vitest berada pada `src/backend/vitest.config.ts` dan `src/mobile/vitest.config.mts`.

Cakupan yang dilaporkan adalah cakupan operasi public sebagaimana tercantum pada DPPL, bukan persentase baris kode. Kedua proyek tidak memasang penyedia _coverage_ Vitest, sehingga angka _coverage_ otomatis tidak tersedia. Untuk setiap kelas Mendalam, tabel ringkasan bernomor `4.2.xb` (misalnya Tabel 4.2.1b untuk C-04) merangkum operasi yang diuji dan algoritma yang tercakup; bukti keluaran _test runner_ dicantumkan pada Subbab 4.6.

### 4.2.1 Kelas C-04 `SesiAutentikasi`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/auth.test.ts`, `src/backend/test/scheduler.test.ts`, `src/mobile/test/client.test.ts`, `src/mobile/test/perangkat.test.ts`.

Tabel 4.2.1. Hasil Pengujian Unit Kelas C-04

| ID Pengujian | Operasi yang Diuji              | Jenis Kasus | Prosedur/Masukan                                                                                      | Hasil yang Diharapkan                                                                                 | Hasil Pengujian                                                                                                                                                                           | Kesimpulan |
| ------------ | ------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-04-UT01    | `verifikasiToken()`             | Normal      | Kirim permintaan dengan token `Bearer` aktif.                                                         | Identitas pengguna dikembalikan.                                                                      | `verifikasiToken` menerima sesi aktif dan mengembalikan identitas pengguna.                                                                                                               | Pass       |
| C-04-UT02    | `verifikasiToken()`             | Batas       | Gunakan sesi yang belum melewati `BATAS_SESI_HARI`.                                                   | Sesi masih diterima.                                                                                  | Sesi yang belum melewati `BATAS_SESI` masih diterima.                                                                                                                                     | Pass       |
| C-04-UT03    | `verifikasiToken()`, `logout()` | Negatif     | Gunakan token tidak dikenal, skema bukan `Bearer`, sesi berakhir, atau sesi kedaluwarsa; lalu logout. | Permintaan ditolak, sesi kedaluwarsa diakhiri, dan token setelah logout tidak dapat dipakai.          | Permintaan tanpa header, skema selain `Bearer`, token tak dikenal, dan sesi berakhir ditolak 401; sesi kedaluwarsa ditolak dan diakhiri; token setelah `logout` tidak dapat dipakai lagi. | Pass       |
| C-04-UT04    | `daftarkanPerangkat()`          | Normal      | Daftarkan token push sah pada dua sesi berurutan, lalu coba token tidak sah.                          | Token tersimpan pada sesi aktif, sesi lain pada perangkat sama diakhiri, dan token tidak sah ditolak. | Token tersimpan pada sesi aktif (Q-034), sesi lain pada perangkat yang sama diakhiri (Q-033), dan token yang tidak berpola Expo ditolak.                                                  | Pass       |

Tabel 4.2.1b. Ringkasan Cakupan Kelas C-04

| Informasi                       | Keterangan                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `autentikasiPengguna()`, `verifikasiToken()`, `logout()`, `daftarkanPerangkat()`                              |
| Operasi yang diuji              | `verifikasiToken()`, `logout()`, `daftarkanPerangkat()`; `autentikasiPengguna()` diuji pada C-25 dan INT-TC01 |
| ID Algoritma yang tercakup      | Algo-001, Algo-002, Algo-003, Algo-030                                                                        |
| Bukti cakupan                   | Tabel 4.2.1 dan keluaran Vitest pada Subbab 4.6                                                               |

### 4.2.2 Kelas C-05 `DailyAffirmation`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/affirmation.test.ts`, `src/backend/test/scheduler.test.ts`, `src/backend/test/validasi.test.ts`, `src/mobile/test/afirmasi.test.ts`.

Tabel 4.2.2. Hasil Pengujian Unit Kelas C-05

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan                                                           | Hasil yang Diharapkan                                                                            | Hasil Pengujian                                                                                                                                       | Kesimpulan |
| ------------ | ------------------ | ----------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-05-UT01    | `aturWaktuKirim()` | Normal      | Simpan afirmasi untuk pertama kalinya melalui `PUT /api/affirmation/time`. | Baris baru dibuat dengan konten bawaan `KONTEN_BAWAAN`.                                          | `PUT` pertama membuat baris baru berisi `KONTEN_BAWAAN` (Q-023).                                                                                      | Pass       |
| C-05-UT02    | `aturWaktuKirim()` | Batas       | Simpan waktu kedua kali, lalu hapus afirmasi dua kali.                     | Baris yang sama diperbarui; penghapusan pertama menghapus baris dan penghapusan kedua tetap 200. | `PUT` kedua mengubah baris yang sama tanpa menambah baris (Q-022); `DELETE` menghapus afirmasi lalu `GET` kembali null, dan `DELETE` kedua tetap 200. | Pass       |
| C-05-UT03    | `kirimAfirmasi()`  | Normal      | Jalankan tugas dengan afirmasi jatuh tempo dan jam sesuai WIB.             | Notifikasi dicatat dan push dikirim ke sesi dengan token perangkat.                              | Notifikasi untuk afirmasi jatuh tempo tercatat (Q-004/Q-006) dan satu _push_ dikirim ke token sesi aktif (Q-007).                                     | Pass       |
| C-05-UT04    | `kirimAfirmasi()`  | Negatif     | Jalankan tugas pada jam yang tidak cocok dan kirim format waktu salah.     | Tidak ada pengiriman; format waktu ditolak.                                                      | Tidak ada pencatatan maupun pengiriman saat jam tidak cocok; format waktu salah ditolak (Algo-023).                                                   | Pass       |

Tabel 4.2.2b. Ringkasan Cakupan Kelas C-05

| Informasi                       | Keterangan                                               |
| ------------------------------- | -------------------------------------------------------- |
| Daftar operasi public pada DPPL | `aturWaktuKirim()`, `kirimAfirmasi()`, `ambilAfirmasi()` |
| Operasi yang diuji              | `aturWaktuKirim()`, `kirimAfirmasi()`, `ambilAfirmasi()` |
| ID Algoritma yang tercakup      | Algo-004, Algo-005, Algo-028, Algo-031                   |
| Bukti cakupan                   | Tabel 4.2.2 dan keluaran Vitest pada Subbab 4.6          |

### 4.2.3 Kelas C-06 `Reminder`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/affirmation.test.ts`, `src/backend/test/scheduler.test.ts`, `src/mobile/test/pengingat.test.ts`.

Tabel 4.2.3. Hasil Pengujian Unit Kelas C-06

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan                                     | Hasil yang Diharapkan                                                      | Hasil Pengujian                                                                                         | Kesimpulan |
| ------------ | ------------------ | ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| C-06-UT01    | `aturWaktuKirim()` | Normal      | Simpan dan perbarui pengingat untuk setiap jenis.    | Tiga jenis selalu dikembalikan; tiap jenis tersimpan dan dapat diperbarui. | `GET` selalu mengembalikan tiga jenis; `PUT` per jenis membuat lalu mengubah baris (Q-024/Q-025/Q-026). | Pass       |
| C-06-UT02    | `kirimPengingat()` | Normal      | Jalankan tugas dengan pengingat jatuh tempo.         | Notifikasi dicatat dengan teks sesuai jenis.                               | Notifikasi pengingat tercatat dengan teks sesuai jenis (Q-005).                                         | Pass       |
| C-06-UT03    | `aturWaktuKirim()` | Batas       | Hapus satu jenis pengingat, lalu ulangi penghapusan. | Jenis tersebut menjadi null dan penghapusan kedua tetap 200.               | `DELETE` menghapus satu jenis sehingga waktunya null, jenis lain tetap; `DELETE` kedua tetap 200.       | Pass       |
| C-06-UT04    | `aturWaktuKirim()` | Negatif     | Kirim jenis di luar enum atau waktu tidak valid.     | Permintaan ditolak.                                                        | Jenis di luar enum dan waktu tidak valid ditolak, baik pada `PUT` maupun `DELETE`.                      | Pass       |

Tabel 4.2.3b. Ringkasan Cakupan Kelas C-06

| Informasi                       | Keterangan                                      |
| ------------------------------- | ----------------------------------------------- |
| Daftar operasi public pada DPPL | `aturWaktuKirim()`, `kirimPengingat()`          |
| Operasi yang diuji              | `aturWaktuKirim()`, `kirimPengingat()`          |
| ID Algoritma yang tercakup      | Algo-006, Algo-007, Algo-028                    |
| Bukti cakupan                   | Tabel 4.2.3 dan keluaran Vitest pada Subbab 4.6 |

### 4.2.4 Kelas C-07 `Notifikasi`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/scheduler.test.ts`, `src/mobile/test/notifikasi.test.ts`.

Tabel 4.2.4. Hasil Pengujian Unit Kelas C-07

| ID Pengujian | Operasi yang Diuji  | Jenis Kasus | Prosedur/Masukan                                                         | Hasil yang Diharapkan                                                              | Hasil Pengujian                                                                                                                                                   | Kesimpulan |
| ------------ | ------------------- | ----------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-07-UT01    | `kirimNotifikasi()` | Normal      | Catat notifikasi afirmasi dan pengingat.                                 | Tepat satu dari `id_affirmation` atau `id_reminder` terisi.                        | Notifikasi afirmasi dan pengingat tercatat dengan tepat satu sumber terisi.                                                                                       | Pass       |
| C-07-UT02    | `kirimNotifikasi()` | Batas       | Kirim notifikasi kepada lebih dari 100 penerima.                         | Pengiriman dibagi menjadi _batch_ maksimal 100 pesan.                              | Lebih dari 100 penerima dikirim dalam beberapa _batch_ berisi maksimal 100 pesan.                                                                                 | Pass       |
| C-07-UT03    | `kirimNotifikasi()` | Negatif     | Token ditolak `DeviceNotRegistered` atau perangkat tidak mendukung push. | Token dikosongkan; notifikasi tetap tercatat dan tidak melempar galat ke pengguna. | Token yang ditolak `DeviceNotRegistered` dikosongkan (Q-008); perangkat tanpa dukungan _push_ dilewati dan galat pengambilan token atau _backend_ tidak dilempar. | Pass       |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C-07

| Informasi                       | Keterangan                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `kirimNotifikasi()`, `tampilkanNotifikasi()`                                                  |
| Operasi yang diuji              | `kirimNotifikasi()`; `tampilkanNotifikasi()` diperiksa melalui UC-01 dan UC-02 pada perangkat |
| ID Algoritma yang tercakup      | Algo-008                                                                                      |
| Bukti cakupan                   | Tabel 4.2.4 dan keluaran Vitest pada Subbab 4.6                                               |

### 4.2.5 Kelas C-08 `GoogleCalendarService`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/kalender.test.ts`, `src/backend/test/consultation.test.ts`.

Tabel 4.2.5. Hasil Pengujian Unit Kelas C-08

| ID Pengujian | Operasi yang Diuji   | Jenis Kasus | Prosedur/Masukan                                             | Hasil yang Diharapkan                                                                                                  | Hasil Pengujian                                                                                                    | Kesimpulan |
| ------------ | -------------------- | ----------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------- |
| C-08-UT01    | `ambilKalender()`    | Normal      | Ambil _event_ dengan rentang tanggal tertentu.               | Hanya _event_ dalam rentang yang dikembalikan; hasil digabung pada kalender.                                           | Hanya _event_ dalam rentang yang diminta yang dihasilkan, lalu digabung dengan jadwal konsultasi.                  | Pass       |
| C-08-UT02    | `ambilKalender()`    | Batas       | Gunakan rentang sempit yang tidak memuat _event_ contoh.     | Tidak ada _event_ di luar rentang yang dikembalikan.                                                                   | Rentang sempit tidak mengembalikan _event_ di luar rentang.                                                        | Pass       |
| C-08-UT03    | `cekBentrokJadwal()` | Negatif     | `freeBusy` melaporkan sibuk; lalu simulasikan layanan gagal. | Bentrok menghasilkan 409 `GOOGLE_CALENDAR_CONFLICT`; kegagalan layanan mengembalikan jadwal lokal disertai peringatan. | `freeBusy` sibuk menghasilkan 409; saat Google gagal, kalender tetap mengembalikan slot lokal disertai peringatan. | Pass       |

Tabel 4.2.5b. Ringkasan Cakupan Kelas C-08

| Informasi                       | Keterangan                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `ambilKalender()`, `cekBentrokJadwal()`                                                   |
| Operasi yang diuji              | `ambilKalender()`, `cekBentrokJadwal()`                                                   |
| ID Algoritma yang tercakup      | Algo-009, Algo-010                                                                        |
| Bukti cakupan                   | Tabel 4.2.5 dan keluaran Vitest pada Subbab 4.6; penyimpanan token Google diuji pada C-34 |

### 4.2.6 Kelas C-09 `KalenderGabungan`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/kalender.test.ts`, `src/backend/test/consultation.test.ts`, `src/mobile/test/kalender.test.ts`.

Tabel 4.2.6. Hasil Pengujian Unit Kelas C-09

| ID Pengujian | Operasi yang Diuji                   | Jenis Kasus | Prosedur/Masukan                                                        | Hasil yang Diharapkan                                                                                                           | Hasil Pengujian                                                                                                                                                                                                                                   | Kesimpulan |
| ------------ | ------------------------------------ | ----------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-09-UT01    | `gabungkanJadwal()`                  | Normal      | Gabungkan _event_ Google dan slot konsultasi.                           | Hasil terurut menurut waktu mulai, bukan urutan sumber.                                                                         | Hasil penggabungan terurut menurut waktu mulai, bukan urutan sumber.                                                                                                                                                                              | Pass       |
| C-09-UT02    | `gabungkanJadwal()`, `tanggalSlot()` | Batas       | Sertakan _event_ seharian, _event_ multi-hari, dan sesi milik pengguna. | Tanggal lokal tetap benar, _event_ tampil pada setiap hari yang beririsan, dan penanda `milikSaya` serta nama konsultan sesuai. | _Event_ seharian dan tanggal _date-only_ dipertahankan; sesi sendiri ditandai `milikSaya` dengan nama konsultan; slot lain pada hari yang sudah ada sesi disembunyikan; `tanggalSlot` memakai tanggal ISO yang sama dengan pemeriksaan pemesanan. | Pass       |
| C-09-UT03    | `gabungkanJadwal()`                  | Negatif     | Sertakan _event_ tanpa waktu, judul kosong, dan slot yang sudah lewat.  | _Event_ tanpa waktu diabaikan, judul pengganti dipakai, dan slot lewat tidak ditampilkan.                                       | _Event_ tanpa waktu diabaikan, judul pengganti dipakai saat `summary` kosong, slot yang sudah lewat dan sesi mahasiswa lain tidak ditampilkan.                                                                                                    | Pass       |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C-09

| Informasi                       | Keterangan                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `gabungkanJadwal()`, `jadwalBentrok()`, `ubahKalender()`                                                |
| Operasi yang diuji              | `gabungkanJadwal()`; `jadwalBentrok()` dan `ubahKalender()` diuji tidak langsung melalui C-11 dan UC-05 |
| ID Algoritma yang tercakup      | Algo-011, Algo-012, Algo-013                                                                            |
| Bukti cakupan                   | Tabel 4.2.6 dan keluaran Vitest pada Subbab 4.6                                                         |

### 4.2.7 Kelas C-11 `JadwalKonsultasi`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/jadwal-konsultan.test.ts`, `src/backend/test/consultation.test.ts`, `src/mobile/test/konsultasi.test.ts`.

Tabel 4.2.7. Hasil Pengujian Unit Kelas C-11

| ID Pengujian | Operasi yang Diuji                   | Jenis Kasus | Prosedur/Masukan                                                                                            | Hasil yang Diharapkan                                                                                     | Hasil Pengujian                                                                                                                                                 | Kesimpulan |
| ------------ | ------------------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-11-UT01    | `simpanJadwal()`, `perbaruiJadwal()` | Normal      | Simpan slot baru lalu ubah jendela waktunya.                                                                | Slot tersimpan berstatus tersedia dan perubahan hanya menyentuh waktu mulai/selesai.                      | `simpanJadwal` menyimpan slot berstatus tersedia; `perbaruiJadwal` hanya mengubah waktu mulai dan selesai (Q-027).                                              | Pass       |
| C-11-UT02    | `validasiJadwal()` via C-33          | Batas       | Simpan slot yang menempel pada slot lain, bandingkan waktu sebagai waktu, dan edit slot itu sendiri.        | Slot yang menempel diterima, perbandingan tidak berbasis teks, dan edit tidak menganggap dirinya bentrok. | Slot yang menempel diterima, perbandingan dilakukan sebagai waktu, dan slot yang sedang diedit tidak dihitung sebagai bentrok.                                  | Pass       |
| C-11-UT03    | `pesanSesi()`                        | Negatif     | Pesan slot terpesan, slot tak dikenal, atau dua sesi pada hari yang sama; jalankan dua pemesanan bersamaan. | Hanya satu pemesanan bersamaan yang berhasil; sisanya ditolak dengan 409 atau 404.                        | Slot terpesan dan pemesanan kedua ditolak 409, slot tak dikenal 404, sesi kedua pada hari yang sama 409; dari dua pemesanan bersamaan hanya satu yang berhasil. | Pass       |
| C-11-UT04    | `ambilSesiBerikutnya()`              | Normal      | Pesan satu sesi lalu minta sesi berikutnya.                                                                 | Sesi terpesan dikembalikan; tanpa sesi hasilnya null.                                                     | Sesi yang dipesan muncul pada `/api/sessions/next`; tanpa pesanan hasilnya null (Q-042).                                                                        | Pass       |

Tabel 4.2.7b. Ringkasan Cakupan Kelas C-11

| Informasi                       | Keterangan                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `ambilKalender()`, `ambilKalender(konsultan)`, `simpanJadwal()`, `perbaruiJadwal()`, `pesanSesi()`, `ambilSesiBerikutnya()`     |
| Operasi yang diuji              | `simpanJadwal()`, `perbaruiJadwal()`, `pesanSesi()`, `ambilSesiBerikutnya()`; kedua `ambilKalender()` diuji pada C-28 dan UC-03 |
| ID Algoritma yang tercakup      | Algo-015, Algo-016, Algo-029                                                                                                    |
| Bukti cakupan                   | Tabel 4.2.7 dan keluaran Vitest pada Subbab 4.6                                                                                 |

### 4.2.8 Kelas C-12 `FAQ`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/faq.test.ts`, `src/mobile/test/faq.test.ts`.

Tabel 4.2.8. Hasil Pengujian Unit Kelas C-12

| ID Pengujian | Operasi yang Diuji                     | Jenis Kasus | Prosedur/Masukan                                        | Hasil yang Diharapkan                                                            | Hasil Pengujian                                                                                                                                          | Kesimpulan |
| ------------ | -------------------------------------- | ----------- | ------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-12-UT01    | `cariFAQ()`, `ambilDaftarPertanyaan()` | Normal      | Cari FAQ berdasarkan kata kunci dan ubah urutan daftar. | FAQ yang cocok dikembalikan dan urutan A–Z, Z–A, serta Terbaru sesuai parameter. | Pencarian mencocokkan pertanyaan maupun jawaban (Algo-017); `urut=za` membalik urutan dan `urut=baru` memakai `waktu_dibuat` dengan baris lama di akhir. | Pass       |
| C-12-UT02    | `cariFAQ()`                            | Batas       | Kirim kata kunci kosong dan urutan tidak dikenal.       | Semua FAQ ditampilkan dan urutan kembali ke A–Z.                                 | Kata kunci kosong menampilkan semua FAQ dan urutan tak dikenal kembali ke A–Z.                                                                           | Pass       |
| C-12-UT03    | `cariFAQ()`                            | Negatif     | Gunakan pola LIKE `%`, `_`, dan `!` dalam pencarian.    | Pola di-_escape_ sehingga tidak mengubah hasil pencarian.                        | Karakter `%`, `_`, dan `!` di-_escape_ sehingga dicocokkan secara harfiah.                                                                               | Pass       |

### 4.2.9 Kelas C-14 `UmpanBalik`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/feedback-status.test.ts`, `src/mobile/test/umpanBalik.test.ts`.

Tabel 4.2.9. Hasil Pengujian Unit Kelas C-14

| ID Pengujian | Operasi yang Diuji                        | Jenis Kasus | Prosedur/Masukan                                                                             | Hasil yang Diharapkan                                                                                | Hasil Pengujian                                                                                          | Kesimpulan |
| ------------ | ----------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------- |
| C-14-UT01    | `kirimUmpanBalik()`, `berikanTanggapan()` | Normal      | Kirim umpan balik, lalu berikan tanggapan.                                                   | Baris tersimpan dan tanggapan tercatat dengan `id_administrator`.                                    | Umpan balik tersimpan (Q-038) dan tanggapan tersimpan bersama `id_administrator` (Q-039).                | Pass       |
| C-14-UT02    | `ambilListUmpanBalik()`                   | Batas       | Minta daftar milik sendiri saat kosong, gunakan `?status` tidak dikenal, dan batasi `limit`. | Daftar kosong dikembalikan, status tidak dikenal diabaikan, dan `limit` dijepit pada batas maksimum. | `/mine` mengembalikan daftar kosong, `?status` tak dikenal diabaikan, dan `limit` dijepit pada maksimum. | Pass       |
| C-14-UT03    | `ambilListUmpanBalik()`                   | Negatif     | Mahasiswa meminta `GET /api/feedback` dan Administrator meminta `/mine`.                     | Keduanya ditolak dengan 403.                                                                         | Mahasiswa pada `GET /api/feedback` dan Administrator pada `/mine` sama-sama ditolak 403.                 | Pass       |

### 4.2.10 Kelas C-16 `LoginView`

Tingkat: **Sedang**. Berkas uji: `src/mobile/test/auth.test.ts`, `src/mobile/test/nativeIntent.test.ts`, `src/backend/test/auth.test.ts`.

Tabel 4.2.10. Hasil Pengujian Unit Kelas C-16

| ID Pengujian | Operasi yang Diuji                             | Jenis Kasus | Prosedur/Masukan                                                                                     | Hasil yang Diharapkan                                                                 | Hasil Pengujian                                                                                                                                                    | Kesimpulan |
| ------------ | ---------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| C-16-UT01    | `masukLamanLogin()`, `isiLoginPage()`          | Normal      | Buka URL otorisasi dari Expo Go dan dari APK produksi.                                               | _Deep link_ memakai `exp://<host>/--/` pada Expo Go dan `sehati://masuk` pada APK.    | Expo Go menghasilkan `exp://<host>/--/` dan _binary_ produksi tanpa `hostUri` menghasilkan `sehati://masuk`.                                                       | Pass       |
| C-16-UT02    | `tampilkanLoginPage()`, `redirectSystemPath()` | Batas       | Berikan `hostUri` tanpa `executionEnvironment`, dan tautan kembali login ke _handler_ native intent. | `hostUri` yang menentukan skema; tautan login tidak diteruskan sebagai rute aplikasi. | `hostUri` yang menentukan skema meski `executionEnvironment` berbeda; `redirectSystemPath` mengabaikan tautan kembali login dan meneruskan tautan lain apa adanya. | Pass       |
| C-16-UT03    | `loadPageUtama()`, `showError()`               | Negatif     | Tutup peramban, balas `access_denied`, dan kirim respons tanpa `code` maupun `error`.                | Dua kasus pertama mengembalikan pembatalan; kasus ketiga melempar `ApiError`.         | Peramban ditutup dan `access_denied` menghasilkan null (batal); respons tanpa `code` maupun `error` melempar `ApiError`.                                           | Pass       |

### 4.2.11 Kelas C-19 `CalendarView`

Tingkat: **Sedang**. Berkas uji: `src/mobile/test/kalender.test.ts`.

Tabel 4.2.11. Hasil Pengujian Unit Kelas C-19

| ID Pengujian | Operasi yang Diuji                          | Jenis Kasus | Prosedur/Masukan                                      | Hasil yang Diharapkan                                                                                    | Hasil Pengujian                                                                                                            | Kesimpulan |
| ------------ | ------------------------------------------- | ----------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-19-UT01    | `bukaPageCalendar()`, `tampilkanKalender()` | Normal      | Tampilkan _event_ seharian dengan tanggal lokal.      | _Event_ muncul pada tanggal yang benar dan berlabel "Seharian".                                          | _Event_ seharian dibaca sebagai tanggal lokal, tampil pada hari yang benar, dan berlabel "Seharian".                       | Pass       |
| C-19-UT02    | `tampilkanKalender()`                       | Batas       | Tampilkan _event_ multi-hari dan tiga sumber _event_. | _Event_ muncul pada setiap hari yang beririsan; penanda membedakan Google, sesi saya, dan slot tersedia. | _Event_ multi-hari tampil pada setiap hari yang beririsan; `penandaEvent` membedakan Google, sesi saya, dan slot tersedia. | Pass       |
| C-19-UT03    | `showErrorMessage()`                        | Negatif     | Berikan tanggal _event_ tidak valid.                  | Tanggal ditolak dan tidak merusak tampilan kalender.                                                     | Tanggal _event_ tidak valid ditolak tanpa merusak urutan tampilan.                                                         | Pass       |

### 4.2.12 Kelas C-21 `ConsultationManagementView`

Tingkat: **Sedang**. Berkas uji: `src/mobile/test/jadwal.test.ts`, `src/mobile/test/konsultasi.test.ts`.

Tabel 4.2.12. Hasil Pengujian Unit Kelas C-21

| ID Pengujian | Operasi yang Diuji                                    | Jenis Kasus | Prosedur/Masukan                                                                   | Hasil yang Diharapkan                                                              | Hasil Pengujian                                                                                                                                                                    | Kesimpulan |
| ------------ | ----------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-21-UT01    | `bukaPageKonsultasi()`, `tampilkanSetelanTersimpan()` | Normal      | Format tanggal dan jam dalam WIB serta parse jam yang valid.                       | Tanggal tiga hari berturut-turut dan label jam sesuai WIB.                         | Tanggal dan jam dihitung dalam WIB; `daftarTanggal` memberi tiga hari berturut-turut termasuk pergantian bulan dan tahun; `parseJam` menerima format `09.00`, `9.00`, dan `09:00`. | Pass       |
| C-21-UT02    | `perbaruiJadwal()`, `tampilkanKalender()`             | Batas       | Simpan slot yang menempel pada slot lain dan bandingkan `"9.00"` dengan `"10.00"`. | Perbandingan dilakukan sebagai waktu, bukan teks, dan slot yang menempel diterima. | Slot yang menempel tidak dianggap tumpang tindih dan `"9.00"` dibandingkan dengan `"10.00"` sebagai waktu.                                                                         | Pass       |
| C-21-UT03    | `showError()`                                         | Negatif     | Kirim jam salah, jam selesai sebelum mulai, dan balasan 500 saat menyimpan.        | Masukan ditolak per kolom dan banner galat I-12-07 ditampilkan.                    | Jam kosong atau salah format ditolak per kolom, jam selesai tidak setelah jam mulai ditolak, dan galat 500, 502, serta jaringan menampilkan banner I-12-07.                        | Pass       |

### 4.2.13 Kelas C-24 `ServerStatusView`

Tingkat: **Sedang**. Berkas uji: `src/mobile/test/status.tampilan.test.ts`, `src/mobile/test/status.test.ts`.

Tabel 4.2.13. Hasil Pengujian Unit Kelas C-24

| ID Pengujian | Operasi yang Diuji        | Jenis Kasus | Prosedur/Masukan                                                        | Hasil yang Diharapkan                                                                                             | Hasil Pengujian                                                                                                                           | Kesimpulan |
| ------------ | ------------------------- | ----------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-24-UT01    | `tampilkanStatusServer()` | Normal      | Tampilkan status Up dan Down.                                           | Lencana dan keterangan sesuai status serta membedakan server dari basis data.                                     | Lencana Up dan Down sesuai status, serta judul dan keterangan membedakan server dari basis data.                                          | Pass       |
| C-24-UT02    | `cekStatusServer()`       | Batas       | Tampilkan status yang belum pernah dicek dan minta dua baris sekaligus. | Status ditandai "Belum dicek", bukan Down; dua baris dikembalikan dengan `server` lebih dulu dan waktu dalam WIB. | Status yang belum pernah dicek ditandai "Belum dicek", bukan Down; dua baris dikembalikan dengan `server` lebih dulu dan waktu dalam WIB. | Pass       |
| C-24-UT03    | `cekStatusServer()`       | Negatif     | Salah satu permintaan status gagal.                                     | Galat diteruskan, bukan dianggap sebagai status Down.                                                             | `ambilStatusLayanan` meneruskan galat bila salah satu permintaan gagal.                                                                   | Pass       |

### 4.2.14 Kelas C-25 `AuthController`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/auth.test.ts`, `src/mobile/test/perangkat.test.ts`.

Tabel 4.2.14. Hasil Pengujian Unit Kelas C-25

| ID Pengujian | Operasi yang Diuji     | Jenis Kasus | Prosedur/Masukan                                                                                 | Hasil yang Diharapkan                                                                  | Hasil Pengujian                                                                                                                                                               | Kesimpulan |
| ------------ | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-25-UT01    | `kirimData()`          | Normal      | Kirim kode otorisasi untuk pengguna baru dan pengguna yang sudah ada.                            | Pengguna baru dibuat beserta sesi dan token terenkripsi; pengguna lama tidak duplikat. | Pengguna baru didaftarkan beserta sesi dan token terenkripsi; login kedua memakai akun yang sama tanpa duplikasi.                                                             | Pass       |
| C-25-UT02    | `tampilkanLoginPage()` | Batas       | Kirim parameter `kembali` dan `state` dengan skema selain aplikasi, tanpa host, dan dengan host. | Hanya _deep link_ aplikasi ber-_host_ yang diterima.                                   | `kembali`/`state` dengan skema lain, `javascript:`, string kosong, dan _deep link_ tanpa _host_ ditolak 400; `sehati://masuk` dan `exp://<host>/--/masuk` diterima.           | Pass       |
| C-25-UT03    | `kirimData()`          | Negatif     | Kode gagal ditukar, body tidak ada, peran demo tidak dikenal, atau `MODE_DEMO` nonaktif.         | Permintaan ditolak dan rute demo tidak tersedia.                                       | Kode yang gagal ditukar, _body_ tanpa `kodeOtorisasi`, dan _body_ bukan JSON ditolak; peran demo tak dikenal ditolak dan rute demo tidak tersedia saat `MODE_DEMO` bukan `1`. | Pass       |

### 4.2.15 Kelas C-26 `AffirmationController`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/affirmation.test.ts`, `src/mobile/test/afirmasi.test.ts`.

Tabel 4.2.15. Hasil Pengujian Unit Kelas C-26

| ID Pengujian | Operasi yang Diuji                                  | Jenis Kasus | Prosedur/Masukan                                           | Hasil yang Diharapkan                                                          | Hasil Pengujian                                                                                   | Kesimpulan |
| ------------ | --------------------------------------------------- | ----------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------- |
| C-26-UT01    | `submitWaktuPengiriman()`                           | Normal      | Simpan waktu afirmasi pertama dan kedua kalinya.           | Pertama membuat baris dengan konten bawaan; kedua memperbarui baris yang sama. | `PUT` pertama membuat baris berisi konten bawaan dan `PUT` kedua mengubah baris yang sama.        | Pass       |
| C-26-UT02    | `submitWaktuPengiriman()`                           | Batas       | Hapus afirmasi saat belum ada preferensi.                  | Permintaan tetap 200 dan preferensi tetap kosong.                              | `DELETE` tanpa afirmasi tetap 200 dan `GET` tetap null.                                           | Pass       |
| C-26-UT03    | `submitWaktuPengiriman()`, `ambilAfirmasiHariIni()` | Negatif     | Kirim format waktu salah atau minta sebagai Administrator. | Format ditolak dan akses Administrator ditolak dengan 403.                     | Format waktu salah ditolak (Algo-023); Administrator ditolak 403 pada `GET`, `PUT`, dan `DELETE`. | Pass       |

### 4.2.16 Kelas C-27 `ReminderController`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/affirmation.test.ts`, `src/mobile/test/pengingat.test.ts`.

Tabel 4.2.16. Hasil Pengujian Unit Kelas C-27

| ID Pengujian | Operasi yang Diuji        | Jenis Kasus | Prosedur/Masukan                                                            | Hasil yang Diharapkan                                          | Hasil Pengujian                                                                      | Kesimpulan |
| ------------ | ------------------------- | ----------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------- |
| C-27-UT01    | `submitWaktuPengiriman()` | Normal      | Atur pengingat untuk masing-masing jenis.                                   | Waktu tersimpan per jenis dan daftar selalu memuat tiga jenis. | Waktu tersimpan per jenis dan daftar selalu memuat tiga jenis.                       | Pass       |
| C-27-UT02    | `submitWaktuPengiriman()` | Batas       | Hapus pengingat tanpa preferensi dan baca daftar awal.                      | Penghapusan tetap 200; waktu ketiga jenis bernilai null.       | Daftar awal berisi tiga jenis dengan waktu null; `DELETE` tanpa pengingat tetap 200. | Pass       |
| C-27-UT03    | `submitWaktuPengiriman()` | Negatif     | Kirim jenis di luar enum, waktu tidak valid, atau permintaan Administrator. | Permintaan ditolak.                                            | Jenis di luar enum, waktu tidak valid, dan permintaan Administrator (403) ditolak.   | Pass       |

### 4.2.17 Kelas C-28 `CalendarController`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/consultation.test.ts`.

Tabel 4.2.17. Hasil Pengujian Unit Kelas C-28

| ID Pengujian | Operasi yang Diuji    | Jenis Kasus | Prosedur/Masukan                                       | Hasil yang Diharapkan                                                            | Hasil Pengujian                                                                  | Kesimpulan |
| ------------ | --------------------- | ----------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- |
| C-28-UT01    | `tampilkanCalendar()` | Normal      | Minta kalender dengan rentang `?dari=` dan `?sampai=`. | _Event_ Google dan jadwal konsultasi digabung dan terurut.                       | _Event_ Google dan slot konsultasi digabung dan terurut.                         | Pass       |
| C-28-UT02    | `tampilkanCalendar()` | Batas       | Minta kalender setelah pengguna memesan sesi.          | Hanya sesi milik sendiri yang tampil dan slot pada hari yang sama disembunyikan. | Hanya sesi milik sendiri yang tampil dan slot pada hari yang sama disembunyikan. | Pass       |
| C-28-UT03    | `tampilkanCalendar()` | Negatif     | Simulasikan kegagalan Google Calendar.                 | Jadwal lokal tetap dikembalikan disertai peringatan.                             | Saat Google gagal, slot lokal tetap dikembalikan disertai peringatan.            | Pass       |

### 4.2.18 Kelas C-29 `ConsultationController`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/consultation.test.ts`, `src/backend/test/jadwal-konsultan.test.ts`, `src/mobile/test/konsultasi.test.ts`.

Tabel 4.2.18. Hasil Pengujian Unit Kelas C-29

| ID Pengujian | Operasi yang Diuji                               | Jenis Kasus | Prosedur/Masukan                                                                                       | Hasil yang Diharapkan                                                                      | Hasil Pengujian                                                                                                                                            | Kesimpulan |
| ------------ | ------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-29-UT01    | `tampilkanOpsiKonsultasi()`, `submitKonsultan()` | Normal      | Ambil daftar konsultan dan slot untuk peran Mahasiswa serta Administrator.                             | Daftar terurut; Mahasiswa melihat slot tersedia, Administrator melihat pula slot terpesan. | Konsultan terurut menurut nama (Q-012); Mahasiswa hanya melihat slot tersedia, Administrator melihat slot tersedia dan terpesan mulai awal hari ini (WIB). | Pass       |
| C-29-UT02    | `updateStatusKonsultasi()`                       | Normal      | Pesan slot tersedia lalu minta sesi berikutnya.                                                        | Slot menjadi terpesan dan sesi muncul pada `/api/sessions/next`.                           | Slot tersedia berubah menjadi terpesan (Q-028) dan pesanan muncul pada `/api/sessions/next`.                                                               | Pass       |
| C-29-UT03    | `updateStatusKonsultasi()`                       | Batas       | Pesan slot yang sama secara bersamaan dan coba `overrideGoogle` saat pengguna sudah punya sesi sehari. | Tepat satu pemesanan berhasil; `overrideGoogle` tidak menembus aturan satu sesi per hari.  | Dari dua pemesanan bersamaan hanya satu yang berhasil; `overrideGoogle` tidak menembus larangan sesi kedua pada hari yang sama.                            | Pass       |
| C-29-UT04    | `updateStatusKonsultasi()`                       | Negatif     | Pesan slot terpesan, slot tak dikenal, atau slot yang bentrok dengan Google.                           | Permintaan ditolak dengan 404/409; Administrator tidak dapat memesan.                      | Slot terpesan ditolak 409, slot tak dikenal 404, bentrok Google 409, dan Administrator yang memesan ditolak 403.                                           | Pass       |

Tabel 4.2.18b. Ringkasan Cakupan Kelas C-29

| Informasi                       | Keterangan                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `tampilkanOpsiKonsultasi()`, `submitKonsultan()`, `updateStatusKonsultasi()`, `ambilSesiBerikutnya()` |
| Operasi yang diuji              | `tampilkanOpsiKonsultasi()`, `submitKonsultan()`, `updateStatusKonsultasi()`, `ambilSesiBerikutnya()` |
| ID Algoritma yang tercakup      | Algo-014, Algo-015, Algo-016, Algo-022, Algo-024, Algo-029                                            |
| Bukti cakupan                   | Tabel 4.2.18 dan keluaran Vitest pada Subbab 4.6                                                      |

### 4.2.19 Kelas C-30 `FAQController`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/faq.test.ts`, `src/mobile/test/faq.test.ts`.

Tabel 4.2.19. Hasil Pengujian Unit Kelas C-30

| ID Pengujian | Operasi yang Diuji                       | Jenis Kasus | Prosedur/Masukan                                                                            | Hasil yang Diharapkan                                                               | Hasil Pengujian                                                                                                                     | Kesimpulan |
| ------------ | ---------------------------------------- | ----------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-30-UT01    | `tambahFAQ()`, `ubahFAQ()`, `hapusFAQ()` | Normal      | Tambah, ubah, dan hapus FAQ melalui rute `/api/faq`.                                        | Perubahan tersimpan dan langsung tampil pada daftar.                                | `POST`, `PUT`, dan `DELETE /api/faq` mengubah data (Q-035–Q-037); ID tak dikenal mengembalikan 404.                                 | Pass       |
| C-30-UT02    | `cariFAQ()`                              | Batas       | Kirim kata kunci kosong dan urutan tidak dikenal.                                           | Semua FAQ ditampilkan dengan urutan A–Z; parameter kosong tidak dikirim dari klien. | Kata kunci kosong menampilkan semua FAQ dan urutan tak dikenal kembali ke A–Z; klien tidak mengirim `?q=` kosong maupun `?urut=az`. | Pass       |
| C-30-UT03    | `kirimPertanyaan()`                      | Negatif     | Kirim pertanyaan kosong, ajukan sebagai Administrator, dan gunakan batas waktu tidak valid. | Permintaan ditolak.                                                                 | Pertanyaan kosong dan pengajuan oleh Administrator ditolak; batas waktu tidak valid pada `GET /api/questions` ditolak.              | Pass       |

### 4.2.20 Kelas C-31 `FeedbackController`

Tingkat: **Sedang**. Berkas uji: `src/backend/test/feedback-status.test.ts`, `src/mobile/test/umpanBalik.test.ts`.

Tabel 4.2.20. Hasil Pengujian Unit Kelas C-31

| ID Pengujian | Operasi yang Diuji                    | Jenis Kasus | Prosedur/Masukan                                                                | Hasil yang Diharapkan                                             | Hasil Pengujian                                                                                                 | Kesimpulan |
| ------------ | ------------------------------------- | ----------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------- |
| C-31-UT01    | `kirimFeedback()`, `kirimTanggapan()` | Normal      | Kirim umpan balik lalu tanggapi sebagai Administrator.                          | Baris tersimpan dan tanggapan tampil pada daftar milik Mahasiswa. | Umpan balik tersimpan dan tanggapan Administrator tampil pada `/mine` milik Mahasiswa.                          | Pass       |
| C-31-UT02    | `tampilkanListFeedback()`             | Batas       | Minta `/mine` saat kosong, gunakan `?status` tidak dikenal, dan batasi `limit`. | Daftar kosong dikembalikan, status diabaikan, dan limit dijepit.  | `/mine` kosong mengembalikan daftar kosong, `?status` tak dikenal diabaikan, dan `limit` dijepit pada maksimum. | Pass       |
| C-31-UT03    | `kirimTanggapan()`                    | Negatif     | Kirim isi kosong dan tanggapi ID tidak dikenal.                                 | Permintaan ditolak dengan galat validasi atau 404.                | Isi dan tanggapan kosong ditolak galat validasi; tanggapan untuk ID tak dikenal mengembalikan 404.              | Pass       |

### 4.2.21 Kelas C-32 `ServerStatusController`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/feedback-status.test.ts`, `src/backend/test/scheduler.test.ts`, `src/backend/src/index.test.ts`, `src/mobile/test/status.test.ts`.

Tabel 4.2.21. Hasil Pengujian Unit Kelas C-32

| ID Pengujian | Operasi yang Diuji             | Jenis Kasus | Prosedur/Masukan                                                                                   | Hasil yang Diharapkan                                                                          | Hasil Pengujian                                                                                                                                        | Kesimpulan |
| ------------ | ------------------------------ | ----------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| C-32-UT01    | `tampilkanStatusServer(jenis)` | Normal      | Minta status `server` dan `db`, lalu baca riwayatnya.                                              | Kedua jenis memeriksa alamat berbeda; hasil terakhir dan riwayat dikembalikan terurut terbaru. | `server` dan `db` memeriksa alamat berbeda dan dicatat (Q-018); status terakhir per jenis (Q-017) dan riwayat terbaru lebih dulu (Q-044) dikembalikan. | Pass       |
| C-32-UT02    | `tampilkanStatusServer(jenis)` | Batas       | Panggil "Periksa Sekarang" sebelum dan sesudah lewat 30 detik, serta minta riwayat dengan `limit`. | Hasil segar dipakai ulang selama 30 detik, probe baru setelahnya, dan `limit` dijepit.         | "Periksa Sekarang" memakai ulang hasil yang lebih muda dari 30 detik dan menjalankan probe baru setelahnya; `limit` riwayat dijepit.                   | Pass       |
| C-32-UT03    | `tampilkanStatusServer(jenis)` | Negatif     | Probe gagal, status 3xx, jenis tidak dikenal, atau permintaan refresh dari Mahasiswa.              | Status dicatat sebagai down, jenis ditolak dengan 422, dan refresh ditolak dengan 403.         | Probe gagal, non-2xx, dan 3xx dicatat down; jenis tak dikenal ditolak 422; refresh dari Mahasiswa ditolak 403 dan tanpa sesi 401.                      | Pass       |

Tabel 4.2.21b. Ringkasan Cakupan Kelas C-32

| Informasi                       | Keterangan                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `tampilkanStatusServer(jenis)`                                                                |
| Operasi yang diuji              | `tampilkanStatusServer(jenis)`; logika probe berada pada `status-probe.ts` dan `scheduler.ts` |
| ID Algoritma yang tercakup      | Algo-020, Algo-021                                                                            |
| Bukti cakupan                   | Tabel 4.2.21 dan keluaran Vitest pada Subbab 4.6                                              |

### 4.2.22 Kelas C-33 `Validasi`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/validasi.test.ts`, `src/backend/test/jadwal-konsultan.test.ts`, `src/mobile/test/jadwal.test.ts`.

Tabel 4.2.22. Hasil Pengujian Unit Kelas C-33

| ID Pengujian | Operasi yang Diuji                       | Jenis Kasus | Prosedur/Masukan                                                                             | Hasil yang Diharapkan                                                                                  | Hasil Pengujian                                                                                                                                                 | Kesimpulan |
| ------------ | ---------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-33-UT01    | `validasiWaktu()`                        | Normal      | Masukkan format waktu yang valid.                                                            | Format diterima dan dikonversi sesuai aturan WIB.                                                      | `validasiWaktu` menerima `HH:MM` 00:00–23:59 dan menolak bentuk lain; jam-menit WIB dihitung dengan _offset_ +7 dan selalu dua digit.                           | Pass       |
| C-33-UT02    | `validasiJadwal()`                       | Batas       | Masukkan rentang ISO 8601 yang wajar, slot yang menempel, dan penyuntingan slot itu sendiri. | Rentang diterima, slot menempel tidak dianggap bentrok, dan edit tidak bentrok dengan dirinya sendiri. | Rentang ISO 8601 yang wajar diterima, slot menempel tidak dianggap bentrok, dan slot yang diedit tidak bentrok dengan dirinya sendiri.                          | Pass       |
| C-33-UT03    | `validasiInput()`, `validasiKonsultan()` | Negatif     | Masukkan isian kosong, konsultan tidak terdaftar, token push tidak sah, dan pola LIKE.       | Isian ditolak, ID konsultan ditolak, token ditolak, dan pola LIKE di-_escape_.                         | Isian kosong atau hanya spasi ditolak, konsultan tidak terdaftar atau ID tidak sah ditolak, token _push_ tidak berpola Expo ditolak, dan pola LIKE di-_escape_. | Pass       |

Tabel 4.2.22b. Ringkasan Cakupan Kelas C-33

| Informasi                       | Keterangan                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------- |
| Daftar operasi public pada DPPL | `validasiWaktu()`, `validasiKonsultan()`, `validasiJadwal()`, `validasiInput()` |
| Operasi yang diuji              | `validasiWaktu()`, `validasiKonsultan()`, `validasiJadwal()`, `validasiInput()` |
| ID Algoritma yang tercakup      | Algo-023, Algo-024, Algo-025, Algo-026                                          |
| Bukti cakupan                   | Tabel 4.2.22 dan keluaran Vitest pada Subbab 4.6                                |

### 4.2.23 Kelas C-34 `GoogleAuthService`

Tingkat: **Mendalam**. Berkas uji: `src/backend/test/auth.test.ts`, `src/backend/test/crypto.test.ts`, `src/backend/test/validasi.test.ts`.

Tabel 4.2.23. Hasil Pengujian Unit Kelas C-34

| ID Pengujian | Operasi yang Diuji                  | Jenis Kasus | Prosedur/Masukan                                                                                           | Hasil yang Diharapkan                                                       | Hasil Pengujian                                                                                                                                                                         | Kesimpulan |
| ------------ | ----------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C-34-UT01    | `validasi(kodeOtorisasi)`           | Normal      | Tukar kode otorisasi yang sah.                                                                             | Identitas pengguna diperoleh dan token disimpan terenkripsi.                | Kode yang sah ditukar menjadi identitas pengguna dan token Google tersimpan terenkripsi.                                                                                                | Pass       |
| C-34-UT02    | enkripsi AES-256-GCM                | Batas       | Enkripsi plaintext yang sama dua kali dan gunakan email kampus serta email non-kampus.                     | _Ciphertext_ berbeda karena IV acak; NIM diambil hanya untuk domain kampus. | _Ciphertext_ berbeda tiap enkripsi karena IV acak dan _roundtrip_ kembali ke _plaintext_; NIM hanya diambil dari domain kampus (_case-insensitive_), domain lain menghasilkan NIM null. | Pass       |
| C-34-UT03    | `validasi(kodeOtorisasi)`, dekripsi | Negatif     | Ubah _ciphertext_, gunakan kunci salah panjang, kirim payload terlalu pendek, dan gagalkan penukaran kode. | Semua ditolak dan login tidak dibuat.                                       | _Ciphertext_ yang diubah, kunci dengan panjang salah, dan _payload_ terlalu pendek ditolak; kode yang gagal ditukar tidak membuat login.                                                | Pass       |

Tabel 4.2.23b. Ringkasan Cakupan Kelas C-34

| Informasi                       | Keterangan                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Daftar operasi public pada DPPL | `validasi(kodeOtorisasi)`                                                      |
| Operasi yang diuji              | `validasi(kodeOtorisasi)` beserta enkripsi/dekripsi token pada `lib/crypto.ts` |
| ID Algoritma yang tercakup      | Algo-001, Algo-027                                                             |
| Bukti cakupan                   | Tabel 4.2.23 dan keluaran Vitest pada Subbab 4.6                               |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu _Controller_ ke _Model_, aplikasi ke basis data, aplikasi ke sistem eksternal, dan tugas _cron_ ke API. Antarmuka pengguna I-01 sampai I-15 diuji melalui _use case_ pada Subbab 4.4; Tabel 4.3.1 memuat batas antarkomponen yang diuji pada subbab ini. Pengujian memakai rute Hono dan basis data D1 tiruan di memori yang dibuat dari berkas migrasi, bukan penyimpanan tiruan untuk logika aplikasi. Google OAuth, Google Calendar, dan Expo Push dipanggil melalui batas yang sama dengan kode produksi, tetapi respons layanan pihak ketiga disiapkan pada pengujian karena kredensial produksi tidak dipakai; dengan demikian yang diverifikasi adalah perilaku Sehati, bukan ketersediaan layanan eksternal.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Batas | Komponen Asal                                                 | Komponen Tujuan                                                                    | Jenis Batas                           | Test Case |
| -------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- | --------- |
| INT-A    | `AuthController` (C-25)                                       | `Pengguna` dan `SesiAutentikasi` (C-01, C-04)                                      | _Controller_ - _Model_                | INT-TC01  |
| INT-B    | `AffirmationController` dan `ReminderController` (C-26, C-27) | `DailyAffirmation` dan `Reminder` (C-05, C-06)                                     | _Controller_ - _Model_                | INT-TC02  |
| INT-C    | `FAQController` (C-30)                                        | `FAQ` (C-12)                                                                       | _Controller_ - _Model_                | INT-TC03  |
| INT-D    | `CalendarController` (C-28)                                   | `GoogleCalendarService`, `KalenderGabungan`, `JadwalKonsultasi` (C-08, C-09, C-11) | _Controller_ - _Model_                | INT-TC04  |
| INT-E    | _Middleware_ D1 dan rute kesehatan                            | Cloudflare D1 (`CloudflareD1Database`, C-35)                                       | Aplikasi - Basis data                 | INT-TC05  |
| INT-F    | `ConsultationController` (C-29)                               | `JadwalKonsultasi` (C-11) pada D1                                                  | Aplikasi - Basis data                 | INT-TC06  |
| INT-G    | Klien API _mobile_ dan `AuthController`                       | Google OAuth 2.0                                                                   | Aplikasi - Sistem eksternal           | INT-TC07  |
| INT-H    | `GoogleCalendarService` (C-08)                                | Google Calendar API                                                                | Aplikasi - Sistem eksternal           | INT-TC08  |
| INT-I    | `LoginView` (C-16) dan klien perangkat                        | `SesiAutentikasi` (C-04) dan Expo Push token                                       | Aplikasi - Sistem eksternal           | INT-TC09  |
| INT-J    | Penjadwal (`scheduler.ts`)                                    | Expo Push Service                                                                  | Aplikasi - Sistem eksternal           | INT-TC10  |
| INT-K    | Cloudflare Cron Trigger 5 menit                               | `/health` dan `/health/db` pada Worker sendiri                                     | _Cron_ - API                          | INT-TC11  |
| INT-L    | Cloudflare Cron Trigger 1 menit dan 12 jam                    | `Notifikasi`, `StatusServer`, `SesiAutentikasi`, dan Expo Push                     | _Cron_ - _Model_ dan sistem eksternal | INT-TC12  |

Pengujian integrasi dijalankan bersama pengujian _server_ dengan `cd src/backend && bun run test` pada _commit_ `103a26f` (20 November 2026), dan seluruh kasus uji yang menjalankan prosedur pada Tabel 4.3.2 lulus.

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Batas | Skenario                                         | Prosedur/Masukan                                                                                                         | Hasil yang Diharapkan                                                                                                                       | Hasil Pengujian                                                                                                                                                                                                                            | Kesimpulan |
| ------------ | -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| INT-TC01     | INT-A    | Login Google pertama dan kedua kali              | Kirim `POST /api/auth/google` untuk pengguna baru, lalu ulangi untuk pengguna yang sama.                                 | Login pertama membuat pengguna, sesi, dan token terenkripsi; login kedua memakai pengguna yang ada dan tidak menduplikasi baris.            | Login pertama membuat pengguna, sesi, dan token terenkripsi; login kedua memakai pengguna yang sama tanpa baris ganda.                                                                                                                     | Pass       |
| INT-TC02     | INT-B    | Simpan, perbarui, dan nonaktifkan afirmasi       | Panggil `PUT /api/affirmation/time` dua kali, lalu `DELETE /api/affirmation`.                                            | Penyimpanan pertama mengisi `KONTEN_BAWAAN`, pembaruan berikutnya mengubah baris yang sama, dan penghapusan menghapus preferensi.           | Penyimpanan pertama berisi `KONTEN_BAWAAN`, penyimpanan kedua mengubah baris yang sama, dan `DELETE` menghapus preferensi.                                                                                                                 | Pass       |
| INT-TC03     | INT-C    | Tambah FAQ lalu baca kembali                     | `POST /api/faq`, lalu `GET /api/faq`; coba ubah dan hapus dengan ID tidak dikenal.                                       | FAQ baru langsung tampil pada daftar; permintaan dengan ID tidak dikenal balas 404.                                                         | FAQ baru tersimpan pada D1 dan dibaca kembali dari tabel yang sama dengan `GET /api/faq`; ubah dan hapus dengan ID tak dikenal mengembalikan 404.                                                                                          | Pass       |
| INT-TC04     | INT-D    | Gabungkan kalender saat layanan Google gagal     | Panggil `GET /api/calendar?dari=...&sampai=...` dengan respons Google tersedia, lalu dengan respons gagal.               | Jadwal lokal digabung dengan _event_ Google; saat Google gagal, jadwal lokal tetap tampil disertai peringatan.                              | Jadwal lokal digabung dengan _event_ Google; saat Google gagal, slot lokal tetap tampil disertai peringatan.                                                                                                                               | Pass       |
| INT-TC05     | INT-E    | Kesehatan basis data dan pembacaan status        | Panggil `GET /health/db` dan `GET /api/status/:jenis` setelah satu siklus pemeriksaan.                                   | `GET /health/db` menjalankan SELECT berhasil; status `server` dan `db` dibaca dari baris terakhir di D1.                                    | `GET /health/db` menjalankan SELECT dan mengembalikan pemeriksaan `db` terakhir (null bila belum ada); `GET /api/status/:jenis` membaca baris terakhir per jenis.                                                                          | Pass       |
| INT-TC06     | INT-F    | Pemesanan bersamaan pada satu slot               | Kirim dua permintaan `POST /api/slots/:id/book` secara bersamaan untuk slot yang sama.                                   | Tepat satu permintaan berhasil; slot menjadi terpesan dan permintaan kedua ditolak.                                                         | Dari dua pemesanan bersamaan, tepat satu berhasil dan slot menjadi terpesan; permintaan lain ditolak 409.                                                                                                                                  | Pass       |
| INT-TC07     | INT-G    | Alur kode otorisasi Google                       | Panggil `/api/auth/google/mulai`, tirakan `/callback`, lalu `POST /api/auth/google`; coba pula _deep link_ tanpa _host_. | Kode diteruskan ke aplikasi dan ditukar di _server_; _deep link_ tanpa _host_ ditolak dengan status 400.                                    | `/mulai` mengalihkan ke Google dengan _deep link_ pada `state`, `/callback` meneruskan `code` ke aplikasi, dan `POST /api/auth/google` membuat sesi; _deep link_ tanpa _host_ ditolak 400.                                                 | Pass       |
| INT-TC08     | INT-H    | Bentrok jadwal Google                            | Buat `freeBusy` melaporkan sibuk, lalu pesan dengan dan tanpa `overrideGoogle`.                                          | Bentrok balas 409 `GOOGLE_CALENDAR_CONFLICT`; dengan `overrideGoogle` pemesanan tetap tersimpan tanpa mengubah kalender Google.             | Bentrok membalas 409; dengan `overrideGoogle` sesi Sehati tetap tersimpan.                                                                                                                                                                 | Pass       |
| INT-TC09     | INT-I    | Pendaftaran token perangkat                      | Daftarkan satu token pada dua sesi berurutan.                                                                            | Token tersimpan pada sesi aktif dan sesi lama tidak lagi digunakan untuk perangkat tersebut.                                                | Token tersimpan pada sesi aktif dan sesi lama pada perangkat yang sama diakhiri.                                                                                                                                                           | Pass       |
| INT-TC10     | INT-J    | Pengiriman notifikasi terjadwal                  | Jalankan penjadwal dengan affirmasi jatuh tempo, token ditolak `DeviceNotRegistered`, dan lebih dari 100 penerima.       | Notifikasi tercatat dengan judul "Afirmasi hari ini", dikirim per _batch_ maksimal 100, dan token yang ditolak dikosongkan.                 | Notifikasi tercatat, _push_ dikirim per _batch_ maksimal 100, dan token `DeviceNotRegistered` dikosongkan. Tes otomatis memeriksa penerima dan isi pesan; judul "Afirmasi hari ini" teramati pada notifikasi yang diterima iPhone (UC-01). | Pass       |
| INT-TC11     | INT-K    | Pemeriksaan status berkala dan sesuai permintaan | Jalankan tugas 5 menit, lalu `POST /api/status/refresh` sebelum dan setelah lewat 30 detik.                              | Probe menulis status `server` dan `db`; penyegaran memakai ulang hasil yang lebih muda dari 30 detik dan menjalankan probe baru setelahnya. | Tugas 5 menit mencatat status `server` dan `db`; refresh memakai ulang hasil yang lebih muda dari 30 detik dan menjalankan probe baru setelahnya.                                                                                          | Pass       |
| INT-TC12     | INT-L    | Tugas harian dan pembersihan data                | Jalankan tugas 1 menit dengan affirmasi/pengingat jatuh tempo, lalu tugas 12 jam dengan baris lama.                      | Notifikasi dikirim dan dicatat; baris lama pada `status_server`, `notifikasi`, dan sesi dibersihkan.                                        | Tugas 1 menit mengirim dan mencatat notifikasi afirmasi serta pengingat; tugas 12 jam menghapus baris lama dan menyisakan yang masih berlaku; _cron_ lain tidak menjalankan pembersihan.                                                   | Pass       |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut. Nomor urut test case mengikuti urutan skenario pada SKPL, sehingga `UC-XX-TC01` adalah skenario normal dan `UC-XX-TC02` dan seterusnya adalah skenario alternatif. Pengujian dilakukan pada perangkat fisik atau Expo Go dengan akun demo, dan hasil aktual diisi setelah pengujian manual.

### 4.4.1 UC-01 — Menyetel _Daily Affirmations_

Tabel 4.4.1. Hasil Pengujian UC-01

| ID Pengujian | ID KF        | Skenario                      | Prosedur/Masukan                                                       | Hasil yang Diharapkan                                                              | Hasil Pengujian  | Kesimpulan  |
| ------------ | ------------ | ----------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------- | ----------- |
| UC-01-TC01   | KF-01, KF-04 | Normal                        | Buka I-04, masukkan waktu misalnya 07.00, lalu tekan "Simpan Setelan". | Waktu tampil pada kolom, preferensi tersimpan, dan afirmasi dikirim sesuai jadwal. | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-01-TC02   | KF-01, KF-04 | Alternatif 1: gagal menyimpan | Ulangi pengaturan dengan permintaan gagal atau jaringan terputus.      | Preferensi tidak tersimpan dan pesan galat ditampilkan.                            | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.2 UC-02 — Menyetel Pengingat Kesehatan

Tabel 4.4.2. Hasil Pengujian UC-02

| ID Pengujian | ID KF        | Skenario                      | Prosedur/Masukan                                               | Hasil yang Diharapkan                                   | Hasil Pengujian  | Kesimpulan  |
| ------------ | ------------ | ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------- | ---------------- | ----------- |
| UC-02-TC01   | KF-03, KF-04 | Normal                        | Buka I-05, atur waktu makan, tidur, dan olahraga, lalu simpan. | Waktu tampil per jenis dan preferensi tersimpan.        | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-02-TC02   | KF-03, KF-04 | Alternatif 1: gagal menyimpan | Ulangi pengaturan dengan permintaan gagal.                     | Preferensi tidak tersimpan dan pesan galat ditampilkan. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.3 UC-03 — Melihat Kalender Terintegrasi

Tabel 4.4.3. Hasil Pengujian UC-03

| ID Pengujian | ID KF               | Skenario                              | Prosedur/Masukan                                          | Hasil yang Diharapkan                                                                                                                     | Hasil Pengujian  | Kesimpulan  |
| ------------ | ------------------- | ------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| UC-03-TC01   | KF-02, KF-05, KF-06 | Normal                                | Buka I-06 dari Beranda dan pilih tanggal.                 | Kalender menampilkan _event_ pengguna dan jadwal konsultasi dalam satu tampilan.                                                          | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-03-TC02   | KF-02, KF-05, KF-06 | Alternatif 1: gagal mengambil _event_ | Buat pengambilan kalender gagal, lalu tekan "Muat ulang". | Kalender tidak tampil atau kosong, pesan galat dan tombol retry muncul; retry gagal mengulang galat, retry berhasil menampilkan kalender. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.4 UC-04 — Memesan Sesi Konsultasi

Tabel 4.4.4. Hasil Pengujian UC-04

| ID Pengujian | ID KF               | Skenario                                | Prosedur/Masukan                                                          | Hasil yang Diharapkan                                                                            | Hasil Pengujian  | Kesimpulan  |
| ------------ | ------------------- | --------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------- | ----------- |
| UC-04-TC01   | KF-05, KF-06, KF-07 | Normal                                  | Pada I-07 pilih konsultan, pada I-08 pilih slot, lalu tekan "Konfirmasi". | Kalender gabungan tampil, rincian slot dan tombol Konfirmasi muncul, pemesanan tersimpan.        | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-04-TC02   | KF-05, KF-06        | Alternatif 1: gagal memuat jadwal       | Buat pengambilan jadwal gagal, lalu tekan "Muat ulang".                   | Jadwal tidak tampil, pesan galat dan tombol retry muncul; retry berhasil kembali ke alur normal. | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-04-TC03   | KF-07               | Alternatif 2: gagal menyimpan pemesanan | Tekan "Konfirmasi" saat penyimpanan gagal, lalu tekan lagi setelah pulih. | Pemesanan tidak tersimpan dan pesan galat muncul; penekanan kedua mencoba ulang penyimpanan.     | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.5 UC-05 — Mengelola Jadwal Konsultan

Tabel 4.4.5. Hasil Pengujian UC-05

| ID Pengujian | ID KF        | Skenario                                | Prosedur/Masukan                                                                    | Hasil yang Diharapkan                                                         | Hasil Pengujian  | Kesimpulan  |
| ------------ | ------------ | --------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------- | ----------- |
| UC-05-TC01   | KF-06, KF-07 | Normal                                  | Administrator membuka I-12, memilih tanggal dan jam, mengubah slot, lalu menyimpan. | Kalender jadwal tampil dan perubahan tersimpan.                               | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-05-TC02   | KF-06        | Alternatif 1: gagal memuat jadwal       | Buat pengambilan jadwal gagal, lalu tekan "Muat ulang".                             | Kalender kosong, pesan galat dan tombol retry muncul.                         | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-05-TC03   | KF-07        | Alternatif 2: gagal menyimpan perubahan | Simpan perubahan saat permintaan gagal, lalu ulangi setelah pulih.                  | Perubahan tidak tersimpan dan pesan galat muncul; penyimpanan ulang berhasil. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.6 UC-06 — Melihat FAQ

Tabel 4.4.6. Hasil Pengujian UC-06

| ID Pengujian | ID KF | Skenario                      | Prosedur/Masukan                               | Hasil yang Diharapkan                                                                               | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | ----------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| UC-06-TC01   | KF-08 | Normal                        | Masukkan kata kunci pada kolom pencarian I-09. | Pertanyaan dan jawaban yang cocok ditampilkan.                                                      | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-06-TC02   | KF-08 | Alternatif 1: tidak ada hasil | Cari kata kunci yang tidak ada pada FAQ.       | Tidak ada pertanyaan dan jawaban ditampilkan; pengguna ditawari mengajukan pertanyaan melalui I-10. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.7 UC-07 — Mengelola FAQ

Tabel 4.4.7. Hasil Pengujian UC-07

| ID Pengujian | ID KF | Skenario                               | Prosedur/Masukan                                                              | Hasil yang Diharapkan                                                   | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | -------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------- | ----------- |
| UC-07-TC01   | KF-08 | Normal                                 | Administrator menambah, mengubah, dan menghapus FAQ melalui I-13 dan I-13-05. | Penambahan dan perubahan tersimpan; FAQ yang dihapus tidak lagi tampil. | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-07-TC02   | KF-08 | Alternatif 1: operasi basis data gagal | Ulangi ketiga operasi dengan permintaan gagal.                                | Tidak ada FAQ yang ditambah, diubah, atau dihapus.                      | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.8 UC-08 — Memberikan Umpan Balik

Tabel 4.4.8. Hasil Pengujian UC-08

| ID Pengujian | ID KF | Skenario                      | Prosedur/Masukan                             | Hasil yang Diharapkan                           | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | ----------------------------- | -------------------------------------------- | ----------------------------------------------- | ---------------- | ----------- |
| UC-08-TC01   | KF-09 | Normal                        | Mahasiswa mengirim umpan balik melalui I-11. | Umpan balik diterima dan tersimpan.             | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-08-TC02   | KF-09 | Alternatif 1: gagal menyimpan | Kirim umpan balik saat permintaan gagal.     | Umpan balik tidak diterima dan tidak tersimpan. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.9 UC-09 — Menanggapi Umpan Balik

Tabel 4.4.9. Hasil Pengujian UC-09

| ID Pengujian | ID KF | Skenario                           | Prosedur/Masukan                                                           | Hasil yang Diharapkan                                              | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | ---------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------- | ----------- |
| UC-09-TC01   | KF-11 | Normal                             | Administrator membalas umpan balik pada I-14, lalu Mahasiswa membuka I-11. | Jawaban Administrator tampil pada tampilan Mahasiswa.              | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-09-TC02   | KF-11 | Alternatif 1: jawaban tidak tampil | Simulasikan respons yang tidak dapat ditampilkan.                          | Tidak ada konten jawaban yang ditampilkan pada tampilan Mahasiswa. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.10 UC-10 — Memantau Status _Server_

Tabel 4.4.10. Hasil Pengujian UC-10

| ID Pengujian | ID KF | Skenario         | Prosedur/Masukan                                                                               | Hasil yang Diharapkan                                                                                                                                                     | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | ---------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| UC-10-TC01   | KF-10 | Normal (tunggal) | Administrator membuka I-15, membaca status `server` lalu `db`, dan menekan "Periksa Sekarang". | Dua status ditampilkan terpisah dengan `server` lebih dulu; keduanya berasal dari probe `/health` dan `/health/db`. Hasil probe ini juga menjadi bahan pengukuran KNF-01. | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.11 UC-11 — Masuk Melalui Akun Google

Tabel 4.4.11. Hasil Pengujian UC-11

| ID Pengujian | ID KF | Skenario                  | Prosedur/Masukan                                                | Hasil yang Diharapkan                           | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | ------------------------- | --------------------------------------------------------------- | ----------------------------------------------- | ---------------- | ----------- |
| UC-11-TC01   | KF-12 | Normal                    | Tekan tombol masuk Google pada I-01 dan selesaikan autentikasi. | Login berhasil dan beranda sesuai peran tampil. | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-11-TC02   | KF-12 | Alternatif 1: OAuth gagal | Batalkan atau buat autentikasi Google gagal.                    | Pengguna tidak masuk dan kembali ke I-01.       | _[Hasil aktual]_ | _Pass/Fail_ |

### 4.4.12 UC-12 — Form Pengajuan Pertanyaan

Tabel 4.4.12. Hasil Pengujian UC-12

| ID Pengujian | ID KF | Skenario                      | Prosedur/Masukan                        | Hasil yang Diharapkan                                                                             | Hasil Pengujian  | Kesimpulan  |
| ------------ | ----- | ----------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| UC-12-TC01   | KF-13 | Normal                        | Kirim pertanyaan melalui I-10.          | Konfirmasi tersimpan ditampilkan dan pertanyaan muncul pada layar Pertanyaan Masuk Administrator. | _[Hasil aktual]_ | _Pass/Fail_ |
| UC-12-TC02   | KF-13 | Alternatif 1: gagal menyimpan | Kirim pertanyaan saat permintaan gagal. | Pertanyaan tidak tersimpan dan pengguna diberitahu.                                               | _[Hasil aktual]_ | _Pass/Fail_ |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji dengan target yang dapat diamati. KNF-01 memiliki angka minimum yang dinyatakan eksplisit pada SKPL, yaitu _uptime_ 90%. Untuk KNF-02 sampai KNF-04, SKPL mendefinisikan parameter secara kualitatif; target pada tabel berikut adalah penjabaran terukur dari parameter tersebut dan tidak menambah kebutuhan baru. Hasil aktual berupa angka atau data hasil pengukuran diisi setelah pengujian.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter      | Target Terukur                                                                                                                                                             | Metode dan Alat                                                                                                                                   | Hasil Aktual     | Kesimpulan  |
| ------------ | ------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------- |
| KNF-01-TC01  | KNF-01 | _Availability_ | _Uptime_ minimum 90% dalam jendela pengukuran yang ditentukan.                                                                                                             | Rasio probe berhasil (status 2xx) terhadap seluruh probe pada `/health` dan `/health/db`; catatan pemeriksaan dapat dibaca lewat UC-10 dan Q-044. | _[Hasil aktual]_ | _Pass/Fail_ |
| KNF-02-TC01  | KNF-02 | _Security_     | 0 permintaan tanpa autentikasi atau dengan peran yang tidak sesuai dapat diakses.                                                                                          | Kirim permintaan tanpa token dan dengan peran yang salah ke rute terlindungi; amati kode status dan pesan galat.                                  | _[Hasil aktual]_ | _Pass/Fail_ |
| KNF-02-TC02  | KNF-02 | _Security_     | 100% token Google tersimpan sebagai _ciphertext_ AES-256-GCM, bukan teks biasa.                                                                                            | Inspeksi kolom `token_google` pada basis data D1 dan kode enkripsi di `src/backend/src/lib/crypto.ts`.                                            | _[Hasil aktual]_ | _Pass/Fail_ |
| KNF-02-TC03  | KNF-02 | _Security_     | Tidak ada kredensial rahasia yang tertanam pada aplikasi _client_.                                                                                                         | Periksa `src/mobile/.env.example`, `app.config.ts`, dan hasil _build_ APK untuk nilai rahasia.                                                    | _[Hasil aktual]_ | _Pass/Fail_ |
| KNF-03-TC01  | KNF-03 | _Ergonomy_     | Pengguna dapat menyelesaikan tugas UC-01, UC-02, UC-03, UC-04, UC-06, UC-08, dan UC-12 tanpa bantuan; sebagai ukuran tambahan, tingkat keberhasilan ≥80% dan skor SUS ≥68. | Uji tugas terarah pada perangkat fisik atau Expo Go dengan pengguna perwakilan, dilanjutkan kuesioner SUS.                                        | _[Hasil aktual]_ | _Pass/Fail_ |
| KNF-04-TC01  | KNF-04 | _Reliability_  | 100% umpan balik yang dikirim tersimpan dan tampil untuk Administrator, dan 100% tanggapan Administrator tampil kembali pada Mahasiswa; 0 data hilang.                     | Jalankan UC-08 lalu UC-09 secara berurutan dan cocokkan baris `umpanBalik` di basis data dengan tampilan I-11 dan I-14.                           | _[Hasil aktual]_ | _Pass/Fail_ |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa keluaran _test runner_, tangkapan layar aplikasi, atau hasil alat ukur. Berkas bukti ditempatkan pada folder `docs/M10/assets/` dan dirujuk kembali pada tabel ini; tangkapan layar pengujian _use case_ berada pada `docs/M10/assets/Iphone-Tests/`. Karena proyek tidak memasang penyedia _coverage_ Vitest, bukti cakupan untuk kelas Mendalam berupa ringkasan operasi dan algoritma pada tabel `4.2.xb` beserta keluaran _test runner_, bukan laporan persentase baris kode.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| ------------ | --------------------- |
| `C-XX-UTYY` pada Subbab 4.2 | _[Sisipkan keluaran `bun run test` untuk `src/backend/` dan `src/mobile/` yang menunjukkan nama kasus uji per kelas]_ |
| Ringkasan cakupan pada tabel `4.2.xb` | _[Sisipkan daftar operasi public dan algoritma yang tercakup untuk setiap kelas Mendalam]_ |
| INT-TC01 s.d. INT-TC12 | _[Sisipkan keluaran pengujian integrasi pada `src/backend/test/` dan `src/backend/src/index.test.ts`]_ |
| UC-01-TC01 | <img src="./assets/Iphone-Tests/IMG_1833.PNG" alt="UC-01-TC01" width="140"> |
| UC-01-TC02 | <img src="./assets/Iphone-Tests/IMG_1834.PNG" alt="UC-01-TC02" width="140"> |
| UC-02-TC01 | <img src="./assets/Iphone-Tests/IMG_1835.PNG" alt="UC-02-TC01" width="140"> |
| UC-02-TC02 | <img src="./assets/Iphone-Tests/IMG_1836.PNG" alt="UC-02-TC02" width="140"> |
| UC-03-TC01 | <img src="./assets/Iphone-Tests/IMG_1837.PNG" alt="UC-03-TC01" width="140"> |
| UC-03-TC02 | <img src="./assets/Iphone-Tests/IMG_1838.PNG" alt="UC-03-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1839.PNG" alt="UC-03-TC02" width="140"> |
| UC-04-TC01 | _[Belum ada tangkapan layar]_ |
| UC-04-TC02 | <img src="./assets/Iphone-Tests/IMG_1840.PNG" alt="UC-04-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1841.PNG" alt="UC-04-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1842.PNG" alt="UC-04-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1843.PNG" alt="UC-04-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1844.PNG" alt="UC-04-TC02" width="140"> |
| UC-04-TC03 | _[Belum ada tangkapan layar]_ |
| UC-05-TC01 | <img src="./assets/Iphone-Tests/IMG_1856.PNG" alt="UC-05-TC01" width="140"> <img src="./assets/Iphone-Tests/IMG_1857.PNG" alt="UC-05-TC01" width="140"> |
| UC-05-TC02 | _[Belum ada tangkapan layar]_ |
| UC-05-TC03 | <img src="./assets/Iphone-Tests/IMG_1858.PNG" alt="UC-05-TC03" width="140"> |
| UC-06-TC01 | <img src="./assets/Iphone-Tests/IMG_1845.PNG" alt="UC-06-TC01" width="140"> |
| UC-06-TC02 | <img src="./assets/Iphone-Tests/IMG_1846.PNG" alt="UC-06-TC02" width="140"> |
| UC-07-TC01 | <img src="./assets/Iphone-Tests/IMG_1861.PNG" alt="UC-07-TC01" width="140"> <img src="./assets/Iphone-Tests/IMG_1863.PNG" alt="UC-07-TC01" width="140"> |
| UC-07-TC02 | <img src="./assets/Iphone-Tests/IMG_1859.PNG" alt="UC-07-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1860.PNG" alt="UC-07-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1862.PNG" alt="UC-07-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1864.PNG" alt="UC-07-TC02" width="140"> |
| UC-08-TC01 | <img src="./assets/Iphone-Tests/IMG_1849.PNG" alt="UC-08-TC01" width="140"> |
| UC-08-TC02 | <img src="./assets/Iphone-Tests/IMG_1850.PNG" alt="UC-08-TC02" width="140"> |
| UC-09-TC01 | <img src="./assets/Iphone-Tests/IMG_1852.PNG" alt="UC-09-TC01" width="140"> <img src="./assets/Iphone-Tests/IMG_1854.PNG" alt="UC-09-TC01" width="140"> |
| UC-09-TC02 | <img src="./assets/Iphone-Tests/IMG_1855.PNG" alt="UC-09-TC02" width="140"> |
| UC-10-TC01 | <img src="./assets/Iphone-Tests/IMG_1865.PNG" alt="UC-10-TC01" width="140"> |
| UC-11-TC01 | _[Belum ada tangkapan layar]_ |
| UC-11-TC02 | _[Belum ada tangkapan layar]_ |
| UC-12-TC01 | _[Belum ada tangkapan layar]_ |
| UC-12-TC02 | <img src="./assets/Iphone-Tests/IMG_1847.PNG" alt="UC-12-TC02" width="140"> <img src="./assets/Iphone-Tests/IMG_1848.PNG" alt="UC-12-TC02" width="140"> |
| KNF-04-TC01 | <img src="./assets/Iphone-Tests/IMG_1849.PNG" alt="KNF-04-TC01" width="140"> <img src="./assets/Iphone-Tests/IMG_1852.PNG" alt="KNF-04-TC01" width="140"> <img src="./assets/Iphone-Tests/IMG_1854.PNG" alt="KNF-04-TC01" width="140"> |
| KNF-01-TC01 s.d. KNF-03-TC01 | _[Sisipkan bukti pengukuran *uptime*, inspeksi keamanan, dan kuesioner SUS]_ |
| Seluruh bukti | Tangkapan layar UC dan KNF-04 diambil pada iPhone dan disimpan di `docs/M10/assets/Iphone-Tests/`. _[Tautkan berkas bukti lain yang digunakan pada tabel ini]_ |

<br>

---

# BAB 5: Traceability

Tabel 5.1 memetakan setiap KF ke KNF, _use case_, kelas perancangan, berkas implementasi, dan _test case_, sehingga menjadi sarana verifikasi KF. Daftar KF, KNF, dan pemetaan KF ke _use case_ mengikuti SKPL versi terbaru, pemetaan kelas ke _use case_ mengikuti BAB 7 DPPL, dan berkas implementasi mengikuti Tabel B.5 dokumen Implementasi (Tugas 9) sebagaimana berlaku pada _tag release_ `v10.0`, yang dibuat setelah dokumen dan pengujiannya final. Setiap KF memiliki minimal satu _test case_ dan dinyatakan terpenuhi apabila **seluruh** _test case_ terkaitnya berkesimpulan `Pass`. Seluruh KF telah diimplementasikan.

Setiap skenario _use case_ pada SKPL (skenario normal dan setiap skenario alternatif) diuji oleh satu _test case_ _use case_, dengan nomor urut mengikuti urutan skenario. Pada kolom _Test Case_ (Unit/Integrasi/KNF), `C-XX-UT01 dst.` merujuk seluruh _test case_ unit kelas C-XX pada Subbab 4.2, dan `INT-TC` merujuk _test case_ integrasi pada Subbab 4.3 untuk rute yang disebutkan.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait    | Use Case ID             | Kelas Terkait                                                                                                                                                                                     | Implementasi File Terkait                                                                                                                                                                                                                                                                                                                                                                                   | Test Case (UC)                                                                                     | Test Case (Unit/Integrasi/KNF)                                                                                                                                                          |
| ----- | -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KF-01 | KNF-03         | UC-01                   | C-05 - `DailyAffirmation`<br>C-07 - `Notifikasi`<br>C-17 - `AffirmationView`<br>C-26 - `AffirmationController`<br>C-33 - `Validasi`                                                               | `src/backend/src/routes/affirmation.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/jobs/scheduler.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/afirmasi.tsx`<br>`src/mobile/src/api/afirmasi.ts`                                                                                                                                                                 | UC-01-TC01, UC-01-TC02                                                                             | C-05-UT01 dst., C-07-UT01 dst., C-26-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/affirmation`)<br>KNF-03-TC01                                                                       |
| KF-02 | KNF-03         | UC-03                   | C-08 - `GoogleCalendarService`<br>C-09 - `KalenderGabungan`<br>C-19 - `CalendarView`<br>C-28 - `CalendarController`                                                                               | `src/backend/src/lib/google.ts`<br>`src/backend/src/lib/kalender.ts`<br>`src/backend/src/routes/consultation.ts`<br>`src/mobile/src/app/(mahasiswa)/kalender.tsx`<br>`src/mobile/src/api/kalender.ts`<br>`src/mobile/src/lib/kalender.ts`                                                                                                                                                                   | UC-03-TC01, UC-03-TC02                                                                             | C-08-UT01 dst., C-09-UT01 dst., C-19-UT01 dst., C-28-UT01 dst.<br>INT-TC (rute `/api/calendar`)<br>KNF-03-TC01                                                                          |
| KF-03 | KNF-03         | UC-02                   | C-06 - `Reminder`<br>C-07 - `Notifikasi`<br>C-18 - `ReminderView`<br>C-27 - `ReminderController`<br>C-33 - `Validasi`                                                                             | `src/backend/src/routes/affirmation.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/jobs/scheduler.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/pengingat.tsx`<br>`src/mobile/src/api/pengingat.ts`                                                                                                                                                               | UC-02-TC01, UC-02-TC02                                                                             | C-06-UT01 dst., C-07-UT01 dst., C-27-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/reminders`)<br>KNF-03-TC01                                                                         |
| KF-04 | KNF-01         | UC-01<br>UC-02          | C-04 - `SesiAutentikasi`<br>C-07 - `Notifikasi`<br>C-25 - `AuthController`                                                                                                                        | `src/backend/src/jobs/scheduler.ts`<br>`src/backend/src/routes/auth.ts`<br>`src/mobile/src/lib/notifikasi.ts`<br>`src/mobile/src/api/perangkat.ts`<br>`src/mobile/src/app/_layout.tsx`                                                                                                                                                                                                                      | UC-01-TC01<br>UC-02-TC01                                                                           | C-04-UT01 dst., C-07-UT01 dst., C-25-UT01 dst.<br>INT-TC (rute `/api/auth/device`, tugas _cron_ notifikasi)<br>KNF-01-TC01                                                              |
| KF-05 | KNF-03         | UC-03<br>UC-04          | C-09 - `KalenderGabungan`<br>C-11 - `JadwalKonsultasi`<br>C-19 - `CalendarView`<br>C-28 - `CalendarController`                                                                                    | `src/backend/src/lib/kalender.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/routes/consultation.ts`<br>`src/mobile/src/app/(mahasiswa)/kalender.tsx`<br>`src/mobile/src/lib/kalender.ts`                                                                                                                                                                                                       | UC-03-TC01, UC-03-TC02<br>UC-04-TC01, UC-04-TC02, UC-04-TC03                                       | C-09-UT01 dst., C-11-UT01 dst., C-19-UT01 dst., C-28-UT01 dst.<br>INT-TC (rute `/api/calendar`)<br>KNF-03-TC01                                                                          |
| KF-06 | -              | UC-03<br>UC-04<br>UC-05 | C-10 - `Konsultan`<br>C-11 - `JadwalKonsultasi`<br>C-20 - `ConsultationBookingView`<br>C-21 - `ConsultationManagementView`<br>C-29 - `ConsultationController`                                     | `src/backend/src/routes/consultation.ts`<br>`src/backend/src/db/queries.ts`<br>`src/mobile/src/app/(mahasiswa)/konsultasi.tsx`<br>`src/mobile/src/app/(mahasiswa)/sesi.tsx`<br>`src/mobile/src/app/admin/jadwal.tsx`<br>`src/mobile/src/api/konsultasi.ts`<br>`src/mobile/src/lib/jadwal.ts`                                                                                                                | UC-03-TC01, UC-03-TC02<br>UC-04-TC01, UC-04-TC02, UC-04-TC03<br>UC-05-TC01, UC-05-TC02, UC-05-TC03 | C-11-UT01 dst., C-21-UT01 dst., C-29-UT01 dst.<br>INT-TC (rute `/api/consultants`, `/api/sessions`)                                                                                     |
| KF-07 | KNF-04         | UC-04<br>UC-05          | C-08 - `GoogleCalendarService`<br>C-11 - `JadwalKonsultasi`<br>C-20 - `ConsultationBookingView`<br>C-21 - `ConsultationManagementView`<br>C-29 - `ConsultationController`<br>C-33 - `Validasi`    | `src/backend/src/routes/consultation.ts`<br>`src/backend/src/lib/jadwal-konsultasi.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/backend/src/lib/google.ts`<br>`src/mobile/src/app/(mahasiswa)/sesi.tsx`<br>`src/mobile/src/app/admin/jadwal.tsx`<br>`src/mobile/src/lib/jadwal.ts`                                                                                                                      | UC-04-TC01, UC-04-TC02, UC-04-TC03<br>UC-05-TC01, UC-05-TC02, UC-05-TC03                           | C-08-UT01 dst., C-11-UT01 dst., C-21-UT01 dst., C-29-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/slots`, `/api/sessions`)<br>KNF-04-TC01                                            |
| KF-08 | KNF-03         | UC-06<br>UC-07          | C-12 - `FAQ`<br>C-22 - `FAQView`<br>C-30 - `FAQController`<br>C-33 - `Validasi`                                                                                                                   | `src/backend/src/routes/faq.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/faq.tsx`<br>`src/mobile/src/app/admin/faq.tsx`<br>`src/mobile/src/app/admin/faq-form.tsx`<br>`src/mobile/src/api/faq.ts`                                                                                                                                         | UC-06-TC01, UC-06-TC02<br>UC-07-TC01, UC-07-TC02                                                   | C-12-UT01 dst., C-30-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/faq`)<br>KNF-03-TC01                                                                                               |
| KF-09 | KNF-03, KNF-04 | UC-08                   | C-14 - `UmpanBalik`<br>C-23 - `FeedbackView`<br>C-31 - `FeedbackController`<br>C-33 - `Validasi`                                                                                                  | `src/backend/src/routes/feedback.ts`<br>`src/backend/src/db/queries.ts`<br>`src/mobile/src/app/(mahasiswa)/umpan-balik.tsx`<br>`src/mobile/src/api/umpan-balik.ts`                                                                                                                                                                                                                                          | UC-08-TC01, UC-08-TC02                                                                             | C-14-UT01 dst., C-31-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/feedback`)<br>KNF-03-TC01, KNF-04-TC01                                                                             |
| KF-10 | KNF-01         | UC-10                   | C-15 - `StatusServer`<br>C-24 - `ServerStatusView`<br>C-32 - `ServerStatusController`                                                                                                             | `src/backend/src/routes/status.ts`<br>`src/backend/src/lib/status-probe.ts`<br>`src/backend/src/jobs/scheduler.ts`<br>`src/mobile/src/app/admin/status.tsx`<br>`src/mobile/src/lib/status.ts`<br>`src/mobile/src/api/status.ts`                                                                                                                                                                             | UC-10-TC01                                                                                         | C-24-UT01 dst., C-32-UT01 dst.<br>INT-TC (rute `/api/status/:jenis`, `/api/status/refresh`, `/api/status/history`, tugas _cron_ status)<br>KNF-01-TC01                                  |
| KF-11 | KNF-04         | UC-09                   | C-14 - `UmpanBalik`<br>C-23 - `FeedbackView`<br>C-31 - `FeedbackController`<br>C-33 - `Validasi`                                                                                                  | `src/backend/src/routes/feedback.ts`<br>`src/backend/src/db/queries.ts`<br>`src/mobile/src/app/admin/umpan-balik.tsx`<br>`src/mobile/src/api/umpan-balik.ts`                                                                                                                                                                                                                                                | UC-09-TC01, UC-09-TC02                                                                             | C-14-UT01 dst., C-31-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/feedback/:id/response`)<br>KNF-04-TC01                                                                             |
| KF-12 | KNF-02         | UC-11                   | C-01 - `Pengguna`<br>C-02 - `Mahasiswa`<br>C-03 - `Administrator`<br>C-04 - `SesiAutentikasi`<br>C-16 - `LoginView`<br>C-25 - `AuthController`<br>C-34 - `GoogleAuthService`<br>C-36 - `HomeView` | `src/backend/src/routes/auth.ts`<br>`src/backend/src/middleware/auth.ts`<br>`src/backend/src/lib/google.ts`<br>`src/backend/src/lib/crypto.ts`<br>`src/backend/src/db/schema.ts`<br>`src/mobile/src/app/index.tsx`<br>`src/mobile/src/api/auth.ts`<br>`src/mobile/src/api/sesi.ts`<br>`src/mobile/src/lib/sesi.tsx`<br>`src/mobile/src/app/(mahasiswa)/beranda.tsx`<br>`src/mobile/src/app/admin/index.tsx` | UC-11-TC01, UC-11-TC02                                                                             | C-04-UT01 dst., C-16-UT01 dst., C-25-UT01 dst., C-34-UT01 dst.<br>INT-TC (rute `/api/auth/google/mulai`, `/api/auth/google`, `/api/auth/demo`)<br>KNF-02-TC01, KNF-02-TC02, KNF-02-TC03 |
| KF-13 | KNF-03         | UC-12                   | C-13 - `PengajuanPertanyaan`<br>C-22 - `FAQView`<br>C-30 - `FAQController`<br>C-33 - `Validasi`                                                                                                   | `src/backend/src/routes/questions.ts`<br>`src/backend/src/db/queries.ts`<br>`src/backend/src/lib/validasi.ts`<br>`src/mobile/src/app/(mahasiswa)/pertanyaan.tsx`<br>`src/mobile/src/app/admin/pertanyaan.tsx`<br>`src/mobile/src/api/faq.ts`                                                                                                                                                                | UC-12-TC01, UC-12-TC02                                                                             | C-30-UT01 dst., C-33-UT01 dst.<br>INT-TC (rute `/api/questions`)<br>KNF-03-TC01                                                                                                         |

Kelas C-35 `CloudflareD1Database` tidak dicantumkan per KF karena dipakai oleh seluruh KF yang menyimpan data. Kelas ini diwujudkan oleh _binding_ D1 pada `src/backend/wrangler.jsonc` dan _middleware_ Drizzle pada `src/backend/src/index.ts`, serta teruji secara tidak langsung melalui seluruh _test case_ integrasi.

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter      | KF/UC Terkait                                                                                     | Test Case                             |
| ------ | -------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------- |
| KNF-01 | _Availability_ | KF-04, KF-10 / UC-01, UC-02, UC-10                                                                | KNF-01-TC01                           |
| KNF-02 | _Security_     | KF-12 / UC-11                                                                                     | KNF-02-TC01, KNF-02-TC02, KNF-02-TC03 |
| KNF-03 | _Ergonomy_     | KF-01, KF-02, KF-03, KF-05, KF-08, KF-09, KF-13 / UC-01, UC-02, UC-03, UC-04, UC-06, UC-08, UC-12 | KNF-03-TC01                           |
| KNF-04 | _Reliability_  | KF-07, KF-09, KF-11 / UC-04, UC-05, UC-08, UC-09                                                  | KNF-04-TC01                           |
