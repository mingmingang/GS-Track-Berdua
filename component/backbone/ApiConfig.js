export const getServerIP = async () => {
  try {
<<<<<<< HEAD
    const response = await fetch("http://192.168.98.70:8080/ip");
=======
    const response = await fetch("http://172.20.10.2:8080/ip");
>>>>>>> b1de587aebddb79883ae1525a25a516c1479b5e5
    const result = await response.json();
    return result.ip;
  } catch (error) {
    console.error("Gagal mendapatkan IP server:", error);
    throw error;
  }
};
