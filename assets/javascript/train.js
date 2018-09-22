$(document).ready(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDHMvmgDOPl8956H0AXosA7v5AoKTU6kxM",
    authDomain: "train-to-the-future-829b4.firebaseapp.com",
    databaseURL: "https://train-to-the-future-829b4.firebaseio.com",
    projectId: "train-to-the-future-829b4",
    storageBucket: "train-to-the-future-829b4.appspot.com",
    messagingSenderId: "570151769722"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";


  $("#submitbutton").on("click", function(event) {

    event.preventDefault();

    
      trainName = $("#trainname").val().trim();
      destination = $("#destination").val().trim();
      firstTrainTime = $("#firsttraintime").val().trim();
      frequency = $("#frequency").val().trim();
     
     
    database.ref().push({

      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
      });
    });



    database.ref().on("child_added", function(watcher){

      console.log('Train Name: ' + watcher.val().trainName);
      console.log('Destination: ' + watcher.val().destination);
      console.log('First Train Arrival Time: ' + watcher.val().firstTrainTime);
      console.log('Train Frequency: ' + watcher.val().frequency);

    
    $('.form-control').val("");

      var currentTime = moment();
      console.log("Current Time: " + moment(currentTime).format('HH:mm'));
      
      var firstTime = moment(watcher.val().firstTrainTime, 'HH:mm', true).subtract(1, "years");

      var tFrequency = moment(parseInt(watcher.val().frequency));

      var diffTime = moment().diff(moment(firstTime), "minutes");

      var remainder = diffTime % tFrequency;

      var timeTillTrain = parseInt(tFrequency - remainder);

      var nextChooChoo = moment().add(timeTillTrain, "minutes");

      var formatNextChooChoo = moment(nextChooChoo).format("HH:mm");


    $('.tablebody').append("<tr><td id = 'train_name'>" + watcher.val().trainName 
      + "</td><td id = 'arrival_destination'> " + watcher.val().destination
      + "</td><td id = 'frequency_minutes'> " + watcher.val().frequency
      + "</td><td id = 'next_arrival'> " + formatNextChooChoo
      + "</td><td id = 'minutes_togo'> " + timeTillTrain        
      + "</td></tr>")

    
      var factChecker = function(){
        var startTime = moment().format('ss');
        var counter = parseInt($('#minutes_togo').text());        
        console.log(startTime);

        if(startTime === '00'){
          counter--;
          console.log(counter);
          $('#minutes_togo').text(counter);
        }
        if (counter === 0){
          $('#minutes_togo').text(timeTillTrain);
        }
      }
      
       var check = setInterval(function(){
        factChecker()}, 1000);


    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);

    });
});