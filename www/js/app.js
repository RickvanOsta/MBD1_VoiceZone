/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */


// For improved debugging and maintenance of your app, it is highly
// recommended that you separate your JavaScript from your HTML files.
// Use the addEventListener() method to associate events with DOM elements.

// For example:

// var el ;
// el = document.getElementById("id_myButton") ;
// el.addEventListener("click", myEventHandler, false) ;



// The function below is an example of the best way to "start" your app.
// This example is calling the standard Cordova "hide splashscreen" function.
// You can add other code to it or add additional functions that are triggered
// by the same event or other events.

var db = null;

function getLocalStorage() {
        try {
            if(window.localStorage ) return window.localStorage;
        }   
        catch (e){
            return undefined;
        }
}

function setTheme(){
    if(db.theme != ""){
        $('.header').removeClass("headerA");   
        $('.header').removeClass("headerB");  
        $('.header').addClass(db.theme);    
    }
    else {
        $('.header').addClass("headerA");  
    }
    

}

function onAppReady() {    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    
    
    db = getLocalStorage();
    setTheme();

    
    setNavBarTransitionNone();
    //refreshList();
    fillList();
    
    //TESTTTTTTTTT ******************
    
    $('#record').on('tap', captureAudio);
    
                       
    function listenForLogin(){
        var hasFBNotFired = true;
        if(hasFBNotFired){
        $.ajax({
            url: "https://voicezone.herokuapp.com/facebooklogin",
            success: function(data){
            if(!data.hasOwnProperty('facebook')){
                alert("Login failed.");
                }
            else {
                var tempUser = {
                "_name" : data.facebook.name,
                "_email" : data.facebook.email,
                "_token" : data.facebook.token,
                "_id" : data._id
                }
                user.setUser(tempUser);
                $.mobile.changePage("#timeline");
            }
        }
    });
            hasFBNotFired = false;
        }
    hasFBNotFired = true;
    }
                  
                       
    
    $( "#loginButton" ).on("tap", function() {
        var ref = window.open('https://voicezone.herokuapp.com/auth/facebook', '_blank', 'location=yes');    
        
        
        ref.addEventListener('exit', function(){
        listenForLogin();
    });
    });  
    
    
    
    
    
    $( "#logoutButton" ).on("tap", function() {
       $.ajax({
            url: "https://voicezone.herokuapp.com/logout",
            success: function(data){
                listenForLogin();
                $.mobile.changePage("#login");
        }
    });
    });
    
    
    $( "#themeAButton" ).on("tap", function() {
        db.theme='headerA';
        setTheme();
    });  
    
    $( "#themeBButton" ).on("tap", function() {
        db.theme='headerB';
        setTheme();
    });  
    
}



function setNavBarTransitionNone() {
    console.log('navbar fix');
    $("a[data-role=tab]").each(function () {
        var anchor = $(this);
        anchor.bind("click", function () {
            $.mobile.changePage(anchor.attr("href"), {
                transition: "none"
            });
        });
    });
}

function fillList() {
    console.log('fill list');
    var voiceNotes = testData(); //get voice notes
    
    var ul = $('#voiceNotesList ul');
    ul.empty(); //empty the list
    
    var ulProfile = $('#profileList ul');
    ulProfile.empty();
    
    for (var i = 0; i < voiceNotes.length; i++) {
        ul.append(
            '<li>' +
                '<h2>' + voiceNotes[i].title + '</h2>' +
                '<p>' + voiceNotes[i].username + '</p>' +
            '</li>'
        );
        
        ulProfile.append(
            '<li>' +
                '<h2>' + voiceNotes[i].title + '</h2>' +
                '<p>' + voiceNotes[i].username + '</p>' +
            '</li>'
        );
    }
}

function refreshList() {
    var voiceNotes = testData(); //get voice notes
    
    var ul = $('#voiceNotesList ul');
    ul.empty(); //empty the list
    
    var ulProfile = $('#profileList ul');
    ulProfile.empty();
    
    for (var i = 0; i < voiceNotes.length; i++) {
        ul.append(
            '<li>' +
                '<h2>' + voiceNotes[i].title + '</h2>' +
                '<p>' + voiceNotes[i].username + '</p>' +
            '</li>'
        );
        
        ulProfile.append(
            '<li>' +
                '<h2>' + voiceNotes[i].title + '</h2>' +
                '<p>' + voiceNotes[i].username + '</p>' +
            '</li>'
        );
    }
    ul.listview('refresh');
    ulProfile.listview('refresh');
}

function testData() {
    
    var voiceNotes = [];
    
    for (var i = 0; i < 20; i++) {
        var note = {
            'title': 'test titel ' + i,
            'username': 'test username ' + i,
            'file': 'test file ' + i
        };
        
        voiceNotes.push(note);
    }
    
    return voiceNotes;
}



// RECORD ===================================================================
function captureAudio() {
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
}

function captureSuccess(mediaFiles) {
    var i;
    console.log('success');
    console.log(mediaFiles);
    for (i = 0; i < mediaFiles.length; i++) {
        uploadFile(mediaFiles[i]);
    }
}

function captureError(error) {
    console.log(error);
}




//UPLOAD ==============================================================

// Upload files to server
function uploadFile(mediaFile) {
    
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;
    
    var options = { 
                fileName: name,
                mimeType: 'audio/wav'
              };
        
    ft.upload(path,
        //"http://posttestserver.com/post.php",
        "http://localhost:3000/users/test",      
        uploadSuccess,
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        options
        );   
}

function uploadSuccess(result) {
    console.log('Upload success: ' + result.responseCode);
    console.log(result.response);
    console.log(result.bytesSent + ' bytes sent');
}

function uploadError(error, path) {
    //console.log('Error uploading file ' + path + ': ' + error.code);
    console.log('error');
    console.log(error);
    alert('ERROR');
}




document.addEventListener("app.Ready", onAppReady, false) ;
// document.addEventListener("deviceready", onAppReady, false) ;
// document.addEventListener("onload", onAppReady, false) ;

// The app.Ready event shown above is generated by the init-dev.js file; it
// unifies a variety of common "ready" events. See the init-dev.js file for
// more details. You can use a different event to start your app, instead of
// this event. A few examples are shown in the sample code above. If you are
// using Cordova plugins you need to either use this app.Ready event or the
// standard Crordova deviceready event. Others will either not work or will
// work poorly.

// NOTE: change "dev.LOG" in "init-dev.js" to "true" to enable some console.log
// messages that can help you debug Cordova app initialization issues.