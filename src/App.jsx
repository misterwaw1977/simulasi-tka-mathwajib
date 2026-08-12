import React, { useState, useEffect, useRef, useCallback } from "react";

const INK = "#1F2A44";
const INK_SOFT = "#445069";
const PENCIL = "#6B6B63";
const CORRECT = "#2F6B4F";
const INCORRECT = "#B23A2E";
const STAMP = "#B8791F";
const PAPER = "#EAEDE4";
const PAPER_LINE = "#CBCFBC";
const CARD = "#F6F7F1";
const STIM_BG = "#F1E9D8";

const LETTERS = ["A", "B", "C", "D", "E"];
const TYPE_LABELS = { pg: "PG", pgk: "PGK", bs: "Benar/Salah" };

const DEFAULT_QUESTIONS = [
  {
    id: 1, type: "pg", kategori: "Literasi Numerik", topik: "Aritmetika Sosial",
    stimulus: {
      intro: "Sebuah toko menjual dua merek beras dengan kemasan berbeda.",
      table: { headers: ["Merek", "Berat kemasan", "Harga"], rows: [["Beras A", "5 kg", "Rp72.000"], ["Beras B", "2 kg", "Rp31.000"]] },
    },
    soal: "Berdasarkan data tersebut, beras manakah yang harganya lebih murah per kilogram, dan berapa selisih harga per kilogram antara keduanya?",
    options: ["Beras A lebih murah, selisih Rp1.100/kg", "Beras B lebih murah, selisih Rp1.100/kg", "Beras A lebih murah, selisih Rp2.100/kg", "Beras B lebih murah, selisih Rp900/kg", "Harga per kilogram keduanya sama"],
    correct: 0,
    pembahasan: "Harga per kg Beras A = 72.000 ÷ 5 = Rp14.400. Harga per kg Beras B = 31.000 ÷ 2 = Rp15.500. Beras A lebih murah, dengan selisih 15.500 − 14.400 = Rp1.100 per kg.",
  },
  {
    id: 2, type: "pg", kategori: "Literasi Numerik", topik: "Persentase & Pertumbuhan",
    stimulus: {
      intro: "Sebuah aplikasi mencatat jumlah penggunanya (dalam ribuan) selama empat tahun terakhir.",
      table: { headers: ["Tahun", "2021", "2022", "2023", "2024"], rows: [["Pengguna (ribu)", "120", "150", "180", "240"]] },
    },
    soal: "Berapa persentase pertumbuhan jumlah pengguna dari tahun 2023 ke tahun 2024?",
    options: ["20%", "25%", "30%", "33,3%", "40%"],
    correct: 3,
    pembahasan: "Pertumbuhan = (240 − 180) ÷ 180 × 100% = 60 ÷ 180 × 100% ≈ 33,3%.",
  },
  {
    id: 3, type: "pg", kategori: "Literasi Numerik", topik: "Fungsi Bertingkat (Tarif)",
    stimulus: {
      intro: "Tarif listrik suatu daerah dihitung bertingkat sebagai berikut:",
      table: { headers: ["Pemakaian", "Tarif per kWh"], rows: [["0 – 100 kWh pertama", "Rp1.352"], ["Di atas 100 kWh", "Rp1.699"]] },
    },
    soal: "Sebuah rumah tangga memakai listrik sebanyak 150 kWh dalam satu bulan. Berapa total tagihan listrik bulan tersebut?",
    options: ["Rp202.800", "Rp210.100", "Rp220.150", "Rp254.850", "Rp269.700"],
    correct: 2,
    pembahasan: "100 kWh pertama = 100 × 1.352 = Rp135.200. Sisa 50 kWh = 50 × 1.699 = Rp84.950. Total = 135.200 + 84.950 = Rp220.150.",
  },
  {
    id: 4, type: "pg", kategori: "Literasi Data", topik: "Statistika Deskriptif",
    stimulus: {
      intro: "Hasil survei terhadap 200 siswa tentang kebiasaan membaca buku per minggu ditunjukkan pada tabel berikut.",
      table: { headers: ["Jumlah buku/minggu", "0", "1", "2", "≥ 3"], rows: [["Persentase siswa", "20%", "35%", "25%", "20%"]] },
    },
    soal: "Berdasarkan data tersebut, berapa banyak siswa yang membaca minimal 2 buku per minggu?",
    options: ["40 siswa", "50 siswa", "70 siswa", "90 siswa", "100 siswa"],
    correct: 3,
    pembahasan: "Siswa dengan 2 buku = 25% × 200 = 50. Siswa dengan ≥3 buku = 20% × 200 = 40. Total minimal 2 buku = 50 + 40 = 90 siswa.",
  },
  {
    id: 5, type: "pgk", kategori: "Statistika", topik: "Ukuran Pemusatan & Penyebaran",
    stimulus: {
      intro: "Berikut adalah nilai ulangan matematika dari 8 siswa, sudah diurutkan dari terkecil.",
      table: { headers: ["Siswa 1", "2", "3", "4", "5", "6", "7", "8"], rows: [["Nilai", "60", "65", "70", "70", "75", "80", "85", "90"]] },
    },
    soal: "Berdasarkan data nilai delapan siswa tersebut, pilih semua pernyataan yang benar.",
    options: ["Rata-rata nilai adalah 74,375", "Median nilai adalah 72,5", "Modus data adalah 70", "Rentang (range) data adalah 30", "Standar deviasi data sama dengan nol"],
    correct: [0, 1, 2, 3],
    pembahasan: "Rata-rata = 595 ÷ 8 = 74,375 (benar). Median = rata-rata dua nilai tengah (70 dan 75) = 72,5 (benar). Modus = 70, nilai yang paling sering muncul (benar). Rentang = 90 − 60 = 30 (benar). Standar deviasi tidak nol karena data bervariasi, bukan seragam (salah).",
  },
  {
    id: 6, type: "pgk", kategori: "Barisan & Pola", topik: "Pola Aritmetika",
    stimulus: {
      intro: "Tinggi sebuah tanaman diukur setiap minggu selama 4 minggu pertama.",
      table: { headers: ["Minggu", "1", "2", "3", "4"], rows: [["Tinggi (cm)", "5", "8", "11", "14"]] },
    },
    soal: "Berdasarkan data pertumbuhan tanaman tersebut, pilih semua pernyataan yang tepat.",
    options: ["Pertumbuhan tanaman mengikuti pola aritmetika dengan beda 3 cm/minggu", "Tinggi tanaman pada minggu ke-6 diprediksi 20 cm", "Tinggi tanaman pada minggu ke-8 diprediksi 26 cm", "Pertumbuhan tanaman tersebut bersifat eksponensial", "Rata-rata pertambahan tinggi per minggu adalah 4 cm"],
    correct: [0, 1, 2],
    pembahasan: "Selisih antar-minggu tetap 3 cm sehingga pola ini aritmetika dengan beda 3 (benar). Rumus Uₙ = 5 + (n−1)×3. Minggu ke-6: 5+5(3)=20 (benar). Minggu ke-8: 5+7(3)=26 (benar). Pola ini linear, bukan eksponensial (salah). Pertambahan tiap minggu konsisten 3 cm, bukan 4 cm (salah).",
  },
  {
    id: 7, type: "pgk", kategori: "Fungsi Linear", topik: "Literasi Numerik — Tarif",
    stimulus: { intro: "Tarif layanan ojek daring dihitung dengan biaya dasar Rp2.000 ditambah Rp2.500 untuk setiap kilometer jarak tempuh." },
    soal: "Berdasarkan ketentuan tarif tersebut, pilih semua pernyataan yang benar.",
    options: ["Untuk jarak 5 km, tarif yang dibayar adalah Rp14.500", "Untuk jarak 10 km, tarif yang dibayar adalah Rp25.000", "Setiap penambahan jarak 1 km, tarif bertambah Rp2.500", "Fungsi tarif terhadap jarak berbentuk linear", "Jika tarif yang dibayar Rp39.500, jarak tempuhnya adalah 15 km"],
    correct: [0, 2, 3, 4],
    pembahasan: "5 km: 2.000+2.500(5)=14.500 (benar). 10 km: 2.000+2.500(10)=27.000, bukan 25.000 (salah). Kenaikan tetap Rp2.500 per km (benar). Bentuknya y=2.000+2.500x, yaitu linear (benar). 39.500=2.000+2.500x → x=(39.500−2.000)/2.500=15 km (benar).",
  },
  {
    id: 8, type: "bs", kategori: "Literasi Data", topik: "Statistika Deskriptif",
    stimulus: {
      intro: "Jumlah pengunjung perpustakaan sekolah selama 5 hari tercatat sebagai berikut.",
      table: { headers: ["Hari", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"], rows: [["Pengunjung", "40", "55", "35", "60", "50"]] },
    },
    soal: "Tentukan Benar atau Salah untuk setiap pernyataan berikut berdasarkan data di atas.",
    statements: [
      { text: "Jumlah pengunjung tertinggi terjadi pada hari Kamis.", correct: true },
      { text: "Rata-rata pengunjung selama 5 hari adalah 50 orang.", correct: false },
      { text: "Selisih pengunjung tertinggi dan terendah adalah 25 orang.", correct: true },
      { text: "Jumlah pengunjung hari Selasa lebih banyak daripada hari Jumat.", correct: true },
    ],
    pembahasan: "Tertinggi = 60 (Kamis), benar. Rata-rata = (40+55+35+60+50)/5 = 240/5 = 48, bukan 50, jadi salah. Selisih tertinggi−terendah = 60−35 = 25, benar. Selasa (55) > Jumat (50), benar.",
  },
  {
    id: 9, type: "bs", kategori: "Literasi Numerik", topik: "Bunga Majemuk",
    stimulus: { intro: "Seseorang menabung Rp1.000.000 di bank dengan bunga majemuk 5% per tahun." },
    soal: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    statements: [
      { text: "Setelah 2 tahun, saldo tabungan menjadi Rp1.102.500.", correct: true },
      { text: "Pertambahan saldo dari tahun ke-1 ke tahun ke-2 sama besar dengan pertambahan dari tahun awal ke tahun ke-1.", correct: false },
      { text: "Saldo setelah 3 tahun lebih dari Rp1.150.000.", correct: true },
      { text: "Jika bunga bersifat tunggal (bukan majemuk) 5% per tahun, saldo setelah 3 tahun adalah Rp1.150.000.", correct: true },
    ],
    pembahasan: "Tahun-1: 1.000.000×1,05=1.050.000. Tahun-2: 1.050.000×1,05=1.102.500 (pernyataan 1 benar). Pertambahan tahun-1→2 = 52.500, sedangkan awal→tahun-1 = 50.000, tidak sama (pernyataan 2 salah). Tahun-3: 1.102.500×1,05=1.157.625 > 1.150.000 (pernyataan 3 benar). Bunga tunggal: 1.000.000 + 3×50.000 = 1.150.000 (pernyataan 4 benar).",
  },
  {
    id: 10, type: "bs", kategori: "Literasi Numerik", topik: "Aritmetika Sosial",
    stimulus: {
      intro: "Dua taman kota memiliki luas dan biaya perawatan sebagai berikut.",
      table: { headers: ["Taman", "Luas", "Biaya perawatan"], rows: [["Taman A", "2.500 m²", "Rp15.000/m²/tahun"], ["Taman B", "3.200 m²", "Rp12.000/m²/tahun"]] },
    },
    soal: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    statements: [
      { text: "Luas Taman B lebih besar daripada Taman A.", correct: true },
      { text: "Biaya perawatan tahunan Taman A lebih besar daripada Taman B.", correct: false },
      { text: "Biaya perawatan per meter persegi Taman A lebih mahal daripada Taman B.", correct: true },
      { text: "Selisih biaya perawatan tahunan kedua taman adalah Rp900.000.", correct: true },
    ],
    pembahasan: "3.200 m² > 2.500 m² (benar). Biaya A = 2.500×15.000 = Rp37.500.000; Biaya B = 3.200×12.000 = Rp38.400.000, jadi biaya A justru lebih kecil (salah). Tarif per m²: 15.000 > 12.000 (benar). Selisih biaya = 38.400.000 − 37.500.000 = Rp900.000 (benar).",
  },
  {
    id: 11, type: "pg", kategori: "Geometri dan Pengukuran", topik: "Objek Geometri — Teorema Pythagoras",
    stimulus: { intro: "Sebuah tangga disandarkan pada dinding yang tegak lurus tanah. Kaki tangga berjarak 3 m dari dinding, dan ujung atas tangga menyentuh dinding pada ketinggian 4 m dari tanah." },
    soal: "Berapakah panjang tangga tersebut?",
    options: ["3 m", "4 m", "5 m", "6 m", "7 m"],
    correct: 2,
    pembahasan: "Tangga, dinding, dan tanah membentuk segitiga siku-siku dengan sisi siku-siku 3 m dan 4 m. Panjang tangga = √(3² + 4²) = √(9+16) = √25 = 5 m.",
  },
  {
    id: 12, type: "pg", kategori: "Geometri dan Pengukuran", topik: "Pengukuran — Volume Bangun Ruang Gabungan",
    stimulus: { intro: "Sebuah rumah-rumahan kayu berbentuk gabungan balok dan prisma segitiga (atap). Balok berukuran panjang 10 cm, lebar 6 cm, dan tinggi 8 cm. Atapnya berbentuk prisma dengan alas segitiga sama kaki (alas 6 cm, tinggi segitiga 4 cm) dan panjang prisma 10 cm." },
    soal: "Berapa volume total rumah-rumahan kayu tersebut?",
    options: ["480 cm³", "520 cm³", "560 cm³", "600 cm³", "650 cm³"],
    correct: 3,
    pembahasan: "Volume balok = 10 × 6 × 8 = 480 cm³. Volume prisma atap = luas alas segitiga × panjang = (½ × 6 × 4) × 10 = 12 × 10 = 120 cm³. Volume total = 480 + 120 = 600 cm³.",
  },
  {
    id: 13, type: "pgk", kategori: "Trigonometri", topik: "Perbandingan Trigonometri",
    stimulus: { intro: "Segitiga ABC siku-siku di C, dengan AC = 6 cm, BC = 8 cm, dan AB = 10 cm." },
    soal: "Berdasarkan segitiga tersebut, pilih semua pernyataan yang benar mengenai sudut A.",
    options: ["sin A = 4/5", "cos A = 3/5", "tan A = 3/4", "sin A + cos A = 7/5", "cosec A = 5/4"],
    correct: [0, 1, 3, 4],
    pembahasan: "Di depan sudut A adalah BC = 8 (sisi depan), di samping sudut A adalah AC = 6 (sisi samping), dan AB = 10 adalah sisi miring. sin A = 8/10 = 4/5 (benar). cos A = 6/10 = 3/5 (benar). tan A = 8/6 = 4/3, bukan 3/4 (salah). sin A + cos A = 4/5 + 3/5 = 7/5 (benar). cosec A = 1/sin A = 5/4 (benar).",
  },
  {
    id: 14, type: "bs", kategori: "Data dan Peluang", topik: "Peluang Kejadian",
    stimulus: { intro: "Sebuah kotak berisi 4 bola merah, 3 bola biru, dan 5 bola kuning. Satu bola diambil secara acak dari dalam kotak." },
    soal: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    statements: [
      { text: "Peluang terambil bola merah adalah 1/3.", correct: true },
      { text: "Peluang terambil bola biru adalah 1/4.", correct: true },
      { text: "Peluang terambil bola merah atau biru adalah 7/12.", correct: true },
      { text: "Peluang tidak terambil bola kuning adalah 5/12.", correct: false },
    ],
    pembahasan: "Total bola = 4+3+5 = 12. P(merah) = 4/12 = 1/3 (benar). P(biru) = 3/12 = 1/4 (benar). P(merah atau biru) = 4/12+3/12 = 7/12 (benar). P(tidak kuning) = 1 − 5/12 = 7/12, bukan 5/12 (salah).",
  },
  {
    id: 15, type: "pg", kategori: "Bilangan", topik: "Operasi Bilangan Pecahan",
    soal: "Hasil dari (2/3 + 1/4) ÷ (5/6 − 1/2) adalah ...",
    options: ["11/4", "3/2", "2", "11/6", "4/3"],
    correct: 0,
    pembahasan: "2/3 + 1/4 = 8/12 + 3/12 = 11/12. 5/6 − 1/2 = 5/6 − 3/6 = 2/6 = 1/3. Maka 11/12 ÷ 1/3 = 11/12 × 3 = 33/12 = 11/4.",
  },
  {
    id: 16, type: "pgk", kategori: "Aljabar", topik: "Sistem Persamaan Linear Dua Variabel",
    stimulus: { intro: "Harga 2 buku dan 3 pensil adalah Rp17.000. Harga 4 buku dan 1 pensil adalah Rp19.000." },
    soal: "Berdasarkan informasi tersebut, pilih semua pernyataan yang benar.",
    options: ["Harga satu buku adalah Rp4.000", "Harga satu pensil adalah Rp3.000", "Harga 5 buku dan 5 pensil adalah Rp35.000", "Harga 3 buku lebih mahal daripada harga 4 pensil", "Selisih harga satu buku dan satu pensil adalah Rp1.000"],
    correct: [0, 1, 2, 4],
    pembahasan: "Misalkan buku = b, pensil = p. 2b+3p=17.000 dan 4b+p=19.000 → p=19.000−4b. Substitusi: 2b+3(19.000−4b)=17.000 → −10b=−40.000 → b=4.000, p=3.000 (dua pernyataan pertama benar). 5b+5p = 5(4.000)+5(3.000)=20.000+15.000=35.000 (benar). 3b=12.000 dan 4p=12.000, sama besar sehingga bukan lebih mahal (salah). Selisih = 4.000−3.000=1.000 (benar).",
  },
  {
    id: 17, type: "pg", kategori: "Aljabar", topik: "Sistem Pertidaksamaan Linear",
    stimulus: { intro: "Diketahui sistem pertidaksamaan: 2x + y ≤ 10, x + 3y ≤ 15, x ≥ 0, y ≥ 0." },
    soal: "Ada berapa titik pojok (verteks) pada daerah penyelesaian sistem pertidaksamaan tersebut?",
    options: ["2", "3", "4", "5", "6"],
    correct: 2,
    pembahasan: "Titik pojok diperoleh dari perpotongan garis-garis batas: (0,0), (5,0) dari 2x+y=10 saat y=0, (0,5) dari x+3y=15 saat x=0, dan perpotongan 2x+y=10 dengan x+3y=15 yaitu (3,4). Sehingga terdapat 4 titik pojok: (0,0), (5,0), (3,4), (0,5).",
  },
  {
    id: 18, type: "pgk", kategori: "Aljabar", topik: "Fungsi — Komposisi dan Invers",
    stimulus: { intro: "Diketahui fungsi f(x) = 2x − 3 dan g(x) = x² + 1." },
    soal: "Berdasarkan kedua fungsi tersebut, pilih semua pernyataan yang benar.",
    options: ["Nilai (f∘g)(2) = 7", "Rumus (f∘g)(x) = 2x² − 1", "Invers dari f(x) adalah f⁻¹(x) = (x+3)/2", "Nilai f⁻¹(5) = 4", "Fungsi g(x) memiliki invers untuk semua x bilangan real"],
    correct: [0, 1, 2, 3],
    pembahasan: "(f∘g)(2) = f(g(2)) = f(4+1) = f(5) = 2(5)−3 = 7 (benar). (f∘g)(x) = f(x²+1) = 2(x²+1)−3 = 2x²−1 (benar). Dari y=2x−3 diperoleh x=(y+3)/2, jadi f⁻¹(x)=(x+3)/2 (benar). f⁻¹(5) = (5+3)/2 = 4 (benar). g(x)=x²+1 tidak satu-satu (misalnya g(1)=g(−1)) sehingga tidak memiliki invers untuk semua x real (salah).",
  },
  {
    id: 19, type: "bs", kategori: "Aljabar", topik: "Barisan dan Deret Geometri",
    stimulus: { intro: "Diketahui barisan geometri dengan suku pertama a = 3 dan rasio r = 2." },
    soal: "Tentukan Benar atau Salah untuk setiap pernyataan berikut.",
    statements: [
      { text: "Suku ke-5 barisan tersebut adalah 48.", correct: true },
      { text: "Jumlah 4 suku pertama adalah 45.", correct: true },
      { text: "Barisan tersebut merupakan barisan aritmetika.", correct: false },
      { text: "Deret dari barisan tersebut memiliki jumlah tak hingga karena r = 2.", correct: false },
    ],
    pembahasan: "Uₙ = a·r^(n−1). U₅ = 3×2⁴ = 3×16 = 48 (benar). S₄ = a(r⁴−1)/(r−1) = 3(16−1)/1 = 45 (benar). Karena rasio antar suku tetap (bukan selisih tetap), barisan ini geometri, bukan aritmetika (salah). Deret geometri memiliki jumlah tak hingga hanya jika |r| < 1; karena r = 2 > 1, deret ini divergen dan tidak memiliki jumlah tak hingga (salah).",
  },
  {
    id: 20, type: "pg", kategori: "Geometri dan Pengukuran", topik: "Transformasi Geometri — Translasi dan Refleksi",
    stimulus: { intro: "Titik A(3, −2) ditranslasikan oleh vektor (−4, 5), kemudian bayangannya direfleksikan terhadap sumbu-x." },
    soal: "Berapakah koordinat bayangan akhir titik A tersebut?",
    options: ["(−1, 3)", "(−1, −3)", "(1, −3)", "(1, 3)", "(−5, 3)"],
    correct: 1,
    pembahasan: "Translasi: A(3,−2) + (−4,5) = (3−4, −2+5) = (−1, 3). Refleksi terhadap sumbu-x mengubah (x,y) menjadi (x,−y), sehingga (−1,3) menjadi (−1,−3).",
  },
];

const DURATIONS = [20, 30, 45, 60, 75];

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function arraysEqualAsSets(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].sort().join(",");
  const sb = [...b].sort().join(",");
  return sa === sb;
}

function countButir(questions) {
  return questions.reduce((sum, q) => sum + (q.type === "bs" ? q.statements.length : 1), 0);
}

function Stimulus({ stimulus }) {
  if (!stimulus) return null;
  return (
    <div style={{ background: STIM_BG, border: `1px solid ${PAPER_LINE}`, borderRadius: 6, padding: "12px 16px", marginBottom: 14 }}>
      {stimulus.intro && <p style={{ fontSize: 14, color: INK_SOFT, marginBottom: stimulus.table ? 10 : 0, lineHeight: 1.6 }}>{stimulus.intro}</p>}
      {stimulus.table && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
            <thead>
              <tr>
                {stimulus.table.headers.map((h, i) => (
                  <th key={i} style={{ border: `1px solid ${PAPER_LINE}`, padding: "6px 10px", background: "#E6DCC4", color: INK, fontFamily: "'Space Mono', monospace", fontWeight: 700, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stimulus.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ border: `1px solid ${PAPER_LINE}`, padding: "6px 10px", color: INK }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Bubble({ letter, selected, onClick, disabled, state, shape }) {
  let bg = "transparent";
  let border = PENCIL;
  let color = INK;
  if (selected) { bg = INK; border = INK; color = "#F6F7F1"; }
  if (state === "correct") { bg = CORRECT; border = CORRECT; color = "#F6F7F1"; }
  if (state === "incorrect") { bg = INCORRECT; border = INCORRECT; color = "#F6F7F1"; }
  if (state === "missed") { bg = "transparent"; border = STAMP; color = STAMP; }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center"
      style={{
        width: 30, height: 30, minWidth: 30,
        borderRadius: shape === "square" ? 6 : "50%",
        border: `2px solid ${border}`,
        background: bg, color,
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700, fontSize: 13,
        cursor: disabled ? "default" : "pointer",
        transition: "all .15s ease",
      }}
    >
      {letter}
    </button>
  );
}

function TypeBadge({ type }) {
  return (
    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 0.5, color: STAMP, border: `1px solid ${STAMP}`, borderRadius: 4, padding: "2px 7px" }}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

export default function TkaMatematikaApp() {
  const [screen, setScreen] = useState("cover");
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [durationMin, setDurationMin] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ragu, setRagu] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [identityError, setIdentityError] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          submitExam();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const startExam = () => {
    if (!studentName.trim() || !studentClass.trim()) {
      setIdentityError(true);
      return;
    }
    setIdentityError(false);
    setAnswers({});
    setRagu({});
    setCurrent(0);
    setTimeLeft(durationMin * 60);
    setScreen("exam");
  };

  const selectPG = (qIdx, optIdx) => setAnswers((p) => ({ ...p, [qIdx]: optIdx }));

  const togglePGK = (qIdx, optIdx) => {
    setAnswers((p) => {
      const cur = Array.isArray(p[qIdx]) ? p[qIdx] : [];
      const next = cur.includes(optIdx) ? cur.filter((x) => x !== optIdx) : [...cur, optIdx];
      return { ...p, [qIdx]: next };
    });
  };

  const setBS = (qIdx, stIdx, val) => {
    setAnswers((p) => ({ ...p, [qIdx]: { ...(p[qIdx] || {}), [stIdx]: val } }));
  };

  const toggleRagu = (qIdx) => setRagu((p) => ({ ...p, [qIdx]: !p[qIdx] }));

  const submitExam = useCallback(() => {
    clearInterval(timerRef.current);
    setSubmittedAt(new Date());
    setScreen("result");
    setReviewIndex(null);
  }, []);

  const isAnswered = (i) => {
    const q = questions[i];
    const a = answers[i];
    if (q.type === "pg") return a !== undefined;
    if (q.type === "pgk") return Array.isArray(a) && a.length > 0;
    if (q.type === "bs") return a && Object.keys(a).length === q.statements.length;
    return false;
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data) || data.length === 0) throw new Error("format");
        const valid = data.every((q) => {
          if (!["pg", "pgk", "bs"].includes(q.type) || !q.soal) return false;
          if (q.type === "pg") return Array.isArray(q.options) && typeof q.correct === "number";
          if (q.type === "pgk") return Array.isArray(q.options) && Array.isArray(q.correct);
          if (q.type === "bs") return Array.isArray(q.statements) && q.statements.every((s) => s.text && typeof s.correct === "boolean");
          return false;
        });
        if (!valid) throw new Error("format");
        const normalized = data.map((q, i) => ({ ...q, id: i + 1, kategori: q.kategori || "Umum", topik: q.topik || "", pembahasan: q.pembahasan || "", stimulus: q.stimulus || null }));
        setQuestions(normalized);
        setImportMsg({ type: "ok", text: `${normalized.length} soal berhasil dimuat.` });
      } catch (err) {
        setImportMsg({ type: "err", text: "File tidak sesuai format. Periksa kembali struktur JSON (lihat template)." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const downloadTemplate = () => {
    const template = [
      { type: "pg", kategori: "Aljabar", topik: "Contoh topik", stimulus: { intro: "Konteks/bacaan opsional.", table: { headers: ["Kolom 1", "Kolom 2"], rows: [["Baris 1a", "Baris 1b"]] } }, soal: "Teks soal pilihan ganda ...", options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D", "Pilihan E"], correct: 0, pembahasan: "Penjelasan jawaban." },
      { type: "pgk", kategori: "Statistika", topik: "Contoh topik", stimulus: null, soal: "Pilih semua pernyataan yang benar ...", options: ["Pernyataan A", "Pernyataan B", "Pernyataan C", "Pernyataan D", "Pernyataan E"], correct: [0, 2], pembahasan: "Penjelasan jawaban." },
      { type: "bs", kategori: "Literasi Numerik", topik: "Contoh topik", stimulus: { intro: "Konteks bacaan." }, soal: "Tentukan Benar atau Salah untuk tiap pernyataan.", statements: [{ text: "Pernyataan 1 ...", correct: true }, { text: "Pernyataan 2 ...", correct: false }], pembahasan: "Penjelasan jawaban." },
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-soal-tka.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadResults = () => {
    const tanggal = (submittedAt || new Date()).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
    const lines = [];
    lines.push("HASIL SIMULASI TES KEMAMPUAN AKADEMIK (TKA) — MATEMATIKA");
    lines.push("=".repeat(64));
    lines.push(`Nama    : ${studentName}`);
    lines.push(`Kelas   : ${studentClass}`);
    lines.push(`Tanggal : ${tanggal}`);
    lines.push(`Durasi  : ${durationMin} menit`);
    lines.push("");
    lines.push(`SKOR AKHIR : ${score.pct}%  (Benar ${score.correctButir} dari ${score.totalButir} butir penilaian, ${questions.length} nomor soal)`);
    lines.push("");
    lines.push("RINCIAN PER KATEGORI");
    lines.push("-".repeat(64));
    kategoriBreakdown.forEach(([kat, v]) => lines.push(`${kat}: ${v.correct}/${v.total}`));
    lines.push("");
    lines.push("RINCIAN JAWABAN PER NOMOR");
    lines.push("-".repeat(64));
    questions.forEach((q, i) => {
      const a = answers[i];
      lines.push(`${i + 1}. [${TYPE_LABELS[q.type] || q.type}] ${q.kategori}${q.topik ? " — " + q.topik : ""}`);
      lines.push(`   Soal: ${q.soal}`);
      if (q.type === "pg") {
        const userAns = a !== undefined ? `${LETTERS[a]}. ${q.options[a]}` : "(tidak dijawab)";
        const correctAns = `${LETTERS[q.correct]}. ${q.options[q.correct]}`;
        lines.push(`   Jawaban siswa : ${userAns}`);
        lines.push(`   Kunci jawaban : ${correctAns}`);
        lines.push(`   Status        : ${a === q.correct ? "BENAR" : "SALAH"}`);
      } else if (q.type === "pgk") {
        const userAns = Array.isArray(a) && a.length ? a.map((x) => LETTERS[x]).join(", ") : "(tidak dijawab)";
        const correctAns = q.correct.map((x) => LETTERS[x]).join(", ");
        lines.push(`   Jawaban siswa : ${userAns}`);
        lines.push(`   Kunci jawaban : ${correctAns}`);
        lines.push(`   Status        : ${Array.isArray(a) && arraysEqualAsSets(a, q.correct) ? "BENAR" : "SALAH"}`);
      } else if (q.type === "bs") {
        q.statements.forEach((s, si) => {
          const userVal = a ? a[si] : undefined;
          lines.push(`   ${si + 1}) ${s.text}`);
          lines.push(`      Jawaban siswa: ${userVal === undefined ? "-" : userVal ? "Benar" : "Salah"} · Kunci: ${s.correct ? "Benar" : "Salah"} · ${userVal === s.correct ? "BENAR" : "SALAH"}`);
        });
      }
      lines.push("");
    });
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = studentName.trim().replace(/[^a-zA-Z0-9]+/g, "_") || "siswa";
    link.href = url;
    link.download = `Hasil-TKA-Matematika_${safeName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const answeredCount = questions.filter((_, i) => isAnswered(i)).length;
  const raguCount = Object.values(ragu).filter(Boolean).length;
  const totalButir = countButir(questions);

  const score = (() => {
    let correctButir = 0;
    questions.forEach((q, i) => {
      const a = answers[i];
      if (q.type === "pg") { if (a === q.correct) correctButir++; }
      else if (q.type === "pgk") { if (Array.isArray(a) && arraysEqualAsSets(a, q.correct)) correctButir++; }
      else if (q.type === "bs") {
        q.statements.forEach((s, si) => { if (a && a[si] === s.correct) correctButir++; });
      }
    });
    return { correctButir, totalButir, pct: totalButir ? Math.round((correctButir / totalButir) * 100) : 0 };
  })();

  const kategoriBreakdown = (() => {
    const map = {};
    questions.forEach((q, i) => {
      if (!map[q.kategori]) map[q.kategori] = { correct: 0, total: 0 };
      const a = answers[i];
      if (q.type === "pg") { map[q.kategori].total++; if (a === q.correct) map[q.kategori].correct++; }
      else if (q.type === "pgk") { map[q.kategori].total++; if (Array.isArray(a) && arraysEqualAsSets(a, q.correct)) map[q.kategori].correct++; }
      else if (q.type === "bs") {
        q.statements.forEach((s, si) => {
          map[q.kategori].total++;
          if (a && a[si] === s.correct) map[q.kategori].correct++;
        });
      }
    });
    return Object.entries(map);
  })();

  const fontImport = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap');
    `}</style>
  );

  const ruledBg = {
    backgroundColor: PAPER,
    backgroundImage: `repeating-linear-gradient(180deg, transparent, transparent 27px, ${PAPER_LINE} 28px)`,
  };

  // ---------- COVER ----------
  if (screen === "cover") {
    return (
      <div style={{ ...ruledBg, minHeight: 600, fontFamily: "'Source Serif 4', serif", color: INK }} className="w-full rounded-lg p-6 sm:p-10">
        {fontImport}
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div style={{ borderBottom: `3px double ${INK}`, paddingBottom: 16, marginBottom: 24 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, color: STAMP, marginBottom: 6 }}>
              SIMULASI TES KEMAMPUAN AKADEMIK
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>Matematika — SMA/MA/SMK/MAK</h1>
            <p style={{ color: INK_SOFT, fontSize: 15, marginTop: 8 }}>
              20 soal mengikuti kisi-kisi TKA Matematika dengan tiga bentuk soal khas TKA: Pilihan Ganda (PG), Pilihan Ganda Kompleks (PGK), dan Benar–Salah.
            </p>
          </div>

          <div style={{ background: CARD, border: `1px solid ${PAPER_LINE}`, borderRadius: 6, padding: "16px 20px", marginBottom: 20 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1, color: INK_SOFT, marginBottom: 8 }}>
              BENTUK SOAL
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: INK_SOFT, lineHeight: 1.9 }}>
              <li><strong style={{ color: INK }}>PG</strong> — pilih satu jawaban paling tepat dari 5 pilihan.</li>
              <li><strong style={{ color: INK }}>PGK (Pilihan Ganda Kompleks)</strong> — pilih semua jawaban yang benar; bisa lebih dari satu.</li>
              <li><strong style={{ color: INK }}>Benar/Salah</strong> — satu bacaan/data disertai beberapa pernyataan, tiap pernyataan dinilai Benar atau Salah tersendiri.</li>
            </ul>
            <p style={{ fontSize: 13, color: PENCIL, marginTop: 10 }}>
              Sebagian besar soal berbasis data (tabel, konteks kehidupan sehari-hari) untuk menguji literasi numerik, bukan hanya hitungan rumus.
            </p>
          </div>

          <div style={{ background: CARD, border: `1px solid ${identityError ? INCORRECT : PAPER_LINE}`, borderRadius: 6, padding: "16px 20px", marginBottom: 20 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1, color: INK_SOFT, marginBottom: 10 }}>
              IDENTITAS PESERTA
            </p>
            <div className="flex gap-3 flex-wrap">
              <div style={{ flex: "1 1 220px" }}>
                <label style={{ fontSize: 12, color: PENCIL, display: "block", marginBottom: 4 }}>Nama lengkap</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Tulis nama lengkap"
                  style={{ width: "100%", boxSizing: "border-box", fontFamily: "'Source Serif 4', serif", fontSize: 14, padding: "8px 10px", borderRadius: 4, border: `1px solid ${PAPER_LINE}`, background: "#FFFFFF", color: INK }}
                />
              </div>
              <div style={{ flex: "1 1 160px" }}>
                <label style={{ fontSize: 12, color: PENCIL, display: "block", marginBottom: 4 }}>Kelas</label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="Contoh: XI IPA 2"
                  style={{ width: "100%", boxSizing: "border-box", fontFamily: "'Source Serif 4', serif", fontSize: 14, padding: "8px 10px", borderRadius: 4, border: `1px solid ${PAPER_LINE}`, background: "#FFFFFF", color: INK }}
                />
              </div>
            </div>
            {identityError && (
              <p style={{ fontSize: 12, color: INCORRECT, marginTop: 8 }}>Nama dan kelas wajib diisi sebelum memulai simulasi.</p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1, color: INK_SOFT, marginBottom: 8 }}>
              DURASI UJIAN
            </p>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDurationMin(d)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "8px 16px", borderRadius: 4, border: `2px solid ${durationMin === d ? INK : PAPER_LINE}`, background: durationMin === d ? INK : "transparent", color: durationMin === d ? "#F6F7F1" : INK_SOFT, cursor: "pointer" }}>
                  {d} menit
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1, color: INK_SOFT, marginBottom: 8 }}>
              PAKET SOAL
            </p>
            <p style={{ fontSize: 14, color: INK_SOFT, marginBottom: 10 }}>
              {questions === DEFAULT_QUESTIONS ? `Paket contoh — ${questions.length} soal (${countButir(questions)} butir penilaian).` : `Paket kustom — ${questions.length} soal dimuat dari file yang kamu unggah.`}
            </p>
            <div className="flex gap-2 flex-wrap items-center">
              <button onClick={() => fileInputRef.current?.click()} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "8px 16px", borderRadius: 4, border: `2px solid ${INK}`, background: "transparent", color: INK, cursor: "pointer" }}>
                Impor soal (.json)
              </button>
              <button onClick={downloadTemplate} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, padding: "8px 14px", borderRadius: 4, border: `1px solid ${PAPER_LINE}`, background: "transparent", color: PENCIL, cursor: "pointer" }}>
                Unduh template
              </button>
              {questions !== DEFAULT_QUESTIONS && (
                <button onClick={() => { setQuestions(DEFAULT_QUESTIONS); setImportMsg(null); }} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: INCORRECT, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Kembali ke paket contoh
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
            {importMsg && <p style={{ fontSize: 13, marginTop: 8, color: importMsg.type === "ok" ? CORRECT : INCORRECT }}>{importMsg.text}</p>}
            <p style={{ fontSize: 12, color: PENCIL, marginTop: 8 }}>
              Format JSON mendukung tiga tipe soal: <code>pg</code>, <code>pgk</code>, dan <code>bs</code>. Unduh template untuk melihat strukturnya.
            </p>
          </div>

          <button onClick={startExam} style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 15, letterSpacing: 1, padding: "14px 28px", borderRadius: 40, border: `3px solid ${STAMP}`, color: STAMP, background: "transparent", cursor: "pointer", transform: "rotate(-1deg)" }}>
            ▶ MULAI SIMULASI
          </button>
        </div>
      </div>
    );
  }

  // ---------- EXAM ----------
  if (screen === "exam") {
    const q = questions[current];
    const low = timeLeft <= 300;
    return (
      <div style={{ ...ruledBg, minHeight: 600, fontFamily: "'Source Serif 4', serif", color: INK }} className="w-full rounded-lg p-4 sm:p-6">
        {fontImport}
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div className="flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 10, marginBottom: 18 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: INK_SOFT }}>Soal {current + 1} / {questions.length}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 20, color: low ? INCORRECT : INK, border: `2px solid ${low ? INCORRECT : INK}`, borderRadius: 4, padding: "2px 10px" }}>
              {formatTime(timeLeft)}
            </span>
            <button onClick={() => setNavOpen((v) => !v)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, border: `1px solid ${PENCIL}`, borderRadius: 4, padding: "6px 10px", background: "transparent", color: PENCIL, cursor: "pointer" }}>
              {navOpen ? "Tutup navigasi" : `Navigasi (${answeredCount}/${questions.length} terjawab)`}
            </button>
          </div>

          {navOpen && (
            <div style={{ background: CARD, border: `1px solid ${PAPER_LINE}`, borderRadius: 6, padding: 14, marginBottom: 18 }}>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, i) => {
                  const answeredI = isAnswered(i);
                  const isRagu = ragu[i];
                  const isCurrent = i === current;
                  return (
                    <button key={i} onClick={() => { setCurrent(i); setNavOpen(false); }} style={{ width: 30, height: 30, fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, borderRadius: 4, border: `2px solid ${isCurrent ? STAMP : isRagu ? STAMP : answeredI ? INK : PENCIL}`, background: isCurrent ? STAMP : answeredI ? INK : "transparent", color: isCurrent || answeredI ? "#F6F7F1" : isRagu ? STAMP : PENCIL, cursor: "pointer" }}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 12, color: PENCIL, marginTop: 10 }}>Terjawab: {answeredCount} · Ragu-ragu: {raguCount} · Belum dijawab: {questions.length - answeredCount}</p>
            </div>
          )}

          <div style={{ background: CARD, border: `1px solid ${PAPER_LINE}`, borderRadius: 8, padding: "22px 24px", marginBottom: 16 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              <TypeBadge type={q.type} />
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: INK_SOFT, letterSpacing: 1 }}>{q.kategori}{q.topik ? ` · ${q.topik}` : ""}</p>
            </div>

            <Stimulus stimulus={q.stimulus} />

            <p style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 18 }}>{q.soal}</p>

            {q.type === "pg" && (
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => {
                  const selected = answers[current] === i;
                  return (
                    <button key={i} onClick={() => selectPG(current, i)} className="flex items-center gap-3" style={{ textAlign: "left", padding: "10px 14px", borderRadius: 6, border: `1px solid ${selected ? INK : PAPER_LINE}`, background: selected ? "#E4E7DC" : "transparent", cursor: "pointer" }}>
                      <Bubble letter={LETTERS[i]} selected={selected} onClick={() => selectPG(current, i)} />
                      <span style={{ fontSize: 15, color: INK }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "pgk" && (
              <div>
                <p style={{ fontSize: 12, color: STAMP, fontFamily: "'Space Mono', monospace", marginBottom: 10 }}>Jawaban bisa lebih dari satu</p>
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, i) => {
                    const selArr = Array.isArray(answers[current]) ? answers[current] : [];
                    const selected = selArr.includes(i);
                    return (
                      <button key={i} onClick={() => togglePGK(current, i)} className="flex items-center gap-3" style={{ textAlign: "left", padding: "10px 14px", borderRadius: 6, border: `1px solid ${selected ? INK : PAPER_LINE}`, background: selected ? "#E4E7DC" : "transparent", cursor: "pointer" }}>
                        <Bubble letter={selected ? "✓" : LETTERS[i]} selected={selected} onClick={() => togglePGK(current, i)} shape="square" />
                        <span style={{ fontSize: 15, color: INK }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {q.type === "bs" && (
              <div className="flex flex-col gap-2">
                {q.statements.map((s, si) => {
                  const val = answers[current] && answers[current][si];
                  return (
                    <div key={si} className="flex items-center justify-between gap-3 flex-wrap" style={{ padding: "10px 12px", borderRadius: 6, border: `1px solid ${PAPER_LINE}` }}>
                      <span style={{ fontSize: 14, color: INK, flex: 1, minWidth: 200 }}>{si + 1}. {s.text}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setBS(current, si, true)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 4, border: `2px solid ${CORRECT}`, background: val === true ? CORRECT : "transparent", color: val === true ? "#F6F7F1" : CORRECT, cursor: "pointer" }}>Benar</button>
                        <button onClick={() => setBS(current, si, false)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 4, border: `2px solid ${INCORRECT}`, background: val === false ? INCORRECT : "transparent", color: val === false ? "#F6F7F1" : INCORRECT, cursor: "pointer" }}>Salah</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "9px 16px", borderRadius: 4, border: `1px solid ${PENCIL}`, background: "transparent", color: current === 0 ? PAPER_LINE : PENCIL, cursor: current === 0 ? "default" : "pointer" }}>← Sebelumnya</button>
              <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))} disabled={current === questions.length - 1} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "9px 16px", borderRadius: 4, border: `1px solid ${PENCIL}`, background: "transparent", color: current === questions.length - 1 ? PAPER_LINE : PENCIL, cursor: current === questions.length - 1 ? "default" : "pointer" }}>Berikutnya →</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleRagu(current)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "9px 16px", borderRadius: 4, border: `1px solid ${STAMP}`, background: ragu[current] ? STAMP : "transparent", color: ragu[current] ? "#F6F7F1" : STAMP, cursor: "pointer" }}>
                {ragu[current] ? "✓ Ditandai ragu-ragu" : "Tandai ragu-ragu"}
              </button>
              <button onClick={submitExam} style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 4, border: `2px solid ${INK}`, background: INK, color: "#F6F7F1", cursor: "pointer" }}>Selesai & Kumpulkan</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RESULT ----------
  return (
    <div style={{ ...ruledBg, minHeight: 600, fontFamily: "'Source Serif 4', serif", color: INK }} className="w-full rounded-lg p-6 sm:p-10">
      {fontImport}
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <div className="flex items-center gap-6 flex-wrap" style={{ borderBottom: `3px double ${INK}`, paddingBottom: 20, marginBottom: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", border: `3px solid ${STAMP}`, color: STAMP, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-6deg)", fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>
            <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{score.pct}%</span>
            <span style={{ fontSize: 9, letterSpacing: 1 }}>SKOR</span>
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Hasil Simulasi</h2>
            <p style={{ color: INK_SOFT, fontSize: 15, marginTop: 4 }}>Benar {score.correctButir} dari {score.totalButir} butir penilaian ({questions.length} nomor soal)</p>
            <p style={{ color: PENCIL, fontSize: 13, marginTop: 4, fontFamily: "'Space Mono', monospace" }}>{studentName || "(nama belum diisi)"} · {studentClass || "(kelas belum diisi)"}</p>
          </div>
        </div>

        <button onClick={downloadResults} style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 4, border: `2px solid ${STAMP}`, background: "transparent", color: STAMP, cursor: "pointer" }}>
          ⬇ Unduh hasil (.txt)
        </button>
        <p style={{ fontSize: 12, color: PENCIL, marginTop: 8, marginBottom: 24 }}>
          Unduh file hasil ini, lalu kirim ke gurumu melalui WhatsApp, email, atau Google Classroom.
        </p>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1, color: INK_SOFT, marginBottom: 10 }}>RINCIAN PER KATEGORI</p>
        <div style={{ marginBottom: 26 }}>
          {kategoriBreakdown.map(([kat, v]) => (
            <div key={kat} style={{ marginBottom: 10 }}>
              <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 4 }}>
                <span style={{ color: INK }}>{kat}</span>
                <span style={{ color: INK_SOFT, fontFamily: "'Space Mono', monospace" }}>{v.correct}/{v.total}</span>
              </div>
              <div style={{ height: 8, background: PAPER_LINE, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(v.correct / v.total) * 100}%`, height: "100%", background: v.correct === v.total ? CORRECT : STAMP }} />
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 1, color: INK_SOFT, marginBottom: 10 }}>TINJAU JAWABAN</p>
        <div className="flex flex-col gap-2" style={{ marginBottom: 24 }}>
          {questions.map((q, i) => {
            const a = answers[i];
            let statusLabel = "Kosong";
            let statusColor = PENCIL;
            if (q.type === "pg") { if (a !== undefined) { const ok = a === q.correct; statusLabel = ok ? "Benar" : "Salah"; statusColor = ok ? CORRECT : INCORRECT; } }
            else if (q.type === "pgk") { if (Array.isArray(a) && a.length > 0) { const ok = arraysEqualAsSets(a, q.correct); statusLabel = ok ? "Benar" : "Salah"; statusColor = ok ? CORRECT : INCORRECT; } }
            else if (q.type === "bs") { if (a && Object.keys(a).length === q.statements.length) { const okCount = q.statements.filter((s, si) => a[si] === s.correct).length; statusLabel = `${okCount}/${q.statements.length} benar`; statusColor = okCount === q.statements.length ? CORRECT : okCount === 0 ? INCORRECT : STAMP; } }
            const open = reviewIndex === i;
            return (
              <div key={q.id} style={{ border: `1px solid ${PAPER_LINE}`, borderRadius: 6, background: CARD }}>
                <button onClick={() => setReviewIndex(open ? null : i)} className="flex items-center justify-between w-full" style={{ padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span className="flex items-center gap-3">
                    <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, background: statusColor, color: "#F6F7F1" }}>{i + 1}</span>
                    <TypeBadge type={q.type} />
                    <span style={{ fontSize: 13, color: INK_SOFT }}>{q.kategori}</span>
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: statusColor }}>{statusLabel}</span>
                </button>
                {open && (
                  <div style={{ padding: "0 14px 16px" }}>
                    <Stimulus stimulus={q.stimulus} />
                    <p style={{ fontSize: 15, marginBottom: 12 }}>{q.soal}</p>

                    {q.type === "pg" && (
                      <div className="flex flex-col gap-2" style={{ marginBottom: 12 }}>
                        {q.options.map((opt, oi) => {
                          let state = null;
                          if (oi === q.correct) state = "correct";
                          else if (oi === a) state = "incorrect";
                          return (
                            <div key={oi} className="flex items-center gap-3">
                              <Bubble letter={LETTERS[oi]} selected={false} disabled state={state} />
                              <span style={{ fontSize: 14, color: INK }}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === "pgk" && (
                      <div className="flex flex-col gap-2" style={{ marginBottom: 12 }}>
                        {q.options.map((opt, oi) => {
                          const wasSelected = Array.isArray(a) && a.includes(oi);
                          const isCorrectOpt = q.correct.includes(oi);
                          let state = null;
                          if (isCorrectOpt && wasSelected) state = "correct";
                          else if (isCorrectOpt && !wasSelected) state = "missed";
                          else if (!isCorrectOpt && wasSelected) state = "incorrect";
                          return (
                            <div key={oi} className="flex items-center gap-3">
                              <Bubble letter={isCorrectOpt ? "✓" : LETTERS[oi]} selected={false} disabled state={state} shape="square" />
                              <span style={{ fontSize: 14, color: INK }}>{opt}</span>
                            </div>
                          );
                        })}
                        <p style={{ fontSize: 11, color: PENCIL, fontFamily: "'Space Mono', monospace" }}>Kotak hijau = benar &amp; kamu pilih · kuning = benar tapi terlewat · merah = kamu pilih tapi salah.</p>
                      </div>
                    )}

                    {q.type === "bs" && (
                      <div className="flex flex-col gap-2" style={{ marginBottom: 12 }}>
                        {q.statements.map((s, si) => {
                          const userVal = a ? a[si] : undefined;
                          const ok = userVal === s.correct;
                          return (
                            <div key={si} className="flex items-center justify-between gap-3 flex-wrap" style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${PAPER_LINE}` }}>
                              <span style={{ fontSize: 14, color: INK, flex: 1, minWidth: 200 }}>{si + 1}. {s.text}</span>
                              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: userVal === undefined ? PENCIL : ok ? CORRECT : INCORRECT }}>
                                Jawabanmu: {userVal === undefined ? "-" : userVal ? "Benar" : "Salah"} · Kunci: {s.correct ? "Benar" : "Salah"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div style={{ borderLeft: `3px solid ${STAMP}`, paddingLeft: 12 }}>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: STAMP, letterSpacing: 1, marginBottom: 4 }}>PEMBAHASAN</p>
                      <p style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.6 }}>{q.pembahasan}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={startExam} style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 4, border: `2px solid ${INK}`, background: INK, color: "#F6F7F1", cursor: "pointer" }}>Ulangi simulasi</button>
          <button onClick={() => setScreen("cover")} style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, padding: "10px 20px", borderRadius: 4, border: `1px solid ${PENCIL}`, background: "transparent", color: PENCIL, cursor: "pointer" }}>Kembali ke halaman awal</button>
        </div>
      </div>
    </div>
  );
}
