class Definer {
  // general errors
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: threr is no data with that params!";
  static general_err3 = "att: file upload error!";

  //member auth related errors
  static auth_err1 = "att: mongodb validation is failed!";
  static auth_err2 = "att: jwt token creation error!";
  static auth_err3 = "att: no member with that member nick!";
  static auth_err4 = "att: product creation is failed!";
  static auth_err5 = "att: You are not authenticated!";

  //product related errors
  static product_err1 = "att: your credentials do not match!";

  // orders related errors
  static order_err1 = "att: order cration is failed!";
  static order_err1 = "att: order item cration is failed!";
}

module.exports = Definer;
