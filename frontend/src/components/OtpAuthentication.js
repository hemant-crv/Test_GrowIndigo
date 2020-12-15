import React, { Component } from 'react';
import axios from 'axios';

class OtpAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      number: '',
      session_details: '',
      optView: false,
      otp: [],
      verified: false,
      newUser: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOtpChange = this.handleOtpChange.bind(this);
    this.handleUserDeatailChange = this.handleUserDeatailChange.bind(this);
    this.logout = this.logout.bind(this);

    this.setTextInputRef = element => {
      this.textInput = element;
    };

  }

  componentDidMount() {
    this.isUserLoggedIn();
  }

  isUserLoggedIn() {
    axios.get('/api/otp/hassignned').then(response => {
      if (response.data.auth) {
        this.setState({ number: response.data.number, firstname: response.data.firstname, lastname: response.data.lastname, email: response.data.email, optView: true, verified: true });
      }
    })
  }

  handleChange(event) {
    this.setState({ number: event.target.value });
  }

  handleSubmit(event) {
    if (!this.state.optView) {
      axios.get('/api/otp/generate', {
        params: {
          mobile_no: this.state.number
        }
      }).then(response => {
        this.setState({
          session_details: response.data.Details,
          optView: true
        })
      })
        .catch(err => {
          alert('Invalid number');
        });
    }
    else if (this.state.optView && !this.state.verified) {
      axios.get('/api/otp/validation', {
        params: {
          otp: this.state.otp.join(""),
          session: this.state.session_details,
          number: this.state.number
        }
      }).then(response => {
        this.setState({
          verified: true,
          newUser: response.data.newUser,
          firstname: response.data.firstname
        })
      })
        .catch(err => {
          alert('otp invalied');
        });
    }
    else {
      axios.post('/api/otp/signup', {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        number: this.state.number,
        email: this.state.email
      }).then(response => {
        this.setState({
          userCreated: true
        })

        alert('user created');
      })
        .catch(err => {
          alert('invalid param');
        });
    }

    event.preventDefault();
  }
  handleOtpChange(event) {
    let otp = this.state.otp;
    otp[event.nativeEvent.target.id] = event.nativeEvent.data;
  }

  handleUserDeatailChange(event) {
    const { target: { name, value } } = event
    this.setState({ [name]: value });
  }

  logout() {
    axios.get('/api/otp/logout').then(response => {
      this.setState({ number: '', firstname: '', lastname: '', email: '', optView: false, verified: false, newUser: false, userCreated: false });
    })
  }

  autoTab(event) {
    const BACKSPACE_KEY = 8;
    const DELETE_KEY = 46;
    let id = event.target.attributes.id.value
    id = Number(id);
    if (event.keyCode === BACKSPACE_KEY) {
      id -= 1;
    } else if (event.keyCode !== DELETE_KEY) {
      id += 1;
    }
    if (document.getElementById(id))
      document.getElementById(id).focus();
  };

  render() {
    return (
      <div className="container">
        <div className="login">
          <form onSubmit={this.handleSubmit} autoComplete="off" autoFocus>
            {!this.state.optView &&
              <div>
                <span className="heading">Hi! Welcome to Grow Indigo</span>
                <input type="tel" id="phone" name="phone" placeholder="Enter your number" maxLength="10" pattern="^[6-9]\d{9}$" value={this.state.number} onChange={this.handleChange} required className="input_mobile_no" autoFocus />
                <button className="submit" type="submit" value="Submit">Continue</button>
              </div>
            }
            {this.state.optView && !this.state.verified &&
              <div>
                <span className="heading">Please Verify the OTP</span>
                <input type="text" className="otp_input" id="0" maxLength="1" onKeyUp={this.autoTab} onChange={this.handleOtpChange} required autoFocus />
                <input type="text" className="otp_input" id="1" maxLength="1" onKeyUp={this.autoTab} onChange={this.handleOtpChange} required />
                <input type="text" className="otp_input" id="2" maxLength="1" onKeyUp={this.autoTab} onChange={this.handleOtpChange} required />
                <input type="text" className="otp_input" id="3" maxLength="1" onKeyUp={this.autoTab} onChange={this.handleOtpChange} required />
                <input type="text" className="otp_input" id="4" maxLength="1" onKeyUp={this.autoTab} onChange={this.handleOtpChange} required />
                <input type="text" className="otp_input" id="5" maxLength="1" onKeyUp={this.autoTab} onChange={this.handleOtpChange} required />
                <button className="verify_submit" type="submit" value="Submit">Verify</button>
              </div>
            }
            {this.state.verified && this.state.newUser && !this.state.userCreated && this.state.optView &&
              <div>
                <span className="heading">OTP Verified! You are new user please provide following details</span>
                <input type="text" name="firstname" placeholder="First Name" onChange={this.handleUserDeatailChange} required className="input_mobile_no" />
                <input type="text" name="lastname" placeholder="Last Name" onChange={this.handleUserDeatailChange} required className="input_mobile_no" />
                <input type="email" name="email" placeholder="Email Address" onChange={this.handleUserDeatailChange} required className="input_mobile_no" />
                <br />
                <button className="submit" type="submit" value="Submit">Sign Up</button>
              </div>
            }
            {this.state.verified && !this.state.newUser &&
              <div>
                <span className="heading">Signed in successfully! Welcome back {this.state.firstname}</span>
                <button className="verify_submit" onClick={this.logout} >Log Out</button>
              </div>
            }
            {this.state.verified && this.state.userCreated &&
              <div>
                <span className="heading">Account created successfully! Welcome {this.state.firstname}</span>
                <button className="verify_submit" onClick={this.logout} >Log Out</button>
              </div>
            }
          </form>
        </div>
      </div>
    );
  }
}

export default OtpAuthentication;