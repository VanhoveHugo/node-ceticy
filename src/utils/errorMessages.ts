export const ERROR_MESSAGES = {
  contentMissing: (field: string) => ({
    kind: "content_missing",
    content: field,
  }),
  contentInvalid: (field: string) => ({
    kind: "content_invalid",
    content: field,
  }),
  contentDuplicate: (field: string) => ({
    kind: "content_duplicate",
    content: field,
  }),
  invalidCredentials: (field: string) => ({
    kind: "invalid_credentials",
    content: field,
  }),
  accessDenied: (field: string) => ({
    kind: "access_denied",
    content: field,
  }),
  serverError: (field: string) => ({ kind: "server_error", content: field }),
};
