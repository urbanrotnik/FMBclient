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