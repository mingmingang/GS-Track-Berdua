import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text} from "react-native";

const CameraButton = ({ icon, label, onPress }) => (
    <TouchableOpacity onPress={onPress} style={btnStyle}>
        <MaterialIcons name={icon} size={24} color="#fff" />
        <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
);

export default CameraButton;


const btnStyle = {
  backgroundColor: "#1E3668",
  padding: 10,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: 80,
};


const textStyle = {
  color: "#fff",
  fontSize: 12,
  marginTop: 4,
};
