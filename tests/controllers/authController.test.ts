import {
  authRegister,
  authLogin,
  authAccount,
  authDelete,
} from "@/controllers/authController";
import * as services from "@/services/customerService";
import * as managerServices from "@/services/managerService";
import * as friendService from "@/services/friendService";
import * as restaurantService from "@/services/restaurantService";
import * as validate from "@/utils/validateField";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

jest.mock("argon2");
jest.mock("jsonwebtoken");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
  });

  describe("authRegister", () => {
    it("should return 400 if invalid field", async () => {
      jest.spyOn(validate, "validateField").mockReturnValueOnce(false);
      const res = mockRes();
      await authRegister({ body: {} } as any, res);
      expect(res.status).not.toHaveBeenCalledWith(201);
    });

    it("should return 400 if scope is invalid", async () => {
      const res = mockRes();
      await authRegister(
        {
          body: { email: "x", password: "x", name: "x", scope: "invalid" },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 409 if email already exists", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValueOnce(["exists"]);

      const res = mockRes();
      await authRegister(
        {
          body: { email: "x", password: "x", name: "x", scope: "user" },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("should return 500 if hash fails", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValueOnce(null);
      (argon2.hash as jest.Mock).mockResolvedValue(null);

      const res = mockRes();
      await authRegister(
        {
          body: { email: "x", password: "x", name: "x", scope: "user" },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 500 if user creation fails", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue("hashed");
      jest
        .spyOn(services, "customerServiceCreate")
        .mockResolvedValue(undefined);

      const res = mockRes();
      await authRegister(
        {
          body: { email: "x", password: "x", name: "x", scope: "user" },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 201 on success for user", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue("hashed");
      jest.spyOn(services, "customerServiceCreate").mockResolvedValue(1);

      const res = mockRes();
      await authRegister(
        {
          body: { email: "x", password: "x", name: "x", scope: "user" },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 201 on success for manager", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(managerServices, "managerServiceFindByEmail")
        .mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue("hashed");
      jest.spyOn(managerServices, "managerServiceCreate").mockResolvedValue(1);

      const res = mockRes();
      await authRegister(
        {
          body: { email: "x", password: "x", name: "x", scope: "manager" },
        } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("authLogin", () => {
    it("should return 401 if password is invalid", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValue([{ password: "hash" }]);
      (argon2.verify as jest.Mock).mockResolvedValue(false);
      const res = mockRes();
      await authLogin(
        { body: { email: "x", password: "wrong", scope: "user" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 500 if missing JWT secret", async () => {
      delete process.env.JWT_SECRET;
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValue([{ password: "hash", id: 1, email: "x" }]);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      const res = mockRes();
      await authLogin(
        { body: { email: "x", password: "x", scope: "user" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should return 200 and token for user", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValue([{ password: "hash", id: 1, email: "x" }]);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");
      const res = mockRes();
      await authLogin(
        { body: { email: "x", password: "x", scope: "user" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should return 200 and token for manager", async () => {
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(managerServices, "managerServiceFindByEmail")
        .mockResolvedValue([{ password: "hash", id: 1, email: "x" }]);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");
      const res = mockRes();
      await authLogin(
        { body: { email: "x", password: "x", scope: "manager" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });
  });

  describe("authAccount", () => {
    it("should return 400 if no token", async () => {
      const res = mockRes();
      await authAccount({ headers: {} } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 200 with user info", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ email: "x", scope: "user" });
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(services, "customerServiceFindByEmail")
        .mockResolvedValue([{ id: 1, password: "123", email: "x" }]);
      jest.spyOn(friendService, "friendServiceGetCount").mockResolvedValue(5);
      jest
        .spyOn(restaurantService, "restaurantServiceGetCount")
        .mockResolvedValue(2);

      const res = mockRes();
      await authAccount(
        { headers: { authorization: "Bearer token" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: "user",
          currentFriendCount: 5,
          currentLikeCount: 2,
        })
      );
    });

    it("should return 200 with manager info", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({ email: "x", scope: "manager" });
      jest.spyOn(validate, "validateField").mockReturnValue(true);
      jest
        .spyOn(managerServices, "managerServiceFindByEmail")
        .mockResolvedValue([{ id: 1, password: "123", email: "x" }]);
      jest.spyOn(friendService, "friendServiceGetCount").mockResolvedValue(5);
      jest
        .spyOn(restaurantService, "restaurantServiceGetCount")
        .mockResolvedValue(2);

      const res = mockRes();
      await authAccount(
        { headers: { authorization: "Bearer token" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: "manager",
          currentFriendCount: 5,
          currentLikeCount: 2,
        })
      );
    });

    it("should return 500 if JWT secret is missing", async () => {
      delete process.env.JWT_SECRET;
      (jwt.verify as jest.Mock).mockReturnValue({ email: "x", scope: "user" });
      const res = mockRes();
      await authAccount(
        { headers: { authorization: "Bearer token" } } as any,
        res
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("authDelete", () => {
    it("should return 400 if no token", async () => {
      const res = mockRes();
      await authDelete({ headers: {}, body: {} } as any, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
