const getResetPasswordResetCode = ()=>{
  let resetCode = ""
  const characters = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ","0123456789"]

  for(let i=0; i<6; i++){
    const selected = Math.floor(Math.random()*2)
    if(selected===0) resetCode = resetCode + characters[selected].charAt(Math.floor(Math.random()*26));
    else resetCode = resetCode + characters[selected].charAt(Math.floor(Math.random()*10));
  }
  return resetCode;
} 

module.exports = getResetPasswordResetCode;