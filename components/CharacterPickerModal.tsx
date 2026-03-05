import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CharacterPickerProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (item: string) => void;
  pickerKind: "mainCharacter" | "sidekick";
  moreOptions: string[];
};

export default function CharacterPickerModal({
  isVisible,
  onClose,
  onSelect,
  pickerKind,
  moreOptions,
}: CharacterPickerProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              Pick a{" "}
              {pickerKind === "mainCharacter" ? "Main character" : "Sidekick"}
            </Text>

            <FlatList
              data={moreOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable onPress={() => onSelect(item)}>
                  <View style={styles.listItem}>
                    <Text style={{ color: "white" }}>{item}</Text>
                  </View>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.90)",
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 40,
  },
  sheet: {
    backgroundColor: "rgba(10,12,20,0.95)",
    borderRadius: 24,
    padding: 16,
    maxHeight: "80%",
  },
  sheetTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  listItem: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
});
