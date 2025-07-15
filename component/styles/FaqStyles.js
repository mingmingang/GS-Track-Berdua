import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    elevation: 2,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  answerText: {
    fontFamily: "Poppins_400Regular",
    marginTop: 12,
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
    textAlign: "justify",
  },
});
