import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type CampoTextoProps = TextInputProps & {
  rotulo: string;
  erro?: string;
};

export function CampoTexto({ rotulo, erro, style, ...rest }: CampoTextoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        style={[styles.input, erro ? styles.inputComErro : null, style]}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  inputComErro: {
    borderColor: "#DC2626",
  },
  erro: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
  },
});
