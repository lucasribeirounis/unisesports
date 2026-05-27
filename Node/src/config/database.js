import Database from 'better-sqlite3';

const db = new Database('esports.db', { verbose: console.log });

const initDb = () => {

    db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      name TEXT,
      school TEXT,
      grade TEXT,
      age INTEGER,
      email TEXT,
      nick TEXT,
      game TEXT,
      type TEXT,
      team_name TEXT,
      members TEXT,
      guardian TEXT,
      guardian_phone TEXT,
      created_at TEXT
    );
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS event_flow (
      id TEXT PRIMARY KEY,
      participant_id TEXT,
      status TEXT,
      location TEXT,
      updated_at TEXT,
      FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
    );
  `);

    db.exec(`
    CREATE TABLE IF NOT EXISTS brackets (
      id TEXT PRIMARY KEY,
      game TEXT UNIQUE,
      bracket_data TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);

    console.log('Banco de dados e tabelas inicializados com sucesso.');
};

initDb();

export default db;
