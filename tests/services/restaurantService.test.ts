describe("restaurantService (MySQL)", () => {
  let queryMock: jest.Mock;
  let promiseMock: jest.Mock;
  let photoServiceMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    queryMock = jest.fn();
    promiseMock = jest.fn(() => ({ query: queryMock }));
    photoServiceMock = jest.fn().mockResolvedValue([]);

    jest.doMock("@/utils/connectionDatabase", () => ({
      connection: { promise: promiseMock },
    }));

    jest.doMock("@/services/photoService", () => ({
      photoServiceGetByRestaurantId: photoServiceMock,
    }));
  });

  describe("restaurantServiceCreate", () => {
    it("should insert and return insertId", async () => {
      queryMock.mockResolvedValueOnce([{ insertId: 123 }]);

      const { restaurantServiceCreate } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceCreate("Pizza", 1);
      expect(result).toBe(123);
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO restaurants (name, ownerId, description, averagePrice, averageService, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)",
        ["Pizza", 1, undefined, undefined, undefined, undefined]
      );
    });

    it("should return undefined on connection null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { restaurantServiceCreate } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceCreate("Pasta", 2);
      expect(result).toBeNull();
    });
  });

  describe("restaurantServiceGetList", () => {
    it("should return restaurants with photos", async () => {
      const mockRestaurants = [{ id: 1, name: "Mock Resto" }];
      queryMock.mockResolvedValueOnce([mockRestaurants]);

      const { restaurantServiceGetList } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetList(5);
      expect(result).toEqual([{ ...mockRestaurants[0], photos: [] }]);
      expect(queryMock).toHaveBeenCalled();
      expect(photoServiceMock).toHaveBeenCalledWith(1);
    });

    it("should return [] if no result", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { restaurantServiceGetList } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetList(3);
      expect(result).toEqual([]);
    });
  });

  describe("restaurantServiceGetByManagerId", () => {
    it("should return managed restaurants with photos", async () => {
      const mockData = [{ id: 10, name: "Chez Moi" }];
      queryMock.mockResolvedValueOnce([mockData]);

      const { restaurantServiceGetByManagerId } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetByManagerId(8);
      expect(result).toEqual([{ ...mockData[0], photos: [] }]);
    });

    it("should return [] if none found", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { restaurantServiceGetByManagerId } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetByManagerId(999);
      expect(result).toEqual([]);
    });
  });

  describe("restaurantServiceHandleSwipe", () => {
    it("should insert swipe and return true", async () => {
      queryMock.mockResolvedValueOnce([]);

      const { restaurantServiceHandleSwipe } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceHandleSwipe(10, 20, true);
      expect(result).toBe(true);
    });

    it("should return false on query error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { restaurantServiceHandleSwipe } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceHandleSwipe(1, 2, false);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during swipe:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("restaurantServiceGetCount", () => {
    it("should return liked count", async () => {
      queryMock.mockResolvedValueOnce([[{ count: 7 }]]);

      const { restaurantServiceGetCount } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetCount(10);
      expect(result).toBe(7);
    });
  });

  describe("restaurantServiceGetLike", () => {
    it("should return liked restaurants with photos", async () => {
      const mockSwipes = [{ restaurantId: 1, name: "Resto Liked" }];
      queryMock.mockResolvedValueOnce([mockSwipes]);

      const { restaurantServiceGetLike } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetLike(10);
      expect(result).toEqual([{ ...mockSwipes[0], photos: [] }]);
    });
  });

  describe("restaurantServiceGetById", () => {
    it("should return restaurant by id with photos", async () => {
      const mockRestaurant = [{ id: 1, name: "Solo Resto" }];
      queryMock.mockResolvedValueOnce([mockRestaurant]);

      const { restaurantServiceGetById } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetById(1);
      expect(result).toEqual({ ...mockRestaurant[0], photos: [] });
    });

    it("should return null if restaurant not found", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { restaurantServiceGetById } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceGetById(999);
      expect(result).toBeNull();
    });
  });
  describe("restaurantServiceUpdate", () => {
    it("should update restaurant and return updated result", async () => {
      queryMock
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // update query
        .mockResolvedValueOnce([[{ id: 5, name: "Updated" }]]); // getById

      const { restaurantServiceUpdate } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceUpdate(5, { name: "Updated" }, 1);
      expect(result).toEqual({ id: 5, name: "Updated", photos: [] });
      expect(queryMock).toHaveBeenCalledTimes(2);
    });

    it("should return null if update affects 0 rows", async () => {
      queryMock.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const { restaurantServiceUpdate } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceUpdate(10, { name: "Nope" }, 2);
      expect(result).toBeNull();
    });

    it("should return null if no update fields provided", async () => {
      const { restaurantServiceUpdate } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceUpdate(1, {}, 1);
      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { restaurantServiceUpdate } = await import(
        "@/services/restaurantService"
      );

      const result = await restaurantServiceUpdate(1, { name: "Fail" }, 1);
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating restaurant:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
