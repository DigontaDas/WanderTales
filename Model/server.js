import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import DestinationRouter from './routes/DestinationRoute.js'
import connectCloudinary from './config/cloudinary.js'
import storyRoute from './routes/storyRoute.js'
import weatherRouter from './routes/weatherRoute.js'
import statsRouter from './routes/statsRoute.js'

// App config
const app= express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
  credentials: true
}));

//api endpoints
app.use('/api/user',userRouter)
app.use("/api/destination",DestinationRouter)
app.use("/api/stories",storyRoute)
app.use("/api/stats", statsRouter)
app.use("/api/weather",weatherRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>console.log("Server is started on port "+port))