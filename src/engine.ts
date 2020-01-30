import * as tf from "@tensorflow/tfjs-node";
const atob = require("atob");
import {
  ModelConfig,
  ObjectDetectionBaseModel,
  ObjectDetection,
  DetectedObject
} from "@tensorflow-models/coco-ssd";

import Axios from "axios";

export default class Engine {
  private modelConfig: ModelConfig;
  private model: ObjectDetection | undefined;

  detectedObject: DetectedObject[] | undefined;

  constructor() {
    this.modelConfig = {
      base: "lite_mobilenet_v2" //default
    };
  }

  async loadModel(model: ObjectDetectionBaseModel): Promise<Engine> {
    this.modelConfig.base = model;
    this.model = new ObjectDetection(this.modelConfig.base!);
    await this.model.load();
    return this;
  }

  async predict(data: string): Promise<Engine> {
    const isUrl = data.includes("http");

    const tensor: any = tf.node.decodeImage(
      new Uint8Array(
        isUrl
          ? await (<any>this.getBase64Image(data))
          : this.convertBase64ToBinary(data)
      )
    );

    this.detectedObject = await this.model?.detect(tensor);
    return this;
  }

  async getBase64Image(url: string) {
    const { data } = await Axios.get(url, {
      responseType: "arraybuffer"
    });

    return data;
  }

  convertBase64ToBinary(base64: any) {
    var raw = atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}
