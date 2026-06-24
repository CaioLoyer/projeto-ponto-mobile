import * as Location from "expo-location";
import { useSQLiteContext } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BadgeStatus } from "../components/BadgeStatus";
import { Botao } from "../components/Botao";
import { Cabecalho } from "../components/Cabecalho";
import { CampoTexto } from "../components/CampoTexto";
import { Mensagem } from "../components/Mensagem";
import {
  excluirEmpresa,
  inserirEmpresa,
  listarEmpresas,
} from "../repositories/empresaRepository";
import { Empresa } from "../types/empresa";

type ModoLocalizacao = "gps" | "manual";

export function EmpresaScreen() {
  const db = useSQLiteContext();

  const [nome, setNome] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [modoLocalizacao, setModoLocalizacao] =
    useState<ModoLocalizacao>("gps");
  const [obtendoLocalizacao, setObtendoLocalizacao] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useFocusEffect(
    useCallback(() => {
      carregarEmpresas();
    }, []),
  );

  async function carregarEmpresas() {
    const resultado = await listarEmpresas(db);
    setEmpresas(resultado);
  }

  async function handleUsarLocalizacaoAtual() {
    setObtendoLocalizacao(true);
    setMensagem("");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos da sua localização para preencher automaticamente.",
        );
        return;
      }
      const posicao = await Location.getCurrentPositionAsync({});
      setLatitude(posicao.coords.latitude.toString());
      setLongitude(posicao.coords.longitude.toString());
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível obter a localização atual.");
    } finally {
      setObtendoLocalizacao(false);
    }
  }

  function validarFormulario(): string | null {
    if (nome.trim() === "") {
      return "Informe o nome da empresa.";
    }
    const lat = Number(latitude.replace(",", "."));
    const lon = Number(longitude.replace(",", "."));
    if (
      latitude.trim() === "" ||
      longitude.trim() === "" ||
      isNaN(lat) ||
      isNaN(lon)
    ) {
      return "Informe uma latitude e longitude válidas.";
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return "Latitude/longitude fora do intervalo válido.";
    }
    return null;
  }

  async function handleSalvar() {
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setMensagem(erroValidacao);
      return;
    }

    setSalvando(true);
    try {
      await inserirEmpresa(db, {
        nome: nome.trim(),
        latitude: Number(latitude.replace(",", ".")),
        longitude: Number(longitude.replace(",", ".")),
      });
      setMensagem("Empresa cadastrada com sucesso.");
      setNome("");
      setLatitude("");
      setLongitude("");
      await carregarEmpresas();
    } catch (erro) {
      setMensagem("Erro ao salvar empresa.");
    } finally {
      setSalvando(false);
    }
  }

  function handleExcluir(id: number) {
    Alert.alert(
      "Excluir empresa",
      "Tem certeza que deseja excluir esta empresa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await excluirEmpresa(db, id);
            setMensagem("Empresa removida.");
            await carregarEmpresas();
          },
        },
      ],
    );
  }

  const empresaAtivaId = empresas.length > 0 ? empresas[0].id : null;

  return (
    <View style={styles.container}>
      <FlatList
        data={empresas}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <Cabecalho
              titulo="Cadastro de Empresa"
              subtitulo="A empresa mais recente é usada para validar o ponto"
            />

            <CampoTexto
              rotulo="Nome da empresa"
              placeholder="Ex: Matriz - Centro"
              value={nome}
              onChangeText={setNome}
            />

            <View style={styles.alternarModo}>
              <TouchableOpacity
                style={[
                  styles.opcaoModo,
                  modoLocalizacao === "gps" && styles.opcaoModoAtiva,
                ]}
                onPress={() => setModoLocalizacao("gps")}
              >
                <Text
                  style={[
                    styles.opcaoModoTexto,
                    modoLocalizacao === "gps" && styles.opcaoModoTextoAtivo,
                  ]}
                >
                  Usar GPS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.opcaoModo,
                  modoLocalizacao === "manual" && styles.opcaoModoAtiva,
                ]}
                onPress={() => setModoLocalizacao("manual")}
              >
                <Text
                  style={[
                    styles.opcaoModoTexto,
                    modoLocalizacao === "manual" && styles.opcaoModoTextoAtivo,
                  ]}
                >
                  Digitar manualmente
                </Text>
              </TouchableOpacity>
            </View>

            {modoLocalizacao === "gps" ? (
              <Botao
                titulo="Usar localização atual"
                variante="secundario"
                onPress={handleUsarLocalizacaoAtual}
                carregando={obtendoLocalizacao}
                style={styles.botaoGps}
              />
            ) : null}

            <CampoTexto
              rotulo="Latitude"
              placeholder="Ex: -23.5505"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="numbers-and-punctuation"
              editable={modoLocalizacao === "manual" || latitude !== ""}
            />
            <CampoTexto
              rotulo="Longitude"
              placeholder="Ex: -46.6333"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="numbers-and-punctuation"
              editable={modoLocalizacao === "manual" || longitude !== ""}
            />

            <Botao
              titulo="Salvar empresa"
              onPress={handleSalvar}
              carregando={salvando}
            />

            <Mensagem
              texto={mensagem}
              tipo={
                mensagem.includes("sucesso")
                  ? "sucesso"
                  : mensagem
                    ? "erro"
                    : "info"
              }
            />

            <Text style={styles.subtitulo}>Empresas cadastradas</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardCoordenadas}>
                {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
              </Text>
              {item.id === empresaAtivaId ? (
                <View style={styles.badgeAtivaWrapper}>
                  <BadgeStatus validado={true} />
                </View>
              ) : null}
            </View>
            <Botao
              titulo="Excluir"
              variante="perigo"
              onPress={() => handleExcluir(item.id)}
              style={styles.botaoExcluir}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma empresa cadastrada ainda.</Text>
        }
        contentContainerStyle={styles.listaConteudo}
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
  alternarModo: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
  },
  opcaoModo: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  opcaoModoAtiva: {
    backgroundColor: "#4F46E5",
  },
  opcaoModoTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  opcaoModoTextoAtivo: {
    color: "#FFFFFF",
  },
  botaoGps: {
    marginBottom: 14,
  },
  subtitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 1,
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  cardCoordenadas: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  badgeAtivaWrapper: {
    marginTop: 6,
  },
  botaoExcluir: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  vazio: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 20,
  },
});
