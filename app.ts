import express from 'express';
const dotenv = require('dotenv');
import AuthRouter from './Routes/Auth.route';
const cors = require('cors');
import OtpRouter from './Routes/otp.route';
import NotesRouter from './Routes/Notes.route';
const mongoose = require('mongoose');


const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/auth',AuthRouter);
app.use('/otp',OtpRouter);
app.use('/notes',NotesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect(process.env.MONGO_URI as string)
    .then(()=>console.log('Connected to MongoDB'))
    .catch((err:Error)=>console.log("Error connecting to MongoDB",err));
})



