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
  // Referensi untuk elemen audio agar bisa diatur secara programatis
  const audioRef = useRef(null);

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

  // Fungsi untuk memulai animasi amplop dan memutar lagu
  const handleOpenEnvelope = () => {
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
      if (audioRef.current) {
        // Memutar lagu hanya jika kartu "Hadiah Digital" terbuka
        // Untuk saat ini, lagu akan diputar saat microsite utama muncul
        audioRef.current.play().catch(e => console.error("Gagal memutar audio:", e));
      }
    }, 6500);
  };

  // Data untuk semua kartu konten utama
  const contentCards = [
    {
      id: 'ucapan',
      title: 'Ucapan Selamat Ulang Tahun 🎉',
      content: (
        <p className="text-base md:text-lg text-white leading-relaxed text-center">
          Selamat ulang tahun yang ke-26, Suci Lestari! Semoga hari ini penuh kebahagiaan dan tawa. Angka baru, semangat baru, dan semoga setiap langkahmu dipenuhi keberkahan.
        </p>
      ),
      gradientClass: 'card-gradient-1' // Ungu dominan
    },
    {
      id: 'doa',
      title: 'Doa dan Harapan ✨',
      content: (
        <p className="text-base md:text-lg text-white leading-relaxed text-center">
          Semoga di usia 26 ini, semua impianmu tercapai, langkahmu selalu diberkahi, kesehatan selalu menyertai, dan kebahagiaan senantiasa mengisi setiap harimu.
        </p>
      ),
      gradientClass: 'card-gradient-2' // Ungu ke biru muda
    },
    {
      id: 'pesan',
      title: 'Pesan Dariku, Hendy 💖',
      content: (
        <p className="text-base md:text-lg text-white leading-relaxed text-center">
          Suci, di hari spesialmu ini, aku ingin kamu tahu betapa berharganya persahabatan kita. Meskipun waktu dan jarak seringkali memisahkan, kenangan manis yang pernah kita ukir selalu jadi bagian berharga dalam hidupku. Terima kasih untuk setiap momen tawa dan dukungan yang tak terhingga. Semoga kebahagiaan senantiasa mengisi setiap langkahmu.
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
      title: 'Hadiah Digital 🎶',
      content: (
        <>
          <audio ref={audioRef} controls className="w-full rounded-lg">
            {/* Ganti URL ini dengan URL lagu Suno AI-mu */}
            <source src="%PUBLIC_URL%/HBDSuci.mp3" type="audio/mpeg" />
            Browser Anda tidak mendukung elemen audio.
          </audio>
          <p className="text-sm text-white mt-2 text-center">
            (Lagu ini akan otomatis diputar setelah kamu klik 'Buka Amplop')
          </p>
        </>
      ),
      gradientClass: 'card-gradient-5' // Biru paling dominan
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#300080] to-[#5800FF] font-inter text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Container Amplop */}
      {!showMainContent && (
        <div className={`envelope-wrapper ${isEnvelopeOpen ? 'open' : ''}`} onClick={!isEnvelopeOpen ? handleOpenEnvelope : null}>
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
              onClick={handleOpenEnvelope}
              className="bg-[#0096FF] text-white px-8 py-3 rounded-full shadow-lg hover:bg-[#00D7FF] transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#72FFFF] focus:ring-opacity-50"
            >
              Buka Amplop ini ya, Neng!
            </button>
          </div>
        </div>
      )}

      {/* Konten Utama Microsite */}
      {showMainContent && (
        <div className="w-full max-w-md bg-[#4000A0] bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 custom-shadow-main animate-fadeInInstant">
          {/* Header Utama */}
          <div className="text-center mb-6 animate-reveal-0"> {/* Header juga ikut animasi muncul */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#00D7FF] drop-shadow-md">
              Untuk Suci Lestari
            </h2>
            <p className="text-lg md:text-xl text-white mt-2">
              Di Usia ke-26
            </p>
            {/* Garis Pembatas di bawah subjudul header */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00D7FF] to-transparent rounded-full my-4"></div>
          </div>

          {/* Render semua kartu konten */}
          {contentCards.map((card, index) => (
            <div
              key={card.id}
              className={`
                card-base
                ${card.gradientClass}
                custom-shadow-card /* Shadow hitam untuk kartu */
                animate-reveal-${index + 1} /* Delay untuk muncul bergantian */
                ${expandedCardId === null ? 'animate-card-sway' : ''} /* Goyang halus jika tidak ada kartu yang terbuka */
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
          <div className="text-center text-sm mt-8 animate-reveal-6"> {/* Footer juga ikut animasi muncul */}
            <p>&copy; 2025 Dibuat dengan ❤️ oleh Hendy</p>
            <p className="text-xs mt-1">Powered by Gemini AI & Suno AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
