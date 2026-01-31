
const isGmail = (email) => {
  if (typeof email !== "string") return false;
  return /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim());
};

const isStaffID = (id) => {
  if (typeof id !== "string") return false;
  return /^\d{7}$/.test(id.trim());
};

module.exports = { isGmail, isStaffID };