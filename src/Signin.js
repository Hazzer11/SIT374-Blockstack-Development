import React, { Component } from 'react';

export default class Signin extends Component {

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing" id="section-1">
        <div className="app-title">
          <h1 className="landing-heading">Login to PaperState</h1>
        </div>
        <div className="sign-in-blockstack">
          <button
            className="btn btn-primary btn-lg btn-mar"
            id="signin-button"
            onClick={ handleSignIn.bind(this) }
          >Sign In Blockstack ID</button>
        </div>
      </div>
    );
  }
}
