//VOICE
var Voice = function() {
    
    this.URL = api.URL + "/voices";
    console.log('instantiated voice object');
};

Voice.prototype.getURL = function() {
    return this.URL;
};

Voice.prototype.post = function(mediaFile, user) {
    
    var self = this;
    var _user = user;
    
    // Upload files to server
    var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;

    var options = { 
                fileKey: 'upl',
                fileName: name,
                mimeType: 'audio/wav'
              };

    ft.upload(path,
        self.URL,      
        uploadSuccess,
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        options
    );   

    function uploadSuccess(result) {
        console.log('Upload success: ' + result.responseCode);
        console.log(result.response);
        console.log(result.bytesSent + ' bytes sent');
        console.log('uploaded result object: ');
        console.log(result);
        
        var parse = JSON.parse(result.response);
        var fileName = parse.filename;
        self.updateWithUser(fileName, _user);
    }

};

Voice.prototype.updateWithUser = function(fileName, user) {
    
    var self = this;
    var putURL = self.URL + "/" + fileName;
    var data = { "uid": user.id }
    var jsonData = JSON.stringify(data);
    
    console.log('update voice with user ID with id: ' + user.id);
    console.log('url: ' + putURL);

    $.ajax({
        type: "PUT",
        url: putURL,
        contentType: "application/json",
        data: jsonData,
        success: function(result) {
            console.log(result);
            alert('You have added a new voice note!');
        },
        error: function(jqXHR, status, errorThrown) {
            console.log('Error updating voice');
            console.log(request.responseText);
        }
    });
};

Voice.prototype.getAll = function(cb) {
    
    var self = this;
    console.log('get all voice notes');

    $.ajax({
        type: "GET",
        url: self.URL,
        dataType: "json",
        success: function(data) {
            //return json array of voices
            cb(data);
        }, 
        error: function(jqXHR, status, errorThrown) {
            console.log("Error getting all voices!");
            console.log(request.responseText);
        }
    });
};

Voice.prototype.getAllFromUser = function(user, cb) {
    
    var self = this;
    console.log('get all voices from user');
    var specialURL = api.URL + "/users/" + user.id + "/voices";
    
    $.ajax({
        type: "GET",
        url: specialURL,
        dataType: "json",
        success: function(data) {
            cb(data)
        },
        error: function(jqXHR, status, errorThrown) {
            console.log('Error getting voices from user');
            console.log(request.responseText);
        }
    })
}

var voice = new Voice();