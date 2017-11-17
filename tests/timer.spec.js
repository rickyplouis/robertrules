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

var conversionTests = [
  {
    'args': {},
    'expected': 0,
    'message': 'nothing'
  },
  {
    'args': mockTimers[0],
    'expected': 30,
    'message': 'seconds'
  },
  {
    'args': mockTimers[1],
    'expected': 120,
    'message': 'minutes'
  },
  {
    'args': mockTimers[2],
    'expected': 3300,
    'message': 'high numbers'
  },
  {
    'args': mockTimers[3],
    'expected': 140,
    'message': 'string inputs'
  },
  {
    'args': mockTimers[4],
    'expected': 130,
    'message': 'negative numbers'
  },
  {
    'args': {minutes:2},
    'expected': 120,
    'message': 'only minutes'
  },
  {
    'args': {seconds: 68},
    'expected': 68,
    'message': 'only seconds'
  },
  {
    'args': {minutes: 2.8, seconds: 60.9},
    'expected': 180,
    'message': 'fractions'
  }
]

describe('timer.spec.js', function(){
  describe('convertTimeToSeconds()', function() {

    conversionTests.forEach( function(test){
      it('should handle ' + test.message + ' as arguments', function(){
        expect(timer.convertTimeToSeconds(test.args)).to.equal(test.expected);
      })
    })
  })

  describe('displaySeconds()', function(){
    it('should display seconds', function(){
      expect(timer.displaySeconds(10)).to.equal('10');
    })

    it('should handle single digits', function(){
      expect(timer.displaySeconds(1)).to.equal('01');
    })

    it('should handle fractions', function(){
      expect(timer.displaySeconds(10.2)).to.equal('10');
    })

    it('should handle negative inputs', function(){
      expect(timer.displaySeconds(-8)).to.equal('08');
    })

    it('should handle no inputs', function(){
      expect(timer.displaySeconds()).to.equal('00');
    })

    it('should handle text inputs', function(){
      expect(timer.displaySeconds('2')).to.equal('02');
    })
  })

  describe('displayMinutes()', function(){
    it('should display minutes', function(){
      expect(timer.displayMinutes(120)).to.equal('2');
    })

    it('should handle single digits', function(){
      expect(timer.displayMinutes(3)).to.equal('0');
    })

    it('should handle double digits', function(){
      expect(timer.displayMinutes(30)).to.equal('0');
    })

    it('should handle large numbers', function(){
      expect(timer.displayMinutes(1200)).to.equal('20');
    })

    it('should handle fractions', function(){
      expect(timer.displayMinutes(120.2)).to.equal('2');
    })

    it('should handle negative inputs', function(){
      expect(timer.displayMinutes(-120)).to.equal('2');
    })

    it('should handle no inputs', function(){
      expect(timer.displayMinutes()).to.equal('0');
    })

    it('should handle text inputs', function(){
      expect(timer.displayMinutes('120')).to.equal('2');
    })
  })
});
