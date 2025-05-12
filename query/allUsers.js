const { getAllData } = require("../controllers/functions");

// دالة لجلب بيانات منتج بناءً على معرفه
async function AllUsers(req, res) {
  try {
    const result = await getAllData("users");
    res.json(result);
    console.log(result);
  } catch (error) {
    console.error("Error fetching data: ", error);
    res
      .status(500)
      .json({
        status: "failure",
        message: "There is a problem retrieving data",
      });
  }
}

// تصدير الدوال
module.exports = { AllUsers };
