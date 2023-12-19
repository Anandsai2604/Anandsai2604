const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 3002;
const YourFormModel = require('./temp')
const mongoose = require('mongoose')
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/HEMATOLOGY', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
}).then((res) => console.log("COnnected to mongo"))
.catch((err) => console.log(err))

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Function to handle Python script execution
const executePythonScript = (pythonScript, args, res) => {
  const pythonProcess = spawn('python', [pythonScript, ...args]);

  let predictionResult = '';
  let errorOutput = '';

  // Capture standard output
  pythonProcess.stdout.on('data', (data) => {
    predictionResult += data.toString();
  });

  // Capture error output
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  // Handle process closure
  pythonProcess.on('close', (code) => {
    console.log('Python script execution completed with code:', code);

    if (code === 0) {
      res.json({ prediction: predictionResult });
    } else {
      console.error('Python script execution failed with code:', code);
      console.error('Error output:', errorOutput);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Handle process error
  pythonProcess.on('error', (error) => {
    console.error('Error executing Python script:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
};

app.post('/predict', async (req, res) => {
  
  // const { Gender, Hemoglobin, MCH, MCHC, MCV, Model } = req.body;
  let dataToBeSaved = new YourFormModel({
    Gender: req.body.Gender,
    Hemoglobin: req.body.Hemoglobin,
    MCH: req.body.MCH,
    MCHC: req.body.MCHC,
    MCV: req.body.MCV,
    Model: req.body.Model
  })
  console.log('Received data:', {
    Gender: req.body.Gender,
    Hemoglobin: req.body.Hemoglobin,
    MCH: req.body.MCH,
    MCHC: req.body.MCHC,
    MCV: req.body.MCV,
    Modelction: req.body.Model
  });
  await dataToBeSaved.save()
  const args = [req.body.Gender, req.body.Hemoglobin, req.body.MCH, req.body.MCHC, req.body.MCV, req.body.Model];

  if (args.some((arg) => !arg)) {
    return res.status(400).json({ error: 'Missing required data in the request.' });
  }

  console.log("DATA SAVED")

  const pythonScript = 'predict.py';
  executePythonScript(pythonScript, args, res);
});

app.post('/optim', (req, res) => {
  console.log('Received optimistic prediction data:', req.body);

  const { Gender, Hemoglobin, MCV, Model } = req.body;
  const args = [Gender, Hemoglobin, MCV, Model];

  if (args.some((arg) => !arg)) {
    return res.status(400).json({ error: 'Missing required data in the request.' });
  }

  // Note: Omitting MCH and MCHC for optimistic prediction
  const pythonScript = 'optim.py';
  executePythonScript(pythonScript, args, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
