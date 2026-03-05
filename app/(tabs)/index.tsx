import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AudienceAndlength from "../../components/AudienceAndlength";
import CharacterPickerModal from "../../components/CharacterPickerModal";
import { Chip } from "../../components/Chip";
import { ChipRow } from "../../components/ChipRow";
import { CtaButton } from "../../components/CtaButton";
import { GlassCard } from "../../components/GlassCard";
import MagicBackground from "../../components/MagicBackground";
import MainCharacterAndSideKickPicker from "../../components/MainCharacterAndSideKickPicker";
import { SectionTitle } from "../../components/SectionTitle";
import {
  MAIN_CHARACTER_CHIPS,
  MAIN_CHARACTER_MORE,
  MORALS,
  SETTINGS,
  SIDEKICK_CHIPS,
  SIDEKICK_MORE,
  TONES,
} from "../../constants/text";

type PickerKind = "mainCharacter" | "sidekick";

export default function CreateStoryScreen() {
  const [mainCharacter, setMainCharacter] = useState<string>(
    MAIN_CHARACTER_CHIPS[0],
  );
  const [sidekick, setSidekick] = useState<string>(SIDEKICK_CHIPS[0]);
  const [setting, setSetting] = useState<string>("Forest");
  const [tone, setTone] = useState<string>("Calm");
  const [length, setLength] = useState<string>("Short");
  const [age, setAge] = useState<string>("6-8");
  const [moral, setMoral] = useState<string>(MORALS[0]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerKind, setPickerKind] = useState<PickerKind>("mainCharacter");

  const canGenerate = useMemo(() => {
    return mainCharacter.length > 1 && sidekick.length > 1;
  }, [mainCharacter, sidekick]);

  const openPicker = (kind: PickerKind) => {
    setPickerKind(kind);
    setPickerOpen(true);
  };

  const closePicker = () => setPickerOpen(false);

  const moreOptions =
    pickerKind === "mainCharacter" ? MAIN_CHARACTER_MORE : SIDEKICK_MORE;

  const onSelectMore = (value: string) => {
    if (pickerKind === "mainCharacter") setMainCharacter(value);
    else setSidekick(value);
    closePicker();
  };

  const onGenerate = async () => {
    if (!canGenerate) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/generate",
      params: {
        mainCharacter,
        sidekick,
        setting,
        tone,
        length,
        age,
        moral,
      },
    });
  };

  return (
    <View style={{ flex: 1, paddingBottom: 70 }}>
      <MagicBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <Text style={styles.title}>Create a fairytale</Text>
          <Text style={styles.subtitle}>
            Choose your heroes. A new adventure awaits...
          </Text>
        </Animated.View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{ marginTop: 20 }}
          >
            <MainCharacterAndSideKickPicker
              setSidekick={setSidekick}
              setMainCharacter={setMainCharacter}
              openPicker={openPicker}
              mainCharacter={mainCharacter}
              sidekick={sidekick}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{ marginTop: 20 }}
          >
            <GlassCard>
              <SectionTitle title="Setting" />
              <ChipRow>
                {SETTINGS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={opt === setting}
                    onPress={async () => {
                      setSetting(opt);
                      try {
                        await Haptics.selectionAsync();
                      } catch {}
                    }}
                  />
                ))}
              </ChipRow>
            </GlassCard>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{ marginTop: 20 }}
          >
            <GlassCard>
              <SectionTitle title="Tone" />
              <ChipRow>
                {TONES.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={opt === tone}
                    onPress={async () => {
                      setTone(opt);
                      try {
                        await Haptics.selectionAsync();
                      } catch {}
                    }}
                  />
                ))}
              </ChipRow>
            </GlassCard>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{ marginTop: 20 }}
          >
            <GlassCard>
              <SectionTitle title="Moral" />
              <ChipRow>
                {MORALS.map((opt) => (
                  <Chip
                    key={opt}
                    label={opt}
                    selected={opt === moral}
                    onPress={async () => {
                      setMoral(opt);
                      try {
                        await Haptics.selectionAsync();
                      } catch {}
                    }}
                  />
                ))}
              </ChipRow>
            </GlassCard>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{ marginTop: 20 }}
          ></Animated.View>
          <AudienceAndlength
            setLength={setLength}
            setAge={setAge}
            age={age}
            length={length}
          />
        </ScrollView>

        <CtaButton
          onGenerate={onGenerate}
          canGenerate={canGenerate}
          mainCharacter={mainCharacter}
          sidekick={sidekick}
          setting={setting}
          tone={tone}
          age={age}
          length={length}
          moral={moral}
        />

        <CharacterPickerModal
          isVisible={pickerOpen}
          onClose={closePicker}
          onSelect={onSelectMore}
          pickerKind={pickerKind}
          moreOptions={moreOptions}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    color: "rgba(255,255,255)",
    marginTop: 8,
    fontSize: 16,
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    marginVertical: 8,
  },
});
