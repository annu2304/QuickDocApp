import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import URL from "../../../test.api";
import styles from "../../ExternalStyles";
import TabBar from "./subcomponents/TabBar";
import Search from "./subcomponents/Search";

const AppointmentList = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [appointmentList, setAppointmentList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  // Search
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(1);
  // 1 -doctor 2- date

  // Fetch appointments
  async function fetchAppointment() {
    try {
      setLoading(true);
      const response = await axios.get(URL.Admin.fetchAppointmentList, {
        params: { status: activeTab, search, searchType },
      });

      if (response.status === 200) {
        setAppointmentList(response.data?.appointments);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log("Error in fetching Appointment", err);
      Alert.alert("Error in fetching Appointment List");
    }
  }

  useEffect(() => {
    fetchAppointment();
  }, [activeTab]);

  function formatDate(date) {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
  }

  function getStatus(status) {
    switch (status) {
      case "pending":
        return <Text className="text-orange-500">Pending</Text>;
      case "approved":
        return <Text className="text-green-500">Approved</Text>;
      case "rejected":
        return <Text className="text-red-500">Rejected</Text>;
      case "completed":
        return <Text className="text-grey-500">Completed</Text>;
    }
  }
  return (
    <SafeAreaView className="flex-1 px-2">
      <StatusBar style="dark" />
      {/* Nav View */}
      <View className="mb-2 p-2 flex flex-row justify-between items-center border-b-2 border-b-black/60 ">
        <Text className="text-xl font-bold">Appointments</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-blue-600">back</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <View>
          <Search
            search={search}
            setSearch={setSearch}
            searchType={searchType}
            setSearchType={setSearchType}
            fetchAppointment={fetchAppointment}
          />
        </View>
        {/* Appointments */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {loading ? (
          <ActivityIndicator size={"large"} animating={loading} />
        ) : (
          appointmentList && (
            <>
              <Text className="my-1 text-lg">
                Total Appointments: {appointmentList.length}
              </Text>
              {/* Render other content based on the activeTab */}
              <ScrollView>
                {appointmentList.length > 0 &&
                  appointmentList?.map((appointment) => (
                    <View
                      key={appointment._id}
                      className="my-2 p-2 border border-black/40 rounded-lg"
                      // style={styles.shadow}
                    >
                      <Text numberOfLines={1}>
                        Date: {formatDate(appointment?.date)}
                      </Text>
                      <Text>Patient: {appointment?.patientId?.name}</Text>
                      <Text>Doctor: {appointment?.doctorId?.name}</Text>
                      <Text numberOfLines={2}>
                        Reason: {appointment?.reason}
                      </Text>
                      <Text>Status: {getStatus(appointment?.status)}</Text>
                    </View>
                  ))}
              </ScrollView>
            </>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppointmentList;
