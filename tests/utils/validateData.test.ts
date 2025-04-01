import {
  validateEmail,
  validatePassword,
  validateName,
  validateNumber,
} from "@/utils/validateData";

describe("validators", () => {

  describe("validateEmail", () => {
    it("should return true for valid email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should return false if password is empty", () => {
      expect(validatePassword("")).toBe(false);
    });

    it("should return false if missing uppercase", () => {
      expect(validatePassword("password1")).toBe(false);
    });

    it("should return false if missing lowercase", () => {
      expect(validatePassword("PASSWORD1")).toBe(false);
    });

    it("should return false if missing number", () => {
      expect(validatePassword("Password")).toBe(false);
    });

    it("should return false if too short", () => {
      expect(validatePassword("Pa1")).toBe(false);
    });

    it("should return true for strong password", () => {
      expect(validatePassword("Password1")).toBe(true);
    });
  });

  describe("validateName", () => {
    it("should return true if name <= 191 chars", () => {
      expect(validateName("a".repeat(191))).toBe(true);
    });

    it("should return false if name > 191 chars", () => {
      expect(validateName("a".repeat(192))).toBe(false);
    });
  });

  describe("validateNumber", () => {
    it("should return true for valid number string", () => {
      expect(validateNumber("123")).toBe(true);
    });

    it("should return false for non-numeric string", () => {
      expect(validateNumber("abc")).toBe(false);
    });

    it("should return true for float", () => {
      expect(validateNumber("3.14")).toBe(true);
    });

    it("should return false for empty string", () => {
      expect(validateNumber("")).toBe(false);
    });
  });
});
