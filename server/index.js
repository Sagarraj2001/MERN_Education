const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");
require("./Config/DB");
const AdminCourse=require("./Routes/Admin/CourseRoute");
const AuthRoute=require("./Routes/AuthRoutes");
const DashboardRoute=require("./Routes/Admin/DashboardRoute");
const UserRoutes=require("./Routes/UserRoutes");
const BatchRoute=require("./Routes/Admin/BatchRoute");
const UserRoute=require("./Routes/Admin/UserRoute");
const CourseRoute=require("./Routes/CourseRoutes");
const path = require('path');

const app=express();

app.use(cors({
    origin:"https://mern-education.vercel.app",
    methods:["PUT","POST","GET","DELETE"],
    credentials:true
}));

app.use(express.json());


app.use('/uploads/course_images', express.static(path.join(__dirname, 'Uploads/course_images')));
app.use('/uploads/chapter_pdfs', express.static(path.join(__dirname, 'Uploads/chapter_pdfs')));

app.use(cookieParser());

dotenv.config();

const port=process.env.PORT;







app.use("/api",AuthRoute);
app.use("/api",AdminCourse);
app.use("/api",DashboardRoute);
app.use("/api",UserRoutes);
app.use("/api",BatchRoute);
app.use("/api",UserRoute);
app.use("/api",CourseRoute);




app.listen(port,()=>{
    console.log(`app is running at port ${port}`);
})
