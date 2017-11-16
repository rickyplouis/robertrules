const expect = require('chai').expect;
import { convertTimeToSeconds } from '../controllers/timerController'

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
  }
]

describe('timer.spec.js', () => {
  describe('convertTimeToSeconds()', () => {
    it('should handle no input timer', () => {
      expect(convertTimeToSeconds()).to.equal(0)
    })
    it('should convert seconds to seconds', () => {
      expect(convertTimeToSeconds(mockTimers[0])).to.equal(30)
    })
    it('should convert minutes to seconds', () => {
      expect(convertTimeToSeconds(mockTimers[1])).to.equal(120)
    })
    it('should handle high input for minutes and seconds', () => {
      expect(convertTimeToSeconds(mockTimers[2])).to.equal(3300)
    })
    it('should handle string inputs for minutes and seconds', () => {
      expect(convertTimeToSeconds(mockTimers[2])).to.equal(3300)
    })
    it('should handle string inputs for minutes and seconds', () => {
      expect(convertTimeToSeconds(mockTimers[3])).to.equal(140)
    })
  });
});
