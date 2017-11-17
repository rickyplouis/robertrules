var expect = require('chai').expect;
var controller = require('../controllers/agendaController')
var addTopic = controller.agenda.addTopic
var mockAgenda = [
  {
    'id': '312',
    'description': 'firstTopic'
  },
  {
    'id': '217',
    'description': 'anotherTopic'
  },
  {
    'id': '773',
    'description': 'lastTopic'
  }
]

var mockTopics = [
  {
    'id': '312',
    'description': 'firstTopic'
  },
  {
    'id': '800',
    'description': 'missing topic'
  }
]


describe('agenda.sepc.js', function(){
  describe('findTopicIndex()', function(){

    it('should return -1 if no agenda supplied', function(){
      expect(controller.findTopicIndex(mockTopics[0])).to.equal(-1);
    })

    it('should return -1 if no topic supplied', function(){
      expect(controller.findTopicIndex({}, mockAgenda)).to.equal(-1);
    })

    it('should return -1 if no inputs supplied', function(){
      expect(controller.findTopicIndex()).to.equal(-1);
    })

    it('should find index of topic inside of agenda', function(){
      expect(controller.findTopicIndex(mockTopics[0], mockAgenda)).to.equal(0)
    })

    it('should return -1 if topic does not exist', function(){
      expect(controller.findTopicIndex(mockTopics[1], mockAgenda)).to.equal(-1)
    })
  })

  describe('addTopic()', function(){
    var newTopicName = 'something cool'
    beforeEach(function(){
      return addTopic(newTopicName, mockAgenda).then( function(newAgenda){
        mockAgenda = newAgenda
      })
    })

    it('should have added a topic', function(){
      expect(mockAgenda.length).to.equal(4)
    })

    it('should have new topic with a specific name', function(){
      expect(mockAgenda[3].name).to.equal(newTopicName);
    })
  })

})
