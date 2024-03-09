import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config";
import axiosApi from "../api/axiosApi";
import { dataNew } from "../db2";

const UpdateDb = () => {
  const [data, setData] = useState([]);

  // Function to fetch data, add new key-value pair, and update database
  const fetchDataAndUpdateDatabase = async () => {
    try {
      const response = await axiosApi.get(`${BASE_URL}/words/all`);

      const withNoMeaning = response.data
        .filter((item) => item.meaning === "")
        .map((item) => item.name);

      const fetchedData = response.data.map((item) => {
        const newWord = dataNew.find((i) => item.name === i.word);
        if (newWord) {
          return {
            ...item,
            meaning: newWord.meaning,
            pronunciation: newWord.pronunciation,
            example: newWord.example,
          };
        } else {
          return item;
        }
      });

      // Add new key-value pair to each object
      // const updatedData = fetchedData.map((item) => ({
      //   name: item.name,
      //   meaning: "",
      //   audio_us: item.audio_us,
      //   level: 0,
      //   length: item.length,
      // }));

      console.log(withNoMeaning);
      setData(fetchedData); // Update state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const OpenAiReq = async (word) => {
    try {
      const response = await axios.get(`${BASE_URL}/openai`, {
        params: {
          word: word,
        },
      });
      console.log(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateDatabase = async () => {
    try {
      for (let i = 0; i < data.length; i++) {
        // Assuming you have an endpoint '/update-data/:id' to handle item updates

        if (data[i].meaning) {
          await axiosApi.put(`${BASE_URL}/words/${data[i]._id}`, data[i]);
          console.log(`Item name: ${data[i].name} updated successfully`);

          // Introduce a delay of 100ms between each PUT request
          if (i < data.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
        }
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <>
      <div onClick={fetchDataAndUpdateDatabase}>fetch</div>
      {/* <div onClick={updateDatabase}>Update</div> */}
      <div onClick={OpenAiReq}>open Ai req</div>
    </>
  );
};

export default UpdateDb;
