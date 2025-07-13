export const formatTanggal = (tanggalString) => {
  const bulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const tanggal = new Date(tanggalString);
  const hari = tanggal.getDate();
  const bulan = bulanIndo[tanggal.getMonth()];
  const tahun = tanggal.getFullYear();
  return `${hari} ${bulan} ${tahun}`;
};

export const getTanggalRange = (tahun) => {
  const now = new Date();
  const thisYear = now.getFullYear();

  const bulanIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const awal = `1 Januari ${tahun}`;
  const akhir = (parseInt(tahun) === thisYear)
    ? `${now.getDate()} ${bulanIndo[now.getMonth()]} ${tahun}`
    : `31 Desember ${tahun}`;
  return `${awal} - ${akhir}`;
};

export const generateTanggalCuti = (start, end) => {
  const dates = [];
  const current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};