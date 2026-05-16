import { BlurView } from "expo-blur";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import MagicBackground from "../../components/MagicBackground";
import { deleteStory, getStories, Story } from "../../services/storage";

export default function Favorites() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStories(await getStories());
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleDelete = async (id: string) => {
    await deleteStory(id);

    setStories((prevStories) => prevStories.filter((story) => story.id !== id));

    Toast.show({ type: "success", text1: "Story vanished! ✨" });
  };

  const onOpen = async (story: Story) => {
    router.push({
      pathname: "/story",
      params: { id: story.id },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <MagicBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>Saved stories you loved.</Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {loading ? (
            <View style={styles.center}>
              <Text style={styles.muted}>Loading…</Text>
            </View>
          ) : stories.length === 0 ? (
            <BlurView intensity={18} tint="dark" style={styles.emptyCard}>
              <View style={styles.emptyCardInner}>
                <Text style={styles.emptyTitle}>No favorites yet</Text>
                <Text style={styles.emptyBody}>
                  Generate a story, then tap the heart to save it here.
                </Text>

                <Pressable
                  onPress={() => router.push("/")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <View style={styles.emptyButton}>
                    <Text style={styles.emptyButtonText}>Create a story</Text>
                  </View>
                </Pressable>
              </View>
            </BlurView>
          ) : (
            <FlatList
              data={stories}
              keyExtractor={(item) => item.id}
              ListFooterComponent={() => <View style={{ marginBottom: 40 }} />}
              contentContainerStyle={{ paddingBottom: 18 }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onOpen(item)}
                  onLongPress={() => handleDelete(item.id)}
                  delayLongPress={350}
                  style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
                >
                  <BlurView intensity={18} tint="dark" style={styles.card}>
                    <View style={styles.cardInner}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View style={{ flex: 1 }} />
                        <Text style={styles.heart}>♥</Text>
                      </View>

                      <Text style={styles.meta} numberOfLines={1}>
                        {item.spec.setting} • {item.spec.tone} •{" "}
                        {item.spec.length} • {formatDate(item.createdAt)}
                      </Text>

                      {item.quality ? (
                        <View style={styles.qualityRow}>
                          <View style={styles.qualityBadge}>
                            <Text style={styles.qualityBadgeText}>
                              Quality {item.quality.score}/5
                            </Text>
                          </View>
                          <Text style={styles.qualityReason} numberOfLines={1}>
                            {item.quality.reason}
                          </Text>
                        </View>
                      ) : null}

                      <Text style={styles.preview} numberOfLines={3}>
                        {item.text}
                      </Text>

                      <Text style={styles.hint}>
                        Tap to open • Long-press to remove
                      </Text>
                    </View>
                  </BlurView>
                </Pressable>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function formatDate(ms: number) {
  const d = new Date(ms);
  const mm = d.toLocaleString(undefined, { month: "short" });
  const dd = d.getDate();
  const yyyy = d.getFullYear();
  return `${mm} ${dd}, ${yyyy}`;
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 14,
    paddingBottom: 12,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  muted: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
  },

  emptyCard: {
    borderRadius: 24,
    overflow: "hidden",
    paddingTop: 30,
  },
  emptyCardInner: {
    padding: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyBody: {
    marginTop: 8,
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  emptyButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  card: {
    borderRadius: 22,
    overflow: "hidden",
  },
  cardInner: {
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(10,12,20,0.35)",
    borderRadius: 22,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    maxWidth: "86%",
  },
  heart: {
    color: "rgba(255,120,170,0.95)",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 10,
  },
  meta: {
    marginTop: 6,
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },
  qualityRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qualityBadge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: "rgba(125,249,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(125,249,255,0.22)",
  },
  qualityBadgeText: {
    color: "#7DF9FF",
    fontSize: 12,
    fontWeight: "900",
  },
  qualityReason: {
    flex: 1,
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    fontWeight: "600",
  },
  preview: {
    marginTop: 10,
    color: "rgba(255,255,255,0.86)",
    fontSize: 14,
    lineHeight: 20,
  },
  hint: {
    marginTop: 10,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
  },
});
