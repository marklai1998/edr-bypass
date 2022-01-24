const PORT = 19777;

const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const fs = require("fs");
const { networkInterfaces } = require("os");

const nets = networkInterfaces();
const flattenedNets = Object.values(nets).flat();
const { address, mac } = flattenedNets.find(
  ({ family, internal }) => family === "IPv4" && !internal
);

const server = https.createServer(
  {
    key: fs.readFileSync("./edr-bypass.private.key", "utf8"),
    cert: fs.readFileSync("./edr-bypass.crt", "utf8"),
  },
  app
);

const fakeResponse = {
  ret: 0,
  data: {
    dlp: true,
    mac_address: mac,
    device_id: "ABC",
    ip: address,
    spend_time: 0,
    is_install_soft: true,
  },
};

app.use(cors());
app.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(fakeResponse);
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}, with response:`);
  console.log(fakeResponse);
});
