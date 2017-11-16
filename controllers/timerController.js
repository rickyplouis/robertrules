var timer = {
  displaySeconds(inputSeconds){
    let seconds = inputSeconds % 60;
    return seconds < 10 ? '0' + seconds : seconds;
  },
  displayMinutes(seconds){
    return Math.floor( seconds / 60);
  },
  convertTimeToSeconds(timerObject={minutes: 0, seconds:0}){
    let minutes = Math.abs(parseInt(timerObject.minutes || 0));
    let seconds = Math.abs(parseInt(timerObject.seconds || 0));
    return minutes * 60 + seconds;
  }
}

module.exports = timer;
