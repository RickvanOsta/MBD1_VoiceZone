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
var media = null;
var mediaTimer = null;
var fileLocation;
var title;

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
    fillLists();
    
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
                };
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
        var ref = window.open('https://voicezone.herokuapp.com/auth/facebook', '_blank', 'location=yes,closebuttoncaption=Done');    
        
        
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
                       
    setButtonHandlers();                   
    
}


function setButtonHandlers() {
    $('#play').on('tap', playAudio);
    $('#pause').on('tap', pauseAudio);
    $('#stop').on('tap', stopAudio);
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
    voice.getAllFromUser(user, fillProfile);
}

function fillTimeLine(voiceNotes) {
    console.log('fill timeline');
    console.log(voiceNotes);
    var ul = $('#voiceNotesList ul');
    ul.empty(); //empty the list
    
    for (var i = 0; i < voiceNotes.length; i++) {
        ul.append(
            '<li>' +
                '<a href="#detail" class="ui-btn ui-corner-all" rel="' + voiceNotes[i].fileLocation + '">' +
                    '<h2>' + voiceNotes[i].title + '</h2>' +
                    '<p> tap to listen! </p>' +
                '</a>' +
            '</li>'
        );   
    }
}

function fillProfile(voiceNotes) {
    console.log('fill profile');
    
    var ulProfile = $('#profileList ul');
    ulProfile.empty();
    
    for (var i = 0; i < voiceNotes.length; i++) {
        ulProfile.append(
            '<li>' +
                '<a href="#detail" class="ui-btn ui-corner-all" rel="' + voiceNotes[i].fileLocation + '">' +
                    '<h2 class="getTitle">' + voiceNotes[i].title + '</h2>' +
                    '<p> tap! </p>' +
                '</a>' +
            '</li>'
        );
    }
    
    console.log('USER ' + user.id);
    $('.#detail').on('tap', function() {
        window.fileLocation = $(this).attr('rel');
        
        window.title = $('.getTitle').innerHTML;
        console.log('FILE LOCATION: ' + fileLocation);
    });
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
                '<a href="#detail" class="ui-btn ui-corner-all tapListen" rel="' + voiceNotes[i].fileLocation + '">' +
                    '<h2 class="getTitle">' + voiceNotes[i].title + '</h2>' +
                    '<p>' + voiceNotes[i].username + '</p>' +
                '</a>' +
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


// RECORD ===================================================================
function captureAudio() {
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
}

function captureSuccess(mediaFiles) {
    var i;
    console.log('success');
    console.log(mediaFiles);
    for (i = 0; i < mediaFiles.length; i++) {
        voice.post(mediaFiles[i], user);
    }
}

function captureError(error) {
    console.log(error);
}



// PLAY AUDIO ===============================================================
function playAudio() {
    var url = "https://voicezone.herokuapp.com/" + window.fileLocation;
    
    var media = new Media(url, playSuccess, playError, function(status) {
        setAudioStatus(Media.MEDIA_MSG[status]);
        
        if (Media.MEDIA_STOPPED == status) {
            clearInterval(mediaTimer);
            mediaTimer = null;
        }
    });
    console.log(url);
    console.log('play audio');
    console.log(media);
    
    $('#audio_duration').innerHTML = "";
    
    //play
    media.play();
    
    $('#play_caption').innerHTML = "Now playing: ";
    $('#file_name').innerHTML = window.title;
    
    if (mediaTimer == null && media.getCurrentPosition) {
        mediaTimer = setInterval(
        function() {
            media.getCurrentPosition(
            function(position) {
                if (position > -1) {
                    setAudioPosition(position+" sec");
                }
            },
            function(e) {
                setAudioPosition:("Error: " + e);
            }); 
        }, 1000);
    }
    
    //get duration
    var counter = 0;
    var timerDur = setInterval(
        function() {
            counter = counter + 100;
            if (counter > 2000) {
                clearInterval(timerDur);
            }
            var dur = media.getDuration();
            if (dur > 0) {
                clearInterval(timerDur)
            }
        }, 100);
}

//pause audio
function pauseAudio() {
    
    console.log('pause');
    if (media) {
        media.pause();
    }
}

//stop audio
function stopAudio() {
    console.log('stop');
    if (media) {
        media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

//set audio status
var setAudioStatus = function(status) {
    $('#audio_status').innerHTML = status;
}
         
//set audio position
var setAudioPosition = function(position) {
    $('#audio_position').innerHTML = position;
}

//play success cb
function playSuccess() {
    console.log('audio success');
}

//play error cb
function playError() {
    console.log('audio error');
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