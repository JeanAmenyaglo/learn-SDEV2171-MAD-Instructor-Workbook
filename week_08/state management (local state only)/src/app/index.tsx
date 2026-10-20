import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { songs, type Song } from "../data/songs";

export default function AvailableSongsScreen() {
  const router = useRouter();

  // Local state- this screen owns its selected songs.
  const [addedSongs, setAddedSongs] = useState<Song[]>([]);

  function addSong(song: Song) {
    setAddedSongs((current) =>
      current.some((item) => item.id === song.id)
        ? current
        : [...current, song],
    );
  }

  function openPlaylist() {
    // Navigation parameters transfer a snapshot of the selection.
    router.push({
      pathname: "/playlist",
      params: { songs: JSON.stringify(addedSongs) },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Selected songs: {addedSongs.length}</Text>
      <Button title="Open My Playlist" onPress={openPlaylist} />
      <FlatList
        data={songs}
        extraData={addedSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isAdded = addedSongs.some((song) => song.id === item.id);
          return (
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <Button
                title={isAdded ? "Added" : "Add"}
                disabled={isAdded}
                onPress={() => addSong(item)}
              />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  count: { fontSize: 18, marginBottom: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  title: { flex: 1, fontSize: 18 },
});
