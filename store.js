const TempOtp = require('./temp'); // Import the TempOtp schema

// Route to send OTP via email
app.post('/otp', async (req, res) => {
  const { email } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpString = otp.toString();

    // Store OTP in the temporary OTP database
    await TempOtp.create({ email, otp: otpString });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hematologyps@gmail.com',
        pass: 'rpnc yovj lumz lknc',
      },
    });

    const mailOptions = {
      from: 'hematologyps@gmail.com',
      to: email.toString(),
      subject: 'OTP verification from Mykart',
      text: otpString,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});
