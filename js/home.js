$(document).on('pagebeforeshow', '#listview-page', function(){
    parseRSS(); 
});

function parseRSS() {
      var articles = { entries: []};
      for (var i = 0; i <=4; i++)
      {
        var obj = {
          title: "test" + i
        };
        articles.entries.push(obj);
      }
      showData(articles);

}

function showData(data)
{
 var source   = $("#articles-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $("#articleHandlebars").html(html);   
  $("#my_activity").trigger('create');  
  $("#listview-page").trigger('pagecreate');
  $("#articleHandlebars ul").listview('refresh');
  $("#articleHandlebars ul").listview().listview('refresh');
 }