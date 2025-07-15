import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#1E2D56",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 16,
    height: 100,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
  },
  form: { padding: 16 },
  label: {
    marginBottom: 4,
    fontFamily: "Poppins_700Bold",
    color: "#1E2D56",
  },
  inputClose: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#F8F9FA",
    fontFamily: "Poppins_400Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  attachmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E2D56",
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
});



export default styles;