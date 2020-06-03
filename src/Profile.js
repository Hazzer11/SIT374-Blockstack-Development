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
      currentDocument:[],
      docHistory:[],
      markdown:[],
      showing: false,
      showing2: false,
      showing3: false,
      showing4:false,
      showing5:false,
      docList:{curCount:1,curIndex:0,data:[{id:0,name:"default"}]},
      newName:"",
    };
    this.updateMarkdown = this.updateMarkdown.bind(this);
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { showing } = this.state;
    const { showing3 } = this.state;
    const { showing4 } = this.state;
    const { showing5 } =this.state;

    return (
      !userSession.isSignInPending() ?

      <div className="mainsection">

        {/* Create New Document Popup */}
        <div id="popups" style={{visibility: (showing3 ? 'visible' : 'hidden' )}}>
          <div className="input-group" id="popup-content">
            <input id="newSave" onChange={e=>{this.nameChange(e)}} value={this.state.newName} type="text" className="form-control" placeholder="New Document"/>
            <div className="input-group-append">
              <button className="btn-outline-secondary new-doc-btn" type="button" onClick={() => this.newSaveClicked()}>Create Document</button>
              <button className="btn-outline-secondary new-doc-btn" type="button" onClick={() => this.setState({ showing3: !showing3 })}>Cancel</button>
            </div>
          </div>
        </div>

        {/* Change Document Popup */}
        <div id="popups" style={{visibility: (showing4 ? 'visible' : 'hidden')}}>
          <div id="popup-content">
            {this.state.docList.data.map((i) =>
              <li key={i.id}>
                <button className="switching-button" onClick={()=>this.changeDoc(i.id)}>{i.name}</button>
                <button className="delete-btn" onClick={()=>this.removeDoc(i.id)}>X</button>
              </li>
            )}
            <button className="btn-outline-secondary new-doc-btn" type="button" onClick={() => this.setState({ showing4: !showing4 })}>Close</button>
          </div>
        </div>

        {/* Show History Popup */}
        <div id="popups" style={{visibility: (showing5 ? 'visible' : 'hidden')}}>
          <div id="popup-content">
            <h4>History</h4>
            <p>
              <div id="history" className="history">
                {JSON.stringify(this.state.docHistory)}
              </div>
            </p>
            <button className="btn-outline-secondary new-doc-btn" type="button" onClick={() => this.setState({ showing5: !showing5 })}>Close</button>
          </div>
        </div>

        {/* Working Area */}
        <div className="work-space">

          {/* Menu Bar */}
          <div className="menu-container">

            {/* Menu Section */}
            <div className="dropdown-menu-btn" id="dropdown">
              <button className="dropbtn">Menu</button>
              <div className="menu-content" id="dropdown-content">
                <a onClick={() => this.setState({ showing3: !showing3 })}>New Document</a>
                <a onClick={e => this.restoreDoc(e)}>Restore</a>
                <a onClick={() => this.setState({ showing4: !showing4 })}>Open Existing Document</a>
                <a onClick={ () => this.saveText()}>Save Document</a>
                <a onClick={ () => this.setState({ showing5: !showing5 })}>History</a>
                <a>Exit</a>
              </div>
            </div>

          </div>

          {/* Profile button */}
          <div className="profile-container">

            <a className="button" onClick={() => this.setState({ showing: !showing })}>
              <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="profile-button" id="avatar-image" alt=""/>
            </a>

            <button className="externalbtn">Share</button>
            <button className="externalbtn">Publish</button>
            <button className="externalbtn">Chat</button>

            <div id="popup1" className="overlay" style={{visibility: (showing ? 'visible' : 'hidden')}}>
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
          <div className="markdown-window" id="text-section">
              <MarkdownEditor
                id="marksection"
                value={this.state.markdown}
                onChange={e=>this.updateMarkdown(e)}
              />
          </div>
        </div>

      </div>:null
    );
  }

  componentWillMount() {
  const { userSession } = this.props

  this.setState({
    person: new Person(userSession.loadUserData().profile),
    username: userSession.loadUserData().username
  });

  this.loadList();

 }

  updateMarkdown(event) {
  this.setState({ markdown:event})
}

  saveText() {

  let newDocument = {
    md: this.state.markdown,
    created_at: Date.now()
  }

  let tempName=String(this.state.docList.curIndex).concat("document.json")
  let tempHistName=String(this.state.docList.curIndex).concat("history.json")

  const options = { encrypt: true }

  this.state.docHistory.push(newDocument)

  console.log(this.state.docHistory)
  console.log(newDocument)

  this.props.userSession.putFile(tempName, JSON.stringify(newDocument), options)
  this.props.userSession.putFile(tempHistName, JSON.stringify(this.state.docHistory), options)

  this.setState({
    currentDocument:newDocument
  })

 }

  loadText(str) {
    const options = { decrypt: true }

    let tempName=String(str).concat("document.json")

    this.props.userSession.getFile(tempName, options)

    .then((file) => {
      if(file) {
        const docFile = JSON.parse(file);
        this.setState({
          currentDocument:docFile,
          markdown:docFile.md

        });
      }

      else{
        this.setState({
          currentDocument:[],
          markdown:[]
        });
      }
    })
  }

  loadHistory(str) {
    const options = { decrypt: true }

    let tempHistName=String(str).concat("history.json")

    this.props.userSession.getFile(tempHistName, options)

    .then((file) => {
      if(file) {
        const docFile = JSON.parse(file);
        this.setState({
          docHistory:docFile
        });
      }

      else{
        this.setState({
          docHistory:[]
        });
      }
    })
  }

  restoreDoc(event){
  this.setState({
    markdown:this.state.currentDocument.md
  })
}

  changeDoc(num){
  let newlistDoc={
    data:this.state.docList.data,
    curIndex:num,
    curCount:this.state.docList.curCount
  }

  const options = { encrypt: true }

  console.log(newlistDoc)

  this.props.userSession.putFile('List.json', JSON.stringify(newlistDoc), options);
  this.setState({
    docList:newlistDoc
  })

  this.loadText(num)
  this.loadHistory(num)
  this.setState({showing4:false})
  }

  newSaveClicked(){
  this.setState({ showing3: !this.state.showing3 })
  this.addToList()
}

  removeDoc(num){
  if (num!=this.state.docList.curIndex){
    let newlistDoc={
      data:this.state.docList.data.filter(ent => ent.id != num),
      curIndex:this.state.docList.curIndex,
      curCount:this.state.docList.curCount
    }

    console.log(newlistDoc)
    const options = { encrypt: true }

    this.props.userSession.putFile('List.json', JSON.stringify(newlistDoc), options);

    this.setState({
      docList:newlistDoc
    })
  }
}

  loadList(){
   const options = { decrypt: true }

   console.log("attempt to load")

   this.props.userSession.getFile('List.json', options)

   .then((file) => {
     console.log("loaded")
     if(file) {
       const docFile = JSON.parse(file);
       console.log(docFile)
       this.setState({
         docList:docFile
       })

       this.loadText(this.state.docList.curIndex);
       this.loadHistory(this.state.docList.curIndex);
     }

   })
 }

  addToList(){
   let newDocument = {
     id:++this.state.docList.curCount,
     name:this.state.newName
   }

   let newDocument2 = {
     md: [],
     created_at: Date.now()
   }

   const options = { encrypt: true }

   let tempName=String(this.state.docList.curCount).concat("document.json")
   let tempHistName=String(this.state.docList.curCount).concat("history.json")

   this.state.docList.data.push(newDocument)

   console.log(this.state.docList)

   this.props.userSession.putFile('List.json', JSON.stringify(this.state.docList), options);
   this.props.userSession.putFile(tempName, JSON.stringify(newDocument), options)
   this.props.userSession.putFile(tempHistName, JSON.stringify([]), options)

   }

   nameChange(event){
   this.setState({
     newName:document.getElementById('newSave').value
   })

 }
}
