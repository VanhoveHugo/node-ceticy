describe("friendService (MySQL)", () => {
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

  describe("friendServiceGetAll", () => {
    it("should return list of friends", async () => {
      const mockFriends = [{ id: 1, email: "friend@mail.com" }];
      queryMock.mockResolvedValueOnce([mockFriends]);

      const { friendServiceGetAll } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceGetAll(1);
      expect(result).toEqual(mockFriends);
      expect(queryMock).toHaveBeenCalledWith(
        `SELECT u.id, u.email FROM friends f JOIN users u ON (f.user1Id = u.id AND f.user2Id = ?) OR (f.user2Id = u.id AND f.user1Id = ?) WHERE f.status = 'accept';`,
        [1, 1]
      );
    });

    it("should return undefined on error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { friendServiceGetAll } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceGetAll(1);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("friendServiceCreate", () => {
    it("should insert friend and return result", async () => {
      const mockResult = [{ insertId: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { friendServiceCreate } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceCreate(1, 2);
      expect(result).toEqual(mockResult[0]);
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO friends (user1Id, user2Id) VALUES (?, ?)",
        [1, 2]
      );
    });

    it("should return null if result is empty", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { friendServiceCreate } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceCreate(1, 2);
      expect(result).toBeNull();
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { friendServiceCreate } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceCreate(1, 2);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("friendServiceFindByIds", () => {
    it("should return friendship", async () => {
      const mockResult = [{ id: 1, user1Id: 1, user2Id: 2 }];
      queryMock.mockResolvedValueOnce([mockResult]);

      const { friendServiceFindByIds } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceFindByIds(1, 2);
      expect(result).toEqual(mockResult);
    });

    it("should return null if empty", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { friendServiceFindByIds } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceFindByIds(1, 2);
      expect(result).toBeNull();
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { friendServiceFindByIds } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceFindByIds(1, 2);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("friendServiceHandleStatus", () => {
    it("should update status and return result", async () => {
      const mockResult = [{ affectedRows: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { friendServiceHandleStatus } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceHandleStatus(10, "accept");
      expect(result).toEqual(mockResult[0]);
      expect(queryMock).toHaveBeenCalledWith(
        "UPDATE friends SET status = ? WHERE id = ?",
        ["accept", 10]
      );
    });

    it("should return null if empty", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { friendServiceHandleStatus } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceHandleStatus(10, "accept");
      expect(result).toBeNull();
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { friendServiceHandleStatus } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceHandleStatus(10, "accept");
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("friendServiceGetCount", () => {
    it("should return count of friends", async () => {
      queryMock.mockResolvedValueOnce([[{ count: 5 }]]);

      const { friendServiceGetCount } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceGetCount(1);
      expect(result).toBe(5);
      expect(queryMock).toHaveBeenCalledWith(
        `SELECT COUNT(*) as count FROM friends WHERE (user1Id = ? OR user2Id = ?) AND status = 'accept'`,
        [1, 1]
      );
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { friendServiceGetCount } = await import(
        "@/services/friendService"
      );

      const result = await friendServiceGetCount(1);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
