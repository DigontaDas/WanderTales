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
import hotelRestaurantRouter from './routes/hotel_restaurantRoute.js'

const app= express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()


app.use(express.json())

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://wander-tales.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

//api endpoints
app.use('/api/user',userRouter)
app.use("/api/destination",DestinationRouter)
app.use("/api/stories",storyRoute)
app.use("/api/stats", statsRouter)
app.use("/api/weather",weatherRouter)
app.use("/api", hotelRestaurantRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>console.log("Server is started on port "+port))


