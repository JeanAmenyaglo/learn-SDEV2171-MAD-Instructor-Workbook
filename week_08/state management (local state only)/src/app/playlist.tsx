import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import type { Song } from "../data/songs";

export default function PlaylistScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ songs?: string }>();

  // Duplicated state- this screen creates its own selection from the snapshot.
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>(() =>
    JSON.parse(params.songs ?? "[]"),
  );

  function removeSong(id: string) {
    // doing this only this screen's state changes. AvailableSongs still has its old selection.
    setPlaylistSongs((current) => current.filter((song) => song.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Playlist songs: {playlistSongs.length}</Text>
      <Button title="Back to Available Songs" onPress={() => router.back()} />
      <FlatList
        data={playlistSongs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Your playlist is empty.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Button title="Remove" onPress={() => removeSong(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  count: { fontSize: 18, marginBottom: 16 },
  empty: { marginTop: 20, fontSize: 16 },
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
