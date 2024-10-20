const apikey='9924c062e7e837c7b3dba57f4a2c267d';
const apiURL='https://api.openweathermap.org/data/2.5/weather';
const forcastUrl='https://api.openweathermap.org/data/2.5/forecast';

const locationIn=document.getElementById('locationinput');
const search=document.getElementById('search');

const locationElement=document.getElementById('location');
const tempElement=document.getElementById('temperature');
const toggle=document.getElementById('toggle-unit');
const desc=document.getElementById('description');
const humidity=document.getElementById('humidity');
const windsp=document.getElementById('windspeed');
const errorEl=document.getElementById('error');
const weatherwidget=document.getElementById('weather-widget');
const widgetbackground=document.getElementById('widgetBackground');

//function to check whether user has entered a location or not
search.addEventListener('click',function(){
const loc=locationIn.value;

if(loc){
    fetchWeather(loc);

}else{
    //if no location then display error message
    alert("Please enter a Location first!");
}
});

function fetchWeather(loc){
    const url = `${apiURL}?q=${loc}&appid=${apikey}&units=metric`;

    //to check if the city exists or not
    fetch(url)
    .then(response =>response.json())
    .then(data => {
        if(data.cod ==='404'){
            error.textContent='City not found! Please try again.';
            clearWeatherDisplay();
            clearCharts();
        }else{
            //if the city exists then fetching its info and storing in variables
            error.textContent='';
            locationElement.textContent=data.name;
            tempElement.textContent= `${Math.round(data.main.temp)}°C`;
            desc.textContent=`Description: ${data.weather[0].description}`;
            humidity.textContent=`Humidity: ${data.main.humidity}%`;
            windsp.textContent=`Wind Speed: ${data.wind.speed} m/s`;
            let isCel=true;
            let currentTemp = data.main.temp;

            //function to convert temperature from fahrenheit to celcius
            toggle.addEventListener('click',function(){

                if(currentTemp!==null){
                    if(isCel){
                        const tempFah=(currentTemp*9/5)+32;
                        tempElement.textContent=`${Math.round(tempFah)}°F`;
                         toggle.innerText="Switch to Celsius";
                      }else{
                        tempElement.textContent=`${Math.round(currentTemp)}°C`;
                     toggle.innerText="Switch to Fahrenheit";
                         }

                 isCel=!isCel;
                }
                
            });

            //calling function to change background 
           changeBackground(data.weather[0].description);
            toggle.style.display='block';
            fetchForcast(loc);
        }
    })
    .catch(error =>{
console.error('Error Fetching data:',error);
errorEl.textContent='An error occured.Please try again later.';
clearWeatherDisplay();
clearCharts();
    });
}

function setbackground(){
    weatherwidget.style.background="light blue";
}
 // function to change background according to weather condition
function changeBackground(desc){
    weatherwidget.style.backgroundColor="black";
    if(desc.includes("cloud")){
        widgetbackground.style.backgroundImage="url('cloudy.png')";

    }

    else if(desc.includes("overcast cloud")){
        widgetbackground.style.backgroundImage="url('cloudy.png')";

    }
    else if(desc.includes("rain")){
        widgetbackground.style.backgroundImage="url('rain.png')";
        
    }
   else  if(desc.includes("clear sky")){
        widgetbackground.style.backgroundImage="url('clear.jpeg')";
        
    }
    else if(desc.includes("haze")){
        widgetbackground.style.backgroundImage="url('clear.png')";
        
    }

    else{
        widgetbackground.style.backgroundImage="url('clear.png')";
        
    }
}

function checklocation(){
    let location=false;
}

let bar,donot,line;

//fetching data to draw charts
function fetchForcast(loc){
    const url = `${forcastUrl}?q=${loc}&appid=${apikey}&units=metric`;
    fetch(url)
    .then(response => response.json())
    .then (data => {
        const tempData=[];
        const weatherCon = {};

        for(let i=0; i< data.list.length; i+=8){
            const day=data.list[i];
            tempData.push(day.main.temp);
            const wthr=day.weather[0].main;

            weatherCon[wthr]= (weatherCon[wthr] || 0) +1;

        }

        drawBarChart(tempData);
        drawDoughnutChart(weatherCon);
        drawLineChart(tempData);
    })
    .catch(error => {
console.error('Error fetching forecast Data:',error);
    });
}

function setwidthofCharts(){
    
}

function drawBarChart(tempData){
    clearChart(bar);
    const ctx=document.getElementById('tempBarChart').getContext('2d');
    bar=new Chart(ctx, {
        type: 'bar',
        data:{
            labels: ['Day 1','Day 2','Day 3','Day 4','Day 5'],
            datasets: [{
                label: 'Temperature (°C)',
                data:tempData,
                backgroundColor:'rgba(75,192,192,0.2)',
                borderColor:'rgba(75,192,192,1)',
                borderWidth:1

            }]
        },
        options: {
            animation: {
                delay:(context) =>{
                    if(context.type ==='data' && context.mode==='default' && !context.chart.getDatasetMeta(context.datasetIndex).hidden){
                        return context.index*100;
                    }
                    return 0;
                }
               
            }
        }
    });

}


function drawDoughnutChart(weatherCon){
    clearChart(donot);
    const ctx=document.getElementById('wthrDoughnutChart').getContext('2d');
    donot=new Chart(ctx,{
        type:'doughnut',
        data:{
            labels:Object.keys(weatherCon),
            datasets:[{
                label:'Weather Conditions',
                data: Object.values(weatherCon),
                backgroundColor:[
                    '#36A2EB', //clear
                    '#FFCE56', //cloud
                    '#FF6384',//rain
                    '#4BC0C0', //other
                ],
                borderColor:'#fff',
                borderWidth:2
            }]
            
        },
        options:{
            cutout:'80%', // to make center thinner
            plugins: {
                legend:{
                    display:true,
                    position:'top',
                    labels:{
                        color:'#333',
                        font:{
                            size:14
                        }
                    }
                }
            },
            animation: {
                animateRotate:true,
                animateScale:true
            }
        }
    });
}


function drawLineChart(tempData){
    clearChart(line);
    const ctx=document.getElementById('tempLineChart').getContext('2d');
    line=new Chart(ctx,{
        type:'line',
        data:{
            labels:['Day 1','Day 2','Day 3','Day 4','Day 5'],
            datasets:[{
                label:'Temperature (°C)',
                data:tempData,
                fill:false,
                borderColor: 'rgba(75,192,192,1)',
                tension:0.1
            }]
        },
        options:{
            animation:{
                duration:1000,
                easing:'easeInOutBounce'
            }
        }
    });

}

function clearChart(chart){
    if(chart){
        chart.destroy();
    }
}

function clearCharts(){
    clearChart(bar);
    clearChart(donot);
    clearChart(line);
}

function clearWeatherDisplay(){
    locationElement.textContent='';
    tempElement.textContent='';
    desc.textContent='';
    humidity.textContent='';
    windsp.textContent='';
    toggle.style.display='none';
}