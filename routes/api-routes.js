// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
const uploadController = require("../public/js/upload");
const upload = require("../config/middleware/upload");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      //console.log(req.user.email)
      let userEmail = req.user.email
      // res.json({
      //   email: req.user.email,
      //   id: req.user.id,
      // }
        //userName: req.user.userName,
        db.User.findAll({
            where: {email: userEmail}
          }).then((dbTodo) => {res.json(dbTodo)})
    
    }
    })
    // console.log(req.user)
    // db.User.findAll({
    //   where: {email: req.user.email}
    // }).then((dbTodo) => {
    //   // We have access to the todos as an argument inside of the callback function
    //   res.json({
    //     // id: dbTodo.id, 
    //     // email: dbTodo.email,
    //     // userName: dbTodo.userName
    //   });
    // });

  // });

  //put request for usernames
  app.put("/api/username", function(req, res) {
    console.log(req.body.userName)
    db.User.update(
    {userName: req.body.userName},
    {where: {
      email: req.body.email
    }}
    )
      .then(function() {
        res.json({});
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

//add score
  app.post("/api/game", function(req, res) {
    db.machOneScore.create({
      score: req.body.score,
      UserId: req.user.id
    })
      .then(function() {
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });
//add score for second game
  app.post("/api/game2", function(req, res) {
    db.machTwoScore.create({
      score: req.body.score,
      UserId: req.user.id
    })
      .then(function() {
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

// Add photo
app.post("/upload", upload.single("file"), uploadController.uploadFiles);

//get user photo
app.get("/api/photo", function(req, res) {
  if (!req.user) {
    res.json({});
  }else {
    let userId = req.user.id
    db.Image.findAll({
      where: {Userid: userId},
      order: [
        ['createdAt', 'DESC'],
      ]
    }).then((dbImage) => {res.json(dbImage)})
  }
})

//get specific photo
app.get("/api/photo/:id", function(req, res) {
  if (!req.user) {
    res.json({});
  }else {
    let userId = req.params.id
    db.Image.findAll({
      where: {Userid: userId},
      order: [
        ['createdAt', 'DESC'],
      ]
    }).then((dbImage) => {res.json(dbImage)})
  }
})

};
