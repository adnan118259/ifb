require("dotenv").config(); // تحميل المتغيرات من .env
const express = require("express");
const userRoutes = require("./routes/allUsers");
const loginUserRoute = require("./routes/authRoutes/LoginUserRout");
const registerUserRoute = require("./routes/authRoutes/RegisterUserRout");
const verifyUserRoute = require("./routes/authRoutes/VfcRout");
const resendVerifyUserRoute = require("./routes/authRoutes/ResendVfcUserRout");
const fgPassword = require("./routes/authRoutes/FgpasswordRout");

const mysql = require("mysql2/promise");
 const { getConnection } = require("./controllers/db");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

 
 app.get("/", async (req, res) => {
   try {
     const connection = await getConnection();
     // يمكن استخدام الاتصال لأي استعلام هنا
     await connection.end(); // اغلاق الاتصال بعد الاستخدام
     res.json({ message: "Connected to the database successfully!" });
   } catch (error) {
     console.error("خطأ في الاتصال:", error);
     res.status(500).json({ message: "Database connection failed." });
   }
 });


app.use("/api84818auth", registerUserRoute);
app.use("/api84818auth", loginUserRoute);
app.use("/api84818auth", verifyUserRoute);
app.use("/api84818auth", fgPassword);


app.use("/api118259y", userRoutes);
app.use("/api118259y", resendVerifyUserRoute);
 

app.listen(PORT, () => {
  console.log(`Server is running on Port:${PORT}`);
});
