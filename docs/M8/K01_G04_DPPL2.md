<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 8
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
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

## Daftar Perubahan

| Revisi    | Deskripsi |
| --------- | --------- |
| REV-M8-01 | Menambahkan atribut `waktuSelesai` (DateTime) pada kelas `JadwalKonsultasi` (C-11) untuk menyimpan waktu selesai sesi konsultasi. Perubahan tampak pada diagram kelas UC-03, UC-04, dan UC-05 (BAB 3), diagram kelas keseluruhan dan Tabel 4.1 (BAB 4), serta atribut kelas pada BAB 5. |
| REV-M8-02 | Menambahkan atribut `idKonsultan` (String) pada kelas `Konsultan` (C-10) sebagai pengenal konsultan. Perubahan tampak pada diagram kelas UC-04 dan UC-05 (BAB 3), diagram kelas keseluruhan dan Tabel 4.1 (BAB 4), serta atribut kelas pada BAB 5. |
| REV-M8-03 | Menambahkan atribut `tokenPush` (String) dan operasi `daftarkanPerangkat(tokenPush: String): Boolean` pada kelas `SesiAutentikasi` (C-04), serta operasi `daftarkanPerangkat(tokenPush: String): void` pada kelas `LoginView` (C-16) dan `AuthController` (C-25), untuk pendaftaran perangkat notifikasi push. Kelas `CloudflareD1Database` (C-35) kini juga terlibat pada UC-11. Perubahan tampak pada sequence diagram dan diagram kelas UC-11 (BAB 3), diagram kelas keseluruhan dan Tabel 4.1 (BAB 4), atribut dan operasi kelas pada BAB 5, serta matriks kerunutan (BAB 7). |
| REV-M8-04 | Menambahkan komponen dan kelas `HomeView` (C-36) untuk layar Beranda yang dibuka setelah login sesuai peran pengguna. Perubahan tampak pada Tabel 2.2, Gambar 2.1, dan _Logical View_ (BAB 2), sequence diagram dan diagram kelas UC-11 (BAB 3), diagram kelas keseluruhan dan Tabel 4.1 (BAB 4), BAB 5, serta matriks kerunutan (BAB 7). Subbab skema basis data bergeser menjadi 5.37. |
| REV-M8-05 | Menambahkan operasi `ambilAfirmasiHariIni()` pada `AffirmationController` (C-26), `ambilSesiBerikutnya()` pada `ConsultationController` (C-29), `ambilAfirmasi()` pada `DailyAffirmation` (C-05), dan `ambilSesiBerikutnya()` pada `JadwalKonsultasi` (C-11), agar beranda dapat menampilkan afirmasi dan sesi konsultasi berikutnya. `HomeView` kini memanggil `AffirmationController`, `ConsultationController`, dan `ServerStatusController`. Perubahan tampak pada _Logical View_ (BAB 2), diagram kelas UC-01, UC-03, UC-04, dan UC-05 (BAB 3), diagram kelas keseluruhan dan Tabel 4.1 (BAB 4), BAB 5, serta BAB 6. |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini bertujuan menjabarkan rancangan perangkat lunak Sehati pada tahap desain sebagai lanjutan dari dokumen Spesifikasi Kebutuhan Perangkat Lunak (SKPL) dan Arsitektur Perangkat Lunak (APL). Dokumen ini menerjemahkan kebutuhan fungsional dan nonfungsional, _use case_, serta struktur kelas analisis pada SKPL menjadi rancangan arsitektur, komponen, kelas perancangan, dan realisasi _use case_ yang siap diimplementasikan.

Dokumen ini ditujukan kepada tim pengembang sebagai acuan implementasi, kepada asisten dan penguji sebagai bukti keterlacakan rancangan terhadap kebutuhan, serta kepada pemangku kepentingan yang perlu memahami bagaimana Sehati dirancang untuk memenuhi tujuannya.

## 1.2 Lingkup Masalah

Sehati adalah aplikasi _mobile_ (Android dan iOS) yang mempromosikan kesejahteraan mahasiswa, sejalan dengan SDG 3. Pengguna utama (Mahasiswa) masuk melalui akun Google, lalu dapat mengatur dan menerima _daily affirmations_, mengatur pengingat makan, tidur, dan olahraga, melihat kalender harian yang terintegrasi dengan Google Calendar, serta memesan sesi konsultasi. Administrator mengelola data konsultan dan jadwal ketersediaannya, FAQ, umpan balik pengguna, serta memantau status _server_. Dokumen ini membatasi pembahasannya pada perancangan perangkat lunak Sehati dan tidak mencakup implementasi kode, pengujian, maupun penyebaran.

## 1.3 Definisi, Istilah, dan Singkatan

Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan                                                                                                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P/L                              | Singkatan dari **Perangkat Lunak**, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.                                                                |
| SKPL                             | Singkatan dari **Spesifikasi Kebutuhan Perangkat Lunak**, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.                      |
| DPPL                             | Singkatan dari **Deskripsi Perancangan Perangkat Lunak**, yaitu dokumen yang menjabarkan rancangan arsitektur, komponen, dan kelas perancangan sebagai lanjutan SKPL dan APL.                |
| KF                               | Singkatan dari **Kebutuhan Fungsional**, yaitu kebutuhan yang menjelaskan apa yang harus dapat dilakukan oleh sistem.                                                                        |
| KNF                              | Singkatan dari **Kebutuhan Nonfungsional,** yaitu kebutuhan yang menjelaskan kualitas sistem, seperti ketersediaan, keamanan, dan kemudahan penggunaan.                                      |
| UC                               | Singkatan dari **_Use Case_**, yaitu gambaran interaksi antara aktor dan sistem untuk mencapai suatu tujuan.                                                                                 |
| UML                              | Singkatan dari **_Unified Modeling Language_**, yaitu bahasa pemodelan standar yang digunakan untuk membuat _use case diagram_ dan diagram kelas.                                            |
| SDG                              | Singkatan dari **_Sustainable Development Goals_** (Tujuan Pengembangan Berkelanjutan), yaitu 17 tujuan global yang dicanangkan PBB. SDG 3 berfokus pada kehidupan yang sehat dan sejahtera. |
| Sehati                           | **Nama perangkat lunak yang dikembangkan** untuk mendukung kesehatan mental dan kesejahteraan mahasiswa.                                                                                     |
| Mahasiswa                        | **Aktor pengguna utama** Sehati yang menggunakan pengingat, _daily affirmations_, jadwal, dan pemesanan sesi konsultasi.                                                                     |
| Administrator                    | **Aktor yang mengelola** Sehati, termasuk memasukkan jadwal konsultan, mengelola FAQ dan umpan balik, serta memantau status _server_.                                                        |
| Konsultan                        | Tenaga profesional yang menyediakan sesi konsultasi. Konsultan bukan aktor sistem; data dan jadwalnya dikelola oleh Administrator.                                                           |
| _Daily Affirmations_             | Pesan positif yang dikirimkan kepada pengguna pada waktu yang diatur pengguna untuk menjaga suasana hati dan kepercayaan diri.                                                               |
| Pengingat                        | Notifikasi dengan waktu yang diatur pengguna untuk makan, tidur, dan berolahraga.                                                                                                            |
| Notifikasi                       | Pesan yang ditampilkan sistem kepada pengguna, misalnya untuk _daily affirmations_ dan pengingat.                                                                                            |
| Google Calendar                  | Layanan kalender milik Google yang datanya diintegrasikan ke Sehati untuk menampilkan jadwal pengguna.                                                                                       |
| API                              | Singkatan dari **_Application Programming Interface_**, yaitu antarmuka yang memungkinkan satu perangkat lunak berkomunikasi dengan perangkat lunak lain, misalnya Google Calendar API.      |
| OAuth                            | Protokol otorisasi yang memungkinkan aplikasi mendapat akses terbatas ke akun pengguna di layanan lain (misalnya Google) tanpa mengetahui kata sandi pengguna.                               |
| Autentikasi                      | Proses memverifikasi identitas pengguna sebelum diberi akses ke aplikasi. Pada Sehati, autentikasi dilakukan melalui akun Google.                                                            |
| _Free/busy_                      | Informasi rentang waktu pengguna yang sibuk atau kosong pada kalender, tanpa rincian acaranya. Dipakai untuk mendeteksi bentrok jadwal.                                                      |
| Bentrok jadwal                   | Kondisi ketika waktu sesi konsultasi yang dipilih tumpang tindih dengan acara lain di kalender pengguna.                                                                                     |
| _Database_                       | Basis data tempat sistem menyimpan data seperti jadwal konsultasi, FAQ, dan umpan balik.                                                                                                     |
| _Server_                         | Komponen sistem yang menjalankan logika aplikasi dan melayani permintaan dari pengguna.                                                                                                      |
| _Uptime_                         | Persentase waktu sistem dapat diakses dan beroperasi dalam suatu periode.                                                                                                                    |
| FAQ                              | Singkatan dari **_Frequently Asked Questions_**, yaitu daftar pertanyaan yang sering diajukan beserta jawabannya.                                                                            |
| Umpan balik                      | Masukan dari pengguna terhadap aplikasi, yang dapat ditanggapi oleh Administrator.                                                                                                           |
| _Traceability_                   | Keterlacakan hubungan antara kelas, _use case_, dan kebutuhan fungsional.                                                                                                                    |
| Kelas Analisis                   | Kelas konseptual pada tahap analisis (SKPL) yang merepresentasikan entitas domain, misalnya `DailyAffirmation` dan `JadwalKonsultasi`.                                                       |
| Kelas Perancangan                | Kelas pada tahap desain yang merealisasikan kelas analisis, misalnya `AuthController` dan `ReminderView`, dan disusun lengkap pada BAB 4.                                                    |
| _Sequence Diagram_               | Diagram UML yang menggambarkan urutan pertukaran pesan antarobjek untuk merealisasikan satu skenario _use case_.                                                                             |
| MVC                              | Singkatan dari **_Model-View-Controller_**, yaitu pattern arsitektur yang memisahkan penyimpanan data (_model_), tampilan (_view_), dan pemrosesan permintaan (_controller_).                |

## 1.4 Aturan Penomoran

Dokumen ini memakai pola penomoran ID yang sama dengan dokumen SKPL dan APL, sehingga setiap rujukan kebutuhan, _use case_, dan kelas tetap konsisten antardokumen.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian               | Penomoran | Keterangan                                                                                                      |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------- |
| Kebutuhan                | R-XX      | Huruf R, tanda hubung, lalu nomor urut dua digit mulai dari 01 (contoh: R-01). Dipakai pada kolom ID Kebutuhan. |
| Kebutuhan Fungsional     | KF-XX     | Nomor urut dua digit mulai dari 01 (contoh: KF-01).                                                             |
| Kebutuhan Non-Fungsional | KNF-XX    | Nomor urut dua digit mulai dari 01 (contoh: KNF-01).                                                            |
| Aktivitas                | A-XX      | Nomor urut dua digit mulai dari 01 (contoh: A-01), sesuai dokumen _Requirement Gathering_.                      |
| _User Story_             | US-XX     | Nomor urut dua digit mulai dari 01 (contoh: US-01), sesuai dokumen _Requirement Gathering_.                     |
| _Use Case_               | UC-XX     | Nomor urut dua digit mulai dari 01 (contoh: UC-01).                                                             |
| Kelas                    | C-XX      | Nomor urut dua digit mulai dari 01 (contoh: C-01).                                                              |
| Aktor                    | Tidak ada | Aktor tidak diberi ID dan dirujuk dengan namanya (Mahasiswa, Administrator).                                    |

## 1.5 Referensi

Dokumen ini merujuk pada sumber-sumber berikut.

1. Kelompok G04 K01, dokumen _Spesifikasi Kebutuhan Perangkat Lunak (SKPL)_ untuk Sehati, IF2150 Rekayasa Perangkat Lunak.
2. Kelompok G04 K01, dokumen _Arsitektur Perangkat Lunak (APL)_ untuk Sehati, IF2150 Rekayasa Perangkat Lunak.
3. Google, _Google Calendar API Documentation_. https://developers.google.com/calendar
4. Google, _Google Identity: OAuth 2.0_. https://developers.google.com/identity/protocols/oauth2
5. Cloudflare, _Cloudflare Workers Documentation_. https://developers.cloudflare.com/workers/
6. Cloudflare, _Cloudflare D1 Documentation_. https://developers.cloudflare.com/d1/
7. Hono, _Hono Documentation_. https://hono.dev/
8. Expo, _React Native Documentation_. https://docs.expo.dev/
9. Alat pembuatan diagram UML: draw.io (https://www.drawio.com/) dan StarUML (https://staruml.io/).

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)

Dokumen ini disusun dalam tujuh bab. BAB 1 memuat pendahuluan yang mencakup tujuan, lingkup masalah, definisi istilah, aturan penomoran, referensi, dan ikhtisar dokumen. BAB 2 menjelaskan perancangan arsitektur, mulai dari lingkungan implementasi, _style/pattern_ yang menjadi acuan, identifikasi komponen, hingga _logical view_ sistem. BAB 3 menjabarkan realisasi setiap _use case_ melalui identifikasi kelas perancangan, _sequence diagram_ untuk setiap skenario, dan diagram kelas per _use case_. BAB 4 menyajikan diagram kelas perancangan keseluruhan beserta daftar atribut dan operasi seluruh kelas. BAB 5 merinci setiap kelas perancangan, yaitu operasi dan atributnya beserta _visibility_ dan tipe. BAB 6 memuat perancangan antarmuka berupa rancangan layar beserta spesifikasi objeknya. BAB 7 menutup dokumen dengan matriks kerunutan yang memetakan setiap kelas perancangan terhadap _use case_ yang direalisasikannya.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Sehati dirancang untuk berjalan pada lingkungan _cloud_ tanpa _server_ tradisional. Rancangan lingkungan implementasi, mulai dari _platform_, bahasa pemrograman, hingga alat pengembangan, dirangkum pada Tabel 2.1.

Tabel 2.1. Rancangan Lingkungan Implementasi

| Komponen            | Spesifikasi                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| _Server_            | Cloudflare Workers (runtime V8 isolates) menjalankan Hono sebagai REST API                               |
| _Client_            | Aplikasi _mobile_ React Native (Expo), Android, dan iOS                                                  |
| DBMS                | Cloudflare D1 (SQLite terdistribusi di _edge_)                                                           |
| OS                  | Android 10+ dan iOS 15+ pada _client_; Cloudflare Workers tidak memerlukan OS tradisional di sisi server |
| Integrasi Eksternal | Google OAuth 2.0 (otentikasi) dan Google Calendar API (_event_, _free/busy_)                             |
| Bahasa Pemrograman  | TypeScript untuk _server_ (Hono) dan _client_ (React Native/Expo)                                        |
| Alat Pengembangan   | Git dan GitHub, Wrangler (Cloudflare Workers), Expo CLI, draw.io                                         |
| Penyimpanan Berkas  | Cloudflare D1 untuk data terstruktur; penyimpanan lokal perangkat untuk konfigurasi _client_             |

## 2.2 Style/Pattern Arsitektur Acuan

Sehati memakai gabungan pattern **_Client-Server_** dan **_Model-View-Controller (MVC)_**. Pattern _client-server_ menentukan letak komponen: seluruh _View_ berjalan di aplikasi _mobile_ React Native pada perangkat pengguna, sedangkan _Controller_, _Model_, dan integrasi eksternal berjalan di _server_ Hono pada Cloudflare Workers. Pattern MVC menentukan pembagian tanggung jawab: _View_ hanya menampilkan antarmuka dan meneruskan aksi pengguna, _Controller_ memvalidasi dan memproses permintaan, dan _Model_ menyimpan data serta aturan domain.

Pattern ini dipilih dengan tiga alasan yang diuraikan pada BAB 1 dokumen APL. Pertama, dua aktor (Mahasiswa dan Administrator) memakai _client_ yang sama dan harus melihat data yang sama, sedangkan jadwal konsultasi hanya terjamin konsisten bila dipegang satu _server_ (UC-04, UC-05). Kedua, pemanggilan Google OAuth 2.0 dan Google Calendar API memakai _client secret_ dan _access token_ yang tidak boleh berada di perangkat pengguna (KF-02, KF-05, UC-11). Ketiga, KNF-01 (uptime 90%) dan KNF-02 (keamanan data) lebih mudah ditegakkan bila autentikasi, validasi, dan akses basis data terpusat di _server_.

Karena _View_ dan _Controller_ terpisah oleh batas _client-server_, interaksi MVC berjalan melalui HTTP: aksi pengguna dari _View_ menjadi **HTTP request**, sedangkan pembaruan dari _Controller_ menjadi **HTTP response** berformat JSON, dan _View_ tidak pernah mengakses _Model_ atau basis data secara langsung. Penerapan pattern ini pada komponen Sehati ditunjukkan pada Gambar 2.1.

```mermaid
---
config:
  layout: elk
---
flowchart TB
    subgraph CLIENT["Client: Aplikasi Mobile React Native (Expo)"]
        V["View<br/>LoginView, HomeView, AffirmationView, ReminderView, CalendarView,<br/>ConsultationBookingView, ConsultationManagementView,<br/>FAQView, FeedbackView, ServerStatusView"]
    end

    subgraph SERVER["Server: Hono di Cloudflare Workers"]
        C["Controller<br/>AuthController, AffirmationController, ReminderController,<br/>CalendarController, ConsultationController, FAQController,<br/>FeedbackController, ServerStatusController"]
        VAL["Validasi"]
        M["Model<br/>Pengguna, Mahasiswa, Administrator, SesiAutentikasi,<br/>DailyAffirmation, Reminder, Notifikasi, KalenderGabungan,<br/>Konsultan, JadwalKonsultasi, FAQ, PengajuanPertanyaan,<br/>UmpanBalik, StatusServer"]
        INT["Integrasi Eksternal<br/>GoogleAuthService, GoogleCalendarService"]
    end

    DB[("CloudflareD1Database")]
    GOOGLE["Google OAuth 2.0 dan Google Calendar API<br/>(sistem eksternal)"]

    V -->|"HTTP request (user events)"| C
    C -->|"HTTP response (update, JSON)"| V
    C -.->|"memvalidasi"| VAL
    C -->|"akses"| M
    C -.->|"memanggil"| INT
    M -->|"disimpan di"| DB
    INT -.->|"memanggil API"| GOOGLE

    style GOOGLE stroke-dasharray: 5 5
```

<p align="center">
<i>Gambar 2.1. Penerapan Pattern Client-Server dengan MVC pada P/L Sehati</i>
</p>

## 2.3 Identifikasi Komponen / Modul / Subsistem

Komponen Sehati dikelompokkan berdasarkan lapisan MVC dari _pattern_ pada subbab 2.2. Kolom **Jenis** mengikuti peran komponen pada pattern tersebut, ditambah _Pendukung_, _Integrasi eksternal_, dan _Penyimpanan data_. Setiap komponen mewakili satu tanggung jawab utama yang jelas.

Tabel 2.2. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen                | Jenis               | Penjelasan                                                                                                        |
| ---------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `LoginView`                  | _View_              | Menampilkan tombol masuk dengan akun Google dan meneruskan hasil otentikasi ke `AuthController`.                  |
| `HomeView`                   | _View_              | Menampilkan beranda sesuai peran pengguna (Mahasiswa atau Administrator), berisi ringkasan dan menu menuju setiap fitur. |
| `AffirmationView`            | _View_              | Menampilkan input waktu pengiriman _daily affirmations_ dan meneruskan ke `AffirmationController`.                |
| `ReminderView`               | _View_              | Menampilkan input waktu pengingat makan/tidur/olahraga dan meneruskan ke `ReminderController`.                    |
| `CalendarView`               | _View_              | Menampilkan kalender gabungan dan meneruskan aksi "Lihat Kalender"/"_Refresh_" ke `CalendarController`.           |
| `ConsultationBookingView`    | _View_              | Menampilkan jadwal konsultasi yang tersedia dan meneruskan pemesanan ke `ConsultationController`.                 |
| `ConsultationManagementView` | _View_              | Menampilkan _dashboard_ admin untuk mengelola jadwal konsultan, meneruskan perubahan ke `ConsultationController`. |
| `FAQView`                    | _View_              | Menampilkan daftar FAQ, kolom pencarian, pengelolaan FAQ oleh admin, dan form pengajuan pertanyaan di luar FAQ.   |
| `FeedbackView`               | _View_              | Menampilkan form umpan balik bagi Mahasiswa dan tampilan tanggapan bagi Administrator.                            |
| `ServerStatusView`           | _View_              | Menampilkan status _uptime_ _server_ dan _website_ kepada Administrator.                                          |
| `AuthController`             | _Controller_        | Memproses otentikasi Google, membuat/memverifikasi `SesiAutentikasi`, dan memanggil `GoogleAuthService`.          |
| `AffirmationController`      | _Controller_        | Memproses penyetelan waktu dan pengiriman `DailyAffirmation`, memicu `Notifikasi`.                                |
| `ReminderController`         | _Controller_        | Memproses penyetelan waktu dan pengiriman `Reminder`, memicu `Notifikasi`.                                        |
| `CalendarController`         | _Controller_        | Mengambil data dari `GoogleCalendarService` dan `JadwalKonsultasi`, menggabungkannya lewat `KalenderGabungan`.    |
| `ConsultationController`     | _Controller_        | Memproses pemesanan dan pengelolaan `JadwalKonsultasi`, memanggil `GoogleCalendarService` untuk cek bentrok.      |
| `FAQController`              | _Controller_        | Memproses pencarian, penambahan, perubahan, dan penghapusan FAQ, serta penyimpanan `PengajuanPertanyaan`.         |
| `FeedbackController`         | _Controller_        | Memproses pengiriman `UmpanBalik` dan penyimpanan tanggapan Administrator.                                        |
| `ServerStatusController`     | _Controller_        | Mengambil data `StatusServer` untuk ditampilkan ke Administrator.                                                 |
| `Validasi`                   | Pendukung           | Memvalidasi input (format waktu, _field_ wajib) sebelum diproses _controller_ terkait.                            |
| `Pengguna`                   | _Model_             | Menyimpan atribut umum akun (`id`, `nama`, `email`, `googleId`) yang dipakai bersama Mahasiswa dan Administrator. |
| `Mahasiswa`                  | _Model_             | Merepresentasikan akun mahasiswa sebagai pengguna utama aplikasi.                                                 |
| `Administrator`              | _Model_             | Merepresentasikan akun administrator pengelola aplikasi.                                                          |
| `SesiAutentikasi`            | _Model_             | Menyimpan token sesi aplikasi dan status _login_ setelah otentikasi Google berhasil.                              |
| `DailyAffirmation`           | _Model_             | Menyimpan konten afirmasi dan jadwal pengiriman yang ditentukan pengguna.                                         |
| `Reminder`                   | _Model_             | Menyimpan jenis pengingat (makan/tidur/olahraga) beserta waktu yang ditentukan pengguna.                          |
| `Notifikasi`                 | _Model_             | Merepresentasikan satu notifikasi yang dikirim ke pengguna.                                                       |
| `KalenderGabungan`           | _Model_             | Menggabungkan event dari `GoogleCalendarService` dengan data `JadwalKonsultasi` untuk satu tampilan kalender.     |
| `Konsultan`                  | _Model_             | Menyimpan data konsultan (nama, spesialisasi) yang didaftarkan Administrator.                                     |
| `JadwalKonsultasi`           | _Model_             | Menyimpan slot jadwal konsultasi (konsultan, waktu, status tersedia/terpesan).                                    |
| `FAQ`                        | _Model_             | Menyimpan pasangan pertanyaan dan jawaban yang dikelola Administrator.                                            |
| `PengajuanPertanyaan`        | _Model_             | Menyimpan pertanyaan yang diajukan pengguna di luar FAQ yang tersedia.                                            |
| `UmpanBalik`                 | _Model_             | Menyimpan umpan balik pengguna beserta tanggapan Administrator (jika ada).                                        |
| `StatusServer`               | _Model_             | Merepresentasikan status _uptime_ layanan yang dipantau Administrator.                                            |
| `GoogleAuthService`          | Integrasi eksternal | Menangani pertukaran kode otorisasi dengan Google OAuth 2.0 dan penerimaan _access/refresh token_.                |
| `GoogleCalendarService`      | Integrasi eksternal | Mengambil _event_ pengguna dari Google Calendar API dan melakukan pengecekan bentrok jadwal (_free/busy_).        |
| `CloudflareD1Database`       | Penyimpanan data    | Menyimpan seluruh data _Model_ secara persisten di Cloudflare D1.                                                 |

## 2.4 Model Arsitektur Perangkat Lunak

BAB ini menggambarkan arsitektur Sehati dari satu sudut pandang yang mencakup seluruh sistem, yaitu _Logical View_. Diagram memuat seluruh 36 komponen pada Tabel 2.2 dengan nama yang sama, dan mengikuti _pattern_ _client-server_ dengan MVC pada BAB 2.

### 2.4.1 _Logical View_

_Logical view_ dipilih karena hal terpenting yang perlu dijelaskan pada Sehati adalah pembagian tanggung jawab antar komponen: _view_ di sisi _client_, serta _controller_, _model_, dan layanan pendukung di sisi _server_. Pembagian ini langsung menjawab kebutuhan SKPL, yaitu satu _server_ yang memegang data bersama untuk dua aktor dan satu-satunya yang memanggil Google. _Process view_ tidak dipilih karena sistem ini tidak memiliki alur proses paralel yang rumit, dan _physical view_ tidak dipilih karena lingkungan operasinya sudah dijelaskan pada Tabel 2.1.

Diagram pada Gambar 2.2 adalah _block diagram_ yang memuat seluruh 36 komponen Tabel 2.2:

- 10 _view_,
- 8 _controller_,
- 1 validasi,
- 14 _model_,
- 2 integrasi eksternal, dan
- 1 penyimpanan data.

Komponen dikelompokkan sesuai subbab 2.2. Kotak "_Client_" berisi _view_, dan kotak "_Server_" berisi _controller_, _model_, dan sistem pendukung (validasi). Layanan Google (`GoogleAuthService` dan `GoogleCalendarService`) berada dalam kotak "Sistem Eksternal", dan `CloudflareD1Database` berada di luar kotak "_Server_". Garis putus-putus menandakan pemanggilan atau validasi. Garis penuh menandakan akses ke _model_ atau penyimpanan data.

```mermaid
---
config:
  layout: elk
---
flowchart TB
    subgraph CLIENT["Client"]
    subgraph VIEW["View"]
        direction LR
        AffirmationView
        ReminderView
        FAQView
        FeedbackView
        ServerStatusView
        LoginView
        HomeView
        CalendarView
        ConsultationBookingView
        ConsultationManagementView
    end
    end

    subgraph SERVER["Server"]
    subgraph CONTROLLER["Controller"]
        direction LR
        AffirmationController
        ReminderController
        FAQController
        FeedbackController
        ServerStatusController
        AuthController
        CalendarController
        ConsultationController
    end

    subgraph MODEL["Model"]
        direction LR
        DailyAffirmation
        Reminder
        FAQ
        UmpanBalik
        StatusServer
        SesiAutentikasi
        KalenderGabungan
        JadwalKonsultasi
        Konsultan
        Notifikasi
        PengajuanPertanyaan
        Mahasiswa
        Administrator
        Pengguna
    end

    subgraph PENDUKUNG["Sistem Pendukung"]
        Validasi
    end
    end

    subgraph EKSTERNAL["Sistem Eksternal"]
        GoogleCalendarService
        GoogleAuthService
    end

    CloudflareD1Database[("CloudflareD1Database")]

    %% View -> Controller
    AffirmationView -.->|Memanggil| AffirmationController
    ReminderView -.->|Memanggil| ReminderController
    FAQView -.->|Memanggil| FAQController
    FeedbackView -.->|Memanggil| FeedbackController
    ServerStatusView -.->|Memanggil| ServerStatusController
    LoginView -.->|Memanggil| AuthController
    LoginView -.->|Membuka| HomeView
    HomeView -.->|Memanggil| AffirmationController
    HomeView -.->|Memanggil| ConsultationController
    HomeView -.->|Memanggil| ServerStatusController
    CalendarView -.->|Memanggil| CalendarController
    ConsultationBookingView -.->|Memanggil| ConsultationController
    ConsultationManagementView -.->|Memanggil| ConsultationController

    %% Controller -> Model
    AffirmationController -->|Akses| DailyAffirmation
    ReminderController -->|Akses| Reminder
    FAQController -->|Akses| FAQ
    FeedbackController -->|Akses| UmpanBalik
    ServerStatusController -->|Akses| StatusServer
    AuthController -->|Akses| SesiAutentikasi
    CalendarController -->|Akses| KalenderGabungan
    ConsultationController -->|Akses| JadwalKonsultasi
    ConsultationController -->|Akses| Konsultan
    KalenderGabungan -.->|Memanggil| JadwalKonsultasi

    %% Controller -> Validasi
    AffirmationController -.->|Memvalidasi| Validasi
    ReminderController -.->|Memvalidasi| Validasi
    CalendarController -.->|Memvalidasi| Validasi
    ConsultationController -.->|Memvalidasi| Validasi

    %% Controller -> Sistem Eksternal
    AuthController -.->|Memanggil| GoogleAuthService
    CalendarController -.->|Memanggil| GoogleCalendarService
    ConsultationController -.->|Memanggil| GoogleCalendarService

    %% Antar-Model (ujung o = sisi "keseluruhan")
    DailyAffirmation --o|Agregasi| Notifikasi
    Reminder --o|Agregasi| Notifikasi
    UmpanBalik --o|Agregasi| PengajuanPertanyaan
    StatusServer --o|Agregasi| Administrator
    JadwalKonsultasi --o|Agregasi| Administrator
    Konsultan --o|Agregasi| Administrator
    DailyAffirmation --o|Komposisi| Mahasiswa
    Reminder --o|Komposisi| Mahasiswa
    KalenderGabungan --o|Komposisi| Mahasiswa
    Mahasiswa --o|Komposisi| Pengguna
    Administrator --o|Komposisi| Pengguna

    MODEL -->|Menyimpan| CloudflareD1Database
```

