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

  // Data untuk galeri foto (akan digunakan di Kartu Galeri Foto)
  const galleryPhotos = [
    {
      id: 1,
      src: "https://placehold.co/400x250/5800FF/00D7FF?text=Foto+1", // Placeholder, ganti dengan foto asli
      caption: "Momen di Pantai Sanur, Bali (2020)"
    },
    {
      id: 2,
      src: "https://placehold.co/400x250/0096FF/72FFFF?text=Foto+2", // Placeholder, ganti dengan foto asli
      caption: "Petualangan di Gunung Bromo (2021)"
    },
    {
      id: 3,
      src: "https://placehold.co/400x250/00D7FF/5800FF?text=Foto+3", // Placeholder, ganti dengan foto asli
      caption: "Hangout di Kafe Jakarta (2022)"
    }
  ];
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fungsi untuk navigasi galeri foto
  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      (prevIndex + 1) % galleryPhotos.length
    );
  };

  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) =>
      (prevIndex - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  };

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
      return "Selamat Pagi,";
    } else if (hour >= 12 && hour < 15) {
      return "Selamat Siang,";
    } else if (hour >= 15 && hour < 18) {
      return "Selamat Sore,";
    } else {
      return "Selamat Malam,";
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
        alert("Ops! Browser Anda memblokir pemutaran audio otomatis. Silakan klik 'Oke, Lanjutt...' dan putar lagu secara manual di bagian 'Hadiah Digital'.");
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
  Neng, di umur yang makin matang ini (jangan ngaku bocil lagi ya!), aku doain semoga semua asa dan cita-citamu tercapai.<br/>
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
      title: 'Pesan Dariku, Hendy 💖',
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
      id: 'galeri',
      title: 'Kartu Galeri Foto 📸',
      content: (
        <>
          <div className="relative w-full rounded-xl overflow-hidden mb-4 shadow-lg border border-[#0096FF]">
            <img
              src={galleryPhotos[currentPhotoIndex].src}
              alt={`Foto ${currentPhotoIndex + 1}`}
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x250/CCCCCC/000000?text=Gambar+Tidak+Tersedia'; }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-2 text-center text-sm text-white">
              {galleryPhotos[currentPhotoIndex].caption}
            </div>
            {/* Tombol Navigasi Galeri */}
            <button
              onClick={goToPrevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 text-white hover:bg-opacity-50 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
              onClick={goToNextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 rounded-full p-2 text-white hover:bg-opacity-50 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
          <p className="text-sm text-white text-center mt-2">
            (Geser foto dengan tombol panah di samping!)
          </p>
        </>
      ),
      gradientClass: 'card-gradient-4' // Biru dominan
    },
    {
      id: 'hadiah',
      title: 'Hadiah Digital',
      content: (
        <>
          {/* Elemen audio sudah dipindahkan ke atas di luar kondisi */}
          <p className="text-base md:text-lg text-white leading-relaxed text-center">
            Ada lagu kejutan yang sudah menunggumu! Jika belum diputar, kamu bisa memutarnya sekarang.
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
              Halo, neng! Ini adalah aplikasi berbasis web sederhana yang aku bikinin khusus buat Ulang Tahun kamu yang ke 26 Tahun ini.
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
                    Putar Lagu Kejutan!
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
            <p>&copy; 2025 Dibuat dengan ❤️ oleh Hendy</p>
            <p className="text-xs mt-1">Powered by Gemini AI & Suno AI</p>
          </div>
        </div>
      )}
    </div>
  );
}; // Akhir dari komponen App

export default App; // Pastikan ini berada di baris paling akhir file Anda, di luar fungsi App.