import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { inicializarBanco } from "./database/database";
import { EmpresaScreen } from "./screens/EmpresaScreen";
import { PontoScreen } from "./screens/PontoScreen";
import { Ionicons } from "@expo/vector-icons";

export type RootTabParamList = {
  Ponto: undefined;
  Empresa: undefined;
};

const NOME_BANCO = "ponto.db";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName={NOME_BANCO} onInit={inicializarBanco}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            initialRouteName="Ponto"
            screenOptions={{
              tabBarActiveTintColor: "#4F46E5",
              tabBarInactiveTintColor: "#9CA3AF",
              tabBarLabelStyle: { fontWeight: "700", fontSize: 12 },
            }}
          >
            <Tab.Screen
              name="Ponto"
              component={PontoScreen}
              options={{
                title: "Ponto",
                tabBarIcon: ({ color, size, focused }) => (
                  <Ionicons
                    name={focused ? "camera" : "camera-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Empresa"
              component={EmpresaScreen}
              options={{
                title: "Empresa",
                tabBarIcon: ({ color, size, focused }) => (
                  <Ionicons
                    name={focused ? "business" : "business-outline"}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
