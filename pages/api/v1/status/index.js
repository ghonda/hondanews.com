import database from "/infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("show server_version;");

  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;

  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
