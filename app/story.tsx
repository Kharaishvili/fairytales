import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import MagicBackground from "../components/MagicBackground";
import { QualityScorePanel } from "../components/QualityScorePanel";
import { deleteStory, getStoryById, Story } from "../services/storage";

type Params = { id?: string };

export default function StoryScreen() {
  const { id } = useLocalSearchParams<Params>();

  const storyId = useMemo(() => (typeof id === "string" ? id : ""), [id]);

  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!storyId) {
      setError("Missing story id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const s = await getStoryById(storyId);
      setStory(s);
      if (!s) setError("Story not found.");
    } catch (e: any) {
      setError(e?.message ?? "Failed to load story.");
      setStory(null);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    load();
  }, [load]);

  const onCopy = async () => {
    if (!story) return;

    try {
      await Clipboard.setStringAsync(story.text);
    } catch {}

    Toast.show({
      type: "success",
      text1: "Story copied to the clipboard ✨",
      visibilityTime: 3000,
    });
  };

  const onDelete = async () => {
    if (!story) return;

    Alert.alert(
      "Delete story?",
      "This will remove it from Favorites and Recent.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning,
              );
            } catch {}

            await deleteStory(story.id);
            router.back();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MagicBackground />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <Text style={styles.topBarText}>Back</Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <View style={{ width: 14 }} />

          <Pressable
            onPress={onDelete}
            disabled={!story}
            hitSlop={10}
            style={({ pressed }) => [
              { opacity: !story ? 0.45 : pressed ? 0.75 : 1 },
            ]}
          >
            <Text
              style={[styles.topBarText, { color: "rgba(255,140,140,0.9)" }]}
            >
              Delete
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator />
              <Text style={styles.muted}>Loading…</Text>
            </View>
          ) : error ? (
            <BlurView intensity={18} tint="dark" style={styles.card}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>Couldn’t open story</Text>
                <Text style={styles.cardBody}>{error}</Text>

                <Pressable
                  onPress={load}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Try again</Text>
                  </View>
                </Pressable>
              </View>
            </BlurView>
          ) : story ? (
            <>
              <BlurView intensity={22} tint="dark" style={styles.card}>
                <View style={styles.cardInner}>
                  <Text style={styles.storyTitle}>{story.title}</Text>

                  <Text style={styles.meta}>
                    {story.spec.setting} • {story.spec.tone} •{""}
                    {story.spec.length} • Age {story.spec.age}
                  </Text>

                  {story.spec.moral ? (
                    <Text style={styles.moral} numberOfLines={2}>
                      Moral: {story.spec.moral}
                    </Text>
                  ) : null}

                  {story.quality ? (
                    <QualityScorePanel
                      score={story.quality.score}
                      reason={story.quality.reason}
                      style={styles.qualityPanelSpacing}
                    />
                  ) : null}

                  <View style={styles.actionRow}>
                    <Pressable
                      onPress={onCopy}
                      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                    >
                      <View style={styles.actionButtonSecondary}>
                        <Text style={styles.actionButtonText}>Copy</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </BlurView>

              <View style={{ height: 14 }} />

              <BlurView intensity={18} tint="dark" style={styles.storyCard}>
                <View style={styles.storyCardInner}>
                  <Text style={styles.storyText}>{story.text}</Text>
                </View>
              </BlurView>
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  topBarText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 20,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  muted: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
  },

  card: {
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 6,
  },
  cardInner: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(10,12,20,0.35)",
    borderRadius: 24,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },
  cardBody: {
    marginTop: 8,
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },

  button: {
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },

  storyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  meta: {
    marginTop: 8,
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "800",
  },
  moral: {
    marginTop: 10,
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 18,
  },
  qualityPanelSpacing: {
    marginTop: 12,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  actionButtonSecondary: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  },

  storyCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  storyCardInner: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(10,12,20,0.30)",
    borderRadius: 24,
  },
  storyText: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 18,
    lineHeight: 24,
  },
});
