const PORT = 19777;

import express from "express";
import https from "https";
import cors from "cors";
import fs from "fs";
import { faker } from "@faker-js/faker";
import { exec } from "child_process";

const app = express();

const cert = fs.readFileSync("./edr-bypass.crt", "utf8");
const key = fs.readFileSync("./edr-bypass.private.key", "utf8");

const server = https.createServer(
  {
    key,
    cert,
  },
  app
);

exec(
  `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./edr-bypass.crt`,
  (error, stdout, stderr) => {
    if (error || stderr) {
      console.log(`error: ${error.message || stderr}`);
      console.log("You may need to add the cert as trusted yourself");
      console.log(
        "Url:",
        "https://github.com/marklai1998/edr-bypass/blob/main/edr-bypass.crt"
      );
    }

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
      console.log(`Listening on port: ${PORT}`);
    });
  }
);
