const BoArticleModel = require("../schema/bo_article.model");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");

class Community {
  constructor() {
    this.boArticleModel = BoArticleModel;
  }

  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_article = await this.saveArticleData(data);
      return new_article;
    } catch (err) {
      throw err;
    }
  }
  async saveArticleData(data) {
    try {
      const article = new this.boArticleModel(data);
      return await article.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.auth_err1);
    }
  }

  async getMemberArticlesData(member, mb_id, inqury) {
    try {
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id),
        page = inqury["page"] ? inqury["page"] * 1 : 1,
        limit = inqury["limit"] ? inqury["limit"] * 1 : 5;
      const result = await this.boArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, art_status: "active" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id", //members collectionning ichidan qaysi datasetga tenglashtirmoqchisiz. mb_id membersning o'zida _id ga teng
              as: "member_data", //qaysi nom bilan hosil qilmoqchimiz
            },
          },
          { $unwind: "$member_data" }, //ichida bitta obj data buladigan arrayni objsini olib to'g'ridan to'g'ri member_dataning ichiga qo'yib ber
        ])
        .exec();
      assert.ok(result, Definer.article_err2);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
