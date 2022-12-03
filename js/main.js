const dateObj = new Date();
const firebaseConfig = {
    apiKey: "AIzaSyBJ43P1fXyaKHVjhBTnx8w-FHGuAmK0cWY",
    authDomain: "dcproject-ed89c.firebaseapp.com",
    databaseURL: "https://dcproject-ed89c-default-rtdb.firebaseio.com",
    projectId: "dcproject-ed89c",
    storageBucket: "dcproject-ed89c.appspot.com",
    messagingSenderId: "822608935203",
    appId: "1:822608935203:web:211fb7780fe4c514f33496",
    measurementId: "G-29SGB1VGYS"
    };
    
    // Initialize Firebase

//var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

var dataset={
    'place':"Noida nagar",
    'aqi':32423,
    'expence':80,
    'temp':23.05,
    'population':'high',
    'wether':'clear',
    'shouldGo':79,
    'lon':77.33,
    'lat':28.58,
   'date':'12 55 43',
   'iconcode':`http://openweathermap.org/img/w/50d.png`
    
};
    firebase.initializeApp(firebaseConfig);
    var DataRef = firebase.database().ref('Places/'+dataset.place);
    


 


function shouldgo(wether){
    var state='Normal'
    if(wether[1]=='clear'){
        state='Normal'
    }
    else if(wether[1]=='Clouds'){
        state='Modrate'
    }
    else if(wether[1]=='Smoke'){
        state='Danger'
    }
    else{
        state='Hight';
    }

    return state;
}

