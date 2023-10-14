let memberController = module.exports;

memberController.home = (req, res) => {
  console.log("GET cont.home");
  res.send("we are in home page");
};

memberController.signup = (req, res) => {
  console.log("POST cont.signup");
  res.send("we are in signup page");
};

memberController.login = (req, res) => {
  console.log("POST cont.login");
  res.send("we are in login page");
};

memberController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("we are in logout page");
};
