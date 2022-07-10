const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;
const DB = process.env.MONGO_URI;
const app = require("./server");

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((_) => {
		console.log("database successfully connected");
		app.listen(PORT, () => {
			console.log(`App running on port ${PORT}`);
		});
	});
