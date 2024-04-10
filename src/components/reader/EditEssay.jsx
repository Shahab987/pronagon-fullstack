import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BsX } from "react-icons/bs";
import axiosApi from "../../api/axiosApi";
import { BASE_URL } from "../../api/config";
import LoaderButton from "../ui/LoaderButton";

function EditEssay({ essay, setShowModal, loadEssays, handleSelectEssay }) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [title, setTitle] = useState(essay.title || "");
  const [text, setText] = useState(essay.content || "");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveEssay = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    if (title && text) {
      // return;
      axiosApi
        .put(`${BASE_URL}/essay/${essay._id}`, {
          title: title,
          content: text,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Saved");
            loadEssays();
            handleSelectEssay(res.data);
            setShowModal(false);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setSaveLoading(false);
        });
    } else {
      toast.error("Fill Title and Essay");
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div className="relative bg-gray-100 p-3 rounded-md">
        <div className="absolute text-2xl right-3">
          <button onClick={() => setShowModal(false)}>
            <BsX />
          </button>
        </div>
        <p className="text-2xl font-bold text-stone-500 ps-3 pb-3">
          Edit Essay
        </p>
        <form onSubmit={(e) => handleSaveEssay(e)}>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => handleChangeTitle(e)}
            className="p-2 border mb-2 w-full sm:w-150"
            placeholder="Title"
          />
          <textarea
            className="w-full p-2 border text-sm"
            name="textarea"
            id="textarea"
            cols="50"
            rows="8"
            value={text}
            onChange={(e) => handleChange(e)}
            placeholder="Paste your text here"
          />
          <div className="text-center mt-2">
            <LoaderButton
              loading={saveLoading}
              style="border w-50 p-2 bg-lime-600 text-lime-50"
              type="submit"
              text="Save"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEssay;
