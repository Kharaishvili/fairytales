import * as Haptics from "expo-haptics";
import { StyleSheet, Text, View } from "react-native";
import { MAIN_CHARACTER_CHIPS, SIDEKICK_CHIPS } from "../constants/text";
import { Chip } from "./Chip";
import { ChipRow } from "./ChipRow";
import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";

type PickerKind = "mainCharacter" | "sidekick";
type Props = {
  setSidekick: (value: string) => void;
  setMainCharacter: (value: string) => void;
  openPicker: (value: PickerKind) => void;
  mainCharacter: string;
  sidekick: string;
};

export default function MainCharacterAndSideKickPicker({
  setSidekick,
  setMainCharacter,
  openPicker,
  mainCharacter,
  sidekick,
}: Props) {
  return (
    <GlassCard>
      <SectionTitle title="Characters" />

      <Text style={styles.label}>Main character</Text>
      <ChipRow>
        {MAIN_CHARACTER_CHIPS.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={opt === mainCharacter}
            onPress={async () => {
              setMainCharacter(opt);
              try {
                await Haptics.selectionAsync();
              } catch {}
            }}
          />
        ))}
        <Chip
          label="More…"
          selected={false}
          onPress={async () => {
            openPicker("mainCharacter");
            try {
              await Haptics.selectionAsync();
            } catch {}
          }}
        />
      </ChipRow>

      <View style={{ height: 16 }} />

      <Text style={styles.label}>Sidekick</Text>
      <ChipRow>
        {SIDEKICK_CHIPS.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={opt === sidekick}
            onPress={async () => {
              setSidekick(opt);
              try {
                await Haptics.selectionAsync();
              } catch {}
            }}
          />
        ))}
        <Chip
          label="More…"
          selected={false}
          onPress={() => openPicker("sidekick")}
        />
      </ChipRow>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    fontSize: 16,
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    marginVertical: 8,
  },
});
