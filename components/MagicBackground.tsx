import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet } from "react-native";

export default function MagicBackground() {
  const backgroundImage = require("../assets/images/fairy-tale.png");
  return (
    <ImageBackground
      source={backgroundImage}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(1, 23, 42, 0.5)", "#0F172A"]}
        style={StyleSheet.absoluteFill}
      />
    </ImageBackground>
  );
}
