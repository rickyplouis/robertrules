import React from 'react'

import fetch from 'isomorphic-fetch'
import io from 'socket.io-client'

import PageContainer from '../components/pageContainer'
import Timer from '../components/timer'
import CardComponent from '../components/cardComponent'

import { Header, Form, Button, Card, Feed, Icon, Input, Progress, Label, Radio } from 'semantic-ui-react'
import SortableList from '../components/SortableList'
import Head from 'next/head';

import {findTopicIndex, agenda as agendaController} from '../controllers/agendaController'
import * as timerController from '../controllers/timerController'
import ItemForm from '../components/itemForm'



  const EmptyRoom = () => (
    <div>No room available at this id</div>
  )

  const ActiveRoom = (props) => (
    props.userConnected ? <div>{props.renderRoom}</div> : <div>{props.renderEntranceForm}</div>
  )


  const AddTopicForm = (props) => (
      <Card style={{margin: '0 auto', display: 'table', width: '50vw'}}>
        <Card.Content>
          <Form>
            <label>Add Topic:</label>
            <Form.Input type="text" value={props.inputTopic} onChange={props.onChange} />
            <Button onClick={props.onClick}>Send</Button>
          </Form>
        </Card.Content>
      </Card>
  )

  const TimerButtons = (props) => (
    props.timerIsRunning ? <Button onClick={props.onPause} color={"red"}>Pause</Button> : <Button onClick={props.onStart} color={"blue"}>Start</Button>
  )

  const TopicHeader = (props) => (
    <Card.Content>
      <Card.Header>
        {props.name + " "} <Button active={props.editable} onClick={props.onClick}>{props.content}</Button>
      </Card.Header>
    </Card.Content>
  )

    const EditForm = (props) => (
      props.editable &&
      <Card.Content extra>
        <Form size={'large'} width={16}>
          <Form.Field inline>
            <label>Edit Topic:</label>
            <Input placeholder="Enter Topic Title" value={props.name} onChange={props.onChange} ></Input>
          </Form.Field>
          <Form.Field>
            <Button onClick={props.onClick}>Delete Topic</Button>
          </Form.Field>
        </Form>
      </Card.Content>
    )


  const EntranceForm = (props) => (
      <div style={{margin: '0 auto', display: 'table'}}>
        {props.joinText}
        <Form size={'tiny'} onSubmit={props.onSubmit} >
          <Form.Group>
            <Form.Input placeholder='Enter your name' name='username' value={props.username} onChange={props.onChange} />
            {props.passwordField}
            <Form.Button content='Submit' disabled={props.disabled} />
          </Form.Group>
        </Form>
      </div>
  )


