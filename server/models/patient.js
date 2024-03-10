const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = {
  name: String,
  relationship: String,
  contact: Number,
};

const patientSchema = new Schema({
  role: {
    type: Number,
    default: 3,
    required: true,
  },
  avatar: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  mobile: {
    type: Number,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return v.toString().length >= 10;
      },
      message: (props) =>
        `${props.value} is not a valid mobile number! It must be at least 10 digits long.`,
    },
    required: true,
  },
  gender: {
    type: Number,
    enum: [1, 2],
    // 1-male 2-female
    required: true,
  },
  address: {
    type: String,
  },
  medicalHistory: {
    existing: { type: [String], default: null },
    allergies: { type: [String], default: null },
    medications: { type: [String], default: null },
  },
  emergencyContacts: { type: [contactSchema], default: null },
});

patientSchema.pre("save", function (next) {
  if (this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log("Error Generating salt", err);
        return next(err);
      }

      bcrypt.hash(this.password, salt, async (err, hash) => {
        if (err) {
          console.log("Error Creating hashed pass", err);
          return next(err);
        }
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// patientSchema.post("save", function (next) {
//   console.log("Document Inserted: ", this);
// });

module.exports = mongoose.model("patient", patientSchema);