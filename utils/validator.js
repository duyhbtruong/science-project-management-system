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

  endDate.setHours(23, 59, 59, 999);
  reviewDeadline.setHours(23, 59, 59, 999);

  return today >= endDate && today <= reviewDeadline;
};

/**
 * Check if the current date is within the appraisal period
 * @param {Object} period - Registration period object with submitDeadline and appraiseDeadline
 * @returns {boolean} - True if current date is within appraisal period
 */
export const isWithinAppraisalPeriod = (period) => {
  if (!period || !period.submitDeadline || !period.appraiseDeadline) {
    return false;
  }

  const today = new Date();
  const submitDeadline = new Date(period.submitDeadline);
  const appraiseDeadline = new Date(period.appraiseDeadline);

  submitDeadline.setHours(23, 59, 59, 999);
  appraiseDeadline.setHours(23, 59, 59, 999);

  return today >= submitDeadline && today <= appraiseDeadline;
};

/**
 * Check if the current date is after the review deadline
 * @param {Object} period - Registration period object with reviewDeadline
 * @returns {boolean} - True if current date is after review deadline
 */
export const isAfterReviewDeadline = (period) => {
  if (!period || !period.reviewDeadline) {
    return false;
  }

  const today = new Date();
  const reviewDeadline = new Date(period.reviewDeadline);

  reviewDeadline.setHours(23, 59, 59, 999);

  return today > reviewDeadline;
};
