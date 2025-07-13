import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  form: {
    padding: 16,
  },

  label: {
    marginBottom: 4,
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },

  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    width: "90%",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  phoneContainer: {
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    width: "100%",
    height: "10%",
  },

  phonePrefix: {
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },

  phoneInput: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },

  phoneTextContainer: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#fff",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
    borderColor:"#1E3668",
     borderWidth:2
  },

  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  headerSection: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },

  profileWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  editIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1E3668",
    borderRadius: 50,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 10,
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 6,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
});
