import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#1E2D56",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    height: 100,
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700bold",
  },
  statusBox: {
    backgroundColor: "#E0EDFF",
    margin: 16,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    color: "#333",
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  statusBadge: {
    backgroundColor: "#34D399",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "Poppins_700Bold",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Poppins_700Bold",
  },
  detailRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    color: "#A0AEC0",
    fontSize: 14,
    marginBottom: 6,
    fontFamily: "Poppins_600SemiBold",
  },
  value: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins_700Bold",
  },
  detailKeternagan: {
    marginTop: 8,
  },
 fixedButtons: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderTopWidth: 1,
  borderTopColor: '#eee',
},

buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom:10 // jika gap tidak support, gunakan marginHorizontal di tombol
},

buttonTolak: {
  flex: 1,
  backgroundColor: '#FF3B30',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginRight: 6,
   color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign:"center" // beri jarak antar tombol (atau gunakan gap di atas)
},

buttonSetuju: {
  flex: 1,
  backgroundColor: '#34C759',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginLeft: 6, 
   color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign:"center"// beri jarak antar tombol
},

buttonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
  downloadLink: {
    marginTop: 6,
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "600",
  },

});

export default styles;
