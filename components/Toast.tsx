import { Text, View } from "react-native";
import { BaseToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        borderLeftColor: "#00FFFF",
        height: 70,
        borderRadius: 12,
        marginTop: 20,
      }}
      contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
      }}
      text2Style={{
        fontSize: 14,
        color: "#00FFFF",
      }}
    />
  ),

  magic: ({ text1, text2 }: any) => (
    <View
      style={{
        height: 60,
        width: "90%",
        backgroundColor: "rgba(120, 80, 255, 0.9)",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFF",
      }}
    >
      <Text style={{ color: "#FFF", fontWeight: "bold" }}>✨ {text1}</Text>
      <Text style={{ color: "#FFF", fontWeight: "bold" }}> {text2}</Text>
    </View>
  ),
};
