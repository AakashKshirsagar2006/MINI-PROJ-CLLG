// const isGmail = (email) => {
//   if (typeof email !== "string") return false;
//   return /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim());
// };
const isValidEmail = (email) => {
    if (typeof email !== "string") return false;
    //Universal Regex: now any emial is accepted
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };


const isStaffID = (id) => {
  if (typeof id !== "string") return false;
  // Matches "EMP" followed by 3 or more digits (e.g., EMP001, EMP012, EMP100)
  return /^EMP\d{3,}$/i.test(id.trim());
};

module.exports = { isValidEmail, isStaffID };