import React, { Component } from 'react';
import * as api from './api'
import {
  Person,
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: 'no timestamp yet',
      text: ''
    };


  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      username:"",
      currentText:"",
      currentDocument:""
    }; 
    
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    return (
      !userSession.isSignInPending() ?

        <div classname="mainsection">
          <div className="panel-welcome" id="section-2">
            <div className="avatar-section">
              <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
              <div className="username">
                <h4>
                  <span id="heading-name">{ person.name() ? person.name()
                     : 'Nameless Person'}</span>
                </h4>
              <span>{this.state.username}</span>
              </div>
          </div>
            <p className="lead">
              <button
                className="btn btn-primary btn-lg"
                id="signout-button"
                onClick={ handleSignOut.bind(this) }>
                Logout
              </button>
            </p>
          </div>

          <div>
            <h2>
              Welcome to PaperState!
            </h2>
            <p>
              Time: {this.state.timestamp ? new Date(this.state.timestamp).toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
                timeZoneName: 'short'
              }) : "no date yet"}
            </p>
          </div>

          <div id="section-3">
            <div id="Text-section">
              <div id="Fill-in-text">
                <textarea className="input-status"
                  placeholder="Document text goes here"
                  onChange={e=>this.HandleChange(e)}
                  />
                </div>
              <div id="Formatted-text">
                <textarea className="input-status"
                  placeholder="formatted text goes here"
                  disabled='disabled'>
                  this text will go</textarea>
              </div>
              <div id="Submit-button">
                <button
                onClick={e => this.handleTextSubmit(e)}
                >
                Submit Changes
                </button>
              </div>
            </div>
            </div>
          </div>:null




    );


  }
z

  componentDidMount() {
    api.subscribeToTimer((err, timestamp) => this.setState({
      timestamp
    }));
  }



 
  componentWillMount() {
    this.fetchData()
  }

  HandleChange(event){
    this.setState({currentText:event.target.value})
    document.getElementById('Formatted-text').value=this.state.currentText;
  }
  handleTextSubmit(event){
    let newText = {
     text: this.state.currentText,
     created_at: Date.now()
  }
   const { userSession } = this.props
   const options = { encrypt: false }
   userSession.putFile('TextDocs.json', JSON.stringify(newText), options)
     .then(() => {
       document.getElementById('Formatted-text').value=this.state.currentText;
       })

  }

  fetchData() {
  const { userSession } = this.props
  const options = { decrypt: false }

  userSession.getFile('TextDocs.json', options)
    .then((file) => {
      var currentDocument = JSON.parse(file || '[]')
      this.setState({
        person: new Person(userSession.loadUserData().profile),
        username: userSession.loadUserData().username,
        currentText: userSession.loadUserData().text
      })
    })
  }

}
