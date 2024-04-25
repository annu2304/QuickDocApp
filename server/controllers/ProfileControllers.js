const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

const getProfile = async (req, res, next) => {
  let patient = req.patient;
  try {
    if (patient.role == 3) {
      patient = await Patient.findById(patient._id)
        .populate("medicalRecord")
        .populate("doctorId");
      if (patient) return res.status(200).json({ ack: true, patient });
      else return res.status(404).json({ ack: false, err: "No user found" });
    }
  } catch (error) {
    return res.status(500).json({ ack: false, err: error });
  }
};

const updateProfile = async (req, res, next) => {
  let { updateData } = req.body;
  let patient = req.patient;

  try {
    if (patient.role == 3) {
      patient = await Patient.findByIdAndUpdate(patient._id, {
        $set: { ...updateData },
      });
      if (patient) {
        let updatedPatient = await Patient.findById(patient._id)
          .populate("medicalRecord")
          .populate("doctorId");
        return res.status(200).json({ ack: true, updatedPatient });
      } else throw new Error("Error updating user profile");
    }
  } catch (err) {
    return res.status(500).json({ ack: false, err });
  }
};

const getAppointments = async (req, res, next) => {
  const patient = req.patient;
  const { status } = req.query;
  try {
    let date = new Date().setHours(0, 0, 0, 0);
    let appointmentList;
    if (status == "all") {
      appointmentList = await Appointment.find({
        patientId: patient._id,
        // date: {
        //   $gte: date,
        // },
      }).populate("doctorId");
    } else
      appointmentList = await Appointment.find({
        patientId: patient._id,
        status,
      }).populate("doctorId");
    if (appointmentList) {
      return res.status(200).json({ ack: true, appointmentList });
    } else throw new Error("Error fetching Appointments");
  } catch (err) {
    return res.status(500).json({ ack: false, err });
  }
};

const getSpecificDoctor = async (req, res, next) => {
  const { specialization } = req.query;

  try {
    let doctorList;
    if (specialization != "all")
      doctorList = await Doctor.find({
        specialization,
      });
    else doctorList = await Doctor.find({});

    if (doctorList) {
      return res.status(200).json({ ack: true, doctorList });
    } else throw new Error("Error fetching Appointments");
  } catch (err) {
    return res.status(500).json({ ack: false, err });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAppointments,
  getSpecificDoctor,
};
