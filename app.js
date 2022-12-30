const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "d23841c19d81f9bacfd09827e14e37a7-us21",
  server: "us21",
});

app.post("/", function (req, res) {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const listID = "e34946815d";

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listID, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    res.sendFile(__dirname + "/success.html");

    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}`
    );
  }

  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
