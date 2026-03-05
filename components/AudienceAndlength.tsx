import { StyleSheet, Text, View } from "react-native";
import { AGES, LENGTHS } from "../constants/text";
import { Chip } from "./Chip";
import { ChipRow } from "./ChipRow";
import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";

type Length = "Short" | "Medium" | "Long";
type Age = "3-5" | "6-8" | "9-12";

type Props = {
  setAge: (value: Age) => void;
  setLength: (value: Length) => void;
  age: string;
  length: string;
};

export default function AudienceAndlength({
  setLength,
  setAge,
  age,
  length,
}: Props) {
  return (
    <GlassCard>
      <SectionTitle title="Audience & length" />

      <Text style={styles.label}>Age</Text>
      <ChipRow>
        {AGES.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={opt === age}
            onPress={async () => {
              setAge(opt);
            }}
          />
        ))}
      </ChipRow>

      <View style={{ height: 16 }} />

      <Text style={styles.label}>Length</Text>
      <ChipRow>
        {LENGTHS.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={opt === length}
            onPress={async () => {
              setLength(opt);
            }}
          />
        ))}
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
