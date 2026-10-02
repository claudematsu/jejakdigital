let targetData = {
    name: "", username: "", email: "", initials: "", avatarUrl: "", footprints: []
};
let currentSiteId = null;

// Fisher-Yates Shuffle untuk pengacakan array yang sempurna
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateTargetMeta(fullName) {
    const names = fullName.trim().split(/\s+/);
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    
    const initials = names.map(n => n.charAt(0).toUpperCase()).slice(0, 2).join('');
    const username = (firstName + (lastName ? '_' + lastName : '') + Math.floor(Math.random() * 99)).toLowerCase();
    const email = username + '@fakemail.com';
    
    // Generate dummy photo deterministically based on username
    const avatarUrl = `https://picsum.photos/seed/${username}/200/200`;

    return { name: fullName, firstName, lastName, username, email, initials, avatarUrl };
}

function getMasterFootprints(meta) {
    return [
        {
            id: "soc_" + Date.now() + Math.random(),
            category: "Media Sosial (Profil Publik)",
            platform: "FakeBook",
            url: `https://fakebook.com/${meta.username}`,
            title: "Profil Terbuka & Eksposur Keseharian",
            snippet: `Akun atas nama ${meta.name} disetting publik. Memuat opini sensitif tentang tempat kerja dan pengumuman rumah kosong saat liburan.`,
            risk: "Postingan negatif tentang pekerjaan berisiko merusak karir saat Background Check oleh HRD. Pengumuman liburan memicu risiko pencurian fisik di rumah.",
            deletionSteps: [
                "Buka aplikasi FakeBook dan masuk ke halaman Profil Anda.",
                "Scroll dan cari postingan terkait liburan rumah kosong atau keluhan pekerjaan.",
                "Klik ikon 3-titik di pojok kanan atas postingan tersebut.",
                "Pilih 'Move to Trash' (Pindah ke Sampah) atau ubah privasi menjadi 'Only Me'."
            ],
            preventionSteps: [
                "Ubah pengaturan privasi akun secara keseluruhan menjadi 'Friends Only'.",
                "Jangan memposting keluhan internal perusahaan ke media sosial publik.",
                "Hindari mengumumkan bahwa rumah sedang kosong; posting foto liburan setelah Anda pulang."
            ],
            type: "social"
        },
        {
            id: "insta_" + Date.now() + Math.random(),
            category: "Media Sosial (Visual & Lokasi)",
            platform: "InstaSnap",
            url: `https://instasnap.com/${meta.username}`,
            title: "Galeri Foto dengan Geotagging",
            snippet: `Galeri foto publik menampilkan rutinitas harian dengan tag lokasi presisi (rumah, sekolah, cafe).`,
            risk: "Foto dengan tag lokasi (geotag) yang konsisten dapat digunakan pihak tak bertanggung jawab (stalker/penguntit) untuk memetakan pola pergerakan harian Anda.",
            deletionSteps: [
                "Buka profil InstaSnap Anda.",
                "Pilih foto yang mengandung geotag spesifik (terutama lokasi rumah).",
                "Tap ikon 3-titik di kanan atas foto, lalu pilih 'Edit' untuk menghapus lokasi, atau 'Archive' (Arsipkan) fotonya.",
                "Buka Pengaturan HP Anda > Aplikasi > InstaSnap > Izin (Permissions).",
                "Matikan akses Izin Lokasi (Location Services)."
            ],
            preventionSteps: [
                "Ubah akun menjadi 'Private' jika berisi foto-foto personal keluarga.",
                "Jika akun harus publik, jangan gunakan fitur penanda lokasi (*Add Location*) pada tempat-tempat rutin.",
                "Gunakan trik 'Late Post' (posting foto beberapa jam setelah Anda meninggalkan lokasi)."
            ],
            type: "instasnap"
        },
        {
            id: "chirp_" + Date.now() + Math.random(),
            category: "Microblogging (Real-time)",
            platform: "Chirp (X)",
            url: `https://chirp.com/${meta.username}`,
            title: "Oversharing Data Pribadi & Lokasi",
            snippet: `Akun memposting nomor e-wallet/HP untuk ikut giveaway publik dan sering mencuitkan lokasi macet secara real-time.`,
            risk: "Membagikan nomor HP secara publik mengundang penipuan, spam, dan peretasan (seperti meminta kode OTP). Mencuitkan lokasi real-time membuka celah pengintaian fisik.",
            deletionSteps: [
                "Masuk ke Profil Anda dan pilih tab 'Posts/Replies'.",
                "Cari cuitan yang memuat nomor e-wallet, HP, atau data pribadi lainnya.",
                "Klik ikon 3-titik di kanan atas cuitan tersebut.",
                "Pilih opsi 'Delete' (Hapus) dan konfirmasi."
            ],
            preventionSteps: [
                "Jangan menggunakan nomor utama (yang terhubung m-banking) untuk keperluan giveaway publik.",
                "Jangan mencuitkan lokasi spesifik secara real-time. Bagikan cerita perjalanan setelah tiba di tujuan yang aman."
            ],
            type: "chirp"
        },
        {
            id: "vidtok_" + Date.now() + Math.random(),
            category: "Video Pendek (Shorts)",
            platform: "VidTok",
            url: `https://vidtok.app/@${meta.username}`,
            title: "Eksposur Latar Belakang (OSINT Visual)",
            snippet: `Video tarian/vlog secara tidak sengaja merekam jelas ID Card kantor (Lanyard) dan label resi paket belanja di kamar.`,
            risk: "Resolusi kamera modern sangat tinggi. Peretas sering mem-pause video untuk membaca teks kecil seperti barcode tiket, ID Card, atau label alamat paket untuk rekayasa sosial.",
            deletionSteps: [
                "Buka tab Profil pada aplikasi VidTok.",
                "Pilih video yang secara tidak sengaja merekam privasi (seperti ID Card/Resi Paket).",
                "Tap ikon titik tiga (Opsi) di kanan bawah video.",
                "Pilih ikon tempat sampah 'Delete' atau ubah privasi ke 'Only me' (Hanya Saya)."
            ],
            preventionSteps: [
                "Selalu balikkan atau lepas Lanyard/ID Card sebelum merekam konten apapun.",
                "Robek atau coret menggunakan spidol hitam pada resi paket belanjaan sebelum membuang atau meletakkannya di meja."
            ],
            type: "vidtok"
        },
        {
            id: "vidtube_" + Date.now() + Math.random(),
            category: "Video Sharing (Vlog)",
            platform: "VidTube",
            url: `https://vidtube.com/c/${meta.username}`,
            title: "Vlog Keseharian & Plat Nomor Kendaraan",
            snippet: `Video 'A Day in My Life' menampilkan rute berangkat kerja dan mengekspos plat nomor kendaraan pribadi tanpa disensor.`,
            risk: "Plat nomor kendaraan (OSINT Pelat) dapat dilacak menggunakan layanan cek pajak kendaraan online untuk mengetahui nama pemilik asli dan alamat STNK.",
            deletionSteps: [
                "Login ke dashboard VidTube Studio (versi web atau aplikasi).",
                "Masuk ke menu 'Content' dan pilih video vlog yang bermasalah.",
                "Gunakan fitur 'Editor' bawaan platform > 'Blur' > 'Custom Blur' untuk menyensor bagian plat nomor kendaraan sepanjang video.",
                "Jika proses editing gagal, ubah status video menjadi 'Private'."
            ],
            preventionSteps: [
                "Selalu sensor informasi identitas publik (plat nomor, alamat rumah, nomor rumah) secara manual saat proses editing offline sebelum di-upload."
            ],
            type: "vidtube"
        },
        {
            id: "forum_" + Date.now() + Math.random(),
            category: "Forum Diskusi Web",
            platform: "IndoSejarahForum",
            url: `https://indosejarahforum.net/user/${meta.username}`,
            title: "Jejak Komentar dengan Nama Asli",
            snippet: `Akun menggunakan nama asli ${meta.name} yang membahas opini politik sensitif, terindeks permanen oleh Google Search.`,
            risk: "Penggunaan nama asli di forum publik memudahkan pihak ketiga memprofiling ideologi/karakter Anda. Jejak forum lawas sangat sulit dihapus dari cache Google.",
            deletionSteps: [
                "Login ke situs forum tersebut.",
                "Cari riwayat postingan (My Posts).",
                "Klik tombol 'Edit' lalu hapus seluruh teksnya (ganti dengan tanda titik/kosong), lalu simpan. (Lakukan ini jika tombol Delete tidak ada).",
                "Hubungi Admin Forum via 'Contact Us' untuk meminta penghapusan akun (Right to be Forgotten)."
            ],
            preventionSteps: [
                "Selalu gunakan pseudonim (nama samaran/avatar tak berwajah) saat membuat akun di forum publik atau kolom komentar berita.",
                "Jangan pernah mendaftar forum publik menggunakan email kantor/instansi."
            ],
            type: "forum"
        },
        {
            id: "rev_" + Date.now() + Math.random(),
            category: "Aplikasi Ulasan (Review)",
            platform: "ZomaYelp",
            url: `https://zomayelp.id/user/${meta.username}/reviews`,
            title: "Pola Rutinitas dari Riwayat Ulasan",
            snippet: `Serangkaian ulasan untuk Klinik, Gym, dan Cafe mengungkap jadwal rutinitas mingguan yang sangat mendetail.`,
            risk: "Ulasan publik yang menyebutkan hari dan jam kedatangan spesifik (misal: 'Saya selalu nge-gym kesini tiap rabu malam') memberikan peta jadwal rutin gratis kepada penguntit.",
            deletionSteps: [
                "Buka aplikasi ZomaYelp.",
                "Masuk ke menu 'My Profile' > 'Reviews' (Ulasan Anda).",
                "Cari ulasan spesifik yang membocorkan rutinitas harian.",
                "Klik 'Edit Review' untuk menghapus bagian jadwal hari/jam, atau pilih 'Delete Review' untuk mencabut keseluruhan ulasan."
            ],
            preventionSteps: [
                "Fokuslah mengulas rasa makanan atau kualitas pelayanan, hindari menyebutkan jadwal pribadi (hari, jam, bersama siapa).",
                "Gunakan Inisial nama pada platform ulasan."
            ],
            type: "review"
        },
        {
            id: "breach_" + Date.now() + Math.random(),
            category: "Kebocoran Data (Data Breach)",
            platform: "PwnedCheck Database",
            url: `https://pwned.checker/search?q=${meta.email}`,
            title: "Kredensial Email Terekspos",
            snippet: `Email ${meta.email} ditemukan dalam database kebocoran e-commerce tahun lalu beserta password yang di-hash.`,
            risk: "Password yang bocor dapat digunakan peretas (Hacker) untuk melakukan serangan 'Credential Stuffing' (mencoba login menggunakan email dan password yang sama persis di platform lain seperti media sosial atau bank).",
            deletionSteps: [
                "Karena data sudah terlanjur bocor di darkweb, data ini TIDAK BISA dihapus.",
                "Langkah mitigasi satu-satunya: Segera ubah kata sandi (Change Password) di platform yang mengalami kebocoran tersebut.",
                "Buka platform email utama Anda (misal: Gmail) dan ubah password emailnya jika Anda menggunakan password yang sama."
            ],
            preventionSteps: [
                "Wajib mengaktifkan Autentikasi Dua Faktor (2FA / OTP) di setiap akun penting.",
                "Gunakan aplikasi pengelola kata sandi (Password Manager) agar password Anda berbeda-beda di setiap website."
            ],
            type: "breach"
        },
        {
            id: "job_" + Date.now() + Math.random(),
            category: "Portal Karir Profesional",
            platform: "KarirPro",
            url: `https://karirpro.com/in/${meta.username}`,
            title: "Dokumen CV / Resume Publik",
            snippet: `File CV (.pdf) yang diunggah disetting publik. File ini mengekspos nomor HP aktif, alamat rumah lengkap, dan kontak darurat.`,
            risk: "Mengunggah CV lengkap ke portal publik sering kali di-scrape oleh bot telemarketing, menyebabkan Anda menerima banyak panggilan spam, tawaran judi online, atau penipuan rekayasa sosial (Social Engineering).",
            deletionSteps: [
                "Masuk ke akun portal lowongan kerja tersebut.",
                "Buka halaman Profil Anda.",
                "Cari bagian 'Attachments / CV', lalu HAPUS dokumen CV versi lama yang memuat alamat lengkap.",
                "Upload ulang CV versi publik (yang sudah disensor detail pribadinya)."
            ],
            preventionSteps: [
                "Buat CV 'Versi Publik': Hapus alamat rumah presisi (cukup tulis Kota/Provinsi saja).",
                "Pertimbangkan untuk memiliki nomor HP kedua khusus untuk melamar pekerjaan yang bisa dimatikan jika banyak spam masuk."
            ],
            type: "job"
        },
        {
            id: "fit_" + Date.now() + Math.random(),
            category: "Pelacak Kebugaran",
            platform: "RunTrackr",
            url: `https://runtrackr.app/athlete/${meta.username}`,
            title: "Peta GPS Rute Olahraga (Stalking Risk)",
            snippet: `Riwayat olahraga pagi (GPS) disetting publik, selalu berawal dan berakhir di titik koordinat rumah yang sama.`,
            risk: "Membiarkan rute lari terekam jelas di peta publik akan memberitahu orang asing di mana tepatnya Anda tinggal (koordinat presisi) dan jam berapa rumah Anda kosong saat berolahraga.",
            deletionSteps: [
                "Buka aplikasi pelacak olahraga (seperti Strava / RunTrackr).",
                "Masuk ke pengaturan privasi riwayat aktivitas lama, ubah dari 'Public' menjadi 'Only Me' atau 'Followers'.",
                "Masuk ke menu 'Privacy Controls' > 'Privacy Zones' (Zona Privasi).",
                "Tambahkan alamat rumah Anda agar sistem secara otomatis menyamarkan rute awal/akhir dalam radius 1km dari rumah."
            ],
            preventionSteps: [
                "Atur Default Privacy untuk setiap aktivitas olahraga baru menjadi 'Followers Only' (Hanya Pengikut)."
            ],
            type: "fitness"
        }
    ];
}

