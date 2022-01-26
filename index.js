const PORT = 19777;

const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const { faker } = require("@faker-js/faker");

const server = https.createServer(
  {
    key: fs.readFileSync("./edr-bypass.private.key", "utf8"),
    cert: fs.readFileSync("./edr-bypass.crt", "utf8"),
  },
  app
);

app.use(cors());
app.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const fakeResponse = {
    ret: 0,
    data: {
      dlp: true,
      mac_address: faker.internet.mac(),
      device_id: faker.datatype.uuid(),
      ip: faker.internet.ip(),
      spend_time: 0,
      is_install_soft: true,
    },
  };
  console.log("Response: ", fakeResponse);
  res.send(fakeResponse);
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}, with response:`);
});
