import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="px-10">
      <View>
        <Text>HomeScreen</Text>
      </View>
    </SafeAreaView>
  );
}
