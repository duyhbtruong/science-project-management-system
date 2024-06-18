export const validatePhoneNumber = (number) => {
  return /^\d+$/.test(number);
};