<p align="center">
<i>Gambar 2.2. Logical View pada P/L Sehati</i>
</p>

Relasi antar komponen pada Gambar 2.2:

1. **_View_ → _Controller_** (memanggil)

Setiap _view_ memanggil _controller_ untuk fiturnya. `LoginView` memanggil `AuthController`, dan `ConsultationBookingView` serta `ConsultationManagementView` sama-sama memanggil `ConsultationController`. `HomeView` memanggil `AffirmationController`, `ConsultationController`, dan `ServerStatusController` untuk mengisi ringkasan beranda.

2. **_Controller_ → _Model_** (akses)

Setiap _controller_ mengakses _model_ yang dikelolanya, misalnya `FAQController` ke `FAQ` dan `ConsultationController` ke `JadwalKonsultasi` dan `Konsultan`.

3. **_Controller_ → Validasi** (memvalidasi)

_Controller_ yang menerima input waktu atau isian wajib memeriksanya lewat validasi sebelum diproses.

4. **_Controller_ → Sistem Eksternal** (memanggil)

`AuthController` memanggil `GoogleAuthService`, sedangkan `CalendarController` dan `ConsultationController` memanggil `GoogleCalendarService`.

5. **Antar-Model** (agregasi dan komposisi)

`Notifikasi`, `PengajuanPertanyaan`, dan `Administrator` menghimpun _model_ terkait secara agregasi. `DailyAffirmation`, `Reminder`, dan `KalenderGabungan` menjadi bagian dari `Mahasiswa` secara komposisi, begitu pula `Mahasiswa` dan `Administrator` terhadap `Pengguna`.

6. **_Model_ → CloudflareD1Database** (menyimpan)

Seluruh _model_ disimpan secara persisten di D1.

Pada diagram ini, simbol lingkaran di ujung garis antar-_model_ berada di sisi komponen yang menghimpun (agregat atau induk).

---

# BAB 3: Realisasi Use Case

BAB ini menjabarkan realisasi seluruh 12 _use case_ pada SKPL (UC-01 sampai UC-12). Setiap _use case_ dilengkapi identifikasi kelas, _sequence diagram_ untuk setiap skenario pada SKPL, dan diagram kelas.

## 3.1 Use Case Menyetel Daily Affirmations

**ID Use Case:** UC-01  
**Nama Use Case:** Menyetel Daily Affirmations

### 3.1.1 Identifikasi Kelas

Tabel 3.1. Identifikasi Kelas Use Case UC-01

| No  | Nama Kelas Perancangan  | Nama Kelas Analisis Terkait |
| --- | ----------------------- | --------------------------- |
| 1   | `Mahasiswa`             | `Mahasiswa` (C-02)          |
| 2   | `AffirmationView`       | -                           |
| 3   | `AffirmationController` | -                           |
| 4   | `Validasi`              | -                           |
| 5   | `DailyAffirmation`      | `DailyAffirmation` (C-05)   |
| 6   | `CloudflareD1Database`  | -                           |
| 7   | `Notifikasi`            | `Notifikasi` (C-07)         |

### 3.1.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant AffirmationView@{ "type": "boundary" }
    participant AffirmationController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant DailyAffirmation@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }
    participant Notifikasi@{ "type": "entity" }

    Mahasiswa->>+AffirmationView: bukaPageAffirmasi()
    AffirmationView->>+AffirmationController: tampilkanOpsiAffirmasi()
    AffirmationController-->>-AffirmationView: opsi waktu pengiriman
    AffirmationView-->>-Mahasiswa: tampilkanOpsiAffirmasi()
    Mahasiswa->>+AffirmationView: pilihWaktuPengiriman(waktu)
    AffirmationView->>+AffirmationController: submitWaktuPengiriman(waktu)
    AffirmationController->>+Validasi: validasiWaktu(waktu)
    Validasi-->>-AffirmationController: valid
    AffirmationController->>+DailyAffirmation: aturWaktuKirim(waktu)
    DailyAffirmation->>+CloudflareD1Database: simpanWaktuKirim(waktu)
    CloudflareD1Database-->>-DailyAffirmation: berhasil
    DailyAffirmation-->>-AffirmationController: true
    AffirmationController->>+Notifikasi: kirimNotifikasi()
    Notifikasi-->>-AffirmationController: terkirim
    AffirmationController-->>-AffirmationView: setelan tersimpan
    AffirmationView-->>-Mahasiswa: tampilkanSetelanTersimpan()
```

<p align="center">
<i>Gambar 3.1.1. Sequence Diagram UC-01 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Sistem tidak mampu menyimpan setelan**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant AffirmationView@{ "type": "boundary" }
    participant AffirmationController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant DailyAffirmation@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }
    participant Notifikasi@{ "type": "entity" }

    Mahasiswa->>+AffirmationView: bukaPageAffirmasi()
    AffirmationView->>+AffirmationController: tampilkanOpsiAffirmasi()
    AffirmationController-->>-AffirmationView: opsi waktu pengiriman
    AffirmationView-->>-Mahasiswa: tampilkanOpsiAffirmasi()
    Mahasiswa->>+AffirmationView: pilihWaktuPengiriman(waktu)
    AffirmationView->>+AffirmationController: submitWaktuPengiriman(waktu)
    AffirmationController->>+Validasi: validasiWaktu(waktu)
    Validasi-->>-AffirmationController: valid
    AffirmationController->>+DailyAffirmation: aturWaktuKirim(waktu)
    DailyAffirmation->>+CloudflareD1Database: simpanWaktuKirim(waktu)
    CloudflareD1Database-->>-DailyAffirmation: gagal
    DailyAffirmation-->>-AffirmationController: false
    AffirmationController-->>-AffirmationView: gagal menyimpan
    AffirmationView-->>-Mahasiswa: showError(pesan)
```

<p align="center">
<i>Gambar 3.1.2. Sequence Diagram UC-01 - Skenario Alternatif 1</i>
</p>

