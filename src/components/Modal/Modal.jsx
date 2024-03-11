import React from "react";

//option sample
// options={{
//   title: "حذف کاربر",
//   message: "آیا از حذف کاربر اطمینان دارید؟",
//   warningMsg: "با حذف کاربر امکان بازگشت وجود ندارد",
//   yesButton: "بله",
//   noButton: "انصراف",
// }}

function Modal({ setShowModal, children }) {
  return (
    <div
      onClick={(e) => {
        setShowModal(false);
      }}
      className="w-screen z-999 backdrop-blur-sm h-screen  bg-black bg-opacity-40 fixed top-0 right-0 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-2 z-999 text-graydark p-8 rounded-lg shadow-xl"
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
