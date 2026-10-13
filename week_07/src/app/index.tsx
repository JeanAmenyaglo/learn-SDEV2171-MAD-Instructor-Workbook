import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [cities, setCities] = useState(["Edmonton", "Calgary", "Toronto"]);

  function changeCity() {
    setCities(cities.map((city) => (city === "Calgary" ? "Red Deer" : city)));
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flexGrow: 0 }}
        data={cities}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.city}>{item}</Text>}
      />

      <View style={styles.buttons}>
        <Button title="Change Calgary to Red Deer" onPress={changeCity} />
        <Button
          title="Choose a country and city"
          onPress={() => router.push("/explore")}
        />
        <Button
          title="Choose a country and city (using try catch block)"
          onPress={() => router.push("/explore_alt")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  city: {
    fontSize: 20,
    paddingVertical: 14,
  },
  buttons: {
    gap: 12,
  },
});