function handleSearch(e) {
    e.preventDefault();
    const input = document.getElementById('mainSearchInput').value.trim();
    if(!input) return;

    const meta = generateTargetMeta(input);
    const masterList = getMasterFootprints(meta);
    
    // Randomisasi sempurna dengan Fisher-Yates
    const shuffled = shuffleArray([...masterList]);
    // Pilih 5 sampai 8 data secara acak agar hasil tiap pencarian berbeda-beda
    const selectedCount = Math.floor(Math.random() * 4) + 5; 
    
    targetData = {
        ...meta,
        footprints: shuffled.slice(0, selectedCount)
    };

    document.getElementById('targetNameDisplay').innerText = targetData.name.toUpperCase();
    document.getElementById('resultsCountText').innerText = `Sistem menemukan ${targetData.footprints.length} rekam jejak digital yang membutuhkan mitigasi.`;

    // Animasi Loading Profesional
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
    
    const progressBar = document.getElementById('loadingProgress');
    progressBar.style.transform = 'scaleX(0)';
    setTimeout(() => { progressBar.style.transform = 'scaleX(1)'; }, 50);

    const texts = ["Mengindeks direktori mesin pencari...", "Menganalisis profil media sosial publik...", "Memindai basis data kebocoran (dark web)...", "Mengekstrak metadata dokumen & gambar...", "Menyusun laporan audit keamanan..."];
    let tIdx = 0;
    const tEl = document.getElementById('loadingText');
    tEl.innerText = texts[0];
    
    const tInt = setInterval(() => {
        tIdx++;
        if(tIdx < texts.length) tEl.innerText = texts[tIdx];
    }, 500);

    setTimeout(() => {
        clearInterval(tInt);
        overlay.classList.add('hidden');
        renderResults();
        showView('results');
    }, 2500);
}

