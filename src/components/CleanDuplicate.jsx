// const cleanDatabaseDoubl = async () => {
//   //finds unique items
//   var array1 = words.filter(
//     (arr, index, self) => index === self.findIndex((t) => t.name === arr.name)
//   );
//   // unique ids
//   const idsInArray1 = array1.map((item) => item.id);

//   // Finds doublicates ids
//   const doplicatedIds = words
//     .filter((item) => !idsInArray1.includes(item.id))
//     .map((item) => item.id);

//   try {
//     // Iterate over each ID and send individual DELETE requests
//     for (let i = 0; i < doplicatedIds.length; i++) {
//       const id = doplicatedIds[i];
//       await fetch(`http://127.0.0.1:5000/words/${id}`, {
//         method: "DELETE",
//       });
//       // Set the response after each item is successfully deleted
//       console.log({ message: `Item with ID ${id} deleted successfully` });
//       // Add a 0.5 second delay between requests
//       await new Promise((resolve) => setTimeout(resolve, 300));
//     }
//     // Set the final response after all items have been successfully deleted
//     console.log({ message: "All items deleted successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     console.log({ error: error.message });
//   }
// };
