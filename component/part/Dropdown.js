import React from "react";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder,
  zIndex = 1000,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      listMode="SCROLLVIEW" // ✅ Fix nested FlatList error
      placeholderStyle={{
        color: "#888",
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
      }}
      flatListProps={{
        scrollEnabled: true,
        nestedScrollEnabled: true,
      }}
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        minHeight: 45,
        backgroundColor: "#fff",
        marginBottom: open ? Math.min(items.length * 70, 300) : 12,
        paddingHorizontal: 12,
        zIndex: zIndex,
      }}
      textStyle={{
        fontFamily: "Poppins_400Regular",
        fontSize: 14,
        color: "#1E2D56",
      }}
      dropDownContainerStyle={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        marginTop: 2,
        maxHeight: 300,
        elevation: 5,
      }}
      listItemContainerStyle={{
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
      listItemLabelStyle={{
        fontFamily: "Poppins_400Regular",
        color: "#1E2D56",
        fontSize: 13,
      }}
      selectedItemContainerStyle={{
        backgroundColor: "#E5F0FF",
      }}
      selectedItemLabelStyle={{
        fontFamily: "Poppins_700Bold",
      }}
      scrollViewProps={{
        showsVerticalScrollIndicator: true,
        persistentScrollbar: true,
      }}
      searchable={true}
      searchPlaceholder="Cari jenis cuti..."
      searchTextInputStyle={{
        fontFamily: "Poppins_400Regular",
        borderColor: "#ddd",
      }}
      searchContainerStyle={{
        borderBottomColor: "#ddd",
        padding: 10,
      }}
      mode="BADGE"
      badgeDotColors={["#1E2D56"]}
      disabledItemLabelStyle={{
        color: "#ccc",
      }}
      extendableBadgeContainer={true}
      activityIndicatorColor="#1E2D56"
      itemSeparator={true}
      itemSeparatorStyle={{
        backgroundColor: "#eee",
      }}
    />
  );
};

export default Dropdown;
