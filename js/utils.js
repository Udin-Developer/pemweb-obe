export function ringkasKarya(data) {

    if (!Array.isArray(data)) {
        throw new TypeError('Data harus berupa array');
    }

    return {
        totalKarya: data.length,
        totalDurasi: data.reduce((sum, item) => sum + item.durasi, 0),
        jumlahMidwest: data.filter(item => item.genre === 'Midwest').length
    };
}

export function cariBerdasarkanId(data, idDicari) {
    if (!Array.isArray(data)) throw new TypeError('Data harus berupa array');
    return data.find(item => item.id === idDicari);
}