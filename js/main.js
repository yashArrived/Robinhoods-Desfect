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
    'date':'12 55 43'
    
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

function uploaddata(name, aqiLevel, expenceValue, populationValue, wetherValue, goPercent,tempvalue,dateval){
    DataRef=firebase.database().ref('Places/'+dataset.place);
    DataRef.set({
      place: name,
      aqi: aqiLevel,
      expence:expenceValue,
      temp:tempvalue,
      population:populationValue,
      wether:wetherValue,
      shouldGo:goPercent,
      date:dateval
    });
    // alert('Saved');
}

function removedata(placename){
    firebase.database().ref('Places/'+[placename]);
}

// Upload Function whill be call Here!!!!
const cityname='Ghaziabad';
const countryname='India'
const stateName='Uttar Pradesh'
const populationBar='Normal';
var Wetherdataset= getWeather(cityname).then((value)=>
{
    var AqiDAta=getAirQty(dataset.lat,dataset.lon).then( (Airvalue)=>{
        
    

        dataset.place=cityname;
        dataset.date=`${dateObj.getHours()} ${dateObj.getMinutes()} ${dateObj.getSeconds()}`;
        dataset.population=populationBar;
        dataset.temp=value[0];
        dataset.wether=value[1];
        dataset.aqi=Airvalue;
        dataset.shouldGo=shouldgo(value);
        uploaddata(dataset.place,dataset.aqi,dataset.expence,dataset.population,dataset.wether,dataset.shouldGo,dataset.temp,dataset.date);

    })
    
    

});




//------------->>>>>>>>>>>>>>>>.






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

                  searchPage.innerHTML +=`<div class="box">
                  <div class="image">
                     <img src="images/img-1.jpg" alt="">
                  </div>
                  <div class="content">
                     <h3>${AllData[j].place}</h3>
                     
                     <div class="infos">
                        <p>Aqi:${AllData[j].aqi}</p>
                        <p>Wether:${AllData[j].wether}</p>
                        <p>ShoulGo:${AllData[j].shouldGo}</p>
                        <p>Population:${AllData[j].population}</p>
                        <p>Temp:${AllData[j].temp}</p>
                     </div>
                     
                  </div>
               </div>`

                



                }
            }        
            return;
        }

        
        display();

})}







const searchPage=document.querySelector('.home-offer')
const submit=document.querySelector('#submission')

submit.addEventListener('click' ,(e)=>{
    const typedplace = document.getElementById('fname').value ;
   console.log("form just got submitted");
   getAllData(typedplace);
})





