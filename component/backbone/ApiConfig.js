export const getServerIP = async () => {
  try {
    const response = await fetch("http://10.1.37.189:8082/ip");
    const result = await response.json();
    return result.ip;
  } catch (error) {
    console.error("Gagal mendapatkan IP server:", error);
    throw error;
  }
};
