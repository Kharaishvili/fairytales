import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={60}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: "#FFD700",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <Ionicons name="sparkles" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
