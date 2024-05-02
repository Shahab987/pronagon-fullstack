const mongoose = require("mongoose");

// Connect to local MongoDB
mongoose.connect("mongodb://localhost:27017/local_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const localDB = mongoose.connection;

// Define mongoose schema for your data model
const yourSchema = new mongoose.Schema({
  // Define your schema fields
});

const LocalModel = mongoose.model("LocalModel", yourSchema);

localDB.on(
  "error",
  console.error.bind(console, "Local MongoDB connection error:")
);
localDB.once("open", async () => {
  console.log("Connected to local MongoDB database");

  // Fetch data from local database
  const localData = await LocalModel.find({});

  // Connect to online MongoDB
  mongoose.connect(
    "mongodb://<username>:<password>@<online_db_url>/<online_database>",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
  const onlineDB = mongoose.connection;

  onlineDB.on(
    "error",
    console.error.bind(console, "Online MongoDB connection error:")
  );
  onlineDB.once("open", async () => {
    console.log("Connected to online MongoDB database");

    // Fetch data from online database
    const onlineData = await OnlineModel.find({});

    // Compare and sync data
    localData.forEach(async (localItem) => {
      const onlineItem = onlineData.find((item) => item._id === localItem._id);

      if (!onlineItem) {
        // Item exists locally but not online, so add it online
        await OnlineModel.create(localItem);
      } else {
        // Item exists both locally and online, update if needed
        if (localItem.updatedAt > onlineItem.updatedAt) {
          await OnlineModel.findByIdAndUpdate(onlineItem._id, localItem);
        } else if (localItem.updatedAt < onlineItem.updatedAt) {
          await LocalModel.findByIdAndUpdate(localItem._id, onlineItem);
        }
      }
    });

    console.log("Data sync completed");
    // Close connections
    localDB.close();
    onlineDB.close();
  });
});
