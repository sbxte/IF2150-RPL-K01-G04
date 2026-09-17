# M1: Topic Brainstorming

## BAB 1: Analisis Permasalahan

### 1.1 Latar Belakang Masalah

Kesehatan mental itu penting. Namun, masyarakat Indonesia cenderung untuk mengabaikan hal ini. Buktinya, pergi ke psikolog untuk terapi seringkali dipandang sebagai hal yang tabu dan dianggap melemahkan diri.

Selain itu, jumlah kasus bunuh diri di Indonesia cukup tinggi, terutama yang terjadi pada remaja dan mahasiswa. Estimasi IHME dan Global Burden of Disease menyatakan, pada tahun 2023 untuk setiap 100.000 orang, terjadi sekitar 2 kematian akibat bunuh diri di Indonesia.

Di samping kasus bunuh diri, kondisi mental yang kurang ideal menurunkan tingkat produktivitas dan kualitas aktivitas sosial. Kedua faktor ini sangat penting bagi mahasiswa, target utama produk kami, untuk mencapai perkuliahan yang optimal.

Kami ingin mengaitkan latar belakang ini dengan poin ketiga Tujuan Pengembangan Bersama (_Sustainable Development Goals_ [SDGs]), yaitu kehidupan yang sehat dan sejahtera. Perserikatan Bangsa-Bangsa telah mencanangkan sejumlah SDG yang perlu pemerintah dan masyarakat dunia capai sebelum tahun 2030. Namun, pada tahun 2024, terlaporkan bahwa hanya 17% target SDG telah tercapai.

Dari latar belakang ini, diharapkan solusi perangkat lunak ini dapat menjadi sarana untuk menggiatkan kesadaran akan kesehatan mental yang baik dan ketercapaian bersama dalam SDGs di lingkungan kami sebagai mahasiswa, serta memperkaya alternatif solusi yang telah ada.

### 1.2 Analisis Kondisi Saat Ini

