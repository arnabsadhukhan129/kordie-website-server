const Redis = require("redis");
const chalk = require("chalk");

const { envs } = require("../lib");
const redisConfig = {};
if (envs.isSecureRedis()) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}
let client = {};
if (envs.isRedisEnable()) {
  client = Redis.createClient(redisConfig);

  // hooks to check the connections
  client.on("connect", function () {
    console.log("Redis Service Connected.");
  });
  client.on("error", function (err) {
    console.log("Redis client error when connecting to the redis server.", err);
  });
  (async () => {
    await client.connect();
    if (envs.useRedisSearch()) {
      console.log("Redis search is enabled. Working on it.");
      client.ft
        .info("idx:pss")
        .then(async (indexInfo) => {
          if (!indexInfo) {
            await client.ft.create(
              `idx:pss`,
              {
                "$.signature": {
                  type: Redis.SchemaFieldTypes.TEXT,
                  AS: "signature",
                },
              },
              {
                ON: "JSON",
                PREFIX: "PSS:",
              }
            );
          }
          console.log("Redis search defined and open for buisiness.");
        })
        .catch(async (e) => {
          await client.ft.create(
            `idx:pss`,
            {
              "$.signature": {
                type: Redis.SchemaFieldTypes.TEXT,
                AS: "signature",
              },
            },
            {
              ON: "JSON",
              PREFIX: "PSS:",
            }
          );
          console.log("Redis search indexing error: ", e);
        });
    }
  })()
    .then(() => {
      console.log(chalk.greenBright("Redis Setup Completed"));
    })
    .catch((e) => {
      console.log(e);
    });
}
module.exports = client;
