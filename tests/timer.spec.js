var expect = require('chai').expect;
var timer = require('../controllers/timerController');

var mockTimers = [
  {
    'minutes': 0,
    'seconds': 30
  },
  {
    'minutes': 2,
    'seconds': 0
  },
  {
    'minutes':50,
    'seconds': 300
  },
  {
    'minutes': '2',
    'seconds': '20'
  },
  {
    'minutes': -2,
    'seconds': -10
  }
]

describe('timer.spec.js', function(){

  describe('convertTimeToSeconds()', function() {

    it('should handle no input timer', function() {
      expect(timer.convertTimeToSeconds()).to.equal(0)
    })

    it('should convert seconds to seconds', function() {
      expect(timer.convertTimeToSeconds(mockTimers[0])).to.equal(30)
    })

    it('should convert minutes to seconds', function() {
      expect(timer.convertTimeToSeconds(mockTimers[1])).to.equal(120)
    })

    it('should handle high input for minutes and seconds', function() {
      expect(timer.convertTimeToSeconds(mockTimers[2])).to.equal(3300)
    })

    it('should handle string inputs for minutes and seconds', function() {
      expect(timer.convertTimeToSeconds(mockTimers[3])).to.equal(140)
    })

    it('should handle negative inputs for minutes and seconds', function() {
      expect(timer.convertTimeToSeconds(mockTimers[4])).to.equal(130)
    })

    it('should handle missing seconds input', function() {
      expect(timer.convertTimeToSeconds({minutes:2})).to.equal(120);
    })

    it('should handle missing minutes input', function() {
      expect(timer.convertTimeToSeconds({seconds:68})).to.equal(68);
    })

    it('should handle fractions for minutes and seconds', function() {
      expect(timer.convertTimeToSeconds({minutes: 2.8, seconds: 60.9})).to.equal(180)
    })
  })


});
