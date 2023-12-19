import React, { useState, useEffect } from 'react';
import './main.css';

const YourFormComponent = () => {

  const [gender, setGender] = useState('Male');
  const [hemoglobin, setHemoglobin] = useState('');
  const [mch, setMch] = useState('');
  const [mchc, setMchc] = useState('');
  const [mcv, setMcv] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState('');
  const [predictionResults, setPredictionResults] = useState([]);
  const [groundStateHistory, setGroundStateHistory] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedGroundState, setSelectedGroundState] = useState('');
  const [groundStateTable, setGroundStateTable] = useState([]);

 
  useEffect(() => {
    const initialGroundStateValues = [
      { Gender: 'Male', Hemoglobin: '14.9', MCH: '22.7', MCHC: '29.1', MCV: '83.7', GroundState: '0' },
      { Gender: 'Male', Hemoglobin: '15.9', MCH: '25.4', MCHC: '28.3', MCV: '72', GroundState: '0' },
      { Gender: 'Female', Hemoglobin: '9', MCH: '21.5', MCHC: '29.6', MCV: '71.2', GroundState: '1' },
    ];
    
    setGroundStateHistory(initialGroundStateValues);

    const models = ['lr', 'knn', 'dt', 'gnb', 'rf', 'svm'];
    setAvailableModels(models);
  }, []);
  const handleInputChange = async (field, value) => {
    switch (field) {
      case 'Gender':
        setGender(value);
        break;
      case 'Hemoglobin':
        setHemoglobin(value);
        break;
      case 'MCH':
        setMch(value);
        break;
      case 'MCHC':
        setMchc(value);
        break;
      case 'MCV':
        setMcv(value);
        break;
      case 'selectedPrediction':
        setSelectedPrediction(value);
        break;
      case 'selectedGroundState':
        setSelectedGroundState(value);

        if (value) {
          const selectedGroundStateValues = groundStateHistory.find(
            (state) => state.GroundState === value
          );

          setGender(selectedGroundStateValues.Gender);
          setHemoglobin(selectedGroundStateValues.Hemoglobin);
          setMch(selectedGroundStateValues.MCH);
          setMchc(selectedGroundStateValues.MCHC);
          setMcv(selectedGroundStateValues.MCV);

          fetchGroundStateDetails(selectedGroundStateValues);
        } else {
          setGroundStateTable(null);
        }
        break;
      default:
        break;
    }
  };

  // Save current input values to history
  const saveGroundState = () => {
    const newHistory = [
      {
        Gender: gender,
        Hemoglobin: hemoglobin,
        MCH: mch,
        MCHC: mchc,
        MCV: mcv,
        GroundState: selectedPrediction,
      },
      ...groundStateHistory,
    ].slice(0, 3);

    setGroundStateHistory(newHistory);
  };


  const fetchData = async (url, formData) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status} status. Error: ${errorText}`);
      }

      const result = await response.json();
      return result.prediction;
    } catch (error) {
      console.error('Error submitting form:', error);
      return null;
    }
  };


  const fetchGroundStateDetails = async (selectedGroundStateValues) => {
    if (selectedGroundStateValues && selectedGroundStateValues.Gender) {
      try {
        const simulatedAsyncOperation = new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              Gender: selectedGroundStateValues.Gender,
              Hemoglobin: selectedGroundStateValues.Hemoglobin,
              MCH: selectedGroundStateValues.MCH,
              MCHC: selectedGroundStateValues.MCHC,
              MCV: selectedGroundStateValues.MCV,
              Anemic: selectedGroundStateValues.GroundState === '1' ? 'Anemic' : 'Non-Anemic',
            });
          }, 1000);
        });

        const result = await simulatedAsyncOperation;
        setGroundStateTable([result]);
      } catch (error) {
        console.error('Error fetching ground state details:', error);
      }
    }
  };

  // useEffect to update ground state details when selectedGroundState changes
  useEffect(() => {
    const selectedGroundStateValues = groundStateHistory.find(
      (state) => state.GroundState === selectedGroundState
    );
    fetchGroundStateDetails(selectedGroundStateValues);
  }, [selectedGroundState, groundStateHistory]);

  // Event handler for predict button
  const handlePredict = async () => {
    if (!selectedPrediction) {
      alert('Please select a model for prediction.');
      return;
    }

    const formData = {
      Gender: gender,
      Hemoglobin: hemoglobin,
      MCH: mch,
      MCHC: mchc,
      MCV: mcv,
      Model: selectedPrediction,
    };

    const optimisticPrediction = await fetchData('http://localhost:3002/optim', formData);
    const prediction = await fetchData('http://localhost:3002/predict', formData);

    setPredictionResults([{ model: selectedPrediction, prediction, optimisticPrediction }]);
    saveGroundState();
  };

  
  const handlePredictAll = async () => {
    const models = availableModels;
    const results = [];

    for (const model of models) {
      const formData = {
        Gender: gender,
        Hemoglobin: hemoglobin,
        MCH: mch,
        MCHC: mchc,
        MCV: mcv,
        Model: model,
      };

      const optimisticPrediction = await fetchData('http://localhost:3002/optim', formData);
      const prediction = await fetchData('http://localhost:3002/predict', formData);

      results.push({ model, prediction, optimisticPrediction });
    }

    setPredictionResults(results);
    saveGroundState();
  };

  
  const handleFetchGroundState = () => {
    if (selectedGroundState) {
      const selectedGroundStateValues = groundStateHistory.find(
        (state) => state.GroundState === selectedGroundState
      );

      if (selectedGroundStateValues) {
        setGender(selectedGroundStateValues.Gender);
        setHemoglobin(selectedGroundStateValues.Hemoglobin);
        setMch(selectedGroundStateValues.MCH);
        setMchc(selectedGroundStateValues.MCHC);
        setMcv(selectedGroundStateValues.MCV);
      } else {
        console.error(`No data found for Ground State: ${selectedGroundState}`);
      }
    }
  };

  return (
    <div>
      <div className='background'>
        <div className='select'>
          <label style={{ color: 'black' }}>Gender</label>
          <select value={gender} onChange={(e) => handleInputChange('Gender', e.target.value)}>
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </select>
        </div>

        {/* Other input fields */}
        {['Hemoglobin', 'MCH', 'MCHC', 'MCV'].map((field) => (
          <div className="input" key={field}>
            <label>{field}:</label>
            <input
              type="text"
              placeholder={`Enter ${field}`}
              value={eval(field.toLowerCase())}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        ))}

        
        <div className='select'>
          <label style={{ color: 'black' }}>Prediction Model</label>
          <select
            value={selectedPrediction}
            onChange={(e) => handleInputChange('selectedPrediction', e.target.value)}
          >
            <option value=''>Select Model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        
        <div className='select'>
          <label style={{ color: 'black' }}>Ground State</label>
          <select
            value={selectedGroundState}
            onChange={(e) => handleInputChange('selectedGroundState', e.target.value)}
          >
            <option value=''>Select Ground State</option>
            {groundStateHistory.map((state, index) => (
              <option key={index} value={state.GroundState}>
                {`${state.GroundState} - Gender: ${state.Gender}, Hemoglobin: ${state.Hemoglobin}, MCH: ${state.MCH}, MCHC: ${state.MCHC}, MCV: ${state.MCV}`}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons for predictions */}
        <div className='submit-container'>
          <button type='button' onClick={handlePredict}>
            Predict
          </button>
          <button type='button' onClick={handlePredictAll}>
            Predict All
          </button>
          <button type='button' onClick={handleFetchGroundState}>
            Fetch Ground State
          </button>
        </div>

        {predictionResults.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', color: 'white', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid white', padding: '8px' }}>Model</th>
                <th style={{ border: '1px solid white', padding: '8px' }}>Prediction</th>
                <th style={{ border: '1px solid white', padding: '8px' }}>Optimistic Prediction</th>
              </tr>
            </thead>
            <tbody>
              {predictionResults.map((entry, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid white', padding: '8px' }}>{entry.model}</td>
                  <td style={{ border: '1px solid white', padding: '8px' }}>{entry.prediction}</td>
                  <td style={{ border: '1px solid white', padding: '8px' }}>{entry.optimisticPrediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {groundStateTable && (
        <table style={{ borderCollapse: 'collapse', width: '100%', color: 'white', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid white', padding: '8px' }}>Ground State</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>Gender</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>Hemoglobin</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>MCH</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>MCHC</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>MCV</th>
              <th style={{ border: '1px solid white', padding: '8px' }}>Anemic Result</th>
            </tr>
          </thead>
          <tbody>
            {groundStateTable.map((entry, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.GroundState}</td>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.Gender}</td>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.Hemoglobin}</td>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.MCH}</td>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.MCHC}</td>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.MCV}</td>
                <td style={{ border: '1px solid white', padding: '8px' }}>{entry.Anemic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      </div>
    </div>
  );
};

export default YourFormComponent;