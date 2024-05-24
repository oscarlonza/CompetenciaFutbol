import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "26.140.47.217",
  port: 3306,
  user: "root",
  password: "faztpassword",
  database: "CompetenciaFutbol",
});
