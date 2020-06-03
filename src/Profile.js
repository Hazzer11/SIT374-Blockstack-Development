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
      docHistory:[],
      markdown:[],
      showing: false,
      showing2: false,
      showing3: false,
      showing4:false,
      showing5:false,
      docList:{curCount:1,curIndex:0,data:[{id:0,name:"default"}]},
      listIndex:0,
      newName:"",
      currentDocIndex:0
    };
    this.updateMarkdown = this.updateMarkdown.bind(this);
  }
  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { showing } = this.state;
    const { showing2 } = this.state;
    const { showing3 } = this.state;
    const { showing4 } = this.state;
    const { showing5 } =this.state;

    return (
      !userSession.isSignInPending() ?

      <div className="mainsection">

        <div className="menu-container">
          <a className="button" onClick={() => this.setState({ showing2: !showing2 })}>
            <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="profile-button" id="avatar-image" alt=""/>
          </a>
          <div id="popup2" className="overlay" style={{display: (showing2 ? 'block' : 'none')}}>
              <button onClick={()=>this.saveText()}>Save</button>
              <button onClick={e=>this.restoreDoc(e)}>restore</button>
              <button onClick={() => this.setState({ showing4: !showing4 })}>SwapDocument</button>
              <button onClick={() => this.setState({ showing3: !showing3 })}>NewDocument</button>
              <button onClick={() => this.setState({ showing5: !showing5 })}>History</button>
          </div>


          <div id="document creation" className="overlay" style={{display: (showing3 ? 'block' : 'none')}}>
            <textarea id='newSave' value={this.state.newName} onChange={e=> this.nameChange(e)}></textarea>
            <button onClick={()=>this.newSaveClicked()}>save</button>
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

          <div style={{display: (showing5 ? 'block' : 'none')}}>
            <h4>History</h4>
            <p>
              <div id="history" className="history">
                {JSON.stringify(this.state.docHistory)}


              </div>

            </p>

          </div>


          </div>

        </div>


        <div className="overlay" style={{display: (showing4 ? 'block' : 'none')}}>
          {this.state.docList.data.map((i) =>
            <ul key={i.id}>
              <button className="switching_button" onClick={()=>this.changeDoc(i.id)}>{i.name}</button>
              <button onClick={()=>this.removeDoc(i.id)}>x</button>
            </ul>
          )}
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



    this.setState({
      currentDocument:newDocument
    })

    this.state.docHistory.push(this.state.currentDocument)

    console.log(this.state.docHistory)
    console.log(newDocument)

    this.props.userSession.putFile(tempName, JSON.stringify(newDocument), options)
    this.props.userSession.putFile(tempHistName, JSON.stringify(this.state.docHistory), options)
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
            currentDocument:[],
            markdown:[]
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
     console.log(newlistDoc)
     const options = { encrypt: true }

     this.props.userSession.putFile('List.json', JSON.stringify(newlistDoc), options);
     this.setState({
       docList:newlistDoc
     })

     this.loadText(num)
     this.loadHistory(num)

    }

  newSaveClicked(){
    this.setState({ showing3: !this.state.showing3 })
    this.addToList()
  }

  removeDoc(num){
    if (num===this.state.curIndex){
      let newlistDoc={
        data:this.state.docList.data.filter(ent => ent.id != num),
        curIndex:this.state.docList.curIndex,
        curCount:this.state.docList.curCount
      }
       console.log(newlistDoc)
       const options = { encrypt: true }

       this.props.userSession.putFile('List.json', JSON.stringify(newlistDoc), options);////////////////////////////////////

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
     this.state.docList.data.push(newDocument)




     const options = { encrypt: true }

     this.props.userSession.putFile('List.json', JSON.stringify(this.state.docList), options);
     console.log(this.state.docList)


     let newDocument2 = {
       md: [],
       created_at: Date.now()
     }

     let tempName=String(this.state.docList.curCount).concat("document.json")

     this.props.userSession.putFile(tempName, JSON.stringify(newDocument), options)


     }

  nameChange(event){
     this.setState({
       newName:document.getElementById('newSave').value
     })

   }


}
