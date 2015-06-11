'use strict';
localStorage.setItem('url', 'http://localhost:3000');


//Funkcije brez strani!
//Izbris aktivnosti
function deleteActivity(id){
   var user = {
              'username':localStorage.username,
              'password':localStorage.password};
   $.ajax({
      url: localStorage.url+'/activity/'+id,
      type: 'DELETE',
      data: user,
      dataType: 'json',        
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},            
      error: function (xhr, status) {
          alert("Težave pri prijavi!"+status);
      },
      success: function (data) {               
          //$.mobile.pageContainer.pagecontainer('change', '#my_activities', { transition: "flip"});
          my_activities();
          //window.location.hash = 'myactivity';
          //location.reload();
      }});
};
//Potrditev udeležbe
function attendActivity(id){
     var _user = localStorage.username;
     var _pass = localStorage.password;
     var _user_id=localStorage.id;
     var attend = {
                'username':_user,
                'password':_pass,
                'activity_id':id,
                'number_of_person':1,
                'user_id':localStorage.id                                   
      };
      $.ajax({
            url: localStorage.url+'/attendant/',
            type: 'POST',
            data: attend,
            dataType: 'json', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},           
            error: function (xhr, status) {
                alert("Težave pri prijavi!"+status)
            },
            success: function (data) {
             $.mobile.pageContainer.pagecontainer('change', '#my_attendant_activities', { transition: "flip"});
                 //window.location.hash = 'my_activity';
            }
      });
}

///////////
///////////
///////////
///////////
//funkcije za preklapljanje strani
///////////
///////////
///////////

//index
function index_page(){
  $.ajax({
    url: localStorage.url+'/activity/?username='+localStorage.username+'&password='+localStorage.password,
    type: 'GET',
    dataType: 'json', 
    contentType: 'application/x-www-form-urlencoded',           
    success: function (data) {                
      var activities = {
          'title':'Aktivnosti',
          'list_of_activity': data                                 
      };
      initialize1(data);
      $.mobile.pageContainer.pagecontainer('change', '#index', { transition: "flip"});
      //mislim da bi moral bit initialize1 callback function, oziroma bi blo treba po koncu inita nekaj refreshat.. 
      alert('ta alert mora bit, drugač zemljevida nena pokaže!')
      //window.location.hash = 'index';

    }
  });
}

//podrobnosti o moji udeležbi
function attendant_details(id){
  $.ajax({
    url: localStorage.url+'/attendant/'+id+'?username='+localStorage.username+'&password='+localStorage.password,
    type: 'GET',
    dataType: 'json', 
    contentType: 'application/json; charset=utf-8',           
    success: function (data) {                
      loadAtt(data);
      $.mobile.pageContainer.pagecontainer('change', '#attendant_details', { transition: "flip"});
    }
  }); 
}

//Podrobnosti o moji aktivnosti
function my_activity_details(id){
  $.ajax({
    url: localStorage.url+'/activity/'+id+'?username='+localStorage.username+'&password='+localStorage.password,
    type: 'GET',
    dataType: 'json', 
    contentType: 'application/json; charset=utf-8',           
    success: function (data) {                
      loadSingleActivity(data);
    $.mobile.pageContainer.pagecontainer('change', '#my_activity_details', { transition: "flip"});
    }
  });
}

//Aktivnost iz googleMapsa
function activitiy_details(id){
  $.ajax({
    url: localStorage.url+'/activity/'+id+'?username='+localStorage.username+'&password='+localStorage.password,
    type: 'GET',
    dataType: 'json', 
    contentType: 'application/json; charset=utf-8',           
    success: function (data) {   
      var source   = $("#attend_single_my_activity-template").html();
      var template = Handlebars.compile(source);
      var html = template(data);
      $("#attendsingleActivity").html(html);    
      $.mobile.pageContainer.pagecontainer('change', '#activitiy_details', { transition: "flip"});
    }
  });
}

//Moji dogodki
function my_activities(){
  $.ajax({
    url: localStorage.url+'/user/login?username='+localStorage.username+'&password='+localStorage.password+'',
    type: 'GET',
    dataType: 'json',         
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},         
    error: function (xhr, status) {
      alert('Napačni podatki');
    },
    success: function (data) {

    var activities = {
          'title':'Aktivnosti',
          'entries': data['activityList']};
    loadActivities(activities);
    $.mobile.pageContainer.pagecontainer('change', '#my_activities', { transition: "flip"});
    }
  });
}


function my_attendant_activities(){
  $.ajax({
    url: localStorage.url+'/user/login?username='+localStorage.username+'&password='+localStorage.password+'',
    type: 'GET',
    dataType: 'json',         
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},         
    error: function (xhr, status) {
      alert('Napačni podatki');
    },
    success: function (data) {
      var attends = {
          'title':'Aktivnosti',
          'entries': data['attendantList']};
      loadMyAttend(attends);
      $.mobile.pageContainer.pagecontainer('change', '#my_attendant_activities', { transition: "flip"});
    }
  });

}
//login
$("#submit-btn").click(function(e){
  var _user = $("#username").val();
  var _pass = $("#password").val();
  if(_user!=='' || _pass!==''){
    $.ajax({
      url: localStorage.url+'/user/login?username='+_user+'&password='+_pass+'',
      type: 'GET',
      dataType: 'json',         
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},         
      error: function (xhr, status) {
        alert("Težave pri prijavi!");
      },
      success: function (data) {
        localStorage.setItem('username', data['username']);
        localStorage.setItem('password', data['password']);
        localStorage.setItem('id', data['id']);
        //window.location.hash = 'index';
        location.reload();
        $.mobile.pageContainer.pagecontainer('change', '#index', { transition: "flip"});

       }
    });
  }
  e.preventDefault();
});

