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

| Revisi | Deskripsi                                                                                                                               |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| _A_    | _Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel._ |
| _B_    |                                                                                                                                         |
| _C_    |                                                                                                                                         |
| ...    |                                                                                                                                         |

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

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (_executable files_, _configuration files_, _data files_, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan _hardware_ dan _software_ yang digunakan untuk implementasi, mencakup _operating system_, bahasa pemrograman beserta versinya, _framework_/_library_, DBMS, _development tools_, dan _version control_. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga _framework_ dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek                | Keterangan                                                 |
| -------------------- | ---------------------------------------------------------- |
| _Hardware_           | _[Spesifikasi perangkat keras]_                            |
| _Operating System_   | _[Nama dan versi OS]_                                      |
| _Bahasa Pemrograman_ | _[Bahasa dan versi]_                                       |
| _Framework/Library_  | _[Daftar framework/library beserta versi]_                 |
| _DBMS_               | _[Nama dan versi DBMS]_                                    |
| _Development Tools_  | _[IDE, version control, tools lain]_                       |
| _Testing Tools_      | _[Framework unit test, alat ukur performa, alat coverage]_ |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No  | ID Kelas | Nama Modul/Kelas     | Nama File Fisik  | Nama File Executable                            |
| --- | -------- | -------------------- | ---------------- | ----------------------------------------------- |
| 1   | _[C01]_  | _[Nama modul/kelas]_ | _[path/ke/file]_ | _[Nama file executable, atau - jika tidak ada]_ |
| 2   | _[C02]_  | _[Nama modul/kelas]_ | _[path/ke/file]_ | _[...]_                                         |
| ... | _..._    | _..._                | _..._            | _..._                                           |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No  | ID Antarmuka | Nama Antarmuka | Nama File Fisik  | Nama File Executable                            |
| --- | ------------ | -------------- | ---------------- | ----------------------------------------------- |
| 1   | _[I-01]_     | _[Nama layar]_ | _[path/ke/file]_ | _[Nama file executable, atau - jika tidak ada]_ |
| 2   | _[I-02]_     | _[Nama layar]_ | _[path/ke/file]_ | _[...]_                                         |
| ... | _..._        | _..._          | _..._            | _..._                                           |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file _utility_, _configuration_, _database schema/seed_, _file test_, atau _data_.

Tabel 3.4. File Lain

| No  | Nama File     | Keterangan      |
| --- | ------------- | --------------- |
| 1   | _[Nama file]_ | _[Fungsi file]_ |
| ... | _..._         | _..._           |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti _entity/DTO_ dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas     | Tingkat                         | Alasan                                                  | Test Case Terkait                  |
| -------- | -------------- | ------------------------------- | ------------------------------------------------------- | ---------------------------------- |
| _C02_    | _Pesanan_      | _Mendalam_                      | _Memuat `hitungTotal()` dan transisi status pembayaran_ | _C02-UT01 s.d. C02-UT08_           |
| _C03_    | _Keranjang_    | _Sedang_                        | _Delegasi sederhana ke Produk dan Pesanan_              | _C03-UT01 s.d. C03-UT03, INT-TC02_ |
| _C01_    | _Pelanggan_    | _Tidak perlu_                   | _Hanya menyimpan data akun, tanpa logika_               | _-_                                |
| _[CXX]_  | _[Nama kelas]_ | _[Mendalam/Sedang/Tidak perlu]_ | _[Alasan penentuan tingkat pengujian]_                  | _[ID test case atau -]_            |
| _..._    | _..._          | _..._                           | _..._                                                   | _..._                              |

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

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID  | KNF Terkait      | Use Case ID     | Kelas Terkait                              | Implementasi File Terkait            | Test Case (UC)                      | Test Case (Unit/Integrasi/KNF)            |
| ------ | ---------------- | --------------- | ------------------------------------------ | ------------------------------------ | ----------------------------------- | ----------------------------------------- |
| _KF05_ | _KNF01_          | _UC03_          | _C02 - Pesanan_                            | _`src/...`_                          | _UC03-TC01_                         | _C02-UT05, INT-TC04, KNF01-TC01_          |
| _KF01_ | _-_              | _UC01<br>UC02_  | _[C01 - Nama kelas]<br>[C02 - Nama kelas]_ | _[path/ke/file1]<br>[path/ke/file2]_ | _UC01-TC01, UC01-TC02<br>UC02-TC01_ | _-_                                       |
| _KF02_ | _[KNFXX atau -]_ | _[UCXX]_        | _[CXX - Nama kelas]_                       | _[path/ke/file]_                     | _[UCXX-TCYY]_                       | _[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]_ |
| _KFXX_ | _-_              | _[UCXX atau -]_ | _[CXX - Nama kelas atau -]_                | _Tidak diimplementasikan: [alasan]_  | _-_                                 | _-_                                       |
| _..._  | _..._            | _..._           | _..._                                      | _..._                                | _..._                               | _..._                                     |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF  | Parameter     | KF/UC Terkait          | Test Case      |
| ------- | ------------- | ---------------------- | -------------- |
| _KNF01_ | _Reliability_ | _KF05 / UC03_          | _KNF01-TC01_   |
| _KNFXX_ | _[Parameter]_ | _[KFXX / UCXX atau -]_ | _[KNFXX-TCYY]_ |
| _..._   | _..._         | _..._                  | _..._          |
