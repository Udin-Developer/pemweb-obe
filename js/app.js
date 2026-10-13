import { ringkasKarya, cariBerdasarkanId } from './utils.js';

// Pemilihan elemen DOM untuk API
const output = document.querySelector('#api-output');
const message = document.querySelector('#api-message');
const btnRetry = document.querySelector('#btn-retry');
const searchInput = document.querySelector('#search');
const limitSelect = document.querySelector('#limit');

// Variabel global untuk menyimpan data sementara agar filtering bisa dilakukan offline
let fetchedUsers = [];

// Instruksi D.1 & D.2: Fungsi asinkron loadUsers dengan Fetch API
async function loadUsers() {
    // Menampilkan state loading (D.5)
    message.textContent = 'Memuat data musisi...';
    message.style.color = 'var(--text-dark)';
    btnRetry.style.display = 'none';
    output.replaceChildren();

    // Fallback data lokal (Sesuai panduan jika lab offline)
    const USE_LOCAL_DATA = false;
    const API_URL = 'https://jsonplaceholder.typicode.com/users'; // Ubah ke true jika ingin menggunakan data lokal
    const LOCAL_URL = './data/musisi.json';

    try {
        // Melakukan request GET
        const response = await fetch(USE_LOCAL_DATA ? LOCAL_URL : API_URL);

        // Instruksi D.3: Memeriksa response.ok
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - Gagal merespons data dari server.`);
        }

        // Instruksi D.4: Parsing JSON
        fetchedUsers = await response.json();
        
        // Memicu fungsi render berdasarkan filter dan limit saat ini
        updateView();

        // State sukses (D.5)
        message.textContent = `Berhasil memuat ${fetchedUsers.length} data profil pengguna.`;
        message.style.color = 'green';
        
    } catch (error) {
        // Penanganan Error Handling jaringan atau API gagal (D.5)
        console.error("Gagal melakukan penarikan data API:", error);
        message.textContent = 'Data gagal dimuat. Periksa jaringan Anda atau coba kembali.';
        message.style.color = 'var(--brand)';
        btnRetry.style.display = 'inline-block'; // Menampilkan tombol retry (E.1)
    }
}

// Fungsi master merender data dengan aman (textContent) dan filter (E.2)
function updateView() {
    // Jika data masih kosong, jangan lakukan render filter
    if (fetchedUsers.length === 0) return;

    output.replaceChildren(); // Membersihkan DOM sebelum disuntik data baru

    const keyword = searchInput.value.toLowerCase();
    const limit = Number(limitSelect.value);

    // Instruksi E.2: Filter data array secara lokal tanpa memanggil ulang API
    const hasilFilter = fetchedUsers.filter(user => 
        user.name.toLowerCase().includes(keyword) || 
        user.email.toLowerCase().includes(keyword)
    );

    // Membangun elemen kartu (Card) dengan aman menggunakan textContent (D.4)
    hasilFilter.slice(0, limit).forEach(user => {
        const li = document.createElement('li');
        li.className = 'card';
        
        const title = document.createElement('h3');
        title.textContent = user.name;
        
        const company = document.createElement('p');
        company.textContent = `Perusahaan/Grup: ${user.company.name}`;
        
        const contact = document.createElement('p');
        contact.textContent = `Email: ${user.email}`;

        const website = document.createElement('p');
        website.textContent = `Web: ${user.website}`;

        li.append(title, company, contact, website);
        output.append(li);
    });

    if (hasilFilter.length === 0) {
        output.textContent = "Data tidak ditemukan berdasarkan pencarian Anda.";
    }
}

// Event Listeners (Toolbar dan Retry)
btnRetry.addEventListener('click', loadUsers); // E.1: Tombol Retry
searchInput.addEventListener('input', updateView); // E.2: Pencarian interaktif tanpa Fetch ulang
limitSelect.addEventListener('change', updateView);

// Eksekusi API secara otomatis ketika halaman pertama kali dimuat
loadUsers();

// ==========================================
// KODE DARK MODE & VALIDASI FORM (TETAP DIPERTAHANKAN)
// ==========================================
// (Biarkan kode Dark Mode dan validasi form pendaftaran yang ada sebelumnya di sini)


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

// --- IMPLEMENTASI MODUL 6: VALIDASI FORM ---
const formPendaftaran = document.querySelector('#form-pendaftaran');
const formStatus = document.querySelector('#form-status');

function validateForm(data) {
    const errors = {};

    const nama = String(data.get('nama') ?? '').trim();
    const kategori = String(data.get('kategori') ?? '').trim();
    const jumlah = data.get('jumlah');
    const tanggal = data.get('tanggal');

    // Validasi Nama (Membedakan kosong dan salah format)
    const regexNama = /^[a-zA-Z0-9\s]+$/; // Hanya huruf, angka, dan spasi
    
    if (!nama) {
        errors.nama = 'Nama tidak boleh kosong.';
    } else if (nama.length < 3) {
        errors.nama = 'Nama harus terdiri dari minimal 3 karakter.';
    } else if (!regexNama.test(nama)) {
        errors.nama = 'Nama hanya boleh berisi huruf dan angka, tanpa simbol khusus.';
    }

    // Validasi Kategori
    const kategoriValid = ['promotor', 'musisi-solo', 'band', 'penulis-lirik'];
    if (!kategori) {
        errors.kategori = 'Kategori wajib dipilih.';
    } else if (!kategoriValid.includes(kategori)) {
        errors.kategori = 'Pilihan kategori tidak valid.';
    }

    // Validasi Jumlah Personel (Number)
    if (!jumlah) {
        errors.jumlah = 'Jumlah personel tidak boleh kosong.';
    } else {
        const numJumlah = Number(jumlah);
        if (!Number.isInteger(numJumlah) || numJumlah < 1) {
            errors.jumlah = 'Jumlah harus berupa bilangan bulat dan minimal 1.';
        }
    }

    // Validasi Tanggal
    if (!tanggal) {
        errors.tanggal = 'Tanggal wajib diisi.';
    } else {
        const inputDate = new Date(tanggal);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalisasi waktu ke tengah malam
        
        if (inputDate > today) {
            errors.tanggal = 'Tanggal tidak boleh melebihi hari ini.';
        }
    }

    return errors;
}

formPendaftaran.addEventListener('submit', event => {
    event.preventDefault(); // Menahan pengiriman data ke server
    
    const data = new FormData(formPendaftaran);
    const errors = validateForm(data);

    // Reset status error dan atribut aria-invalid
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    formPendaftaran.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
    formStatus.textContent = '';
    formStatus.style.color = '';

    // Jika ada error
    if (Object.keys(errors).length > 0) {
        for (const [field, message] of Object.entries(errors)) {
            const errorElement = document.querySelector(`#error-${field}`);
            if (errorElement) errorElement.textContent = message;
            
            const inputElement = formPendaftaran.elements[field];
            if (inputElement) inputElement.setAttribute('aria-invalid', 'true');
        }
        
        // Arahkan kursor ke input pertama yang error
        const firstField = Object.keys(errors)[0];
        const firstInput = formPendaftaran.elements[firstField];
        if (firstInput) firstInput.focus();
        
        formStatus.style.color = 'var(--brand)';
        formStatus.textContent = 'Periksa kembali data yang belum valid.';
        return;
    }

    // Jika valid, tampilkan preview dan jangan kirim dulu
    formStatus.style.color = 'green';
    formStatus.textContent = 'Data valid dan siap dikirim (Sistem menahan submit untuk preview).';
});