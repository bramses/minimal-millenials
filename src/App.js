import React, { Component } from 'react';
import './App.css';
import CountUp from 'react-countup';
import classNames from "classnames";
import fb from './if_square-facebook_317727.png';
import tw from './if_twitter_317720.png';
import em from './if_aiga_mail_134146.png';
import resources from './resources';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      error: '',
      pledgesSigned: 0,
      success: false,
      begin: 1,
      end: 1,
      plural: 'person has',      
      resources: resources.resources
    }
  }
  
  updateEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }

  updateFirstName(evt) {
    this.setState({
      firstName: evt.target.value
    })
  }

  async componentDidMount() {
    
    const response = await fetch('/pledgeCount')
    const pledges = await response.json()
    this.setState({
      end: pledges.length,
      begin: Math.floor(pledges.length - (pledges.length * .8))
    })
    if (this.state.end > 1) {
      this.setState({
        plural: 'people have'
      })
    }
  }


  async submitPledgeEvent() {
    
    try {
      const response = await this.callApi({
        email: this.state.email,
        firstName: this.state.firstName
      })
      if (response.message === 'Invalid email') {
        this.setState({
          error: 'Invalid email'
        })
      } else if (response.message === 'Email Taken') {
        this.setState({
          error: 'Email already in system'
        })
      } else {
         this.setState({
          success: true,
          error: ''
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async callApi(o) {
    try {
      const { email, firstName } = o
      const response = await fetch('/validate', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email,
          firstName: firstName 
        }),
        headers: { "Content-Type": "application/json" }
      })
     
      return response.json()
    } catch (error) {
      throw error
    }  
  }

  render() {

    let splashClass = classNames({
        hidden: !this.state.success
    })

    let formClass = classNames({
      hidden: this.state.success
    })

    let errorClass = classNames({
      hidden: this.state.error === '',
      error: true
    })

    let emailClass = classNames({
      rounded: true
    })

    let resourceClass = classNames({
      resource: true
    })


    return (
      <div className="App">
        <header>
          <h1 className="App-title">Minimal Millenials</h1>
        </header>
        <div className={formClass}>
          <h2>
            What is Minimalism?
          </h2>
          <p className="center">Minimalism is the act of minimizing the noise in your life so you can focus on the signal instead.</p>
            <p className="center">-----------------</p>
            <p className="center">Intentionally choosing a life with less material goods, to instead focus on the important things in life.</p>
            <p className="center">-----------------</p>
            <h3 className="center">Ready to choose a better life? Pledge below</h3>
            <br />
          <div>
            <input value={this.state.email} placeholder="Email" name="email" className={emailClass} onChange={evt => this.updateEmail(evt)}/>
            <br />
            <span className={errorClass}>{this.state.error}</span>
            <br />
            <input value={this.state.firstName} name="name" placeholder="First Name" className="rounded" onChange={evt => this.updateFirstName(evt)}/>
            <br />
            <br />
            <button className="myButton" onClick={evt => this.submitPledgeEvent(evt)}>Submit</button>
            <p><em>Upon pledging, we'll send you a PDF with 7 tips to help you get started with minimalism</em></p>
          </div>
        </div>
        <div className={splashClass}>
          <h2>Thank you for Pledging</h2>
          <div>
            Share minimalism with other people!
          </div>
          <br />
          <div>
            <a href="http://www.facebook.com/sharer.php?u=https://minimalmillenials.org">
              <img src={fb} className="sharingIcons" rel="noopener noreferrer" alt="Facebook" />
            </a>
            <a href="https://twitter.com/share?url=https://minimalmillenials.org&amp;text=Less+is+more+they+say%21++%C2%AF%5C_%28%E3%83%84%29_%2F%C2%AF&amp;hashtags=minimalism">
              <img src={tw} className="sharingIcons" rel="noopener noreferrer" alt="Twitter" />
            </a>
            <a href="mailto:?Subject=Simple Share Buttons&amp;Body=Just+pledged+to+be+more+minimalistic+and+I+thought+of+you%21+Join+me%21 https://minimalmillenials.org">
              <img src={em} className="sharingIcons" rel="noopener noreferrer" alt="Email" />
            </a>
          </div>
        </div>
        <p><CountUp start={this.state.begin} end={this.state.end} className="pledge"/> <b> {this.state.plural} taken the challenge</b></p>
        
        <h2>Resources</h2>
        <p><em>(Updated infrequently)</em></p>
        <div className="center">
          <ul>
            {this.state.resources.map(((o) => {
              return <li key={o.link}><a href={o.link} target="_blank" rel="noopener noreferrer" className={resourceClass}>{o.description}</a></li>
            }))}
          </ul>
        </div>

        <p>{this.state.inputValue}</p>
        <div className="contact">
          <a href="mailto:bram@usrbinblog.com">Contact</a>
        </div>
      </div>
    );
  }
}

export default App;
