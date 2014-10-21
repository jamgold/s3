if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });

  Template.s3_tester.events({
      "click button.upload": function(){
          var files = $("input.file_bag")[0].files
          S3.upload(files,"/",function(e,r){
              console.log(r);
          });
      }
  })

  Template.s3_tester.helpers({
      "files": function(){
          return S3.collection.find();
      }
  })
}

if (Meteor.isServer) {
  S3.config = {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET,
  };

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
