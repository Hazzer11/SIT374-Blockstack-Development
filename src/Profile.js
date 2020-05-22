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
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      username:"",
      newText:"",
      currentDocument:[],

      timestamp: '',
      isLoading: false,
      showing: false
    };

  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { showing } = this.state;

    return (
      !userSession.isSignInPending() ?

      <div classname="mainsection">
        <div className="profile-container">
          <a className="button" onClick={() => this.setState({ showing: !showing })}>
            <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="profile-button" id="avatar-image" alt=""/>
          </a>
          <div id="popup1" className="overlay" style={{display: (showing ? 'block' : 'none')}}>
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
                    SignOut
                    </button>
                </p>
              </div>
          </div> 
        </div>
        
        <div className="work-space">
          <h2>
            Welcome to PaperState!
          </h2>
          <p>
            Lasted updated: {this.state.currentDocument.created_at ? new Date(this.state.currentDocument.created_at).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true,
              timeZoneName: 'short'
            }) : "No File yet"}
          </p>
        </div>

        <div id="section-3">
          
          <div id="Text-section">
            
            <div id="Fill-in-text">
              <textarea className="input-status"
                placeholder="Document text goes here"
                onChange={e=>this.handleChange(e)}
                value={this.state.newText}

                />
            </div>

            <div id="Formatted-text">
              <textarea className="input-status2"
                placeholder="formatted text goes here"
                disabled='disabled'
                value={this.state.currentDocument.text}>
                </textarea>
            </div>
            
            <div id="Submit-button">
              <button className="btn btn-success btn-lg"
              onClick={e => this.saveNewText(e)}
              >
              Submit Changes
              </button>
            </div>

          </div>

        </div>

      </div>:null
    );
  }


  saveNewText() {
     const { userSession } = this.props
     let currentDocument = this.state.currentDocument

     let newDocument = {
       text: this.state.newText,
       created_at: Date.now()
     }


     const options = { encrypt: true }
     userSession.putFile('Document.json', JSON.stringify(newDocument), options)
       .then(() => {
         this.setState({
           currentDocument:newDocument
         })
       })
   }

  loadNewText() {
      const { userSession } = this.props
      const options = { decrypt: true }
      userSession.getFile('Document.json', options)
      .then((file) => {
        var docFile = JSON.parse(file || '[]')
        this.setState({
          currentDocument: docFile,
          newText:docFile.text
        })
      })
    }

  componentWillMount() {
    const { userSession } = this.props
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
    this.loadNewText();
   }

  handleChange(event) {
   this.setState({newText: event.target.value});
  }
}
