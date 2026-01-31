

function isInvalidEmailError(messageText) {
  const regex = /550[\s-]5\.1\.1/i;
  if (regex.test(messageText)) {
    return true;
  }
  return false;
}


