import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import MagicBackground from "../components/MagicBackground";
import { QualityScorePanel } from "../components/QualityScorePanel";
import { generateStoryFromOpenAI, JudgeDecision } from "../services/api";
import { saveStory } from "../services/storage";

type GenParams = {
  mainCharacter: string;
  sidekick: string;
  setting: string;
  tone: string;
  length: string;
  age: string;
  moral: string;
};

export default function GenerateScreen() {
  const params = useLocalSearchParams<GenParams>();

  const spec = useMemo(() => {
    const mainCharacter = (params.mainCharacter ?? "A brave fox").toString();
    const sidekick = (params.sidekick ?? "A tiny robot").toString();
    const setting = (params.setting ?? "Forest").toString();
    const tone = (params.tone ?? "Calm").toString();
    const length = (params.length ?? "Short").toString();
    const age = (params.age ?? "3-5").toString();
    const moral = (params.moral ?? "Be kind, even when it's hard.").toString();

    return { mainCharacter, sidekick, setting, tone, length, age, moral };
  }, [params]);

  const [status, setStatus] = useState<"generating" | "done" | "error">(
    "generating",
  );

  const [storyText, setStoryText] = useState("");
  const [judgeDecision, setJudgeDecision] = useState<JudgeDecision | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cancelledRef = useRef(false);

  const screenTitle =
    status === "done"
      ? "Your fairytale is ready"
      : status === "error"
        ? "Something went wrong"
        : "Generating your fairytale";

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.88 + 0.12 * pulse.value,
  }));

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setStatus("generating");
        setStoryText("");
        setJudgeDecision(null);

        const result = await generateStoryFromOpenAI(spec);
        if (cancelled) return;

        setStoryText(result.story);
        setJudgeDecision(result.judge);
        setStatus("done");

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } catch (e: any) {
        if (cancelled) return;

        setStatus("error");
        setErrorMsg(e.message || "Failed to generate story.");

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [spec]);

  const onCancel = async () => {
    cancelledRef.current = true;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.back();
  };

  const onSave = async () => {
    await saveStory({
      text: storyText,
      spec: {
        mainCharacter: spec.mainCharacter,
        sidekick: spec.sidekick,
        setting: spec.setting,
        tone: spec.tone,
        length: spec.length,
        age: spec.age,
        moral: spec.moral,
      },
      quality: judgeDecision
        ? {
            score: judgeDecision.score,
            reason: judgeDecision.reason,
          }
        : undefined,
      cap: 50,
    });

    Toast.show({
      text1: "Story Saved! ✨",
      text2: "You can find it in your Favorites.",
      position: "top",
      visibilityTime: 3000,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MagicBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <Pressable
            onPress={onCancel}
            hitSlop={10}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <Text style={styles.topBarText}>Back</Text>
          </Pressable>

          <View style={{ flex: 1 }} />
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {spec.setting} • {spec.tone} • {spec.length}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInUp.duration(420)}
            style={{ marginTop: 10 }}
          >
            <Text style={styles.title}>{screenTitle}</Text>
            <Text style={styles.subtitle}>
              {spec.mainCharacter} and {spec.sidekick} in {spec.setting}.
            </Text>
          </Animated.View>

          {status === "generating" && (
            <View style={styles.activityIndicatorview}>
              <ActivityIndicator size="large" color={"#7DF9FF"} />
            </View>
          )}

          <Animated.View
            entering={FadeInDown.delay(70).duration(420)}
            style={{ marginTop: 16 }}
          >
            <Animated.View style={pulseStyle}>
              <BlurView intensity={28} tint="dark" style={styles.glass}>
                <View style={styles.glassInner}>
                  <View style={styles.stepRow}></View>

                  {status === "error" ? (
                    <View style={{ marginTop: 14 }}>
                      <Text style={styles.errorTitle}>
                        An error occurred, please try again
                      </Text>
                      <Text style={styles.errorBody}>
                        {errorMsg ?? "Unknown error"}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ marginTop: 14 }}>
                      {judgeDecision ? (
                        <QualityScorePanel
                          score={judgeDecision.score}
                          reason={judgeDecision.reason}
                          style={styles.qualityPanelSpacing}
                        />
                      ) : null}

                      <Text style={styles.storyPreview}>
                        {storyText.length ? storyText : "…"}
                      </Text>
                    </View>
                  )}
                </View>
              </BlurView>
            </Animated.View>
          </Animated.View>

          <View style={{ height: 18 }} />

          {status === "done" ? (
            <Pressable
              onPress={onSave}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.22)", "rgba(255,255,255,0.10)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Save to favorites</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
            >
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </View>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  topBarText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 20,
    fontWeight: "600",
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  pillText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    lineHeight: 22,
  },
  glass: {
    borderRadius: 26,
    overflow: "hidden",
  },
  glassInner: {
    padding: 16,
    backgroundColor: "rgba(10,12,20,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 26,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  storyPreview: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 18,
    lineHeight: 24,
  },
  qualityPanelSpacing: {
    marginBottom: 16,
  },
  errorTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  errorBody: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    fontWeight: "700",
  },
  activityIndicatorview: {
    margin: 40,
  },
});
