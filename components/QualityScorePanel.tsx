import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
  score: number;
  reason: string;
  defaultExpanded?: boolean;
  style?: ViewStyle;
};

export function QualityScorePanel({
  score,
  reason,
  defaultExpanded = false,
  style,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Pressable
      onPress={() => setExpanded((current) => !current)}
      style={({ pressed }) => [
        styles.panel,
        style,
        { opacity: pressed ? 0.86 : 1 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.label}>Quality score</Text>
        <Text style={styles.expandHint}>{expanded ? "Hide" : "Details"}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{score}/5</Text>
        </View>
      </View>

      {expanded ? <Text style={styles.reason}>{reason}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(125,249,255,0.22)",
    backgroundColor: "rgba(125,249,255,0.08)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    flex: 1,
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  expandHint: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    fontWeight: "800",
  },
  badge: {
    minWidth: 52,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(125,249,255,0.16)",
    alignItems: "center",
  },
  badgeText: {
    color: "#7DF9FF",
    fontSize: 14,
    fontWeight: "900",
  },
  reason: {
    marginTop: 8,
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 20,
  },
});
