import * as Location from "expo-location";
import { useSQLiteContext } from "expo-sqlite";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { Botao } from "../components/Botao";
import { Cabecalho } from "../components/Cabecalho";
import { CampoTexto } from "../components/CampoTexto";
import { CardPonto } from "../components/CardPonto";
import { Mensagem } from "../components/Mensagem";
import { ModalCamera } from "../components/ModalCamera";
import { buscarEmpresaMaisRecente } from "../repositories/empresaRepository";
import { inserirPonto, listarPontos } from "../repositories/pontoRepository";
import { Empresa } from "../types/empresa";
import { Ponto } from "../types/ponto";
import React, { useEffect, useState } from "react";
import {
  RAIO_VALIDACAO_METROS,
  base64ParaBytes,
  calcularDistanciaMetros,
} from "../utils/geo";

export function PontoScreen() {
  const db = useSQLiteContext();

  const [nomeFuncionario, setNomeFuncionario] = useState("");
  const [cameraVisivel, setCameraVisivel] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mensagemTipo, setMensagemTipo] = useState<"sucesso" | "erro" | "info">(
    "info"
  );
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [empresaAtiva, setEmpresaAtiva] = useState<Empresa | null>(null);

  useEffect(() => {
    carregarPontos();
    carregarEmpresaAtiva();
  }, []);

  async function carregarPontos() {
    const resultado = await listarPontos(db);
    setPontos(resultado);
  }

  async function carregarEmpresaAtiva() {
    const resultado = await buscarEmpresaMaisRecente(db);
    setEmpresaAtiva(resultado);
  }

  function handleAbrirCamera() {
    if (nomeFuncionario.trim() === "") {
      setMensagemTipo("erro");
      setMensagem("Informe o nome do funcionário antes de tirar a foto.");
      return;
    }
    if (!empresaAtiva) {
      setMensagemTipo("erro");
      setMensagem("Cadastre uma empresa antes de registrar o ponto.");
      return;
    }
    setMensagem("");
    setCameraVisivel(true);
  }

  async function handleFotoTirada(fotoBase64: string) {
    setCameraVisivel(false);
    setRegistrando(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da sua localização para validar o ponto."
        );
        return;
      }

      const posicao = await Location.getCurrentPositionAsync({});
      const empresa = empresaAtiva;
      if (!empresa) {
        setMensagemTipo("erro");
        setMensagem("Nenhuma empresa cadastrada.");
        return;
      }

      const distancia = calcularDistanciaMetros(
        posicao.coords.latitude,
        posicao.coords.longitude,
        empresa.latitude,
        empresa.longitude
      );
      const validado = distancia <= RAIO_VALIDACAO_METROS;
      const fotoBytes = base64ParaBytes(fotoBase64);

      await inserirPonto(db, {
        nomeFuncionario: nomeFuncionario.trim(),
        foto: fotoBytes,
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        dataHora: new Date().toISOString(),
        distanciaMetros: distancia,
        validado,
        empresaId: empresa.id,
      });

      setMensagemTipo(validado ? "sucesso" : "erro");
      setMensagem(
        validado
          ? `Ponto validado! Distância de ${distancia.toFixed(1)} m da empresa.`
          : `Ponto registrado fora da localização da empresa (${distancia.toFixed(
              1
            )} m de distância).`
      );

      setNomeFuncionario("");
      await carregarPontos();
    } catch (erro) {
      setMensagemTipo("erro");
      setMensagem("Não foi possível obter a localização para registrar o ponto.");
    } finally {
      setRegistrando(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pontos}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <Cabecalho
              titulo="Registrar Ponto"
              subtitulo={
                empresaAtiva
                  ? `Empresa de referência: ${empresaAtiva.nome}`
                  : "Nenhuma empresa cadastrada"
              }
            />

            <CampoTexto
              rotulo="Nome do funcionário"
              placeholder="Digite o nome completo"
              value={nomeFuncionario}
              onChangeText={setNomeFuncionario}
            />

            <Botao
              titulo="Tirar foto e registrar ponto"
              onPress={handleAbrirCamera}
              carregando={registrando}
            />

            <Mensagem texto={mensagem} tipo={mensagemTipo} />

            <Text style={styles.subtitulo}>Pontos registrados</Text>
          </>
        }
        renderItem={({ item }) => <CardPonto ponto={item} />}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum ponto registrado ainda.</Text>
        }
        contentContainerStyle={styles.listaConteudo}
      />

      <ModalCamera
        visivel={cameraVisivel}
        onFechar={() => setCameraVisivel(false)}
        onFotoTirada={handleFotoTirada}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listaConteudo: {
    padding: 16,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 10,
  },
  vazio: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 20,
  },
});
