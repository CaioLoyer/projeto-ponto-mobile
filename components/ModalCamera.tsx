import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Botao } from "./Botao";

type ModalCameraProps = {
  visivel: boolean;
  onFechar: () => void;
  onFotoTirada: (base64: string) => void;
};

export function ModalCamera({
  visivel,
  onFechar,
  onFotoTirada,
}: ModalCameraProps) {
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const [capturando, setCapturando] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  async function handleTirarFoto() {
    if (!cameraRef.current) return;
    setCapturando(true);
    try {
      const foto = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
        skipProcessing: true,
      });
      if (foto?.base64) {
        onFotoTirada(foto.base64);
      }
    } finally {
      setCapturando(false);
    }
  }

  if (!visivel) return null;

  if (!permissao) {
    return (
      <Modal visible transparent>
        <View style={styles.centro}>
          <Text style={styles.texto}>Carregando permissões...</Text>
        </View>
      </Modal>
    );
  }

  if (!permissao.granted) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.centro}>
          <View style={styles.painel}>
            <Text style={styles.texto}>
              Precisamos da sua permissão para acessar a câmera.
            </Text>
            <Botao titulo="Conceder permissão" onPress={solicitarPermissao} />
            <Botao titulo="Cancelar" variante="secundario" onPress={onFechar} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible animationType="slide">
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" />
        <View style={styles.controles}>
          <Botao
            titulo="Cancelar"
            variante="secundario"
            onPress={onFechar}
            style={styles.botaoControle}
          />
          <Botao
            titulo="Capturar"
            onPress={handleTirarFoto}
            carregando={capturando}
            style={styles.botaoControle}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  controles: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#000",
    gap: 12,
  },
  botaoControle: {
    flex: 1,
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  painel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    gap: 10,
  },
  texto: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
    color: "#111827",
  },
});
