const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
const path = require("path"); // استيراد هذا لتسهيل التعامل مع مسارات الملفات  

const { getConnection } = require("./db");

// دالة لاسترجاع جميع البيانات
async function getAllData(table, where = null, values = null, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال

  // بناء الاستعلام الأساسي
  let query = `SELECT * FROM ${table}`;

  // إضافة شرط WHERE إذا كان موجودًا
  if (where) {
    query += ` WHERE ${where}`;
  }

  // ضبط القيم للاستعلام
  let queryValues = values ? values : [];

  try {
    const [results] = await connection.execute(query, queryValues);
    await connection.end();

    return { status: "success", data: results }; // هيكل موحد
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "There is a problem retrieving data" }; // رسالة الخطأ
  }
}
// دالة لاسترجاع بيانات فردية
async function getData(table, where = null, values = null, json = true) {
  const connection = await mysql.createConnection(dbConfig);

  const query = `SELECT * FROM ${mysql.escapeId(table)} WHERE ${where}`;

  try {
    const [results] = await connection.execute(query, values);
    await connection.end();

    if (results.length > 0) {
      return { status: "success", data: results[0] };
    } else {
      return { status: "failure", message: "No Data" };
    }
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "There is a problem retrieving data" };
  }
}

// دالة لإدراج بيانات جديدة
async function insertData(table, data, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال

  const fields = Object.keys(data).join(", ");
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(", ");

  const query = `INSERT INTO ${mysql.escapeId(
    table
  )} (${fields}) VALUES (${placeholders})`;

  try {
    await connection.execute(query, Object.values(data));
    await connection.end();

    return json ? { status: "success" } : null;
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "There is a problem inserting data" };
  }
}

// دالة لتحديث البيانات
async function updateData(table, data, where, values, json = true) {
  const connection = await getConnection(); // الحصول على الاتصال
  const setClause = Object.keys(data)
    .map((key) => `${mysql.escapeId(key)} = ?`)
    .join(", ");

  const query = `UPDATE ${mysql.escapeId(
    table
  )} SET ${setClause} WHERE ${where}`;

  try {
    await connection.execute(query, [...Object.values(data), ...values]);
    await connection.end();

    return json ? { status: "success" } : null;
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "هناك مشكلة في تحديث البيانات" };
  }
}

// دالة لحذف البيانات
async function deleteData(table, where, values, json = true) {
  const connection = await mysql.createConnection(dbConfig);

  const query = `DELETE FROM ${mysql.escapeId(table)} WHERE ${where}`;

  try {
    await connection.execute(query, values);
    await connection.end();

    return json ? { status: "success" } : null;
  } catch (error) {
    console.error("Database query error: ", error);
    await connection.end();
    return { status: "failure", message: "هناك مشكلة في حذف البيانات" };
  }
}

// دالة لإرسال البريد الإلكتروني

/*
. استخدام كلمة مرور خاصة بالتطبيق:
إذا كانت المصادقة الثنائية مفعلة، يجب عليك إنشاء كلمة مرور خاصة بالتطبيق. اتبع الخطوات التالية:

انتقل إلى حساب Google.
اذهب إلى قسم "الأمان".
ابحث عن "تسجيل الدخول إلى Google" ثم اختر "كلمات مرور التطبيقات".
اتبع التعليمات لإنشاء كلمة مرور تطبيق جديدة.
استخدم كلمة المرور هذه بدلاً من كلمة مرور حساب Gmail في كودك.
*/
 
const sentMail = async (to, cc,name, subjectTitle, verificationCode, logoUrl) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "a934916@gmail.com", // بريدك الإلكتروني
      pass: "gxiruzcgkyhbgrjt", // كلمة مرور بريدك الإلكتروني
    },
  });

  const mailOptions = {
    from: "yabro",
    to: to,
    subject: subjectTitle,
    html: `  
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">  
        <div style="text-align: center;">  
          <img src="${logoUrl}" alt="Logo yabro" style="width: 150px;"/>  
        </div>  
        <h2 style="color: #333;">Dear, ${name}</h2>  
        <p style="font-size: 16px; color: #555;">Your verification code is:</p>  
        <h3 style="color: #007BFF;">${verificationCode}</h3>  
        <p style="font-size: 16px; color: #555;">Please use this code to complete your registration.</p>  
        
        <hr style="margin: 20px 0;">  
        
        <p style="font-size: 14px; color: #999;">If you did not request this code, you can ignore this email.</p>  
        <footer style="margin-top: 20px; font-size: 14px; color: #999;">  
          &copy; 2025 Yabro. All rights reserved.  
        </footer>  
      </div>  
    `,
    cc: cc,
    replyTo: "no-reply@yabro-co.com", // عنوان بريد إلكتروني غير مراقب
  };

      await transporter.sendMail(mailOptions);
};  
// مثال على كيفية استخدام الدالة  
// sentMail("recipient@example.com", "cc@example.com", "Subject", "This is the message body", "https://example.com/logo.png");  

// تصدير الدوال
module.exports = {
  getAllData,
  getData,
  insertData,
  updateData,
  deleteData,
  sentMail,
};
