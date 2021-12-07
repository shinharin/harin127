const mongoose = require("mongoose"); 

//Card Schema
const CardSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  org: {
    type: String,
    required: false, //필수입력 아님
  },
  title: {
    type: String,
    required: false,
  },
  tel: {
    type: String,
    required: true,
  },
  fax: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  homepage: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  zip: {
    type: String,
    required: false,
  },
});

const Card = mongoose.model("Card", CardSchema);

Card.getCardById = function (id, callback) {
  Card.findById(id, callback);
};

Card.getCardByUsername = function (username, callback) {
  const query = { username: username };
  Card.findOne(query, callback);
};

Card.addCard = function (newCard, callback) {
  newCard.save(callback);
};

Card.updateCard = function (username, newCard, callback) {
  const query = { username: username };
  const update = {
      name: newCard.name,
      org: newCard.org,
      title: newCard.title,
      tel: newCard.tel,
      fax: newCard.fax,
      mobile: newCard.mobile,
      email: newCard.email,
      homepage: newCard.homepage,
      address: newCard.address,
      zip: newCard.zip,
  };

  Card.findOneAndUpdate(
    query, 
    update, 
    { new: true, useFindAndModify: false },
    callback
  );
};

module.exports = Card;