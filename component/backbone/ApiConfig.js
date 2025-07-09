export const getServerIP = async () => {
  try {
    const response = await fetch("http://10.1.50.243:8080/ip"); // <- Ganti ke IP statis PC backend kamu
    const result = await response.json();
    return result.ip;
  } catch (error) {
    console.error("Gagal mendapatkan IP server:", error);
    throw error;
  }
};
