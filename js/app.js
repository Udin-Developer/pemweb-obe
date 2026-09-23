import { ringkasKarya, cariBerdasarkanId } from './utils.js';

// Memperluas katalog data untuk mengakomodasi pengujian pencarian dan fitur limit
const katalogMusik = [
    { id: 'K001', judul: 'Suar', musisi: 'Moeremans', genre: 'Alternative Rock', lokasi: 'Tarakan', durasi: 5.50, file: '/audio/K001.mp3' },
    { id: 'K002', judul: 'Vas Bunga', musisi: 'Lomba Sihir', genre: 'Alternative Pop', lokasi: 'Jakarta', durasi: 3.22, file: '/audio/K002.mp3' },
    { id: 'K003', judul: 'Penghujung Cerita', musisi: 'Murphy Radio', genre: 'Midwest Emo', lokasi: 'Balikpapan', durasi: 4.45, file: '/audio/K003.mp3' },
    { id: 'K004', judul: 'Ibukota', musisi: 'Traffic Jam', genre: 'Indie Pop', lokasi: 'Bandung', durasi: 3.45, file: '/audio/K004.mp3' },
    { id: 'K005', judul: 'Masa Remaja', musisi: 'Perunggu', genre: 'Alternative Rock', lokasi: 'Jakarta', durasi: 4.20, file: '/audio/K005.mp3' },
    { id: 'K006', judul: 'Satu Bulan', musisi: 'Bernadya', genre: 'Pop', lokasi: 'Jakarta', durasi: 4.10, file: '/audio/K006.mp3' }
];

// Pemilihan elemen DOM
const container = document.querySelector('#katalog-karya-container');
const searchInput = document.querySelector('#search');
const limitSelect = document.querySelector('#limit');
const detailPanel = document.querySelector('#detail-panel');

// Fungsi rendering DOM yang aman menggunakan createElement dan textContent
function renderItems(items) {
    container.replaceChildren(); // Membersihkan container setiap kali fungsi dijalankan

    if (items.length === 0) {
        const pesanKosong = document.createElement('p');
        pesanKosong.textContent = 'Karya atau musisi tidak ditemukan.';
        container.append(pesanKosong);
        return;
    }

    for (const item of items) {
        const article = document.createElement('article');
        article.className = 'card';

        const title = document.createElement('h3');
        title.textContent = item.judul;

        const artist = document.createElement('p');
        artist.textContent = item.musisi;

        const duration = document.createElement('p');
        duration.textContent = `${item.durasi} menit`;

        const audio = document.createElement('audio');
        audio.controls = true;
        const source = document.createElement('source');
        source.src = item.file;
        source.type = 'audio/mpeg';
        audio.append(source);
        audio.append(document.createTextNode('Browser Anda tidak mendukung pemutaran audio.'));

        // Latihan 2: Tombol detail untuk event delegation
        const btnDetail = document.createElement('button');
        btnDetail.type = 'button';
        btnDetail.textContent = 'Lihat Info Detail';
        btnDetail.dataset.detail = item.id;
        btnDetail.style.marginTop = '15px'; // Penyesuaian jarak 

        article.append(title, artist, duration, audio, btnDetail);
        container.append(article);
    }
}

// Fungsi memunculkan panel detail
function tampilkanDetail(id) {
    const item = cariBerdasarkanId(katalogMusik, id);
    if (!item) return;

    detailPanel.style.display = 'block';
    detailPanel.replaceChildren(); 
    
    const infoText = document.createElement('p');
    infoText.style.fontWeight = 'bold';
    infoText.textContent = `Info Lengkap: "${item.judul}" adalah track bergenre ${item.genre} yang dibawakan oleh ${item.musisi} dari ${item.lokasi}.`;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Tutup Detail';
    closeBtn.style.marginTop = '10px';
    closeBtn.style.padding = '5px 10px';
    closeBtn.addEventListener('click', () => { detailPanel.style.display = 'none'; });

    detailPanel.append(infoText, closeBtn);
}

// Fungsi master untuk membaca semua status (search & limit) dan merender
function updateView() {
    const keyword = searchInput.value.toLowerCase();
    const limit = Number(limitSelect.value);

    const hasilFilter = katalogMusik.filter(item => 
        item.judul.toLowerCase().includes(keyword) || 
        item.musisi.toLowerCase().includes(keyword)
    );

    renderItems(hasilFilter.slice(0, limit));
}


searchInput.addEventListener('input', () => {
    updateView();
});


container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-detail]');
    if (!button) return; 

    const idKarya = button.dataset.detail;
    tampilkanDetail(idKarya);
});


// Mengambil nilai dari local storage jika ada, default ke '5' jika kosong
const savedLimit = localStorage.getItem('skena_limit') ?? '5';
limitSelect.value = savedLimit;

limitSelect.addEventListener('change', () => {
    // Menyimpan preferensi non-sensitif ke localStorage
    localStorage.setItem('skena_limit', limitSelect.value);
    updateView();
});

// Eksekusi render pertama kali saat halaman dimuat
updateView();

// Blok try-catch Modul 4 tetap dipertahankan di konsol
try {
    const statistik = ringkasKarya(katalogMusik);
    console.log("STATISTIK KATALOG MUSIK:", statistik);
} catch (error) {
    console.error("Terjadi kesalahan sistem:", error.message);
}

const themeToggleBtn = document.querySelector('#theme-toggle');

// 1. Ambil preferensi tema dari localStorage saat pertama kali dimuat
const savedTheme = localStorage.getItem('skena_theme') ?? 'light';
document.documentElement.dataset.theme = savedTheme;
updateButtonText(savedTheme);

// 2. Pasang event listener pada tombol tema
themeToggleBtn.addEventListener('click', () => {
    // Baca status tema yang sedang aktif di tag <html>
    const currentTheme = document.documentElement.dataset.theme;

    // Tentukan tema selanjutnya
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Terapkan ke HTML dan simpan ke localStorage
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('skena_theme', nextTheme);

    // Perbarui teks tombol
    updateButtonText(nextTheme);
});

// Fungsi kecil untuk memperbarui teks pada tombol
function updateButtonText(theme) {
    if (theme === 'dark') {
        themeToggleBtn.textContent = 'Mode Terang';
    } else {
        themeToggleBtn.textContent = 'Mode Gelap';
    }
}