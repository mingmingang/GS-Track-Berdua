import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// API URLs
const API_URLS = {
  idCard: "http://10.1.49.173:8080/permintaan-id-card/list",
  suratKeterangan: "http://10.1.49.173:8080/permintaan-surat-keterangan/list",
};

const Index = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("idcard");
  const [dataIdCard, setDataIdCard] = useState([]);
  const [dataSuratKeterangan, setDataSuratKeterangan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  // Auto-refresh interval
  const refreshInterval = useRef(null);

  // Smooth easing configuration
  const smoothEasing = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "belum diverifikasi":
        return "#FFC107";
      case "selesai":
        return "#4CAF50";
      case "ditolak":
        return "#F44336";
      case "diverifikasi":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fetch ID Card data
  const fetchIdCardData = async () => {
    try {
      const response = await fetch(API_URLS.idCard);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedData = data.map((item) => ({
          id: item.kryNpk,
          nama: item.kryNamaKaryawan,
          alasan: item.picAh,
          tanggal: formatDate(item.picCreaDate),
          status: item.picStatus,
          statusColor: getStatusColor(item.picStatus),
        }));
        setDataIdCard(formattedData);
      }
    } catch (error) {
      console.error("Error fetching ID Card data:", error);
    }
  };

  // Fetch Surat Keterangan data
  const fetchSuratKeteranganData = async () => {
    try {
      const response = await fetch(API_URLS.suratKeterangan);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedData = data.map((item) => ({
          id: item.kryNpk,
          nama: item.kryNamaKaryawan,
          alasan: item.pskKet,
          tanggal: formatDate(item.pskCreaDate),
          status: item.pskStatus,
          statusColor: getStatusColor(item.pskStatus),
          hasViewButton: true,
        }));
        setDataSuratKeterangan(formattedData);
      }
    } catch (error) {
      console.error("Error fetching Surat Keterangan data:", error);
    }
  };

  // Fetch all data
  const fetchAllData = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      await Promise.all([fetchIdCardData(), fetchSuratKeteranganData()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData(false);
    setRefreshing(false);
  };

  // Setup auto-refresh
  const setupAutoRefresh = () => {
    if (refreshInterval.current) {
      clearInterval(refreshInterval.current);
    }

    // Refresh every 30 seconds
    refreshInterval.current = setInterval(() => {
      fetchAllData(false);
    }, 30000);
  };

  // Component mount and cleanup
  useEffect(() => {
    fetchAllData();
    setupAutoRefresh();

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);

  // Restart auto-refresh when component focuses
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAllData(false);
      setupAutoRefresh();
    });

    return unsubscribe;
  }, [navigation]);

  const animateTabSwitch = (tab) => {
    if (tab === activeTab) return;

    // Animate underline position
    Animated.timing(underlineAnim, {
      toValue: tab === "idcard" ? 0 : 1,
      duration: 300,
      easing: smoothEasing,
      useNativeDriver: true,
    }).start();

    // Content transition animation
    const switchAnimations = [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: smoothEasing,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 250,
          easing: smoothEasing,
          useNativeDriver: true,
        }),
      ]),
    ];

    Animated.sequence(switchAnimations).start(() => {
      setActiveTab(tab);

      // Slide and fade in new content
      slideAnim.setValue(30);

      const newContentAnimations = [
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: smoothEasing,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: smoothEasing,
          useNativeDriver: true,
        }),
      ];

      Animated.parallel(newContentAnimations).start();
    });
  };

  const handleFabPress = () => {
    navigation.navigate(
      activeTab === "idcard"
        ? "TambahPermintaanIdCard"
        : "TambahPermintaanSuratKeterangan"
    );
  };

  const getCurrentData = () => {
    return activeTab === "idcard" ? dataIdCard : dataSuratKeterangan;
  };

  const getDateRange = () => {
    const currentData = getCurrentData();
    if (currentData.length === 0) return "No data available";

    // Get date range from current data
    const dates = currentData
      .map((item) => new Date(item.tanggal))
      .filter((date) => !isNaN(date));
    if (dates.length === 0) return "No valid dates";

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  const renderRequestCards = () => {
    const currentData = getCurrentData();

    if (currentData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      );
    }

    return currentData.map((item, index) => (
      <View key={`${activeTab}-${index}-${item.id}`} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.npkText}>NPK: {item.id}</Text>
          <View style={styles.statusBadge}>
            <Text
              style={[styles.statusText, { backgroundColor: item.statusColor }]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.namaText}>{item.nama}</Text>
        <Text style={styles.alasanText}>
          {activeTab === "idcard"
            ? `Alasan: ${item.alasan}`
            : `Keterangan: ${item.alasan}`}
        </Text>

        {activeTab === "surat" && item.hasViewButton ? (
          <View style={styles.cardBottomRow}>
            <View style={styles.cardRow}>
              <MaterialIcons name="access-time" size={16} color="#999" />
              <Text style={styles.tanggalText}>{item.tanggal}</Text>
            </View>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate("LihatSuratKeterangan")}
            >
              <Text style={styles.viewButtonText}>Lihat →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardRow}>
            <MaterialIcons name="access-time" size={16} color="#999" />
            <Text style={styles.tanggalText}>{item.tanggal}</Text>
          </View>
        )}
      </View>
    ));
  };

  // Calculate underline position
  const underlinePosition = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2], // Half of full screen width
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../../assets/bg_navbar.png")}
        style={styles.header}
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Permintaan Berkas</Text>
        <TouchableOpacity
          onPress={() => fetchAllData()}
          style={styles.refreshButton}
        >
          <MaterialIcons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Tab Container - Outside ScrollView to touch header */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "idcard" && styles.tabItemActive,
            ]}
            onPress={() => animateTabSwitch("idcard")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "idcard" && styles.tabTextActive,
              ]}
            >
              Permintaan
            </Text>
            <Text
              style={[
                styles.tabText,
                activeTab === "idcard" && styles.tabTextActive,
              ]}
            >
              ID Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === "surat" && styles.tabItemActive,
            ]}
            onPress={() => animateTabSwitch("surat")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "surat" && styles.tabTextActive,
              ]}
            >
              Permintaan Surat
            </Text>
            <Text
              style={[
                styles.tabText,
                activeTab === "surat" && styles.tabTextActive,
              ]}
            >
              Keterangan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Animated Underline */}
        <Animated.View
          style={[
            styles.tabUnderline,
            {
              transform: [{ translateX: underlinePosition }],
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1E2D56"]}
            tintColor="#1E2D56"
          />
        }
      >
        {/* Date Range */}
        <View style={styles.dateRangeBox}>
          <Text style={styles.dateRangeText}>{getDateRange()}</Text>
          <View style={styles.iconsRight}>
            <TouchableOpacity>
              <MaterialIcons name="bookmark" size={20} color="#1E2D56" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity>
              <MaterialIcons name="filter-list" size={20} color="#1E2D56" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E2D56" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        )}

        {/* Request Cards with slide animation */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {!loading && renderRequestCards()}
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fab}>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleFabPress}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1E2D56",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 30,
    height: 100,
    justifyContent: "space-between",
  },
  backButton: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 10,
  },
  refreshButton: {
    paddingRight: 20,
    paddingLeft: 10,
    paddingVertical: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  // FIXED: Tab Container - Full width, touches header
  tabContainer: {
    backgroundColor: "#fff",
    // Remove all margins and padding
    marginBottom: 0,
    marginTop: 0,
    marginHorizontal: 0,
    position: "relative",
    // Make it stretch full width
    width: width,
    alignSelf: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16, // Only horizontal padding for content
    paddingTop: 16,
    paddingBottom: 12,
    // Full width
    width: "100%",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  tabItemActive: {
    // No background needed, just underline
  },
  tabText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    lineHeight: 18,
  },
  tabTextActive: {
    color: "#1E2D56",
    fontFamily: "Poppins_600SemiBold",
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: width / 2, // Half of full screen width
    backgroundColor: "#1E2D56",
    borderRadius: 2,
  },
  dateRangeBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateRangeText: {
    color: "#1E2D56",
    fontWeight: "500",
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#E7EFFD",
    padding: 12,
    borderRadius: 8,
  },
  iconsRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontFamily: "Poppins_500Medium",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#666",
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  npkText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Poppins_500Medium",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  namaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  alasanText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins_500Medium",
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tanggalText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#999",
    fontFamily: "Poppins_500Medium",
  },
  viewButton: {
    backgroundColor: "transparent",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewButtonText: {
    color: "#1E2D56",
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  fabButton: {
    backgroundColor: "#1E2D56",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#1E2D56",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "300",
  },
});
