describe("managerService (MySQL)", () => {
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

  describe("managerServiceCreate", () => {
    it("should insert manager and return insertId", async () => {
      queryMock.mockResolvedValueOnce([{ insertId: 123 }]);

      const { managerServiceCreate } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceCreate("manager@mail.com", "pass");
      expect(result).toBe(123);
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO managers (email, password) VALUES (?, ?)",
        ["manager@mail.com", "pass"]
      );
    });

    it("should return undefined if connection is null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { managerServiceCreate } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceCreate("email", "pass");
      expect(result).toBeUndefined();
    });

    it("should handle query error", async () => {
      queryMock.mockRejectedValueOnce(new Error("DB error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { managerServiceCreate } = await import(
        "@/services/managerService"
      );

      await managerServiceCreate("email", "pass");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during manager registration:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("managerServiceFindByEmail", () => {
    it("should return manager if found", async () => {
      const mockManager = [{ id: 1, email: "m@mail.com", password: "hash" }];
      queryMock.mockResolvedValueOnce([mockManager]);

      const { managerServiceFindByEmail } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceFindByEmail("m@mail.com");
      expect(result).toEqual(mockManager);
      expect(queryMock).toHaveBeenCalledWith(
        "SELECT id, email, password FROM managers WHERE email = ? LIMIT 1",
        ["m@mail.com"]
      );
    });

    it("should return null if no match", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { managerServiceFindByEmail } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceFindByEmail("unknown@mail.com");
      expect(result).toBeNull();
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { managerServiceFindByEmail } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceFindByEmail("email");
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during manager registration:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("managerServiceFindById", () => {
    it("should return manager by ID", async () => {
      const mockManager = [{ id: 2, email: "id@mail.com", password: "hash" }];
      queryMock.mockResolvedValueOnce([mockManager]);

      const { managerServiceFindById } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceFindById(2);
      expect(result).toEqual(mockManager);
      expect(queryMock).toHaveBeenCalledWith(
        "SELECT * FROM managers WHERE id = ?",
        [2]
      );
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { managerServiceFindById } = await import(
        "@/services/managerService"
      );

      const result = await managerServiceFindById(2);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error during manager registration:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
