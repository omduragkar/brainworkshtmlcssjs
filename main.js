// To show aler message
var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
// Add button
var alertTrigger = document.getElementById('liveAlertBtn')
// Fetch button
var fetchbtn= document.querySelector(".fetchbtn");
var  fnameipsearch = document.querySelector(".fnameipsearch");
// Global variable for storing data
var arr=[];



// To fetch data:
let getdata = async () => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/1UcbXB172hnmutRW3gypmEEBaPpFdsXxcVB71zZJuAL4/values/bt?key=AIzaSyDeBzcMT6hXT-szNV8xtprJCZAq0O_riDM', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const myJson = await response.json(); //extracting JSON from the http response
  // do something with JSON data
  // console.log(myJson.values);
  arr = myJson.values.filter((v, i)=>i!=0)
}

getdata();


// Fetch button event with function
fetchbtn.addEventListener('click', fetchbtnclick);

function fetchbtnclick(){
  console.log(gapi.auth2.getAuthInstance().isSignedIn.Nb)
  let  ip = fnameipsearch.value;
  let searcharr = arr.filter(v=>{
    let ser = new RegExp(ip, "i");
    return ser.test(v[0]);
  })
  document.querySelector(".tablebody").innerHTML="";
  searcharr.map(elm=>{
    document.querySelector(".tablebody").innerHTML+=`<tr>
    <td>${elm[0]}</td>
    <td>${elm[1]}</td>
</tr>`

  })
  console.log(searcharr);
  
}
// Alert function
function callsave(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  alertPlaceholder.append(wrapper)
}



// Event for add Data
alertTrigger.addEventListener('click', function () {
  console.log(gapi.auth2.getAuthInstance().isSignedIn.Nb);
  // If user is not logged in: 
  if(!gapi.auth2.getAuthInstance().isSignedIn.Nb){
    authenticate("AD");
  }else{
    loadClient();
  }
})


// ADD CHANGES AUTH function:
function authenticate(comingfrom) {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets"})
      .then(function() { console.log("Sign-in successful");
      if(comingfrom == "AD"){
        loadClient(); 
      }else{
        fetchbtnclick();
      }
      },
      function(err) { console.error("Error signing in", err);
      comingfrom == "AD" && callsave('Failed to sign in', 'danger')});
}
// ADD CHANGES AUTH client id fetching function:

function loadClient() {
  gapi.client.setApiKey("AIzaSyDeBzcMT6hXT-szNV8xtprJCZAq0O_riDM");
  return gapi.client.load("https://sheets.googleapis.com/$discovery/rest?version=v4")
      .then(function() {
        console.log("GAPI client loaded for API");
        execute();
     },
      function(err) { 
        console.error("Error loading GAPI client for API", err);
        callsave('Failed to load GAPI CLIENT', 'danger')

      });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  let  fname = document.querySelector(".fnameinput").value;
  let  lname = document.querySelector(".lnameinput").value;
  console.log(fname, lname);
  return gapi.client.sheets.spreadsheets.values.append({
    "spreadsheetId": "1UcbXB172hnmutRW3gypmEEBaPpFdsXxcVB71zZJuAL4",
    "range": "bt",
    "includeValuesInResponse": true,
    "insertDataOption": "INSERT_ROWS",
    "responseDateTimeRenderOption": "FORMATTED_STRING",
    "responseValueRenderOption": "FORMATTED_VALUE",
    "valueInputOption": "USER_ENTERED",
    "resource": {
      "majorDimension": "ROWS",
      "range": "bt",
      "values": [
        [
          fname,
          lname
        ]
      ]
    }
  })
  .then(function(response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          callsave('Added value Success', 'success')
          getdata();
        },
        function(err) { 
          console.error("Execute error", err);
          
          callsave('Failed', 'danger')

         });
}

// GAPI:

gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "971130848112-t9gke4hek1jm0jjhgqjhuldhrseqqqkd.apps.googleusercontent.com"});
});





