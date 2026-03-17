import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { decrypt, encrypt } from "../constants/crypto";
import colors from "../theme/colors";
import globalStyles from "../theme/styles";

export default function EntryScreen() {
  const { id, view } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = !!id;
  const [isViewing, setIsViewing] = useState(view === "true");

  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isEdit) loadEntry();
  }, []);

  async function loadEntry() {
    const raw = await AsyncStorage.getItem("vault_entries");
    const entries = raw ? JSON.parse(raw) : [];
    const entry = entries.find((e) => e.id === id);
    if (entry) {
      setSite(entry.site);
      setUsername(decrypt(entry.username));
      setPassword(decrypt(entry.password));
      setNotes(entry.notes || "");
    }
  }

  function getStrength(pw) {
    let score = 0;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 8) score++;
    if (pw.length >= 10) score++;
    if (pw.length < 6) return 1;
    return score;
  }

  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
    strength
  ];
  const strengthColor = [
    "#333",
    colors.danger,
    colors.warning,
    colors.caution,
    colors.success,
    colors.primary,
  ][strength];

  async function save() {
    if (!site.trim() || !username.trim() || !password.trim()) {
      Alert.alert("Required", "Please fill in site, username, and password");
      return;
    }
    const raw = await AsyncStorage.getItem("vault_entries");
    const entries = raw ? JSON.parse(raw) : [];

    if (isEdit) {
      const updated = entries.map((e) =>
        e.id === id
          ? {
              ...e,
              site,
              username: encrypt(username),
              password: encrypt(password),
              notes,
            }
          : e,
      );
      await AsyncStorage.setItem("vault_entries", JSON.stringify(updated));
    } else {
      const newEntry = {
        id: Date.now().toString(),
        site,
        username: encrypt(username),
        password: encrypt(password),
        notes,
      };
      await AsyncStorage.setItem(
        "vault_entries",
        JSON.stringify([...entries, newEntry]),
      );
    }
    router.back();
  }

  return (
    <ScrollView
      style={globalStyles.screenContainer}
      contentContainerStyle={globalStyles.scrollContent}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={globalStyles.titleSmall}>
          {isViewing ? "View Entry" : isEdit ? "Edit Entry" : "New Entry"}
        </Text>
        {isViewing && (
          <TouchableOpacity onPress={() => setIsViewing(false)}>
            <Text style={styles.editToggle}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {isViewing ? (
        // VIEW MODE
        <View>
          <Text style={globalStyles.label}>Site / App Name</Text>
          <View style={styles.viewField}>
            <Text style={styles.viewText}>{site}</Text>
          </View>

          <Text style={globalStyles.label}>Username / Email</Text>
          <View style={styles.viewField}>
            <Text style={styles.viewText}>{username}</Text>
          </View>

          <Text style={globalStyles.label}>Password</Text>
          <View style={[styles.viewField, styles.viewFieldRow]}>
            <Text style={styles.viewText}>
              {showPass ? password : "••••••••"}
            </Text>
            <TouchableOpacity onPress={() => setShowPass((s) => !s)}>
              <Text style={styles.eyeIcon}>{showPass ? "👁️" : "🙈"}</Text>
            </TouchableOpacity>
          </View>

          {notes ? (
            <>
              <Text style={globalStyles.label}>Notes</Text>
              <View style={styles.viewField}>
                <Text style={styles.viewText}>{notes}</Text>
              </View>
            </>
          ) : null}
        </View>
      ) : (
        // EDIT/ADD MODE
        <View>
          <Text style={globalStyles.label}>Site / App Name *</Text>
          <TextInput
            style={globalStyles.input}
            value={site}
            onChangeText={setSite}
            placeholder="e.g. Google"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={globalStyles.label}>Username / Email *</Text>
          <TextInput
            style={globalStyles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="e.g. user@gmail.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
          />

          <Text style={globalStyles.label}>Password *</Text>
          <View style={styles.passRow}>
            <TextInput
              style={[globalStyles.input, { flex: 1, marginBottom: 0 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPass}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPass((s) => !s)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthSegment,
                        i < strength && { backgroundColor: strengthColor },
                      ]}
                    />
                  ))}
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                {strengthLabel}
              </Text>
            </View>
          )}

          <Text style={globalStyles.label}>Notes (optional)</Text>
          <TextInput
            style={[globalStyles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Extra info, security questions..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={globalStyles.primaryButton} onPress={save}>
            <Text style={globalStyles.primaryButtonText}>
              {isEdit ? "Save Changes" : "Add Entry"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  back: { color: colors.primary, fontSize: 16 },
  editToggle: { color: colors.primary, fontSize: 14, marginLeft: "auto" },
  passRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  eyeBtn: { padding: 14, backgroundColor: colors.surface, borderRadius: 12 },
  eyeIcon: { fontSize: 18 },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  strengthBar: { flexDirection: "row", gap: 4, flex: 1 },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceAlt,
  },
  strengthLabel: { fontSize: 12, width: 70 },
  notesInput: { height: 80, textAlignVertical: "top" },
  viewField: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 4,
  },
  viewFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewText: { color: colors.textPrimary, fontSize: 15 },
});
