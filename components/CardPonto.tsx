import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ponto } from "../types/ponto";
import { bytesParaBase64, formatarDataHora } from "../utils/geo";
import { BadgeStatus } from "./BadgeStatus";

type CardPontoProps = {
  ponto: Ponto;
};

export function CardPonto({ ponto }: CardPontoProps) {
  const fotoBase64 = useMemo(() => bytesParaBase64(ponto.foto), [ponto.foto]);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
        style={styles.foto}
      />
      <View style={styles.info}>
        <Text style={styles.nome}>{ponto.nomeFuncionario}</Text>
        <Text style={styles.dataHora}>{formatarDataHora(ponto.dataHora)}</Text>
        <Text style={styles.distancia}>
          Distância da empresa: {ponto.distanciaMetros.toFixed(1)} m
        </Text>
        <View style={styles.badgeWrapper}>
          <BadgeStatus validado={ponto.validado === 1} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  foto: {
    width: 96,
    height: 96,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  nome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  dataHora: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  distancia: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  badgeWrapper: {
    marginTop: 6,
  },
});
