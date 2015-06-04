'use strict';
localStorage.setItem('url', 'http://164.8.221.107:3000');

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
           
          name = results.rows.item(i).name
          description = results.rows.item(i).description
          start_time = results.rows.item(i).start_time
          end_time = results.rows.item(i).end_time
          picture = results.rows.item(i).picture
          latitude = results.rows.item(i).latitude
          longitude = results.rows.item(i).longitude
          number_of_person = results.rows.item(i).number_of_person
          user_id = results.rows.item(i).user_id
          category_id = results.rows.item(i).category_id
          
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



//Funkcije katere ne vračajo rezultata v HBS-ju. navigiranje z sammy-om! 
//Za to ne obstajajo strani, za spodnje obstajajo! 
//
//
$( ".logout_btn" ).bind( "click", function(event, ui) {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
    window.location.hash = 'login';
});

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
        alert("Težave pri prijavi!")
      },
      success: function (data) {
        localStorage.setItem('username', data['username']);
        localStorage.setItem('password', data['password']);
        localStorage.setItem('id', data['id']);
        window.location.hash = 'index';
       }
    });
  }
  e.preventDefault();
});

//Funkcije katere vračajo rezultat potem v HBS-ju. navigiranje z sammy-om!
//
//
(function($) {
    var sammy = $.sammy( function() {

    this.get('#login', function (context) {
      if(localStorage['username']){
        window.location.hash = 'index';
      }
    });

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

    this.get('#my_activity', function (context) {
      localStorage.setItem('username', 'urban');
      localStorage.setItem('password', 'urban');
      $.ajax({
          url: localStorage.url+'/activity/?username='+localStorage.username+'&password='+localStorage.password,
          // url:'http://localhost:3000/activity/?username=urban&password=urban',
          type: 'GET',
          dataType: 'json', 
          contentType: 'application/json; charset=utf-8',           
          success: function (data) {                
              var activities = {
                  'title':'Aktivnosti',
                  'entries': data};
             loadActivities(activities);
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
  });

  $(function() {
    sammy.run('#login');
  });

})(jQuery);
