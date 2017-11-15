export function displaySeconds(seconds){
  seconds = seconds % 60;
  return seconds < 10 ? '0' + seconds : seconds;
}

export function displayMinutes(seconds){
  return Math.floor(seconds / 60);
}

export function convertTimeToSeconds(timerObject){
  return timerObject.minutes * 60 + timerObject.seconds
}
