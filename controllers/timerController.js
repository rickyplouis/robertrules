export function displaySeconds(inputSeconds){
  let seconds = inputSeconds % 60;
  return seconds < 10 ? '0' + seconds : seconds;
}

export function displayMinutes(seconds){
  return Math.floor( seconds / 60);
}

export function convertTimeToSeconds(timerObject){
  let minutes = parseInt(timerObject.minutes || 0);
  let seconds = parseInt(timerObject.seconds || 0);
  return minutes * 60 + seconds;
}
