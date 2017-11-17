var uuidv1 = require('uuid/v1');

//NOTE: Seperated this function from object because
//promises don't allow 'this' notation to be used inside of them
function findTopicIndex(topic={}, agenda=[]){

  function matchesIndex(element) {
    return element.id === topic.id;
  }
  return agenda.findIndex(matchesIndex);
}

var agenda = {
  deleteTopic(event, topic, agenda){
    return new Promise(function(resolve, reject) {
      event.preventDefault();
      let index = findTopicIndex(topic, agenda);
      let newAgenda = agenda;
      newAgenda.splice(index, 1);
      resolve(newAgenda);
    });
  },
  changeName(event, topic, agenda){
    return new Promise(function(resolve, reject) {
      event.preventDefault();
      let newAgenda = agenda;
      newAgenda[findTopicIndex(topic, agenda)].name = event.target.value
      resolve(newAgenda)
    });
  },
  changeEditStatus(event, topic, agenda){
    return new Promise(function(resolve, reject) {
      event.preventDefault();
      let newAgenda = agenda;
      let index = findTopicIndex(topic, agenda);
      newAgenda[index].editable = !newAgenda[index].editable
      resolve(newAgenda)
    });
  },
  shiftAgenda(agenda){
    return new Promise(function(resolve, reject) {
      let newAgenda = agenda;
      //if agenda topic has items under it then shift items
      if (newAgenda[0].items.length > 1){
        newAgenda[0].items.shift();
      //else shift agenda topic completely
      } else {
        newAgenda.shift();
      }
      resolve(newAgenda)
    });
  },
  addTopic(topicName, agenda){
    return new Promise(function(resolve, reject) {
      let topic = {
        'id': uuidv1(),
        'name': topicName,
        'editable': false,
        'items': []
      }
      resolve(agenda.concat(topic));
    })
  },
}

module.exports = {
  agenda,
  findTopicIndex,
}
