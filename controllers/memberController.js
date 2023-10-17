const Member = require("../models/Member");
// controller butun proccessni boshqarib, tegishli madellarga vazifa yuklaydi.
let memberController = module.exports; //memberControllerga turli xil metodlarni yuklash mumkin

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);
    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log(`ERROR, cont/signup, ${err.message} `);
  }
};

memberController.login = (req, res) => {
  console.log("POST cont.login");
  res.send("we are in login page");
};

memberController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("we are in logout page");
};
