/**
 * Formats a date string into a more readable format.
 * e.g., "2025-02-18T14:30:00.000Z" -> "February 18, 2025"
 *
 * @param {string} dateString - The ISO date string.
 * @returns {string} The formatted date.
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
