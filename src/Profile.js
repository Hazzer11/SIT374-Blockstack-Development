import React, { Component } from 'react';
import * as api from './api'
import {
  Person,
} from 'blockstack';
import MarkdownEditor from '@uiw/react-md-editor';

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
      markdown:[],
      timestamp: '',
      isLoading: false,
      showing: false,
      showing2: false,
      showing3: false,
      docList:{curCount:0,curIndex:0,data:[{id:0,name:'default'}]},
      currentDocIndex:0,
      listIndex:0,
      newName:"",
      tempHeading:"",
      currentName:"sdfgh"
    };
    this.updateMarkdown = this.updateMarkdown.bind(this);
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { showing } = this.state;
    const { showing2 } = this.state;
    const { showing3 } = this.state;

    return (
      !userSession.isSignInPending() ?

      <div className="mainsection">

        <div className="menu-container">
          <a className="button" onClick={() => this.setState({ showing2: !showing2 })}>
            <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="profile-button" id="avatar-image" alt=""/>
          </a>
          <div id="popup2" className="overlay" style={{display: (showing2 ? 'block' : 'none')}}>
              <button onClick={e=>this.saveNewText(e)}>Save</button>
              <button onClick={e=>this.restoreDoc(e)}>restore</button>
              <button>SwapDocument</button>
              <button onClick={() => this.setState({ showing3: !showing3 })}>NewDocument</button>
              <button>History</button>
          </div>


          <div id="document creation" className="overlay" style={{display: (showing3 ? 'block' : 'none')}}>
            <textarea id='newSave' value={this.state.newName} onChange={e=> this.nameChange(e)}></textarea>
            <button onClick={() => this.addToList()}>save</button>
          </div>
        </div>

        <div className="profile-container">
          <a className="button" onClick={() => this.setState({ showing: !showing })}>
            <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="profile-button" id="avatar-image" alt=""/>
          </a>


        <div id="popup1" className="overlay" onClick={() => this.setState({ showing: !showing })} style={{display: (showing ? 'block' : 'none')}}>
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
          <h2 value={this.state.currentName}>
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

          <div id="Text-section">
              <MarkdownEditor
                id="marksection"
                value={this.state.markdown}
                onChange={e=>this.updateMarkdown(e)}
              />

          </div>

          </div>

        </div>



      </div>:null
    );
  }

  updateMarkdown(event) {
    this.setState({ markdown:event})
  }

  saveNewText() {

    let newDocument = {
      md: this.state.markdown,
      created_at: Date.now()
    }

    let tempName=String(this.state.docList.curIndex).concat(".json")
    const options = { encrypt: true }

    this.props.userSession.putFile(tempName, JSON.stringify(newDocument), options)

    .then(() => {
      this.setState({
        currentDocument:newDocument
      })
    })
   }

  loadNewText(s) {
      const options = { decrypt: true }
      let tempName=String(s).concat(".json")
      this.props.userSession.getFile(tempName, options)


      .then((file) => {
        if(file) {
          const docFile = JSON.parse(file);
          this.setState({
            currentDocument:docFile,
            markdown:docFile.md

          });
        }
      })
      console.log(this.state.docList.data)
      for (let x in this.state.docList.data){
        console.log(x.id)

      }


    }

  restoreDoc(event){
    this.setState({
      markdown:this.state.currentDocument.md
    })
  }

  componentWillMount() {
    const { userSession } = this.props
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
    this.loadList();
    console.log(this.date.docList)
    this.loadNewText(this.state.docList.curIndex);
   }

  loadList(){
     const options = { decrypt: true }
     this.props.userSession.getFile('List.json', options)
     .then((file) => {
       if(file) {
         const docFile = JSON.parse(file);

         this.setState({
           docList:docFile
         })
       }
     })
   }

  addToList(){
     let newDocument = {
       id:++this.state.docList.curCount,
       name:this.state.newName
     }


    this.state.docList.data.push(newDocument)


    let newlistDoc={
      data:this.state.docList.data,
      curIndex:this.state.currentDocIndex,
      curCount:this.state.docList.curCount
    }
      console.log(newlistDoc)
     const options = { encrypt: true }

     this.props.userSession.putFile('List.json', JSON.stringify(newlistDoc), options);

     this.setState({
       showing3: !this.state.showing3,
       newName:""
     });
     }

  nameChange(event){
     this.setState({
       newName:document.getElementById('newSave').value
     })

   }
  }
