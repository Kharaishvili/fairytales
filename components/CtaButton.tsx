import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onGenerate: () => void;
  canGenerate: boolean;
  mainCharacter: string;
  sidekick: string;
  setting: string;
  tone: string;
  age: string;
  length: string;
  moral: string;
};

export function CtaButton({
  onGenerate,
  canGenerate,
  mainCharacter,
  sidekick,
  setting,
  tone,
  age,
  length,
  moral,
}: Props) {
  return (
    <View style={styles.ctaContainer}>
      <BlurView intensity={45} tint="dark" style={styles.ctaBlur}>
        <Pressable
          onPress={onGenerate}
          disabled={!canGenerate}
          style={({ pressed }) => ({
            opacity: !canGenerate ? 0.5 : pressed ? 0.85 : 1,
          })}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.22)", "rgba(255,255,255,0.10)"]}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitleText}>Generate story ✨</Text>

            <Text style={styles.ctaText}>
              {mainCharacter} • {sidekick} • {setting} • {tone} • {age} •
              {length} • {moral}
            </Text>
          </LinearGradient>
        </Pressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 22 : 16,
  },
  ctaBlur: {
    borderRadius: 22,
    overflow: "hidden",
  },
  ctaGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  ctaTitleText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
});
