import React, { useState } from "react";
import { BASE_URL } from "../api/config";
import axiosApi from "../api/axiosApi";

const UpdateDb = () => {
  // Function to fetch data, add new key-value pair, and update database
  const fetchDataAndUpdateDatabase = async () => {
    try {
      await axiosApi.get(`${BASE_URL}/words/all`).then((res) => {
        const wordsArray = res.data
          .filter((item) => item.meaning === "")
          .map((item) => item.name);
        console.log(wordsArray);
        if (wordsArray.length > 0) {
          // setDataNoDetail(res.data);
          OpenAiReq(wordsArray, res.data);
        }
      });

      // const withNoMeaning = response.data
      //   .filter((item) => item.meaning === "")
      //   .map((item) => item.name);

      // const fetchedData = response.data.map((item) => {
      //   const newWord = dataNew2.find((i) => item.name === i.word);
      //   if (newWord) {
      //     return {
      //       ...item,
      //       meaning: newWord.meaning,
      //       pronunciation: newWord.pronunciation,
      //       example: newWord.example,
      //     };
      //   } else {
      //     return item;
      //   }
      // });

      // Add new key-value pair to each object
      // const updatedData = fetchedData.map((item) => ({
      //   name: item.name,
      //   meaning: "",
      //   audio_us: item.audio_us,
      //   level: 0,
      //   length: item.length,
      // }));

      // setData(fetchedData); // Update state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const OpenAiReq = async (wordArr, dataNoDetail) => {
    try {
      await axiosApi
        .get(`${BASE_URL}/openaiarr`, {
          params: {
            word: JSON.stringify(wordArr),
          },
        })
        .then((res) => {
          console.log(JSON.parse(res.data.choices[0].message.content));
          // setData(JSON.parse(res.data.choices[0].message.content));

          const withDetailData = dataNoDetail.map((item) => {
            const newWord = JSON.parse(
              res.data.choices[0].message.content
            ).find((i) => item.name === i.word);

            if (newWord) {
              return {
                ...item,
                meaning: newWord.meaning,
                pronunciation: newWord.pronunciation,
                example: newWord.example,
              };
            } else {
              return newWord;
            }
          });
          updateDatabase(withDetailData);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateDatabase = async (DetailData) => {
    try {
      for (let i = 0; i < DetailData.length; i++) {
        // Assuming you have an endpoint '/update-DetailData/:id' to handle item updates

        if (DetailData[i].meaning) {
          await axiosApi
            .put(`${BASE_URL}/words/${DetailData[i]._id}`, DetailData[i])
            .then((res) => {
              console.log(
                `Item name: ${DetailData[i].name} updated successfully`
              );
            });

          // Introduce a delay of 100ms between each PUT request
          if (i < DetailData.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 30));
          } else {
            fetchDataAndUpdateDatabase();
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
      <div onClick={updateDatabase}>Update</div>
      <div onClick={OpenAiReq}>open Ai req</div>
    </>
  );
};

export default UpdateDb;
