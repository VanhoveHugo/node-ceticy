import { Response } from "express";

const validateField = (
  fieldValue: unknown,
  validatorFn: (value: any) => boolean,
  fieldName: string,
  res: Response,
  missingMessage = "content_missing",
  invalidMessage = "content_invalid"
) => {
  if (!fieldValue) {
    res.status(400).json({ kind: missingMessage, content: fieldName });
    return false;
  }

  if (validatorFn && !validatorFn(fieldValue)) {
    res.status(400).json({ kind: invalidMessage, content: fieldName });
    return false;
  }

  return true;
};

export { validateField };
