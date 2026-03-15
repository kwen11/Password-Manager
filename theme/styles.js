import { StyleSheet } from "react-native";
import colors from "./colors";

const globalStyles = StyleSheet.create({
  // Layouts
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },

  // Typography
  titleLarge: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  titleMedium: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  titleSmall: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 16,
  },
  bodyText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  mutedText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    marginTop: 60,
  },

  // Inputs
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 4,
  },

  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  // PIN screen shared
  pinDots: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
  },
  pinKeypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 270,
    gap: 16,
  },
  pinKey: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pinKeyEmpty: {
    backgroundColor: "transparent",
  },
  pinKeyText: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: "600",
  },
});

export default globalStyles;
