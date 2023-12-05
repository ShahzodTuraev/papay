const Order = require("../models/Order");

let orderController = module.exports;
const assert = require("assert");
const Definer = require("../lib/mistake");

orderController.createOrder = async (req, res) => {
  try {
    console.log("POST: cont/createOrder");
    assert.ok(req.member, Definer.auth_err5);
    console.log(req.body);
    const order = new Order();
    const result = await order.createOrderData(req.member, req.body);
    res.json({ state: "sucess", data: result });
  } catch (err) {
    console.log(`ERROR, cont/signup, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};