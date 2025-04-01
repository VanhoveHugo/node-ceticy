describe("photoService (MySQL)", () => {
  let queryMock: jest.Mock;
  let promiseMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    queryMock = jest.fn();
    promiseMock = jest.fn(() => ({ query: queryMock }));

    jest.doMock("@/utils/connectionDatabase", () => ({
      connection: { promise: promiseMock },
    }));
  });

  describe("photoServiceCreate", () => {
    it("should insert photo and return insertId", async () => {
      queryMock.mockResolvedValueOnce([{ insertId: 10 }]);

      const { photoServiceCreate } = await import(
        "@/services/photoService"
      );

      const result = await photoServiceCreate(1, "https://url.com/photo.jpg");
      expect(result).toBe(10);
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO photos (restaurantId, url) VALUES (?, ?)",
        [1, "https://url.com/photo.jpg"]
      );
    });

    it("should return undefined if connection is null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { photoServiceCreate } = await import(
        "@/services/photoService"
      );

      const result = await photoServiceCreate(1, "url");
      expect(result).toBeUndefined();
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("DB error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { photoServiceCreate } = await import(
        "@/services/photoService"
      );

      const result = await photoServiceCreate(1, "url");
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during photo creation:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("photoServiceGetByRestaurantId", () => {
    it("should return list of photos", async () => {
      const mockPhotos = [
        { id: 1, url: "https://img1.jpg" },
        { id: 2, url: "https://img2.jpg" },
      ];
      queryMock.mockResolvedValueOnce([mockPhotos]);

      const { photoServiceGetByRestaurantId } = await import(
        "@/services/photoService"
      );

      const result = await photoServiceGetByRestaurantId(1);
      expect(result).toEqual(mockPhotos);
      expect(queryMock).toHaveBeenCalledWith(
        "SELECT id, url FROM photos WHERE restaurantId = ?",
        [1]
      );
    });

    it("should return undefined if connection is null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { photoServiceGetByRestaurantId } = await import(
        "@/services/photoService"
      );

      const result = await photoServiceGetByRestaurantId(1);
      expect(result).toBeUndefined();
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { photoServiceGetByRestaurantId } = await import(
        "@/services/photoService"
      );

      const result = await photoServiceGetByRestaurantId(1);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during photo creation:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
