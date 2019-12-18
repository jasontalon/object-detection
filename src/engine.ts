import * as tf from "@tensorflow/tfjs-node";
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

  setModel(model: ObjectDetectionBaseModel): Engine {
    this.modelConfig.base = model;
    return this;
  }

  async loadModel(): Promise<Engine> {
    this.model = new ObjectDetection(this.modelConfig.base!);
    await this.model.load();
    return this;
  }

  async predict(imageUrl: string): Promise<Engine> {
    const { data : imageData } = await Axios.get(imageUrl, { responseType: "arraybuffer" });

    const tensor: any = tf.node.decodeImage(new Uint8Array(imageData));

    this.detectedObject = await this.model?.detect(tensor);
    return this;
  }
}
