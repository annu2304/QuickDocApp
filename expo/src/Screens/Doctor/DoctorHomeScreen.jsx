import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import URL from "../../../test.api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// Custom Components
import Header from "../../Components/Header";
import { useNavigation } from "@react-navigation/native";
import TimeSlots from "./subcomponents/TimeSlots";
import CompleteModal from "./subcomponents/CompleteModal";

export default function DoctorHomeScreen({ navigation }) {
  const [profile, setProfile] = useState({});
  const [date, setDate] = useState(() => new Date());
  const [time, setTime] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  async function fetchAppointments() {
    try {
      setLoading(true);
      let user = await JSON.parse(await AsyncStorage.getItem("loggedUser"));
      setProfile({
        ...user,
      });
      const response = await axios.get(URL.Appointment.todayAppointment, {
        headers: {
          doctorid: user?._id,
        },
      });
      if (response.status == 200) {
        setAppointmentList(response.data?.appointmentList);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function getTime() {
    const hour = new Date().getHours();
    let slot;
    if (hour >= 10 && hour <= 12) {
      slot = "10-12";
    } else if (hour > 12 && hour <= 14) {
      slot = "12-14";
    } else if (hour > 15 && hour <= 17) {
      slot = "15-17";
    } else if (hour > 17 && hour <= 19) {
      slot = "17-19";
    } else if (hour > 21 && hour <= 23) {
      slot = "21-23";
    }
    return slot;
  }

  function fetchSlotsPatient() {
    let slot = new Date();
    let list = [];
    appointmentList.map((app) => {
      let date = new Date(app.date);
      if (
        date.getDate() == slot.getDate() &&
        date.getMonth() == slot.getMonth()
      ) {
        return list.push({
          ...app.patientId,
          timeSlot: app.timeSlot,
          doctor_id: app.doctorId,
          appointment_id: app._id,
        });
      }
    });
    const time = getTime();
    list = list.filter((l) => {
      return l.timeSlot == time;
    });
    return list;
  }

  useFocusEffect(
    useCallback(() => {
      let dat = new Date();
      setTime([
        dat.getHours() === 12 ? 12 : dat.getHours() % 12,
        dat.getMinutes(),
      ]);

      fetchAppointments();
    }, [])
  );

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 bg-background">
        <Header />
        {loading ? (
          <ActivityIndicator size="large" animating={loading} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className="px-2">
            {/* Doctor Home Page */}
            <View className="my-3 flex flex-row">
              {/* Doctor Avatar */}
              <View className="w-1/3 mx-auto">
                <Image
                  source={require("../../../assets/Icon/Doctor_Avatar.jpeg")}
                  className="h-20 w-20"
                />
              </View>

              {/* Todays Info */}
              <View className="w-2/3 mx-auto">
                <View className="mb-1 flex flex-row">
                  <View>
                    <Text className="text-xl font-bold">Today:</Text>

                    <Text className="text-xl">
                      {date.getDate() +
                        " /" +
                        date.getMonth() +
                        " /" +
                        date.getFullYear()}
                    </Text>
                  </View>

                  <View className="ml-5">
                    <Text className="text-xl font-bold">Time:</Text>

                    <Text className="text-xl">
                      {time[0] + ": " + time[1]}{" "}
                      {new Date().getHours() < 12 ? "a.m." : "p.m."}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl">
                  Welcome Dr. {profile && profile?.name?.split(" ")[0]}
                </Text>
              </View>
            </View>

            {/* Today's Appointment */}
            <View className="my-1">
              <Text className="font-boldfetchSlotsPatient text-xl">
                Today's Appointments:
              </Text>

              <View className="flex flex-row flex-wrap justify-around">
                <TimeSlots slot={"10-12"} appointmentList={appointmentList} />
                <TimeSlots slot={"12-14"} appointmentList={appointmentList} />
                <TimeSlots slot={"15-17"} appointmentList={appointmentList} />
                <TimeSlots slot={"17-19"} appointmentList={appointmentList} />
                <TimeSlots slot={"21-23"} appointmentList={appointmentList} />
              </View>
            </View>

            {/* Todays Patient List */}
            <View className="flex-1">
              <Text className="font-bold text-xl">Patient List:</Text>

              <View className="flex justify-around">
                <View className="mt-3">
                  {appointmentList && fetchSlotsPatient()?.length > 0 ? (
                    fetchSlotsPatient().map((patient, index) => (
                      <View
                        key={index}
                        className="p-1 m-1 rounded-lg border border-black/40 flex-row"
                      >
                        <View className="w-2/3">
                          <Text>Name: {patient.name}</Text>
                          <Text>
                            Gender: {patient.gender == 1 ? "Male" : "Female"}
                          </Text>
                          <Text>Mobile: {patient.mobile}</Text>
                          <Text>Slot: {patient?.timeSlot}</Text>
                        </View>

                        <CompleteModal
                          patient_id={patient._id}
                          patientName={patient.name}
                          completeModal={completeModal}
                          setCompleteModal={setCompleteModal}
                          appointment_id={patient.appointment_id}
                          doctor_id={patient.doctor_id}
                        />

                        <View className="w-1/3">
                          {patient?.status != "completed" ? (
                            <TouchableOpacity
                              onPress={() => setCompleteModal(true)}
                            >
                              <View className="justify-center align-center p-5 rounded-xl bg-green-500">
                                <Text className="text-center text-white font-bold">
                                  Complete
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View className="justify-center align-center p-5 rounded-xl bg-green-700">
                              <Text className="text-center text-white font-bold">
                                Appointment Completed
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text className="text-lg text-center">
                      No Appointment in this slot
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        <DoctorFooterMenu />
      </SafeAreaView>
    </>
  );
}

function DoctorFooterMenu() {
  const navigation = useNavigation();
  return (
    <View className="fixed bottom-10 w-[80%] h-auto left-[10%] p-1 bg-background border border-black/50 rounded-full">
      <View className="flex flex-row justify-around items-center">
        <Pressable
          className="h-[40] w-[15%]"
          onPress={() => navigation.navigate("DoctorAppointmentList")}
        >
          <Image
            source={require("../../../assets/Icon/CheckUp.jpeg")}
            className="h-[40] w-[100%]"
          />
        </Pressable>
        <Pressable
          className="h-[40] w-[15%]"
          onPress={() => navigation.navigate("DoctorProfile")}
        >
          <Image
            source={require("../../../assets/Icon/profile.png")}
            className="h-[40] w-[80%]"
          />
        </Pressable>
        <Pressable
          className="h-[40] w-[15%]"
          onPress={() => navigation.navigate("DoctorPatientList")}
        >
          <Image
            source={require("../../../assets/Icon/Ambulance.jpeg")}
            className="h-[44] w-[100%]"
          />
        </Pressable>
      </View>
    </View>
  );
}
