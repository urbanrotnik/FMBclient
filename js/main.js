'use strict';
localStorage.setItem('url', 'http://localhost:3000');

//////////////////
//Sinhronizacija//
function syncToServer(){
 var resJson = [];
    var db = openDatabase('activities', '1.0', 'local added activities', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM ACTIVITIES WHERE sync = 0', [], function (tx, results) {
        var len = results.rows.length, i, name, description, start_time, end_time, picture, latitude, longitude, number_of_person, user_id, category_id;
        for (i = 0; i < len; i++){
           //alert(results.rows.item(i).rowid );
           
          name = results.rows.item(i).name;
          description = results.rows.item(i).description;
          start_time = results.rows.item(i).start_time;
          end_time = results.rows.item(i).end_time;
          picture = results.rows.item(i).picture;
          latitude = results.rows.item(i).latitude;
          longitude = results.rows.item(i).longitude;
          number_of_person = results.rows.item(i).number_of_person;
          user_id = results.rows.item(i).user_id;
          category_id = results.rows.item(i).category_id;
          
          resJson.push({
            name: name, 
            description: description, 
            start_time: start_time, 
            end_time: end_time, 
            picture: picture, 
            latitude: latitude, 
            longitude: longitude, 
            number_of_person: number_of_person, 
            user_id: user_id, 
            category_id: category_id
          });
        }
        var activities = JSON.stringify(resJson);
        $.ajax({
        url: localStorage.url+'/activity/sync',
        type: 'POST',
        data: activities,
        headers: {'Content-Type': 'application/json'},         
        success: function (data) {
            if(data === true){
                var db = openDatabase('activities', '1.0', 'local added activities', 2 * 1024 * 1024);
                db.transaction(function (tx) {  
                    tx.executeSql('UPDATE ACTIVITIES SET sync = 1 WHERE sync = 0');
                });
            }
        }
        });
        }, null);
    }); 
}


//Insert za testiranje
function testInsert(){
  var db = openDatabase('activities', '1.0', 'local added activities', 2 * 1024 * 1024);
  db.transaction(function (tx) {  
      tx.executeSql('CREATE TABLE IF NOT EXISTS ACTIVITIES (name, description, start_time, end_time, picture, latitude, longitude, number_of_person, user_id, category_id, sync)');
      tx.executeSql('INSERT INTO ACTIVITIES (name, description, start_time, end_time, picture, latitude, longitude, number_of_person, user_id, category_id, sync) ' 
                    + 'VALUES ("sprehod", "jaja bi šel", "18.7.2015", "18.7.2015", "", 45.555, 15.555, "3", 1, 1, 0)');
  });
}
///////////




//Koda za dodajanje lokalno ali pa na server
//var isOffline = 'onLine' in navigator && !navigator.onLine;
//
//if ( isOffline ) {
//    //local db
//}
//else {
//    // internet data
//}

///////////////
///Funkcije za brisanje, dodajanje, prikazovanje aktivnosti
function deleteActivity(id){
   var user = {
              'username':localStorage.username,
              'password':localStorage.password};
   $.ajax({
      url: 'http://localhost:3000/activity/'+id,
      type: 'DELETE',
      data: user,
      dataType: 'json',        
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},            
      error: function (xhr, status) {
          alert("Težave pri prijavi!"+status);
      },
      success: function (data) {                
          window.location.hash = 'myactivity';
          location.reload();
      }});
};

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
            url: 'http://localhost:3000/attendant/',
            type: 'POST',
            data: attend,
            dataType: 'json', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},           
            error: function (xhr, status) {
                alert("Težave pri prijavi!"+status)
            },
            success: function (data) {
                 window.location.hash = 'my_activity';
            }
      });
}
//call more infor abaout my activities
function myActivity(id){
   window.location.hash = 'activity/'+id;
}
//call funcntion abaout all activities on Google maps
function SingleActivity(id){
   window.location.hash = 'singleactivity/'+id;
}

