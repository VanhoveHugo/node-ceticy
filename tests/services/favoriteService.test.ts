describe("favoriteService (MySQL)", () => {
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

  describe("favoriteServiceCreate", () => {
    it("should insert favorite and return result", async () => {
      const mockResult = [{ insertId: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { favoriteServiceCreate } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceCreate(1, 100);
      expect(result).toEqual(mockResult[0]);
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO favorites (userId, restaurantId) VALUES (?, ?)",
        [1, 100]
      );
    });

    it("should return undefined if connection is null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { favoriteServiceCreate } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceCreate(1, 100);
      expect(result).toBeUndefined();
    });

    it("should handle query error", async () => {
      queryMock.mockRejectedValueOnce(new Error("DB error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { favoriteServiceCreate } = await import(
        "@/services/favoriteService"
      );

      await favoriteServiceCreate(1, 100);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("favoriteServiceDelete", () => {
    it("should delete favorite and return result", async () => {
      const mockResult = [{ affectedRows: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { favoriteServiceDelete } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceDelete(1, 100);
      expect(result).toEqual(mockResult[0]);
      expect(queryMock).toHaveBeenCalledWith(
        "DELETE FROM favorites WHERE userId = ? AND restaurantId = ?",
        [1, 100]
      );
    });

    it("should return undefined if connection is null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { favoriteServiceDelete } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceDelete(1, 100);
      expect(result).toBeUndefined();
    });

    it("should handle query error", async () => {
      queryMock.mockRejectedValueOnce(new Error("DB error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { favoriteServiceDelete } = await import(
        "@/services/favoriteService"
      );

      await favoriteServiceDelete(1, 100);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("favoriteServiceGet", () => {
    it("should return list of favorites", async () => {
      const mockFavorites = [{ id: 1, userId: 1, restaurantId: 100 }];
      queryMock.mockResolvedValueOnce([mockFavorites]);

      const { favoriteServiceGet } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceGet(1);
      expect(result).toEqual(mockFavorites);
      expect(queryMock).toHaveBeenCalledWith(
        "SELECT * FROM favorites WHERE userId = ?",
        [1]
      );
    });

    it("should return undefined on error", async () => {
      queryMock.mockRejectedValueOnce(new Error("error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { favoriteServiceGet } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceGet(1);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("favoriteServiceGetOne", () => {
    it("should return favorite entry", async () => {
      const mockFavorite = [{ id: 1, userId: 1, restaurantId: 100 }];
      queryMock.mockResolvedValueOnce([mockFavorite]);

      const { favoriteServiceGetOne } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceGetOne(1, 100);
      expect(result).toEqual(mockFavorite);
      expect(queryMock).toHaveBeenCalledWith(
        "SELECT * FROM favorites WHERE userId = ? AND restaurantId = ?",
        [1, 100]
      );
    });

    it("should return null if no result found", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { favoriteServiceGetOne } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceGetOne(1, 100);
      expect(result).toBeNull();
    });

    it("should handle query error", async () => {
      queryMock.mockRejectedValueOnce(new Error("DB error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { favoriteServiceGetOne } = await import(
        "@/services/favoriteService"
      );

      const result = await favoriteServiceGetOne(1, 100);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
