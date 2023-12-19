const mongoose = require('mongoose');

const yourFormSchema = new mongoose.Schema({
  Gender: { type: String, required: true },
  Hemoglobin: { type: String, required: true },
  MCH: { type: String, required: true },
  MCHC: { type: String, required: true },
  MCV: { type: String, required: true },
  Model: { type: String, required: true },
});

const YourFormModel = mongoose.model('YourForm', yourFormSchema);

module.exports = YourFormModel;
