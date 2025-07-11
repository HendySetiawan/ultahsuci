import React, { useState, useEffect, useRef } from 'react';

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
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
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

      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Font Inter */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Mencegah scroll horizontal */
          }

          /* General Animations */
          /* Menggunakan revealContent untuk semua elemen yang muncul secara berurutan */
          @keyframes revealContent {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          /* Animasi instan untuk kontainer utama setelah amplop terbuka */
          .animate-fadeInInstant {
            animation: fadeInInstant 0.1s ease-out forwards; /* Sangat cepat */
            animation-delay: 6.5s; /* Mulai setelah urutan amplop selesai */
          }
          @keyframes fadeInInstant {
            from { opacity: 0; }
            to { opacity: 1; }
          }


          /* Envelope Styling and Animations */
          .envelope-wrapper {
            position: absolute;
            width: 90%; /* Responsive width */
            max-width: 350px; /* Max width for larger screens */
            aspect-ratio: 1.4 / 1; /* Common envelope aspect ratio */
            cursor: pointer; /* Cursor indicates clickable area */
            border-radius: 1rem; /* Rounded corners for the whole envelope area */
            overflow: hidden; /* Ensure halves don't spill */
            box-shadow: 0 10px 25px rgba(0,0,0,0.3); /* Subtle shadow */
            display: flex; /* For centering content */
            justify-content: center;
            align-items: center;
            
            /* Animasi Gradasi Warna */
            background: linear-gradient(135deg, #5800FF, #0096FF, #5800FF); /* Ungu ke Biru ke Ungu */
            background-size: 200% 200%; /* Ukuran background lebih besar dari elemen */
            animation: gradientAnimation 10s ease infinite alternate; /* Animasi gradasi */
          }

          .envelope-half {
            position: absolute;
            left: 0;
            width: 100%;
            height: 50%;
            transition: transform 1.5s ease-in-out; /* Smooth transition */
            z-index: 2; /* Di atas konten yang terungkap */
            border-radius: 1rem; /* Inherit from wrapper */
            /* Warna gradasi pada flap amplop */
            background: linear-gradient(135deg, #5800FF, #0096FF, #5800FF); /* Ungu ke Biru ke Ungu */
            background-size: 200% 200%; /* Ukuran background lebih besar dari elemen */
            animation: gradientAnimation 10s ease infinite alternate; /* Animasi gradasi */
          }

          .top-half {
            top: 0;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 2px solid #00D7FF; /* Neon Light Blue border for the split line */
          }

          .bottom-half {
            bottom: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-top: 2px solid #00D7FF; /* Neon Light Blue border for the split line */
          }

          .envelope-revealed-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            text-align: center;
            border-radius: 1rem;
            z-index: 1; /* Di bawah flap amplop */
            opacity: 0; /* Awalnya tersembunyi */
            /* Transisi untuk fade-in dan fade-out */
            transition: opacity 0.5s ease-in-out; /* Default transition for fade-in */
          }

          .envelope-wrapper.open .envelope-revealed-content {
            opacity: 1; /* Tampilkan saat amplop terbuka */
            transition-delay: 1.5s; /* Delay untuk fade-in setelah amplop terbuka */
          }

          .envelope-revealed-content.fade-out {
            opacity: 0;
            transition: opacity 1s ease-out; /* Override transisi untuk fade-out */
            transition-delay: 0s; /* Tanpa delay untuk fade-out */
          }

          .envelope-front-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            text-align: center;
            z-index: 3; /* Di atas flap amplop saat tertutup */
            background-color: transparent; /* Tanpa background, hanya konten */
            transition: opacity 0.5s ease-in-out;
          }

          /* Open state for envelope */
          .envelope-wrapper.open .top-half {
            transform: translateY(-100%); /* Bergerak ke atas sebesar tingginya */
          }

          .envelope-wrapper.open .bottom-half {
            transform: translateY(100%); /* Bergerak ke bawah sebesar tingginya */
          }

          /* Ketika amplop terbuka, sembunyikan overlay depan sepenuhnya */
          .envelope-wrapper.open .envelope-front-overlay {
            opacity: 0; /* Sembunyikan overlay depan saat terbuka */
            pointer-events: none; /* Nonaktifkan klik pada overlay yang tersembunyi */
            z-index: -1; /* Pastikan ia berada di belakang semua konten */
          }

          /* Keyframes untuk Animasi Gradasi Warna */
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Custom Shadow for main content container */
          .custom-shadow-main {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4), /* Black shadow */
                        0 0 25px rgba(88, 0, 255, 0.3),   /* Purple glow */
                        0 0 40px rgba(0, 215, 255, 0.2);  /* Lighter blue neon */
          }

          /* Styles for sender/recipient text on envelope halves */
          .sender-info, .recipient-info {
            position: absolute;
            width: 100%;
            text-align: center;
            font-weight: bold;
            font-size: 1.25rem; /* text-xl */
            line-height: 1.2;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Bayangan hitam yang lebih lembut */
            /* Pastikan teks berada di atas gradasi background flap */
            z-index: 3; /* Lebih tinggi dari flap (z-index: 2) */
          }

          .sender-info {
            top: 50%; /* Disesuaikan ke 50% */
            transform: translateY(-50%);
          }

          .sender-info .small-text {
            font-size: 0.875rem; /* text-sm */
            font-weight: normal;
            display: block;
            margin-top: 0.25rem;
            color: rgba(255, 255, 255, 0.8); /* Putih sedikit pudar */
          }

          .recipient-info {
            bottom: 50%; /* Disesuaikan ke 50% */
            transform: translateY(50%);
          }

          .recipient-info .small-text {
            font-size: 0.875rem; /* text-sm */
            font-weight: normal;
            display: block;
            margin-top: 0.25rem;
            color: rgba(255, 255, 255, 0.8); /* Putih sedikit pudar */
          }

          /* Gradient for Hendy Setiawan */
          .sender-name-gradient {
            background: linear-gradient(90deg, #FFFFFF, #0096FF); /* Putih ke Biru */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text; /* Standard property */
            color: transparent; /* Fallback for non-webkit browsers */
            background-size: 200% 100%;
            animation: textGradientAnimationHendy 2s ease infinite alternate; /* Dipercepat menjadi 2 detik */
          }

          /* Gradient for Suci Lestari */
          .recipient-name-gradient {
            background: linear-gradient(90deg, #5800FF, #FF69B4); /* Ungu ke Pink Cerah (HotPink) */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text; /* Standard property */
            color: transparent; /* Fallback for non-webkit browsers */
            background-size: 200% 100%;
            animation: textGradientAnimationSuci 2s ease infinite alternate; /* Dipercepat menjadi 2 detik */
          }

          /* Keyframes for text gradient animations */
          @keyframes textGradientAnimationHendy {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          @keyframes textGradientAnimationSuci {
            0% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Hide text when envelope opens */
          .envelope-wrapper.open .sender-info,
          .envelope-wrapper.open .recipient-info {
            opacity: 0;
            transition: opacity 0.3s ease-out;
          }

          /* Sparkle Burst Animation */
          .sparkle-burst {
            position: absolute;
            width: 120px; /* Ukuran efek */
            height: 120px;
            background: radial-gradient(circle, #72FFFF 0%, transparent 70%); /* Cahaya neon */
            border-radius: 50%;
            opacity: 0;
            transform: scale(0);
            animation: sparkleBurst 1s ease-out forwards; /* Animasi singkat */
            z-index: 4; /* Di atas konten surat */
          }

          @keyframes sparkleBurst {
            0% { opacity: 1; transform: scale(0); }
            50% { opacity: 1; transform: scale(2.5); }
            100% { opacity: 0; transform: scale(5); }
          }

          /* Sequential Reveal Animations for Main Content */
          /* Menggunakan revealContent untuk semua elemen yang muncul secara berurutan */
          .animate-reveal-0 { animation: revealContent 1.2s ease-out forwards; animation-delay: 0.2s; will-change: transform, opacity; transform: translateZ(0); } /* Header Utama */
          .animate-reveal-1 { animation: revealContent 1.2s ease-out forwards; animation-delay: 0.8s; will-change: transform, opacity; transform: translateZ(0); } /* Kartu 1: Ucapan Selamat Ulang Tahun */
          .animate-reveal-2 { animation: revealContent 1.2s ease-out forwards; animation-delay: 1.4s; will-change: transform, opacity; transform: translateZ(0); } /* Kartu 2: Doa dan Harapan */
          .animate-reveal-3 { animation: revealContent 1.2s ease-out forwards; animation-delay: 2.0s; will-change: transform, opacity; transform: translateZ(0); } /* Kartu 3: Pesan Dariku, Hendy */
          .animate-reveal-4 { animation: revealContent 1.2s ease-out forwards; animation-delay: 2.6s; will-change: transform, opacity; transform: translateZ(0); } /* Garis Pembatas (jika ada) */
          .animate-reveal-5 { animation: revealContent 1.2s ease-out forwards; animation-delay: 3.2s; will-change: transform, opacity; transform: translateZ(0); } /* Kartu 4: Kartu Galeri Foto */
          .animate-reveal-6 { animation: revealContent 1.2s ease-out forwards; animation-delay: 3.8s; will-change: transform, opacity; transform: translateZ(0); } /* Kartu 5: Hadiah Digital */
          .animate-reveal-7 { animation: revealContent 1.2s ease-out forwards; animation-delay: 4.4s; will-change: transform, opacity; transform: translateZ(0); } /* Footer */


          /* Card Base Styling */
          .card-base {
            border-radius: 0.75rem; /* Sedikit lancip, antara rounded-lg (0.5rem) dan rounded-xl (0.75rem) */
            padding: 1.5rem; /* p-6 */
            border: 2px solid transparent; /* Border awal transparan */
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease-in-out; /* Transisi umum */
            position: relative; /* Untuk z-index dan shadow */
            z-index: 1; /* Default z-index */
            will-change: transform, box-shadow, height; /* Optimasi performa animasi */
          }

          .card-base.expanded {
            transform: scale(1.02); /* Efek sedikit membesar saat expanded */
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6); /* Shadow lebih kuat saat expanded */
            height: auto !important; /* Biarkan konten menentukan tinggi */
            max-height: 500px; /* Batas tinggi untuk transisi */
            transition: all 0.5s ease-in-out; /* Transisi lebih lambat saat expand */
            z-index: 2; /* Kartu yang terbuka di atas yang lain */
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            cursor: pointer; /* Pastikan hanya header yang bisa diklik untuk toggle */
          }

          .card-content {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out;
            margin-top: 0;
            padding-top: 0;
          }

          .card-base.expanded .card-content {
            max-height: 600px; /* Cukup tinggi untuk semua konten */
            opacity: 1;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1); /* Garis pemisah konten yang lebih halus */
          }

          /* Card Gradient Colors */
          .card-gradient-1 {
            background: linear-gradient(135deg, #5800FF, #4000A0); /* Ungu dominan */
            background-size: 200% 200%;
            animation: gradientAnimation 10s ease infinite alternate;
          }
          .card-gradient-2 {
            background: linear-gradient(135deg, #4000A0, #0096FF); /* Ungu ke biru */
            background-size: 200% 200%;
            animation: gradientAnimation 10s ease infinite alternate;
          }
          .card-gradient-3 {
            background: linear-gradient(135deg, #0096FF, #00D7FF); /* Biru ke biru terang */
            background-size: 200% 200%;
            animation: gradientAnimation 10s ease infinite alternate;
          }
          .card-gradient-4 {
            background: linear-gradient(135deg, #00D7FF, #72FFFF); /* Biru terang ke biru paling terang */
            background-size: 200% 200%;
            animation: gradientAnimation 10s ease infinite alternate;
          }
          .card-gradient-5 {
            background: linear-gradient(135deg, #72FFFF, #0096FF); /* Biru paling terang ke biru */
            background-size: 200% 200%;
            animation: gradientAnimation 10s ease infinite alternate;
          }


          /* Card Sway Animation (goyang halus) */
          .animate-card-sway {
            animation: cardSway 3s ease-in-out infinite alternate;
          }

          @keyframes cardSway {
            0% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(0.5deg); }
            75% { transform: translateY(2px) rotate(-0.5deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }

          /* Custom Shadow for cards (hitam biasa) */
          .custom-shadow-card {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Bayangan hitam standar */
          }

          /* Custom scrollbar for better aesthetics, especially on mobile */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default App;
