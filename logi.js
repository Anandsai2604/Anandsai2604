import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [action, setAction] = useState('Sign Up');
  const [otpMethod, setOtpMethod] = useState('email');
  const [otp, setOtp] = useState('');
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const navigate = useNavigate();

  const sendOtpToEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-otp-email', {
        email,
      });
      console.log(response.data);
      alert('OTP sent successfully. Check your email.');
      setIsOtpVisible(true);
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const sendOtpToPhone = async () => {
    try {
      console.log('Sending OTP to phone:', phoneNumber);
      const response = await axios.post('http://localhost:3001/send-otp-phone', {
        phoneNumber,
      });
      console.log(response.data);
      alert('OTP sent successfully. Check your phone.');
      setIsOtpVisible(true);
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:3001/verify-otp', {
        otp,
      });

      console.log(response);

      if (response.status === 200) {
        setIsOtpVisible(false); // Hide OTP input after verification
        // alert('OTP verification successful. Proceeding to signup.');
        handleSignup(); // Only proceed to signup if OTP is verified
      } else {
        alert('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3001/signup', {
        name,
        email,
        password,
        phoneNumber,
      });
    
      console.log('Server Response:', response); // Log the entire response for debugging
    
      if (response.status === 200) {
        navigate('/main');
      } else if (response.status === 400) {
        if (response.data.message && response.data.message.includes('Email already exists')) {
          alert('Email already exists. Please use another email.');
        } else {
          console.log('Signup error:', response.data.message);
          alert('Failed to signup. Please try again.');
        }
      } else {
        console.error('Unexpected response:', response);
        alert('Failed to signup. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Failed to signup. Please try again.');
    }
  };
 
  const handleLogin = async () => {
    try {
      // Check if email and password are not empty
      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
  
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });
  
      console.log('Full Response:', response);
  
      if (response.status === 200 && response.data.success) {
        // Login successful
        // alert('Login successful!');
        navigate('/main');
      } else {
        // Login failed due to incorrect email or password
        alert('Incorrect email or password. Please try again.');
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error('Login error:', error);
      console.log('Error response:', error.response); // Add this line
      alert('Failed to login. Please try again.');
    }
  };
 
  const sendOtp = async () => {
    try {
      if (otpMethod === 'email') {
        await sendOtpToEmail();
      } else if (otpMethod === 'phonenumber') {
        await sendOtpToPhone();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOrSignup = async () => {
    if (isOtpVisible) {
      // If OTP is visible, handle OTP verification
      await handleVerifyOtp();
    } else {
      // If OTP is not visible, handle signup
      await handleSignup();
    }
  };

  return (
    <div className="container">
    <div className='scroll-container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === 'Sign Up' && (
          <div className="input">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {action === 'Sign Up' && (
          <div className="input">
            <label>How would you like to receive OTP?</label>
            <select
              value={otpMethod}
              onChange={(e) => {
                setOtpMethod(e.target.value);
                setIsOtpVisible(true); // Set isOtpVisible to true when the option is selected
              }}
            >
              <option value="email">Email</option>
              <option value="phonenumber">Phone Number</option>
            </select>
          </div>
        )}
        {action === 'Sign Up'  && (
          <div className="input">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        )}
        {action === 'Sign Up' && isOtpVisible && (
          <div className="input">
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}
        {action === 'Sign Up' && (
          <div className="submit-container">
            <button onClick={sendOtp}>Send OTP</button>
            <button onClick={handleVerifyOrSignup}>
              {isOtpVisible ? 'Verify OTP' : 'Signup'}
            </button>
          </div>
        )}

        {action === 'Login' && (
          <div className="submit-container">
            <button onClick={handleLogin}>Login</button>
          </div>
        )}

        <div
          className={action === 'Sign Up' ? 'submit gray' : 'submit'}
          onClick={() => setAction('Login')}
        >
          Login
        </div>
        <div
          className={action === 'Login' ? 'submit gray' : 'submit'}
          onClick={() => setAction('Sign Up')}
        >
          Sign Up
        </div>
      </div>
    </div>  
    </div>
  );
};

export default Login;
