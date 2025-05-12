const { updateData, sentMail } = require("../../controllers/functions"); // تأكد من استيراد الدوال المناسبة
 
// دالة لتوليد كود تحقق عشوائي مكون من أحرف وأرقام
function generateVerificationCode(length) {
  const chars =
    "0123456789ABCDEFGHIJKL0123456789MNOPQRSTUVWXYZ01234567890123456789"; // الحروف والأرقام الممكنة
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex]; // إضافة حرف أو رقم عشوائي إلى الكود
  }

  return code;
}
// دالة لإعادة إرسال رمز التحقق
async function resendVerificationCode(req, res) {
  try {
    const { users_email } = req.body; // الحصول على البريد الإلكتروني من الجسم
    
    // التحقق من وجود البريد الإلكتروني
    if (!users_email) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your email.",
      });
    }

    // توليد كود تحقق عشوائي مكون من أحرف وأرقام
    const verificationCode = generateVerificationCode(6); // يمكن تغيير الطول حسب الحاجة

    const data = {
      users_verflyCode: verificationCode,
    };

    // تحديث كود التحقق في قاعدة البيانات
    const updateResponse = await updateData("users", data, "users_email = ?", [
      users_email,
    ]);

    if (updateResponse.status === "success") {
      // إرسال البريد الإلكتروني برمز التحقق الجديد
        sentMail(
        users_email,
        "adnanbarakat111@gmail.com",
        "Hello! Yabro",
        "verification Code",
        verificationCode,
        "https://i.pinimg.com/736x/69/a6/2a/69a62a5edc08d755dd8a4ef017e14c63.jpg"
      ); 
      res.json({
        status: "success",
        message: "Verification code sent successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "There was a problem updating user data.",
      });
    }
  } catch (error) {
    console.error("Error resending verification code: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem resending the verification code.",
    });
  }
}

// تصدير الدالة
module.exports = { resendVerificationCode };
