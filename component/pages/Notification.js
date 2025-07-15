import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/NotificationStyles";
import Header from "../backbone/Header";
import i18n from "../backbone/i18n";

const { width } = Dimensions.get("window");

const notifications = [
  {
    id: "1",
    type: "success",
    title: "Donation Successful",
    message: "Your donation to the orphans in Libya is successful.",
    icon: "send",
    unread: false,
  },
  {
    id: "2",
    type: "wallet",
    title: "USDT Deposit received",
    message: "You received $370 USDT from 0xDc9AE3A...",
    icon: "wallet",
    unread: true,
  },
  {
    id: "3",
    type: "cancel",
    title: "Donation Cancelled",
    message: "Your donation to Wold Helath Organization is cancelled.",
    icon: "send",
    unread: false,
  },
  {
    id: "4",
    type: "success",
    title: "Donation Successful",
    message: "QTS foundation completes $57,000 education fundraise.",
    icon: "send",
    unread: true,
  },
  {
    id: "5",
    type: "complete",
    title: "Campaign Completed",
    message: "QTS foundation completes $57,000 education fundraise.",
    icon: "checkmark-done",
    unread: true,
  },
  {
    id: "6",
    type: "ongoing",
    title: "Campaign Published",
    message: "You have successfully created a campaign.",
    icon: "create-outline",
    unread: false,
  },
];

export default function NotificationScreen() {
  const [filter, setFilter] = useState("all");

  const filteredData =
    filter === "unread" ? notifications.filter((n) => n.unread) : notifications;

  const renderIconBackground = (type) => {
    switch (type) {
      case "success":
        return "#D1FADF";
      case "cancel":
        return "#FDE2E2";
      case "wallet":
        return "#E6ECFF";
      case "complete":
        return "#FFF1CC";
      case "ongoing":
        return "#FFE9D6";
      default:
        return "#EEE";
    }
  };

  const renderIconColor = (type) => {
    switch (type) {
      case "success":
        return "#1D9B54";
      case "cancel":
        return "#E74C3C";
      case "wallet":
        return "#2D7BF4";
      case "complete":
        return "#F5A623";
      case "ongoing":
        return "#F39C12";
      default:
        return "#666";
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: renderIconBackground(item.type) },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={18}
          color={renderIconColor(item.type)}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.title}>
          {item.title}
          {item.type === "ongoing" && (
            <Text style={styles.ongoing}>: ongoing</Text>
          )}
        </Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <>
      <Header title={i18n.t("notif_title")} />
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setFilter("all")}
            style={[styles.tabButton, filter === "all" && styles.tabActive]}
          >
            <Text
              style={filter === "all" ? styles.tabTextActive : styles.tabText}
            >
              {i18n.t("notif_tab_all")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter("unread")}
            style={[styles.tabButton, filter === "unread" && styles.tabActive]}
          >
            <Text
              style={
                filter === "unread" ? styles.tabTextActive : styles.tabText
              }
            >
              {i18n.t("notif_tab_unread")}
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </>
  );
}