function showView(viewId) {
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('resultsView').classList.add('hidden');
    document.getElementById('dummyWebView').classList.add('hidden');

    document.getElementById(viewId + 'View').classList.remove('hidden');
    
    if(viewId === 'results') {
        document.getElementById('resultsView').classList.add('flex');
        window.scrollTo({top:0});
    } else if (viewId === 'home') {
         document.getElementById('mainSearchInput').value = '';
    }
}

function renderResults() {
    const list = document.getElementById('footprintsList');
    list.innerHTML = '';

    targetData.footprints.forEach((item, index) => {
        list.innerHTML += `
            <div class="bg-white border border-audit-border rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div class="flex items-center gap-3">
                        <span class="bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs px-2.5 py-1 rounded-md font-semibold">
                            [#${index+1}] ${item.category}
                        </span>
                    </div>
                    <button onclick="openMitigasi('${item.id}')" class="text-white bg-amber-500 hover:bg-amber-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Analisis & Mitigasi
                    </button>
                </div>
                
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-audit-primary font-bold text-lg">${item.platform}</span>
                    <span class="text-slate-300">|</span>
                    <h3 class="text-lg font-semibold text-audit-heading">${item.title}</h3>
                </div>
                
                <p class="text-sm text-audit-text mb-6 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">${item.snippet}</p>
                
                <div class="pt-4 border-t border-audit-border">
                    <button onclick="openDummySite('${item.id}')" class="text-audit-primary hover:text-audit-primaryHover font-semibold text-sm flex items-center gap-2 group">
                        <span class="bg-blue-50 group-hover:bg-blue-100 p-1.5 rounded-md transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </span>
                        Buka Simulasi Bukti Web
                    </button>
                </div>
            </div>
        `;
    });
}

function getFootprint(id) { return targetData.footprints.find(f => f.id === id); }

function openMitigasi(id) {
    const data = getFootprint(id);
    if(!data) return;

    document.getElementById('mitigasiTitle').innerText = `${data.platform} — ${data.category}`;
    document.getElementById('mitigasiRisk').innerText = data.risk;
    
    // Populate Deletion / Technical Steps (dengan penomoran tebal)
    const delStepsList = document.getElementById('mitigasiDeletionSteps');
    delStepsList.innerHTML = '';
    data.deletionSteps.forEach((step, idx) => {
        delStepsList.innerHTML += `
            <li class="flex gap-3">
                <span class="bg-blue-200 text-blue-800 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5">${idx+1}</span>
                <span>${step}</span>
            </li>`;
    });

    // Populate Prevention Steps (dengan bullet points)
    const prevStepsList = document.getElementById('mitigasiPreventionSteps');
    prevStepsList.innerHTML = '';
    data.preventionSteps.forEach(step => {
        prevStepsList.innerHTML += `
            <li class="flex gap-3">
                <span class="text-emerald-500 mt-1 shrink-0"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></span>
                <span>${step}</span>
            </li>`;
    });

    const modal = document.getElementById('mitigasiModal');
    const content = document.getElementById('mitigasiModalContent');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
}

