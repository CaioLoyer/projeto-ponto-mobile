import { SQLiteDatabase } from "expo-sqlite";
import { NovoPonto, Ponto } from "../types/ponto";

export async function listarPontos(db: SQLiteDatabase): Promise<Ponto[]> {
  const resultado = await db.getAllAsync<Ponto>(
    "SELECT * FROM ponto ORDER BY id DESC;"
  );
  return resultado;
}

export async function buscarPontoPorId(
  db: SQLiteDatabase,
  id: number
): Promise<Ponto | null> {
  const resultado = await db.getFirstAsync<Ponto>(
    "SELECT * FROM ponto WHERE id = ?;",
    [id]
  );
  return resultado ?? null;
}

export async function inserirPonto(
  db: SQLiteDatabase,
  ponto: NovoPonto
): Promise<void> {
  await db.runAsync(
    `INSERT INTO ponto
      (nomeFuncionario, foto, latitude, longitude, dataHora, distanciaMetros, validado, empresaId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      ponto.nomeFuncionario,
      ponto.foto,
      ponto.latitude,
      ponto.longitude,
      ponto.dataHora,
      ponto.distanciaMetros,
      ponto.validado ? 1 : 0,
      ponto.empresaId,
    ]
  );
}

export async function atualizarPonto(
  db: SQLiteDatabase,
  ponto: Ponto
): Promise<void> {
  await db.runAsync(
    `UPDATE ponto SET
      nomeFuncionario = ?,
      foto = ?,
      latitude = ?,
      longitude = ?,
      dataHora = ?,
      distanciaMetros = ?,
      validado = ?,
      empresaId = ?
     WHERE id = ?;`,
    [
      ponto.nomeFuncionario,
      ponto.foto,
      ponto.latitude,
      ponto.longitude,
      ponto.dataHora,
      ponto.distanciaMetros,
      ponto.validado,
      ponto.empresaId,
      ponto.id,
    ]
  );
}

export async function excluirPonto(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM ponto WHERE id = ?;", [id]);
}
