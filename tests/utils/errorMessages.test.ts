import { ERROR_MESSAGES } from "@/utils/errorMessages";

describe("ERROR_MESSAGES", () => {
  const field = "email";

  it("should return content_missing error", () => {
    expect(ERROR_MESSAGES.contentMissing(field)).toEqual({
      kind: "content_missing",
      content: field,
    });
  });

  it("should return content_invalid error", () => {
    expect(ERROR_MESSAGES.contentInvalid(field)).toEqual({
      kind: "content_invalid",
      content: field,
    });
  });

  it("should return content_duplicate error", () => {
    expect(ERROR_MESSAGES.contentDuplicate(field)).toEqual({
      kind: "content_duplicate",
      content: field,
    });
  });

  it("should return invalid_credentials error", () => {
    expect(ERROR_MESSAGES.invalidCredentials(field)).toEqual({
      kind: "invalid_credentials",
      content: field,
    });
  });

  it("should return access_denied error", () => {
    expect(ERROR_MESSAGES.accessDenied(field)).toEqual({
      kind: "access_denied",
      content: field,
    });
  });

  it("should return content_limit error", () => {
    expect(ERROR_MESSAGES.contentLimit(field)).toEqual({
      kind: "content_limit",
      content: field,
    });
  });

  it("should return server_error error", () => {
    expect(ERROR_MESSAGES.serverError(field)).toEqual({
      kind: "server_error",
      content: field,
    });
  });

  it("should return not_implemented error", () => {
    expect(ERROR_MESSAGES.notImplemented).toEqual({
      kind: "not_implemented",
      content: "feature",
    });
  });
});