const getWeather = async(city) => {
        const API_KEY='f69eab89030e780c9514c4820eceb91d';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        try{
            const response = await fetch(url);
            const data = await response.json()
            dataset.lon=data.coord.lon;
            dataset.lat=data.coord.lat;
            dataset.iconcode=`http://openweathermap.org/img/w/${data.weather[0].icon}.png`
            var weatherDataset=[data.main.temp,data.weather[0].main];
            return weatherDataset;
        }catch(e){
            const url = `https://api.openweathermap.org/data/2.5/weather?q=Noida&appid=${API_KEY}&units=metric`
            const response = await fetch(url);
            const data = await response.json()
            dataset.lon=data.coord.lon;
            dataset.lat=data.coord.lat;
            var weatherDataset=[data.main.temp,data.weather[0].main];
            return weatherDataset;
            

        }


       
} 
const getAirQty=async (lat,lon) =>{
    
    const aqikey='2e6a0013-90d4-4555-8ef4-d661368e2342';
    const url_aqi = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${aqikey}`
    const response_aqi = await fetch(url_aqi);
    const data_aqi = await response_aqi.json()
    console.log(data_aqi)
    const airqty= await data_aqi.data.current.pollution.aqius;
    
    return airqty; 
}

function uploaddata(name, aqiLevel, expenceValue, populationValue, wetherValue, goPercent,tempvalue,dateval,iconval){
    DataRef=firebase.database().ref('Places/'+dataset.place);
    DataRef.set({
      place: name,
      aqi: aqiLevel,
      expence:expenceValue,
      temp:tempvalue,
      population:populationValue,
      wether:wetherValue,
      shouldGo:goPercent,
      date:dateval,
      icon:iconval
    });
    // alert('Saved');
}

function removedata(placename){
    firebase.database().ref('Places/'+[placename]);
}

// Upload Function whill be call Here!!!!

const cityname='gardens galleria';
const countryname='India'
const stateName='Uttar Pradesh'
const populationBar='Normal';
var Wetherdataset= getWeather(cityname).then((value)=>
{
    var AqiDAta=getAirQty(dataset.lat,dataset.lon).then( (Airvalue)=>{
        
    

        dataset.place=cityname;
        dataset.date=`${dateObj.getHours()} ${dateObj.getMinutes()}`;
        dataset.population=populationBar;
        dataset.temp=value[0];
        dataset.wether=value[1];
        dataset.aqi=Airvalue;
        dataset.shouldGo=shouldgo(value);
        
        uploaddata(dataset.place,dataset.aqi,dataset.expence,dataset.population,dataset.wether,dataset.shouldGo,dataset.temp,dataset.date,dataset.iconcode);

    })
    
    

});




//------------->>>>>>>>>>>>>>>>.

function diff_hours(time, currentTime) 
 {
    
    var totaldiff;
    var diffmin;
    var diffhou;
    if(time[0]<currentTime[0]){
        
        if(time[1]> currentTime[1]){var val=60-time[1];diffmin=val+currentTime[1];}
        else{diffmin=currentTime[1]-time[1];}
        
        diffhou=currentTime[0]-time[0];
        totaldiff=`${diffhou}h ${diffmin} min ago`
    }
    else if(time[0]==currentTime[0]){
        if(time[1]> currentTime[1]){diffmin=time[1]-currentTime[1];}
        else{diffmin=currentTime[1]-time[1];}
        
        totaldiff=`${diffmin} min ago`
    }
    else{
        totaldiff='Older than a day'
    }
    return totaldiff;
  
 }

 function airAQIimage(aqi){
    var imagesource='icons/eair.png';
    if(aqi>=50 && aqi<=100){
        imagesource='icons/nair.png';
    }
    else if(aqi>100){
        imagesource='icons/hair.png';
    }
    else{
        imagesource='icons/eair.png';
    }
    return imagesource;

 }

//  var time=[10,10]
//  var curr=[14,20]
 
//  console.log(diff_hours(time,curr))





async function getAllData(place_){
    var AllData=[];
    var FireDataRef = firebase.database().ref('Places/');
    FireDataRef.on("value",function(snapshot){
        snapshot.forEach(function (childSnapshot){
            AllData.push(childSnapshot.val());
        });




        function display(){

            
            for(let j=0; j<AllData.length; j++){
                if(place_== AllData[j].place){
                  console.log(AllData[j]);

                    
                  var dateapi=AllData[j].date;
                  var Apitime=dateapi.split(" ");
                  var currtime=[dateObj.getHours(),dateObj.getMinutes()];
                  console.log(Apitime);
                  console.log(currtime);
                  var Datestring=diff_hours(Apitime,currtime);

                  var Airimage=airAQIimage(AllData[j].aqi);
                  
                  
                
                  searchPage.innerHTML +=`
                  <div class="searchbox">
                    <div class="imageframe">
                        <img class='searchimage' src="icons/searchback.jpg" alt="">
                    </div>
                    <div class="content">
                     <h3>${AllData[j].place}</h3>
                     
                     <div class="infos">
            
               <div class="holder"><img class="small-icon" src=${Airimage} alt=""><p id="aqi">AQI: ${AllData[j].aqi}</p></div>
               <div class="holder"><img class="small-icon" src=${AllData[j].icon} alt=""><p>Weather: ${AllData[j].wether}</p></div>
               <div class="holder"><img class="small-icon" src="icons/shouldgo.png" alt=""><p>ShouldGo: ${AllData[j].shouldGo}</p></div>
               <div class="holder"><img class="small-icon" src="icons/croud.png" alt=""><p>Crowd: ${AllData[j].population}</p></div>
               <div class="holder"><img class="small-icon" src="icons/temp.png" alt=""><p>Temprature: ${AllData[j].temp} C</p></div>
               <div class="holder"><img class="small-icon" src="icons/update.png" alt=""><p>Updated: ${Datestring}</p></div>
           
            
                
                     </div>
                     
                  </div>
               </div>`
                }
            }        
            return;
        }

        
        display();

})}







const searchPage=document.querySelector('.searchResult')
const submit=document.querySelector('#submission')

submit.addEventListener('click' ,(e)=>{
   const typedplace = document.getElementById('fname').value ;
   console.log("form just got submitted");
   console.log(typedplace);
   getAllData(typedplace);
})





