import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type BotaoVariante = "primario" | "secundario" | "perigo";

type BotaoProps = TouchableOpacityProps & {
  titulo: string;
  variante?: BotaoVariante;
  carregando?: boolean;
};


export function Botao({
  titulo,
  variante = "primario",
  carregando = false,
  disabled,
  style,
  ...rest
}: BotaoProps) {
  const estiloVariante = ESTILOS_VARIANTE[variante];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        estiloVariante.container,
        (disabled || carregando) && styles.desabilitado,
        style,
      ]}
      disabled={disabled || carregando}
      activeOpacity={0.8}
      {...rest}
    >
      {carregando ? (
        <ActivityIndicator color={estiloVariante.texto.color as string} />
      ) : (
        <Text style={[styles.texto, estiloVariante.texto]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const ESTILOS_VARIANTE = {
  primario: StyleSheet.create({
    container: { backgroundColor: "#4F46E5" },
    texto: { color: "#FFFFFF" },
  }),
  secundario: StyleSheet.create({
    container: { backgroundColor: "#E5E7EB" },
    texto: { color: "#1F2937" },
  }),
  perigo: StyleSheet.create({
    container: { backgroundColor: "#DC2626" },
    texto: { color: "#FFFFFF" },
  }),
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontWeight: "600",
    fontSize: 16,
  },
  desabilitado: {
    opacity: 0.5,
  },
});
