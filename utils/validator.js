export const validatePhoneNumber = (number) => {
  return /^\d+$/.test(number);
};

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const isDateOverlapping = (startDateA, endDateA, startDateB, endDateB) =>
  startDateA <= endDateB && endDateA >= startDateB;

/**
 * Check if the current date is within the review period
 * @param {Object} period - Registration period object with endDate and reviewDeadline
 * @returns {boolean} - True if current date is within review period
 */
export const isWithinReviewPeriod = (period) => {
  if (!period || !period.endDate || !period.reviewDeadline) {
    return false;
  }

  const today = new Date();
  const endDate = new Date(period.endDate);
  const reviewDeadline = new Date(period.reviewDeadline);

  // Set time to end of day for endDate and reviewDeadline
  endDate.setHours(23, 59, 59, 999);
  reviewDeadline.setHours(23, 59, 59, 999);

  return today >= endDate && today <= reviewDeadline;
};
