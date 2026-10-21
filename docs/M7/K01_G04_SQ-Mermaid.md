# Sequence Diagram Sehati (Salinan Mermaid)

Salinan Mermaid dari seluruh _sequence diagram_ UC-01 sampai UC-12, sudah memakai perbaikan yang diusulkan. Setiap pesan adalah operasi yang ada pada kelas penerimanya di diagram kelas (BAB 3 dan Tabel 4.1 DPPL). Setiap skenario alternatif digambar sebagai diagram sendiri. Setiap diagram dapat diekspor ke PNG lewat mermaid.live.

Pesan balasan (garis putus-putus) berisi nilai kembalian, atau nama operasi tampilan pada `View` saat hasil ditampilkan ke aktor.

## UC-01 Menyetel Daily Affirmations

### Skenario Normal

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

### Skenario Alternatif 1: Sistem tidak mampu menyimpan setelan

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

### Perbaikan terhadap PNG

- Nama pesan disamakan dengan operasi pada diagram kelas, mis. `bukaPageAffirmasi()` dan `submitWaktuPengiriman(waktu)`.
- Penyimpanan ke D1 dilakukan oleh `DailyAffirmation` lewat `simpanWaktuKirim(waktu)`, sama seperti PNG.
- Fragmen `alt` pada PNG dipisah menjadi diagram skenario alternatif sendiri.

## UC-02 Menyetel Pengingat Kesehatan

### Skenario Normal

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

### Skenario Alternatif 1: Sistem tidak mampu menyimpan setelan

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

### Perbaikan terhadap PNG

- Sama seperti UC-01, dengan `ReminderView`, `ReminderController`, dan `Reminder`.
- Operasi `aturWaktuKirim(waktu)` dipakai (PNG memakai nama itu juga), bukan `aturWaktuPengingat()` dari M4.

## UC-03 Melihat Kalender Terintegrasi

### Skenario Normal

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

### Skenario Alternatif 1: Sistem tidak mampu mengambil data event

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

### Perbaikan terhadap PNG

- `ShowErrorMessage()` menjadi `showErrorMessage(pesan)`, dan `Tampilkan Calender()` menjadi `tampilkanCalendar()`.
- `ambilKalender()` pada `JadwalKonsultasi` dipanggil tanpa parameter (overload pada diagram kelas).
- Ditambahkan catatan tombol Refresh dari SKPL pada skenario alternatif.

## UC-04 Memesan Sesi Konsultasi

### Skenario Normal

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

### Skenario Alternatif 1: Sistem tidak mampu mengambil data jadwal konsultasi

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

### Skenario Alternatif 2: Sistem tidak mampu menyimpan jadwal konsultasi yang dipesan

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

### Perbaikan terhadap PNG

- `GoogleCalendarService` ditambahkan: `KalenderGabungan.jadwalBentrok()` memanggil `cekBentrokJadwal()` (SKPL AB-RLS-D-4). Pada PNG kelas ini tidak ada.
- Urutan diubah: simpan dulu (`ubahKalender()` lalu `simpanKalender()`), baru `pesanSesi()`, agar status jadwal tidak berubah bila penyimpanan gagal.
- File PNG diganti nama dari `UC-04_SQ_diagram(1).png` menjadi `UC-04_SQ_diagram.png`.

## UC-05 Mengelola Jadwal Konsultan

### Skenario Normal

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

### Skenario Alternatif 1: Sistem tidak mampu mengambil data jadwal konsultasi

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

### Skenario Alternatif 2: Sistem tidak mampu mengedit data jadwal konsultasi

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

### Perbaikan terhadap PNG

- Alur dipisah dari fragmen `alt` pada PNG menjadi dua skenario alternatif sesuai SKPL.
- Nama pesan disamakan dengan operasi pada diagram kelas, mis. `validasiJadwal(jadwal)` dan `ubahKalender(jadwal)`.

## UC-06 Melihat FAQ

### Skenario Normal

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

### Skenario Alternatif 1: Tidak ada pertanyaan yang dicari pengguna

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

### Perbaikan terhadap PNG

- Ditambahkan pencarian `cariFAQ(kataKunci)` karena SKPL berbunyi "mencari pertanyaan di search bar FAQ". PNG tidak punya pencarian.
- Skenario alternatif ditambahkan (hasil kosong lalu tawaran pengajuan pertanyaan). PNG tidak memilikinya.

## UC-07 Mengelola FAQ

### Skenario Normal

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

### Skenario Alternatif 1: Tidak ada pertanyaan maupun jawaban yang berhasil disimpan

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

### Perbaikan terhadap PNG

- Controller tidak lagi memanggil D1 langsung. `FAQ` menyimpan lewat `simpanPerubahan(data)`, sesuai MVC.
- Ketiga aksi pada SKPL (tambah, hapus, ubah) digambar. PNG hanya memuat ubah.
- `FAQ` diberi atribut `idFAQ` agar `hapusFAQ` dan `ubahFAQ` dapat menunjuk satu FAQ.

## UC-08 Memberikan Umpan Balik

### Skenario Normal

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

### Skenario Alternatif 1: Umpan balik tidak disimpan pada database

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

### Perbaikan terhadap PNG

- Participant `Feedback` diganti `UmpanBalik` (nama kelas pada SKPL dan APL).
- D1 dipanggil oleh `UmpanBalik.kirimUmpanBalik()`, bukan langsung oleh controller.

## UC-09 Menanggapi Umpan Balik

### Skenario Normal

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

### Skenario Alternatif 1: Tanggapan umpan balik tidak berhasil ditampilkan

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

### Perbaikan terhadap PNG

- Participant `Feedback` diganti `UmpanBalik`, dan D1 dipanggil oleh `UmpanBalik.berikanTanggapan()`.
- Skenario alternatif mengikuti SKPL: tanggapan Administrator tersimpan, tetapi tidak ditampilkan pada tampilan Mahasiswa. PNG memodelkannya sebagai kegagalan menyimpan. `Mahasiswa` ditambahkan ke kelas UC-09 karena ikut terlibat.

## UC-10 Memantau Status Server

### Skenario Normal

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

### Perbaikan terhadap PNG

- Ditambahkan parameter `jenis` ("website" dan "server") karena SKPL meminta kedua status. PNG hanya memuat status server.

## UC-11 Masuk Melalui Akun Google

### Skenario Normal

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
    GoogleAuthService-->>-AuthController: valid
    AuthController->>+SesiAutentikasi: autentikasiPengguna(kodeOtorisasi)
    SesiAutentikasi-->>-AuthController: sesi dibuat
    AuthController-->>-LoginView: login berhasil
    LoginView-->>-Pengguna: loadPageUtama()
```

### Skenario Alternatif 1: OAuth Google tidak berfungsi saat log in

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

### Perbaikan terhadap PNG

- Validasi Google dipanggil lewat `GoogleAuthService.validasi(kodeOtorisasi)`, dan `SesiAutentikasi.autentikasiPengguna()` hanya dipanggil bila Google menyatakan valid.
- Fragmen `alt` pada PNG dipisah menjadi skenario alternatif sendiri.

## UC-12 Form Pengajuan Pertanyaan

### Skenario Normal

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

### Skenario Alternatif 1: Pertanyaan tidak tersimpan di database

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

### Perbaikan terhadap PNG

- PNG UC-12 identik dengan PNG UC-08 (berisi `Feedback`). Diagram ini dibuat ulang untuk `PengajuanPertanyaan`.
- Alur: `FAQView` lalu `FAQController`, `Validasi`, `PengajuanPertanyaan`, dan D1, sesuai deskripsi komponen pada APL.
