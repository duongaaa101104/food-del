import 'dotenv/config'
import express from "express"
import cors from "cors"
import path from "path";
import { connectDB } from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoute.js";

import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors())

// DB connection
connectDB();



//API endpoint
app.use("/api/food",foodRoutes)
app.use("/images", express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)



app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})
//npm run server