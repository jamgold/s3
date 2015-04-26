S3images = new Meteor.Collection('images');

if (Meteor.isClient) {
  // counter starts at 0

  Template.s3_tester.events({
      "click button.upload": function(e,t){
          var files = t.$("input.file_bag")[0].files
          S3.upload({
            files: files,
            path: "s3"
          },function(e,image){
            console.log("S3.upload");
            if(e)
            {
              console.log(e);
            }
            else
            {
              //
              // we get back the object from S3.collection
              //
              delete(image._id);
              S3images.insert(image);
            }
          });
      },
      "click button.list": function(e,t) {
        Meteor.call('listContents','s3',function(err,res){
          if(err) console.log('callback from listContents',err);
          if(res)
          {
            res.Contents.forEach(function(image){
              console.log(image);
              t.$('ul.list').append('<li>'+image.Key+'</li>');
            });
          }
        });
      }
  });

  Template.s3_tester.helpers({
      "files": function(){
          return S3images.find();//S3.collection.find();
      }
  });
}

if (Meteor.isServer) {
  var Future = Npm.require("fibers/future");
  var assets = EJSON.parse(Assets.getText('settings.json'));

  S3.config = {
    key: assets.AWSAccessKeyId,
    secret: assets.AWSSecretAccessKey,
    bucket: assets.S3Bucket,
    region: assets.S3Region
  };

  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    listContents: function(prefix) {
      var future = new Future();

      S3.knox.list({prefix: prefix}, function(error, response) {
        if(error)
        {
          console.log(error);
          throw new Meteor.Error(500, "An error occured getting your files");
        }
        else 
        {
          future.return(response);
        }
      });
      return future.wait();
    }
  });
}
