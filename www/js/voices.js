//VOICE
var Voice = function() {
    
    this.URL = "https://voicezone.herokuapp.com/voices";
    console.log('instantiated voice object');
}

Voice.prototype.getURL = function() {
    return this.URL;
}

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
}

var voice = new Voice();
