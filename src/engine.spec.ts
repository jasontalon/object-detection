import Engine from "./engine";
describe("test engine", () => {
  it("should test detection", async () => {
    const { detectedObject } = await new Engine()
      .setModel("mobilenet_v2")
      .loadModel()
      .then(i =>
        i.predict(
          "https://d2v9ipibika81v.cloudfront.net/uploads/sites/91/Group-photos-with-S-and-Ivanka_1.jpg"
        )
      );
    expect(detectedObject.length).toBeGreaterThan(0);
  }, 60000);
});
