//URL FOR USERS
var userURL = "https://voicezone.herokuapp.com/users/";

//USER
var User = function() {
    
    console.log('instantiated user object');
}

//set user
User.prototype.setUser = function(user) {
    
    this.id = user._id;
    this.name = user._name;
    this.email = user._email;
    this.token = user._token;
    
    setDom(this);
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
        },
        error: function(jqXHR, status, errorThrown) {
            console.log("Error getting user");
            console.log(request.responseText);
        }
    });
}

function setDom(user) {
    $('#fullname').html(user.name);
    $('#username').html("ID_" + user.id);
}

//instantiate user object
var user = new User();