function myActivity_page(){
   window.location.hash = 'my_activity';
}
function index_page(){
   window.location.hash = 'index';
   location.reload();
}
function myAttend_page(){
  
   window.location.hash = 'my_attend';
 // location.reload();
}

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
        window.location.hash = 'index';
        location.reload();
       }
    });
  }
  e.preventDefault();
});


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
    $.ajax({
        url: 'http://localhost:3000/activity',
        type: 'POST',
        data: activity,
        dataType: 'json', 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},           
        error: function (xhr, status) {
            alert("Težave pri prijavi!"+status);
        },
        success: function (data) {
            window.location.hash = 'myactivity';
        }
    });
  }
  e.preventDefault();
  });


//Funkcije katere ne vračajo rezultata v HBS-ju. navigiranje z sammy-om! 
//Za to ne obstajajo strani, za spodnje obstajajo! 
//
//
$( ".logout_btn" ).bind( "click", function(event, ui) {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
    window.location.hash = 'login';
});


//Funkcije katere vračajo rezultat potem v HBS-ju. navigiranje z sammy-om!
//
//
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
//MY ACTIVITY 
    this.get('#my_activity', function (context) {
     $.ajax({
           url: 'http://localhost:3000/user/login?username='+localStorage.username+'&password='+localStorage.password+'',
            type: 'GET',
            dataType: 'json',         
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},         
            error: function (xhr, status) {
             // alert('Napačni podatki');
              //window.location.hash = 'login';
            },
            success: function (data) {

           var activities = {
                  'title':'Aktivnosti',
                  'entries': data['activityList']};
             loadActivities(activities);
            }
        });
    });

//MY ATTENDS
    this.get('#my_attend', function (context) {
      
        $.ajax({
           url: 'http://localhost:3000/user/login?username='+localStorage.username+'&password='+localStorage.password+'',
            type: 'GET',
            dataType: 'json',         
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},         
            error: function (xhr, status) {
             // alert('Napačni podatki');
              //window.location.hash = 'login';
            },
            success: function (data) {
              var attends = {
                  'title':'Aktivnosti',
                  'entries': data['attendantList']};
             //loadActivities(activities);
            
              loadMyAttend(attends);
            }
        });
    });
//ACTIVITY
    this.get('#activity/:id', function (context) {
        var id=this.params['id'];
        window.location.hash = 'activity';
        $.ajax({
              url: 'http://localhost:3000/activity/'+id+'?username='+localStorage.username+'&password='+localStorage.password,
              type: 'GET',
              dataType: 'json', 
              contentType: 'application/json; charset=utf-8',           
              success: function (data) {                
                  loadSingleActivity(data);
              }
          });
    });

             
  function loadMyAttend(data){ 
     var source   = $("#attend-template").html();
    var template = Handlebars.compile(source);
    var html = template(data);
    $("#articleFMBHandlebars").html(html);           
    $("#listview-content").trigger('create');  
    $("#my_attend").trigger('pagecreate');
    $("#articleFMBHandlebars ul").listview('refresh');
    $("#articleFMBHandlebars ul").listview().listview('refresh');
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

    this.get('#singleactivity/:id', function (context) {
          var id=this.params['id'];
         
          window.location.hash = 'singleactivity';
          localStorage.setItem('username', 'urban');
          localStorage.setItem('password', 'urban');
          $.ajax({
              url: 'http://localhost:3000/activity/'+id+'?username='+localStorage.username+'&password='+localStorage.password,
              type: 'GET',
              dataType: 'json', 
              contentType: 'application/json; charset=utf-8',           
              success: function (data) {   
                        
                loadAttendSingleActivity(data);
              }
          });
     });
 
function loadActivities(data){  
    var source   = $("#articles-template").html();
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
function loadAttendSingleActivity(data)
    {  
      var source   = $("#attend_single_my_activity-template").html();
      var template = Handlebars.compile(source);
      var html = template(data);
      $("#attendsingleActivity").html(html);           
    }

});

  $(function() {
    sammy.run('#index');
  });

})(jQuery);


