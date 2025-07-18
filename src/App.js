import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Komponen utama aplikasi
const App = () => {
  // State untuk mengelola apakah amplop sudah terbuka
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  // State untuk mengelola apakah konten utama sudah terlihat (setelah amplop terbuka penuh)
  const [showMainContent, setShowMainContent] = useState(false);
  // State untuk mengelola kartu mana yang sedang terbuka (untuk fungsionalitas expandable)
  const [expandedCardId, setExpandedCardId] = useState(null);
  // State untuk mengelola visibilitas efek sparkle burst
  const [showSparkleBurst, setShowSparkleBurst] = useState(false);
  // State untuk mengelola apakah konten surat sedang fade out
  const [isRevealedContentFadingOut, setIsRevealedContentFadingOut] = useState(false);
  // State untuk mengelola visibilitas pop-up pembuka
  const [showGreetingPopup, setShowGreetingPopup] = useState(true); // Set true agar muncul pertama kali
  // State baru untuk mengontrol animasi fade out pop-up
  const [isPopupFadingOut, setIsPopupFadingOut] = useState(false);
  // Referensi untuk elemen audio agar bisa diatur secara programatis
  const audioRef = useRef(null);

  // === STATE BARU UNTUK PLAN B ===
  // State untuk mengontrol apakah tombol "Oke, Lanjutt..." sudah bisa ditampilkan/diklik
  const [showProceedButton, setShowProceedButton] = useState(false);
  // State untuk mengontrol apakah lagu sedang diputar (untuk mengubah teks tombol play)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  // ==============================

  // Fungsi untuk menangani klik pada kartu (expand/collapse)
  const handleCardClick = (cardId) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  // Fungsi untuk memulai animasi amplop
  const handleOpenEnvelope = () => {
    console.log("handleOpenEnvelope dipanggil."); // Log
    setIsEnvelopeOpen(true);

    // Jadwalkan sparkle burst untuk muncul setelah konten surat terlihat sepenuhnya
    setTimeout(() => {
      setShowSparkleBurst(true);
      setTimeout(() => {
        setShowSparkleBurst(false);
      }, 1000); // Durasi animasi sparkleBurst
    }, 2000); // Penundaan agar sparkle burst muncul setelah surat terlihat

    // Jadwalkan fade-out untuk konten surat
    setTimeout(() => {
      setIsRevealedContentFadingOut(true);
    }, 5500); // Mulai fade out pada 5.5 detik

    // Konten utama microsite muncul setelah total durasi
    setTimeout(() => {
      setShowMainContent(true);
    }, 6500);
  };

  // Fungsi untuk mendapatkan ucapan selamat berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Selamat Pagi, Suci!";
    } else if (hour >= 12 && hour < 15) {
      return "Selamat Siang, Suci!";
    } else if (hour >= 15 && hour < 18) {
      return "Selamat Sore, Suci!";
    } else {
      return "Selamat Malam, Suci!";
    }
  };

  // FUNGSI UNTUK MEMUTAR LAGU DARI POP-UP (PLAN B)
  const handlePlayMusic = () => {
    console.log("handlePlayMusic dipanggil!"); // LOG 1

    if (audioRef.current) {
      console.log("audioRef.current ditemukan:", audioRef.current); // LOG 2
      // Penting: Memuat ulang audio terkadang membantu mengatasi isu browser
      // Ini mengatasi kasus di mana browser mungkin tidak memuat audio sampai interaksi terjadi
      audioRef.current.load();
      console.log("Mencoba memutar audio..."); // LOG 3
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true); // Set state bahwa musik sedang diputar
        setShowProceedButton(true); // Tampilkan tombol "Oke, Lanjutt..."
        console.log("Audio berhasil diputar! (Promise Resolved)"); // LOG 4
      }).catch(e => {
        console.error("Gagal memutar audio (Promise Rejected):", e); // LOG 5 (jika ada error yang ditangkap)
        // Jika pemutaran gagal (misalnya karena autoplay policy browser)
        alert("Ops! Browser kamu memblokir pemutaran audio otomatis, neng. Silakan klik 'Oke, Lanjutt...' dan nanti chat ke aku aja ya kalo kamu nemu tulisan ini'.");
        setShowProceedButton(true); // Tetap tampilkan tombol lanjut meski gagal play
        setIsMusicPlaying(false); // Pastikan state kembali false jika gagal play
      });
    } else {
      console.warn("audioRef.current adalah NULL saat handlePlayMusic dipanggil!"); // LOG 6 (jika ref-nya kosong)
      alert("Terjadi masalah saat mencoba memutar lagu. Silakan klik 'Oke, Lanjutt...' dan putar lagu secara manual di bagian 'Hadiah Digital'.");
      setShowProceedButton(true);
    }
  };

  // Fungsi untuk melanjutkan dari pop-up ke amplop
  const handleProceedFromPopup = () => {
    console.log("handleProceedFromPopup dipanggil."); // Log
    setIsPopupFadingOut(true); // Aktifkan animasi fade out pop-up
    setTimeout(() => {
      setShowGreetingPopup(false); // Sembunyikan pop-up setelah fade out selesai
      setIsPopupFadingOut(false); // Reset state fade out
      // handleOpenEnvelope(); // Panggil fungsi untuk membuka amplop
    }, 500); // Durasi fade-out pop-up sesuai CSS (0.5s)
  };

  // Data untuk semua kartu konten utama
  const contentCards = [
    {
      id: 'ucapan',
      title: 'Ucapan Buat Kamu',
      content: (
        <p className="text-base md:text-lg text-white leading-relaxed text-center">
  Seperti biasa nih, peringatan tahunan di setiap tanggal 12 Juli.
  <strong className="text-xl md:text-2xl font-extrabold block mb-2">Selamat Hari Koperasi Nasional!</strong>
  Ehh, Salah.. maksudku
  <span className="text-xl md:text-2xl font-extrabold text-[#00D7FF] block mt-2">Selamat Ulang Tahun, Suci Lestari~</span>
  Makin tua, Makin berkurang umurnya. Jadi, Harus Makin Dewasa dan lebih bijak dalam hal apapun ya...
</p>
      ),
      gradientClass: 'card-gradient-1' // Ungu dominan
    },
    {
      id: 'doa',
      title: 'Doa dan Harapan',
      content: (
        <p className="text-base md:text-lg text-white leading-relaxed text-center">
  Neng, di umur yang makin <b>matang</b> ini <i>(jangan ngaku bocil lagi ya!)</i>, aku doain semoga semua asa dan cita-citamu tercapai.<br/>
  Sehat selalu kaya superhero yang kebal penyakit, rezekinya ngalir terus kaya air keran yang lupa dimatiin (tapi jangan boros!), dan bahagia terus sampe temen-temen kepo kenapa kamu suka senyum-senyum sendiri (asal ga kelewat batas aja sih wkwk).<br/>
  Dan yang paling penting nih, doa spesial dari aku: Semoga di usia 26 ini, kamu bisa segera ketemu sama jodoh yang pas! Kan kamu dulu bilang katanya gamau nikah diatas umur 25 tahuh. Kalo perlu main dating app biar cepet ketemu sama yang cocok! (kata temenku sih gitu wkwk).<br/>
  Atau kalo udah ketemu sama yang cocok, dilancarkan sampe semua orang saksi bilang "SAH..."<br/>
  Aamiin paling serius! 🙏
</p>
      ),
      gradientClass: 'card-gradient-2' // Ungu ke biru muda
    },
    {
      id: 'pesan',
      title: 'Pesan Dariku, Hendy',
      content: (
        <p className="text-base md:text-lg text-white leading-relaxed text-center">
      Di hari Spesialmu ini, (Asyekk, kaya martabak wkwk..)<br/><br/>
      *Ekhemm* Di penghujung hari ini (kalo kamu belum tidur) atau Di awal hari ini (kalo kamu buka link ini waktu udah ganti hari) Ah gimana sih wkwk..<br/><br/>
      Intinya tuh Aku bersyukur masih bisa punya kesempatan buat ngucapin selamat ulang tahun ke kamu. Karena kata pak ustad; Kalo kita berdoa buat orang lain, doanya juga bakal balik ke kita gitu.<br/><br/>
      Dan.. karena tahun depan belum tentu aku bisa ngucapin selamat ulang tahun ke kamu lagi kaya gini (karena salah satu dari kita udah nikah duluan atau.. Umur ga ada yang tau), Aku mau ngucapin Terima Kasih karena kamu udah jadi salah satu orang yang banyak ngerubah hidupku sepenuhnya. Mungkin ga secara langsung. Tapi kalo aku ga putus dari kamu waktu itu dan tau kamu udah punya pacar baru dengan mata kepalaku sendiri, Pikiranku belum tentu bisa jadi se-dewasa sekarang. So many life lesson.. Eh, kok jadi curhat gini, Maaf ya emang sengaja wkwk..<br/><br/>
      Tapi pesan paling penting buat kamu nih: Jaga kesehatan! Jaga pola makan kamu.. Jangan sering-sering makan cemilan yang pedes-pedes, atau yang tinggi gula (biar ga makin over-gemoy hehe), jangan lupain air putih, dan jangan keseringan BEGADANG! (sekali aja gapapa sih soalnya aku ngirim ini kan kemaleman hehe)<br/>
      Jaga diri baik-baik!!
    </p>
      ),
      gradientClass: 'card-gradient-3' // Biru muda ke ungu
    },
    {
      id: 'penjelasan',
      title: 'Kamu harus baca ini! :(',
      content: (
        <p className="text-base md:text-lg text-[#2c3e50] leading-relaxed text-left">
        <b>Maaf beribu maaf ya, neng. Udah bikin kamu nunggu lama banget dari kemaren :( </b>
<br/><br/>
Kamu mungkin udah baca chat di WAku tadi yang jelasin kalo <i><b>"kejutan kecil"</b></i> dariku sempet ilang gara-gara kesalahan temenku. Nah, <b>"Kejutan kecil"</b> yang aku maksud sebenarnya ya aplikasi web kaya gini khusus buat ucapan Selamat Ulang Tahun dariku ke kamu.
<br/>
Karena pikirku kalo ngucapin lewat WA doang kan udah biasa, tahun kemaren kan aku udah pernah bikinin kamu video, dan aku pengen yang <b>"beda"</b> aja gitu di tahun ini itung-itung sambil aku belajar coding lagi. Eh, Anjir.. Malah ada kendala yang lumayan sampe bikin aku telat ngirim gara-gara aku harus ngoding ulang gegara file-nya diilangin sama temenku. Aku tuh udah tau chat kamu dari semalem, Tapi aku sengaja ga bales dulu karena aku bingung mau jelasinnya kaya gimana <i><b>(lagi pusing banget njir, alesannya ada ko di bawah kalo kamu mau baca).</b></i>
<br/>
Sekali lagi aku minta maaf, neng.
<br/>
Anggap aja ini kaya <i><b>"kado digital"</b></i> dari aku. Soalnya aku mau ngirim kado diem-diem juga aku gatau alamat rumah kamu yang baru, jarak kita pun juga jauh banget. Kalo masih satu kota paling aku udah traktir kamu makan nasi bebek wkwk..
<br/>
Kalo kamu pengen tau lebih detail sekaligus baca <b>curhatan aku</b> bisa kamu scroll sampe ke bawah yaa..
<br/>
Tapi <u><b>detail penjelasan ini tuh sangat panjang banget, neng.</b></u> Kamu bisa scroll dulu sampe ke yang paling bawah kalo emang pengen tau sepanjang apa aku ngetik. Soalnya aku ngetiknya kaya ga sadar dan tau-tau udah <b><i>molor..</i></b> Eh, maksudnya udah panjang aja wkwk..
Dan kalo emang mau baca lengkap sampe habis, <b>Pastiin dulu <u>kamu lagi punya waktu luang yang cukup. Sediain juga kopi ama cemilannya,</u></b> dan anggep aja ini <i><b>"Cerpen"</b></i> wkwk... 
<br/>
<br/>
<span className="disclaimer"><b>#IndonesiaDaruratLiterasi</b><br/></span>
(eh, apaansih wkwk..)
<br/>

<hr className="red-line" />

<span className="disclaimer"><center><b>DISCLAIMER</b><br/> 
<i>(biar keliatan agak serius hehe)</i> </center><br/>

<b>Sebelum kamu baca setiap kata dan kalimat lanjutan di menu ini, Aku pengen kamu tau dan yakinin diri kamu bahwa aku ngasih penjelasan ini sama sekali ga ada maksud bikin aku jadi terkesan <i>"Wah"</i> di mata kamu atau bikin kamu <i>"Mengingat Kembali"</i> <u>masa lalu kamu.</u><br/>
Karena di penjelasan ini nantinya mungkin ada <u>"unsur"</u> yang bikin kamu mikir kaya gitu. Yang jelas bukan "unsur" kimia ya, soalnya aku bukan guru Kimia. <br/>
Aku benar-benar ingin ngejelasin secara personal disini. Lebih kek curhat sih jatohnya wkwk...
</b><br/>
</span>
<hr className="red-line" />
Jadi gini neng..<br/>
Aku sebenarnya udah ngerencanain buat bikin aplikasi web ini udah jauh-jauh hari sebelum hari-H ulang tahun kamu tanggal 12 Juli kemaren. Aku planning, nyusun semua kode dari 0, dan akhirnya jadilah aplikasi kecil-kecilan (microsite) khusus buat ucapan Selamat Ulang Tahun Kamu yang udah jadi sekitaran tanggal 2 di bulan ini. <i>(Udah lumayan lama kan?)</i>
<br/>
Karena pikirku waktu itu tanggal <b>12 Juli</b> tuh masih lama, Akhirnya aku kepikiran buat nambahin beberapa fitur di aplikasi ini.<br/>
Ada <b>Galeri Foto</b> yang isinya foto-foto lawas kamu, <b>Miniplayer</b> yang isinya beberapa lagu instrumental buatanku khusus untuk diputer di aplikasi ini, Dan yang paling <b><u>Niat</u></b> aku bikinnya <i>alias nguras waktu banget dan tenagaku</i>; <b><u>Fitur Timeline</u></b> yang isinya kilas balik semua momen-momen kita selama aku kenal kamu. <b>Mulai dari awal aku kenalan sama kamu di Twitter dulu, masa pacaran, masa pasca-pacaran</b> <i>(eh apasih? "masa udah putus" gitu aja kali ya.. wkwk)</i> <b>tapi masih sering ketemu, hingga terakhir aku ketemu kamu di tahun 2023 yang lalu.</b> Semuanya aku taruh di menu fitur ini walaupun belum sepenuhnya selesai waktu itu.
<br/><br/>
Lihat lagi tulisan yang aku <span className="disclaimer"><b>"Tebelin pake warna merah"</b></span> diatas ya.. Jangan mikir <i>aneh-aneh</i> dulu!
<br/><br/>
Kenapa ini nguras waktu dan tenagaku? <b>(jujur aja)</b><br/>
Ya karena aku harus <i><b>"nyelam"</b></i> balik lagi ke masa lalu, dimana aku harus inget-inget, nyari foto dan video lama, data di memori lamaku dan segala hal yang ada hubungannya dengan kamu waktu masih sama aku dulu. Sampe akhirnya jadilah menu <b>"Timeline"</b> ini yang isinya ada kaya gambaran garis <b>rentang waktu atau kilas balik</b>, yang kalo kamu klik muncul keterangan <b><i>momen-momen waktu aku lagi sama kamu</i></b> di tanggal itu (tanggal yang kamu klik). Kalo di tanggal itu ada <b>foto</b>nya, nanti juga ikut muncul disitu. Intinya <b><i>lucu</i></b> lah pokoknya, aku jadi bisa belajar coding pake gaya baru..
<br/><br/>
Kan kamu sempat pernah <b><u>belajar ngoding dan kuliah TI</u></b> ya.. Sekarang, aku mau lanjut jelasin pake bahasa yang agak <i>teknis</i> kali ya, neng..<br/>
Kamu mungkin masih inget kan, kalo mau <u>bikin web itu harus pake <b>hosting</b> buat taruh semua file dan foldernya?</u> Nah aku tuh bikin aplikasi web ini hostingnya pake <b><u>GitHub</u></b>, nantinya aku pake <b><u>Netlify</u></b> (lihat <u>alamat URL di address bar kamu serakang)</u> buat <i>publish</i> (aktifin) applikasiku secara online.<br/>
Tapi neng, karena dari bulan kemaren aku sering banget ada jadwal <b>keluar rumah</b>, Aku jadi sering ngoding tuh secara <b>offline</b>. Jadi, aku naruh file sama foldernya tuh ya langsung di penyimpanan lokal (offline) dan aku nyimpen folder aplikasi ini di <b>Harddisk Eksternalku (HDD)</b> biar bisa aku akses pake laptop temenku kalo aku lagi ga bawa laptop. Baru nanti kalo udah nemu koneksi internet, aku langsung upload semuanya ke gitHub. Kebetulan juga aku punya <b><i>file data besar</i></b> yang isinya kode-kode kaya semacem tutorial gitulah yang aku kumpulin satu per satu dari dulu biar bisa aku akses secara offline untuk bahan belajar aku juga. <b>Semoga sampe sini kamu paham ya..</b>
<br/><br/>
Singkat cerita, tibalah tanggal <b>10 Juli</b>. Waktu itu <i><b>"kejutan kecil"</b></i> buat kamu ini udah <b>sangat sempurna</b> tampilannya menurutku. Aku juga edit foto lawas kamu biar bisa jadi <span className="pinkfont"><b><i>icon unyuu</i></b></span> di setiap judul menunya. Aku kasih <span className="pinkfont">dekorasi-dekorasi lucu, <b>Gemesinlah pokoknya kaya kamu</b></span> wkwk.. Cuma menu Timeline-nya emang belum memuat semua momen-momen kita, Soalnya aku masih <b>inget-inget</b> juga.<br/>
Nah, temenku yang <b>bloon</b> ini (Lebih ke <i>B*ngsat</i> sih kalo kataku, *upps) sebenarnya dia itu <b>programmer</b> <i>(ngakunya gitu)</i>. Dia lagi ngegarap salah satu project bareng sama aku. Dan dia mau <u>pinjem HDDku</u>, Karena di HHDku ada salah satu file project yang lagi kita garap.<br/>
Dan.. <b>GA ADA ANGIN</b> <i>(eh, ada deng. sepoi-sepoi waktu itu)</i> <b>GA ADA HUJAN, MALEMNYA DIA NGABARIN KALO HDDKU KE FORMAT.</b> Semua <b>Data-dataku</b> yang ada di sana, <b>project-project lagu</b> yang lagi aku kerjain, termasuk <b><u>folder kejutan kecil</u></b> buat kamu <b><u><i>ILANG SEMUA...</i></u></b> Alesan dia waktu aku tanya, katanya <b>kena virus</b> di komputer temennya. Kamu bisa bayangin sendirilah <b>reaksi <i>client-clientku</i></b> <i>(yang sebenernya juga temenku)</i> pada gimana waktu itu :) <br/><br/>
<b>Tanggal 11</b>, setelah aku udah <u>nyelesain masalah</u> sama clientku <i>(hari paling ruibett pokoknya)</i>. Aku nyoba <b>buat ulang lagi kejutan kecil kamu</b>. Bener-bener buat ulang <b>MULAI DARI 0</b> lagi ngodingnya, karena emang aku ga punya pengalaman garap microsite kaya gini sebelumnya, jadi aku ga punya templatenya. Untungnya ucapan dan doa-doa buat kamu itu sebenernya aku tulisnya di <u>note Hapeku</u>, jadi soal <b>isi teksnya</b> aku cuma tinggal copas doang, paling tinggal edit dikit doang, <b>kecuali</b> semua teks di <b>“menu”</b> yang lagi kamu buka ini ya, karena aku nulis penjelasan ini <b>baru <u>tadi malem</u></b> wkwk.. Oke, kita balik ke <i>curhatan aku..</i> <br/>
Sampe tanggal <b>12 Juli</b>, di hari yang seharusnya aku ngasih <b><u>kado</u></b> ini buat kamu, Aku cuma berhasil <u>ngedesain layoutnya doang</u>. Aku kepikiran <b><i>"Ah, gapapalah ngucapin sama ngasihnya nanti malem aja sebagai penutup juga"</i></b> pikirku begitu. <span className="pinkfont"><b>(pengennya sih jadi <i>yang terakhir buat kamu</i> :p)</b></span>.
  <br/>
  Seharian aku otak-atik, perbaikin kode yang error, Tapi nyatanya sampe jam <u>23:00</u> aku masih belum selesai juga. Mangkannya aku langsung chat kamu dulu aja kemaren, <i>"kejutan kecil"nya nyusul kataku.</i> Aku ngechat kamu aja <b>kata-katanya amburadul</b> gitu kan? wkwk...<br/>
Nah, kemaren aku juga gabisa lanjutin karena seharian aku <u>ada keperluan</u> sama salah satu temen di Malang. Akhirnya aku lanjutin lagi waktu pulangnya, dan <b>web kecil</b> yang kamu lihat sekarang ini adalah <b>web <i>“kedua”</i></b> hasil aku begadang semalem sampe pagi tadi wkwk.. Tampilannya udah pasti <b><u>jauh banget</u></b> dari web yang udah aku bikin sebelumnya :( Tapi seengganya <b>ucapan ulang tahun ke kamu</b> udah nyampe dulu lah ya.. :)
  <br/><br/>

--- <br/>

Aku ga mau kamu punya pertanyaan: <b>“Kenapa aku rela ngelakuin ini semua (terutama bikin menu <u>“Timeline”</u> di web sebelumnya) kalo tau ini semua nguras tenaga dan waktu aku?”</b>. Karena kalo kamu punya pertanyaan seperti itu, berarti kamu lupa kalo <b><i><u>mantan kamu ini emang aneh</u></i></b> wkwk.. <br/>
Inget apa yang sudah aku katakan di menu <b>Doa dan Harapan</b> diatas menu ini? Kalo lupa kamu bisa buka lagi ya.. <i>Eh, jangan deh, kelamaan wkwk..</i><br/>
Aku kan bilang kalo <b>usia kamu</b> sekarang udah makin <b>matang</b>, Dan <u>belum tentu</u> tahun depan aku masih punya kesempatan buat ngucapin Selamat Ulang Tahun ke kamu lagi. Nah, aku mau <b>Maksimalin</b> ucapan ulang tahun ini biar jadi ucapan yang <i>“mungkin”</i> berkesan buat kamu ingat aja sih.<br/>
Itu alesan aku bikin menu “Timeline” dan juga karena <u>menurutku</u> “Timeline” atau <b>jalan hubungan kita dulu itu <i>unik</i></b>, njirr... Masa dengan sebegitu jauhnya jarak kita dulu <u><b>740an</b> kilometer</u>, bisa <u>ketemu</u> dan ngejalin hubungan <u>pacaran</u>? Mana sama sama belum punya pengalaman pacaran di daftar riwayat hidup masing-masing, ini kita kalo ngelamar di <span className="pinkfont"><b>PT. Mencari Cinta Sejati</b></span> kayanya bakal ditolak mentah-mentah dah wkwk.. Tapi yang lebih <i>unik</i> dulu tuh <span className="pinkfont">kamu</span> sebenernya (lebih ke arah <b>nekat</b> sih kalo aku inget inget) <b>Kamu baru kenal aku lewat sosial media doang, kamu belum tau alamat rumah aku, keluargaku</b>, dan dengan <b>beraninya</b> kamu waktu itu nyamperin aku ke <u>Bekasi</u>. Bahkan kamu mau aku ajak maen ke <u>Bandung</u> sampe nginep, mana pake <b>motor Aa kamu</b> lagi <i>(waktu tahun baru 2018)</i>. Aku gatau ini karena kamunya masih terlalu <b>polos</b> atau udah punya <b>kodam</b> yang lagi jagain, Tapi kalo diinget-inget <b>kamu <u>nekat</u> banget dulu</b>. Untungnya kamu kenalnya sama aku <i>(<b>si good boy</b>, anjay wkwk..)</i>, coba kalo sama cowok modelan lain (yang keliatan <u>good boy</u> tapi aslinya otaknya <u>kotor</u> misalnya), Naudzubillah deh ya.. <b>JAGA DIRI BAIK-BAIK!</b>
<br/><br/>
Nah, aku sampe sekarang tuh <u>pengen tau</u>. <b>Apa <u>alesan kamu</u> sampe bisa <i>“se-percaya”</i> itu ke aku di masa-masa awal kita sering maeng bareng dulu?</b> Kamu bisa jawab ini di <b>chat WA</b> aku nanti ya.. Atau biar kamu lebih nyaman, Kamu bisa chat aku pake <b>tombol</b> dibawah ini dulu sebelum lanjut baca lagi, takut kamunya <i>kelupaan</i> wkwk...<br/>

[Klik buat chat ke aku]

------ <br/>

<span className="disclaimer"><b>INGET YA!</b></span> Sama apa yang udah aku bilang di tulisan <span className="disclaimer"><b>DISCLAIMER</b></span> tadi. Kalo kamu lupa, aku ingetin lagi deh..<br/>
Yakinin diri kamu kalo aku buat Penjelasan ini bukan karena ingin keliatan <b><i>“WAH”</i></b> di mata kamu. Takutnya kamu malah punya pikiran: <b><i>“WAW.. si Hendy effort banget udah bikin ucapan kaya gini..”</i></b> Ssttt.. Kamu lebih <u><b>High Effort</b> daripada aku</u> sewaktu kita masih pacaran dulu! Kalo diinget-inget aku dulu tuh kesannya malah kaya gembel, modal effort <u>waktu dan tenaga doang</u>, buktinya kalo kita maen aja kita mesti <b>pake motor kamu</b> karena aku belum punya motor.<br/>
<b>AKU MASIH INGET, KALO KAMU LUPA, AKU MAU INGETIN LAGI. SETIAP PULANG DARI RUMAH KAMU KALO KEMALEMAN KAMU SERING NAMBAHIN ONGKOS PULANG AKU KARENA GRAB/GOCARNYA MINTA ONGKOSNYA DOBEL BUAT BALIK KE KARAWANG!</b> <u>Aku lupa</u> waktu itu aku ngebalikin atau engga uang itu. Mangkannya waktu itu aku mau ngasih laptop aku karena aku ngerasa aku <b>punya utang banyak banget sama kamu</b>, Apalagi kamu kuliah TI yang pasti butuh banget laptop. Mau kamu pake, kamu jual, atau gimana terserah kamu. Tapi kamu malah <u>masih nyimpen</u> laptop aku. Ya aku paham sih, kamu ga mungkin ngejual karena <b>ngerasa</b> itu bukan barang kamu kan? <b>Aku tau benget kamu</b>. Eh, Tapi kalo aku ga ada laptop, Aku juga gabisa bikin web kaya gini ☹... Tungguin ekonomi aku balik <b>stabil</b> lagi ya! <b>Aku ga akan pernah ngelupain ini!</b><br/>
Dan Aku mungkin ada sedikit <u>niat</u> buat bikin kamu <b>“Mengingat Kembali”</b> Masa lalu kamu. Tapi ya cuma untuk sesuatu yang lucu <span className="pinkfont"><b>(kaya kamu)</b></span> untuk diingat, ga ada niat ke hal yang lain. <u>Maksudku</u> hubungan kita dulu tuh <i>unik</i>, (berapa kali sih aku ngulang kata unik? wkwk..) Nyimpen banyak banget pelajaran gitu. Anggap aja sebagai "kilas balik” kalo kamu pernah ngelakuin hal-hal kaya gitu tadi. Tapi kalo kamu mikirnya <span className="pinkfont">“Aku masih punya <b>rasa</b> sama kamu”</span> ya itu terserah <b>kamu</b> sih wkwk. <i>(Bercanda yaa, neng)</i>.<br/>
<br/>
Dari semua hal yang udah aku <u>jalananin sama kamu</u>. Kenal kamu, pacaran, sampe putus karena <b>aku yang posesif, overprotektif, suka ngehaluu, dan ya begitulah..</b> <i>(aku sadar banget sama segala <b><u>ngeselinnya</u></b> kepribadianku dulu dan aku gamau kamu <b>muntah</b> cuma karena aku ingetin semuanya lagi)</i>. Segala hal yang buat kamu <b>"nyenengin hati"</b> tapi buat aku  <b>“nyakitin hati”</b>, misal ngeliat langsung kamu lagi pacaran sama <u>A Hendri</u> dan lain sebagainya, justru malah benar-benar <b>ngerubah total kepribadianku</b>. Aku gamau jelasin panjang x lebar gimana kepribadianku sekarang, karena ini udah panjang banget njir, capek aku ngetiknya wkwk.. Aku cuma ingin orang lain sendiri yang ngasih nilai. Karena kalo aku yang ngasih nilai diriku sendiri, entar malah dikira ngecheat..<br/><br/>
<span className="pinkfont">Semoga <b>kita masih diberi kesempatan buat ketemu lagi</b></span> yaa, <b>Maaf</b> kalo aku dulu-dulu sering ngasih rencana buat <span className="pinkfont">jalan-jalan sama kamu ke <b>Dufan</b></span>, Tapi sampe sekarang aku masih <b>belum bisa balik ke Jakarta</b>. <i>Alur hidup sama sekali ga bisa ditebak...</i><br/>
<b>Intinya,</b> Aku belum tentu bisa ngasih ucapan selamat ulang ke kamu lagi tahun depan, gatau karena <b>kamu yang udah nikah duluan atau umurku yang ga nyampe</b> <i>(jalan hidup orang ga ada yang tau kan? Kata pak ustad sih gitu)</i>. Jadi, aku coba maksimalin apapun tentang kamu di hidup aku pada curhatan ini. <i>(tadinya penjelasan malah jadi sesi curhatan wkwk.. maapin)</i> <br/><br/>
Oh ya, <b>Yang Terakhir</b>. Kamu juga <b>jangan</b> punya pikiran kalo aku udah ngasih tulisan sepanjang ini, berarti kamu juga harus ngasih <b>chat Panjang</b> <i>.. x lebar = luas)</i> juga di WA. <b>GAUSAH! Senyamannya</b> kamu aja balesnya. Aku ga mau <u>nyusahin</u> dan <u>ngebuang waktu kamu</u> lagi cuma buat nge<b>bales</b> <b>Panjang</b> .. <i>x lebar x tinggi = volume balok) *plakkk ...</i> Ucapan aku dengan alesan ingin ngehargain aku atau gimana. Kamu ngebaca <b>“cerpen”</b> ini sampe habis aja aku udah bersyukur banget. Jadi, bales chat senyamannya kamu aja ya.. Tapi juga jangan sampe ga ngasih respon apa apa setelah baca ini semua <i>(ga ngechat, atau malah di <b>tiba-tiba diblokir</b>)</i>, jadi sedih aku kalo kaya gitu nanti. Kalo mau ngeblokir bilang dulu yaa wkwk..
<br/>
<br/>
Makasih banyak udah mau ngeluangin waktu dan Makasih banyak udah mau jadi <b>Subjek Eksperimen</b> Codingku, <i>walaupun gagal</i> wkwk...
<br/>
<b>Inget yang udah aku bilang</b>, Ga usah mikir macem-macem! Hehehe.. <br/>
        </p>
      ),
      gradientClass: 'card-gradient-4' // Biru dominan
    },
    {
      id: 'playgorund',
      title: 'PlayGround!',
      content: (
        <>
          {/* Elemen audio sudah dipindahkan ke atas di luar kondisi */}
          <p className="text-base md:text-lg text-white leading-relaxed text-center">
            Menu ini masih belum Jadi <b>
            <br/>
            (Cooming Soon)!</b>
            <br/>
            Kedepannya paling aku mau bikin Menu "Timeline" lagi.
            Tungguin ya! Karena kalo aku selesaiin semuanya sekarang, Kartu Ucapan Ulang Tahun buat Kamu keburu expired wkwk...
            <br/>
            Sementara aku kasih tombol buat muter ulang lagu aja ya, neng
            <br/>
            Kalo belum diputar, kamu bisa memutarnya sekarang.
          </p>
          <button
              onClick={() => audioRef.current && audioRef.current.play()}
              className="bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-purple-800 transition duration-300 transform hover:scale-105 mt-4 mx-auto block"
          >
              Putar Lagu (Manual)
          </button>
        </>
      ),
      gradientClass: 'card-gradient-5' // Biru paling dominan
    }
  ];

  return (
    // INI ADALAH PEMBUNGKUS UTAMA UNTUK SELURUH APLIKASI
    // Pastikan DIV ini adalah elemen terluar di dalam return
    <div className="min-h-screen bg-gradient-to-br from-[#300080] to-[#5800FF] font-inter text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">

      {/* !!! START: ELEMEN AUDIO DIPINDAHKAN KE SINI !!! */}
      {/* Elemen audio disembunyikan agar selalu ada di DOM sejak awal, bisa diakses oleh audioRef */}
      {/* preload="auto" agar browser mencoba memuatnya lebih awal (opsional tapi disarankan) */}
      <audio ref={audioRef} src="/HBDSuci.mp3" preload="auto" className="hidden" />
      {/* !!! END: ELEMEN AUDIO DIPINDAHKAN KE SINI !!! */}

      {/* Bagian POP-UP - Hanya tampil jika state showGreetingPopup adalah true */}
      {showGreetingPopup && (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 ${isPopupFadingOut ? 'fade-out' : 'animate-fadeInUp'}`}>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full custom-shadow-card">
            <h2 className="text-3xl font-extrabold mb-4 animate-reveal-1">
              {getGreeting()}
            </h2>
            <p className="text-lg mb-4 animate-reveal-2">
              Sorry udah bikin kamu nunggu seharian tadi. Aku sengaja nahan diri buat ga bales chatnya dulu, soalnya kejutannya emang masih dikerjain :'(
              Harusnya "kejutan kecil" ini aku kirimnya sedari kemaren. Tapi.. Nanti deh aku jelasinnya. Sekarang kamu nikmati dulu aja kali ya.. Hehe
            </p>
            <p className="text-xl font-semibold mb-6 animate-reveal-3">
              Semoga kamu suka yaa...
            </p>

            {/* KONTROL MUSIK POP-UP (PLAN B) */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-6">
              {!isMusicPlaying ? ( // Tampilkan tombol play jika musik belum diputar
                <button
                  onClick={handlePlayMusic}
                  className="bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-800 transition duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                    Putar Dulu Lagunya!
                  </span>
                </button>
              ) : ( // Tampilkan indikator jika musik sudah diputar
                <p className="text-md text-gray-200 animate-pulse-fast">Lagu diputar...</p>
              )}

              {/* Tombol "Oke, Lanjutt..." hanya muncul setelah tombol play diklik atau jika play gagal */}
              {showProceedButton && (
                <button
                  onClick={handleProceedFromPopup}
                  className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105 mt-4"
                >
                  Oke, Lanjutt...
                </button>
              )}
            </div>
            {/* AKHIR KONTROL MUSIK POP-UP */}

          </div>
        </div>
      )}

      {/* Bagian Amplop - Hanya tampil jika pop-up sudah tidak ada DAN konten utama belum terlihat */}
      {!showGreetingPopup && !showMainContent && (
        <div
          className={`envelope-wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-in-out ${
            isEnvelopeOpen ? "open" : ""
          } ${isRevealedContentFadingOut ? "fade-out" : ""}`}
          // Klik pada wrapper ini juga memicu pembukaan amplop, tapi hanya jika belum terbuka
          onClick={!isEnvelopeOpen ? handleOpenEnvelope : null}
        >
          {/* Konten yang akan terlihat saat amplop terbuka (ini adalah "surat" di dalamnya) */}
          <div className={`envelope-revealed-content bg-gradient-to-br from-[#4000A0] to-[#5800FF] ${isRevealedContentFadingOut ? 'fade-out' : ''}`}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg text-[#00D7FF]">
              Selamat Ulang Tahun!
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              Sebuah kejutan kecil untuk Suci Lestari
            </p>
            {isEnvelopeOpen && showSparkleBurst && <div className="sparkle-burst"></div>} {/* Efek sparkle burst */}
          </div>

          {/* Bagian atas amplop (flap) */}
          <div className="envelope-half top-half border-b-2 border-[#00D7FF]">
            <div className="sender-info">
              From: <span className="sender-name-gradient">Hendy Setiawan</span>
              <span className="small-text">di Pasuruan</span>
            </div>
          </div>
          {/* Bagian bawah amplop (flap) */}
          <div className="envelope-half bottom-half border-t-2 border-[#00D7FF]">
            <div className="recipient-info">
              To: <span className="recipient-name-gradient">Suci Lestari</span>
              <span className="small-text">di Karawang</span>
            </div>
          </div>

          {/* Konten yang terlihat di bagian depan amplop saat tertutup (hanya tombol) */}
          <div className="envelope-front-overlay">
            <button
              onClick={handleOpenEnvelope} // Tombol ini juga membuka amplop (fallback jika user tidak klik pop-up)
              className="bg-[#0096FF] text-white px-8 py-3 rounded-full shadow-lg hover:bg-[#00D7FF] transition duration-300 transform hover:scale-105"
            >
              Buka Amplop ini ya, Neng!
            </button>
          </div>
        </div>
      )}

      {/* Konten Utama Microsite - Hanya tampil jika state showMainContent adalah true */}
      {showMainContent && (
        <div className="w-full max-w-md bg-[#4000A0] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 custom-shadow-main animate-fadeInInstant">
          {/* Header Utama */}
          <div className="text-center mb-6 animate-reveal-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00D7FF] drop-shadow-md">
              Untuk Suci Lestari
            </h2>
            <p className="text-lg md:text-xl text-white mt-2">
              Di Usia ke-26
            </p>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00D7FF] to-transparent rounded-full my-4"></div>
          </div>

          {/* Render semua kartu konten */}
          {contentCards.map((card, index) => (
            <div
              key={card.id}
              className={`
                card-base
                ${card.gradientClass}
                custom-shadow-card
                animate-reveal-${index + 1}
                ${expandedCardId === null ? 'animate-card-sway' : ''}
                ${expandedCardId === card.id ? 'expanded' : ''}
              `}
            >
              <div className="card-header" onClick={() => handleCardClick(card.id)}>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md leading-tight">
                  {card.title}
                </h3>
                <svg
                  className={`w-8 h-8 text-white transition-transform duration-300 ${
                    expandedCardId === card.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              <div className="card-content">
                {card.content}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="text-center text-sm mt-8 animate-reveal-6">
            <p>&copy; 2025 Dibuat pake ❤️ oleh Mantanmu</p>
            <p className="text-xs mt-1">Update Terakhir: 14 Juli 2015 - 19:01 WIB</p>
          </div>
        </div>
      )}
    </div>
  );
}; // Akhir dari komponen App

export default App; // Pastikan ini berada di baris paling akhir file Anda, di luar fungsi App.