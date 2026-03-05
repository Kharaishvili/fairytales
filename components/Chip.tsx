import { Pressable, StyleSheet, Text, View } from "react-native";

export function Chip({ label, selected, onPress }: any) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.chip, selected && styles.chipSelected]}>
        <Text style={{ color: "white", fontWeight: selected ? "600" : "500" }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  chipSelected: {
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
});
