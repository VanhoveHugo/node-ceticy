const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  if(!password) return false;
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
};

export const validateName = (name: string): boolean => {
  return name.length <= 191;
}

export const validateNumber = (number: string): boolean => {
  if (!number.trim()) return false;
  return !isNaN(Number(number));
}