export default class RoomPage extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { pathname, query } = nextProps.url
    // fetch data based on the new query
  }

  static async getInitialProps ({ query: { id } }) {
    const appUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/rooms' : 'https://learnthechain.com/rooms';
    const response = await fetch(appUrl)
    const rooms = await response.json()
    return { rooms }
  }


  static defaultProps = {
    rooms: []
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  // connect to WS server and listen event
  componentDidMount () {
    this.socket = io()
    this.socket.on('updateRoom', this.loadRooms)
  }

  // close socket connection
  componentWillUnmount () {
    this.socket.off('updateRoom', this.loadRooms)
    this.socket.close()
  }

  // only update room if id matches
  // prevents cross room updates
  loadRooms = (room) => {
    if (room.id == this.state.id){
      this.setState(state => ({ room }))
    }
    return;
  }

  constructor(props){
    super(props);
    let targetRoom = {}
    for (let room of this.props.rooms){
      if (room.id === this.props.url.query.id){
        targetRoom = room;
      }
    }
    this.state = {
      room: targetRoom,
      id: this.props.url.query.id,
      username: '',
      userConnected: false,
      password: '',
      wrongPassword: false,
      text: 'Hello world',
      inputTopic: '',
      itemForm: {
        'details': '',
        'minutes': 0,
        'seconds': 0,
        'duration': 0
      },
      timerObject: {
        startingSeconds: 0,
        secondsRemaining: 0,
        percent: 100,
        minutes: 0,
        seconds: 0,
        timerRunning: false
      }
    }
      this.timer = 0;
      this.startTimer = this.startTimer.bind(this);
      this.pauseTimer = this.pauseTimer.bind(this);
      this.countDown = this.countDown.bind(this);
  }

  updateAgenda = (newAgenda) => {
    this.setState({
      inputTopic: this.state.inputTopic,
      room: {
        ...this.state.room,
        agenda: newAgenda
      }
    })
    this.socket.emit('updateRoom', this.state.room)
  }

  agendaExists = (agenda) => {
    return agenda && agenda.length > 0;
  }

  handleQueue = () => {
    if (this.agendaExists(this.state.room.agenda)){
      agendaController.shiftAgenda(this.state.room.agenda).then( (newAgenda) => {
        if (newAgenda[0] && newAgenda[0].items[0]){
          this.setTimer(newAgenda[0].items[0])
        }
        this.updateAgenda(newAgenda)
      })
    }
  }

  changeTopicName = (event, topic, agenda) => {
    agendaController.changeName(event, topic, agenda).then( (newAgenda) => this.updateAgenda(newAgenda) );
  }

  editStatus = (event, topic, agenda) => {
    event.preventDefault()
    agendaController.changeEditStatus(topic, agenda).then( (newAgenda) => this.updateAgenda(newAgenda) );
  }

  removeTopic = (evt, topic, agenda) => {
    event.preventDefault()
    agendaController.deleteTopic(topic, agenda).then( (newAgenda) => this.updateAgenda(newAgenda) )
  }

  handleItemForm = (event) => {
    event.preventDefault();
    this.setState({
      itemForm: {
        ...this.state.itemForm,
        [event.target.name]: event.target.value
      },
    })
  }

  setTimer = (timeObject = { minutes: 0, seconds: 0}) => {
    this.setState({
      room: {
        ...this.state.room,
        timerObject: {
          startingSeconds: timerController.convertTimeToSeconds(timeObject),
          secondsRemaining: timerController.convertTimeToSeconds(timeObject),
          percent: 100,
          minutes: timeObject.minutes,
          seconds: timeObject.seconds,
          timerRunning: false
        }
      },
      itemForm: {
        details: "",
        seconds: 0,
        minutes: 0
      }
    })
  }

  addItem = (event, topic) => {
    event.preventDefault();
    let topicIndex = findTopicIndex(topic, this.state.room.agenda);
    var newAgenda = this.state.room.agenda;
    let item = {
      ...this.state.itemForm,
      'name': this.state.username,
    }
    newAgenda[topicIndex].items.push(item);

    if (this.state.room.timerObject.startingSeconds == 0){
      this.setState({
        room: {
          ...this.state.room,
          agenda: newAgenda,
          timerObject: {
            startingSeconds: timerController.convertTimeToSeconds(item),
            secondsRemaining: timerController.convertTimeToSeconds(item),
            percent: 100,
            minutes: item.minutes,
            seconds: item.seconds,
            timerRunning: false
          }
        },
        itemForm: {
          details: "",
          seconds: 0,
          minutes: 0
        }
      })
    } else {
      this.setState({
        room: {
          ...this.state.room,
          agenda: newAgenda,
        },
        itemForm: {
          details: "",
          seconds: 0,
          minutes: 0
        }
      })
    }
  }

  submitItem = (event, topic) => {
    event.preventDefault();
    Promise.all([this.addItem(event, topic)]).then( () => {
      this.socket.emit('updateRoom', this.state.room)
    })
  }

  itemFormInvalid = () => {
    return this.state.itemForm.details.length === 0 || (this.state.itemForm.seconds === 0 && this.state.itemForm.minutes === 0);
  }

  renderTopics(){
    let index = 0;
    return this.state.room.agenda.map( (topic, index) =>
            (<Card style={{margin: '0 auto', display: 'table', width: '50vw'}} key={index++}>
                <TopicHeader
                  name={topic.name}
                  editable={topic.editable}
                  onClick={(e) => this.editStatus(e, topic, this.state.room.agenda)}
                  content={topic.editable ? 'Finish' : 'Edit'}
                  />
                <EditForm
                  name={topic.name}
                  editable={topic.editable}
                  onChange={(e) => this.changeTopicName(e, topic, this.state.room.agenda)}
                  onClick={(e) => this.removeTopic(e, topic, this.state.room.agenda)}
                  />
              <Card.Content>
                  <SortableList items={this.state.room.agenda[findTopicIndex(topic, this.state.room.agenda)].items} onSortEnd={this.onSortEnd} />
                  <ItemForm
                    onSubmit={(e) => this.submitItem(e, topic)}
                    details={this.state.itemForm.details}
                    onChange={this.handleItemForm}
                    minutes={this.state.itemForm.minutes}
                    seconds={this.state.itemForm.seconds}
                    disabled={this.itemFormInvalid()}
                  />
                </Card.Content>
              </Card>))
              }

  handleTopic = event => {
    return this.setState({
      inputTopic: event.target.value,
      room: this.state.room
    })
  }

  submitTopic = (event, topicName, agenda) => {
    event.preventDefault();
    agendaController.addTopic(topicName, agenda).then( (newAgenda) => {
      this.updateAgenda(newAgenda)})
  }

  handleSubmit = event => {
    event.preventDefault()
    this.socket.emit('updateRoom', this.state.room)
  }

  roomIsEmpty = (room) => {
    return JSON.stringify(room) === JSON.stringify({})
  }

  updateTimer = (seconds) => {
    this.setState({
      room: {
        ...this.state.room,
        timerObject: {
          ...this.state.room.timerObject,
          secondsRemaining: seconds,
          percent: (seconds / this.state.room.timerObject.startingSeconds) * 100
        }
      }
    })
    this.socket.emit('updateRoom', this.state.room)
  }

  countDown() {
    let seconds = this.state.room.timerObject.secondsRemaining - 1;
    return seconds === 0 ? this.handleQueue() : this.updateTimer(seconds)
  }

  startTimer() {
    if (this.state.room.timerObject.secondsRemaining > 0 && !this.state.room.timerObject.timerRunning){
      Promise.all([
        this.timer = setInterval(this.countDown, 1000),
        this.setState({
          room: {
            ...this.state.room,
            timerObject: {
              ...this.state.room.timerObject,
              timerRunning: true
            }
          }
        })
      ]).then( () => this.socket.emit('updateRoom', this.state.room) )
    }
  }

  pauseTimer = event => {
    if (this.state.room.timerObject.timerRunning){
      Promise.all([
        clearInterval(this.timer),
        this.setState({
          room: {
            ...this.state.room,
            timerObject: {
              ...this.state.room.timerObject,
              timerRunning: false
            }
          }
        })
      ]).then( () => this.socket.emit('updateRoom', this.state.room))
    }
  }


  renderTimer = () => {
      let currentItem = this.state.room.agenda[0].items[0];
      return (
        <div>
            <Card.Header>
              Current Speaker is {currentItem.name}
            </Card.Header>
            <Header as='h4'>Time Remaining: {timerController.displayMinutes(this.state.room.timerObject.secondsRemaining)}:{timerController.displaySeconds(this.state.room.timerObject.secondsRemaining)}</Header>
            <Progress percent={this.state.room.timerObject.percent} indicating size={'tiny'} style={{width: '50vw'}} />
            <TimerButtons
              timerIsRunning={this.state.room.timerObject.timerRunning}
              onStart={this.startTimer}
              onPause={this.pauseTimer}
              />
            <Button onClick={this.handleQueue} color="purple">Skip Speaker</Button>
          </div>
        )
  }

  timerVisible(){
    return this.agendaExists(this.state.room.agenda) && this.state.room.agenda[0].items.length > 0 ;
  }

  renderRoom = () => {
      return (
        <div style={{margin: '0 auto', display: 'table'}}>
          <Header as="h2">In room {this.state.room.roomName}</Header>
          <Header as="h4">Expected Duration: {this.state.room.duration} mins</Header>
          <Card style={{margin: '0 auto', display: 'table', width: '50vw'}}>
            <Card.Content>
              <Card.Header>
                <Header as="h2">
                  Meeting Agenda
                </Header>
              </Card.Header>
            </Card.Content>
            {this.timerVisible() && this.renderTimer()}
          </Card>
          {this.renderTopics()}
          <AddTopicForm
            inputTopic={this.state.inputTopic}
            onChange={this.handleTopic}
            onClick={(e) => this.submitTopic(e, this.state.inputTopic, this.state.room.agenda)}
          />
          <Form onSubmit={this.handleSubmit}>
            <label>My username:</label>
            <Form.Input type="text" placeholder="Enter your name" name="username" value={this.state.username} onChange={ (e) => this.handleUserForm(e)} />
          </Form>
        </div>
      )
  }

  passwordMismatch = () => {
    return this.state.password !== this.state.room.password;
  }

  connectUser = () => {
    this.setState({
      ...this.state,
      userConnected: true
    })
  }

  submitEntranceForm = (e) => {
    e.preventDefault();

    if (this.state.room.passwordProtected && this.passwordMismatch()){
      this.setState({
        ...this.state,
        wrongPassword: true,
        password: ''
      })
    } else {
      this.connectUser()
    }
  }

  handleUserForm = (event) => {
    event.preventDefault();
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    })
  }

  disableEntranceButton = () => {
    if (this.state.room.passwordProtected){
      return this.state.password.length === 0 || this.state.username.length === 0;
    } else {
      return this.state.username.length === 0;
    }
  }

  roomHasPassword = () => {
    return this.state.room.passwordProtected;
  }

  renderPasswordField = () => {
    return this.roomHasPassword() && <Form.Input placeholder='Enter the room password' type="password" error={this.state.wrongPassword && this.state.password.length == 0} name='password' value={this.state.password} onChange={ (e) => this.handleUserForm(e)}/>
  }
  renderJoinText = () => {
    return <Header as="h2"> Enter your name{this.roomHasPassword() ? " and password ": " "}to join</Header>
  }


  renderEntranceForm = () => {
    return (
      <EntranceForm
        joinText={this.renderJoinText()}
        onSubmit={(e) => this.submitEntranceForm(e)}
        username={this.state.username}
        onChange={(e) => this.handleUserForm(e)}
        passwordField={this.renderPasswordField()}
        disabled={this.disableEntranceButton()}
        />
    )
  }

  renderPage = () => {
    return (
      this.roomIsEmpty(this.state.room) ? <EmptyRoom/> :
        <ActiveRoom
          userConnected={this.state.userConnected}
          renderRoom={this.renderRoom()}
          renderEntranceForm={this.renderEntranceForm()}
        />
    )
  }

  render = () =>{
    return(
      <PageContainer>
        <Head>
          <a href="http://www.freepik.com/free-vector/animal-avatars-in-flat-design_772910.htm">Animal Avatars by Freepik</a>
        </Head>
        {this.renderPage()}
      </PageContainer>
    )
  }
}
