import { BlurView } from "expo-blur";

import React from "react";
import { StyleSheet, View } from "react-native";

export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <BlurView intensity={28} tint="dark" style={styles.glass}>
      <View style={styles.glassInner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 24,
    overflow: "hidden",
  },
  glassInner: {
    padding: 16,
    backgroundColor: "rgba(10,12,20,0.35)",
    borderWidth: 1,
    borderColor: "rgba(10,12,20,0.35)",
    borderRadius: 24,
  },
});
