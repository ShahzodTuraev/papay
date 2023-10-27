const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
  product_collection_enums,
  product_status_enums,
  product_size_enums,
  product_volume_enums,
} = require("../lib/config");
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_status: {
      type: String,
      default: "PAUSED",
      enum: {
        values: product_status_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_discount: {
      type: Number,
      default: 0,
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },
    product_size: {
      type: String,
      default: "normal",
      required: () => {
        const sized_list = ["dish", "salad", "dessert"];
        return sized_list.includes(this.product_collection);
      },
      enum: {
        values: product_size_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_volume: {
      type: String,
      default: 1,
      required: () => {
        this.product_collection === "drink";
      },
      enum: {
        values: product_volume_enums,
        message: "{Value} is not among permitted enum values",
      },
    },
    product_description: { type: String, required: true },
    product_images: { type: Array, default: [] },
    product_likes: { type: Number, default: 0 },
    product_views: { type: Number, default: 0 },
    restaurant_mb_id: {
      //population qilishimiz mumkin yoki aggregation qilishimiz mumkin
      type: Schema.Types.ObjectId,
      ref: "Member", //qaysi collectionga bog'langan
      required: false,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

productSchema.index(
  { restaurant_mb_id: 1, product_name: 1, product_size: 1, product_volume: 1 }, //Texas-De_Brazilcoca-colanull
  { unique: true }
); //bor tavar bolsa qayta kiritmaydi
module.exports = mongoose.model("Product", productSchema);
