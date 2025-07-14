import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#1A1A1A",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#EDEFF1",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
  },
  tabTextActive: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#000",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#111",
  },
  ongoing: {
    color: "#F39C12",
    fontFamily: "Poppins_500Medium",
  },
  message: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
    color: "#444",
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2D7BF4",
    marginLeft: 8,
    marginTop: 4,
  },
});