[Riliv](https://riliv.co/), [bicarakan.id](http://Bicarakan.id), KALM, 7 Cups, [Headspace](https://www.headspace.com/), BetterHelp, dan Woebot menawarkan beberapa solusi perangkat lunak yang telah dikembangkan sebelumnya. Ada pun _hotline_ yang disediakan oleh pemerintah (SEJIWA, yang dapat diakses via nomor telepon 119 _extension_ 8\) dan lembaga lainnya, seperti LISA Suicide Prevention Helpline, yang diprakarsai oleh 11 LSM dalam kolektif Bali Bersama Bisa.

Namun, terdapat beberapa keluhan yang diberikan oleh _review online_ yang diberikan pengguna. Beberapa hal seperti:

| ID   | Kekurangan                                                                                                                                                                                                                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AK-1 | Aplikasi Riliv tergolong sulit dan kurang sesuai dalam pemakaiannya, terdapat fitur pemesanan konsultasi namun harus mengikuti jadwal yang tersedia dan tidak langsung.                                                                                                 |
| AK-2 | Aplikasi Bicarakan.id yang memiliki kekurangan pada bug aplikasi yang dapat terjadi kapan saja, seperti terjadi pemesanan yang tulisannya selesai namun gagal, pembuatan akun yang terus gagal, pendaftaran yang menggunakan nomor baru namun dituliskan sudah dipakai. |
| AK-3 | Sebagian besar layanan konseling memiliki tarif yang dapat tergolong cukup tinggi maka tidak dapat meng-_cover_ keseluruhan demografi.                                                                                                                                  |
| AK-4 | Layanan BetterHelp yang memiliki marketplace konseling memiliki masalah menaruh iklan yang bersangkutan dengan pihak ketiga yang menjual data pribadi pengguna.                                                                                                         |
| AK-5 | Chatbot Woebot yang pada awalnya memiliki basis pengguna yang cukup tinggi namun karena perusahaan beralih ke model enterprise pengguna-pengguna tersebut ditinggalkan begitu saja tanpa adanya pengganti.                                                              |

---

## BAB 2: Analisis Solusi

### 2.1 Deskripsi Perangkat Lunak

Solusi perangkat lunak yang kami berikan merupakan desktop application yang akan mempromosikan well-being pengguna. Solusi tersebut merupakan solusi yang berkaitan dengan SDG kami yaitu SDG 3, ensure healthy lives and promote well-being for all at all ages. Aplikasi kami akan memfokuskan target berupa mahasiswa sebagai target pengguna, mengingat latar belakang kami yang masih menargetkan kalangan secara umum dan kami rasa hal tersebut masih kurang, maka dari itu kami memfokuskan target pengguna kami adalah mahasiswa. Penargetan tersebut juga akan membantu kami untuk memfokuskan/mempersempit operasional ke dalam kajian mahasiswa saja. Fitur-fitur utama yang kami berupa daily affirmations, pengingat waktu makan, tidur, dan juga pembantu jadwal serta pemesanan sesi konsultasi.

### 2.2 Asumsi dan Batasan

#### 2.2.1 Asumsi

| ID     | Asumsi                                                                                                                                                                                                   |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AB-A-1 | Pengguna (mahasiswa) memiliki akun Google aktif dan bersedia memberikan izin akses ke Google Calendar mereka untuk keperluan integrasi jadwal                                                            |
| AB-A-2 | Pengguna memiliki koneksi internet yang stabil selama menggunakan aplikasi, mengingat fitur-fitur utama (sinkronisasi kalender, pemesanan konsultasi) bergantung pada komunikasi real-time dengan server |
| AB-A-3 | Konselor yang terdaftar bersedia memperbarui ketersediaan jadwal mereka secara berkala melalui sistem                                                                                                    |
| AB-A-4 | Data jadwal dan preferensi yang dimasukkan pengguna (waktu makan, tidur, olahraga) mencerminkan kondisi dan kebutuhan nyata mereka                                                                       |
| AB-A-5 | Pengguna memiliki perangkat yang mendukung environment desktop aplikasi (OS dan spesifikasi minimum yang akan ditentukan)                                                                                |

#### 2.2.2 Regulasi

| ID     | Asumsi                                                  |
| ------ | ------------------------------------------------------- |
| AB-R-1 | UUD 1945 pasal 28H ayat (1)                             |
| AB-R-2 | UU No. 39/1999 tentang HAM                              |
| AB-R-3 | UU No. 3/1966 tentang Kesehatan Jiwa                    |
| AB-R-4 | UU No. 18/2014 tentang Kesehatan Jiwa                   |
| AB-R-5 | UU No. 17/2023 tentang Kesehatan (uu kesehatan omnibus) |
| AB-R-6 | Permenkes No. 54/2017                                   |

#### 2.2.3 Keterbatasan

| ID     | Asumsi                                                                                                                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AB-K-1 | Aplikasi bukan pengganti layanan intervensi krisis atau hotline darurat (seperti SEJIWA 119 ext 8\) — tidak dirancang untuk menangani situasi darurat kesehatan mental                                                    |
| AB-K-2 | Fitur integrasi jadwal bergantung pada ketersediaan dan kebijakan API pihak ketiga (Google Calendar API); jika pengguna mencabut izin akses atau layanan API mengalami gangguan, sinkronisasi jadwal tidak akan berfungsi |
| AB-K-3 | Verifikasi kredensial profesional konselor dilakukan secara manual oleh administrator, bukan otomatis                                                                                                                     |
| AB-K-4 | Konselor yang tersedia terbatas pada mitra yang telah terdaftar dan diverifikasi di dalam sistem, bukan direktori terbuka                                                                                                 |
| AB-K-5 | Sebagai aplikasi desktop, rilis awal tidak mencakup versi mobile                                                                                                                                                          |
| AB-K-6 | Aplikasi tidak menyediakan rekam medis elektronik atau fitur diagnosis klinis                                                                                                                                             |

#### 2.2.4 Ruang Lingkup Solusi

##### 2.2.4.1 Termasuk dalam ruang lingkup

| ID         | Asumsi                                                                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AB-RLS-D-1 | Pengaturan dan pengiriman daily affirmations sesuai jadwal yang ditentukan pengguna                                                                            |
| AB-RLS-D-2 | Pengingat (reminder) makan, tidur, dan olahraga yang dapat dikustomisasi                                                                                       |
| AB-RLS-D-3 | Tampilan jadwal harian terintegrasi dengan Google Calendar pengguna (read access)                                                                              |
| AB-RLS-D-4 | Pemesanan sesi konsultasi dengan konselor, termasuk deteksi bentrok (overlap) antara slot yang dipilih dengan event yang sudah ada di Google Calendar pengguna |
| AB-RLS-D-5 | Panel administrator untuk mengelola ketersediaan konselor dan data pengguna                                                                                    |

##### 2.2.4.2 Di luar ruang lingkup

| ID         | Asumsi                                                           |
| ---------- | ---------------------------------------------------------------- |
| AB-RLS-L-1 | Layanan konseling darurat atau intervensi krisis real-time       |
| AB-RLS-L-2 | Rekam medis elektronik atau riwayat diagnosis klinis pengguna    |
| AB-RLS-L-3 | Sistem pembayaran/billing (belum disebutkan sebagai fitur utama) |
| AB-RLS-L-4 | Aplikasi versi mobile (native Android/iOS) pada rilis awal       |
| AB-RLS-L-5 | Fitur komunitas atau forum antar-pengguna                        |

## BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

### 3.1 Identifikasi Aktor

| Aktor         | Deskripsi                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------ |
| Mahasiswa     | Pengguna ini berlaku sebagai pengguna utama dari aplikasi ini.                             |
| Administrator | Pengguna ini berperan untuk merawat dan mengelola keberjalanan dari aplikasi ini.          |
| Konselor      | Pengguna ini akan mengatur jadwal ketersediaan untuk sesi konseling di dalam aplikasi ini. |

### 3.2 Kebutuhan Pengguna Awal

| ID    | Aktor     | Kebutuhan / Aktivitas                                               | Tujuan / Nilai                                                                                       |
| ----- | --------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| US-01 | Mahasiswa | Mendapatkan semangat dan kepercayaan diri dari _daily affirmations_ | Menjaga mood dan mental tetap stabil di tengah kekacauan kuliah                                      |
| US-02 | Mahasiswa | Mendapatkan pengingat makan sesuai jadwal harian                    | Menjaga kesehatan fisik agar tidak kehilangan kontrol terhadap ritme kuliah                          |
| US-03 | Mahasiswa | Mendapatkan pengingat tidur sesuai jadwal harian                    | Menjaga kesehatan fisik agar tidak kehilangan kontrol terhadap ritme kuliah                          |
| US-04 | Mahasiswa | Menginput dan melihat jadwal sehari hari secara simpel dan mudah    | Mengurangi stress akibat banyaknya tugas agar dapat ditangani serta menghilangkan beban perencanaaan |
| US-05 | Mahasiswa | Memesan bantuan profesional pada jadwal yang diinginkan             | Mengurangi gesekan dalam mencari bantuan profesional                                                 |
| US-06 | Mahasiswa | Mendapatkan pengingat olahraga sesuai jadwal harian                 | Menjaga kesehatan fisik agar tidak kehilangan kontrol terhadap ritme kuliah                          |

### 3.3 Deskripsi Aktivitas

| ID   | Aktivitas                                     | Penjelasan                                                                                                                                                                        | ID User Story |
| ---- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| A-01 | Menyetel daily affirmations                   | Pengguna dapat mengatur kapan mendapatkan daily affirmations lewat aplikasi.                                                                                                      | US-01         |
| A-02 | Melihat jadwal sehari-hari secara keseluruhan | Pengguna dapat melihat jadwal sehari-hari lewat integrasi dengan google calendar termasuk jadwal reminder dan event-event lain yang ada di jadwal google calendar pengguna.       | US-04         |
| A-03 | Menyetel reminder makan                       | Pengguna dapat mengatur kapan diberikan reminder lewat aplikasi.                                                                                                                  | US-02         |
| A-04 | Menyetel reminder tidur                       | Pengguna dapat mengatur kapan diberikan reminder lewat aplikasi.                                                                                                                  | US-03         |
| A-05 | Mengatur reminder olahraga                    | Pengguna dapat mengatur kapan diberikan reminder lewat aplikasi.                                                                                                                  | US-06         |
| A-06 | Menjadwalkan konsultasi dengan tenaga medis   | Pengguna dapat melihat jadwal konsultasi yang tersedia sekaligus melihat apakah jadwal tersebut bertabrakan dengan jadwal yang sudah ada di kalender pengguna di google calendar. | US-05         |

### 3.4 Model Proses Bisnis

<p align="center">
<img alt="Contoh Activity Diagram" src="M1/assets/diagram/diagram-act-1.png" width="70%">
  </p>
<p align="center">
<i>Gambar 1. Model Proses Bisnis Sehati</i>
<br>
www.drawio.com
</p>

## References

- [https://garuda.kemdiktisaintek.go.id/documents/detail/4396353](https://garuda.kemdiktisaintek.go.id/documents/detail/4396353)
- [https://play.google.com/store/apps/details?id=id.bicarakan.client_app](https://play.google.com/store/apps/details?id=id.bicarakan.client_app)
- [https://play.google.com/store/apps/details?id=com.icreativelabs.sahabatku](https://play.google.com/store/apps/details?id=com.icreativelabs.sahabatku&hl=id)
- [https://play.google.com/store/apps/details?id=com.betterhelp\&hl=id](https://play.google.com/store/apps/details?id=com.betterhelp&hl=id)
- [https://psycnet.apa.org/doiLanding?doi=10.1037%2Fsah0000392](https://psycnet.apa.org/doiLanding?doi=10.1037%2Fsah0000392)
- [https://ourworldindata.org/grapher/suicide-death-rates?tab=line\&country=\~IDN\&mapSelect=\~IDN\&globe=1\&globeRotation=-2.27%2C117.36\&globeZoom=2.5](https://ourworldindata.org/grapher/suicide-death-rates?tab=line&country=~IDN&mapSelect=~IDN&globe=1&globeRotation=-2.27%2C117.36&globeZoom=2.5)
- [https://databoks.katadata.co.id/demografi/statistik/636e76fcf8dc70d/berapa-angka-bunuh-diri-di-indonesia](https://databoks.katadata.co.id/demografi/statistik/636e76fcf8dc70d/berapa-angka-bunuh-diri-di-indonesia)
- [De Oliveira, Claire, et al. "The Role of Mental Health on Workplace Productivity: A Critical Review of the Literature: C. de Oliveira et al." _Applied health economics and health policy_ 21.2 (2023): 167-193.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9663290/pdf/40258_2022_Article_761.pdf)
- [Sayce, Liz. "Social inclusion and mental health." _Psychiatric Bulletin_ 25.4 (2001): 121-123.](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/36D14A7DEF64A0CE9F7CFF3728A89DFA/S095560360009588Xa.pdf/social_inclusion_and_mental_health.pdf)
- [https://www.undp.org/sustainable-development-goals/good-health](https://www.undp.org/sustainable-development-goals/good-health)
- Diagram UML: https://www.drawio.com/, https://staruml.io/
- Konflik Riliv: [Garuda Kemdiktisaintek](https://garuda.kemdiktisaintek.go.id/documents/detail/4396353)
- Ulasan Bicarakan.id: [https://play.google.com/store/apps/details?id=id.bicarakan.client_app](https://play.google.com/store/apps/details?id=id.bicarakan.client_app)
- Ulasan Sahabatku: [https://play.google.com/store/apps/details?id=com.icreativelabs.sahabatku](https://play.google.com/store/apps/details?id=com.icreativelabs.sahabatku&hl=id)
- Ulasan BetterHelp: [https://play.google.com/store/apps/details?id=com.betterhelp\&hl=id](https://play.google.com/store/apps/details?id=com.betterhelp&hl=id)

# M2: Requirement Gathering

## BAB 1: Deskripsi Umum

### 1.1 Deskripsi Umum Sistem

Melalui “Sehati”, pengguna utama diharapkan untuk bisa memesan jadwal sesi terapi, utamanya. Selain itu, ada aksi-aksi tambahan yang dapat dilakukan, seperti melihat daily affirmation dan pengingat makan, olahraga, dan tidur. Semua ini dilakukan melalui akun (?). Bagi konselor, mereka bisa mendaftarkan diri (melalui akun juga?) dan menjadwalkan sesi terapi.

### 1.2 Deskripsi Pengguna Perangkat Lunak

| Aktor         | Deskripsi                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mahasiswa     | Pengguna ini akan menggunakan fitur-fitur pengingat makan, olahraga, dan tidur serta mendapatkan daily affirmations dan dapat memesan sesi konsultasi |
| Administrator | Pengguna ini akan menambahkan jadwal konsultasi sesuai jadwal yang terdapat pada informasi konsultan.                                                 |

## BAB 2: Deskripsi Kebutuhan Perangkat Lunak

### 2.1 Kebutuhan Pengguna Awal

| ID    | Aktor                    | Kebutuhan / Aktivitas                                            | Tujuan / Nilai                                                                               |
| ----- | ------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| US-01 | Mahasiswa                | Mendapatkan notifikasi pengiriman _daily affirmations_           | Menjaga _mood_ dan mental tetap stabil dan sehat.                                            |
| US-02 | Mahasiswa                | Mendapatkan pengingat makan sesuai jadwal harian                 | Menjaga kesehatan fisik                                                                      |
| US-03 | Mahasiswa                | Mendapatkan pengingat tidur sesuai jadwal harian                 | Menjaga kesehatan fisik                                                                      |
| US-04 | Mahasiswa                | Menginput dan melihat jadwal sehari-hari secara simpel dan mudah | Memudahkan untuk mengetahui kegiatan yang sedang dan akan dilakukan tanpa berpindah aplikasi |
| US-05 | Mahasiswa                | Memesan sesi konsultasi pada jadwal yang diinginkan              | Menjadikan proses pemesanan lebih fleksibel                                                  |
| US-06 | Mahasiswa                | Mendapatkan pengingat olahraga sesuai jadwal harian              | Menjaga kesehatan fisik                                                                      |
| US-07 | Administrator            | Memasukkan jadwal sesi konsultasi pada sistem                    | Menjadikan data jadwal sesi konsultasi tersedia ke sistem dan dapat diakses                  |
| US-08 | Administrator            | Menjaga dan mengelola sistem                                     | Menjaga kestabilan dan keandalan aplikasi dan sistem                                         |
| US-09 | Mahasiswa, Administrator | Masuk ke aplikasi menggunakan akun Google                        | Memudahkan proses login tanpa perlu membuat dan mengingat kredensial baru                    |

### 2.2 Deskripsi Aktivitas

| ID   | Aktivitas                                              | Penjelasan                                                                                                                                                                        | ID _User_ Story |
| ---- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| A-01 | Menyetel jadwal pengiriman _daily affirmations_        | Pengguna dapat mengatur kapan mendapatkan _daily affirmations_ lewat aplikasi.                                                                                                    | US-01           |
| A-02 | Melihat jadwal sehari-hari secara keseluruhan          | Pengguna dapat melihat jadwal sehari-hari lewat integrasi Google Calendar termasuk jadwal pengingat dan kegiatan-kegiatan lain yang ada di jadwal Google Calendar pengguna.       | US-04           |
| A-03 | Menyetel pengingat makan                               | Pengguna dapat mengatur kapan diberikan pengingat lewat aplikasi.                                                                                                                 | US-02           |
| A-04 | Menyetel pengingat tidur                               | Pengguna dapat mengatur kapan diberikan pengingat lewat aplikasi.                                                                                                                 | US-03           |
| A-05 | Mengatur pengingat olahraga                            | Pengguna dapat mengatur kapan diberikan pengingat lewat aplikasi.                                                                                                                 | US-06           |
| A-06 | Menjadwalkan konsultasi dengan konselor                | Pengguna dapat melihat jadwal konsultasi yang tersedia sekaligus melihat apakah jadwal tersebut bertabrakan dengan jadwal yang sudah ada di kalender pengguna di Google Calendar. | US-05           |
| A-07 | Menginput jadwal konsultan pada _database_             | Admin memasukkan jadwal konsultan ke database agar dapat dilihat di kalender pengguna                                                                                             | US-07           |
| A-08 | Membuat FAQ                                            | Admin membantu dalam pembuatan FAQ dari A-10 yang sering diberikan                                                                                                                | US-08           |
| A-09 | Meng-_update_ dan melakukan pengecekan terhadap server | Admin melakukan regulasi melalui pengecekan dan update keadaan server (servis up/down)                                                                                            | US-08           |
| A-10 | Merespons terhadap umpan balik pengguna                | Admin membantu pengguna dalam penggunaan aplikasi                                                                                                                                 | US-08           |
| A-11 | Melakukan autentikasi melalui akun Google              | Pengguna masuk ke aplikasi dengan akun Google mereka, dan sistem memverifikasi identitas tersebut sebelum memberikan akses ke fitur aplikasi.                                     | US-09           |

### 2.3 Pemetaan Kebutuhan

| ID Kebutuhan | ID Aktivitas     | Jenis Kebutuhan | Deskripsi Kebutuhan                                                                                                                | P/L   |
| ------------ | ---------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----- |
| R-01         | A-01             | _User_          | _User_ dapat mengubah kapan mereka menerima _daily affirmations_ saat diinginkan                                                   | Ya    |
| R-02         | A-01             | _System_        | Sistem dapat menyimpan preferensi _user_ dengan menggunakan _cookies_                                                              | Ya    |
| R-03         | A-02             | _User_          | _User_ dapat melihat kalender dari aplikasi                                                                                        | Ya    |
| R-04         | A-02             | _System_        | Sistem dapat menampilkan kalender di aplikasi yang merupakan cerminan dari Google Calendar pengguna                                | Ya    |
| R-05         | A-03             | _User_          | _User_ dapat menyetel kapan saja ia ingin diingatkan untuk makan                                                                   | Ya    |
| R-06         | A-04             | _User_          | _User_ dapat menyetel kapan saja ia ingin diingatkan untuk tidur                                                                   | Ya    |
| R-07         | A-05             | _User_          | _User_ dapat menyetel kapan saja ia ingin diingatkan untuk olahraga                                                                | Ya    |
| R-08         | A-03, A-04, A-05 | _System_        | Sistem dapat menerima reminder dan secara sukses memberikan notifikasi ketika reminder tersebut dilewati                           | Ya    |
| R-09         | A-06             | _User_          | _User_ dapat memesan jadwal sesuai sesi yang telah terdaftar di sistem                                                             | Ya    |
| R-10         | A-06             | _System_        | Sistem dapat mengambil data (melakukan GET _request_) dari _database_ untuk ditampilkan ke pengguna                                | Ya    |
| R-11         | A-07             | _System_        | Sistem dapat menyimpan data jadwal sesi konsultasi pada _database_                                                                 | Ya    |
| R-12         | A-07             | _Business_      | Konsultan harus memberikan jadwalnya kepada administrator untuk mendaftarkannya di sistem                                          | Ya    |
| R-13         | A-08             | _System_        | Sistem harus memiliki sistem/media pemberian umpan balik                                                                           | Ya    |
| R-14         | A-08             | _System_        | Sistem harus menampilkan pertanyaan-pertanyaan yang sering diberikan _User_ pada suatu tempat di aplikasi                          | Ya    |
| R-15         | A-08             | _Business_      | Pengguna harus dapat memberikan umpan balik terhadap aplikasi                                                                      | Ya    |
| R-16         | A-09             | _System_        | Administrator melakukan pengecekan berkala pada aplikasi dan mengecek apakah sistem sedang _down_/tidak                            | Ya    |
| R-17         | A-09             | _Business_      | Administrator melakukan pelaporan jika terdapat kendala pada aplikasi                                                              | Tidak |
| R-18         | A-10             | _System_        | Sistem harus dapat menerima dan Administrator harus dapat memberikan komentar pada umpan balik _User_                              | Ya    |
| R-19         | N/A              | _System_        | Sistem dapat memastikan data pengguna tidak dapat diakses oleh pihak tak berwenang                                                 | Ya    |
| R-20         | N/A              | _System_        | Sistem dapat dinavigasikan dengan Mudah                                                                                            | Ya    |
| R-21         | A-11             | _System_        | Sistem dapat mengautentikasi pengguna (Mahasiswa dan Administrator) melalui akun Google sebelum memberikan akses ke fitur aplikasi | Ya    |

### 2.4 Kebutuhan Fungsional (KF)

| ID KF | ID Kebutuhan     | Penjelasan                                                                                                                                                                               |
| ----- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KF-01 | R-01             | Sistem menyediakan opsi untuk menyetel waktu pengiriman _daily affirmations_ dan dapat mengirim notifikasi _daily affirmations_ di waktu yang disetel                                    |
| KF-02 | R-03             | Sistem dapat mengambil data Google Calendar pengguna melalui API yang tersedia dan menampilkannya di antarmuka                                                                           |
| KF-03 | R-04, R-05, R-06 | Sistem menyediakan opsi untuk menyetel waktu pengiriman pengingat makan, tidur, olahraga dan dapat mengirim pengingatnya di waktu yang disetel                                           |
| KF-04 | R-07             | Sistem memberikan tampilan notifikasi di mana pun user berada dalam aplikasi, dilengkapi juga dengan konten seperti label yang diberikan pengguna                                        |
| KF-05 | R-08             | Sistem dapat menampilkan kalender yang telah terintegrasi dengan Google Calendar pengguna lalu memberikan kalender gabungan dengan data jadwal sesi konsultasi yang terdapat di database |
| KF-06 | R-09, R-10       | Sistem dapat mengambil data jadwal dari database dan dapat ditampilkan data tersebut ke pengguna                                                                                         |
| KF-07 | R-12             | Sistem dapat menampilkan daftar pertanyaan yang sering diajukan (FAQ) pada aplikasi.                                                                                                     |
| KF-08 | R-14             | Sistem menyediakan fitur bagi pengguna untuk memberikan umpan balik terhadap aplikasi.                                                                                                   |
| KF-09 | R-15             | Sistem dapat menampilkan status server (up/down) kepada administrator.                                                                                                                   |
| KF-10 | R-17             | Sistem dapat memberikan akses kepada administrator untuk memberikan tanggapan/feedback terhadap umpan balik pengguna.                                                                    |
| KF-11 | R-22             | Sistem dapat memverifikasi identitas pengguna melalui login akun Google dan memberikan akses ke aplikasi setelah autentikasi berhasil.                                                   |

### 2.5 Kebutuhan Non-Fungsional (KNF)

| ID KNF | ID Kebutuhan | Parameter       | Deskripsi Kebutuhan                                                       |
| ------ | ------------ | --------------- | ------------------------------------------------------------------------- |
| KNF-01 | R-08         | Availability    | P/L dapat tersedia setiap saat dengan minimal uptime 90%                  |
| KNF-02 | R-29         | Security        | P/L hdapat mengamankan datanya dari pihak tak berwenang                   |
| KNF-03 | R-20         | Ergonomy        | P/L dapat dengan mudah digunakan untuk mahasiswa 18-24 tahum              |
| KNF-04 | R-09         | Reliability     | P/L dapat memberikan feedback menuju administrator                        |
| KNF-05 | R-19         | Security        | P/L harus menjamin kerahasiaan dan keamanan data                          |
| KNF-06 | R-20         | Ergonomy        | P/L Harus mempunyai UI yang intuitif bagi demografis mahasiswa umur 18-24 |
| KNF-07 | R-11         | Maintainability | Sistem dapat memodifikasi jadwal tanpa merubah Source Kode                |

<br>

## References

- [https://www.geeksforgeeks.org/software-engineering/software-engineering-software-maintenance/](https://www.geeksforgeeks.org/software-engineering/software-engineering-software-maintenance/)

# M3: Use Cases

## 3.1 Identifikasi Aktor

| Aktor         | Deskripsi                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mahasiswa     | Pengguna ini akan menggunakan fitur-fitur pengingat makan, olahraga, dan tidur serta mendapatkan daily affirmations dan dapat memesan sesi konsultasi |
| Administrator | Pengguna ini akan menambahkan jadwal konsultasi sesuai jadwal yang terdapat pada informasi konsultan.                                                 |

## 3.2 Identifikasi Use Case

| ID UC | Nama Use Case                 | Deskripsi Singkat                                                                                           | Aktor Terlibat           | ID KF Terkait       |
| ----- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- |
| UC-01 | Menyetel Daily Affirmations   | Mahasiswa mengatur waktu penerimaan daily affirmations dan menerima notifikasinya.                          | Mahasiswa                | KF-01, KF-02        |
| UC-02 | Menyetel Pengingat Kesehatan  | Mahasiswa mengatur waktu pengingat makan, tidur, dan olahraga, serta menerima notifikasinya.                | Mahasiswa                | KF-03, KF-04        |
| UC-03 | Melihat Kalender Terintegrasi | Mahasiswa melihat jadwal gabungan antara Google Calendar dan jadwal sesi konsultasi dalam satu tampilan.    | Mahasiswa                | KF-02, KF-05, KF-06 |
| UC-04 | Memesan Sesi Konsultasi       | Mahasiswa memilih dan memesan sesi konsultasi pada jadwal yang tersedia.                                    | Mahasiswa                | KF-05, KF-06        |
| UC-05 | Mengelola Jadwal Konsultan    | Administrator memasukkan dan memperbarui jadwal sesi konsultasi ke dalam sistem tanpa mengubah source code. | Administrator            | KF-06               |
| UC-06 | Melihat FAQ                   | Mahasiswa membuka dan mencari daftar pertanyaan yang sering diajukan.                                       | Mahasiswa                | KF-07               |
| UC-07 | Mengelola FAQ                 | Administrator menambah, mengubah, atau menghapus daftar FAQ.                                                | Administrator            | KF-07               |
| UC-08 | Memberikan Umpan Balik        | Mahasiswa mengirimkan umpan balik terhadap aplikasi.                                                        | Mahasiswa                | KF-08               |
| UC-09 | Menanggapi Umpan Balik        | Administrator melihat dan memberikan tanggapan atas umpan balik yang masuk.                                 | Administrator            | KF-10               |
| UC-10 | Memantau Status Server        | Administrator memeriksa status up/down server secara berkala.                                               | Administrator            | KF-09               |
| UC-11 | Masuk Melalui Akun Google     | Pengguna login ke aplikasi menggunakan akun Google sebelum mengakses fitur lainnya.                         | Mahasiswa, Administrator | KF-11               |
| UC-12 | Form Pengajuan pertanyaan     | Pengguna mengajukan pertanyaan diluar yang ada di FAQ                                                       | Mahasiswa                | KF-07               |

## 3.3 Use Case Diagram

<br>

<p align="center">
<img alt="Use Case Diagram di DRAW.IO" src="/docs/M3/assets/diagram/UCD.png" width="70%">
</p>
<p align="center">
<i>Gambar 1. Use case Diagram</i>
</p>
<br>

## 3.4 Skenario Use Case

### 3.4.1 Skenario UC01

**Nama Use Case:** _Melakukan Pembayaran Digital_

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | _Pelanggan memilih menu checkout_ | _Sistem menampilkan ringkasan pesanan dan pilihan metode pembayaran_ |
| 2 | _Pelanggan memilih metode pembayaran (misal: e-wallet)_ | _Sistem mengarahkan pelanggan ke halaman konfirmasi e-wallet_ |
| 3 | _Pelanggan mengonfirmasi pembayaran_ | _Sistem menerima respons pembayaran berhasil, memperbarui status pesanan menjadi "Lunas", dan menampilkan notifikasi pembayaran berhasil_ |

<br>

**Skenario Alternatif 1: Otorisasi Pembayaran Gagal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | _Pelanggan memilih menu checkout_ | _Sistem menampilkan ringkasan pesanan dan pilihan metode pembayaran_ |
| 2 | _Pelanggan memilih metode pembayaran (misal: e-wallet)_ | _Sistem mengarahkan pelanggan ke halaman konfirmasi e-wallet_ |
| 3 | _Pelanggan mengonfirmasi pembayaran_ | _Sistem menerima respons pembayaran gagal (misal: saldo tidak cukup). Sistem menampilkan pesan error dan meminta pelanggan memilih metode pembayaran lain_ |
| 4 | _Pelanggan memilih metode pembayaran lain_ | _Sistem kembali ke langkah 2 skenario normal_ |

### 3.4.2 Skenario UC02

**Nama Use Case:** _Memverifikasi Status Pembayaran_

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | _Kasir memasukkan ID Pesanan pelanggan_ | _Sistem menampilkan status pembayaran ("Lunas") beserta detail transaksi_ |

<br>

**Skenario Alternatif 1: ID Pesanan Tidak Ditemukan**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | _Kasir memasukkan ID Pesanan yang salah/tidak ada_ | _Sistem menampilkan pesan "ID Pesanan tidak ditemukan" dan meminta kasir memasukkan ulang_ |

### 3.4.6 Skenario UC-06

**Nama Use Case:** Melihat FAQ

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Mahasiswa mencari pertanyaan di search bar FAQ | Sistem menunjukkan pertanyaan dan jawaban yang disediakan |

<br>

\*\*Skenario Alternatif 1: Tidak ada pertanyaan yang dicari pengguna

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Mahasiswa mencari pertanyaan di search bar FAQ | Sistem tidak menunjukkan pertanyaan yang dicari mahasiswa, lalu menawarkan untuk mengajukan pertanyaan di forum |

### 3.4.7 Skenario UC-07

**Nama Use Case:** Mengelola FAQ

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Admin menambahkan pertanyaan dan jawaban di FAQ | Sistem berhasil menambahkan pertanyaan & jawabannya di database |
| 2 | Admin mengurangi pertanyaan di FAQ | Sistem berhasil menghapus pertanyaan (dan jawabannya) dari database |
| 3 | Admin mengubah pertanyaan dan/atau jawaban di FAQ | Sistem berhasil menyimpan perubahan pertanyaan dan/atau jawaban pada database |

<br>

\*\*Skenario Alternatif 1: Tidak ada pertanyaan maupun jawaban yang berhasil disimpan

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Admin menambahkan pertanyaan dan jawaban di FAQ | Sistem tidak menambahkan pertanyaan maupun jawabannya di database |
| 2 | Admin mengurangi pertanyaan di FAQ | Sistem tidak menghapus pertanyaan (dan jawabannya) dari database |
| 3 | Admin mengubah pertanyaan dan/atau jawaban di FAQ | Sistem tidak menyimpan perubahan pertanyaan dan/atau jawaban pada database |

### 3.4.8 Skenario UC-08

**Nama Use Case:** Memberikan Umpan Balik

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Mahasiswa memberikan umpan balik di forum pemberian umpan balik | Sistem menerima dan menyimpan umpan balik pada database |

<br>

\*\*Skenario Alternatif 1: Umpan balik tidak disimpan pada database

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Mahasiswa memberikan umpan balik di forum pemberian umpan balik | Sistem tidak menerima dan tidak menyimpan umpan balik pada database |

### 3.4.9 Skenario UC-09

**Nama Use Case:** Menanggapi Umpan Balik

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Admin memberikan tanggapan pada umpan balik yang diterima oleh mahasiswa | Sistem menunjukkan jawaban dari tanggapan yang diberikan admin |

<br>

\*\*Skenario Alternatif 1: Tanggapan umpan balik tidak berhasil ditampilkan

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Admin memberikan tanggapan pada umpan balik yang diterima oleh mahasiswa | Sistem tidak menunjukkan konten pada tampilan mahasiswa |

### 3.4.10 Skenario UC-10

**Nama Use Case:** Memantau Status Server

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Admin melihat status uptime website | Sistem memberikan status uptime website |
| 2 | Admin melihat status uptime server | Sistem menunjukkan status uptime server |

<br>

### 3.4.11 Skenario UC-11

**Nama Use Case:** Masuk Melalui Akun Google

**Skenario Normal**

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Mahasiswa melakukan autentikasi dengan akun Google | Sistem menampilkan tampilan selanjutnya setelah login berhasil |

<br>

\*\*Skenario Alternatif 1: OAuth Google tidak berfungsi saat login

| No | Aksi Aktor | Reaksi Perangkat Lunak |
| --- | --- | --- |
| 1 | Mahasiswa melakukan autentikasi dengan akun Google | Sistem tidak melakukan login untuk mahasiswa, mahasiswa kembali ke login screen |
