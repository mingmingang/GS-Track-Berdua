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
  form: {
    padding: 16,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
    fontFamily: "Poppins_700Bold",
  },
  disabledInput: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    color: "#A0AEC0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 12,
    color: "#333",
    marginRight: 8,
  },
  table: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#1E3A8A",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
  },
  tableRow: {
    backgroundColor: "#EEF3FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableText: {
    color: "#333",
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3CCA49",
    borderRadius: 12,
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontFamily:"Poppins_700Bold"
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#21376A",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
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
});

export default styles;