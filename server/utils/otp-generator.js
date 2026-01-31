const getOTP = ()=>{
  const digits = "1234567890"
  let result = "";
  for(let i = 0; i<6; i++){
     result = result + digits.charAt(Math.floor(Math.random()*10))
  }
  return result;
}

module.exports = getOTP;