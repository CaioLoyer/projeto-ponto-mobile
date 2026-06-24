import React from "react";
import { StyleSheet, Text } from "react-native";

type MensagemTipo = "sucesso" | "erro" | "info";

type MensagemProps = {
  texto: string;
  tipo?: MensagemTipo;
};

export function Mensagem({ texto, tipo = "info" }: MensagemProps) {
  if (!texto) return null;
  return <Text style={[styles.base, ESTILOS_TIPO[tipo]]}>{texto}</Text>;
}

const styles = StyleSheet.create({
  base: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
});

const ESTILOS_TIPO: Record<MensagemTipo, { color: string }> = {
  sucesso: { color: "#16A34A" },
  erro: { color: "#DC2626" },
  info: { color: "#374151" },
};
