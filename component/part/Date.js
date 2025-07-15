import i18n from "../backbone/i18n"; // atau sesuaikan path-nya

export const formatTanggal = (tanggalString) => {
  const lang = i18n.language;

  const bulan = {
    id: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
  };

  const tanggal = new Date(tanggalString);
  const hari = tanggal.getDate();
  const namaBulan = bulan[lang]?.[tanggal.getMonth()] || bulan["id"][tanggal.getMonth()];
  const tahun = tanggal.getFullYear();
  return `${hari} ${namaBulan} ${tahun}`;
};
export const getTanggalRange = (tahun) => {
  const lang = i18n.language;
  const now = new Date();
  const thisYear = now.getFullYear();

  const bulan = {
    id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    th: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  };

  const namaBulan = bulan[lang] || bulan["id"];
  const awal = `1 ${namaBulan[0]} ${tahun}`;
  const akhir =
    parseInt(tahun) === thisYear
      ? `${now.getDate()} ${namaBulan[now.getMonth()]} ${tahun}`
      : `31 ${namaBulan[11]} ${tahun}`;

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