describe("customerService (MySQL)", () => {
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

  describe("customerServiceCreate", () => {
    it("should insert user and return insertId", async () => {
      queryMock.mockResolvedValueOnce([{ insertId: 1 }]);

      const { customerServiceCreate } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceCreate("test@mail.com", "pass");
      expect(result).toBe(1);
      expect(queryMock).toHaveBeenCalledWith(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        ["test@mail.com", "pass"]
      );
    });

    it("should return undefined if connection is null", async () => {
      jest.doMock("@/utils/connectionDatabase", () => ({
        connection: null,
      }));

      const { customerServiceCreate } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceCreate("a", "b");
      expect(result).toBeUndefined();
    });

    it("should handle query error", async () => {
      queryMock.mockRejectedValueOnce(new Error("fail"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { customerServiceCreate } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceCreate("x", "y");
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("customerServiceFindByEmail", () => {
    it("should return null if no result", async () => {
      queryMock.mockResolvedValueOnce([[]]);

      const { customerServiceFindByEmail } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceFindByEmail("none@mail.com");
      expect(result).toBeNull();
    });

    it("should return user if found", async () => {
      const mockUser = [
        { id: 1, name: "Test", email: "t@mail.com", password: "hash" },
      ];
      queryMock.mockResolvedValueOnce([mockUser]);

      const { customerServiceFindByEmail } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceFindByEmail("t@mail.com");
      expect(result).toEqual(mockUser);
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("err"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { customerServiceFindByEmail } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceFindByEmail("fail@mail.com");
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("customerServiceFindById", () => {
    it("should return user result", async () => {
      const mockResult = [{ id: 2, name: "User" }];
      queryMock.mockResolvedValueOnce([mockResult]);

      const { customerServiceFindById } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceFindById(2);
      expect(result).toEqual(mockResult);
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { customerServiceFindById } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceFindById(2);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("customerServiceDelete", () => {
    it("should delete and return result", async () => {
      const mockResult = { affectedRows: 1 };
      queryMock.mockResolvedValueOnce([mockResult]);

      const { customerServiceDelete } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceDelete(3);
      expect(result).toEqual(mockResult);
    });

    it("should handle error", async () => {
      queryMock.mockRejectedValueOnce(new Error("oops"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const { customerServiceDelete } = await import(
        "@/services/customerService"
      );

      const result = await customerServiceDelete(3);
      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
