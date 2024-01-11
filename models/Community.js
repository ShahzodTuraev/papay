const BoArticleModel = require("../schema/bo_article.model");
const {
  shapeIntoMongooseObjectId,
  board_id_enum_list,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");
const Member = require("./Member");

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
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async getMemberArticlesData(member, mb_id, inquery) {
    try {
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id),
        page = inquery["page"] ? inquery["page"] * 1 : 1,
        limit = inquery["limit"] ? inquery["limit"] * 1 : 5;
      const result = await this.boArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, art_status: "active" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id", //yuqoridagidan mb_idni qarayapman.
              foreignField: "_id", //members collectionning ichidan qaysi datasetga tenglashtirmoqchisiz. mb_id membersning o'zida _id ga teng
              as: "member_data", //qaysi nom bilan hosil qilmoqchimiz
            },
          },
          { $unwind: "$member_data" }, //ichida bitta obj data buladigan arrayni objsini olib to'g'ridan to'g'ri member_dataning ichiga qo'yib ber
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.article_err2);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getArticlesData(member, inquery) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches =
        inquery.bo_id === "all" //agar id all busa bo_id ning qiymatlari board_id_enum arrayini ichidagi qiymatlardan tashkil topsin.
          ? { bo_id: { $in: board_id_enum_list }, art_status: "active" }
          : { bo_id: inquery.bo_id, art_status: "active" };
      inquery.limit *= 1;
      inquery.page *= 1;
      const sort = inquery.order
        ? { [`${inquery.order}`]: -1 }
        : { createdAt: -1 };
      const result = await this.boArticleModel
        .aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquery.page - 1) * inquery.limit },
          { $limit: inquery.limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenData(member, art_id) {
    try {
      art_id = shapeIntoMongooseObjectId(art_id);
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, art_id, "community");
      }
      // increase art_views when user has not seen before
      const result = await this.boArticleModel.findById({ _id: art_id }).exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
