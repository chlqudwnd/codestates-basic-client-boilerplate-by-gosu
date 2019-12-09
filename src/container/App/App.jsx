import React from 'react';
import io from 'socket.io-client';

import ExampleButton from '../../component/ExampleButton/ExampleButton.jsx'
import ExampleSubmitForm from '../ExampleSubmitForm/ExampleSubmitForm.jsx';
import ExampleMessage from '../../component/ExampleMessage/ExampleMessage.jsx';

const socket = io('http://localhost:8080');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      storage: []
    }
  }
  
  componentDidMount() {
    this.getDataBySocket();
    socket.on('get storage data res', (resData) => {
      console.log('get storage data res!: ' + JSON.stringify(resData))
      this.setState({
        storage: resData
      })
    })
    socket.on('broadcast', (data) => {
      const newStorage = this.state.storage
      newStorage.push(data);
      this.setState({
        storage: newStorage
      })
    })
    socket.on('err', (msg) => {
      alert(msg);
    })
  }

  getDataBySocket() {
    socket.emit('get storage data')
  }

  emitMessage(data) {
    socket.emit('broadcast req', (data))
  }

  clickAlert() {
    alert(`App's state: ${JSON.stringify(this.state.data)}`);
  }

  messageList() {
    return (
      <div>
        {this.state.storage.map((item, index) => {
          const {name, message} = item;
          return <ExampleMessage name={name} message={message} key={index}/>
        })}
      </div>
    )
  }

  render() {
    return (
      <div>
        <ExampleButton click={() => this.clickAlert()} buttonName="App's state?"/>
        <ExampleSubmitForm emitMessage={(data) => this.emitMessage(data)}/>
        {this.messageList()}
      </div>
    )
  }
}

export default App;