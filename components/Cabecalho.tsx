import React from "react";
import { StyleSheet, Text, View } from "react-native";

type CabecalhoProps = {
  titulo: string;
  subtitulo?: string;
};

export function Cabecalho({ titulo, subtitulo }: CabecalhoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitulo: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});
