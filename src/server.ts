import express from "express";
import { log } from "console";
import Engine from "./engine";
import bodyParser from "body-parser";

+(async function() {
  const app = express(),
    { PORT = 8080 } = process.env;

  app.use(express.json());
  app.use(bodyParser.json());
  app.set("json spaces", 2);

  const engine = await new Engine()
    .loadModel("mobilenet_v2");

  app.post("/predict", async function(req, res) {
    const { imageUrl } = req.body,
      { detectedObject } = await engine.predict(imageUrl);

    res.send(detectedObject);
  });

  app.listen(PORT, () => {
    log(`listens to port ${PORT}`);
  });
})();
