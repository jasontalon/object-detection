import express from "express";
import { log } from "console";
import Engine from "./engine";

+(async function() {
  const app = express(),
    { PORT = 8080 } = process.env;

  app.use(express.json({ limit: "10mb" }));

  app.set("json spaces", 2);

  const engine = await new Engine().loadModel("mobilenet_v2");

  app.post("/predict", async function(req, res) {
    try {
      const { url, base64 } = req.body,
        { detectedObject } = await engine.predict(url ?? base64);

      res.send(detectedObject);
    } catch ({ message, stack }) {
      res.status(500).send(message ?? stack ?? "");
    }
  });

  app.listen(PORT, () => {
    log(`listens to port ${PORT}`);
  });
})();
