export const getServerIP = async () => {
  try {
    const response = await fetch("http://192.168.33.152:8080/ip");
    const result = await response.json();
    return result.ip;
  } catch (error) {
    console.error("Gagal mendapatkan IP server:", error);
    throw error;
  }
};
