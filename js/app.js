import { ringkasKarya, cariBerdasarkanId } from './utils.js';

const katalogMusik = [
    { id: 'K001', judul: 'Suar', musisi: 'Moeremans', genre: 'Alternative Rock, indie rock', durasi: 5.50 },
    { id: 'K002', judul: 'Vas Bunga', musisi: 'Lomba Sihir', genre: 'Alternative Pop', durasi: 3.22 },
    { id: 'K003', judul: 'Penghujung Cerita', musisi: 'Murphy Radio', genre: 'Midwest', durasi: 4.45 }
];

const musikTarakan = katalogMusik.filter(item => item.lokasi === 'Tarakan');
console.log("KARYA LOKAL TARAKAN");
console.table(musikTarakan);

const musikAkustik = katalogMusik.filter(item => item.genre === 'Midwest');

const daftarJudul = katalogMusik.map(item => item.judul);

const totalDurasi = katalogMusik.reduce((total, item) => total + item.durasi, 0);

try {
    console.log(daftarJudul);
    
    console.log("KARYA GENRE MIDWEST");
    console.table(musikAkustik);

    console.log("STATISTIK KATALOG MUSIK");
    const statistik = ringkasKarya(katalogMusik);
    console.table(statistik);

} catch (error) {
    console.error("Terjadi kesalahan sistem:", error.message);
}

const hasilPencarian = cariBerdasarkanId(katalogMusik, 'K002');
console.log("PENCARIAN ID K002");
console.log(hasilPencarian);

const ringkasanLengkap = katalogMusik.map(({ judul, musisi, lokasi }) => {
    return `Lagu "${judul}" dibawakan oleh ${musisi} dari wilayah ${lokasi}.`;
});

console.log("RINGKASAN DATA KATALOG MUSIK");
ringkasanLengkap.forEach(teks => console.log(teks));