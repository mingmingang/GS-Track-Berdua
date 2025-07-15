import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4FC",
  },

  headerSection: {
    backgroundColor: "#213b78ff",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    position: "relative",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#FFF",
    marginBottom: 12,
  },

  defaultAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  username: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#FFF",
  },

  welcome: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#E0E0E0",
  },

  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuLabel: {
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
    color: "#333",
  },

  logoutButton: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D33F49",
  },

  logoutText: {
    color: "#D33F49",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#999",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
    marginTop: 15,
  },

  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: 130,
    left: 10,
  },

  circle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    top: -30,
    right: -50,
  },
});
