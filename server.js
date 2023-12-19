const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const regUser = require('./reg');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3001;
const twilio = require('twilio');
// const Api = require('./Api');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/HEMATOLOGY', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
var otpres=''
const sendOtpToEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hematologyps@gmail.com',
        pass: 'rpnc yovj lumz lknc',
      },
    });

    const mailOptions = {
      from: 'hematologyps@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Handle the error appropriately without rethrowing
  }
};

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password ,phoneNumber} = req.body;

    // Check if the email already exists in the database
    const existingUser = await regUser.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already exists. Please use another email.',
      });
    }

    const userObj = {
      name,
      email,
      password,
      phoneNumber,
    };

    const data = new regUser(userObj);
    await data.save();

    // Generate OTP only if the email doesn't exist
    const emailOtp = generateOTP();
    
    // Wait for the email to be sent before proceeding
    await sendOtpToEmail(email, emailOtp);

    res.status(200).json({
      message: 'User registered successfully. OTP sent to email.',
      data,
    });
  } catch (err) { 
    console.error('Error in registering user:', err.message);
    res.status(500).json({
      message: 'Error in registering user',
      error: err.message,
    });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await regUser.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Incorrect email or password' });
    }

    console.log('Retrieved Hashed Password:', user.password);

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log('Generated Hashed Password:', password);

    if (password !== user.password)  {
      return res.status(400).json({ success: false, message: 'Incorrect email or password' });
    }

    res.status(200).json({ success: true, message: 'Login successful.' });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Failed to login. Please try again.' });
  }
});


app.post('/send-otp-email', async (req, res) => {
  const { email } = req.body;
  
  const OTP = generateOTP();
  otpres=OTP
  try {
    await sendOtpToEmail(email, OTP);
    res.status(200).send('OTP sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send OTP');
  }
});
const accountSid = 'AC63e624ef078cd1bdc952ddfe999c02ec  ';
const authToken = '9bb524a594ef960827387bd70c4cac3d';
app.post('/send-otp-phone', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }


  try {
    
    const OTP = generateOTP();
    otpres = OTP
     console.log('Generated OTP:', OTP);

      /*********************************************/
       const client = require('twilio')("AC63e624ef078cd1bdc952ddfe999c02ec", "9bb524a594ef960827387bd70c4cac3d");

      try {
        await client.messages
          .create({
            body: `Your OTP is: ${OTP}`,
            from: '+12512902649',
            to: `+91${phoneNumber}`
          })

          console.log("MEssage sent")
          

      
      console.log(`Your OTP is: ${OTP}`)
    }

      catch(err) {
        console.log("Error occured at send-otp-phone post")
        console.log(err)
      }

      /*********************************************/

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
});
app.post('/verify-otp', (req, res) => {
  const { otp } = req.body;

  console.log("HERE****************")
  console.log(otp)
  console.log(otpres)

  if (otp === otpres) {
    res.status(200).json({
      message: 'OTP verified successfully. Redirecting to login.',
    });
  } else {
    res.status(400).json({
      message: 'Incorrect OTP. Please try again.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
