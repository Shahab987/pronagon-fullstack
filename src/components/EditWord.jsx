import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axiosApi from "../api/axiosApi";
import { BASE_URL } from "../api/config";

function EditWord({ item, setShowModal, FetchWords, level }) {
  const [word, setWord] = useState(item);

  function handleChange(e) {
    setWord((p) => {
      return {
        ...p,
        [e.target.name]: e.target.value,
        level,
      };
    });
  }
  const updateWord = () => {
    axiosApi
      .put(`${BASE_URL}/words/${item._id}`, word)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Saved...");
          FetchWords();
          setShowModal(false);
        }
      })
      .catch((err) => console.error(err));
  };

  function submitForm(e) {
    e.preventDefault();

    updateWord();
  }

  useEffect(() => {
    setWord((p) => {
      return { ...p, length: word.name.length };
    });
  }, [word.name]);

  return (
    <div className="p-4 bg-slate-50 flex flex-col rounded-lg gap-2">
      <h1 className="text-lg font-bold text-lime-700">Edit Word</h1>
      <input
        onChange={(e) => handleChange(e)}
        value={word.name}
        type="text"
        name="name"
        className="border rounded p-2 w-full  "
        id=""
      />
      <input
        onChange={(e) => handleChange(e)}
        value={word.pronunciation}
        type="text"
        name="pronunciation"
        className="border rounded p-2 w-full  "
        id=""
      />
      <input
        onChange={(e) => handleChange(e)}
        value={word.meaning}
        type="text"
        name="meaning"
        dir="rtl"
        className="border rounded p-2 w-full font-IranSans "
        id=""
      />
      <input
        onChange={(e) => handleChange(e)}
        value={word.example}
        type="text"
        name="example"
        className="border rounded p-2 w-full "
        id=""
      />

      <div className="flex justify-center gap-4">
        <button
          className="p-2 border rounded w-50"
          onClick={() => setShowModal(false)}
        >
          Cancle
        </button>
        <button
          className="p-2 border rounded w-50 bg-lime-900 text-gray-50"
          onClick={(e) => submitForm(e)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EditWord;