//Dodajanje aktivnosti
$("#submit-add_activity-btn").click(function(e){
    var _user = localStorage.username;
    var _pass = localStorage.password;
    var _name = $("#name").val();
    var _description = $("#description").val();
    var _start_time = $("#start_time").val();
    var _end_time = $("#end_time").val();
    var _latitude = $("#latitude").val();
    var _longitude = $("#longitude").val();
    var _category = $("#category").val();
    var _number_of_person = $("#number_of_person").val();
    if(_user!=='' || _pass!==''){
        var activity = {
            'username':_user,
            'password':_pass,
            'name':_name,
            'description': _description,
            'start_time':_start_time,
            'end_time':_end_time,
            'latitude':_latitude,
            'longitude':_longitude,
            'number_of_person':_number_of_person,
            'category_id':_category,
            'user_id':localStorage.id                                   
    };

    var isOffline = 'onLine' in navigator && !navigator.onLine;
    
    if ( isOffline ) {
        alert('toleGreLokalno')
        var x = 'INSERT INTO ACTIVITIES (name, description, start_time, end_time, latitude, longitude, number_of_person, user_id, category_id, sync) ' 
                          + 'VALUES ('+
                            '"'+_name+'", '+
                            '"'+_description+'", '+
                            '"'+_start_time+'", '+
                            '"'+_end_time+'", '+
                            ''+_latitude+', '+
                            ''+_longitude+', '+
                            ''+_number_of_person+', '+
                            ''+localStorage.id+', '+
                            ''+1+', '+
                            ''+0+');'

        var db = openDatabase('activities', '1.0', 'local added activities', 2 * 1024 * 1024);
        db.transaction(function (tx) {  
            tx.executeSql('CREATE TABLE IF NOT EXISTS ACTIVITIES (name, description, start_time, end_time, picture, latitude, longitude, number_of_person, user_id, category_id, sync)');
            tx.executeSql(x);
        });
      }
    else{
      alert('Direkt na server!')        
     $.ajax({
       url: localStorage.url+'/activity',
       type: 'POST',
       data: activity,
       dataType: 'json', 
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},           
       error: function (xhr, status) {
           alert("Težave pri dodajanju!"+status);
       },
       success: function (data) {
          $.mobile.pageContainer.pagecontainer('change', '#my_activities', { transition: "flip"});
       }
     });

   }
  }
  e.preventDefault();
  });

//logout
$( ".logout_btn" ).bind( "click", function(event, ui) {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  $.mobile.pageContainer.pagecontainer('change', '#login', { transition: "flip"});

});

///////////////////////
///////////////////////
//Funkcije za nastavljanje templatov
///////////////////////
///////////////////////

function loadMyAttend(data){ 
  var source   = $("#attend-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#articleFMBHandlebars").html(html);           
  $("#listview-content2").trigger('create');  
  $("#my_attendant_activities").trigger('pagecreate');
  $("#articleFMBHandlebars ul").listview('refresh');
  $("#articleFMBHandlebars ul").listview().listview('refresh');
}

function loadActivities(data){  
  var source   = $("#articles-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#articleHandlebars").html(html);           
  $("#listview-content").trigger('create');  
  $("#my_activities").trigger('pagecreate');
  $("#articleHandlebars ul").listview('refresh');
  $("#articleHandlebars ul").listview().listview('refresh');
}

function loadSingleActivity(data){  
  var source   = $("#article-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#articleHandlebars").html(html);           
  $("#listview-content").trigger('create');  
  $("#my_activity").trigger('pagecreate');
  $("#articleHandlebars ul").listview('refresh');
  $("#articleHandlebars ul").listview().listview('refresh');
}

function loadSingleActivity(data){  
  var source   = $("#single_my_activity-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#singleActivity").html(html);           
}

function loadAttendSingleActivity(data){  
  var source   = $("#attend_single_my_activity-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#attendsingleActivity").html(html);           
}

function loadAtt(data){  
  var source   = $("#att_my_activity-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#AattActivity").html(html);           
}

////////////////////////////////
//SAMMY/////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
////////////////////////////////
(function($) {
  var sammy = $.sammy( function() {

  //LOGIN
    this.get('#login', function (context) {
      if(localStorage['username']){
        window.location.hash = 'index';
      }
    });
  //INDEX
    this.get('#index', function (context) {
      $.ajax({
        url: localStorage.url+'/activity/?username='+localStorage.username+'&password='+localStorage.password,
        type: 'GET',
        dataType: 'json', 
        contentType: 'application/x-www-form-urlencoded',           
        success: function (data) {                
          var activities = {
              'title':'Aktivnosti',
              'list_of_activity': data                                 
          };
      
          initialize1(data);
        }
      });
    });
  });
  
  $(function() {
    sammy.run('#index');
  });

})(jQuery);