### 3.1.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class AffirmationView {
        <<boundary>>
        -waktuTerpilih: Time
        +bukaPageAffirmasi(): void
        +pilihWaktuPengiriman(waktu: Time): void
        +tampilkanOpsiAffirmasi(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class AffirmationController {
        <<control>>
        +tampilkanOpsiAffirmasi(): void
        +submitWaktuPengiriman(waktu: Time): void
        +ambilAfirmasiHariIni(): DailyAffirmation
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class DailyAffirmation {
        <<entity>>
        -konten: String
        -waktuKirim: Time
        +aturWaktuKirim(waktu: Time): Boolean
        +kirimAfirmasi(): void
        +ambilAfirmasi(): DailyAffirmation
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    class Notifikasi {
        <<entity>>
        -idNotifikasi: String
        -isi: String
        -waktuKirim: DateTime
        +kirimNotifikasi(): void
        +tampilkanNotifikasi(): void
    }
    Mahasiswa "1" --> "0..*" DailyAffirmation : mengatur
    DailyAffirmation ..> Notifikasi : memicu
    Mahasiswa "1" --> "1" AffirmationView : mengakses
    AffirmationView "1" --> "1" AffirmationController : memanggil
    AffirmationController ..> DailyAffirmation : akses
    AffirmationController ..> Validasi : memvalidasi
    AffirmationController ..> Notifikasi : akses
    DailyAffirmation ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.1.3. Diagram Kelas Use Case UC-01 - Menyetel Daily Affirmations</i>
</p>

## 3.2 Use Case Menyetel Pengingat Kesehatan

**ID Use Case:** UC-02  
**Nama Use Case:** Menyetel Pengingat Kesehatan

### 3.2.1 Identifikasi Kelas

Tabel 3.2. Identifikasi Kelas Use Case UC-02

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1   | `Mahasiswa`            | `Mahasiswa` (C-02)          |
| 2   | `ReminderView`         | -                           |
| 3   | `ReminderController`   | -                           |
| 4   | `Validasi`             | -                           |
| 5   | `Reminder`             | `Reminder` (C-06)           |
| 6   | `CloudflareD1Database` | -                           |
| 7   | `Notifikasi`           | `Notifikasi` (C-07)         |

### 3.2.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant ReminderView@{ "type": "boundary" }
    participant ReminderController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant Reminder@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }
    participant Notifikasi@{ "type": "entity" }

    Mahasiswa->>+ReminderView: bukaPageReminder()
    ReminderView->>+ReminderController: tampilkanOpsiReminder()
    ReminderController-->>-ReminderView: opsi waktu pengiriman
    ReminderView-->>-Mahasiswa: tampilkanOpsiReminder()
    Mahasiswa->>+ReminderView: pilihWaktuPengiriman(waktu)
    ReminderView->>+ReminderController: submitWaktuPengiriman(waktu)
    ReminderController->>+Validasi: validasiWaktu(waktu)
    Validasi-->>-ReminderController: valid
    ReminderController->>+Reminder: aturWaktuKirim(waktu)
    Reminder->>+CloudflareD1Database: simpanWaktuKirim(waktu)
    CloudflareD1Database-->>-Reminder: berhasil
    Reminder-->>-ReminderController: true
    ReminderController->>+Notifikasi: kirimNotifikasi()
    Notifikasi-->>-ReminderController: terkirim
    ReminderController-->>-ReminderView: setelan tersimpan
    ReminderView-->>-Mahasiswa: tampilkanSetelanTersimpan()
```

<p align="center">
<i>Gambar 3.2.1. Sequence Diagram UC-02 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Sistem tidak mampu menyimpan setelan**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant ReminderView@{ "type": "boundary" }
    participant ReminderController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant Reminder@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }
    participant Notifikasi@{ "type": "entity" }

    Mahasiswa->>+ReminderView: bukaPageReminder()
    ReminderView->>+ReminderController: tampilkanOpsiReminder()
    ReminderController-->>-ReminderView: opsi waktu pengiriman
    ReminderView-->>-Mahasiswa: tampilkanOpsiReminder()
    Mahasiswa->>+ReminderView: pilihWaktuPengiriman(waktu)
    ReminderView->>+ReminderController: submitWaktuPengiriman(waktu)
    ReminderController->>+Validasi: validasiWaktu(waktu)
    Validasi-->>-ReminderController: valid
    ReminderController->>+Reminder: aturWaktuKirim(waktu)
    Reminder->>+CloudflareD1Database: simpanWaktuKirim(waktu)
    CloudflareD1Database-->>-Reminder: gagal
    Reminder-->>-ReminderController: false
    ReminderController-->>-ReminderView: gagal menyimpan
    ReminderView-->>-Mahasiswa: showError(pesan)
```

<p align="center">
<i>Gambar 3.2.2. Sequence Diagram UC-02 - Skenario Alternatif 1</i>
</p>

### 3.2.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class ReminderView {
        <<boundary>>
        -waktuTerpilih: Time
        +bukaPageReminder(): void
        +pilihWaktuPengiriman(waktu: Time): void
        +tampilkanOpsiReminder(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class ReminderController {
        <<control>>
        +tampilkanOpsiReminder(): void
        +submitWaktuPengiriman(waktu: Time): void
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class Reminder {
        <<entity>>
        -jenis: String
        -waktu: Time
        +aturWaktuKirim(waktu: Time): Boolean
        +kirimPengingat(): void
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    class Notifikasi {
        <<entity>>
        -idNotifikasi: String
        -isi: String
        -waktuKirim: DateTime
        +kirimNotifikasi(): void
        +tampilkanNotifikasi(): void
    }
    Mahasiswa "1" --> "0..*" Reminder : mengatur
    Reminder ..> Notifikasi : memicu
    Mahasiswa "1" --> "1" ReminderView : mengakses
    ReminderView "1" --> "1" ReminderController : memanggil
    ReminderController ..> Reminder : akses
    ReminderController ..> Validasi : memvalidasi
    ReminderController ..> Notifikasi : akses
    Reminder ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.2.3. Diagram Kelas Use Case UC-02 - Menyetel Pengingat Kesehatan</i>
</p>

## 3.3 Use Case Melihat Kalender Terintegrasi

**ID Use Case:** UC-03  
**Nama Use Case:** Melihat Kalender Terintegrasi

### 3.3.1 Identifikasi Kelas

Tabel 3.3. Identifikasi Kelas Use Case UC-03

| No  | Nama Kelas Perancangan  | Nama Kelas Analisis Terkait    |
| --- | ----------------------- | ------------------------------ |
| 1   | `Mahasiswa`             | `Mahasiswa` (C-02)             |
| 2   | `CalendarView`          | -                              |
| 3   | `CalendarController`    | -                              |
| 4   | `GoogleCalendarService` | `GoogleCalendarService` (C-08) |
| 5   | `JadwalKonsultasi`      | `JadwalKonsultasi` (C-11)      |
| 6   | `KalenderGabungan`      | `KalenderGabungan` (C-09)      |

### 3.3.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant CalendarView@{ "type": "boundary" }
    participant CalendarController@{ "type": "control" }
    participant GoogleCalendarService@{ "type": "entity" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }

    Mahasiswa->>+CalendarView: bukaPageCalendar()
    CalendarView->>+CalendarController: tampilkanCalendar()
    CalendarController->>+GoogleCalendarService: ambilKalender()
    GoogleCalendarService-->>-CalendarController: daftar event Google
    CalendarController->>+JadwalKonsultasi: ambilKalender()
    JadwalKonsultasi-->>-CalendarController: daftar jadwal konsultasi
    CalendarController->>+KalenderGabungan: gabungkanJadwal(google, jadwal)
    KalenderGabungan-->>-CalendarController: kalender gabungan
    CalendarController-->>-CalendarView: kalender gabungan
    CalendarView-->>-Mahasiswa: tampilkanKalender(kalender)
```

<p align="center">
<i>Gambar 3.3.1. Sequence Diagram UC-03 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Sistem tidak mampu mengambil data event**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant CalendarView@{ "type": "boundary" }
    participant CalendarController@{ "type": "control" }
    participant GoogleCalendarService@{ "type": "entity" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }

    Mahasiswa->>+CalendarView: bukaPageCalendar()
    CalendarView->>+CalendarController: tampilkanCalendar()
    CalendarController->>+GoogleCalendarService: ambilKalender()
    GoogleCalendarService-->>-CalendarController: gagal
    CalendarController-->>-CalendarView: gagal mengambil data
    CalendarView-->>-Mahasiswa: showErrorMessage(pesan)
    Note over Mahasiswa,CalendarView: Mahasiswa dapat menekan tombol Refresh untuk mengulangi bukaPageCalendar()
```

<p align="center">
<i>Gambar 3.3.2. Sequence Diagram UC-03 - Skenario Alternatif 1</i>
</p>

### 3.3.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class CalendarView {
        <<boundary>>
        +bukaPageCalendar(): void
        +tampilkanKalender(kalender: List~Event~): void
        +showErrorMessage(pesan: String): void
    }
    class CalendarController {
        <<control>>
        +tampilkanCalendar(): void
    }
    class GoogleCalendarService {
        <<entity>>
        -accessToken: String
        +ambilKalender(): List~Event~
        +cekBentrokJadwal(jadwal: JadwalKonsultasi): Boolean
    }
    class JadwalKonsultasi {
        <<entity>>
        -idJadwal: String
        -waktu: DateTime
        -waktuSelesai: DateTime
        -status: String
        +ambilKalender(): List~JadwalKonsultasi~
        +ambilKalender(konsultan: Konsultan): List~JadwalKonsultasi~
        +simpanJadwal(): Boolean
        +perbaruiJadwal(): Boolean
        +pesanSesi(): Boolean
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class KalenderGabungan {
        <<entity>>
        -daftarEvent: List~Event~
        +gabungkanJadwal(google: List~Event~, jadwal: List~JadwalKonsultasi~): List~Event~
        +jadwalBentrok(jadwal: JadwalKonsultasi): Boolean
        +ubahKalender(jadwal: JadwalKonsultasi): Boolean
    }
    Mahasiswa "1" --> "1" KalenderGabungan : melihat
    KalenderGabungan ..> GoogleCalendarService : memakai
    KalenderGabungan "1" --> "0..*" JadwalKonsultasi : menggabungkan
    Mahasiswa "1" --> "0..*" JadwalKonsultasi : memesan
    Mahasiswa "1" --> "1" CalendarView : mengakses
    CalendarView "1" --> "1" CalendarController : memanggil
    CalendarController ..> GoogleCalendarService : akses
    CalendarController ..> JadwalKonsultasi : akses
    CalendarController ..> KalenderGabungan : akses
```

<p align="center">
<i>Gambar 3.3.3. Diagram Kelas Use Case UC-03 - Melihat Kalender Terintegrasi</i>
</p>

## 3.4 Use Case Memesan Sesi Konsultasi

**ID Use Case:** UC-04  
**Nama Use Case:** Memesan Sesi Konsultasi

### 3.4.1 Identifikasi Kelas

Tabel 3.4. Identifikasi Kelas Use Case UC-04

| No  | Nama Kelas Perancangan    | Nama Kelas Analisis Terkait    |
| --- | ------------------------- | ------------------------------ |
| 1   | `Mahasiswa`               | `Mahasiswa` (C-02)             |
| 2   | `ConsultationBookingView` | -                              |
| 3   | `ConsultationController`  | -                              |
| 4   | `Konsultan`               | `Konsultan` (C-10)             |
| 5   | `JadwalKonsultasi`        | `JadwalKonsultasi` (C-11)      |
| 6   | `Validasi`                | -                              |
| 7   | `KalenderGabungan`        | `KalenderGabungan` (C-09)      |
| 8   | `GoogleCalendarService`   | `GoogleCalendarService` (C-08) |
| 9   | `CloudflareD1Database`    | -                              |

### 3.4.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant ConsultationBookingView@{ "type": "boundary" }
    participant ConsultationController@{ "type": "control" }
    participant Konsultan@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }
    participant GoogleCalendarService@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+ConsultationBookingView: bukaPageKonsultasi()
    ConsultationBookingView->>+ConsultationController: tampilkanOpsiKonsultasi()
    ConsultationController->>+Konsultan: ambilDaftarKonsultan()
    Konsultan-->>-ConsultationController: daftar konsultan
    ConsultationController-->>-ConsultationBookingView: daftar konsultan
    ConsultationBookingView-->>-Mahasiswa: tampilkanOpsiKonsultasi(daftar)
    Mahasiswa->>+ConsultationBookingView: pilihKonsultan(konsultan)
    ConsultationBookingView->>+ConsultationController: submitKonsultan(konsultan)
    ConsultationController->>+Validasi: validasiKonsultan(konsultan)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+JadwalKonsultasi: ambilKalender(konsultan)
    JadwalKonsultasi-->>-ConsultationController: daftar jadwal konsultasi
    ConsultationController-->>-ConsultationBookingView: daftar jadwal
    ConsultationBookingView-->>-Mahasiswa: tampilkanKalender(jadwal)
    Mahasiswa->>+ConsultationBookingView: pilihSesi(jadwal)
    ConsultationBookingView->>+ConsultationController: updateStatusKonsultasi(jadwal)
    ConsultationController->>+KalenderGabungan: jadwalBentrok(jadwal)
    KalenderGabungan->>+GoogleCalendarService: cekBentrokJadwal(jadwal)
    GoogleCalendarService-->>-KalenderGabungan: false
    KalenderGabungan-->>-ConsultationController: false
    ConsultationController->>+KalenderGabungan: ubahKalender(jadwal)
    KalenderGabungan->>+CloudflareD1Database: simpanKalender(jadwal)
    CloudflareD1Database-->>-KalenderGabungan: berhasil
    KalenderGabungan-->>-ConsultationController: true
    ConsultationController->>+JadwalKonsultasi: pesanSesi()
    JadwalKonsultasi-->>-ConsultationController: true
    ConsultationController-->>-ConsultationBookingView: sesi terpesan
    ConsultationBookingView-->>-Mahasiswa: tampilkanSetelanTersimpan()
```

<p align="center">
<i>Gambar 3.4.1. Sequence Diagram UC-04 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Sistem tidak mampu mengambil data jadwal konsultasi**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant ConsultationBookingView@{ "type": "boundary" }
    participant ConsultationController@{ "type": "control" }
    participant Konsultan@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }
    participant GoogleCalendarService@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+ConsultationBookingView: bukaPageKonsultasi()
    ConsultationBookingView->>+ConsultationController: tampilkanOpsiKonsultasi()
    ConsultationController->>+Konsultan: ambilDaftarKonsultan()
    Konsultan-->>-ConsultationController: daftar konsultan
    ConsultationController-->>-ConsultationBookingView: daftar konsultan
    ConsultationBookingView-->>-Mahasiswa: tampilkanOpsiKonsultasi(daftar)
    Mahasiswa->>+ConsultationBookingView: pilihKonsultan(konsultan)
    ConsultationBookingView->>+ConsultationController: submitKonsultan(konsultan)
    ConsultationController->>+Validasi: validasiKonsultan(konsultan)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+JadwalKonsultasi: ambilKalender(konsultan)
    JadwalKonsultasi-->>-ConsultationController: gagal
    ConsultationController-->>-ConsultationBookingView: gagal mengambil data
    ConsultationBookingView-->>-Mahasiswa: showError(pesan)
    Note over Mahasiswa,ConsultationBookingView: Mahasiswa dapat menekan tombol Refresh untuk mengulangi bukaPageKonsultasi()
```

<p align="center">
<i>Gambar 3.4.2. Sequence Diagram UC-04 - Skenario Alternatif 1</i>
</p>

- **Skenario Alternatif 2: Sistem tidak mampu menyimpan jadwal konsultasi yang dipesan**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant ConsultationBookingView@{ "type": "boundary" }
    participant ConsultationController@{ "type": "control" }
    participant Konsultan@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }
    participant GoogleCalendarService@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+ConsultationBookingView: bukaPageKonsultasi()
    ConsultationBookingView->>+ConsultationController: tampilkanOpsiKonsultasi()
    ConsultationController->>+Konsultan: ambilDaftarKonsultan()
    Konsultan-->>-ConsultationController: daftar konsultan
    ConsultationController-->>-ConsultationBookingView: daftar konsultan
    ConsultationBookingView-->>-Mahasiswa: tampilkanOpsiKonsultasi(daftar)
    Mahasiswa->>+ConsultationBookingView: pilihKonsultan(konsultan)
    ConsultationBookingView->>+ConsultationController: submitKonsultan(konsultan)
    ConsultationController->>+Validasi: validasiKonsultan(konsultan)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+JadwalKonsultasi: ambilKalender(konsultan)
    JadwalKonsultasi-->>-ConsultationController: daftar jadwal konsultasi
    ConsultationController-->>-ConsultationBookingView: daftar jadwal
    ConsultationBookingView-->>-Mahasiswa: tampilkanKalender(jadwal)
    Mahasiswa->>+ConsultationBookingView: pilihSesi(jadwal)
    ConsultationBookingView->>+ConsultationController: updateStatusKonsultasi(jadwal)
    ConsultationController->>+KalenderGabungan: jadwalBentrok(jadwal)
    KalenderGabungan->>+GoogleCalendarService: cekBentrokJadwal(jadwal)
    GoogleCalendarService-->>-KalenderGabungan: false
    KalenderGabungan-->>-ConsultationController: false
    ConsultationController->>+KalenderGabungan: ubahKalender(jadwal)
    KalenderGabungan->>+CloudflareD1Database: simpanKalender(jadwal)
    CloudflareD1Database-->>-KalenderGabungan: gagal
    KalenderGabungan-->>-ConsultationController: false
    ConsultationController-->>-ConsultationBookingView: gagal menyimpan
    ConsultationBookingView-->>-Mahasiswa: showError(pesan)
```

<p align="center">
<i>Gambar 3.4.3. Sequence Diagram UC-04 - Skenario Alternatif 2</i>
</p>

### 3.4.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class ConsultationBookingView {
        <<boundary>>
        +bukaPageKonsultasi(): void
        +pilihKonsultan(konsultan: Konsultan): void
        +pilihSesi(jadwal: JadwalKonsultasi): void
        +tampilkanOpsiKonsultasi(daftar: List~Konsultan~): void
        +tampilkanKalender(jadwal: List~JadwalKonsultasi~): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class ConsultationController {
        <<control>>
        +tampilkanOpsiKonsultasi(): void
        +submitKonsultan(konsultan: Konsultan): void
        +updateStatusKonsultasi(jadwal: JadwalKonsultasi): void
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class Konsultan {
        <<entity>>
        -idKonsultan: String
        -nama: String
        -spesialisasi: String
        +ambilDaftarKonsultan(): List~Konsultan~
    }
    class JadwalKonsultasi {
        <<entity>>
        -idJadwal: String
        -waktu: DateTime
        -waktuSelesai: DateTime
        -status: String
        +ambilKalender(): List~JadwalKonsultasi~
        +ambilKalender(konsultan: Konsultan): List~JadwalKonsultasi~
        +simpanJadwal(): Boolean
        +perbaruiJadwal(): Boolean
        +pesanSesi(): Boolean
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class KalenderGabungan {
        <<entity>>
        -daftarEvent: List~Event~
        +gabungkanJadwal(google: List~Event~, jadwal: List~JadwalKonsultasi~): List~Event~
        +jadwalBentrok(jadwal: JadwalKonsultasi): Boolean
        +ubahKalender(jadwal: JadwalKonsultasi): Boolean
    }
    class GoogleCalendarService {
        <<entity>>
        -accessToken: String
        +ambilKalender(): List~Event~
        +cekBentrokJadwal(jadwal: JadwalKonsultasi): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Mahasiswa "1" --> "1" KalenderGabungan : melihat
    KalenderGabungan ..> GoogleCalendarService : memakai
    KalenderGabungan "1" --> "0..*" JadwalKonsultasi : menggabungkan
    Mahasiswa "1" --> "0..*" JadwalKonsultasi : memesan
    JadwalKonsultasi "0..*" --> "1" Konsultan : bersama
    Mahasiswa "1" --> "1" ConsultationBookingView : mengakses
    ConsultationBookingView "1" --> "1" ConsultationController : memanggil
    ConsultationController ..> Konsultan : akses
    ConsultationController ..> JadwalKonsultasi : akses
    ConsultationController ..> Validasi : memvalidasi
    ConsultationController ..> KalenderGabungan : akses
    KalenderGabungan ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.4.4. Diagram Kelas Use Case UC-04 - Memesan Sesi Konsultasi</i>
</p>

## 3.5 Use Case Mengelola Jadwal Konsultan

**ID Use Case:** UC-05  
**Nama Use Case:** Mengelola Jadwal Konsultan

### 3.5.1 Identifikasi Kelas

Tabel 3.5. Identifikasi Kelas Use Case UC-05

| No  | Nama Kelas Perancangan       | Nama Kelas Analisis Terkait |
| --- | ---------------------------- | --------------------------- |
| 1   | `Administrator`              | `Administrator` (C-03)      |
| 2   | `ConsultationManagementView` | -                           |
| 3   | `ConsultationController`     | -                           |
| 4   | `Konsultan`                  | `Konsultan` (C-10)          |
| 5   | `JadwalKonsultasi`           | `JadwalKonsultasi` (C-11)   |
| 6   | `Validasi`                   | -                           |
| 7   | `KalenderGabungan`           | `KalenderGabungan` (C-09)   |
| 8   | `CloudflareD1Database`       | -                           |

### 3.5.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Administrator
    participant ConsultationManagementView@{ "type": "boundary" }
    participant ConsultationController@{ "type": "control" }
    participant Konsultan@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Administrator->>+ConsultationManagementView: bukaPageKonsultasi()
    ConsultationManagementView->>+ConsultationController: tampilkanOpsiKonsultasi()
    ConsultationController->>+Konsultan: ambilDaftarKonsultan()
    Konsultan-->>-ConsultationController: daftar konsultan
    ConsultationController-->>-ConsultationManagementView: daftar konsultan
    ConsultationManagementView-->>-Administrator: tampilkanOpsiKonsultasi(daftar)
    Administrator->>+ConsultationManagementView: pilihKonsultan(konsultan)
    ConsultationManagementView->>+ConsultationController: submitKonsultan(konsultan)
    ConsultationController->>+Validasi: validasiKonsultan(konsultan)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+JadwalKonsultasi: ambilKalender(konsultan)
    JadwalKonsultasi-->>-ConsultationController: daftar jadwal konsultasi
    ConsultationController-->>-ConsultationManagementView: daftar jadwal
    ConsultationManagementView-->>-Administrator: tampilkanKalender(jadwal)
    Administrator->>+ConsultationManagementView: perbaruiJadwal(jadwal)
    ConsultationManagementView->>+ConsultationController: updateStatusKonsultasi(jadwal)
    ConsultationController->>+Validasi: validasiJadwal(jadwal)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+KalenderGabungan: ubahKalender(jadwal)
    KalenderGabungan->>+CloudflareD1Database: simpanKalender(jadwal)
    CloudflareD1Database-->>-KalenderGabungan: berhasil
    KalenderGabungan-->>-ConsultationController: true
    ConsultationController-->>-ConsultationManagementView: jadwal diperbarui
    ConsultationManagementView-->>-Administrator: tampilkanSetelanTersimpan()
```

<p align="center">
<i>Gambar 3.5.1. Sequence Diagram UC-05 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Sistem tidak mampu mengambil data jadwal konsultasi**

```mermaid
sequenceDiagram
    actor Administrator
    participant ConsultationManagementView@{ "type": "boundary" }
    participant ConsultationController@{ "type": "control" }
    participant Konsultan@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Administrator->>+ConsultationManagementView: bukaPageKonsultasi()
    ConsultationManagementView->>+ConsultationController: tampilkanOpsiKonsultasi()
    ConsultationController->>+Konsultan: ambilDaftarKonsultan()
    Konsultan-->>-ConsultationController: daftar konsultan
    ConsultationController-->>-ConsultationManagementView: daftar konsultan
    ConsultationManagementView-->>-Administrator: tampilkanOpsiKonsultasi(daftar)
    Administrator->>+ConsultationManagementView: pilihKonsultan(konsultan)
    ConsultationManagementView->>+ConsultationController: submitKonsultan(konsultan)
    ConsultationController->>+Validasi: validasiKonsultan(konsultan)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+JadwalKonsultasi: ambilKalender(konsultan)
    JadwalKonsultasi-->>-ConsultationController: gagal
    ConsultationController-->>-ConsultationManagementView: gagal mengambil data
    ConsultationManagementView-->>-Administrator: showError(pesan)
    Note over Administrator,ConsultationManagementView: Administrator dapat menekan tombol Refresh untuk mengulangi bukaPageKonsultasi()
```

<p align="center">
<i>Gambar 3.5.2. Sequence Diagram UC-05 - Skenario Alternatif 1</i>
</p>

- **Skenario Alternatif 2: Sistem tidak mampu mengedit data jadwal konsultasi**

```mermaid
sequenceDiagram
    actor Administrator
    participant ConsultationManagementView@{ "type": "boundary" }
    participant ConsultationController@{ "type": "control" }
    participant Konsultan@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant JadwalKonsultasi@{ "type": "entity" }
    participant KalenderGabungan@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Administrator->>+ConsultationManagementView: bukaPageKonsultasi()
    ConsultationManagementView->>+ConsultationController: tampilkanOpsiKonsultasi()
    ConsultationController->>+Konsultan: ambilDaftarKonsultan()
    Konsultan-->>-ConsultationController: daftar konsultan
    ConsultationController-->>-ConsultationManagementView: daftar konsultan
    ConsultationManagementView-->>-Administrator: tampilkanOpsiKonsultasi(daftar)
    Administrator->>+ConsultationManagementView: pilihKonsultan(konsultan)
    ConsultationManagementView->>+ConsultationController: submitKonsultan(konsultan)
    ConsultationController->>+Validasi: validasiKonsultan(konsultan)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+JadwalKonsultasi: ambilKalender(konsultan)
    JadwalKonsultasi-->>-ConsultationController: daftar jadwal konsultasi
    ConsultationController-->>-ConsultationManagementView: daftar jadwal
    ConsultationManagementView-->>-Administrator: tampilkanKalender(jadwal)
    Administrator->>+ConsultationManagementView: perbaruiJadwal(jadwal)
    ConsultationManagementView->>+ConsultationController: updateStatusKonsultasi(jadwal)
    ConsultationController->>+Validasi: validasiJadwal(jadwal)
    Validasi-->>-ConsultationController: valid
    ConsultationController->>+KalenderGabungan: ubahKalender(jadwal)
    KalenderGabungan->>+CloudflareD1Database: simpanKalender(jadwal)
    CloudflareD1Database-->>-KalenderGabungan: gagal
    KalenderGabungan-->>-ConsultationController: false
    ConsultationController-->>-ConsultationManagementView: gagal menyimpan
    ConsultationManagementView-->>-Administrator: showError(pesan)
```

<p align="center">
<i>Gambar 3.5.3. Sequence Diagram UC-05 - Skenario Alternatif 2</i>
</p>

### 3.5.3 Diagram Kelas

```mermaid
classDiagram
    class Administrator {
        <<entity>>
    }
    class ConsultationManagementView {
        <<boundary>>
        +bukaPageKonsultasi(): void
        +pilihKonsultan(konsultan: Konsultan): void
        +perbaruiJadwal(jadwal: JadwalKonsultasi): void
        +tampilkanOpsiKonsultasi(daftar: List~Konsultan~): void
        +tampilkanKalender(jadwal: List~JadwalKonsultasi~): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class ConsultationController {
        <<control>>
        +tampilkanOpsiKonsultasi(): void
        +submitKonsultan(konsultan: Konsultan): void
        +updateStatusKonsultasi(jadwal: JadwalKonsultasi): void
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class Konsultan {
        <<entity>>
        -idKonsultan: String
        -nama: String
        -spesialisasi: String
        +ambilDaftarKonsultan(): List~Konsultan~
    }
    class JadwalKonsultasi {
        <<entity>>
        -idJadwal: String
        -waktu: DateTime
        -waktuSelesai: DateTime
        -status: String
        +ambilKalender(): List~JadwalKonsultasi~
        +ambilKalender(konsultan: Konsultan): List~JadwalKonsultasi~
        +simpanJadwal(): Boolean
        +perbaruiJadwal(): Boolean
        +pesanSesi(): Boolean
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class KalenderGabungan {
        <<entity>>
        -daftarEvent: List~Event~
        +gabungkanJadwal(google: List~Event~, jadwal: List~JadwalKonsultasi~): List~Event~
        +jadwalBentrok(jadwal: JadwalKonsultasi): Boolean
        +ubahKalender(jadwal: JadwalKonsultasi): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    KalenderGabungan "1" --> "0..*" JadwalKonsultasi : menggabungkan
    Administrator "1" --> "0..*" JadwalKonsultasi : mengelola
    JadwalKonsultasi "0..*" --> "1" Konsultan : bersama
    Administrator "1" --> "1" ConsultationManagementView : mengakses
    ConsultationManagementView "1" --> "1" ConsultationController : memanggil
    ConsultationController ..> Konsultan : akses
    ConsultationController ..> JadwalKonsultasi : akses
    ConsultationController ..> Validasi : memvalidasi
    ConsultationController ..> KalenderGabungan : akses
    KalenderGabungan ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.5.4. Diagram Kelas Use Case UC-05 - Mengelola Jadwal Konsultan</i>
</p>

## 3.6 Use Case Melihat FAQ

**ID Use Case:** UC-06  
**Nama Use Case:** Melihat FAQ

### 3.6.1 Identifikasi Kelas

Tabel 3.6. Identifikasi Kelas Use Case UC-06

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1   | `Mahasiswa`            | `Mahasiswa` (C-02)          |
| 2   | `FAQView`              | -                           |
| 3   | `FAQController`        | -                           |
| 4   | `FAQ`                  | `FAQ` (C-12)                |

### 3.6.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant FAQView@{ "type": "boundary" }
    participant FAQController@{ "type": "control" }
    participant FAQ@{ "type": "entity" }

    Mahasiswa->>+FAQView: bukaFAQ()
    FAQView->>+FAQController: tampilkanFAQ()
    FAQController->>+FAQ: ambilDaftarPertanyaan()
    FAQ-->>-FAQController: daftar FAQ
    FAQController-->>-FAQView: daftar FAQ
    FAQView-->>-Mahasiswa: tampilkanFAQ(daftar)
    Mahasiswa->>+FAQView: cariFAQ(kataKunci)
    FAQView->>+FAQController: cariFAQ(kataKunci)
    FAQController->>+FAQ: cariFAQ(kataKunci)
    FAQ-->>-FAQController: hasil pencarian
    FAQController-->>-FAQView: hasil pencarian
    FAQView-->>-Mahasiswa: tampilkanFAQ(hasil)
```

<p align="center">
<i>Gambar 3.6.1. Sequence Diagram UC-06 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Tidak ada pertanyaan yang dicari pengguna**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant FAQView@{ "type": "boundary" }
    participant FAQController@{ "type": "control" }
    participant FAQ@{ "type": "entity" }

    Mahasiswa->>+FAQView: bukaFAQ()
    FAQView->>+FAQController: tampilkanFAQ()
    FAQController->>+FAQ: ambilDaftarPertanyaan()
    FAQ-->>-FAQController: daftar FAQ
    FAQController-->>-FAQView: daftar FAQ
    FAQView-->>-Mahasiswa: tampilkanFAQ(daftar)
    Mahasiswa->>+FAQView: cariFAQ(kataKunci)
    FAQView->>+FAQController: cariFAQ(kataKunci)
    FAQController->>+FAQ: cariFAQ(kataKunci)
    FAQ-->>-FAQController: hasil kosong
    FAQController-->>-FAQView: hasil kosong
    FAQView-->>-Mahasiswa: tampilkanTawaranPengajuan()
    Mahasiswa->>+FAQView: bukaFormPertanyaan()
    FAQView->>+FAQController: muatFormPenambahanPertanyaan()
    FAQController-->>-FAQView: form pertanyaan
    FAQView-->>-Mahasiswa: tampilkanFormPenambahanPertanyaan()
```

<p align="center">
<i>Gambar 3.6.2. Sequence Diagram UC-06 - Skenario Alternatif 1</i>
</p>

### 3.6.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class FAQView {
        <<boundary>>
        +bukaFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +bukaFormPertanyaan(): void
        +isiFormPertanyaan(isi: String): void
        +tampilkanFAQ(daftar: List~FAQ~): void
        +tampilkanTawaranPengajuan(): void
        +tampilkanFormPenambahanPertanyaan(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class FAQController {
        <<control>>
        +tampilkanFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +muatFormPenambahanPertanyaan(): void
        +kirimPertanyaan(isi: String): void
    }
    class FAQ {
        <<entity>>
        -idFAQ: String
        -pertanyaan: String
        -jawaban: String
        +ambilDaftarPertanyaan(): List~FAQ~
        +cariFAQ(kataKunci: String): List~FAQ~
        +tambahFAQ(pertanyaan: String, jawaban: String): Boolean
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): Boolean
        +hapusFAQ(idFAQ: String): Boolean
    }
    Mahasiswa "1" --> "0..*" FAQ : melihat
    Mahasiswa "1" --> "1" FAQView : mengakses
    FAQView "1" --> "1" FAQController : memanggil
    FAQController ..> FAQ : akses
```

<p align="center">
<i>Gambar 3.6.3. Diagram Kelas Use Case UC-06 - Melihat FAQ</i>
</p>

## 3.7 Use Case Mengelola FAQ

**ID Use Case:** UC-07  
**Nama Use Case:** Mengelola FAQ

### 3.7.1 Identifikasi Kelas

Tabel 3.7. Identifikasi Kelas Use Case UC-07

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1   | `Administrator`        | `Administrator` (C-03)      |
| 2   | `FAQView`              | -                           |
| 3   | `FAQController`        | -                           |
| 4   | `FAQ`                  | `FAQ` (C-12)                |
| 5   | `Validasi`             | -                           |
| 6   | `CloudflareD1Database` | -                           |

### 3.7.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Administrator
    participant FAQView@{ "type": "boundary" }
    participant FAQController@{ "type": "control" }
    participant FAQ@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant CloudflareD1Database@{ "type": "entity" }

    Administrator->>+FAQView: bukaFAQ()
    FAQView->>+FAQController: tampilkanFAQ()
    FAQController->>+FAQ: ambilDaftarPertanyaan()
    FAQ-->>-FAQController: daftar FAQ
    FAQController-->>-FAQView: daftar FAQ
    FAQView-->>-Administrator: tampilkanFAQ(daftar)
    Administrator->>+FAQView: tambahFAQ(pertanyaan, jawaban)
    FAQView->>+FAQController: tambahFAQ(pertanyaan, jawaban)
    FAQController->>+Validasi: validasiInput(isi)
    Validasi-->>-FAQController: valid
    FAQController->>+FAQ: tambahFAQ(pertanyaan, jawaban)
    FAQ->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-FAQ: berhasil
    FAQ-->>-FAQController: true
    FAQController-->>-FAQView: tersimpan
    FAQView-->>-Administrator: tampilkanSetelanTersimpan()
    Administrator->>+FAQView: hapusFAQ(idFAQ)
    FAQView->>+FAQController: hapusFAQ(idFAQ)
    FAQController->>+FAQ: hapusFAQ(idFAQ)
    FAQ->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-FAQ: berhasil
    FAQ-->>-FAQController: true
    FAQController-->>-FAQView: tersimpan
    FAQView-->>-Administrator: tampilkanSetelanTersimpan()
    Administrator->>+FAQView: ubahFAQ(idFAQ, pertanyaan, jawaban)
    FAQView->>+FAQController: ubahFAQ(idFAQ, pertanyaan, jawaban)
    FAQController->>+Validasi: validasiInput(isi)
    Validasi-->>-FAQController: valid
    FAQController->>+FAQ: ubahFAQ(idFAQ, pertanyaan, jawaban)
    FAQ->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-FAQ: berhasil
    FAQ-->>-FAQController: true
    FAQController-->>-FAQView: tersimpan
    FAQView-->>-Administrator: tampilkanSetelanTersimpan()
```

<p align="center">
<i>Gambar 3.7.1. Sequence Diagram UC-07 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Tidak ada pertanyaan maupun jawaban yang berhasil disimpan**

```mermaid
sequenceDiagram
    actor Administrator
    participant FAQView@{ "type": "boundary" }
    participant FAQController@{ "type": "control" }
    participant FAQ@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant CloudflareD1Database@{ "type": "entity" }

    Administrator->>+FAQView: bukaFAQ()
    FAQView->>+FAQController: tampilkanFAQ()
    FAQController->>+FAQ: ambilDaftarPertanyaan()
    FAQ-->>-FAQController: daftar FAQ
    FAQController-->>-FAQView: daftar FAQ
    FAQView-->>-Administrator: tampilkanFAQ(daftar)
    Administrator->>+FAQView: tambahFAQ(pertanyaan, jawaban)
    FAQView->>+FAQController: tambahFAQ(pertanyaan, jawaban)
    FAQController->>+Validasi: validasiInput(isi)
    Validasi-->>-FAQController: valid
    FAQController->>+FAQ: tambahFAQ(pertanyaan, jawaban)
    FAQ->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-FAQ: gagal
    FAQ-->>-FAQController: false
    FAQController-->>-FAQView: gagal menyimpan
    FAQView-->>-Administrator: showError(pesan)
    Note over Administrator,FAQView: hapusFAQ(idFAQ) dan ubahFAQ(idFAQ, pertanyaan, jawaban) gagal dengan alur yang sama
```

<p align="center">
<i>Gambar 3.7.2. Sequence Diagram UC-07 - Skenario Alternatif 1</i>
</p>

### 3.7.3 Diagram Kelas

```mermaid
classDiagram
    class Administrator {
        <<entity>>
    }
    class FAQView {
        <<boundary>>
        +bukaFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +bukaFormPertanyaan(): void
        +isiFormPertanyaan(isi: String): void
        +tampilkanFAQ(daftar: List~FAQ~): void
        +tampilkanTawaranPengajuan(): void
        +tampilkanFormPenambahanPertanyaan(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class FAQController {
        <<control>>
        +tampilkanFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +muatFormPenambahanPertanyaan(): void
        +kirimPertanyaan(isi: String): void
    }
    class FAQ {
        <<entity>>
        -idFAQ: String
        -pertanyaan: String
        -jawaban: String
        +ambilDaftarPertanyaan(): List~FAQ~
        +cariFAQ(kataKunci: String): List~FAQ~
        +tambahFAQ(pertanyaan: String, jawaban: String): Boolean
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): Boolean
        +hapusFAQ(idFAQ: String): Boolean
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Administrator "1" --> "0..*" FAQ : mengelola
    Administrator "1" --> "1" FAQView : mengakses
    FAQView "1" --> "1" FAQController : memanggil
    FAQController ..> FAQ : akses
    FAQController ..> Validasi : memvalidasi
    FAQ ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.7.3. Diagram Kelas Use Case UC-07 - Mengelola FAQ</i>
</p>

## 3.8 Use Case Memberikan Umpan Balik

**ID Use Case:** UC-08  
**Nama Use Case:** Memberikan Umpan Balik

### 3.8.1 Identifikasi Kelas

Tabel 3.8. Identifikasi Kelas Use Case UC-08

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1   | `Mahasiswa`            | `Mahasiswa` (C-02)          |
| 2   | `FeedbackView`         | -                           |
| 3   | `FeedbackController`   | -                           |
| 4   | `UmpanBalik`           | `UmpanBalik` (C-14)         |
| 5   | `Validasi`             | -                           |
| 6   | `CloudflareD1Database` | -                           |

### 3.8.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant FeedbackView@{ "type": "boundary" }
    participant FeedbackController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant UmpanBalik@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+FeedbackView: bukaUmpanBalik()
    FeedbackView->>+FeedbackController: tampilkanFormFeedback()
    FeedbackController-->>-FeedbackView: form umpan balik
    FeedbackView-->>-Mahasiswa: tampilkanFormFeedback()
    Mahasiswa->>+FeedbackView: isiFormFeedback(isi)
    FeedbackView->>+FeedbackController: kirimFeedback(isi)
    FeedbackController->>+Validasi: validasiInput(isi)
    Validasi-->>-FeedbackController: valid
    FeedbackController->>+UmpanBalik: kirimUmpanBalik(isi)
    UmpanBalik->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-UmpanBalik: berhasil
    UmpanBalik-->>-FeedbackController: true
    FeedbackController-->>-FeedbackView: tersimpan
    FeedbackView-->>-Mahasiswa: tampilkanFeedbackTersimpan()
```

<p align="center">
<i>Gambar 3.8.1. Sequence Diagram UC-08 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Umpan balik tidak disimpan pada database**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant FeedbackView@{ "type": "boundary" }
    participant FeedbackController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant UmpanBalik@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+FeedbackView: bukaUmpanBalik()
    FeedbackView->>+FeedbackController: tampilkanFormFeedback()
    FeedbackController-->>-FeedbackView: form umpan balik
    FeedbackView-->>-Mahasiswa: tampilkanFormFeedback()
    Mahasiswa->>+FeedbackView: isiFormFeedback(isi)
    FeedbackView->>+FeedbackController: kirimFeedback(isi)
    FeedbackController->>+Validasi: validasiInput(isi)
    Validasi-->>-FeedbackController: valid
    FeedbackController->>+UmpanBalik: kirimUmpanBalik(isi)
    UmpanBalik->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-UmpanBalik: gagal
    UmpanBalik-->>-FeedbackController: false
    FeedbackController-->>-FeedbackView: gagal menyimpan
    FeedbackView-->>-Mahasiswa: showError(pesan)
```

<p align="center">
<i>Gambar 3.8.2. Sequence Diagram UC-08 - Skenario Alternatif 1</i>
</p>

### 3.8.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class FeedbackView {
        <<boundary>>
        +bukaUmpanBalik(): void
        +isiFormFeedback(isi: String): void
        +bukaListFeedback(): void
        +tanggapiFeedback(tanggapan: String): void
        +tampilkanFormFeedback(): void
        +tampilkanListFeedback(daftar: List~UmpanBalik~): void
        +tampilkanFeedbackTersimpan(): void
        +showError(pesan: String): void
    }
    class FeedbackController {
        <<control>>
        +tampilkanFormFeedback(): void
        +kirimFeedback(isi: String): void
        +tampilkanListFeedback(): void
        +kirimTanggapan(tanggapan: String): void
    }
    class UmpanBalik {
        <<entity>>
        -idUmpanBalik: String
        -isi: String
        -tanggapan: String
        +ambilListUmpanBalik(): List~UmpanBalik~
        +kirimUmpanBalik(isi: String): Boolean
        +berikanTanggapan(tanggapan: String): Boolean
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Mahasiswa "1" --> "0..*" UmpanBalik : memberikan
    Mahasiswa "1" --> "1" FeedbackView : mengakses
    FeedbackView "1" --> "1" FeedbackController : memanggil
    FeedbackController ..> UmpanBalik : akses
    FeedbackController ..> Validasi : memvalidasi
    UmpanBalik ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.8.3. Diagram Kelas Use Case UC-08 - Memberikan Umpan Balik</i>
</p>

## 3.9 Use Case Menanggapi Umpan Balik

**ID Use Case:** UC-09  
**Nama Use Case:** Menanggapi Umpan Balik

### 3.9.1 Identifikasi Kelas

Tabel 3.9. Identifikasi Kelas Use Case UC-09

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1   | `Administrator`        | `Administrator` (C-03)      |
| 2   | `Mahasiswa`            | `Mahasiswa` (C-02)          |
| 3   | `FeedbackView`         | -                           |
| 4   | `FeedbackController`   | -                           |
| 5   | `UmpanBalik`           | `UmpanBalik` (C-14)         |
| 6   | `Validasi`             | -                           |
| 7   | `CloudflareD1Database` | -                           |

### 3.9.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Administrator
    participant FeedbackView@{ "type": "boundary" }
    participant FeedbackController@{ "type": "control" }
    participant UmpanBalik@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant CloudflareD1Database@{ "type": "entity" }
    actor Mahasiswa

    Administrator->>+FeedbackView: bukaListFeedback()
    FeedbackView->>+FeedbackController: tampilkanListFeedback()
    FeedbackController->>+UmpanBalik: ambilListUmpanBalik()
    UmpanBalik-->>-FeedbackController: daftar umpan balik
    FeedbackController-->>-FeedbackView: daftar umpan balik
    FeedbackView-->>-Administrator: tampilkanListFeedback(daftar)
    Administrator->>+FeedbackView: tanggapiFeedback(tanggapan)
    FeedbackView->>+FeedbackController: kirimTanggapan(tanggapan)
    FeedbackController->>+Validasi: validasiInput(isi)
    Validasi-->>-FeedbackController: valid
    FeedbackController->>+UmpanBalik: berikanTanggapan(tanggapan)
    UmpanBalik->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-UmpanBalik: berhasil
    UmpanBalik-->>-FeedbackController: true
    FeedbackController-->>-FeedbackView: tersimpan
    FeedbackView-->>-Administrator: tampilkanFeedbackTersimpan()
```

<p align="center">
<i>Gambar 3.9.1. Sequence Diagram UC-09 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Tanggapan umpan balik tidak berhasil ditampilkan**

```mermaid
sequenceDiagram
    actor Administrator
    participant FeedbackView@{ "type": "boundary" }
    participant FeedbackController@{ "type": "control" }
    participant UmpanBalik@{ "type": "entity" }
    participant Validasi@{ "type": "control" }
    participant CloudflareD1Database@{ "type": "entity" }
    actor Mahasiswa

    Administrator->>+FeedbackView: bukaListFeedback()
    FeedbackView->>+FeedbackController: tampilkanListFeedback()
    FeedbackController->>+UmpanBalik: ambilListUmpanBalik()
    UmpanBalik-->>-FeedbackController: daftar umpan balik
    FeedbackController-->>-FeedbackView: daftar umpan balik
    FeedbackView-->>-Administrator: tampilkanListFeedback(daftar)
    Administrator->>+FeedbackView: tanggapiFeedback(tanggapan)
    FeedbackView->>+FeedbackController: kirimTanggapan(tanggapan)
    FeedbackController->>+Validasi: validasiInput(isi)
    Validasi-->>-FeedbackController: valid
    FeedbackController->>+UmpanBalik: berikanTanggapan(tanggapan)
    UmpanBalik->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-UmpanBalik: berhasil
    UmpanBalik-->>-FeedbackController: true
    FeedbackController-->>-FeedbackView: tersimpan
    FeedbackView-->>-Administrator: tampilkanFeedbackTersimpan()
    Mahasiswa->>+FeedbackView: bukaListFeedback()
    FeedbackView->>+FeedbackController: tampilkanListFeedback()
    FeedbackController->>+UmpanBalik: ambilListUmpanBalik()
    UmpanBalik-->>-FeedbackController: tanggapan tidak dapat dimuat
    FeedbackController-->>-FeedbackView: tanggapan tidak dapat dimuat
    FeedbackView-->>-Mahasiswa: tampilkanListFeedback(daftar tanpa tanggapan)
```

<p align="center">
<i>Gambar 3.9.2. Sequence Diagram UC-09 - Skenario Alternatif 1</i>
</p>

### 3.9.3 Diagram Kelas

```mermaid
classDiagram
    class Administrator {
        <<entity>>
    }
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class FeedbackView {
        <<boundary>>
        +bukaUmpanBalik(): void
        +isiFormFeedback(isi: String): void
        +bukaListFeedback(): void
        +tanggapiFeedback(tanggapan: String): void
        +tampilkanFormFeedback(): void
        +tampilkanListFeedback(daftar: List~UmpanBalik~): void
        +tampilkanFeedbackTersimpan(): void
        +showError(pesan: String): void
    }
    class FeedbackController {
        <<control>>
        +tampilkanFormFeedback(): void
        +kirimFeedback(isi: String): void
        +tampilkanListFeedback(): void
        +kirimTanggapan(tanggapan: String): void
    }
    class UmpanBalik {
        <<entity>>
        -idUmpanBalik: String
        -isi: String
        -tanggapan: String
        +ambilListUmpanBalik(): List~UmpanBalik~
        +kirimUmpanBalik(isi: String): Boolean
        +berikanTanggapan(tanggapan: String): Boolean
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Mahasiswa "1" --> "0..*" UmpanBalik : memberikan
    Administrator "1" --> "0..*" UmpanBalik : menanggapi
    Mahasiswa "1" --> "1" FeedbackView : mengakses
    Administrator "1" --> "1" FeedbackView : mengakses
    FeedbackView "1" --> "1" FeedbackController : memanggil
    FeedbackController ..> UmpanBalik : akses
    FeedbackController ..> Validasi : memvalidasi
    UmpanBalik ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.9.3. Diagram Kelas Use Case UC-09 - Menanggapi Umpan Balik</i>
</p>

## 3.10 Use Case Memantau Status Server

**ID Use Case:** UC-10  
**Nama Use Case:** Memantau Status Server

### 3.10.1 Identifikasi Kelas

Tabel 3.10. Identifikasi Kelas Use Case UC-10

| No  | Nama Kelas Perancangan   | Nama Kelas Analisis Terkait |
| --- | ------------------------ | --------------------------- |
| 1   | `Administrator`          | `Administrator` (C-03)      |
| 2   | `ServerStatusView`       | -                           |
| 3   | `ServerStatusController` | -                           |
| 4   | `StatusServer`           | `StatusServer` (C-15)       |

### 3.10.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Administrator
    participant ServerStatusView@{ "type": "boundary" }
    participant ServerStatusController@{ "type": "control" }
    participant StatusServer@{ "type": "entity" }

    Administrator->>+ServerStatusView: cekStatusServer("website")
    ServerStatusView->>+ServerStatusController: tampilkanStatusServer("website")
    ServerStatusController->>+StatusServer: ambilStatusServer("website")
    StatusServer-->>-ServerStatusController: status uptime website
    ServerStatusController-->>-ServerStatusView: status uptime website
    ServerStatusView-->>-Administrator: tampilkanStatusServer(status)
    Administrator->>+ServerStatusView: cekStatusServer("server")
    ServerStatusView->>+ServerStatusController: tampilkanStatusServer("server")
    ServerStatusController->>+StatusServer: ambilStatusServer("server")
    StatusServer-->>-ServerStatusController: status uptime server
    ServerStatusController-->>-ServerStatusView: status uptime server
    ServerStatusView-->>-Administrator: tampilkanStatusServer(status)
```

<p align="center">
<i>Gambar 3.10.1. Sequence Diagram UC-10 - Skenario Normal</i>
</p>

### 3.10.3 Diagram Kelas

```mermaid
classDiagram
    class Administrator {
        <<entity>>
    }
    class ServerStatusView {
        <<boundary>>
        +cekStatusServer(jenis: String): void
        +tampilkanStatusServer(status: StatusServer): void
    }
    class ServerStatusController {
        <<control>>
        +tampilkanStatusServer(jenis: String): void
    }
    class StatusServer {
        <<entity>>
        -jenis: String
        -statusUptime: Boolean
        -waktuCek: DateTime
        +ambilStatusServer(jenis: String): StatusServer
        +cekStatusServer(): Boolean
    }
    Administrator "1" --> "0..*" StatusServer : memantau
    Administrator "1" --> "1" ServerStatusView : mengakses
    ServerStatusView "1" --> "1" ServerStatusController : memanggil
    ServerStatusController ..> StatusServer : akses
```

<p align="center">
<i>Gambar 3.10.2. Diagram Kelas Use Case UC-10 - Memantau Status Server</i>
</p>

## 3.11 Use Case Masuk Melalui Akun Google

**ID Use Case:** UC-11  
**Nama Use Case:** Masuk Melalui Akun Google

### 3.11.1 Identifikasi Kelas

Tabel 3.11. Identifikasi Kelas Use Case UC-11

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1   | `Pengguna`             | `Pengguna` (C-01)           |
| 2   | `Mahasiswa`            | `Mahasiswa` (C-02)          |
| 3   | `Administrator`        | `Administrator` (C-03)      |
| 4   | `LoginView`            | -                           |
| 5   | `AuthController`       | -                           |
| 6   | `SesiAutentikasi`      | `SesiAutentikasi` (C-04)    |
| 7   | `GoogleAuthService`    | -                           |
| 8   | `CloudflareD1Database` | -                           |
| 9   | `HomeView`             | -                           |

### 3.11.2 Sequence Diagram

Skenario normal ini dijalankan oleh algoritma Algo-001 (subbab 5.4.1) untuk login dan pendaftaran akun otomatis pada login pertama, Algo-003 (subbab 5.4.3) untuk pendaftaran perangkat notifikasi, dan Algo-030 (subbab 5.35.3) untuk penyimpanan ke basis data.

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Pengguna
    participant LoginView@{ "type": "boundary" }
    participant HomeView@{ "type": "boundary" }
    participant AuthController@{ "type": "control" }
    participant GoogleAuthService@{ "type": "entity" }
    participant SesiAutentikasi@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Pengguna->>+LoginView: masukLamanLogin()
    LoginView->>+AuthController: tampilkanLoginPage()
    AuthController-->>-LoginView: halaman login
    LoginView-->>-Pengguna: tampilkanLoginPage()
    Pengguna->>+LoginView: isiLoginPage(kodeOtorisasi)
    LoginView->>+AuthController: kirimData(kodeOtorisasi)
    AuthController->>+GoogleAuthService: validasi(kodeOtorisasi)
    GoogleAuthService-->>-AuthController: valid
    AuthController->>+SesiAutentikasi: autentikasiPengguna(kodeOtorisasi)
    opt akun belum terdaftar (login pertama)
        SesiAutentikasi->>+CloudflareD1Database: simpanPerubahan("daftar_pengguna")
        CloudflareD1Database-->>-SesiAutentikasi: akun dan NIM tersimpan
    end
    SesiAutentikasi->>+CloudflareD1Database: simpanPerubahan("buat_sesi")
    CloudflareD1Database-->>-SesiAutentikasi: berhasil
    SesiAutentikasi->>+CloudflareD1Database: simpanPerubahan("simpan_token_google")
    CloudflareD1Database-->>-SesiAutentikasi: berhasil
    SesiAutentikasi-->>-AuthController: sesi dibuat
    AuthController-->>-LoginView: login berhasil
    LoginView->>+HomeView: tampilkanBeranda(peran)
    HomeView-->>-LoginView: beranda sesuai peran
    LoginView-->>-Pengguna: loadPageUtama()
    Note over LoginView,AuthController: Setelah login, aplikasi meminta izin notifikasi dan mengambil Expo push token
    LoginView->>+LoginView: daftarkanPerangkat(tokenPush)
    LoginView->>+AuthController: daftarkanPerangkat(tokenPush)
    AuthController->>+SesiAutentikasi: daftarkanPerangkat(tokenPush)
    SesiAutentikasi->>+CloudflareD1Database: simpanPerubahan("daftar_perangkat")
    CloudflareD1Database-->>-SesiAutentikasi: berhasil
    SesiAutentikasi-->>-AuthController: true
    AuthController-->>-LoginView: perangkat terdaftar
    LoginView-->>-LoginView: token push terkirim
```

<p align="center">
<i>Gambar 3.11.1. Sequence Diagram UC-11 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: OAuth Google tidak berfungsi saat log in**

```mermaid
sequenceDiagram
    actor Pengguna
    participant LoginView@{ "type": "boundary" }
    participant AuthController@{ "type": "control" }
    participant GoogleAuthService@{ "type": "entity" }
    participant SesiAutentikasi@{ "type": "entity" }

    Pengguna->>+LoginView: masukLamanLogin()
    LoginView->>+AuthController: tampilkanLoginPage()
    AuthController-->>-LoginView: halaman login
    LoginView-->>-Pengguna: tampilkanLoginPage()
    Pengguna->>+LoginView: isiLoginPage(kodeOtorisasi)
    LoginView->>+AuthController: kirimData(kodeOtorisasi)
    AuthController->>+GoogleAuthService: validasi(kodeOtorisasi)
    GoogleAuthService-->>-AuthController: gagal
    AuthController-->>-LoginView: autentikasi gagal
    LoginView-->>-Pengguna: showError(pesan)
```

<p align="center">
<i>Gambar 3.11.2. Sequence Diagram UC-11 - Skenario Alternatif 1</i>
</p>

### 3.11.3 Diagram Kelas

```mermaid
classDiagram
    class Pengguna {
        <<abstract>>
        -id: String
        -nama: String
        -email: String
        -googleId: String
    }
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class Administrator {
        <<entity>>
    }
    class LoginView {
        <<boundary>>
        +masukLamanLogin(): void
        +isiLoginPage(kodeOtorisasi: String): void
        +tampilkanLoginPage(): void
        +loadPageUtama(): void
        +showError(pesan: String): void
        +daftarkanPerangkat(tokenPush: String): void
    }
    class HomeView {
        <<boundary>>
        -peran: String
        +tampilkanBeranda(peran: String): void
        +bukaMenu(menu: String): void
    }
    class AuthController {
        <<control>>
        +tampilkanLoginPage(): void
        +kirimData(kodeOtorisasi: String): void
        +daftarkanPerangkat(tokenPush: String): void
    }
    class SesiAutentikasi {
        <<entity>>
        -token: String
        -waktuLogin: DateTime
        -status: String
        -tokenPush: String
        +autentikasiPengguna(kodeOtorisasi: String): Boolean
        +verifikasiToken(token: String): Boolean
        +logout(): void
        +daftarkanPerangkat(tokenPush: String): Boolean
    }
    class GoogleAuthService {
        <<entity>>
        -authCode: String
        -accessToken: String
        -refreshToken: String
        +validasi(kodeOtorisasi: String): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Pengguna <|-- Mahasiswa
    Pengguna <|-- Administrator
    Pengguna "1" --> "0..*" SesiAutentikasi : memiliki
    Pengguna "1" --> "1" LoginView : mengakses
    LoginView "1" --> "1" AuthController : memanggil
    Pengguna "1" --> "1" HomeView : mengakses
    LoginView ..> HomeView : membuka
    AuthController ..> SesiAutentikasi : akses
    AuthController ..> GoogleAuthService : akses
    SesiAutentikasi ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.11.3. Diagram Kelas Use Case UC-11 - Masuk Melalui Akun Google</i>
</p>

## 3.12 Use Case Form Pengajuan Pertanyaan

**ID Use Case:** UC-12  
**Nama Use Case:** Form Pengajuan Pertanyaan

### 3.12.1 Identifikasi Kelas

Tabel 3.12. Identifikasi Kelas Use Case UC-12

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait  |
| --- | ---------------------- | ---------------------------- |
| 1   | `Mahasiswa`            | `Mahasiswa` (C-02)           |
| 2   | `FAQView`              | -                            |
| 3   | `FAQController`        | -                            |
| 4   | `Validasi`             | -                            |
| 5   | `PengajuanPertanyaan`  | `PengajuanPertanyaan` (C-13) |
| 6   | `CloudflareD1Database` | -                            |

### 3.12.2 Sequence Diagram

- **Skenario Normal**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant FAQView@{ "type": "boundary" }
    participant FAQController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant PengajuanPertanyaan@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+FAQView: bukaFormPertanyaan()
    FAQView->>+FAQController: muatFormPenambahanPertanyaan()
    FAQController-->>-FAQView: form pertanyaan
    FAQView-->>-Mahasiswa: tampilkanFormPenambahanPertanyaan()
    Mahasiswa->>+FAQView: isiFormPertanyaan(isi)
    FAQView->>+FAQController: kirimPertanyaan(isi)
    FAQController->>+Validasi: validasiInput(isi)
    Validasi-->>-FAQController: valid
    FAQController->>+PengajuanPertanyaan: ajukanPertanyaan(isi)
    PengajuanPertanyaan->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-PengajuanPertanyaan: berhasil
    PengajuanPertanyaan-->>-FAQController: true
    FAQController-->>-FAQView: tersimpan
    FAQView-->>-Mahasiswa: tampilkanSetelanTersimpan()
```

<p align="center">
<i>Gambar 3.12.1. Sequence Diagram UC-12 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Pertanyaan tidak tersimpan di database**

```mermaid
sequenceDiagram
    actor Mahasiswa
    participant FAQView@{ "type": "boundary" }
    participant FAQController@{ "type": "control" }
    participant Validasi@{ "type": "control" }
    participant PengajuanPertanyaan@{ "type": "entity" }
    participant CloudflareD1Database@{ "type": "entity" }

    Mahasiswa->>+FAQView: bukaFormPertanyaan()
    FAQView->>+FAQController: muatFormPenambahanPertanyaan()
    FAQController-->>-FAQView: form pertanyaan
    FAQView-->>-Mahasiswa: tampilkanFormPenambahanPertanyaan()
    Mahasiswa->>+FAQView: isiFormPertanyaan(isi)
    FAQView->>+FAQController: kirimPertanyaan(isi)
    FAQController->>+Validasi: validasiInput(isi)
    Validasi-->>-FAQController: valid
    FAQController->>+PengajuanPertanyaan: ajukanPertanyaan(isi)
    PengajuanPertanyaan->>+CloudflareD1Database: simpanPerubahan(data)
    CloudflareD1Database-->>-PengajuanPertanyaan: gagal
    PengajuanPertanyaan-->>-FAQController: false
    FAQController-->>-FAQView: gagal menyimpan
    FAQView-->>-Mahasiswa: showError(pesan)
```

<p align="center">
<i>Gambar 3.12.2. Sequence Diagram UC-12 - Skenario Alternatif 1</i>
</p>

### 3.12.3 Diagram Kelas

```mermaid
classDiagram
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class FAQView {
        <<boundary>>
        +bukaFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +bukaFormPertanyaan(): void
        +isiFormPertanyaan(isi: String): void
        +tampilkanFAQ(daftar: List~FAQ~): void
        +tampilkanTawaranPengajuan(): void
        +tampilkanFormPenambahanPertanyaan(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class FAQController {
        <<control>>
        +tampilkanFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +muatFormPenambahanPertanyaan(): void
        +kirimPertanyaan(isi: String): void
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class PengajuanPertanyaan {
        <<entity>>
        -idPertanyaan: String
        -isiPertanyaan: String
        +ajukanPertanyaan(isi: String): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Mahasiswa "1" --> "0..*" PengajuanPertanyaan : mengajukan
    Mahasiswa "1" --> "1" FAQView : mengakses
    FAQView "1" --> "1" FAQController : memanggil
    FAQController ..> Validasi : memvalidasi
    FAQController ..> PengajuanPertanyaan : akses
    PengajuanPertanyaan ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 3.12.3. Diagram Kelas Use Case UC-12 - Form Pengajuan Pertanyaan</i>
</p>

<br>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

```mermaid
classDiagram
    class Pengguna {
        <<abstract>>
        -id: String
        -nama: String
        -email: String
        -googleId: String
    }
    class Mahasiswa {
        <<entity>>
        -nim: String
    }
    class Administrator {
        <<entity>>
    }
    class SesiAutentikasi {
        <<entity>>
        -token: String
        -waktuLogin: DateTime
        -status: String
        -tokenPush: String
        +autentikasiPengguna(kodeOtorisasi: String): Boolean
        +verifikasiToken(token: String): Boolean
        +logout(): void
        +daftarkanPerangkat(tokenPush: String): Boolean
    }
    class DailyAffirmation {
        <<entity>>
        -konten: String
        -waktuKirim: Time
        +aturWaktuKirim(waktu: Time): Boolean
        +kirimAfirmasi(): void
        +ambilAfirmasi(): DailyAffirmation
    }
    class Reminder {
        <<entity>>
        -jenis: String
        -waktu: Time
        +aturWaktuKirim(waktu: Time): Boolean
        +kirimPengingat(): void
    }
    class Notifikasi {
        <<entity>>
        -idNotifikasi: String
        -isi: String
        -waktuKirim: DateTime
        +kirimNotifikasi(): void
        +tampilkanNotifikasi(): void
    }
    class GoogleCalendarService {
        <<entity>>
        -accessToken: String
        +ambilKalender(): List~Event~
        +cekBentrokJadwal(jadwal: JadwalKonsultasi): Boolean
    }
    class KalenderGabungan {
        <<entity>>
        -daftarEvent: List~Event~
        +gabungkanJadwal(google: List~Event~, jadwal: List~JadwalKonsultasi~): List~Event~
        +jadwalBentrok(jadwal: JadwalKonsultasi): Boolean
        +ubahKalender(jadwal: JadwalKonsultasi): Boolean
    }
    class Konsultan {
        <<entity>>
        -idKonsultan: String
        -nama: String
        -spesialisasi: String
        +ambilDaftarKonsultan(): List~Konsultan~
    }
    class JadwalKonsultasi {
        <<entity>>
        -idJadwal: String
        -waktu: DateTime
        -waktuSelesai: DateTime
        -status: String
        +ambilKalender(): List~JadwalKonsultasi~
        +ambilKalender(konsultan: Konsultan): List~JadwalKonsultasi~
        +simpanJadwal(): Boolean
        +perbaruiJadwal(): Boolean
        +pesanSesi(): Boolean
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class FAQ {
        <<entity>>
        -idFAQ: String
        -pertanyaan: String
        -jawaban: String
        +ambilDaftarPertanyaan(): List~FAQ~
        +cariFAQ(kataKunci: String): List~FAQ~
        +tambahFAQ(pertanyaan: String, jawaban: String): Boolean
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): Boolean
        +hapusFAQ(idFAQ: String): Boolean
    }
    class PengajuanPertanyaan {
        <<entity>>
        -idPertanyaan: String
        -isiPertanyaan: String
        +ajukanPertanyaan(isi: String): Boolean
    }
    class UmpanBalik {
        <<entity>>
        -idUmpanBalik: String
        -isi: String
        -tanggapan: String
        +ambilListUmpanBalik(): List~UmpanBalik~
        +kirimUmpanBalik(isi: String): Boolean
        +berikanTanggapan(tanggapan: String): Boolean
    }
    class StatusServer {
        <<entity>>
        -jenis: String
        -statusUptime: Boolean
        -waktuCek: DateTime
        +ambilStatusServer(jenis: String): StatusServer
        +cekStatusServer(): Boolean
    }
    class LoginView {
        <<boundary>>
        +masukLamanLogin(): void
        +isiLoginPage(kodeOtorisasi: String): void
        +tampilkanLoginPage(): void
        +loadPageUtama(): void
        +showError(pesan: String): void
        +daftarkanPerangkat(tokenPush: String): void
    }
    class HomeView {
        <<boundary>>
        -peran: String
        +tampilkanBeranda(peran: String): void
        +bukaMenu(menu: String): void
    }
    class AffirmationView {
        <<boundary>>
        -waktuTerpilih: Time
        +bukaPageAffirmasi(): void
        +pilihWaktuPengiriman(waktu: Time): void
        +tampilkanOpsiAffirmasi(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class ReminderView {
        <<boundary>>
        -waktuTerpilih: Time
        +bukaPageReminder(): void
        +pilihWaktuPengiriman(waktu: Time): void
        +tampilkanOpsiReminder(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class CalendarView {
        <<boundary>>
        +bukaPageCalendar(): void
        +tampilkanKalender(kalender: List~Event~): void
        +showErrorMessage(pesan: String): void
    }
    class ConsultationBookingView {
        <<boundary>>
        +bukaPageKonsultasi(): void
        +pilihKonsultan(konsultan: Konsultan): void
        +pilihSesi(jadwal: JadwalKonsultasi): void
        +tampilkanOpsiKonsultasi(daftar: List~Konsultan~): void
        +tampilkanKalender(jadwal: List~JadwalKonsultasi~): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class ConsultationManagementView {
        <<boundary>>
        +bukaPageKonsultasi(): void
        +pilihKonsultan(konsultan: Konsultan): void
        +perbaruiJadwal(jadwal: JadwalKonsultasi): void
        +tampilkanOpsiKonsultasi(daftar: List~Konsultan~): void
        +tampilkanKalender(jadwal: List~JadwalKonsultasi~): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class FAQView {
        <<boundary>>
        +bukaFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +bukaFormPertanyaan(): void
        +isiFormPertanyaan(isi: String): void
        +tampilkanFAQ(daftar: List~FAQ~): void
        +tampilkanTawaranPengajuan(): void
        +tampilkanFormPenambahanPertanyaan(): void
        +tampilkanSetelanTersimpan(): void
        +showError(pesan: String): void
    }
    class FeedbackView {
        <<boundary>>
        +bukaUmpanBalik(): void
        +isiFormFeedback(isi: String): void
        +bukaListFeedback(): void
        +tanggapiFeedback(tanggapan: String): void
        +tampilkanFormFeedback(): void
        +tampilkanListFeedback(daftar: List~UmpanBalik~): void
        +tampilkanFeedbackTersimpan(): void
        +showError(pesan: String): void
    }
    class ServerStatusView {
        <<boundary>>
        +cekStatusServer(jenis: String): void
        +tampilkanStatusServer(status: StatusServer): void
    }
    class AuthController {
        <<control>>
        +tampilkanLoginPage(): void
        +kirimData(kodeOtorisasi: String): void
        +daftarkanPerangkat(tokenPush: String): void
    }
    class AffirmationController {
        <<control>>
        +tampilkanOpsiAffirmasi(): void
        +submitWaktuPengiriman(waktu: Time): void
        +ambilAfirmasiHariIni(): DailyAffirmation
    }
    class ReminderController {
        <<control>>
        +tampilkanOpsiReminder(): void
        +submitWaktuPengiriman(waktu: Time): void
    }
    class CalendarController {
        <<control>>
        +tampilkanCalendar(): void
    }
    class ConsultationController {
        <<control>>
        +tampilkanOpsiKonsultasi(): void
        +submitKonsultan(konsultan: Konsultan): void
        +updateStatusKonsultasi(jadwal: JadwalKonsultasi): void
        +ambilSesiBerikutnya(): JadwalKonsultasi
    }
    class FAQController {
        <<control>>
        +tampilkanFAQ(): void
        +cariFAQ(kataKunci: String): void
        +tambahFAQ(pertanyaan: String, jawaban: String): void
        +ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void
        +hapusFAQ(idFAQ: String): void
        +muatFormPenambahanPertanyaan(): void
        +kirimPertanyaan(isi: String): void
    }
    class FeedbackController {
        <<control>>
        +tampilkanFormFeedback(): void
        +kirimFeedback(isi: String): void
        +tampilkanListFeedback(): void
        +kirimTanggapan(tanggapan: String): void
    }
    class ServerStatusController {
        <<control>>
        +tampilkanStatusServer(jenis: String): void
    }
    class Validasi {
        <<control>>
        +validasiWaktu(waktu: Time): Boolean
        +validasiKonsultan(konsultan: Konsultan): Boolean
        +validasiJadwal(jadwal: JadwalKonsultasi): Boolean
        +validasiInput(isi: List~String~): Boolean
    }
    class GoogleAuthService {
        <<entity>>
        -authCode: String
        -accessToken: String
        -refreshToken: String
        +validasi(kodeOtorisasi: String): Boolean
    }
    class CloudflareD1Database {
        <<entity>>
        +simpanWaktuKirim(waktu: Time): Boolean
        +simpanKalender(jadwal: JadwalKonsultasi): Boolean
        +simpanPerubahan(data: String): Boolean
    }
    Pengguna <|-- Mahasiswa
    Pengguna <|-- Administrator
    Pengguna "1" --> "0..*" SesiAutentikasi : memiliki
    Mahasiswa "1" --> "0..*" DailyAffirmation : mengatur
    Mahasiswa "1" --> "0..*" Reminder : mengatur
    DailyAffirmation ..> Notifikasi : memicu
    Reminder ..> Notifikasi : memicu
    Mahasiswa "1" --> "1" KalenderGabungan : melihat
    KalenderGabungan ..> GoogleCalendarService : memakai
    KalenderGabungan "1" --> "0..*" JadwalKonsultasi : menggabungkan
    Mahasiswa "1" --> "0..*" JadwalKonsultasi : memesan
    Administrator "1" --> "0..*" JadwalKonsultasi : mengelola
    JadwalKonsultasi "0..*" --> "1" Konsultan : bersama
    Mahasiswa "1" --> "0..*" FAQ : melihat
    Administrator "1" --> "0..*" FAQ : mengelola
    Mahasiswa "1" --> "0..*" PengajuanPertanyaan : mengajukan
    FAQ ..> PengajuanPertanyaan : menawarkan
    Mahasiswa "1" --> "0..*" UmpanBalik : memberikan
    Administrator "1" --> "0..*" UmpanBalik : menanggapi
    Administrator "1" --> "0..*" StatusServer : memantau
    Pengguna "1" --> "1" LoginView : mengakses
    Mahasiswa "1" --> "1" AffirmationView : mengakses
    Mahasiswa "1" --> "1" ReminderView : mengakses
    Mahasiswa "1" --> "1" CalendarView : mengakses
    Mahasiswa "1" --> "1" ConsultationBookingView : mengakses
    Administrator "1" --> "1" ConsultationManagementView : mengakses
    Mahasiswa "1" --> "1" FAQView : mengakses
    Administrator "1" --> "1" FAQView : mengakses
    Mahasiswa "1" --> "1" FeedbackView : mengakses
    Administrator "1" --> "1" FeedbackView : mengakses
    Administrator "1" --> "1" ServerStatusView : mengakses
    LoginView "1" --> "1" AuthController : memanggil
    Pengguna "1" --> "1" HomeView : mengakses
    LoginView ..> HomeView : membuka
    HomeView ..> AffirmationController : memanggil
    HomeView ..> ConsultationController : memanggil
    HomeView ..> ServerStatusController : memanggil
    AffirmationView "1" --> "1" AffirmationController : memanggil
    ReminderView "1" --> "1" ReminderController : memanggil
    CalendarView "1" --> "1" CalendarController : memanggil
    ConsultationBookingView "1" --> "1" ConsultationController : memanggil
    ConsultationManagementView "1" --> "1" ConsultationController : memanggil
    FAQView "1" --> "1" FAQController : memanggil
    FeedbackView "1" --> "1" FeedbackController : memanggil
    ServerStatusView "1" --> "1" ServerStatusController : memanggil
    AuthController ..> SesiAutentikasi : akses
    AuthController ..> GoogleAuthService : akses
    AffirmationController ..> DailyAffirmation : akses
    AffirmationController ..> Validasi : memvalidasi
    AffirmationController ..> Notifikasi : akses
    ReminderController ..> Reminder : akses
    ReminderController ..> Validasi : memvalidasi
    ReminderController ..> Notifikasi : akses
    CalendarController ..> GoogleCalendarService : akses
    CalendarController ..> JadwalKonsultasi : akses
    CalendarController ..> KalenderGabungan : akses
    ConsultationController ..> Konsultan : akses
    ConsultationController ..> JadwalKonsultasi : akses
    ConsultationController ..> Validasi : memvalidasi
    ConsultationController ..> KalenderGabungan : akses
    FAQController ..> FAQ : akses
    FAQController ..> Validasi : memvalidasi
    FAQController ..> PengajuanPertanyaan : akses
    FeedbackController ..> UmpanBalik : akses
    FeedbackController ..> Validasi : memvalidasi
    ServerStatusController ..> StatusServer : akses
    DailyAffirmation ..> CloudflareD1Database : disimpan di
    Reminder ..> CloudflareD1Database : disimpan di
    KalenderGabungan ..> CloudflareD1Database : disimpan di
    FAQ ..> CloudflareD1Database : disimpan di
    UmpanBalik ..> CloudflareD1Database : disimpan di
    PengajuanPertanyaan ..> CloudflareD1Database : disimpan di
    SesiAutentikasi ..> CloudflareD1Database : disimpan di
```

<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan Sehati</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas                   | Atribut                                                                     | Metode/Operasi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------- | ---------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-01     | `Pengguna`                   | `-id: String`<br>`-nama: String`<br>`-email: String`<br>`-googleId: String` | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| C-02     | `Mahasiswa`                  | `-nim: String`                                                              | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| C-03     | `Administrator`              | -                                                                           | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| C-04 | `SesiAutentikasi` | `-token: String`<br>`-waktuLogin: DateTime`<br>`-status: String`<br>`-tokenPush: String` | `+autentikasiPengguna(kodeOtorisasi: String): Boolean`<br>`+verifikasiToken(token: String): Boolean`<br>`+logout(): void`<br>`+daftarkanPerangkat(tokenPush: String): Boolean` |
| C-05 | `DailyAffirmation` | `-konten: String`<br>`-waktuKirim: Time` | `+aturWaktuKirim(waktu: Time): Boolean`<br>`+kirimAfirmasi(): void`<br>`+ambilAfirmasi(): DailyAffirmation` |
| C-06     | `Reminder`                   | `-jenis: String`<br>`-waktu: Time`                                          | `+aturWaktuKirim(waktu: Time): Boolean`<br>`+kirimPengingat(): void`                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| C-07     | `Notifikasi`                 | `-idNotifikasi: String`<br>`-isi: String`<br>`-waktuKirim: DateTime`        | `+kirimNotifikasi(): void`<br>`+tampilkanNotifikasi(): void`                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| C-08     | `GoogleCalendarService`      | `-accessToken: String`                                                      | `+ambilKalender(): List<Event>`<br>`+cekBentrokJadwal(jadwal: JadwalKonsultasi): Boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| C-09     | `KalenderGabungan`           | `-daftarEvent: List<Event>`                                                 | `+gabungkanJadwal(google: List<Event>, jadwal: List<JadwalKonsultasi>): List<Event>`<br>`+jadwalBentrok(jadwal: JadwalKonsultasi): Boolean`<br>`+ubahKalender(jadwal: JadwalKonsultasi): Boolean`                                                                                                                                                                                                                                                                                                                             |
| C-10     | `Konsultan`                  | `-idKonsultan: String`<br>`-nama: String`<br>`-spesialisasi: String`                                  | `+ambilDaftarKonsultan(): List<Konsultan>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| C-11 | `JadwalKonsultasi` | `-idJadwal: String`<br>`-waktu: DateTime`<br>`-waktuSelesai: DateTime`<br>`-status: String` | `+ambilKalender(): List<JadwalKonsultasi>`<br>`+ambilKalender(konsultan: Konsultan): List<JadwalKonsultasi>`<br>`+simpanJadwal(): Boolean`<br>`+perbaruiJadwal(): Boolean`<br>`+pesanSesi(): Boolean`<br>`+ambilSesiBerikutnya(): JadwalKonsultasi` |
| C-12     | `FAQ`                        | `-idFAQ: String`<br>`-pertanyaan: String`<br>`-jawaban: String`             | `+ambilDaftarPertanyaan(): List<FAQ>`<br>`+cariFAQ(kataKunci: String): List<FAQ>`<br>`+tambahFAQ(pertanyaan: String, jawaban: String): Boolean`<br>`+ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): Boolean`<br>`+hapusFAQ(idFAQ: String): Boolean`                                                                                                                                                                                                                                                             |
| C-13     | `PengajuanPertanyaan`        | `-idPertanyaan: String`<br>`-isiPertanyaan: String`                         | `+ajukanPertanyaan(isi: String): Boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| C-14     | `UmpanBalik`                 | `-idUmpanBalik: String`<br>`-isi: String`<br>`-tanggapan: String`           | `+ambilListUmpanBalik(): List<UmpanBalik>`<br>`+kirimUmpanBalik(isi: String): Boolean`<br>`+berikanTanggapan(tanggapan: String): Boolean`                                                                                                                                                                                                                                                                                                                                                                                     |
| C-15     | `StatusServer`               | `-jenis: String`<br>`-statusUptime: Boolean`<br>`-waktuCek: DateTime`       | `+ambilStatusServer(jenis: String): StatusServer`<br>`+cekStatusServer(): Boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| C-16 | `LoginView` | - | `+masukLamanLogin(): void`<br>`+isiLoginPage(kodeOtorisasi: String): void`<br>`+tampilkanLoginPage(): void`<br>`+loadPageUtama(): void`<br>`+showError(pesan: String): void`<br>`+daftarkanPerangkat(tokenPush: String): void` |
| C-17     | `AffirmationView`            | `-waktuTerpilih: Time`                                                      | `+bukaPageAffirmasi(): void`<br>`+pilihWaktuPengiriman(waktu: Time): void`<br>`+tampilkanOpsiAffirmasi(): void`<br>`+tampilkanSetelanTersimpan(): void`<br>`+showError(pesan: String): void`                                                                                                                                                                                                                                                                                                                                  |
| C-18     | `ReminderView`               | `-waktuTerpilih: Time`                                                      | `+bukaPageReminder(): void`<br>`+pilihWaktuPengiriman(waktu: Time): void`<br>`+tampilkanOpsiReminder(): void`<br>`+tampilkanSetelanTersimpan(): void`<br>`+showError(pesan: String): void`                                                                                                                                                                                                                                                                                                                                    |
| C-19     | `CalendarView`               | -                                                                           | `+bukaPageCalendar(): void`<br>`+tampilkanKalender(kalender: List<Event>): void`<br>`+showErrorMessage(pesan: String): void`                                                                                                                                                                                                                                                                                                                                                                                                  |
| C-20     | `ConsultationBookingView`    | -                                                                           | `+bukaPageKonsultasi(): void`<br>`+pilihKonsultan(konsultan: Konsultan): void`<br>`+pilihSesi(jadwal: JadwalKonsultasi): void`<br>`+tampilkanOpsiKonsultasi(daftar: List<Konsultan>): void`<br>`+tampilkanKalender(jadwal: List<JadwalKonsultasi>): void`<br>`+tampilkanSetelanTersimpan(): void`<br>`+showError(pesan: String): void`                                                                                                                                                                                        |
| C-21     | `ConsultationManagementView` | -                                                                           | `+bukaPageKonsultasi(): void`<br>`+pilihKonsultan(konsultan: Konsultan): void`<br>`+perbaruiJadwal(jadwal: JadwalKonsultasi): void`<br>`+tampilkanOpsiKonsultasi(daftar: List<Konsultan>): void`<br>`+tampilkanKalender(jadwal: List<JadwalKonsultasi>): void`<br>`+tampilkanSetelanTersimpan(): void`<br>`+showError(pesan: String): void`                                                                                                                                                                                   |
| C-22     | `FAQView`                    | -                                                                           | `+bukaFAQ(): void`<br>`+cariFAQ(kataKunci: String): void`<br>`+tambahFAQ(pertanyaan: String, jawaban: String): void`<br>`+ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void`<br>`+hapusFAQ(idFAQ: String): void`<br>`+bukaFormPertanyaan(): void`<br>`+isiFormPertanyaan(isi: String): void`<br>`+tampilkanFAQ(daftar: List<FAQ>): void`<br>`+tampilkanTawaranPengajuan(): void`<br>`+tampilkanFormPenambahanPertanyaan(): void`<br>`+tampilkanSetelanTersimpan(): void`<br>`+showError(pesan: String): void` |
| C-23     | `FeedbackView`               | -                                                                           | `+bukaUmpanBalik(): void`<br>`+isiFormFeedback(isi: String): void`<br>`+bukaListFeedback(): void`<br>`+tanggapiFeedback(tanggapan: String): void`<br>`+tampilkanFormFeedback(): void`<br>`+tampilkanListFeedback(daftar: List<UmpanBalik>): void`<br>`+tampilkanFeedbackTersimpan(): void`<br>`+showError(pesan: String): void`                                                                                                                                                                                               |
| C-24     | `ServerStatusView`           | -                                                                           | `+cekStatusServer(jenis: String): void`<br>`+tampilkanStatusServer(status: StatusServer): void`                                                                                                                                                                                                                                                                                                                                                                                                                               |
| C-25 | `AuthController` | - | `+tampilkanLoginPage(): void`<br>`+kirimData(kodeOtorisasi: String): void`<br>`+daftarkanPerangkat(tokenPush: String): void` |
| C-26 | `AffirmationController` | - | `+tampilkanOpsiAffirmasi(): void`<br>`+submitWaktuPengiriman(waktu: Time): void`<br>`+ambilAfirmasiHariIni(): DailyAffirmation` |
| C-27     | `ReminderController`         | -                                                                           | `+tampilkanOpsiReminder(): void`<br>`+submitWaktuPengiriman(waktu: Time): void`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| C-28     | `CalendarController`         | -                                                                           | `+tampilkanCalendar(): void`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| C-29 | `ConsultationController` | - | `+tampilkanOpsiKonsultasi(): void`<br>`+submitKonsultan(konsultan: Konsultan): void`<br>`+updateStatusKonsultasi(jadwal: JadwalKonsultasi): void`<br>`+ambilSesiBerikutnya(): JadwalKonsultasi` |
| C-30     | `FAQController`              | -                                                                           | `+tampilkanFAQ(): void`<br>`+cariFAQ(kataKunci: String): void`<br>`+tambahFAQ(pertanyaan: String, jawaban: String): void`<br>`+ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void`<br>`+hapusFAQ(idFAQ: String): void`<br>`+muatFormPenambahanPertanyaan(): void`<br>`+kirimPertanyaan(isi: String): void`                                                                                                                                                                                                     |
| C-31     | `FeedbackController`         | -                                                                           | `+tampilkanFormFeedback(): void`<br>`+kirimFeedback(isi: String): void`<br>`+tampilkanListFeedback(): void`<br>`+kirimTanggapan(tanggapan: String): void`                                                                                                                                                                                                                                                                                                                                                                     |
| C-32     | `ServerStatusController`     | -                                                                           | `+tampilkanStatusServer(jenis: String): void`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| C-33     | `Validasi`                   | -                                                                           | `+validasiWaktu(waktu: Time): Boolean`<br>`+validasiKonsultan(konsultan: Konsultan): Boolean`<br>`+validasiJadwal(jadwal: JadwalKonsultasi): Boolean`<br>`+validasiInput(isi: List<String>): Boolean`                                                                                                                                                                                                                                                                                                                         |
| C-34     | `GoogleAuthService`          | `-authCode: String`<br>`-accessToken: String`<br>`-refreshToken: String`    | `+validasi(kodeOtorisasi: String): Boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| C-35     | `CloudflareD1Database`       | -                                                                           | `+simpanWaktuKirim(waktu: Time): Boolean`<br>`+simpanKalender(jadwal: JadwalKonsultasi): Boolean`<br>`+simpanPerubahan(data: String): Boolean`                                                                                                                                                                                                                                                                                                                                                                                |
| C-36 | `HomeView` | `-peran: String` | `+tampilkanBeranda(peran: String): void`<br>`+bukaMenu(menu: String): void` |

<br>

---

# BAB 5: Perancangan Rinci Kelas

Bab ini merinci seluruh 36 kelas perancangan dari BAB 4. Tabel 5.1 memetakan setiap kelas perancangan ke kelas analisis pada SKPL. Setiap kelas kemudian dijabarkan pada subbab tersendiri berisi operasi dan atributnya, lengkap dengan _visibility_ dan tipe. Skema basis data yang mendasari penyimpanan dan kueri dijabarkan pada subbab 5.37.

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No  | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| --- | ---------------------- | --------------------------- |
| 1 | `Pengguna` | `Pengguna` (C-01) |
| 2 | `Mahasiswa` | `Mahasiswa` (C-02) |
| 3 | `Administrator` | `Administrator` (C-03) |
| 4 | `SesiAutentikasi` | `SesiAutentikasi` (C-04) |
| 5 | `DailyAffirmation` | `DailyAffirmation` (C-05) |
| 6 | `Reminder` | `Reminder` (C-06) |
| 7 | `Notifikasi` | `Notifikasi` (C-07) |
| 8 | `GoogleCalendarService` | `GoogleCalendarService` (C-08) |
| 9 | `KalenderGabungan` | `KalenderGabungan` (C-09) |
| 10 | `Konsultan` | `Konsultan` (C-10) |
| 11 | `JadwalKonsultasi` | `JadwalKonsultasi` (C-11) |
| 12 | `FAQ` | `FAQ` (C-12) |
| 13 | `PengajuanPertanyaan` | `PengajuanPertanyaan` (C-13) |
| 14 | `UmpanBalik` | `UmpanBalik` (C-14) |
| 15 | `StatusServer` | `StatusServer` (C-15) |
| 16 | `LoginView` | - |
| 17 | `AffirmationView` | - |
| 18 | `ReminderView` | - |
| 19 | `CalendarView` | - |
| 20 | `ConsultationBookingView` | - |
| 21 | `ConsultationManagementView` | - |
| 22 | `FAQView` | - |
| 23 | `FeedbackView` | - |
| 24 | `ServerStatusView` | - |
| 25 | `AuthController` | - |
| 26 | `AffirmationController` | - |
| 27 | `ReminderController` | - |
| 28 | `CalendarController` | - |
| 29 | `ConsultationController` | - |
| 30 | `FAQController` | - |
| 31 | `FeedbackController` | - |
| 32 | `ServerStatusController` | - |
| 33 | `Validasi` | - |
| 34 | `GoogleAuthService` | - |
| 35 | `CloudflareD1Database` | - |
| 36 | `HomeView` | - |

## 5.1 Kelas Pengguna

**Nama Kelas:** `Pengguna`  
**ID Kelas:** C-01

Tabel 5.1.1. Operasi Kelas Pengguna

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| - | - | - |

Tabel 5.1.2. Atribut Kelas Pengguna

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `id` | private | `String` |
| `nama` | private | `String` |
| `email` | private | `String` |
| `googleId` | private | `String` |

## 5.2 Kelas Mahasiswa

**Nama Kelas:** `Mahasiswa`  
**ID Kelas:** C-02

Tabel 5.2.1. Operasi Kelas Mahasiswa

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| - | - | - |

Tabel 5.2.2. Atribut Kelas Mahasiswa

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `nim` | private | `String` |

## 5.3 Kelas Administrator

**Nama Kelas:** `Administrator`  
**ID Kelas:** C-03

Tabel 5.3.1. Operasi Kelas Administrator

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| - | - | - |

Tabel 5.3.2. Atribut Kelas Administrator

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.4 Kelas SesiAutentikasi

**Nama Kelas:** `SesiAutentikasi`  
**ID Kelas:** C-04

Tabel 5.4.1. Operasi Kelas SesiAutentikasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `autentikasiPengguna(kodeOtorisasi: String): Boolean` | public | Membuat sesi login setelah kode otorisasi Google dinyatakan valid. Pada login pertama, akun Mahasiswa dibuat otomatis dari profil Google. Mengembalikan true bila sesi berhasil dibuat. |
| `verifikasiToken(token: String): Boolean` | public | Memeriksa bahwa token sesi aplikasi masih valid untuk permintaan berikutnya. |
| `logout(): void` | public | Mengakhiri sesi dan menghapus token sesi. |
| `daftarkanPerangkat(tokenPush: String): Boolean` | public | Menyimpan Expo push token perangkat pada sesi aktif agar server dapat mengirim notifikasi push ke perangkat tersebut. |

Tabel 5.4.2. Atribut Kelas SesiAutentikasi

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `token` | private | `String` |
| `waktuLogin` | private | `DateTime` |
| `status` | private | `String` |
| `tokenPush` | private | `String` |

### 5.4.1 Algoritma/Query

**Nama Kelas:** `SesiAutentikasi`  
**Nama Operasi:** `autentikasiPengguna(kodeOtorisasi: String): Boolean`  
**ID Algoritma:** Algo-001

```text
FUNCTION autentikasiPengguna(kodeOtorisasi)
  IF NOT GoogleAuthService.validasi(kodeOtorisasi) THEN
    RETURN false
  googleId <- googleId pada id token Google yang telah divalidasi
  pengguna <- jalankan Q-001 dengan googleId
  IF pengguna kosong THEN                 // pendaftaran otomatis pada login pertama
    profil <- nama dan email pada id token Google
    id     <- buat ID unik
    nim    <- bagian sebelum "@" pada profil.email, bila domain email termasuk DOMAIN_KAMPUS; selain itu kosong
           // DOMAIN_KAMPUS = {"std.stei.itb.ac.id", "mahasiswa.itb.ac.id"}
    CloudflareD1Database.simpanPerubahan(data)        // aksi "daftar_pengguna" dengan (id, profil.nama, profil.email, googleId, nim); lihat Algo-030
    pengguna <- jalankan Q-001 dengan googleId     // baca ulang, aman bila ada login bersamaan
  this.token       <- buat token acak 32 byte (heksadesimal)
  this.waktuLogin  <- waktu sekarang
  this.status      <- "aktif"
  CloudflareD1Database.simpanPerubahan(data)          // aksi "buat_sesi" dengan (token, pengguna.id_pengguna, waktuLogin)
  accessEnc  <- enkripsiAES256GCM(GoogleAuthService.accessToken, KUNCI_TOKEN)
  refreshEnc <- enkripsiAES256GCM(GoogleAuthService.refreshToken, KUNCI_TOKEN)   // bisa kosong
  CloudflareD1Database.simpanPerubahan(data)          // aksi "simpan_token_google" dengan (pengguna.id_pengguna, accessEnc, refreshEnc, kedaluwarsa)
  RETURN true
```

Tabel 5.4.3. Query Operasi autentikasiPengguna

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-001 | `SELECT id_pengguna, peran FROM pengguna WHERE google_id = ?` | Mencari akun terdaftar berdasarkan google_id dari Google. |

### 5.4.2 Algoritma/Query

**Nama Kelas:** `SesiAutentikasi`  
**Nama Operasi:** `verifikasiToken(token: String): Boolean`  
**ID Algoritma:** Algo-002

```text
FUNCTION verifikasiToken(token)
  sesi <- jalankan Q-002 dengan token
  IF sesi kosong ATAU sesi.status <> "aktif" THEN
    RETURN false
  IF waktu sekarang - sesi.waktu_login > BATAS_SESI THEN
    jalankan Q-003 dengan token
    RETURN false
  RETURN true
```

Tabel 5.4.4. Query Operasi verifikasiToken

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-002 | `SELECT id_pengguna, waktu_login, status FROM sesi_autentikasi WHERE token = ?` | Membaca sesi berdasarkan token. |
| Q-003 | `UPDATE sesi_autentikasi SET status = 'berakhir' WHERE token = ?` | Mengakhiri sesi. Dipakai juga oleh operasi logout(). |

### 5.4.3 Algoritma/Query

**Nama Kelas:** `SesiAutentikasi`  
**Nama Operasi:** `daftarkanPerangkat(tokenPush: String): Boolean`  
**ID Algoritma:** Algo-003

```text
FUNCTION daftarkanPerangkat(tokenPush)   // dipanggil aplikasi setelah login berhasil dan izin notifikasi diberikan
  IF tokenPush tidak cocok dengan pola ^Expo(nent)?PushToken\[.+\]$ THEN
    RETURN false
  this.tokenPush <- tokenPush
  RETURN CloudflareD1Database.simpanPerubahan(data)   // aksi "daftar_perangkat" dengan (tokenPush, this.token); lihat Algo-030
```

## 5.5 Kelas DailyAffirmation

**Nama Kelas:** `DailyAffirmation`  
**ID Kelas:** C-05

Tabel 5.5.1. Operasi Kelas DailyAffirmation

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `aturWaktuKirim(waktu: Time): Boolean` | public | Menetapkan waktu pengiriman daily affirmation dan meminta penyimpanannya ke database. Mengembalikan true bila berhasil. |
| `kirimAfirmasi(): void` | public | Mengirim konten afirmasi pada waktu yang ditetapkan dengan memicu Notifikasi. |
| `ambilAfirmasi(): DailyAffirmation` | public | Membaca konten dan waktu kirim afirmasi milik Mahasiswa (Q-041). |

Tabel 5.5.2. Atribut Kelas DailyAffirmation

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `konten` | private | `String` |
| `waktuKirim` | private | `Time` |

### 5.5.1 Algoritma/Query

**Nama Kelas:** `DailyAffirmation`  
**Nama Operasi:** `aturWaktuKirim(waktu: Time): Boolean`  
**ID Algoritma:** Algo-004

```text
FUNCTION aturWaktuKirim(waktu)       // dipanggil setelah Validasi.validasiWaktu(waktu) bernilai true
  this.waktuKirim <- waktu
  RETURN CloudflareD1Database.simpanWaktuKirim(waktu)   // lihat Algo-028
```

### 5.5.2 Algoritma/Query

**Nama Kelas:** `DailyAffirmation`  
**Nama Operasi:** `kirimAfirmasi(): void`  
**ID Algoritma:** Algo-005

```text
PROCEDURE kirimAfirmasi()            // dijalankan penjadwal (Cloudflare Cron Trigger) setiap menit
  sekarang <- waktu sekarang berformat "HH:MM" (WIB)
  daftar   <- jalankan Q-004 dengan sekarang
  FOR EACH a IN daftar
    n <- Notifikasi baru(isi = a.konten, id_mahasiswa = a.id_mahasiswa, id_affirmation = a.id_affirmation)
    n.kirimNotifikasi()
```

Tabel 5.5.3. Query Operasi kirimAfirmasi

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-004 | `SELECT id_affirmation, id_mahasiswa, konten FROM daily_affirmation WHERE waktu_kirim = ?` | Mencari afirmasi yang jatuh tempo pada menit ini. |

## 5.6 Kelas Reminder

**Nama Kelas:** `Reminder`  
**ID Kelas:** C-06

Tabel 5.6.1. Operasi Kelas Reminder

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `aturWaktuKirim(waktu: Time): Boolean` | public | Menetapkan waktu pengingat dan meminta penyimpanannya ke database. Mengembalikan true bila berhasil. |
| `kirimPengingat(): void` | public | Mengirim pengingat sesuai jenis (makan, tidur, olahraga) pada waktu yang ditetapkan. |

Tabel 5.6.2. Atribut Kelas Reminder

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `jenis` | private | `String` |
| `waktu` | private | `Time` |

### 5.6.1 Algoritma/Query

**Nama Kelas:** `Reminder`  
**Nama Operasi:** `aturWaktuKirim(waktu: Time): Boolean`  
**ID Algoritma:** Algo-006

```text
FUNCTION aturWaktuKirim(waktu)       // dipanggil setelah Validasi.validasiWaktu(waktu) bernilai true
  this.waktu <- waktu
  RETURN CloudflareD1Database.simpanWaktuKirim(waktu)   // lihat Algo-028
```

### 5.6.2 Algoritma/Query

**Nama Kelas:** `Reminder`  
**Nama Operasi:** `kirimPengingat(): void`  
**ID Algoritma:** Algo-007

```text
PROCEDURE kirimPengingat()           // dijalankan penjadwal (Cloudflare Cron Trigger) setiap menit
  sekarang <- waktu sekarang berformat "HH:MM" (WIB)
  daftar   <- jalankan Q-005 dengan sekarang
  FOR EACH r IN daftar
    n <- Notifikasi baru(isi = teksPengingat(r.jenis), id_mahasiswa = r.id_mahasiswa, id_reminder = r.id_reminder)
    n.kirimNotifikasi()
```

Tabel 5.6.3. Query Operasi kirimPengingat

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-005 | `SELECT id_reminder, id_mahasiswa, jenis FROM reminder WHERE waktu = ?` | Mencari pengingat yang jatuh tempo pada menit ini. |

## 5.7 Kelas Notifikasi

**Nama Kelas:** `Notifikasi`  
**ID Kelas:** C-07

Tabel 5.7.1. Operasi Kelas Notifikasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `kirimNotifikasi(): void` | public | Mengirim satu notifikasi ke pengguna, dipicu oleh DailyAffirmation atau Reminder. |
| `tampilkanNotifikasi(): void` | public | Menampilkan notifikasi pada aplikasi di mana pun pengguna berada. |

Tabel 5.7.2. Atribut Kelas Notifikasi

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `idNotifikasi` | private | `String` |
| `isi` | private | `String` |
| `waktuKirim` | private | `DateTime` |

### 5.7.1 Algoritma/Query

**Nama Kelas:** `Notifikasi`  
**Nama Operasi:** `kirimNotifikasi(): void`  
**ID Algoritma:** Algo-008

```text
PROCEDURE kirimNotifikasi()
  this.idNotifikasi <- buat ID unik
  this.waktuKirim   <- waktu sekarang
  jalankan Q-006 dengan (idNotifikasi, id_mahasiswa, id_affirmation, id_reminder, isi, waktuKirim)
  daftar <- jalankan Q-007 dengan id_mahasiswa
  IF daftar kosong THEN
    RETURN                                // notifikasi tetap tercatat, tetapi belum ada perangkat terdaftar
  pesan <- untuk setiap token t pada daftar: {to: t, title: "Sehati", body: isi, sound: "default"}
  respons <- POST https://exp.host/--/api/v2/push/send dengan pesan (JSON, maksimal 100 pesan per permintaan)
  FOR EACH tiket, p IN respons.data BERSAMA pesan             // urutan tiket sama dengan urutan pesan
    IF tiket.status = "error" DAN tiket.details.error = "DeviceNotRegistered" THEN
      jalankan Q-008 dengan p.to
```

Tabel 5.7.3. Query Operasi kirimNotifikasi

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-006 | `INSERT INTO notifikasi (id_notifikasi, id_mahasiswa, id_affirmation, id_reminder, isi, waktu_kirim) VALUES (?, ?, ?, ?, ?, ?)` | Mencatat notifikasi. Tepat satu dari id_affirmation atau id_reminder berisi nilai, yang lain NULL. |
| Q-007 | `SELECT DISTINCT token_push FROM sesi_autentikasi WHERE id_pengguna = ? AND status = 'aktif' AND token_push IS NOT NULL` | Mengambil Expo push token dari seluruh sesi aktif milik penerima. |
| Q-008 | `UPDATE sesi_autentikasi SET token_push = NULL WHERE token_push = ?` | Mengosongkan token yang ditolak Expo (DeviceNotRegistered). |

## 5.8 Kelas GoogleCalendarService

**Nama Kelas:** `GoogleCalendarService`  
**ID Kelas:** C-08

Tabel 5.8.1. Operasi Kelas GoogleCalendarService

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ambilKalender(): List<Event>` | public | Mengambil event pengguna dari Google Calendar API memakai access token. |
| `cekBentrokJadwal(jadwal: JadwalKonsultasi): Boolean` | public | Memeriksa informasi free/busy pengguna. Mengembalikan true bila jadwal yang dipilih bentrok dengan event di kalender. |

Tabel 5.8.2. Atribut Kelas GoogleCalendarService

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `accessToken` | private | `String` |

### 5.8.1 Algoritma/Query

**Nama Kelas:** `GoogleCalendarService`  
**Nama Operasi:** `ambilKalender(): List<Event>`  
**ID Algoritma:** Algo-009

```text
FUNCTION ambilKalender()
  accessToken <- ambilTokenValid()
  respons <- GET https://www.googleapis.com/calendar/v3/calendars/primary/events
             (header Authorization: Bearer accessToken, parameter timeMin, timeMax, singleEvents=true)
  IF respons.status <> 200 THEN
    lempar kesalahan "gagal mengambil event"
  RETURN respons.items

FUNCTION ambilTokenValid()            // fungsi bantu
  baris <- jalankan Q-009 dengan id pengguna
  access <- dekripsiAES256GCM(baris.access_token, KUNCI_TOKEN)
  IF waktu sekarang < baris.kedaluwarsa THEN
    RETURN access
  refresh <- dekripsiAES256GCM(baris.refresh_token, KUNCI_TOKEN)
  baru <- POST https://oauth2.googleapis.com/token (grant_type=refresh_token, refresh_token=refresh)
  jalankan Q-010 dengan (enkripsiAES256GCM(baru.access_token, KUNCI_TOKEN), baru.kedaluwarsa, id pengguna)
  RETURN baru.access_token
```

Tabel 5.8.3. Query Operasi ambilKalender

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-009 | `SELECT access_token, refresh_token, kedaluwarsa FROM token_google WHERE id_pengguna = ?` | Membaca token Google pengguna (terenkripsi). |
| Q-010 | `UPDATE token_google SET access_token = ?, kedaluwarsa = ? WHERE id_pengguna = ?` | Menyimpan access token baru (terenkripsi) setelah diperbarui. |

### 5.8.2 Algoritma/Query

**Nama Kelas:** `GoogleCalendarService`  
**Nama Operasi:** `cekBentrokJadwal(jadwal: JadwalKonsultasi): Boolean`  
**ID Algoritma:** Algo-010

```text
FUNCTION cekBentrokJadwal(jadwal)
  accessToken <- ambilTokenValid()      // lihat Algo-009
  respons <- POST https://www.googleapis.com/calendar/v3/freeBusy
             (timeMin = jadwal.waktu, timeMax = jadwal.waktuSelesai, items = [{id: "primary"}])
  IF respons.status <> 200 THEN
    lempar kesalahan "gagal memeriksa kalender"
  RETURN panjang(respons.calendars.primary.busy) > 0
```

## 5.9 Kelas KalenderGabungan

**Nama Kelas:** `KalenderGabungan`  
**ID Kelas:** C-09

Tabel 5.9.1. Operasi Kelas KalenderGabungan

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `gabungkanJadwal(google: List<Event>, jadwal: List<JadwalKonsultasi>): List<Event>` | public | Menggabungkan event Google Calendar dan jadwal konsultasi menjadi satu daftar event untuk satu tampilan kalender. |
| `jadwalBentrok(jadwal: JadwalKonsultasi): Boolean` | public | Memeriksa bentrok jadwal yang dipilih lewat GoogleCalendarService. Mengembalikan true bila bentrok. |
| `ubahKalender(jadwal: JadwalKonsultasi): Boolean` | public | Memperbarui kalender dengan jadwal konsultasi dan menyimpannya ke database. Mengembalikan true bila berhasil. |

Tabel 5.9.2. Atribut Kelas KalenderGabungan

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `daftarEvent` | private | `List<Event>` |

### 5.9.1 Algoritma/Query

**Nama Kelas:** `KalenderGabungan`  
**Nama Operasi:** `gabungkanJadwal(google: List<Event>, jadwal: List<JadwalKonsultasi>): List<Event>`  
**ID Algoritma:** Algo-011

```text
FUNCTION gabungkanJadwal(google, jadwal)
  hasil <- daftar kosong
  FOR EACH e IN google
    tambahkan {judul: e.summary, mulai: e.start, selesai: e.end, sumber: "google"} ke hasil
  FOR EACH j IN jadwal
    tambahkan {judul: "Sesi konsultasi", mulai: j.waktu, selesai: j.waktuSelesai, sumber: j.status} ke hasil
  urutkan hasil menurut mulai, naik
  this.daftarEvent <- hasil
  RETURN hasil
```

### 5.9.2 Algoritma/Query

**Nama Kelas:** `KalenderGabungan`  
**Nama Operasi:** `jadwalBentrok(jadwal: JadwalKonsultasi): Boolean`  
**ID Algoritma:** Algo-012

```text
FUNCTION jadwalBentrok(jadwal)
  IF GoogleCalendarService.cekBentrokJadwal(jadwal) THEN
    RETURN true                         // bentrok dengan event Google Calendar
  baris <- jalankan Q-011 dengan (id Mahasiswa, jadwal.waktuSelesai, jadwal.waktu)
  RETURN baris tidak kosong             // bentrok dengan sesi lain yang sudah dipesan
```

Tabel 5.9.3. Query Operasi jadwalBentrok

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-011 | `SELECT 1 FROM jadwal_konsultasi WHERE id_mahasiswa = ? AND status = 'terpesan' AND waktu < ? AND waktu_selesai > ? LIMIT 1` | Memeriksa apakah Mahasiswa sudah memesan sesi lain yang waktunya tumpang tindih (waktu < selesai baru DAN selesai > mulai baru). |

### 5.9.3 Algoritma/Query

**Nama Kelas:** `KalenderGabungan`  
**Nama Operasi:** `ubahKalender(jadwal: JadwalKonsultasi): Boolean`  
**ID Algoritma:** Algo-013

```text
FUNCTION ubahKalender(jadwal)
  ok <- CloudflareD1Database.simpanKalender(jadwal)   // lihat Algo-029
  IF ok THEN
    muat ulang this.daftarEvent
  RETURN ok
```

## 5.10 Kelas Konsultan

**Nama Kelas:** `Konsultan`  
**ID Kelas:** C-10

Tabel 5.10.1. Operasi Kelas Konsultan

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ambilDaftarKonsultan(): List<Konsultan>` | public | Mengambil daftar konsultan yang terdaftar. |

Tabel 5.10.2. Atribut Kelas Konsultan

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `idKonsultan` | private | `String` |
| `nama` | private | `String` |
| `spesialisasi` | private | `String` |

### 5.10.1 Algoritma/Query

**Nama Kelas:** `Konsultan`  
**Nama Operasi:** `ambilDaftarKonsultan(): List<Konsultan>`  
**ID Algoritma:** Algo-014

```text
FUNCTION ambilDaftarKonsultan()
  RETURN jalankan Q-012
```

Tabel 5.10.3. Query Operasi ambilDaftarKonsultan

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-012 | `SELECT id_konsultan, nama, spesialisasi FROM konsultan ORDER BY nama` | Mengambil seluruh konsultan terdaftar. |

## 5.11 Kelas JadwalKonsultasi

**Nama Kelas:** `JadwalKonsultasi`  
**ID Kelas:** C-11

Tabel 5.11.1. Operasi Kelas JadwalKonsultasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ambilKalender(): List<JadwalKonsultasi>` | public | Mengambil seluruh jadwal konsultasi dari database. |
| `ambilKalender(konsultan: Konsultan): List<JadwalKonsultasi>` | public | Mengambil jadwal konsultasi milik satu konsultan dari database. |
| `simpanJadwal(): Boolean` | public | Menyimpan slot jadwal konsultasi baru. Mengembalikan true bila berhasil. |
| `perbaruiJadwal(): Boolean` | public | Memperbarui data slot jadwal konsultasi. Mengembalikan true bila berhasil. |
| `pesanSesi(): Boolean` | public | Menandai slot jadwal sebagai terpesan. Mengembalikan true bila berhasil. |
| `ambilSesiBerikutnya(): JadwalKonsultasi` | public | Membaca sesi berstatus terpesan milik Mahasiswa yang paling dekat waktunya, beserta konsultannya (Q-042). Mengembalikan kosong bila tidak ada. |

Tabel 5.11.2. Atribut Kelas JadwalKonsultasi

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `idJadwal` | private | `String` |
| `waktu` | private | `DateTime` |
| `waktuSelesai` | private | `DateTime` |
| `status` | private | `String` |

### 5.11.1 Algoritma/Query

**Nama Kelas:** `JadwalKonsultasi`  
**Nama Operasi:** `ambilKalender(): List<JadwalKonsultasi> dan ambilKalender(konsultan: Konsultan): List<JadwalKonsultasi>`  
**ID Algoritma:** Algo-015

```text
FUNCTION ambilKalender()
  RETURN jalankan Q-013

FUNCTION ambilKalender(konsultan)
  RETURN jalankan Q-014 dengan (konsultan.idKonsultan, waktu sekarang)
```

Tabel 5.11.3. Query Operasi ambilKalender

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-013 | `SELECT id_jadwal, id_konsultan, waktu, waktu_selesai, status FROM jadwal_konsultasi ORDER BY waktu` | Mengambil seluruh jadwal konsultasi (untuk kalender gabungan). |
| Q-014 | `SELECT id_jadwal, waktu, waktu_selesai, status FROM jadwal_konsultasi WHERE id_konsultan = ? AND waktu >= ? ORDER BY waktu` | Mengambil slot mendatang milik satu konsultan. |

### 5.11.2 Algoritma/Query

**Nama Kelas:** `JadwalKonsultasi`  
**Nama Operasi:** `pesanSesi(): Boolean`  
**ID Algoritma:** Algo-016

```text
FUNCTION pesanSesi()                  // dipanggil setelah KalenderGabungan.ubahKalender(jadwal) bernilai true
  IF this.status <> "tersedia" THEN
    RETURN false
  this.status <- "terpesan"             // penyimpanan sudah dilakukan oleh Algo-029
  RETURN true
```

## 5.12 Kelas FAQ

**Nama Kelas:** `FAQ`  
**ID Kelas:** C-12

Tabel 5.12.1. Operasi Kelas FAQ

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ambilDaftarPertanyaan(): List<FAQ>` | public | Mengambil seluruh pasangan pertanyaan dan jawaban FAQ. |
| `cariFAQ(kataKunci: String): List<FAQ>` | public | Mencari FAQ berdasarkan kata kunci. Mengembalikan daftar kosong bila tidak ada yang cocok. |
| `tambahFAQ(pertanyaan: String, jawaban: String): Boolean` | public | Menambahkan pasangan pertanyaan dan jawaban baru ke database. Mengembalikan true bila berhasil. |
| `ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): Boolean` | public | Mengubah pertanyaan dan/atau jawaban suatu FAQ di database. Mengembalikan true bila berhasil. |
| `hapusFAQ(idFAQ: String): Boolean` | public | Menghapus suatu FAQ beserta jawabannya dari database. Mengembalikan true bila berhasil. |

Tabel 5.12.2. Atribut Kelas FAQ

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `idFAQ` | private | `String` |
| `pertanyaan` | private | `String` |
| `jawaban` | private | `String` |

### 5.12.1 Algoritma/Query

**Nama Kelas:** `FAQ`  
**Nama Operasi:** `cariFAQ(kataKunci: String): List<FAQ>`  
**ID Algoritma:** Algo-017

```text
FUNCTION cariFAQ(kataKunci)
  pola <- "%" + escape(kataKunci, '!') + "%"   // % dan _ pada kataKunci di-escape dengan '!'
  RETURN jalankan Q-015 dengan (pola, pola)      // daftar kosong bila tidak ada yang cocok
```

Tabel 5.12.3. Query Operasi cariFAQ

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-015 | `SELECT id_faq, pertanyaan, jawaban FROM faq WHERE pertanyaan LIKE ? ESCAPE '!' OR jawaban LIKE ? ESCAPE '!' ORDER BY pertanyaan` | Mencari FAQ yang pertanyaan atau jawabannya memuat kata kunci. |

## 5.13 Kelas PengajuanPertanyaan

**Nama Kelas:** `PengajuanPertanyaan`  
**ID Kelas:** C-13

Tabel 5.13.1. Operasi Kelas PengajuanPertanyaan

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ajukanPertanyaan(isi: String): Boolean` | public | Menyimpan pertanyaan pengguna di luar FAQ ke database. Mengembalikan true bila berhasil. |

Tabel 5.13.2. Atribut Kelas PengajuanPertanyaan

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `idPertanyaan` | private | `String` |
| `isiPertanyaan` | private | `String` |

## 5.14 Kelas UmpanBalik

**Nama Kelas:** `UmpanBalik`  
**ID Kelas:** C-14

Tabel 5.14.1. Operasi Kelas UmpanBalik

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ambilListUmpanBalik(): List<UmpanBalik>` | public | Mengambil daftar umpan balik beserta tanggapannya. |
| `kirimUmpanBalik(isi: String): Boolean` | public | Menyimpan umpan balik dari Mahasiswa ke database. Mengembalikan true bila berhasil. |
| `berikanTanggapan(tanggapan: String): Boolean` | public | Menyimpan tanggapan Administrator pada suatu umpan balik. Mengembalikan true bila berhasil. |

Tabel 5.14.2. Atribut Kelas UmpanBalik

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `idUmpanBalik` | private | `String` |
| `isi` | private | `String` |
| `tanggapan` | private | `String` |

### 5.14.1 Algoritma/Query

**Nama Kelas:** `UmpanBalik`  
**Nama Operasi:** `ambilListUmpanBalik(): List<UmpanBalik>`  
**ID Algoritma:** Algo-018

```text
FUNCTION ambilListUmpanBalik()
  RETURN jalankan Q-016
```

Tabel 5.14.3. Query Operasi ambilListUmpanBalik

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-016 | `SELECT u.id_umpan_balik, p.nama AS nama_mahasiswa, u.isi, u.tanggapan FROM umpan_balik u JOIN pengguna p ON p.id_pengguna = u.id_mahasiswa ORDER BY u.rowid DESC` | Mengambil seluruh umpan balik terbaru lebih dulu, beserta nama pengirim dan tanggapan (NULL bila belum ditanggapi). |

### 5.14.2 Algoritma/Query

**Nama Kelas:** `UmpanBalik`  
**Nama Operasi:** `berikanTanggapan(tanggapan: String): Boolean`  
**ID Algoritma:** Algo-019

```text
FUNCTION berikanTanggapan(tanggapan)  // dipanggil setelah Validasi.validasiInput bernilai true
  this.tanggapan <- tanggapan
  RETURN CloudflareD1Database.simpanPerubahan(data)   // data = {aksi: "tanggapi_umpan_balik", ...}, lihat Algo-030
```

## 5.15 Kelas StatusServer

**Nama Kelas:** `StatusServer`  
**ID Kelas:** C-15

Tabel 5.15.1. Operasi Kelas StatusServer

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `ambilStatusServer(jenis: String): StatusServer` | public | Mengambil status uptime untuk jenis yang diminta ("website" atau "server"). |
| `cekStatusServer(): Boolean` | public | Memeriksa apakah layanan up atau down, lalu memperbarui statusUptime dan waktuCek. |

Tabel 5.15.2. Atribut Kelas StatusServer

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `jenis` | private | `String` |
| `statusUptime` | private | `Boolean` |
| `waktuCek` | private | `DateTime` |

### 5.15.1 Algoritma/Query

**Nama Kelas:** `StatusServer`  
**Nama Operasi:** `ambilStatusServer(jenis: String): StatusServer`  
**ID Algoritma:** Algo-020

```text
FUNCTION ambilStatusServer(jenis)    // jenis: "website" atau "server"
  baris <- jalankan Q-017 dengan jenis
  RETURN StatusServer(jenis, baris.status_uptime = 1, baris.waktu_cek)
```

Tabel 5.15.3. Query Operasi ambilStatusServer

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-017 | `SELECT jenis, status_uptime, waktu_cek FROM status_server WHERE jenis = ? ORDER BY waktu_cek DESC LIMIT 1` | Mengambil hasil pemeriksaan terakhir untuk jenis tertentu. |

### 5.15.2 Algoritma/Query

**Nama Kelas:** `StatusServer`  
**Nama Operasi:** `cekStatusServer(): Boolean`  
**ID Algoritma:** Algo-021

```text
FUNCTION cekStatusServer()           // dijalankan penjadwal secara berkala
  respons <- HTTP GET ke alamat sesuai this.jenis, batas waktu 5 detik
  this.statusUptime <- (respons ada DAN respons.status antara 200 dan 299)
  this.waktuCek     <- waktu sekarang
  jalankan Q-018 dengan (jenis, statusUptime, waktuCek)
  RETURN this.statusUptime
```

Tabel 5.15.4. Query Operasi cekStatusServer

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-018 | `INSERT INTO status_server (jenis, status_uptime, waktu_cek) VALUES (?, ?, ?)` | Mencatat hasil satu pemeriksaan status. |

## 5.16 Kelas LoginView

**Nama Kelas:** `LoginView`  
**ID Kelas:** C-16

Tabel 5.16.1. Operasi Kelas LoginView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `masukLamanLogin(): void` | public | Aksi pengguna membuka laman masuk. |
| `isiLoginPage(kodeOtorisasi: String): void` | public | Menerima hasil autentikasi Google dari pengguna dan meneruskannya ke AuthController. |
| `tampilkanLoginPage(): void` | public | Menampilkan laman masuk dengan tombol masuk akun Google. |
| `loadPageUtama(): void` | public | Membuka beranda (`HomeView`) sesuai peran pengguna setelah login berhasil. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika login gagal. |
| `daftarkanPerangkat(tokenPush: String): void` | public | Meminta izin notifikasi, mengambil Expo push token perangkat, lalu mengirimkannya ke AuthController setelah login berhasil. |

Tabel 5.16.2. Atribut Kelas LoginView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.17 Kelas AffirmationView

**Nama Kelas:** `AffirmationView`  
**ID Kelas:** C-17

Tabel 5.17.1. Operasi Kelas AffirmationView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaPageAffirmasi(): void` | public | Aksi pengguna membuka halaman pengaturan daily affirmations dan meminta opsi waktu dari controller. |
| `pilihWaktuPengiriman(waktu: Time): void` | public | Menerima waktu pengiriman yang dipilih pengguna dan mengirimkannya ke controller. |
| `tampilkanOpsiAffirmasi(): void` | public | Menampilkan opsi waktu pengiriman daily affirmations. |
| `tampilkanSetelanTersimpan(): void` | public | Menampilkan konfirmasi bahwa setelan tersimpan. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika setelan gagal disimpan. |

Tabel 5.17.2. Atribut Kelas AffirmationView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `waktuTerpilih` | private | `Time` |

## 5.18 Kelas ReminderView

**Nama Kelas:** `ReminderView`  
**ID Kelas:** C-18

Tabel 5.18.1. Operasi Kelas ReminderView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaPageReminder(): void` | public | Aksi pengguna membuka halaman pengaturan pengingat dan meminta opsi waktu dari controller. |
| `pilihWaktuPengiriman(waktu: Time): void` | public | Menerima waktu pengingat yang dipilih pengguna dan mengirimkannya ke controller. |
| `tampilkanOpsiReminder(): void` | public | Menampilkan opsi waktu pengingat makan, tidur, dan olahraga. |
| `tampilkanSetelanTersimpan(): void` | public | Menampilkan konfirmasi bahwa setelan tersimpan. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika setelan gagal disimpan. |

Tabel 5.18.2. Atribut Kelas ReminderView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `waktuTerpilih` | private | `Time` |

## 5.19 Kelas CalendarView

**Nama Kelas:** `CalendarView`  
**ID Kelas:** C-19

Tabel 5.19.1. Operasi Kelas CalendarView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaPageCalendar(): void` | public | Aksi pengguna membuka kalender dan meminta kalender gabungan dari controller. |
| `tampilkanKalender(kalender: List<Event>): void` | public | Menampilkan kalender gabungan berisi event Google Calendar dan jadwal konsultasi. |
| `showErrorMessage(pesan: String): void` | public | Menampilkan pesan kesalahan dan tombol Refresh ketika data event gagal diambil. |

Tabel 5.19.2. Atribut Kelas CalendarView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.20 Kelas ConsultationBookingView

**Nama Kelas:** `ConsultationBookingView`  
**ID Kelas:** C-20

Tabel 5.20.1. Operasi Kelas ConsultationBookingView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaPageKonsultasi(): void` | public | Aksi Mahasiswa membuka halaman pemesanan dan meminta daftar konsultan dari controller. |
| `pilihKonsultan(konsultan: Konsultan): void` | public | Menerima konsultan yang dipilih dan mengirimkannya ke controller. |
| `pilihSesi(jadwal: JadwalKonsultasi): void` | public | Menerima slot jadwal yang dipilih dan meminta controller memperbarui status konsultasi. |
| `tampilkanOpsiKonsultasi(daftar: List<Konsultan>): void` | public | Menampilkan daftar konsultan yang dapat dipilih. |
| `tampilkanKalender(jadwal: List<JadwalKonsultasi>): void` | public | Menampilkan jadwal konsultasi yang tersedia untuk konsultan terpilih. |
| `tampilkanSetelanTersimpan(): void` | public | Menampilkan konfirmasi bahwa sesi berhasil dipesan. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika data gagal diambil atau pesanan gagal disimpan. |

Tabel 5.20.2. Atribut Kelas ConsultationBookingView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.21 Kelas ConsultationManagementView

**Nama Kelas:** `ConsultationManagementView`  
**ID Kelas:** C-21

Tabel 5.21.1. Operasi Kelas ConsultationManagementView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaPageKonsultasi(): void` | public | Aksi Administrator membuka dashboard jadwal konsultasi dan meminta daftar konsultan dari controller. |
| `pilihKonsultan(konsultan: Konsultan): void` | public | Menerima konsultan yang dipilih dan mengirimkannya ke controller. |
| `perbaruiJadwal(jadwal: JadwalKonsultasi): void` | public | Menerima perubahan jadwal dari Administrator dan mengirimkannya ke controller. |
| `tampilkanOpsiKonsultasi(daftar: List<Konsultan>): void` | public | Menampilkan daftar konsultan yang dapat dipilih. |
| `tampilkanKalender(jadwal: List<JadwalKonsultasi>): void` | public | Menampilkan jadwal konsultasi konsultan terpilih. |
| `tampilkanSetelanTersimpan(): void` | public | Menampilkan konfirmasi bahwa perubahan jadwal tersimpan. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika data gagal diambil atau perubahan gagal disimpan. |

Tabel 5.21.2. Atribut Kelas ConsultationManagementView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.22 Kelas FAQView

**Nama Kelas:** `FAQView`  
**ID Kelas:** C-22

Tabel 5.22.1. Operasi Kelas FAQView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaFAQ(): void` | public | Aksi pengguna membuka halaman FAQ dan meminta daftar FAQ dari controller. |
| `cariFAQ(kataKunci: String): void` | public | Menerima kata kunci pencarian dan mengirimkannya ke controller. |
| `tambahFAQ(pertanyaan: String, jawaban: String): void` | public | Menerima pertanyaan dan jawaban baru dari Administrator dan mengirimkannya ke controller. |
| `ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void` | public | Menerima perubahan pertanyaan atau jawaban dari Administrator dan mengirimkannya ke controller. |
| `hapusFAQ(idFAQ: String): void` | public | Menerima permintaan Administrator menghapus suatu FAQ dan mengirimkannya ke controller. |
| `bukaFormPertanyaan(): void` | public | Aksi Mahasiswa membuka form pengajuan pertanyaan di luar FAQ. |
| `isiFormPertanyaan(isi: String): void` | public | Menerima isi pertanyaan yang diajukan Mahasiswa dan mengirimkannya ke controller. |
| `tampilkanFAQ(daftar: List<FAQ>): void` | public | Menampilkan daftar FAQ atau hasil pencarian. |
| `tampilkanTawaranPengajuan(): void` | public | Menampilkan tawaran mengajukan pertanyaan ketika pencarian tidak menemukan hasil. |
| `tampilkanFormPenambahanPertanyaan(): void` | public | Menampilkan form pengajuan pertanyaan. |
| `tampilkanSetelanTersimpan(): void` | public | Menampilkan konfirmasi bahwa perubahan atau pertanyaan tersimpan. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika data gagal disimpan. |

Tabel 5.22.2. Atribut Kelas FAQView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.23 Kelas FeedbackView

**Nama Kelas:** `FeedbackView`  
**ID Kelas:** C-23

Tabel 5.23.1. Operasi Kelas FeedbackView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `bukaUmpanBalik(): void` | public | Aksi Mahasiswa membuka form umpan balik dan meminta form dari controller. |
| `isiFormFeedback(isi: String): void` | public | Menerima isi umpan balik dari Mahasiswa dan mengirimkannya ke controller. |
| `bukaListFeedback(): void` | public | Aksi pengguna membuka daftar umpan balik dan meminta daftarnya dari controller. |
| `tanggapiFeedback(tanggapan: String): void` | public | Menerima tanggapan Administrator dan mengirimkannya ke controller. |
| `tampilkanFormFeedback(): void` | public | Menampilkan form umpan balik. |
| `tampilkanListFeedback(daftar: List<UmpanBalik>): void` | public | Menampilkan daftar umpan balik beserta tanggapannya. |
| `tampilkanFeedbackTersimpan(): void` | public | Menampilkan konfirmasi bahwa umpan balik atau tanggapan tersimpan. |
| `showError(pesan: String): void` | public | Menampilkan pesan kesalahan ketika data gagal disimpan. |

Tabel 5.23.2. Atribut Kelas FeedbackView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.24 Kelas ServerStatusView

**Nama Kelas:** `ServerStatusView`  
**ID Kelas:** C-24

Tabel 5.24.1. Operasi Kelas ServerStatusView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `cekStatusServer(jenis: String): void` | public | Aksi Administrator meminta status uptime untuk jenis tertentu ("website" atau "server"). |
| `tampilkanStatusServer(status: StatusServer): void` | public | Menampilkan status uptime kepada Administrator. |

Tabel 5.24.2. Atribut Kelas ServerStatusView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.25 Kelas AuthController

**Nama Kelas:** `AuthController`  
**ID Kelas:** C-25

Tabel 5.25.1. Operasi Kelas AuthController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanLoginPage(): void` | public | Mengembalikan data laman masuk ke LoginView. |
| `kirimData(kodeOtorisasi: String): void` | public | Meminta GoogleAuthService memvalidasi kode otorisasi, lalu membuat sesi lewat SesiAutentikasi bila valid. |
| `daftarkanPerangkat(tokenPush: String): void` | public | Meneruskan Expo push token dari LoginView ke SesiAutentikasi untuk disimpan pada sesi aktif. |

Tabel 5.25.2. Atribut Kelas AuthController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.26 Kelas AffirmationController

**Nama Kelas:** `AffirmationController`  
**ID Kelas:** C-26

Tabel 5.26.1. Operasi Kelas AffirmationController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanOpsiAffirmasi(): void` | public | Mengembalikan opsi waktu pengiriman ke AffirmationView. |
| `submitWaktuPengiriman(waktu: Time): void` | public | Memvalidasi waktu lewat Validasi, mengatur waktu pada DailyAffirmation, lalu memicu Notifikasi bila berhasil. |
| `ambilAfirmasiHariIni(): DailyAffirmation` | public | Mengambil afirmasi milik Mahasiswa lewat `DailyAffirmation.ambilAfirmasi()` untuk kartu afirmasi di beranda (I-02). |

Tabel 5.26.2. Atribut Kelas AffirmationController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.27 Kelas ReminderController

**Nama Kelas:** `ReminderController`  
**ID Kelas:** C-27

Tabel 5.27.1. Operasi Kelas ReminderController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanOpsiReminder(): void` | public | Mengembalikan opsi waktu pengingat ke ReminderView. |
| `submitWaktuPengiriman(waktu: Time): void` | public | Memvalidasi waktu lewat Validasi, mengatur waktu pada Reminder, lalu memicu Notifikasi bila berhasil. |

Tabel 5.27.2. Atribut Kelas ReminderController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.28 Kelas CalendarController

**Nama Kelas:** `CalendarController`  
**ID Kelas:** C-28

Tabel 5.28.1. Operasi Kelas CalendarController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanCalendar(): void` | public | Mengambil event dari GoogleCalendarService dan jadwal dari JadwalKonsultasi, menggabungkannya lewat KalenderGabungan, lalu mengembalikannya ke CalendarView. |

Tabel 5.28.2. Atribut Kelas CalendarController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.29 Kelas ConsultationController

**Nama Kelas:** `ConsultationController`  
**ID Kelas:** C-29

Tabel 5.29.1. Operasi Kelas ConsultationController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanOpsiKonsultasi(): void` | public | Mengambil daftar konsultan dari Konsultan dan mengembalikannya ke view. |
| `submitKonsultan(konsultan: Konsultan): void` | public | Memvalidasi konsultan lewat Validasi, mengambil jadwal konsultan dari JadwalKonsultasi, lalu mengembalikannya ke view. |
| `updateStatusKonsultasi(jadwal: JadwalKonsultasi): void` | public | Memvalidasi jadwal (untuk Administrator) atau memeriksa bentrok (untuk Mahasiswa), lalu memperbarui kalender dan status jadwal. |
| `ambilSesiBerikutnya(): JadwalKonsultasi` | public | Mengambil sesi konsultasi terdekat yang sudah dipesan Mahasiswa lewat `JadwalKonsultasi.ambilSesiBerikutnya()` untuk kartu sesi di beranda (I-02). |

Tabel 5.29.2. Atribut Kelas ConsultationController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

### 5.29.1 Algoritma/Query

**Nama Kelas:** `ConsultationController`  
**Nama Operasi:** `updateStatusKonsultasi(jadwal: JadwalKonsultasi): void`  
**ID Algoritma:** Algo-022

```text
PROCEDURE updateStatusKonsultasi(jadwal)
  IF peran pengguna = "administrator" THEN             // UC-05 mengelola jadwal
    IF NOT Validasi.validasiJadwal(jadwal) THEN
      kembalikan kesalahan ke view; RETURN
    hasil <- KalenderGabungan.ubahKalender(jadwal)
  ELSE                                                   // UC-04 memesan sesi
    IF KalenderGabungan.jadwalBentrok(jadwal) THEN
      kembalikan kesalahan "jadwal bentrok" ke view; RETURN
    hasil <- KalenderGabungan.ubahKalender(jadwal)
    IF hasil THEN
      hasil <- jadwal.pesanSesi()
  kembalikan hasil ke view                               // sukses atau pesan kesalahan
```

## 5.30 Kelas FAQController

**Nama Kelas:** `FAQController`  
**ID Kelas:** C-30

Tabel 5.30.1. Operasi Kelas FAQController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanFAQ(): void` | public | Mengambil daftar FAQ dari FAQ dan mengembalikannya ke FAQView. |
| `cariFAQ(kataKunci: String): void` | public | Mencari FAQ lewat FAQ dan mengembalikan hasilnya ke FAQView. |
| `tambahFAQ(pertanyaan: String, jawaban: String): void` | public | Memvalidasi input lewat Validasi, lalu meminta FAQ menambahkan data. |
| `ubahFAQ(idFAQ: String, pertanyaan: String, jawaban: String): void` | public | Memvalidasi input lewat Validasi, lalu meminta FAQ mengubah data. |
| `hapusFAQ(idFAQ: String): void` | public | Meminta FAQ menghapus data. |
| `muatFormPenambahanPertanyaan(): void` | public | Mengembalikan form pengajuan pertanyaan ke FAQView. |
| `kirimPertanyaan(isi: String): void` | public | Memvalidasi input lewat Validasi, lalu meminta PengajuanPertanyaan menyimpan pertanyaan. |

Tabel 5.30.2. Atribut Kelas FAQController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.31 Kelas FeedbackController

**Nama Kelas:** `FeedbackController`  
**ID Kelas:** C-31

Tabel 5.31.1. Operasi Kelas FeedbackController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanFormFeedback(): void` | public | Mengembalikan form umpan balik ke FeedbackView. |
| `kirimFeedback(isi: String): void` | public | Memvalidasi input lewat Validasi, lalu meminta UmpanBalik menyimpan umpan balik. |
| `tampilkanListFeedback(): void` | public | Mengambil daftar umpan balik dari UmpanBalik dan mengembalikannya ke FeedbackView. |
| `kirimTanggapan(tanggapan: String): void` | public | Memvalidasi input lewat Validasi, lalu meminta UmpanBalik menyimpan tanggapan. |

Tabel 5.31.2. Atribut Kelas FeedbackController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.32 Kelas ServerStatusController

**Nama Kelas:** `ServerStatusController`  
**ID Kelas:** C-32

Tabel 5.32.1. Operasi Kelas ServerStatusController

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanStatusServer(jenis: String): void` | public | Mengambil status uptime dari StatusServer dan mengembalikannya ke ServerStatusView. |

Tabel 5.32.2. Atribut Kelas ServerStatusController

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

## 5.33 Kelas Validasi

**Nama Kelas:** `Validasi`  
**ID Kelas:** C-33

Tabel 5.33.1. Operasi Kelas Validasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `validasiWaktu(waktu: Time): Boolean` | public | Memeriksa format dan rentang waktu. Mengembalikan true bila valid. |
| `validasiKonsultan(konsultan: Konsultan): Boolean` | public | Memeriksa bahwa konsultan yang dipilih terdaftar. Mengembalikan true bila valid. |
| `validasiJadwal(jadwal: JadwalKonsultasi): Boolean` | public | Memeriksa kelengkapan dan kewajaran data jadwal konsultasi. Mengembalikan true bila valid. |
| `validasiInput(isi: List<String>): Boolean` | public | Memeriksa bahwa isian wajib terisi. Mengembalikan true bila valid. |

Tabel 5.33.2. Atribut Kelas Validasi

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

### 5.33.1 Algoritma/Query

**Nama Kelas:** `Validasi`  
**Nama Operasi:** `validasiWaktu(waktu: Time): Boolean`  
**ID Algoritma:** Algo-023

```text
FUNCTION validasiWaktu(waktu)
  IF waktu kosong THEN RETURN false
  RETURN waktu cocok dengan pola ^([01][0-9]|2[0-3]):[0-5][0-9]$   // format HH:MM
```

### 5.33.2 Algoritma/Query

**Nama Kelas:** `Validasi`  
**Nama Operasi:** `validasiKonsultan(konsultan: Konsultan): Boolean`  
**ID Algoritma:** Algo-024

```text
FUNCTION validasiKonsultan(konsultan)
  RETURN jalankan Q-019 dengan konsultan.idKonsultan menghasilkan baris
```

Tabel 5.33.3. Query Operasi validasiKonsultan

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-019 | `SELECT 1 FROM konsultan WHERE id_konsultan = ?` | Memeriksa bahwa konsultan terdaftar. |

### 5.33.3 Algoritma/Query

**Nama Kelas:** `Validasi`  
**Nama Operasi:** `validasiJadwal(jadwal: JadwalKonsultasi): Boolean`  
**ID Algoritma:** Algo-025

```text
FUNCTION validasiJadwal(jadwal)
  IF jadwal.waktu atau jadwal.waktuSelesai bukan waktu ISO 8601 yang valid THEN RETURN false
  IF jadwal.waktuSelesai <= jadwal.waktu THEN RETURN false
  IF NOT validasiKonsultan(jadwal.konsultan) THEN RETURN false
  tumpang <- jalankan Q-020 dengan (idKonsultan, jadwal.idJadwal, jadwal.waktuSelesai, jadwal.waktu)
  RETURN tumpang kosong
```

Tabel 5.33.4. Query Operasi validasiJadwal

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-020 | `SELECT 1 FROM jadwal_konsultasi WHERE id_konsultan = ? AND id_jadwal <> ? AND waktu < ? AND waktu_selesai > ? LIMIT 1` | Memeriksa apakah slot baru tumpang tindih dengan slot lain milik konsultan yang sama. |

### 5.33.4 Algoritma/Query

**Nama Kelas:** `Validasi`  
**Nama Operasi:** `validasiInput(isi: List<String>): Boolean`  
**ID Algoritma:** Algo-026

```text
FUNCTION validasiInput(isi)
  FOR EACH teks IN isi
    IF teks kosong ATAU hanya berisi spasi THEN RETURN false
  RETURN true
```

## 5.34 Kelas GoogleAuthService

**Nama Kelas:** `GoogleAuthService`  
**ID Kelas:** C-34

Tabel 5.34.1. Operasi Kelas GoogleAuthService

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `validasi(kodeOtorisasi: String): Boolean` | public | Menukar kode otorisasi dengan access token dan refresh token Google. Mengembalikan true bila kode valid. |

Tabel 5.34.2. Atribut Kelas GoogleAuthService

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `authCode` | private | `String` |
| `accessToken` | private | `String` |
| `refreshToken` | private | `String` |

### 5.34.1 Algoritma/Query

**Nama Kelas:** `GoogleAuthService`  
**Nama Operasi:** `validasi(kodeOtorisasi: String): Boolean`  
**ID Algoritma:** Algo-027

```text
FUNCTION validasi(kodeOtorisasi)
  respons <- POST https://oauth2.googleapis.com/token
             (code = kodeOtorisasi, client_id, client_secret, redirect_uri, grant_type = authorization_code)
  IF respons.status <> 200 THEN
    RETURN false
  this.authCode     <- kodeOtorisasi
  this.accessToken  <- respons.access_token
  this.refreshToken <- respons.refresh_token           // dapat kosong bila Google tidak mengirimnya
  RETURN true
```

## 5.35 Kelas CloudflareD1Database

**Nama Kelas:** `CloudflareD1Database`  
**ID Kelas:** C-35

Tabel 5.35.1. Operasi Kelas CloudflareD1Database

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `simpanWaktuKirim(waktu: Time): Boolean` | public | Menyimpan waktu pengiriman DailyAffirmation atau Reminder ke D1. |
| `simpanKalender(jadwal: JadwalKonsultasi): Boolean` | public | Menyimpan perubahan kalender atau jadwal konsultasi ke D1. |
| `simpanPerubahan(data: String): Boolean` | public | Menyimpan perubahan data umum ke D1: FAQ, umpan balik, pengajuan pertanyaan, akun pengguna, sesi, token Google, dan perangkat notifikasi. |

Tabel 5.35.2. Atribut Kelas CloudflareD1Database

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| - | - | - |

### 5.35.1 Algoritma/Query

**Nama Kelas:** `CloudflareD1Database`  
**Nama Operasi:** `simpanWaktuKirim(waktu: Time): Boolean`  
**ID Algoritma:** Algo-028

```text
FUNCTION simpanWaktuKirim(waktu)    // entitas pemanggil: DailyAffirmation atau Reminder
  IF entitas adalah DailyAffirmation THEN
    baris <- jalankan Q-021 dengan id Mahasiswa
    IF baris kosong THEN jalankan Q-023 dengan (ID baru, id Mahasiswa, KONTEN_BAWAAN, waktu)
    ELSE                 jalankan Q-022 dengan (waktu, baris.id_affirmation)
  ELSE                                   // Reminder
    baris <- jalankan Q-024 dengan (id Mahasiswa, jenis)
    IF baris kosong THEN jalankan Q-026 dengan (ID baru, id Mahasiswa, jenis, waktu)
    ELSE                 jalankan Q-025 dengan (waktu, baris.id_reminder)
  RETURN true bila perintah berhasil, false bila terjadi kesalahan
```

Tabel 5.35.3. Query Operasi simpanWaktuKirim

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-021 | `SELECT id_affirmation FROM daily_affirmation WHERE id_mahasiswa = ?` | Mencari pengaturan afirmasi milik Mahasiswa. |
| Q-022 | `UPDATE daily_affirmation SET waktu_kirim = ? WHERE id_affirmation = ?` | Mengubah waktu kirim afirmasi yang sudah ada. |
| Q-023 | `INSERT INTO daily_affirmation (id_affirmation, id_mahasiswa, konten, waktu_kirim) VALUES (?, ?, ?, ?)` | Membuat pengaturan afirmasi baru dengan konten bawaan. |
| Q-024 | `SELECT id_reminder FROM reminder WHERE id_mahasiswa = ? AND jenis = ?` | Mencari pengingat milik Mahasiswa untuk satu jenis. |
| Q-025 | `UPDATE reminder SET waktu = ? WHERE id_reminder = ?` | Mengubah waktu pengingat yang sudah ada. |
| Q-026 | `INSERT INTO reminder (id_reminder, id_mahasiswa, jenis, waktu) VALUES (?, ?, ?, ?)` | Membuat pengingat baru. |

### 5.35.2 Algoritma/Query

**Nama Kelas:** `CloudflareD1Database`  
**Nama Operasi:** `simpanKalender(jadwal: JadwalKonsultasi): Boolean`  
**ID Algoritma:** Algo-029

```text
FUNCTION simpanKalender(jadwal)
  IF peran pengguna = "administrator" THEN
    hasil <- jalankan Q-027 dengan (jadwal.waktu, jadwal.waktuSelesai, jadwal.idJadwal)
    RETURN hasil berhasil
  hasil <- jalankan Q-028 dengan (id Mahasiswa, jadwal.idJadwal)
  RETURN jumlah baris terubah = 1       // 0 berarti slot sudah dipesan orang lain
```

Tabel 5.35.4. Query Operasi simpanKalender

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-027 | `UPDATE jadwal_konsultasi SET waktu = ?, waktu_selesai = ? WHERE id_jadwal = ?` | Administrator mengubah waktu mulai dan selesai slot. |
| Q-028 | `UPDATE jadwal_konsultasi SET status = 'terpesan', id_mahasiswa = ? WHERE id_jadwal = ? AND status = 'tersedia'` | Mahasiswa memesan slot. Syarat status = 'tersedia' mencegah dua Mahasiswa memesan slot yang sama. |

### 5.35.3 Algoritma/Query

**Nama Kelas:** `CloudflareD1Database`  
**Nama Operasi:** `simpanPerubahan(data: String): Boolean`  
**ID Algoritma:** Algo-030

```text
FUNCTION simpanPerubahan(data)      // data: teks JSON {aksi, nilai...}
  perintah <- baca data
  SWITCH perintah.aksi
    "daftar_pengguna"     : jalankan dalam satu batch Q-029 lalu Q-030
    "buat_sesi"           : jalankan Q-031
    "simpan_token_google" : jalankan Q-032
    "daftar_perangkat"    : jalankan dalam satu batch Q-033 lalu Q-034
    "tambah_faq"          : jalankan Q-035
    "ubah_faq"            : jalankan Q-036
    "hapus_faq"           : jalankan Q-037
    "kirim_umpan_balik"   : jalankan Q-038
    "tanggapi_umpan_balik": jalankan Q-039
    "ajukan_pertanyaan"   : jalankan Q-040
    DEFAULT               : RETURN false
  RETURN true bila perintah berhasil, false bila terjadi kesalahan
```

Tabel 5.35.5. Query Operasi simpanPerubahan

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-029 | `INSERT INTO pengguna (id_pengguna, nama, email, google_id, peran) VALUES (?, ?, ?, ?, 'mahasiswa') ON CONFLICT (google_id) DO NOTHING` | Mendaftarkan akun baru pada login pertama dengan peran mahasiswa. Bila google_id sudah ada (login bersamaan), perintah diabaikan. |
| Q-030 | `INSERT INTO mahasiswa (id_pengguna, nim) SELECT id_pengguna, ? FROM pengguna WHERE id_pengguna = ? AND peran = 'mahasiswa'` | Membuat baris mahasiswa dengan nim hasil turunan email kampus (NULL bila bukan email kampus), hanya bila pengguna baru benar-benar tersimpan. |
| Q-031 | `INSERT INTO sesi_autentikasi (token, id_pengguna, waktu_login, status) VALUES (?, ?, ?, 'aktif')` | Membuat sesi login baru. |
| Q-032 | `INSERT INTO token_google (id_pengguna, access_token, refresh_token, kedaluwarsa) VALUES (?, ?, ?, ?) ON CONFLICT (id_pengguna) DO UPDATE SET access_token = excluded.access_token, refresh_token = COALESCE(excluded.refresh_token, token_google.refresh_token), kedaluwarsa = excluded.kedaluwarsa` | Menyimpan token Google (sudah terenkripsi AES-256-GCM). Refresh token lama dipertahankan bila Google tidak mengirim yang baru. |
| Q-033 | `UPDATE sesi_autentikasi SET status = 'berakhir' WHERE token_push = ? AND token <> ?` | Mengakhiri sesi lain pada perangkat yang sama, sehingga satu perangkat hanya melayani satu sesi aktif. |
| Q-034 | `UPDATE sesi_autentikasi SET token_push = ? WHERE token = ? AND status = 'aktif'` | Menyimpan Expo push token pada sesi aktif. |
| Q-035 | `INSERT INTO faq (id_faq, pertanyaan, jawaban) VALUES (?, ?, ?)` | Menambah FAQ. |
| Q-036 | `UPDATE faq SET pertanyaan = ?, jawaban = ? WHERE id_faq = ?` | Mengubah FAQ. |
| Q-037 | `DELETE FROM faq WHERE id_faq = ?` | Menghapus FAQ. |
| Q-038 | `INSERT INTO umpan_balik (id_umpan_balik, id_mahasiswa, isi) VALUES (?, ?, ?)` | Menyimpan umpan balik baru dari Mahasiswa. |
| Q-039 | `UPDATE umpan_balik SET tanggapan = ?, id_administrator = ? WHERE id_umpan_balik = ?` | Menyimpan tanggapan Administrator. |
| Q-040 | `INSERT INTO pengajuan_pertanyaan (id_pertanyaan, id_mahasiswa, isi_pertanyaan) VALUES (?, ?, ?)` | Menyimpan pertanyaan di luar FAQ. |

## 5.36 Kelas HomeView

**Nama Kelas:** `HomeView`  
**ID Kelas:** C-36

Tabel 5.36.1. Operasi Kelas HomeView

| Nama Operasi | Visibility (private, public) | Keterangan |
| ------------ | ---------------------------- | ---------- |
| `tampilkanBeranda(peran: String): void` | public | Mengambil data ringkasan dari _controller_ terkait (Algo-031), lalu menampilkan beranda sesuai peran. Untuk Mahasiswa: afirmasi hari ini, sesi konsultasi berikutnya, dan menu fitur. Untuk Administrator: status layanan, ringkasan, dan menu pengelolaan. |
| `bukaMenu(menu: String): void` | public | Membuka layar fitur yang dipilih dari menu beranda. |

Tabel 5.36.2. Atribut Kelas HomeView

| Nama Atribut | Visibility (private, public) | Tipe |
| ------------ | ---------------------------- | ---- |
| `peran` | private | `String` |

### 5.36.1 Algoritma/Query

**Nama Kelas:** `HomeView`  
**Nama Operasi:** `tampilkanBeranda(peran: String): void`  
**ID Algoritma:** Algo-031

```text
PROCEDURE tampilkanBeranda(peran)
  this.peran <- peran
  IF peran = "mahasiswa" THEN
    afirmasi <- AffirmationController.ambilAfirmasiHariIni()     // DailyAffirmation.ambilAfirmasi(), Q-041
    sesi     <- ConsultationController.ambilSesiBerikutnya()     // JadwalKonsultasi.ambilSesiBerikutnya(), Q-042
    IF afirmasi ada THEN tampilkan kartu afirmasi (konten, waktuKirim)
    ELSE tampilkan ajakan mengatur afirmasi yang membuka I-04
    IF sesi ada THEN tampilkan kartu sesi berikutnya (waktu, waktuSelesai, nama konsultan)
    ELSE tampilkan ajakan memesan sesi yang membuka I-07
    tampilkan menu Mahasiswa dan bilah tab
  ELSE                                                            // administrator
    FOR EACH jenis IN ["website", "server"]
      status[jenis] <- ServerStatusController.tampilkanStatusServer(jenis)   // StatusServer.ambilStatusServer, Algo-020
    tampilkan kartu status layanan dan menu Administrator
```

Tabel 5.36.3. Query Operasi tampilkanBeranda

| No Query | Query | Keterangan |
| -------- | ----- | ---------- |
| Q-041 | `SELECT id_affirmation, konten, waktu_kirim FROM daily_affirmation WHERE id_mahasiswa = ? LIMIT 1` | Dijalankan oleh `DailyAffirmation.ambilAfirmasi()`. Mengambil afirmasi milik Mahasiswa. |
| Q-042 | `SELECT j.id_jadwal, j.waktu, j.waktu_selesai, k.nama, k.spesialisasi FROM jadwal_konsultasi j JOIN konsultan k ON k.id_konsultan = j.id_konsultan WHERE j.id_mahasiswa = ? AND j.status = 'terpesan' AND j.waktu >= ? ORDER BY j.waktu LIMIT 1` | Dijalankan oleh `JadwalKonsultasi.ambilSesiBerikutnya()`. Mengambil sesi terpesan terdekat milik Mahasiswa mulai dari waktu sekarang. |

## 5.37 Skema Basis Data

Subbab ini menjabarkan skema basis data Cloudflare D1 (SQLite) yang menyimpan atribut kelas _entity_ pada subbab 5.1 sampai 5.36. Skema ini menjadi dasar operasi penyimpanan pada kelas `CloudflareD1Database` dan kueri pada operasi kelas.

Tabel 5.37.1. Pemetaan Kelas ke Tabel

| Kelas | Tabel | Keterangan |
| ----- | ----- | ---------- |
| `Pengguna`, `Administrator` | `pengguna` | Kolom `peran` membedakan Mahasiswa dan Administrator. `Administrator` tidak memiliki atribut sendiri, sehingga tidak diberi tabel. |
| `Mahasiswa` | `mahasiswa` | Menyimpan `nim`, berelasi satu-satu dengan `pengguna`. `nim` diturunkan dari bagian lokal email kampus (domain `std.stei.itb.ac.id` atau `mahasiswa.itb.ac.id`) dan bernilai NULL bila email bukan email kampus. |
| `SesiAutentikasi` | `sesi_autentikasi` | Satu pengguna dapat memiliki beberapa sesi. Kolom `token_push` menyimpan Expo push token perangkat yang menjalankan sesi, dipakai untuk mengirim notifikasi push. |
| `GoogleAuthService`, `GoogleCalendarService` | `token_google` | Hanya menyimpan access token dan refresh token Google milik pengguna, dalam bentuk terenkripsi. Kedua kelas layanan itu sendiri tidak disimpan. |
| `DailyAffirmation` | `daily_affirmation` | Dimiliki satu Mahasiswa. |
| `Reminder` | `reminder` | Dimiliki satu Mahasiswa. Kolom `jenis` bernilai makan, tidur, atau olahraga. |
| `Notifikasi` | `notifikasi` | Riwayat notifikasi yang dikirim ke satu Mahasiswa. Tepat satu dari `id_affirmation` atau `id_reminder` terisi, menunjuk `DailyAffirmation` atau `Reminder` yang memicunya. |
| `KalenderGabungan` | - | Tidak disimpan. Dihitung saat dipakai dari event Google Calendar dan tabel `jadwal_konsultasi`. Operasi `simpanKalender` memperbarui `jadwal_konsultasi`. |
| `Konsultan` | `konsultan` | Data konsultan yang didaftarkan Administrator. |
| `JadwalKonsultasi` | `jadwal_konsultasi` | Satu slot milik satu konsultan. `waktu` adalah waktu mulai dan `waktu_selesai` adalah waktu selesai sesi, dipakai untuk memeriksa bentrok. Kolom `status` dan `id_mahasiswa` dijaga konsisten oleh batasan `CHECK`. |
| `FAQ` | `faq` | Pasangan pertanyaan dan jawaban. |
| `PengajuanPertanyaan` | `pengajuan_pertanyaan` | Pertanyaan di luar FAQ dari satu Mahasiswa. |
| `UmpanBalik` | `umpan_balik` | Umpan balik Mahasiswa. `tanggapan` dan `id_administrator` terisi setelah Administrator menanggapi. |
| `StatusServer` | `status_server` | Satu baris untuk setiap pemeriksaan status, dibedakan oleh kolom `jenis` (website atau server). |
| _View_ (termasuk `HomeView`), _Controller_, `Validasi`, `CloudflareD1Database` | - | Bukan _entity_, sehingga tidak memiliki tabel. |

Ketentuan umum skema:

- Pendaftaran hanya melalui Google OAuth 2.0. Akun Mahasiswa dibuat otomatis pada login pertama (`peran` bernilai mahasiswa) dari nama, email, dan `google_id` pada akun Google, dengan `nim` diturunkan dari email kampus. Akun Administrator tidak dibuat lewat pendaftaran, melainkan ditetapkan dengan mengubah `peran` langsung pada basis data.
- Kunci utama bertipe `TEXT` (misalnya UUID), kecuali `status_server` yang memakai `INTEGER` bertambah otomatis.
- SQLite tidak memiliki tipe tanggal. Tipe `DateTime` pada kelas disimpan sebagai teks ISO 8601, tipe `Time` sebagai teks `HH:MM`, dan tipe `Boolean` sebagai `INTEGER` 0 atau 1.
- Hubungan antartabel memakai _foreign key_ dengan `ON DELETE` yang sesuai. Pengecekan bahwa `id_administrator` merujuk pengguna berperan administrator dilakukan oleh server.
- Notifikasi push memakai Expo Push Service. Aplikasi mengirim Expo push token ke server setelah login, dan server menyimpannya pada sesi aktif (`sesi_autentikasi.token_push`). Notifikasi dikirim ke seluruh token pada sesi aktif milik penerima. Token yang ditolak Expo (`DeviceNotRegistered`) dikosongkan, dan token akan hilang dari pengiriman saat sesi berakhir.
- Token Google bersifat sensitif (KNF-02). Server mengenkripsi `access_token` dan `refresh_token` dengan AES-256-GCM sebelum disimpan, sehingga nilai tersimpan berupa teks base64 gabungan IV, ciphertext, dan tag. Kunci 256-bit disimpan sebagai _secret_ Cloudflare Workers dan tidak pernah disimpan di D1. Tabel `token_google` hanya dibaca dan ditulis oleh server.

```mermaid
erDiagram
    pengguna ||--o| mahasiswa : "peran mahasiswa"
    pengguna ||--o{ sesi_autentikasi : memiliki
    pengguna ||--o| token_google : memiliki
    pengguna |o--o{ umpan_balik : menanggapi
    mahasiswa ||--o{ daily_affirmation : mengatur
    mahasiswa ||--o{ reminder : mengatur
    mahasiswa ||--o{ notifikasi : menerima
    daily_affirmation |o--o{ notifikasi : memicu
    reminder |o--o{ notifikasi : memicu
    mahasiswa |o--o{ jadwal_konsultasi : memesan
    mahasiswa ||--o{ pengajuan_pertanyaan : mengajukan
    mahasiswa ||--o{ umpan_balik : memberikan
    konsultan ||--o{ jadwal_konsultasi : memiliki

    pengguna {
        text id_pengguna PK
        text nama
        text email UK
        text google_id UK
        text peran
    }
    mahasiswa {
        text id_pengguna PK, FK
        text nim UK
    }
    sesi_autentikasi {
        text token PK
        text id_pengguna FK
        text waktu_login
        text status
        text token_push
    }
    token_google {
        text id_pengguna PK, FK
        text access_token
        text refresh_token
        text kedaluwarsa
    }
    daily_affirmation {
        text id_affirmation PK
        text id_mahasiswa FK
        text konten
        text waktu_kirim
    }
    reminder {
        text id_reminder PK
        text id_mahasiswa FK
        text jenis
        text waktu
    }
    notifikasi {
        text id_notifikasi PK
        text id_mahasiswa FK
        text id_affirmation FK
        text id_reminder FK
        text isi
        text waktu_kirim
    }
    konsultan {
        text id_konsultan PK
        text nama
        text spesialisasi
    }
    jadwal_konsultasi {
        text id_jadwal PK
        text id_konsultan FK
        text waktu
        text waktu_selesai
        text status
        text id_mahasiswa FK
    }
    faq {
        text id_faq PK
        text pertanyaan
        text jawaban
    }
    pengajuan_pertanyaan {
        text id_pertanyaan PK
        text id_mahasiswa FK
        text isi_pertanyaan
    }
    umpan_balik {
        text id_umpan_balik PK
        text id_mahasiswa FK
        text isi
        text tanggapan
        text id_administrator FK
    }
    status_server {
        integer id_status PK
        text jenis
        integer status_uptime
        text waktu_cek
    }
```

<p align="center">
<i>Gambar 5.37.1. Diagram Relasi Entitas Basis Data Sehati</i>
</p>

Skema berikut dapat dijalankan langsung pada Cloudflare D1.

```sql
PRAGMA foreign_keys = ON;

-- Pengguna (C-01), Mahasiswa (C-02), Administrator (C-03)
CREATE TABLE pengguna (
  id_pengguna TEXT PRIMARY KEY,
  nama        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  google_id   TEXT NOT NULL UNIQUE,
  peran       TEXT NOT NULL CHECK (peran IN ('mahasiswa', 'administrator'))
);

CREATE TABLE mahasiswa (
  id_pengguna TEXT PRIMARY KEY REFERENCES pengguna (id_pengguna) ON DELETE CASCADE,
  nim         TEXT UNIQUE            -- diturunkan dari email kampus; NULL bila email bukan email kampus
);

-- SesiAutentikasi (C-04)
CREATE TABLE sesi_autentikasi (
  token       TEXT PRIMARY KEY,
  id_pengguna TEXT NOT NULL REFERENCES pengguna (id_pengguna) ON DELETE CASCADE,
  waktu_login TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('aktif', 'berakhir')),
  token_push  TEXT                   -- Expo push token perangkat yang menjalankan sesi ini
);

-- Token Google milik pengguna (GoogleAuthService C-34, GoogleCalendarService C-08)
-- access_token dan refresh_token disimpan sebagai ciphertext AES-256-GCM (base64 dari IV + ciphertext + tag)
CREATE TABLE token_google (
  id_pengguna   TEXT PRIMARY KEY REFERENCES pengguna (id_pengguna) ON DELETE CASCADE,
  access_token  TEXT NOT NULL,
  refresh_token TEXT,
  kedaluwarsa   TEXT NOT NULL
);

-- DailyAffirmation (C-05)
CREATE TABLE daily_affirmation (
  id_affirmation TEXT PRIMARY KEY,
  id_mahasiswa   TEXT NOT NULL REFERENCES mahasiswa (id_pengguna) ON DELETE CASCADE,
  konten         TEXT NOT NULL,
  waktu_kirim    TEXT NOT NULL
);

-- Reminder (C-06)
CREATE TABLE reminder (
  id_reminder  TEXT PRIMARY KEY,
  id_mahasiswa TEXT NOT NULL REFERENCES mahasiswa (id_pengguna) ON DELETE CASCADE,
  jenis        TEXT NOT NULL CHECK (jenis IN ('makan', 'tidur', 'olahraga')),
  waktu        TEXT NOT NULL
);

-- Notifikasi (C-07)
-- Sumber notifikasi: tepat satu dari id_affirmation atau id_reminder terisi
CREATE TABLE notifikasi (
  id_notifikasi  TEXT PRIMARY KEY,
  id_mahasiswa   TEXT NOT NULL REFERENCES mahasiswa (id_pengguna) ON DELETE CASCADE,
  id_affirmation TEXT REFERENCES daily_affirmation (id_affirmation) ON DELETE CASCADE,
  id_reminder    TEXT REFERENCES reminder (id_reminder) ON DELETE CASCADE,
  isi            TEXT NOT NULL,
  waktu_kirim    TEXT NOT NULL,
  CHECK ((id_affirmation IS NOT NULL) + (id_reminder IS NOT NULL) = 1)
);

-- Konsultan (C-10)
CREATE TABLE konsultan (
  id_konsultan TEXT PRIMARY KEY,
  nama         TEXT NOT NULL,
  spesialisasi TEXT NOT NULL
);

-- JadwalKonsultasi (C-11)
CREATE TABLE jadwal_konsultasi (
  id_jadwal    TEXT PRIMARY KEY,
  id_konsultan  TEXT NOT NULL REFERENCES konsultan (id_konsultan) ON DELETE CASCADE,
  waktu         TEXT NOT NULL,
  waktu_selesai TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'terpesan')),
  id_mahasiswa  TEXT REFERENCES mahasiswa (id_pengguna) ON DELETE SET NULL,
  UNIQUE (id_konsultan, waktu),
  CHECK (waktu_selesai > waktu),
  CHECK ((status = 'terpesan') = (id_mahasiswa IS NOT NULL))
);

-- FAQ (C-12)
CREATE TABLE faq (
  id_faq     TEXT PRIMARY KEY,
  pertanyaan TEXT NOT NULL,
  jawaban    TEXT NOT NULL
);

-- PengajuanPertanyaan (C-13)
CREATE TABLE pengajuan_pertanyaan (
  id_pertanyaan   TEXT PRIMARY KEY,
  id_mahasiswa    TEXT NOT NULL REFERENCES mahasiswa (id_pengguna) ON DELETE CASCADE,
  isi_pertanyaan  TEXT NOT NULL
);

-- UmpanBalik (C-14)
CREATE TABLE umpan_balik (
  id_umpan_balik   TEXT PRIMARY KEY,
  id_mahasiswa     TEXT NOT NULL REFERENCES mahasiswa (id_pengguna) ON DELETE CASCADE,
  isi              TEXT NOT NULL,
  tanggapan        TEXT,
  id_administrator TEXT REFERENCES pengguna (id_pengguna) ON DELETE SET NULL
);

-- StatusServer (C-15)
CREATE TABLE status_server (
  id_status     INTEGER PRIMARY KEY AUTOINCREMENT,
  jenis         TEXT NOT NULL CHECK (jenis IN ('website', 'server')),
  status_uptime INTEGER NOT NULL CHECK (status_uptime IN (0, 1)),
  waktu_cek     TEXT NOT NULL
);

CREATE INDEX idx_sesi_pengguna        ON sesi_autentikasi (id_pengguna);
CREATE INDEX idx_sesi_push            ON sesi_autentikasi (token_push);
CREATE INDEX idx_affirmation_mhs      ON daily_affirmation (id_mahasiswa);
CREATE INDEX idx_reminder_mhs         ON reminder (id_mahasiswa);
CREATE INDEX idx_notifikasi_mhs       ON notifikasi (id_mahasiswa);
CREATE INDEX idx_jadwal_waktu         ON jadwal_konsultasi (id_konsultan, waktu, waktu_selesai);
CREATE INDEX idx_jadwal_mhs           ON jadwal_konsultasi (id_mahasiswa);
CREATE INDEX idx_umpan_balik_mhs      ON umpan_balik (id_mahasiswa);
CREATE INDEX idx_status_jenis_waktu   ON status_server (jenis, waktu_cek DESC);
```

<br>

---

# BAB 6: Perancangan Antarmuka

Rancangan antarmuka Sehati dibuat sebagai prototipe di Figma ([Sehati - Rancangan Antarmuka](https://www.figma.com/design/OqbMU5rHz4uQwCNpkvndPY)). Seluruh layar dirancang untuk ponsel berukuran 390 × 844 piksel dan disusun dari komponen bersama (tombol, isian, banner, lencana, bilah tab, dan kartu menu) dengan warna yang diambil dari logo Sehati.

Setiap subbab memuat satu layar beserta spesifikasi objeknya. Kolom Keterangan menyebut reaksi sistem, layar tujuan, operasi kelas, dan ID algoritma pada BAB 5. Objek bertanda "(kondisional)" hanya tampil pada kondisi tertentu, misalnya pesan galat pada skenario alternatif. Data pada gambar adalah contoh.

## 6.1 Rancangan Antarmuka I-01

**Antarmuka:** I-01  
**Nama Layar:** Masuk  
**Kelas View:** `LoginView`  
**Use Case:** UC-11

<p align="center">
<img alt="Rancangan Antarmuka I-01 - Masuk" src="./assets/antarmuka/I-01.png" width="300">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka I-01 - Masuk</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka I-01

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-01-01 | Gambar | Logo Sehati | Identitas aplikasi. |
| I-01-02 | Label | "Sehati" | Nama aplikasi. |
| I-01-03 | Label | "Teman sehat mental dan kesejahteraan mahasiswa" | Slogan aplikasi. |
| I-01-04 | Button | "Masuk dengan Google" | Membuka halaman otorisasi Google. Kode otorisasi diteruskan lewat `LoginView.isiLoginPage(kodeOtorisasi)` ke `AuthController.kirimData(kodeOtorisasi)`, yang menjalankan Algo-001. Akun Mahasiswa baru dibuat otomatis pada login pertama. Setelah berhasil, `HomeView.tampilkanBeranda(peran)` membuka I-02 (Mahasiswa) atau I-03 (Administrator), lalu perangkat didaftarkan untuk notifikasi (Algo-003). |
| I-01-05 | Label | Keterangan akun kampus | Menjelaskan bahwa masuk memakai akun Google kampus dan akun dibuat otomatis. |
| I-01-06 | Banner galat (kondisional) | "Masuk dengan Google gagal. Silakan coba lagi." | Tampil bila validasi Google gagal (UC-11 skenario alternatif 1). Pengguna tetap di I-01. |

## 6.2 Rancangan Antarmuka I-02

**Antarmuka:** I-02  
**Nama Layar:** Beranda Mahasiswa  
**Kelas View:** `HomeView`  
**Use Case:** UC-11

<p align="center">
<img alt="Rancangan Antarmuka I-02 - Beranda Mahasiswa" src="./assets/antarmuka/I-02.png" width="300">
</p>
<p align="center">
<i>Gambar 6.2. Rancangan Antarmuka I-02 - Beranda Mahasiswa</i>
</p>

Tabel 6.2. Spesifikasi Objek Antarmuka I-02

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-02-01 | Label | "Selamat pagi," dan nama Mahasiswa | Sapaan sesuai waktu dan nama pengguna. |
| I-02-02 | Button ikon | Ikon lonceng | Menampilkan daftar notifikasi yang diterima (`Notifikasi.tampilkanNotifikasi()`). |
| I-02-03 | Kartu | "Afirmasi hari ini" dan isi afirmasi | Data dari `AffirmationController.ambilAfirmasiHariIni()` dan `DailyAffirmation.ambilAfirmasi()` (Algo-031, Q-041). Bila belum ada afirmasi, kartu berisi ajakan mengatur afirmasi. Menekan kartu membuka I-04. |
| I-02-04 | Kartu | "Sesi konsultasi berikutnya", tanggal, waktu, konsultan, lencana "Terjadwal" | Data dari `ConsultationController.ambilSesiBerikutnya()` dan `JadwalKonsultasi.ambilSesiBerikutnya()` (Algo-031, Q-042). Bila belum ada sesi, kartu berisi ajakan memesan sesi yang membuka I-07. Menekan kartu membuka I-06. |
| I-02-05 | MenuTile (6 buah) | Afirmasi, Pengingat, Kalender, Konsultasi, FAQ, Umpan Balik | `HomeView.bukaMenu(menu)` membuka I-04, I-05, I-06, I-07, I-09, atau I-11. |
| I-02-06 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.3 Rancangan Antarmuka I-03

**Antarmuka:** I-03  
**Nama Layar:** Beranda Administrator  
**Kelas View:** `HomeView`  
**Use Case:** UC-11

<p align="center">
<img alt="Rancangan Antarmuka I-03 - Beranda Administrator" src="./assets/antarmuka/I-03.png" width="300">
</p>
<p align="center">
<i>Gambar 6.3. Rancangan Antarmuka I-03 - Beranda Administrator</i>
</p>

Tabel 6.3. Spesifikasi Objek Antarmuka I-03

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-03-01 | Label | "Panel Administrator" dan "Halo, Admin" | Sapaan untuk Administrator. |
| I-03-02 | Button ikon | Ikon keluar | Menjalankan `SesiAutentikasi.logout()` lalu kembali ke I-01. |
| I-03-03 | Kartu | "Status layanan": Website dan Server dengan lencana Up/Down | Diisi oleh `HomeView.tampilkanBeranda` lewat `ServerStatusController.tampilkanStatusServer(jenis)` dan `StatusServer.ambilStatusServer(jenis)` (Algo-031, Algo-020). Menekan kartu membuka I-15. |
| I-03-04 | MenuTile (4 buah) | Jadwal Konsultan, Kelola FAQ, Umpan Balik, Status Server | `HomeView.bukaMenu(menu)` membuka I-12, I-13, I-14, atau I-15. |

## 6.4 Rancangan Antarmuka I-04

**Antarmuka:** I-04  
**Nama Layar:** Daily Affirmations  
**Kelas View:** `AffirmationView`  
**Use Case:** UC-01

<p align="center">
<img alt="Rancangan Antarmuka I-04 - Daily Affirmations" src="./assets/antarmuka/I-04.png" width="300">
</p>
<p align="center">
<i>Gambar 6.4. Rancangan Antarmuka I-04 - Daily Affirmations</i>
</p>

Tabel 6.4. Spesifikasi Objek Antarmuka I-04

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-04-01 | AppBar | Tombol kembali dan judul "Daily Affirmations" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-04-02 | Kartu | "Contoh afirmasi" dan isi afirmasi | Pratinjau isi afirmasi yang akan dikirim. |
| I-04-03 | Toggle | "Kirim afirmasi harian" | Mengaktifkan atau menonaktifkan pengiriman afirmasi harian. |
| I-04-04 | Text field | Label "Waktu pengiriman", isi "07:00" | Menekan kolom membuka pemilih waktu. Waktu dikirim lewat `AffirmationView.pilihWaktuPengiriman(waktu)`. |
| I-04-05 | Chip (4 buah) | "06:00", "07:00", "08:00", "21:00" | Mengisi I-04-04 dengan waktu yang dipilih. Chip aktif berwarna merah. |
| I-04-06 | Label | Keterangan pengiriman | Menjelaskan bahwa afirmasi dikirim setiap hari pada waktu terpilih. |
| I-04-07 | Button | "Simpan Setelan" | `AffirmationController.submitWaktuPengiriman(waktu)`: `Validasi.validasiWaktu` (Algo-023), lalu `DailyAffirmation.aturWaktuKirim` (Algo-004). Bila berhasil, `AffirmationView.tampilkanSetelanTersimpan()` menampilkan konfirmasi. |
| I-04-08 | Banner galat (kondisional) | "Setelan gagal disimpan. Silakan coba lagi." | Tampil bila penyimpanan gagal (UC-01 skenario alternatif 1). |
| I-04-09 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (Pengingat aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.5 Rancangan Antarmuka I-05

**Antarmuka:** I-05  
**Nama Layar:** Pengingat Kesehatan  
**Kelas View:** `ReminderView`  
**Use Case:** UC-02

<p align="center">
<img alt="Rancangan Antarmuka I-05 - Pengingat Kesehatan" src="./assets/antarmuka/I-05.png" width="300">
</p>
<p align="center">
<i>Gambar 6.5. Rancangan Antarmuka I-05 - Pengingat Kesehatan</i>
</p>

Tabel 6.5. Spesifikasi Objek Antarmuka I-05

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-05-01 | AppBar | Tombol kembali dan judul "Pengingat Kesehatan" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-05-02 | Label | Penjelasan pengingat | Menjelaskan fungsi layar. |
| I-05-03 | Kartu (3 buah) | Makan, Tidur, Olahraga, masing-masing dengan ikon, keterangan, waktu, dan sakelar | Satu kartu untuk setiap jenis pengingat. |
| I-05-04 | Text field waktu | "12:00", "22:00", "17:00" | Menekan waktu membuka pemilih waktu. Waktu dikirim lewat `ReminderView.pilihWaktuPengiriman(waktu)`. |
| I-05-05 | Toggle (3 buah) | Aktif atau nonaktif | Mengaktifkan atau menonaktifkan pengingat jenis tersebut. |
| I-05-06 | Button | "Simpan Setelan" | `ReminderController.submitWaktuPengiriman(waktu)`: `Validasi.validasiWaktu` (Algo-023), lalu `Reminder.aturWaktuKirim` (Algo-006). Bila berhasil, menampilkan konfirmasi setelan tersimpan. |
| I-05-07 | Banner galat (kondisional) | "Setelan gagal disimpan. Silakan coba lagi." | Tampil bila penyimpanan gagal (UC-02 skenario alternatif 1). |
| I-05-08 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (Pengingat aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.6 Rancangan Antarmuka I-06

**Antarmuka:** I-06  
**Nama Layar:** Kalender Terintegrasi  
**Kelas View:** `CalendarView`  
**Use Case:** UC-03

<p align="center">
<img alt="Rancangan Antarmuka I-06 - Kalender Terintegrasi" src="./assets/antarmuka/I-06.png" width="300">
</p>
<p align="center">
<i>Gambar 6.6. Rancangan Antarmuka I-06 - Kalender Terintegrasi</i>
</p>

Tabel 6.6. Spesifikasi Objek Antarmuka I-06

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-06-01 | AppBar | Judul "Kalender" | Judul layar utama tab Kalender. |
| I-06-02 | Label | "Oktober 2026" | Bulan yang sedang ditampilkan. |
| I-06-03 | Button | "Muat ulang" | Menjalankan ulang `CalendarView.bukaPageCalendar()` dan `CalendarController.tampilkanCalendar()`: event Google (Algo-009), jadwal konsultasi (Algo-015), lalu digabung (Algo-011). |
| I-06-04 | Pemilih hari (7 tombol) | "Sen 27" sampai "Min 2" | Memilih hari. Daftar acara di bawahnya mengikuti hari terpilih. |
| I-06-05 | Lencana (2 buah) | "Google Calendar", "Sesi konsultasi" | Keterangan warna penanda acara. |
| I-06-06 | Kartu acara (daftar) | Judul acara, jam, dan sumber | Hasil `KalenderGabungan.gabungkanJadwal` (Algo-011) yang ditampilkan lewat `CalendarView.tampilkanKalender(kalender)`. Penanda biru untuk event Google, merah untuk sesi konsultasi. |
| I-06-07 | Banner galat (kondisional) | "Gagal mengambil data event. Tekan Muat ulang untuk mencoba lagi." | Tampil lewat `CalendarView.showErrorMessage(pesan)` bila event gagal diambil (UC-03 skenario alternatif 1). Tombol I-06-03 dipakai untuk mencoba lagi. |
| I-06-08 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (Kalender aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.7 Rancangan Antarmuka I-07

**Antarmuka:** I-07  
**Nama Layar:** Pilih Konsultan  
**Kelas View:** `ConsultationBookingView`  
**Use Case:** UC-04

<p align="center">
<img alt="Rancangan Antarmuka I-07 - Pilih Konsultan" src="./assets/antarmuka/I-07.png" width="300">
</p>
<p align="center">
<i>Gambar 6.7. Rancangan Antarmuka I-07 - Pilih Konsultan</i>
</p>

Tabel 6.7. Spesifikasi Objek Antarmuka I-07

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-07-01 | AppBar | Judul "Pesan Konsultasi" | Judul layar utama tab Konsultasi. |
| I-07-02 | Label | "Langkah 1 dari 2" | Penanda langkah pemesanan. |
| I-07-03 | Label | Penjelasan pemilihan konsultan | Menjelaskan bahwa jadwal sudah dicocokkan dengan Google Calendar. |
| I-07-04 | Kartu konsultan (daftar) | Inisial, nama, spesialisasi, dan jumlah slot tersedia | Data dari `Konsultan.ambilDaftarKonsultan()` (Algo-014). Menekan kartu menjalankan `ConsultationBookingView.pilihKonsultan(konsultan)` dan `ConsultationController.submitKonsultan(konsultan)`: `Validasi.validasiKonsultan` (Algo-024) dan `JadwalKonsultasi.ambilKalender(konsultan)` (Algo-015), lalu membuka I-08. |
| I-07-05 | Banner galat (kondisional) | "Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi." | Tampil bila data jadwal gagal diambil (UC-04 skenario alternatif 1). |
| I-07-06 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (Konsultasi aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.8 Rancangan Antarmuka I-08

**Antarmuka:** I-08  
**Nama Layar:** Pilih Sesi dan Konfirmasi  
**Kelas View:** `ConsultationBookingView`  
**Use Case:** UC-04

<p align="center">
<img alt="Rancangan Antarmuka I-08 - Pilih Sesi dan Konfirmasi" src="./assets/antarmuka/I-08.png" width="300">
</p>
<p align="center">
<i>Gambar 6.8. Rancangan Antarmuka I-08 - Pilih Sesi dan Konfirmasi</i>
</p>

Tabel 6.8. Spesifikasi Objek Antarmuka I-08

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-08-01 | AppBar | Tombol kembali dan judul "Pilih Sesi" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-08-02 | Label | "Langkah 2 dari 2" | Penanda langkah pemesanan. |
| I-08-03 | Kartu | Konsultan terpilih | Menampilkan konsultan yang dipilih pada I-07. |
| I-08-04 | Chip tanggal (3 buah) | "Kam, 30 Okt", "Jum, 31 Okt", "Sen, 3 Nov" | Memilih tanggal. Daftar slot mengikuti tanggal terpilih. |
| I-08-05 | Pilihan slot (daftar) | Jam dan lencana "Tersedia", "Terpesan", atau "Bentrok dengan kalendermu" | Menekan slot tersedia menjalankan `ConsultationBookingView.pilihSesi(jadwal)`. Slot terpesan dan slot yang bentrok dengan event Google Calendar tidak dapat dipilih. |
| I-08-06 | Banner info | "Slot dicek terhadap Google Calendar-mu sebelum pesanan disimpan." | Informasi pemeriksaan bentrok. |
| I-08-07 | Button | "Konfirmasi Pesanan" | `ConsultationController.updateStatusKonsultasi(jadwal)` (Algo-022): `KalenderGabungan.jadwalBentrok` (Algo-012), `KalenderGabungan.ubahKalender` (Algo-013), lalu `JadwalKonsultasi.pesanSesi` (Algo-016). Bila berhasil, menampilkan konfirmasi dan sesi muncul pada I-02 dan I-06. |
| I-08-08 | Banner galat (kondisional) | "Sesi gagal dipesan. Silakan tekan Konfirmasi sekali lagi." | Tampil bila pesanan gagal disimpan (UC-04 skenario alternatif 2). |
| I-08-09 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (Konsultasi aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.9 Rancangan Antarmuka I-09

**Antarmuka:** I-09  
**Nama Layar:** FAQ dan Pencarian  
**Kelas View:** `FAQView`  
**Use Case:** UC-06

<p align="center">
<img alt="Rancangan Antarmuka I-09 - FAQ dan Pencarian" src="./assets/antarmuka/I-09.png" width="300">
</p>
<p align="center">
<i>Gambar 6.9. Rancangan Antarmuka I-09 - FAQ dan Pencarian</i>
</p>

Tabel 6.9. Spesifikasi Objek Antarmuka I-09

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-09-01 | AppBar | Judul "FAQ" | Judul layar utama tab FAQ. |
| I-09-02 | Text field | Label "Cari pertanyaan" | `FAQView.cariFAQ(kataKunci)` diteruskan ke `FAQController.cariFAQ` dan `FAQ.cariFAQ` (Algo-017). Hasil ditampilkan lewat `FAQView.tampilkanFAQ(daftar)`. |
| I-09-03 | Label | "3 pertanyaan ditemukan" | Jumlah hasil pencarian. |
| I-09-04 | Accordion (daftar) | Pertanyaan, dan jawaban saat dibuka | Menekan pertanyaan membuka atau menutup jawabannya. |
| I-09-05 | Kartu | "Tidak menemukan jawaban?" | Tawaran mengajukan pertanyaan (`FAQView.tampilkanTawaranPengajuan()`). Disorot saat pencarian tidak menemukan hasil (UC-06 skenario alternatif 1). |
| I-09-06 | Button | "Ajukan Pertanyaan" | `FAQView.bukaFormPertanyaan()` membuka I-10. |
| I-09-07 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (FAQ aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.10 Rancangan Antarmuka I-10

**Antarmuka:** I-10  
**Nama Layar:** Form Pengajuan Pertanyaan  
**Kelas View:** `FAQView`  
**Use Case:** UC-12

<p align="center">
<img alt="Rancangan Antarmuka I-10 - Form Pengajuan Pertanyaan" src="./assets/antarmuka/I-10.png" width="300">
</p>
<p align="center">
<i>Gambar 6.10. Rancangan Antarmuka I-10 - Form Pengajuan Pertanyaan</i>
</p>

Tabel 6.10. Spesifikasi Objek Antarmuka I-10

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-10-01 | AppBar | Tombol kembali dan judul "Ajukan Pertanyaan" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-10-02 | Label | Penjelasan pengajuan | Menjelaskan bahwa pertanyaan dikirim ke Administrator. |
| I-10-03 | Text area | Label "Pertanyaan" | Isi pertanyaan dikirim lewat `FAQView.isiFormPertanyaan(isi)`. |
| I-10-04 | Label | "52/500 karakter" | Penghitung karakter, maksimal 500. |
| I-10-05 | Button | "Kirim Pertanyaan" | `FAQController.kirimPertanyaan(isi)`: `Validasi.validasiInput` (Algo-026), lalu `PengajuanPertanyaan.ajukanPertanyaan` yang disimpan lewat `CloudflareD1Database.simpanPerubahan` (Algo-030). |
| I-10-06 | Banner sukses (kondisional) | "Pertanyaan berhasil dikirim. Terima kasih!" | Tampil bila pertanyaan tersimpan. |
| I-10-07 | Banner galat (kondisional) | "Pertanyaan gagal disimpan. Silakan coba lagi." | Tampil bila penyimpanan gagal (UC-12 skenario alternatif 1). |
| I-10-08 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (FAQ aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.11 Rancangan Antarmuka I-11

**Antarmuka:** I-11  
**Nama Layar:** Umpan Balik  
**Kelas View:** `FeedbackView`  
**Use Case:** UC-08

<p align="center">
<img alt="Rancangan Antarmuka I-11 - Umpan Balik" src="./assets/antarmuka/I-11.png" width="300">
</p>
<p align="center">
<i>Gambar 6.11. Rancangan Antarmuka I-11 - Umpan Balik</i>
</p>

Tabel 6.11. Spesifikasi Objek Antarmuka I-11

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-11-01 | AppBar | Tombol kembali dan judul "Umpan Balik" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-11-02 | Label | Penjelasan umpan balik | Menjelaskan bahwa umpan balik dibaca dan ditanggapi Administrator. |
| I-11-03 | Text area | Label "Umpan balik" | Isi umpan balik dikirim lewat `FeedbackView.isiFormFeedback(isi)`. |
| I-11-04 | Button | "Kirim Umpan Balik" | `FeedbackController.kirimFeedback(isi)`: `Validasi.validasiInput` (Algo-026), lalu `UmpanBalik.kirimUmpanBalik` yang disimpan lewat `CloudflareD1Database.simpanPerubahan` (Algo-030). Bila berhasil, `FeedbackView.tampilkanFeedbackTersimpan()` menampilkan konfirmasi. |
| I-11-05 | Banner galat (kondisional) | "Umpan balik gagal disimpan. Silakan coba lagi." | Tampil bila penyimpanan gagal (UC-08 skenario alternatif 1). |
| I-11-06 | Kartu (daftar) | Umpan balik sebelumnya: tanggal, isi, lencana status, dan tanggapan Administrator | Data dari `UmpanBalik.ambilListUmpanBalik()` (Algo-018). Tanggapan tampil setelah Administrator menanggapi pada I-14. Bila tanggapan gagal dimuat (UC-09 skenario alternatif 1), kartu tampil tanpa tanggapan. |
| I-11-07 | TabBar | Bilah tab Mahasiswa: Beranda, Kalender, Konsultasi, Pengingat, FAQ (Beranda aktif) | Navigasi utama Mahasiswa: Beranda ke I-02, Kalender ke I-06, Konsultasi ke I-07, Pengingat ke I-05, FAQ ke I-09. |

## 6.12 Rancangan Antarmuka I-12

**Antarmuka:** I-12  
**Nama Layar:** Kelola Jadwal Konsultan  
**Kelas View:** `ConsultationManagementView`  
**Use Case:** UC-05

<p align="center">
<img alt="Rancangan Antarmuka I-12 - Kelola Jadwal Konsultan" src="./assets/antarmuka/I-12.png" width="300">
</p>
<p align="center">
<i>Gambar 6.12. Rancangan Antarmuka I-12 - Kelola Jadwal Konsultan</i>
</p>

Tabel 6.12. Spesifikasi Objek Antarmuka I-12

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-12-01 | AppBar | Tombol kembali dan judul "Jadwal Konsultan" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-12-02 | Text field (pilihan) | Label "Konsultan", isi nama konsultan | Memilih konsultan lewat `ConsultationManagementView.pilihKonsultan(konsultan)` dan `ConsultationController.submitKonsultan(konsultan)` (Algo-024, Algo-015). |
| I-12-03 | Chip tanggal (3 buah) | "Kam, 30 Okt", "Jum, 31 Okt", "Sen, 3 Nov" | Memilih tanggal. Daftar slot mengikuti tanggal terpilih. |
| I-12-04 | Kartu slot (daftar) | Jam, lencana "Terpesan" atau "Tersedia", dan tombol ubah | Menekan tombol ubah membuka panel I-12-05 untuk slot tersebut. |
| I-12-05 | Panel | "Ubah slot" dengan kolom "Mulai" dan "Selesai" | Perubahan dikirim lewat `ConsultationManagementView.perbaruiJadwal(jadwal)`. |
| I-12-06 | Button | "Simpan" | `ConsultationController.updateStatusKonsultasi(jadwal)` (Algo-022): `Validasi.validasiJadwal` (Algo-025), lalu `KalenderGabungan.ubahKalender` (Algo-013) dan `CloudflareD1Database.simpanKalender` (Algo-029). |
| I-12-07 | Banner galat (kondisional) | "Perubahan jadwal gagal disimpan. Tekan Simpan sekali lagi." | Tampil di panel bila perubahan gagal disimpan (UC-05 skenario alternatif 2). |
| I-12-08 | Banner galat (kondisional) | "Gagal mengambil data jadwal konsultasi. Tekan Muat ulang untuk mencoba lagi." | Tampil bila data jadwal gagal diambil (UC-05 skenario alternatif 1). |
| I-12-09 | Button | "Tambah Slot" | Membuka panel I-12-05 kosong untuk slot baru, yang disimpan lewat `JadwalKonsultasi.simpanJadwal()`. |

## 6.13 Rancangan Antarmuka I-13

**Antarmuka:** I-13  
**Nama Layar:** Kelola FAQ  
**Kelas View:** `FAQView`  
**Use Case:** UC-07

<p align="center">
<img alt="Rancangan Antarmuka I-13 - Kelola FAQ" src="./assets/antarmuka/I-13.png" width="300">
</p>
<p align="center">
<i>Gambar 6.13. Rancangan Antarmuka I-13 - Kelola FAQ</i>
</p>

Tabel 6.13. Spesifikasi Objek Antarmuka I-13

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-13-01 | AppBar | Tombol kembali dan judul "Kelola FAQ" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-13-02 | Kartu FAQ (daftar) | Pertanyaan dan jawaban singkat | Data dari `FAQ.ambilDaftarPertanyaan()`. |
| I-13-03 | Button ikon (per kartu) | Ikon ubah | Mengisi formulir I-13-05 dengan FAQ terpilih. Perubahan disimpan lewat `FAQView.ubahFAQ` dan `FAQController.ubahFAQ` (Algo-026, Algo-030). |
| I-13-04 | Button ikon (per kartu) | Ikon hapus | Setelah konfirmasi, `FAQView.hapusFAQ(idFAQ)` diteruskan ke `FAQController.hapusFAQ` dan `FAQ.hapusFAQ` (Algo-030). |
| I-13-05 | Formulir | "Tambah FAQ" dengan kolom "Pertanyaan" dan area teks "Jawaban" | Isian FAQ baru atau FAQ yang sedang diubah. |
| I-13-06 | Button | "Simpan FAQ" | `FAQController.tambahFAQ(pertanyaan, jawaban)`: `Validasi.validasiInput` (Algo-026), lalu `FAQ.tambahFAQ` yang disimpan lewat `CloudflareD1Database.simpanPerubahan` (Algo-030). |
| I-13-07 | Banner galat (kondisional) | "FAQ gagal disimpan. Silakan coba lagi." | Tampil bila penambahan, perubahan, atau penghapusan gagal (UC-07 skenario alternatif 1). |

## 6.14 Rancangan Antarmuka I-14

**Antarmuka:** I-14  
**Nama Layar:** Tanggapi Umpan Balik  
**Kelas View:** `FeedbackView`  
**Use Case:** UC-09

<p align="center">
<img alt="Rancangan Antarmuka I-14 - Tanggapi Umpan Balik" src="./assets/antarmuka/I-14.png" width="300">
</p>
<p align="center">
<i>Gambar 6.14. Rancangan Antarmuka I-14 - Tanggapi Umpan Balik</i>
</p>

Tabel 6.14. Spesifikasi Objek Antarmuka I-14

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-14-01 | AppBar | Tombol kembali dan judul "Umpan Balik" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-14-02 | Chip filter (3 buah) | "Semua", "Belum ditanggapi", "Ditanggapi" | Menyaring daftar umpan balik. |
| I-14-03 | Kartu umpan balik (daftar) | Inisial dan nama pengirim, tanggal, lencana status, isi umpan balik | Data dari `UmpanBalik.ambilListUmpanBalik()` (Algo-018). Menekan kartu membuka kolom tanggapan. |
| I-14-04 | Text area | Label "Tanggapan" | Isi tanggapan dikirim lewat `FeedbackView.tanggapiFeedback(tanggapan)`. |
| I-14-05 | Button | "Kirim Tanggapan" | `FeedbackController.kirimTanggapan(tanggapan)`: `Validasi.validasiInput` (Algo-026), lalu `UmpanBalik.berikanTanggapan` (Algo-019). Tanggapan tampil pada I-11 milik pengirim. |
| I-14-06 | Banner galat (kondisional) | "Tanggapan gagal disimpan. Silakan coba lagi." | Tampil bila tanggapan gagal disimpan. |

## 6.15 Rancangan Antarmuka I-15

**Antarmuka:** I-15  
**Nama Layar:** Status Server  
**Kelas View:** `ServerStatusView`  
**Use Case:** UC-10

<p align="center">
<img alt="Rancangan Antarmuka I-15 - Status Server" src="./assets/antarmuka/I-15.png" width="300">
</p>
<p align="center">
<i>Gambar 6.15. Rancangan Antarmuka I-15 - Status Server</i>
</p>

Tabel 6.15. Spesifikasi Objek Antarmuka I-15

| Id_Objek | Jenis | Konten | Keterangan |
| -------- | ----- | ------ | ---------- |
| I-15-01 | AppBar | Tombol kembali dan judul "Status Server" | Tombol kembali menutup layar dan kembali ke layar sebelumnya. |
| I-15-02 | Kartu | Website: lencana Up/Down dan waktu pemeriksaan terakhir | `ServerStatusView.cekStatusServer("website")` diteruskan ke `ServerStatusController.tampilkanStatusServer` dan `StatusServer.ambilStatusServer` (Algo-020). |
| I-15-03 | Kartu | Server: lencana Up/Down dan waktu pemeriksaan terakhir | Sama seperti I-15-02 dengan jenis "server". |
| I-15-04 | Banner info | "Target ketersediaan minimal 90% (KNF-01)." | Informasi target ketersediaan. |
| I-15-05 | Daftar | Riwayat pemeriksaan: waktu, jenis, lencana Up/Down | Riwayat pemeriksaan terbaru dari tabel `status_server`. |
| I-15-06 | Button | "Periksa Sekarang" | Menjalankan `StatusServer.cekStatusServer()` (Algo-021) untuk kedua jenis, lalu memperbarui I-15-02 dan I-15-03. |

## 6.16 Rancangan Antarmuka Keseluruhan

Daftar seluruh layar beserta ID-nya. ID yang sama dipakai pada subbab perancangan antarmuka masing-masing.

Tabel 6.16. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| -- | ------------------ |
| I-01<br>Masuk | <img src="./assets/antarmuka/I-01.png" alt="I-01 Masuk" width="200"> |
| I-02<br>Beranda Mahasiswa | <img src="./assets/antarmuka/I-02.png" alt="I-02 Beranda Mahasiswa" width="200"> |
| I-03<br>Beranda Administrator | <img src="./assets/antarmuka/I-03.png" alt="I-03 Beranda Administrator" width="200"> |
| I-04<br>Daily Affirmations | <img src="./assets/antarmuka/I-04.png" alt="I-04 Daily Affirmations" width="200"> |
| I-05<br>Pengingat Kesehatan | <img src="./assets/antarmuka/I-05.png" alt="I-05 Pengingat Kesehatan" width="200"> |
| I-06<br>Kalender Terintegrasi | <img src="./assets/antarmuka/I-06.png" alt="I-06 Kalender Terintegrasi" width="200"> |
| I-07<br>Pilih Konsultan | <img src="./assets/antarmuka/I-07.png" alt="I-07 Pilih Konsultan" width="200"> |
| I-08<br>Pilih Sesi dan Konfirmasi | <img src="./assets/antarmuka/I-08.png" alt="I-08 Pilih Sesi dan Konfirmasi" width="200"> |
| I-09<br>FAQ dan Pencarian | <img src="./assets/antarmuka/I-09.png" alt="I-09 FAQ dan Pencarian" width="200"> |
| I-10<br>Form Pengajuan Pertanyaan | <img src="./assets/antarmuka/I-10.png" alt="I-10 Form Pengajuan Pertanyaan" width="200"> |
| I-11<br>Umpan Balik | <img src="./assets/antarmuka/I-11.png" alt="I-11 Umpan Balik" width="200"> |
| I-12<br>Kelola Jadwal Konsultan | <img src="./assets/antarmuka/I-12.png" alt="I-12 Kelola Jadwal Konsultan" width="200"> |
| I-13<br>Kelola FAQ | <img src="./assets/antarmuka/I-13.png" alt="I-13 Kelola FAQ" width="200"> |
| I-14<br>Tanggapi Umpan Balik | <img src="./assets/antarmuka/I-14.png" alt="I-14 Tanggapi Umpan Balik" width="200"> |
| I-15<br>Status Server | <img src="./assets/antarmuka/I-15.png" alt="I-15 Status Server" width="200"> |

<br>

---

# BAB 7: Matriks Kerunutan

Matriks ini memetakan setiap kelas perancangan terhadap _use case_ yang direalisasikannya, mengacu pada BAB 6 _Traceability_ dokumen SKPL dan disesuaikan dengan realisasi _use case_ pada BAB 3.

Tabel 7.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas                               | Use Case Terkait                                                                                                                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| C-01 - `Pengguna`                   | UC-11 - Masuk Melalui Akun Google                                                                                                                                                                                                                                                                            |
| C-02 - `Mahasiswa`                  | UC-01 - Menyetel Daily Affirmations, UC-02 - Menyetel Pengingat Kesehatan, UC-03 - Melihat Kalender Terintegrasi, UC-04 - Memesan Sesi Konsultasi, UC-06 - Melihat FAQ, UC-08 - Memberikan Umpan Balik, UC-09 - Menanggapi Umpan Balik, UC-11 - Masuk Melalui Akun Google, UC-12 - Form Pengajuan Pertanyaan |
| C-03 - `Administrator`              | UC-05 - Mengelola Jadwal Konsultan, UC-07 - Mengelola FAQ, UC-09 - Menanggapi Umpan Balik, UC-10 - Memantau Status Server, UC-11 - Masuk Melalui Akun Google                                                                                                                                                 |
| C-04 - `SesiAutentikasi`            | UC-11 - Masuk Melalui Akun Google                                                                                                                                                                                                                                                                            |
| C-05 - `DailyAffirmation`           | UC-01 - Menyetel Daily Affirmations                                                                                                                                                                                                                                                                          |
| C-06 - `Reminder`                   | UC-02 - Menyetel Pengingat Kesehatan                                                                                                                                                                                                                                                                         |
| C-07 - `Notifikasi`                 | UC-01 - Menyetel Daily Affirmations, UC-02 - Menyetel Pengingat Kesehatan                                                                                                                                                                                                                                    |
| C-08 - `GoogleCalendarService`      | UC-03 - Melihat Kalender Terintegrasi, UC-04 - Memesan Sesi Konsultasi                                                                                                                                                                                                                                       |
| C-09 - `KalenderGabungan`           | UC-03 - Melihat Kalender Terintegrasi, UC-04 - Memesan Sesi Konsultasi, UC-05 - Mengelola Jadwal Konsultan                                                                                                                                                                                                   |
| C-10 - `Konsultan`                  | UC-04 - Memesan Sesi Konsultasi, UC-05 - Mengelola Jadwal Konsultan                                                                                                                                                                                                                                          |
| C-11 - `JadwalKonsultasi`           | UC-03 - Melihat Kalender Terintegrasi, UC-04 - Memesan Sesi Konsultasi, UC-05 - Mengelola Jadwal Konsultan                                                                                                                                                                                                   |
| C-12 - `FAQ`                        | UC-06 - Melihat FAQ, UC-07 - Mengelola FAQ                                                                                                                                                                                                                                                                   |
| C-13 - `PengajuanPertanyaan`        | UC-12 - Form Pengajuan Pertanyaan                                                                                                                                                                                                                                                                            |
| C-14 - `UmpanBalik`                 | UC-08 - Memberikan Umpan Balik, UC-09 - Menanggapi Umpan Balik                                                                                                                                                                                                                                               |
| C-15 - `StatusServer`               | UC-10 - Memantau Status Server                                                                                                                                                                                                                                                                               |
| C-16 - `LoginView`                  | UC-11 - Masuk Melalui Akun Google                                                                                                                                                                                                                                                                            |
| C-17 - `AffirmationView`            | UC-01 - Menyetel Daily Affirmations                                                                                                                                                                                                                                                                          |
| C-18 - `ReminderView`               | UC-02 - Menyetel Pengingat Kesehatan                                                                                                                                                                                                                                                                         |
| C-19 - `CalendarView`               | UC-03 - Melihat Kalender Terintegrasi                                                                                                                                                                                                                                                                        |
| C-20 - `ConsultationBookingView`    | UC-04 - Memesan Sesi Konsultasi                                                                                                                                                                                                                                                                              |
| C-21 - `ConsultationManagementView` | UC-05 - Mengelola Jadwal Konsultan                                                                                                                                                                                                                                                                           |
| C-22 - `FAQView`                    | UC-06 - Melihat FAQ, UC-07 - Mengelola FAQ, UC-12 - Form Pengajuan Pertanyaan                                                                                                                                                                                                                                |
| C-23 - `FeedbackView`               | UC-08 - Memberikan Umpan Balik, UC-09 - Menanggapi Umpan Balik                                                                                                                                                                                                                                               |
| C-24 - `ServerStatusView`           | UC-10 - Memantau Status Server                                                                                                                                                                                                                                                                               |
| C-25 - `AuthController`             | UC-11 - Masuk Melalui Akun Google                                                                                                                                                                                                                                                                            |
| C-26 - `AffirmationController`      | UC-01 - Menyetel Daily Affirmations                                                                                                                                                                                                                                                                          |
| C-27 - `ReminderController`         | UC-02 - Menyetel Pengingat Kesehatan                                                                                                                                                                                                                                                                         |
| C-28 - `CalendarController`         | UC-03 - Melihat Kalender Terintegrasi                                                                                                                                                                                                                                                                        |
| C-29 - `ConsultationController`     | UC-04 - Memesan Sesi Konsultasi, UC-05 - Mengelola Jadwal Konsultan                                                                                                                                                                                                                                          |
| C-30 - `FAQController`              | UC-06 - Melihat FAQ, UC-07 - Mengelola FAQ, UC-12 - Form Pengajuan Pertanyaan                                                                                                                                                                                                                                |
| C-31 - `FeedbackController`         | UC-08 - Memberikan Umpan Balik, UC-09 - Menanggapi Umpan Balik                                                                                                                                                                                                                                               |
| C-32 - `ServerStatusController`     | UC-10 - Memantau Status Server                                                                                                                                                                                                                                                                               |
| C-33 - `Validasi`                   | UC-01 - Menyetel Daily Affirmations, UC-02 - Menyetel Pengingat Kesehatan, UC-04 - Memesan Sesi Konsultasi, UC-05 - Mengelola Jadwal Konsultan, UC-07 - Mengelola FAQ, UC-08 - Memberikan Umpan Balik, UC-09 - Menanggapi Umpan Balik, UC-12 - Form Pengajuan Pertanyaan                                     |
| C-34 - `GoogleAuthService`          | UC-11 - Masuk Melalui Akun Google                                                                                                                                                                                                                                                                            |
| C-35 - `CloudflareD1Database`       | UC-01 - Menyetel Daily Affirmations, UC-02 - Menyetel Pengingat Kesehatan, UC-04 - Memesan Sesi Konsultasi, UC-05 - Mengelola Jadwal Konsultan, UC-07 - Mengelola FAQ, UC-08 - Memberikan Umpan Balik, UC-09 - Menanggapi Umpan Balik, UC-11 - Masuk Melalui Akun Google, UC-12 - Form Pengajuan Pertanyaan                                     |
| C-36 - `HomeView`                   | UC-11 - Masuk Melalui Akun Google |
