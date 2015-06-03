'use strict';
localStorage.setItem('url', 'http://164.8.221.107:3000');

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
    sammy.run('#index');
  });

})(jQuery);
