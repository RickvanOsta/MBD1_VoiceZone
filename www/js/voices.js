//VOICE
var Voice = function() {
    
    this.URL = api.URL + "/voices";
    console.log('instantiated voice object');
};

Voice.prototype.getURL = function() {
    return this.URL;
};

Voice.prototype.post = function(mediaFile) {
    
    var self = this;
    
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
        alert('You have added a new voice note!');
    }

    function uploadError(error, path) {
        console.log('Error uploading file ' + path + ': ' + error.code);
    }
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

var voice = new Voice();