import { validateField } from "@/utils/validateField";
import { Response } from "express";

describe("validateField", () => {
  let res: Response;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = { status: statusMock } as unknown as Response;
  });

  it("should return false if fieldValue is missing", () => {
    const result = validateField(undefined, () => true, "email", res);
    expect(result).toBe(false);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      kind: "content_missing",
      content: "email",
    });
  });

  it("should return false if fieldValue is invalid", () => {
    const result = validateField("invalid", () => false, "email", res);
    expect(result).toBe(false);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      kind: "content_invalid",
      content: "email",
    });
  });

  it("should return true if fieldValue is valid", () => {
    const result = validateField("valid@mail.com", () => true, "email", res);
    expect(result).toBe(true);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it("should use custom error messages if provided", () => {
    const result = validateField(
      undefined,
      () => false,
      "email",
      res,
      "missing_email",
      "invalid_email"
    );

    expect(result).toBe(false);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      kind: "missing_email",
      content: "email",
    });
  });
});
