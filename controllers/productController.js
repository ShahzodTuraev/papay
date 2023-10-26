const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");

let productController = module.exports;
// bu variablesga functionlarni yuklaymiz
productController.getAllProducts = async (req, res) => {
  try {
    console.log("GET: cont/getAllProducts");
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message} `);
    res.json({ state: "fail", message: err.message });
  }
};

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert(req.files, Definer.general_err3);
    const product = new Product();
    let data = req.body; //req.bodyni ichida file path yoq. U reqfilesni ichida keladi.
    data.product_images = req.files.map((ele) => {
      return ele.path;
    });
    // yuqorida req fileni ichidagi filepathni array qilib request bodyga qo'shib beradi.
    const result = await product.addNewProductData(data, req.member);
    const html = `<script>
                    alert(new dish added successfully)
                    window.location.replace('/resto/products/menu')
                  </sctipt>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct, ${err.message} `);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
  } catch (err) {
    console.log(`ERROR, cont/updateChosenProduct, ${err.message} `);
  }
};
