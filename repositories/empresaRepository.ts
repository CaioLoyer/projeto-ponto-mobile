import { SQLiteDatabase } from "expo-sqlite";
import { NovaEmpresa, Empresa } from "../types/empresa";

export async function listarEmpresas(db: SQLiteDatabase): Promise<Empresa[]> {
  const resultado = await db.getAllAsync<Empresa>(
    "SELECT * FROM empresa ORDER BY id DESC;"
  );
  return resultado;
}

export async function buscarEmpresaMaisRecente(
  db: SQLiteDatabase
): Promise<Empresa | null> {
  const resultado = await db.getFirstAsync<Empresa>(
    "SELECT * FROM empresa ORDER BY id DESC LIMIT 1;"
  );
  return resultado ?? null;
}

export async function buscarEmpresaPorId(
  db: SQLiteDatabase,
  id: number
): Promise<Empresa | null> {
  const resultado = await db.getFirstAsync<Empresa>(
    "SELECT * FROM empresa WHERE id = ?;",
    [id]
  );
  return resultado ?? null;
}

export async function inserirEmpresa(
  db: SQLiteDatabase,
  empresa: NovaEmpresa
): Promise<void> {
  await db.runAsync(
    "INSERT INTO empresa (nome, latitude, longitude) VALUES (?, ?, ?);",
    [empresa.nome, empresa.latitude, empresa.longitude]
  );
}

export async function atualizarEmpresa(
  db: SQLiteDatabase,
  empresa: Empresa
): Promise<void> {
  await db.runAsync(
    "UPDATE empresa SET nome = ?, latitude = ?, longitude = ? WHERE id = ?;",
    [empresa.nome, empresa.latitude, empresa.longitude, empresa.id]
  );
}

export async function excluirEmpresa(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM empresa WHERE id = ?;", [id]);
}
