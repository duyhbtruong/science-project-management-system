export const validatePhoneNumber = (number) => {
  return /^\d+$/.test(number);
};

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};
