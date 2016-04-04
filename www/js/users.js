//URL FOR USERS
var userURL = "https://voicezone.herokuapp.com/users/";

//USER
var User = function() {
    
    console.log('instantiated user object');
}

//set user
User.prototype.setUser = function(user) {
    $('#fullname').html(user._name);
    $('#username').html("ID_" + user._id);
}


//get one user by id
User.prototype.getOne = function(userId) {
           
    var self = this;
    
    var getURL = userURL + userId;

    console.log(userId);
    console.log(getURL);

    $.ajax({
        type: "GET",
        url: getURL,
        dataType: "json",
        success: function(data) {
            self.setUser(data);
        }
    });
}

//instantiate user object
var user = new User();

getUser = function(){
    return user;
}