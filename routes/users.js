var express = require('express');
var router = express.Router();

var User = require('../models/User.js');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = Error("Wrong details please check at once");
    return next(error);
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
        { userId: existingUser.id,username: existingUser.username },
        "secretkeyappearshere",
        { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  res.status(200)
      .json({
        success: true,
        data: {
          userId: existingUser.id,
          email: existingUser.email,
          token: token,
        },
      });
});
/* GET /todos listing. */
router.get('/',auth, function(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if(!token)
  {
    res.status(200).json({success:false, message: "Error!Token was not provided."});
  }
  else{
    User.find(function (err, todos) {
      if (err) return next(err);
      res.json(todos);
    });
  }

});

/* POST /todos */
router.post('/',auth, function(req, res, next) {
  User.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id',auth, function(req, res, next) {
  User.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id',auth, function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id',auth, function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
module.exports = router;
