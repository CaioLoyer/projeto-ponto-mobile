import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeStatusProps = {
  validado: boolean;
};

export function BadgeStatus({ validado }: BadgeStatusProps) {
  return (
    <View style={[styles.badge, validado ? styles.valido : styles.invalido]}>
      <Text style={styles.texto}>
        {validado ? "Ponto validado" : "Fora da localização"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  valido: {
    backgroundColor: "#DCFCE7",
  },
  invalido: {
    backgroundColor: "#FEE2E2",
  },
  texto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
  },
});
