import { ringkasKarya, cariBerdasarkanId } from './utils.js';

const katalogMusik = [
    { id: 'K001', judul: 'Suar', musisi: 'Moeremans', genre: 'Alternative Rock', lokasi: 'Tarakan', durasi: 5.50 },
    { id: 'K002', judul: 'Vas Bunga', musisi: 'Lomba Sihir', genre: 'Alternative Pop', lokasi: 'Tarakan', durasi: 3.22 },
    { id: 'K003', judul: 'Penghujung Cerita', musisi: 'Murphy Radio', genre: 'Midwest Emo', lokasi: 'Tarakan', durasi: 4.45 }
];

try {
    const musikTarakan = katalogMusik.filter(item => item.lokasi === 'Tarakan');
    console.log("KARYA LOKAL TARAKAN");
    console.table(musikTarakan);

    const musikMidwest = katalogMusik.filter(item => item.genre === 'Midwest Emo');
    console.log("KARYA GENRE MIDWEST EMO");
    console.table(musikMidwest);

    console.log("STATISTIK KATALOG MUSIK");
    const statistik = ringkasKarya(katalogMusik);
    console.table(statistik);

    const hasilPencarian = cariBerdasarkanId(katalogMusik, 'K002');
    console.log("PENCARIAN ID K002");
    console.log(hasilPencarian);

    console.log("RINGKASAN DATA KATALOG MUSIK");
    katalogMusik.map(({ judul, musisi, lokasi }) => 
        `Lagu "${judul}" dibawakan oleh ${musisi} dari wilayah ${lokasi}.`
    ).forEach(teks => console.log(teks));

} catch (error) {
    console.error("Terjadi kesalahan sistem:", error.message);
}