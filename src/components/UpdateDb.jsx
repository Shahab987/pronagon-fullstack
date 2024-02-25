import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config";

const UpdateDb = () => {
  const [data, setData] = useState([]);

  // Function to fetch data, add new key-value pair, and update database
  const fetchDataAndUpdateDatabase = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/words`);
      const fetchedData = response.data;

      // Add new key-value pair to each object
      const updatedData = fetchedData.map((item) => ({
        name: item.name,
        meaning: "",
        audio_us: item.audio_us,
        level: 0,
        length: item.length,
      }));
      console.log(updatedData);
      setData(updatedData); // Update state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateDatabase = async () => {
    try {
      for (let i = 0; i < data.length; i++) {
        // Assuming you have an endpoint '/update-data/:id' to handle item updates
        await axios.post(`${BASE_URL}/words`, data[i]);
        console.log(`Item name: ${data[i].name} updated successfully`);

        // Introduce a delay of 100ms between each PUT request
        if (i < data.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <>
      <div onClick={fetchDataAndUpdateDatabase}>fetch</div>
      <div onClick={updateDatabase}>Update</div>
    </>
  );
};

export default UpdateDb;