function closeMitigasi() {
    const modal = document.getElementById('mitigasiModal');
    const content = document.getElementById('mitigasiModalContent');
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function openMitigasiForCurrentSite() { if(currentSiteId) openMitigasi(currentSiteId); }

function openDummySite(id) {
    const data = getFootprint(id);
    if(!data) return;
    currentSiteId = id;

    document.getElementById('dummyUrlDisplay').innerText = data.url;
    const container = document.getElementById('dummySiteContent');
    
    if(data.type === 'social') container.innerHTML = templateFakeBook(targetData);
    else if(data.type === 'instasnap') container.innerHTML = templateInstaSnap(targetData);
    else if(data.type === 'chirp') container.innerHTML = templateChirp(targetData);
    else if(data.type === 'vidtok') container.innerHTML = templateVidTok(targetData);
    else if(data.type === 'vidtube') container.innerHTML = templateVidTube(targetData);
    else if(data.type === 'forum') container.innerHTML = templateForum(targetData);
    else if(data.type === 'review') container.innerHTML = templateReview(targetData);
    else if(data.type === 'breach') container.innerHTML = templateBreach(targetData);
    else if(data.type === 'job') container.innerHTML = templateJob(targetData);
    else if(data.type === 'fitness') container.innerHTML = templateFitness(targetData);

    showView('dummyWeb');
}

// Helper for consistent Avatar generation
function generateAvatarHTML(t, sizeClass, textClass) {
    return `
    <div class="relative ${sizeClass} rounded-full overflow-hidden bg-slate-300 flex items-center justify-center text-slate-500 font-bold ${textClass} shrink-0 shadow">
        <span class="absolute z-0">${t.initials}</span>
        <img src="${t.avatarUrl}" class="absolute inset-0 w-full h-full object-cover z-10" onerror="this.style.display='none'" alt="Avatar">
    </div>`;
}

// Helper untuk mengambil subset acak dari array
function getRandomSubset(arr, n) {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

function templateFakeBook(t) {
    const avatarMain = generateAvatarHTML(t, 'w-32 h-32 md:w-40 md:h-40 border-4 border-white', 'text-4xl');
    const avatarSmall = generateAvatarHTML(t, 'w-10 h-10', 'text-sm');

    const randomTexts = [
        "Makan siang bareng tim hari ini seru banget. Thanks all! 🍕",
        "Ada yang tau tempat service AC yang murah dan terpercaya daerah sini? Cuaca panas banget 🥵",
        "Akhirnya kesampaian juga beli buku ini setelah sekian lama hunting. 📚 Waktunya me time!",
        "Nostalgia dengerin lagu-lagu tahun 2000an emang ga ada matinya. Playlist andalan nemenin macet.",
        "Selamat ulang tahun buat diriku sendiri! 🎉 Semoga tahun ini lebih baik dari sebelumnya.",
        "Review film yang baru rilis kemaren: 8/10! Wajib nonton sih buat yang suka genre sci-fi 👽",
        "Weekend pada kemana nih? Butuh rekomendasi tempat nongkrong yang asik dong."
    ];

    const selectedRandoms = getRandomSubset(randomTexts, 3).map(text => `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div class="flex items-center gap-2 mb-3">
                ${avatarSmall}
                <div><h3 class="font-semibold text-sm">${t.name}</h3><p class="text-[11px] text-slate-500">${Math.floor(Math.random() * 23) + 1} hrs ago · 🌎 Public</p></div>
            </div>
            <p class="text-sm text-slate-800">${text}</p>
        </div>
    `);

    const riskyPosts = [
        `<div class="bg-white p-4 rounded-lg shadow-sm border border-red-300 relative">
            <div class="absolute -right-2 -top-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse z-20">SECURITY RISK</div>
            <div class="flex items-center gap-2 mb-3">
                ${avatarSmall}
                <div><h3 class="font-semibold text-sm">${t.name}</h3><p class="text-[11px] text-slate-500">2 hrs ago · 🌎 Public</p></div>
            </div>
            <p class="text-sm text-slate-800">Akhirnya liburan keluarga ke Bali selama seminggu penuh! 🌴 Asyik rumah kosong, bebas dari hiruk pikuk Jakarta sebentar. See you next week!</p>
            <img src="https://picsum.photos/seed/${t.username}_bali/600/300" class="w-full mt-3 rounded-lg object-cover h-48">
            <div class="mt-3 bg-red-50 text-red-700 text-xs p-2 rounded border border-red-200 font-mono">OSINT NOTE: Mengumumkan rumah kosong secara publik mengundang risiko pencurian.</div>
        </div>`,
        `<div class="bg-white p-4 rounded-lg shadow-sm border border-red-300 relative">
            <div class="absolute -right-2 -top-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse z-20">CAREER RISK</div>
            <div class="flex items-center gap-2 mb-3">
                ${avatarSmall}
                <div><h3 class="font-semibold text-sm">${t.name}</h3><p class="text-[11px] text-slate-500">Yesterday · 🌎 Public</p></div>
            </div>
            <p class="text-sm text-slate-800">Kerjaan numpuk parah gara-gara Manager baru si Pak Anton ngga becus atur timeline. Pengen resign aja rasanya dari kantor. Toxic banget culturenya sekarang! 😡</p>
        </div>`
    ];

    const allPosts = shuffleArray([...selectedRandoms, ...riskyPosts]);

    return `
    <div class="bg-[#f0f2f5] min-h-screen text-[#1c1e21] font-sans pb-10">
        <div class="bg-white shadow-sm h-14 flex items-center px-4 justify-between sticky top-0 z-40">
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">f</div>
                <input type="text" placeholder="Search FakeBook" class="bg-slate-100 rounded-full px-4 py-2 text-sm border-none outline-none hidden sm:block">
            </div>
        </div>
        <div class="bg-white shadow relative z-10">
            <div class="max-w-4xl mx-auto">
                <div class="h-48 md:h-80 bg-gradient-to-r from-blue-300 to-slate-400 rounded-b-lg w-full relative overflow-hidden">
                    <img src="https://picsum.photos/seed/${t.username}_cover/1200/400" class="w-full h-full object-cover opacity-80 mix-blend-overlay">
                    <div class="absolute -bottom-16 left-8">${avatarMain}</div>
                </div>
                <div class="pt-20 pb-4 px-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">${t.name}</h1>
                        <p class="text-slate-500 font-semibold mt-1">@${t.username} • 428 Friends</p>
                    </div>
                    <div class="flex gap-2">
                        <button class="bg-slate-200 text-black font-semibold px-4 py-2 rounded-md text-sm">Message</button>
                        <button class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm">Add Friend</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="max-w-4xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
            <div class="md:col-span-1 space-y-4">
                <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <h2 class="font-bold text-xl mb-4">Intro</h2>
                    <ul class="text-sm text-slate-700 space-y-3">
                        <li class="flex gap-2 items-center">🎈 Born in <strong>1994</strong></li>
                        <li class="flex gap-2 items-center">🏠 Lives in <strong>Jakarta, Indonesia</strong></li>
                        <li class="flex gap-2 items-center">💼 Works at <strong>PT Teknologi Global</strong></li>
                        <li class="flex gap-2 items-center">🎓 Studied at <strong>Universitas Nasional</strong></li>
                    </ul>
                </div>
            </div>
            <div class="md:col-span-2 space-y-4">
                ${allPosts.join('')}
            </div>
        </div>
    </div>`;
}

function templateInstaSnap(t) {
    const avatar = generateAvatarHTML(t, 'w-20 h-20 md:w-28 md:h-28 border-2 border-pink-500 p-1', 'text-2xl');
    
    const randomCaptions = ["Weekend vibes ✨", "Food coma 🍔", "Nature walks 🍃", "OOTD 👕", "Coffee first ☕", "City lights 🌃", "Throwback 🔙", "Chill day 🛋️", "New hair! 💇", "Sunny day ☀️"];
    
    let gridItems = [];
    
    // Generate 6 random images
    for(let i=0; i<6; i++) {
        let caption = randomCaptions[Math.floor(Math.random() * randomCaptions.length)];
        gridItems.push(`
            <div class="aspect-square relative group bg-slate-200 overflow-hidden cursor-pointer">
                <img src="https://picsum.photos/seed/${t.username}_rand${i}/400" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-3 text-center z-20">
                    <p class="text-[10px] md:text-sm font-semibold">"${caption}"</p>
                    <div class="flex gap-3 mt-2 text-xs font-bold"><span>❤️ ${Math.floor(Math.random()*300)+20}</span><span>💬 ${Math.floor(Math.random()*30)}</span></div>
                </div>
            </div>
        `);
    }
    
    // The 3 Risky Images
    const riskyItems = [
        `<div class="aspect-square relative group bg-slate-200 overflow-hidden cursor-pointer ring-2 ring-red-500">
            <img src="https://picsum.photos/seed/${t.username}1/400" class="w-full h-full object-cover">
            <div class="absolute top-2 right-2 bg-red-600 w-3 h-3 rounded-full animate-ping z-10"></div>
            <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-3 text-center z-20">
                <div class="bg-blue-600 text-xs px-2 py-1 rounded mb-2 flex items-center gap-1 font-bold">📍 Komplek Perumahan Indah</div>
                <p class="text-[10px] md:text-sm">"Nyantai sore di teras rumah tercinta. #HomeSweetHome"</p>
            </div>
        </div>`,
        `<div class="aspect-square relative group bg-slate-200 overflow-hidden cursor-pointer ring-2 ring-red-500">
            <img src="https://picsum.photos/seed/${t.username}2/400" class="w-full h-full object-cover">
            <div class="absolute top-2 right-2 bg-red-600 w-3 h-3 rounded-full animate-ping z-10"></div>
            <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-3 text-center z-20">
                <div class="bg-blue-600 text-xs px-2 py-1 rounded mb-2 flex items-center gap-1 font-bold">📍 SD Negeri 01 Pagi</div>
                <p class="text-[10px] md:text-sm">"Nungguin si kecil bubaran sekolah tiap jam 12. Ibu-ibu kumpul!"</p>
            </div>
        </div>`,
        `<div class="aspect-square relative group bg-slate-200 overflow-hidden cursor-pointer ring-2 ring-red-500">
            <img src="https://picsum.photos/seed/${t.username}3/400" class="w-full h-full object-cover">
            <div class="absolute top-2 right-2 bg-red-600 w-3 h-3 rounded-full animate-ping z-10"></div>
            <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-3 text-center z-20">
                <div class="bg-blue-600 text-xs px-2 py-1 rounded mb-2 flex items-center gap-1 font-bold">📍 Kopi Kenangan, Sudirman</div>
                <p class="text-[10px] md:text-sm">"Spot favorit ngerjain laporan tiap jumat sore."</p>
            </div>
        </div>`
    ];
    
    gridItems.push(...riskyItems);
    gridItems = shuffleArray(gridItems);

    return `
    <div class="bg-white min-h-screen text-slate-900 font-sans pb-10">
        <div class="bg-white border-b flex justify-between px-4 py-3 sticky top-0 z-40 items-center shadow-sm">
            <div class="font-bold text-xl italic bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">InstaSnap</div>
        </div>
        
        <div class="max-w-4xl mx-auto pt-8 px-4 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center border-b border-slate-200 pb-8">
            ${avatar}
            <div class="flex-grow">
                <div class="flex items-center gap-4 mb-4">
                    <h2 class="text-2xl">${t.username}</h2>
                    <button class="bg-slate-200 font-semibold px-4 py-1.5 rounded text-sm">Follow</button>
                </div>
                <div class="flex gap-6 mb-4 text-sm">
                    <span><span class="font-bold">142</span> posts</span>
                    <span><span class="font-bold">1,204</span> followers</span>
                </div>
                <div class="text-sm space-y-1">
                    <div class="font-bold">${t.name}</div>
                    <div>Coffee enthusiast ☕ | Explorer 🌍</div>
                    <div class="text-blue-600">www.linktree.com/${t.username}</div>
                </div>
            </div>
        </div>
        
        <div class="max-w-4xl mx-auto text-center py-3 bg-red-50 border border-red-200 my-4 rounded-lg mx-4 text-red-700 font-mono text-xs shadow-sm">
            OSINT WARNING: HOVER/TAP GAMBAR BERBINGKAI MERAH UNTUK MELIHAT TAG LOKASI TERSEMBUNYI
        </div>

        <div class="max-w-4xl mx-auto grid grid-cols-3 gap-1 md:gap-4 px-1 md:px-4">
            ${gridItems.join('')}
        </div>
    </div>`;
}

function templateChirp(t) {
    const avatar = generateAvatarHTML(t, 'w-12 h-12', 'text-sm');
    
    const randomTweets = [
        `Just had the best coffee at Senopati! ☕✨`,
        `Why is the weather so unpredictable lately? 🌧️☀️ Tiba-tiba ujan deres.`,
        `Can't wait for the weekend! Got so many movies to catch up on. 🍿`,
        `Late night coding session... bugs everywhere 🐛💻`,
        `Just finished a 5km run! Feeling fresh. 🏃‍♂️💨`,
        `That new episode was MIND BLOWING. No spoilers please! 🤯📺`,
        `Ada yang punya rekomendasi bengkel mobil yang oke daerah Selatan? 🚗`
    ];
    
    const selectedRandoms = getRandomSubset(randomTweets, 4).map(text => `
        <div class="p-4 flex gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100">
            ${avatar}
            <div class="flex-1">
                <div class="flex gap-1 items-center">
                    <span class="font-bold">${t.name}</span>
                    <span class="text-slate-500 text-sm">@${t.username} • ${Math.floor(Math.random() * 12) + 1}h</span>
                </div>
                <p class="mt-1 text-slate-800">${text}</p>
                <div class="mt-3 flex gap-6 text-slate-500 text-sm font-semibold">
                    <span class="hover:text-blue-500 cursor-pointer">💬 ${Math.floor(Math.random() * 15)}</span>
                    <span class="hover:text-green-500 cursor-pointer">🔁 ${Math.floor(Math.random() * 5)}</span>
                    <span class="hover:text-red-500 cursor-pointer">❤️ ${Math.floor(Math.random() * 80) + 5}</span>
                </div>
            </div>
        </div>
    `);

    const riskyTweets = [
        `<div class="p-4 flex gap-3 relative bg-red-50 hover:bg-red-100/50 transition-colors border-b border-red-100">
            <div class="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse">DATA LEAK</div>
            ${avatar}
            <div class="flex-1">
                <div class="flex gap-1 items-center">
                    <span class="font-bold">${t.name}</span>
                    <span class="text-slate-500 text-sm">@${t.username} • 3h</span>
                </div>
                <p class="mt-1 text-slate-800">Bismillah ikutan giveaway saldo e-wallet akhir bulan dari kak @InfluencerKaya! Semoga rejeki nyangkut🙏✨<br><br>Dana / GoPay: <strong>0812-9988-7766</strong> (Atas nama ${t.firstName})</p>
                <div class="mt-3 bg-white text-red-600 text-xs p-2 rounded border border-red-200 font-mono shadow-sm">OSINT NOTE: Penipu menggunakan nomor publik ini untuk OTP palsu / spam WhatsApp.</div>
            </div>
        </div>`,
        `<div class="p-4 flex gap-3 relative hover:bg-orange-50 transition-colors border-b border-orange-100">
            <div class="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">LOCATION LEAK</div>
            ${avatar}
            <div class="flex-1">
                <div class="flex gap-1 items-center">
                    <span class="font-bold">${t.name}</span>
                    <span class="text-slate-500 text-sm">@${t.username} • 5h</span>
                </div>
                <p class="mt-1 text-slate-800">Gila macet banget daerah Sudirman arah Blok M sore ini. Udah 1 jam stuck di depan halte Gelora Bung Karno. Panas pula! 😤🚗</p>
            </div>
        </div>`
    ];

    const allTweets = shuffleArray([...selectedRandoms, ...riskyTweets]);

    return `
    <div class="bg-slate-100 min-h-screen text-slate-900 font-sans pb-10">
        <div class="max-w-2xl mx-auto border-x border-slate-200 min-h-screen bg-white shadow-sm">
            <div class="sticky top-0 bg-white/90 backdrop-blur px-4 py-3 border-b border-slate-200 z-10 flex justify-between items-center">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></svg>
                    Chirp
                </h1>
            </div>
            <div class="h-32 bg-blue-100 overflow-hidden relative">
                <img src="https://picsum.photos/seed/${t.username}_header/800/200" class="w-full h-full object-cover mix-blend-multiply opacity-50">
            </div>
            <div class="px-4 pb-4 border-b border-slate-200 relative">
                <div class="absolute -top-10 border-4 border-white rounded-full bg-white">${avatar}</div>
                <div class="flex justify-end pt-3">
                    <button class="border border-slate-300 rounded-full px-4 py-1.5 font-bold text-sm bg-slate-900 text-white">Follow</button>
                </div>
                <div class="mt-2">
                    <h2 class="text-xl font-bold">${t.name}</h2>
                    <p class="text-slate-500 text-sm">@${t.username}</p>
                    <p class="mt-2 text-sm text-slate-800">Just living life. ☕💻 Love photography and good food.</p>
                    <div class="flex gap-4 mt-2 text-sm text-slate-500">
                        <span><strong class="text-slate-900">245</strong> Following</span>
                        <span><strong class="text-slate-900">1,024</strong> Followers</span>
                    </div>
                </div>
            </div>
            <div class="flex flex-col">
                ${allTweets.join('')}
            </div>
        </div>
    </div>`;
}

function templateVidTok(t) {
    const avatar = generateAvatarHTML(t, 'w-10 h-10 border border-white', 'text-xs');
    return `
    <div class="bg-slate-900 min-h-screen text-white font-sans flex justify-center items-center py-4">
        <div class="w-full max-w-[400px] h-[800px] bg-black relative overflow-hidden md:rounded-2xl shadow-2xl ring-1 ring-slate-800">
            <img src="https://picsum.photos/seed/${t.username}_tok/400/800" class="absolute inset-0 w-full h-full object-cover opacity-60">
            <div class="absolute inset-0 pointer-events-none z-10">
                <div class="absolute top-[35%] left-[45%] w-16 h-20 border-2 border-red-500 animate-pulse bg-red-500/20"></div>
                <div class="absolute top-[30%] left-[45%] bg-red-600 text-[10px] font-mono px-1 rounded whitespace-nowrap shadow-md">ID CARD EXPOSED</div>
                <div class="absolute bottom-[25%] right-[10%] w-24 h-16 border-2 border-red-500 animate-pulse bg-red-500/20"></div>
                <div class="absolute bottom-[21%] right-[10%] bg-red-600 text-[10px] font-mono px-1 rounded whitespace-nowrap shadow-md">SHIPPING LABEL</div>
            </div>
            <div class="absolute top-4 w-full flex justify-center gap-4 text-lg font-bold text-slate-300 drop-shadow-md z-20">
                <span>Following</span><span class="text-white border-b-2 border-white pb-1">For You</span>
            </div>
            <div class="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent pt-20 z-20">
                <h3 class="font-bold text-lg mb-1">@${t.username}</h3>
                <p class="text-sm w-[80%] mb-2">Joget dikit sebelum siap-siap berangkat ngantor! Have a nice day y'all! 🕺✨ #fyp #morningroutine</p>
                <div class="flex items-center gap-2 text-xs font-semibold bg-slate-800/80 w-max px-3 py-1 rounded-full">🎵 Original Sound - ${t.username}</div>
            </div>
            <div class="absolute bottom-20 right-4 flex flex-col items-center gap-5 z-20">
                ${avatar}
                <div class="flex flex-col items-center gap-1"><div class="w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center text-lg">❤️</div><span class="text-xs">12.4K</span></div>
                <div class="flex flex-col items-center gap-1"><div class="w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center text-lg">💬</div><span class="text-xs">128</span></div>
                <div class="flex flex-col items-center gap-1"><div class="w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center text-lg">↗️</div><span class="text-xs">Share</span></div>
            </div>
        </div>
    </div>`;
}

function templateVidTube(t) {
    const avatar = generateAvatarHTML(t, 'w-10 h-10', 'text-sm');
    return `
    <div class="bg-white min-h-screen text-slate-900 font-sans">
        <div class="flex items-center px-4 py-3 border-b border-slate-200 sticky top-0 bg-white z-20 shadow-sm">
            <div class="font-bold text-xl flex items-center gap-1"><div class="bg-red-600 text-white px-2 py-0.5 rounded text-sm">▶</div> VidTube</div>
        </div>
        
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-4">
            <div class="flex-grow">
                <div class="aspect-video bg-black relative rounded-xl overflow-hidden shadow-md">
                    <img src="https://picsum.photos/seed/${t.username}_tube/800/450" class="w-full h-full object-cover opacity-60">
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div class="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg"><div class="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-2"></div></div>
                    </div>
                    <div class="absolute bottom-10 left-10 w-32 h-12 border-2 border-red-500 animate-pulse bg-red-500/30 z-10"></div>
                    <div class="absolute bottom-5 left-10 bg-red-600 text-white text-xs font-mono px-2 py-1 rounded shadow-lg z-10 tracking-widest">LICENSE PLATE: B 1234 XYZ</div>
                    <div class="absolute bottom-0 w-full h-1.5 bg-slate-700"><div class="w-1/3 h-full bg-red-600 relative"><div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full"></div></div></div>
                </div>
                <h1 class="text-xl font-bold mt-4">A DAY IN MY LIFE (Kerja + Nongkrong) 📸 🚗</h1>
                <div class="flex items-center justify-between mt-3 flex-wrap gap-4">
                    <div class="flex items-center gap-3">
                        ${avatar}
                        <div><h3 class="font-bold text-sm">${t.name} Channel</h3><p class="text-xs text-slate-500">1.2K subscribers</p></div>
                        <button class="bg-slate-900 text-white font-bold text-sm px-4 py-2 rounded-full ml-2">Subscribe</button>
                    </div>
                </div>
                <div class="mt-4 bg-slate-100 p-4 rounded-xl text-sm border border-slate-200">
                    <p class="font-bold mb-1">15K views • 2 weeks ago</p>
                    <p>Ikutin keseruan rutinitas aku hari ini! Dari berangkat kerja nyetir sendiri menembus macet Jakarta, sampai nongkrong sore di cafe. Jangan lupa like & subscribe ya!</p>
                    <div class="mt-4 bg-red-50 border border-red-200 p-3 rounded text-red-700 font-mono text-xs shadow-sm">
                        OSINT WARNING: Memposting video perjalanan harian tanpa menyensor plat nomor kendaraan memungkinkan stalker/peretas mencari detail identitas pemilik kendaraan via layanan publik.
                    </div>
                </div>
            </div>
            <div class="w-full lg:w-80 flex flex-col gap-3 shrink-0">
                <h3 class="font-bold text-lg mb-2">Up next</h3>
                ${[1,2,3].map(i => `
                <div class="flex gap-2 cursor-pointer group">
                    <div class="w-40 aspect-video bg-slate-200 rounded-lg overflow-hidden shrink-0 relative"><img src="https://picsum.photos/seed/${t.username}_rec${i}/200/110" class="w-full h-full object-cover group-hover:scale-105 transition-transform"><div class="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">10:05</div></div>
                    <div>
                        <h4 class="text-sm font-bold line-clamp-2 leading-tight group-hover:text-blue-600">Random Video Recommendation ${i}</h4>
                        <p class="text-xs text-slate-500 mt-1">Creator Name</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </div>`;
}

function templateForum(t) {
    const avatar = generateAvatarHTML(t, 'w-16 h-16 border border-slate-300', 'text-xl');
    return `
    <div class="bg-[#f0f2f5] min-h-screen font-serif text-sm">
        <div class="bg-[#003366] text-white p-4 shadow">
            <div class="max-w-5xl mx-auto flex justify-between items-end">
                <h1 class="text-2xl font-bold tracking-wider">IndoSejarahForum</h1>
                <div class="text-xs">Welcome, Guest</div>
            </div>
        </div>
        <div class="max-w-5xl mx-auto mt-6 px-2">
            <div class="bg-white border border-slate-300 mb-4 rounded shadow-sm overflow-hidden relative">
                 <div class="absolute top-0 right-0 border-l border-b border-red-300 bg-red-50 text-red-600 px-3 py-1 font-mono text-xs font-bold z-10">JEJAK DITEMUKAN</div>
                <div class="bg-slate-100 border-b border-slate-200 p-2 text-xs text-slate-600 font-sans flex justify-between">
                    <span>Posted: 15 August 2021, 14:32 WIB</span><span>#12</span>
                </div>
                <div class="flex flex-col md:flex-row">
                    <div class="bg-slate-50 w-full md:w-48 p-4 border-r border-slate-200 flex flex-col items-center">
                        <div class="font-bold text-blue-800 text-center mb-2">${t.name}</div>
                        ${avatar}
                        <div class="text-[10px] text-slate-500 mt-3 text-center w-full space-y-1">
                            <div>Username: ${t.username}</div>
                            <div>Joined: Jan 2021</div>
                        </div>
                    </div>
                    <div class="p-6 flex-grow font-sans text-slate-800 leading-relaxed text-base">
                        <p class="mb-4">Jujur saja, kebijakan perusahaan dan instansi saat ini sangat mengecewakan. Saya yang bekerja di dalamnya merasa tidak ada transparansi sama sekali.</p>
                        <p class="mb-4">Menurut saya pimpinan harus diganti. Ini murni opini saya, ${t.firstName}, sebagai warga yang mengamati sistem kita dari dalam.</p>
                        <hr class="my-6 border-slate-200">
                        <p class="text-xs text-red-700 font-mono bg-red-50 p-3 rounded border border-red-200">OSINT NOTE: Opini sensitif diposting menggunakan nama asli. Jejak forum seperti ini sering digali saat proses Background Check kandidat pekerja.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function templateReview(t) {
    const avatar = generateAvatarHTML(t, 'w-24 h-24 mx-auto mb-3 shadow', 'text-3xl');
    return `
    <div class="bg-slate-50 min-h-screen font-sans text-slate-900">
        <div class="bg-red-600 h-16 shadow-md flex items-center px-6 sticky top-0 z-10">
            <h1 class="text-white text-2xl font-black italic">ZomaYelp</h1>
        </div>
        <div class="max-w-4xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
            <div class="w-full md:w-64 shrink-0 relative text-center border-r border-slate-200 md:pr-4">
                ${avatar}
                <h2 class="font-bold text-xl">${t.name}</h2>
                <p class="text-sm text-slate-500">@${t.username}</p>
                <div class="mt-4 text-xs text-slate-500 space-y-1">
                    <div>15 Reviews</div><div>8 Photos</div>
                </div>
            </div>
            <div class="flex-grow space-y-4">
                <h3 class="font-bold text-lg border-b border-slate-200 pb-2">Recent Reviews</h3>
                <div class="border border-red-200 rounded-xl p-5 shadow-sm bg-white relative">
                    <div class="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded font-mono animate-pulse">ROUTINE LEAK</div>
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded flex-shrink-0 flex items-center justify-center text-xl">🏥</div>
                        <div><h4 class="font-bold text-slate-800">Klinik Gigi Dr. Sehat</h4><p class="text-xs text-slate-500">Kesehatan • Jakarta</p></div>
                    </div>
                    <p class="text-sm">Pelayanan luar biasa! Saya selalu kesini jadwal kontrol rutin setiap tanggal 15 jam 10 pagi. Dokternya sangat tepat waktu.</p>
                </div>
                <div class="border border-red-200 rounded-xl p-5 shadow-sm bg-white relative">
                    <div class="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded font-mono animate-pulse">ROUTINE LEAK</div>
                    <div class="flex items-start gap-3 mb-3">
                        <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded flex-shrink-0 flex items-center justify-center text-xl">💪</div>
                        <div><h4 class="font-bold text-slate-800">FitLife Studio</h4><p class="text-xs text-slate-500">Gym • Jakarta</p></div>
                    </div>
                    <p class="text-sm">Kelas yoga hari Rabu malam jam 19:00 selalu jadi favorit saya. Instrukturnya asik banget buat melepas penat abis ngantor.</p>
                </div>
            </div>
        </div>
    </div>`;
}

function templateBreach(t) {
    return `
    <div class="bg-slate-100 min-h-screen font-sans text-slate-900 p-4 md:p-8 flex items-center justify-center">
        <div class="max-w-2xl w-full mx-auto bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden">
            <div class="bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center">
                <h1 class="text-lg font-bold text-white flex items-center gap-2"><svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Pwned Checker v2.4</h1>
                <span class="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded font-mono">${t.email}</span>
            </div>
            <div class="p-8">
                <div class="bg-red-50 border border-red-200 p-6 rounded-lg mb-6 text-center shadow-sm">
                    <h2 class="text-2xl font-black text-red-700 mb-2 uppercase tracking-wide">OH NO — PWNED!</h2>
                    <p class="text-slate-700 text-sm">Target email <strong>${t.email}</strong> was found in <span class="bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">1</span> data breach.</p>
                </div>
                <div class="border border-slate-200 rounded-lg p-5">
                    <h4 class="text-base font-bold text-slate-800 mb-1 border-b pb-2">TokoBelanjaID Leak (July 2023)</h4>
                    <p class="text-sm text-slate-600 mt-3 mb-2 font-semibold">Compromised Data:</p>
                    <ul class="list-disc list-inside text-slate-700 text-sm space-y-1 ml-2 font-mono bg-slate-50 p-3 rounded border border-slate-100">
                        <li>Email addresses (${t.email})</li>
                        <li>Passwords (MD5 hashed)</li>
                        <li>Full Names (${t.name})</li>
                        <li>Phone numbers</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`;
}

function templateJob(t) {
    return `
    <div class="bg-slate-100 min-h-screen font-sans pb-12">
        <div class="bg-blue-700 text-white h-16 flex items-center px-4 md:px-8 shadow">
            <h1 class="text-xl font-bold">KarirPro Portal</h1>
        </div>
        <div class="max-w-3xl mx-auto mt-8 bg-white shadow-md rounded-xl border border-slate-200 overflow-hidden relative mx-4 md:mx-auto">
            <div class="absolute top-4 right-4 bg-red-100 text-red-700 border border-red-300 px-3 py-1 text-xs font-bold font-mono rounded shadow-sm">PUBLICLY VISIBLE PDF</div>
            <div class="p-8 text-center border-b-4 border-blue-700">
                <h2 class="text-3xl font-bold text-slate-800 mb-2 mt-8 md:mt-0">${t.name}</h2>
                <p class="text-slate-500 mb-6">Software Engineer | Open to Work</p>
                <div class="bg-yellow-50 border border-yellow-200 p-5 rounded-lg text-left inline-block w-full max-w-md shadow-sm relative mx-auto">
                    <div class="absolute -left-3 -top-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow">!</div>
                    <h3 class="text-xs font-bold text-slate-600 uppercase mb-3 border-b border-yellow-200 pb-2">Contact Information (Exposed via CV)</h3>
                    <ul class="text-sm text-slate-800 space-y-3 font-mono">
                        <li class="flex gap-2 items-start"><span class="shrink-0">📧</span> ${t.email}</li>
                        <li class="flex gap-2 items-start"><span class="shrink-0">📱</span> +62 812-9988-XXXX (Nomor Aktif)</li>
                        <li class="flex gap-2 items-start"><span class="shrink-0">🏠</span> Jl. Sudirman Blok B No.15, RT03/RW02, Jakarta (Alamat Lengkap)</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`;
}

function templateFitness(t) {
    const avatar = generateAvatarHTML(t, 'w-8 h-8', 'text-xs');
    return `
    <div class="bg-slate-100 min-h-screen font-sans">
        <div class="bg-white border-b border-slate-200 shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 class="text-orange-600 font-black text-xl tracking-tighter italic">RUNTRACKR</h1>
            <div class="text-sm text-slate-500 flex items-center gap-2">${avatar}</div>
        </div>
        <div class="max-w-2xl mx-auto mt-6 bg-white p-6 shadow-sm border border-slate-200 rounded-xl relative mx-2 md:mx-auto">
            <div class="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse z-20">HOME ADDRESS EXPOSED</div>
            <div class="mb-4">
                <h2 class="font-bold text-xl text-slate-800">Morning Run</h2>
                <p class="text-sm text-slate-500 mt-1">Today, 06:00 AM • <span class="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono border border-slate-200">🌎 Public Activity</span></p>
            </div>
            
            <div class="w-full h-48 md:h-56 bg-emerald-50 border border-slate-200 rounded-lg relative overflow-hidden mb-5">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAyMEw0MCAyME0yMCAwTDIwIDQwIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-70"></div>
                <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 30,70 Q 40,30 70,30 Q 80,60 30,70" fill="none" stroke="#ea580c" stroke-width="3" stroke-dasharray="6" />
                </svg>
                <div class="w-4 h-4 bg-emerald-500 border-2 border-white rounded-full absolute bottom-1/4 left-1/4 z-10 shadow-md"></div>
                <div class="w-4 h-4 bg-slate-900 border-2 border-white rounded-full absolute bottom-[22%] left-[28%] z-10 shadow-md"></div>
                
                <div class="absolute top-2 left-2 right-2 md:right-auto bg-white/95 p-2.5 rounded-lg text-xs text-red-700 font-semibold border border-red-200 shadow-sm">
                    📍 Titik Start & Finish identik (Diduga Kuat: Rumah Target)
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-5">
                <div><div class="text-xs text-slate-500 uppercase tracking-wide font-medium">Distance</div><div class="text-lg md:text-xl font-bold text-slate-800">5.2 km</div></div>
                <div><div class="text-xs text-slate-500 uppercase tracking-wide font-medium">Pace</div><div class="text-lg md:text-xl font-bold text-slate-800">6:30 /km</div></div>
                <div><div class="text-xs text-slate-500 uppercase tracking-wide font-medium">Time</div><div class="text-lg md:text-xl font-bold text-slate-800">33m 48s</div></div>
            </div>
        </div>

        <div class="max-w-2xl mx-auto mt-6 space-y-3 px-2 md:px-0">
            <h3 class="text-sm font-bold text-slate-600 uppercase ml-1 mb-2">Recent Activities</h3>
            <div class="bg-white p-4 shadow-sm border border-slate-200 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 text-xl shrink-0">🚲</div>
                    <div>
                        <h4 class="font-bold text-slate-800">Evening Cycling</h4>
                        <p class="text-xs text-slate-500">Yesterday, 17:30 PM • 15.0 km</p>
                    </div>
                </div>
            </div>
            <div class="bg-white p-4 shadow-sm border border-red-200 rounded-xl flex items-center justify-between bg-red-50/30">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 text-xl shrink-0">🏃</div>
                    <div>
                        <h4 class="font-bold text-slate-800">Sunday Long Run</h4>
                        <p class="text-xs text-slate-500">Sunday, 05:30 AM • 10.2 km</p>
                        <p class="text-xs text-red-600 font-medium mt-1">Start: Sama dengan lokasi rutinitas harian</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}