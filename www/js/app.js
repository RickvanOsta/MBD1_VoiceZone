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

function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
    
    var _name = "";
    var _email = "";
    var _token = "";
    var _id = ""; 
    
    setNavBarTransitionNone();
    //refreshList();
    fillLists();
    
    //TESTTTTTTTTT ******************
    
    $('#record').on('tap', captureAudio);
    
    
    $( "#loginButton" ).on("tap", function() {
        listenForLogin();
        intel.xdk.device.showRemoteSiteExt("https://voicezone.herokuapp.com/auth/facebook",280,0,50,50,60,60);
    });  
    
    function listenForLogin(){
        var hasFBNotFired = true;
    window.addEventListener("intel.xdk.device.remote.close", function(){
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
    });
    hasFBNotFired = true;
    }
    
    
    
    $( "#logoutButton" ).on("tap", function() {
       $.ajax({
            url: "https://voicezone.herokuapp.com/logout",
            success: function(data){
                listenForLogin();
                $.mobile.changePage("#login");
        }
    });
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

function fillLists() {
    console.log('fill lists ajax');
    voice.getAll(fillTimeLine); //testData(); //get voice notes

}

function fillTimeLine(voiceNotes) {
    console.log('fill timeline');
    console.log(voiceNotes);
    var ul = $('#voiceNotesList ul');
    ul.empty(); //empty the list
    
//    var ulProfile = $('#profileList ul');
//    ulProfile.empty();
    
    for (var i = 0; i < voiceNotes.length; i++) {
        ul.append(
            '<li>' +
                '<h2>' + voiceNotes[i].title + '</h2>' +
                '<p> tap to listen! </p>' +
            '</li>'
        );
        
//        ulProfile.append(
//            '<li>' +
//                '<h2>' + voiceNotes[i].title + '</h2>' +
//                '<p>' + voiceNotes[i].username + '</p>' +
//            '</li>'
//        );
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
        voice.post(mediaFiles[i]);
    }
}

function captureError(error) {
    console.log(error);
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