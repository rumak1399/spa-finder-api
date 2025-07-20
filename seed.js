import connectDB from "./config/db.js";
import State from "./models/State.js";


const insertData = async () =>{
    connectDB();
    try {
        // await State.insertMany(modifiedData)
        // console.log('Inserted:');
        const allData = await State.find({})
        console.log(allData)

        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}


insertData()