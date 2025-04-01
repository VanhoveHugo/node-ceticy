describe("pollService (MySQL)", () => {
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

  describe("pollServiceGetAll", () => {
    it("should return all polls", async () => {
      const mockPolls = [{ id: 1, name: "Test Poll" }];
      queryMock.mockResolvedValueOnce([mockPolls]);

      const { pollServiceGetAll } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceGetAll(1);
      expect(result).toEqual(mockPolls);
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { pollServiceGetAll } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceGetAll(1);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("pollServiceCreate", () => {
    it("should insert poll and return insertId", async () => {
      queryMock.mockResolvedValueOnce([{ insertId: 42 }]);

      const { pollServiceCreate } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceCreate("Lunch Poll", 1);
      expect(result).toBe(42);
    });

    it("should return null if result is empty", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { pollServiceCreate } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceCreate("Empty", 1);
      expect(result).toBeNull();
    });
  });

  describe("pollServiceUpdate", () => {
    it("should update poll and return result", async () => {
      const mockResult = [{ affectedRows: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceUpdate } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceUpdate(1, "Updated Name", 2);
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe("pollServiceDelete", () => {
    it("should delete poll and return result", async () => {
      const mockResult = [{ affectedRows: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceDelete } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceDelete(1, 1);
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe("pollServiceCount", () => {
    it("should return poll count", async () => {
      queryMock.mockResolvedValueOnce([[{ count: 5 }]]);

      const { pollServiceCount } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceCount(1);
      expect(result).toBe(5);
    });
  });

  describe("pollServiceCheckIsCreator", () => {
    it("should return poll if user is creator", async () => {
      const mockResult = [{ id: 1 }];
      queryMock.mockResolvedValueOnce([mockResult]);

      const { pollServiceCheckIsCreator } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceCheckIsCreator(1, 2);
      expect(result).toEqual(mockResult);
    });

    it("should return null if no match", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { pollServiceCheckIsCreator } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceCheckIsCreator(1, 2);
      expect(result).toBeNull();
    });
  });

  describe("pollServiceCheckIsValidParticipant", () => {
    it("should return user if valid", async () => {
      const mockUser = [{ id: 1 }];
      queryMock.mockResolvedValueOnce([mockUser]);

      const { pollServiceCheckIsValidParticipant } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceCheckIsValidParticipant(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe("pollServiceParticipantAdd", () => {
    it("should add participant and return result", async () => {
      const mockResult = [{ insertId: 10 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceParticipantAdd } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceParticipantAdd(1, 2);
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe("pollServiceRestaurantsAdd", () => {
    it("should add restaurant and return result", async () => {
      const mockResult = [{ insertId: 100 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceRestaurantsAdd } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceRestaurantsAdd(1, 3);
      expect(result).toEqual(mockResult[0]);
    });
  });

  describe("pollServiceParticipantRemove", () => {
    it("should remove participant and return result", async () => {
      const mockResult = [{ affectedRows: 1 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceParticipantRemove } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceParticipantRemove(1, 2);
      expect(result).toEqual(mockResult[0]);
    });

    it("should return null if no participant deleted", async () => {
      const mockResult = [{ affectedRows: 0 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceParticipantRemove } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceParticipantRemove(1, 2);
      expect(result).toBeNull();
    });
  });

  describe("pollServiceVoteAdd", () => {
    it("should insert vote and return result", async () => {
      const mockResult = [{ insertId: 5 }];
      queryMock.mockResolvedValueOnce(mockResult);

      const { pollServiceVoteAdd } = await import(
        "@/services/pollService"
      );

      const result = await pollServiceVoteAdd(1, 2, 3, true);
      expect(result).toEqual(mockResult[0]);
    });
  });

  it("should handle error", async () => {
    queryMock.mockRejectedValueOnce(new Error("fail"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { pollServiceCreate } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceCreate("Poll", 1);
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should return null if no row is updated", async () => {
    queryMock.mockResolvedValueOnce([[]]);

    const { pollServiceUpdate } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceUpdate(1, "Fail Update", 1);
    expect(result).toBeNull();
  });

  it("should return null if no row is deleted", async () => {
    queryMock.mockResolvedValueOnce([[]]);

    const { pollServiceDelete } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceDelete(999, 999);
    expect(result).toBeNull();
  });

  it("should return null if insert fails", async () => {
    queryMock.mockResolvedValueOnce([[]]);

    const { pollServiceRestaurantsAdd } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceRestaurantsAdd(1, 3);
    expect(result).toBeNull();
  });

  it("should handle error", async () => {
    queryMock.mockRejectedValueOnce(new Error("fail"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { pollServiceRestaurantsAdd } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceRestaurantsAdd(1, 3);
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should return null if insert fails", async () => {
    queryMock.mockResolvedValueOnce([[]]);

    const { pollServiceVoteAdd } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceVoteAdd(1, 2, 3, true);
    expect(result).toBeNull();
  });

  it("should handle error", async () => {
    queryMock.mockRejectedValueOnce(new Error("fail"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { pollServiceVoteAdd } = await import(
      "@/services/pollService"
    );

    const result = await pollServiceVoteAdd(1, 2, 3, false);
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
