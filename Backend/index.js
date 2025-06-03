const express=require('express');
const app=express();
const dotenv=require('dotenv');
const cors=require('cors');

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT=process.env.PORT;
const connectDB=require('./config/db')
connectDB();

const userRoute=require('./routes/UserRoute');
const contestRoute=require('./routes/ContestRoute');
const submissionRoute=require('./routes/SubmissionRoute');
const judgeRoute=require('./routes/JudgeRoute');
const questionRoute=require('./routes/QuestionRoute');
const walletRoutes = require("./routes/WalletsRoute");

app.use('/api',userRoute);
app.use('/cont',contestRoute);
app.use('/sub',submissionRoute);
app.use('/judge',judgeRoute);
app.use('/qn',questionRoute);
app.use("/api/wallet", walletRoutes);

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(PORT,()=>{
    console.log("Server is on at PORT:",PORT);
})