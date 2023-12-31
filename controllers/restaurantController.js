const assert = require("assert");
const Member = require("../models/Member");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");
const Restaurant = require("../models/Restaurant");
// controller butun proccessni boshqarib, tegishli madellarga vazifa yuklaydi.
let restaurantController = module.exports; //memberControllerga turli xil metodlarni yuklash mumkin

restaurantController.getRestaurants = async (req, res) => {
  try {
    console.log("GET: cont/getRestaurants");
    const data = req.query,
      restaurant = new Restaurant(),
      result = await restaurant.getRestaurantsData(req.member, data);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getChosenRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getChosenRestaurant");
    const id = req.params.id,
      restaurant = new Restaurant(),
      result = await restaurant.getChosenRestaurantData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

/**************************************
 *      BSSR RELATED METHODS          *
 *************************************/
restaurantController.home = async (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getMyRestaurantProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantProducts");
    const product = new Product();
    const data = await product.getAllProductsDataResto(req.member);
    res.render("restaurant-menu", { restaurant_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyRestaurantProducts, ${err.message} `);
    // res.json({ state: "fail", message: err.message });
    res.redirect("/resto");
  }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyRestaurant, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
restaurantController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signupProcess");
    assert(req.file, Definer.general_err3);
    let new_member = req.body;

    new_member.mb_type = "RESTAURANT";
    new_member.mb_image = req.file.path;
    const member = new Member(),
      result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1);

    req.session.member = result; //app js da yasalgan session = memberiga signup data= resultini save qilamiz.
    res.redirect("/resto/products/menu");
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log(`ERROR, cont/signup, ${err.message} `);
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyRestaurant");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyRestaurant, ${err.message} `);
    res.json({ state: "fail", message: err.message });
    // res.redirect("/resto/login")
  }
};

restaurantController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/loginProcess");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);

    req.session.member = result; //session ichida member obj hosil qilib resultni yuklaymiz
    req.session.save(() => {
      result.mb_type === "ADMIN"
        ? res.redirect("/resto/all-restaurant")
        : res.redirect("/resto/products/menu");
    });
  } catch (err) {
    // res.json({ state: "fail", message: err.message });
    res.redirect("/resto/login");
    console.log(`ERROR, cont/login, ${err.message} `);
  }
};

restaurantController.logout = (req, res) => {
  try {
    console.log("GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/resto");
    });
  } catch (err) {
    res.redirect("/resto/login");
    console.log(`ERROR, cont/login, ${err.message} `);
  }
};

restaurantController.validateAuthRestaurant = (req, res, next) => {
  if (req.session?.member?.mb_type === "RESTAURANT") {
    req.member = req.session.member; //brauser cockiesga yozadi
    next();
  } else res.redirect("/resto");
  // res.json({
  //   state: "fail",
  //   error: "only authenticated members with restaurant type",
  // });
};

restaurantController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};
restaurantController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
                    alert("Admin page: Permission denied!")
                    window.location.replace("/resto")  
                  </script>`;
    res.end(html);
  }
};

restaurantController.getAllRestaurants = async (req, res) => {
  try {
    console.log("GET cont/getAllRestaurants");
    const restaurant = new Restaurant();
    const restaurant_data = await restaurant.getAllRestaurantsData();
    // restaurant service modeldan kelayotgan datani res renderga pass qilamiz
    res.render("all-restaurants", { restaurants_data: restaurant_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllRestaurants, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.updateRestaurantByAdmin = async (req, res) => {
  try {
    console.log("POST cont/updateRestaurantByAdmin");
    const restaurant = new Restaurant();
    const result = await restaurant.updateRestaurantByAdminData(req.body);
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateRestaurantByAdmin, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};
