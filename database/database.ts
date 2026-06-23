import { SQLiteDatabase } from "expo-sqlite";

export async function inicializarBanco(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS empresa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ponto (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nomeFuncionario TEXT NOT NULL,
      foto BLOB NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      dataHora TEXT NOT NULL,
      distanciaMetros REAL NOT NULL,
      validado INTEGER NOT NULL,
      empresaId INTEGER NOT NULL,
      FOREIGN KEY (empresaId) REFERENCES empresa (id)
    );
  `);
}
