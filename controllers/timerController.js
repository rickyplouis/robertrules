var timer = {
  displaySeconds(inputSeconds=0){
    let seconds = this.cleanString(inputSeconds) % 60;
    return seconds < 10 ? '0' + seconds : seconds.toString();
  },
  displayMinutes(seconds=0){
    seconds = this.cleanString(seconds);
    return Math.floor( seconds / 60).toString();
  },
  convertTimeToSeconds(timerObject={minutes: 0, seconds:0}){
    let minutes = this.cleanString(timerObject.minutes || 0)
    let seconds = this.cleanString(timerObject.seconds || 0)
    return minutes * 60 + seconds;
  },
  cleanString(stringInput){
    return Math.abs(parseInt(stringInput));
  }
}

module.exports = timer;
