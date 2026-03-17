import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { decrypt } from "../constants/crypto";
import colors from "../theme/colors";
import globalStyles from "../theme/styles";

export default function VaultScreen() {
  const [entries, setEntries] = useState([]);
  const [revealed, setRevealed] = useState({});
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  async function loadEntries() {
    const raw = await AsyncStorage.getItem("vault_entries");
    setEntries(raw ? JSON.parse(raw) : []);
  }

  async function deleteEntry(id) {
    Alert.alert("Delete", "Delete this entry?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = entries.filter((e) => e.id !== id);
          await AsyncStorage.getItem("vault_entries", JSON.stringify(updated));
          setEntries(updated);
        },
      },
    ]);
  }

  function toggleReveal(id) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }));
  }

  async function copyPassword(encrypted) {
    await Clipboard.setStringAsync(decrypt(encrypted));
    Alert.alert("Copied!", "Password copied to clipboard");
  }

  function renderEntry({ item }) {
    const isRevealed = revealed[item.id];
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>{item.site[0].toUpperCase()}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.siteName}>{item.site}</Text>
            <Text style={styles.username}>{decrypt(item.username)}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/entry",
                params: { id: item.id, view: "true" },
              })
            }
            style={styles.actionBtn}
          >
            <Text style={styles.actionIcon}>➡️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordRow}>
          <Text style={styles.passwordText}>
            {isRevealed ? decrypt(item.password) : "••••••••"}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => toggleReveal(item.id)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionIcon}>{isRevealed ? "👁️" : "🙈"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => copyPassword(item.password)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionIcon}>📋</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteEntry(item.id)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={styles.header}>
        <Text style={globalStyles.titleMedium}>My Vault</Text>
        <Text style={styles.count}>{entries.length} entries</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={globalStyles.mutedText}>
            No entries yet. Tap + to add one!
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/entry")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
  },
  count: { color: colors.primary, fontSize: 14 },
  list: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: { color: colors.textPrimary, fontSize: 20, fontWeight: "bold" },
  cardInfo: { flex: 1 },
  siteName: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  username: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  passwordText: { color: colors.textSecondary, fontSize: 14, letterSpacing: 2 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 4 },
  actionIcon: { fontSize: 18 },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  fabText: { color: colors.textPrimary, fontSize: 32, lineHeight: 36 },
});
