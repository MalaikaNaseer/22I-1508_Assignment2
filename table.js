const apikey='9924c062e7e837c7b3dba57f4a2c267d';
const apiURL='https://api.openweathermap.org/data/2.5/weather';
const forcastUrl='https://api.openweathermap.org/data/2.5/forecast';

let currentpage=1;
const itemPerPage=10;
let weaatherData=[];

const search=document.getElementById('search');
//function to check whether user has input a location or not
search.addEventListener('click',function(){
    const location=document.getElementById('locationinput').value;

    if(location){
        fetchWeather(location);

    }else{
        alert("Please enter a location!");
    }
});

function findLocation(){
    let location=false;
}
function fetchWeather(location){
    const url = `${forcastUrl}?q=${location}&appid=${apikey}&units=metric`;

    //for fetching weather data from OpenWeatherApi
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.cod ==='200') {
            weaatherData=data.list;
            currentpage=1;
            displayWeatherTable();
            setupPagination();
        }else{

           alert(data.message);
        }
    })
    .catch(error => {
console.error('Error Fetching data:',error);
alert('An error occured while fetching weather data.');

    });
}

function drawTable(){
    
}
function displayWeatherTable(data = weaatherData) {
  
    const body=document.getElementById('tablebody');
    body.innerHTML='';
     //defining table body and number of rows in a page
    const startIndex=(currentpage-1)*itemPerPage;
    const endIndex=startIndex+itemPerPage;

    data.slice(startIndex,endIndex).forEach(entry => {
        const date=new Date(entry.dt * 1000).toLocaleDateString();
        const temp=entry.main.temp.toFixed(1);
        const desc=entry.weather[0].description;

//each row will have date temperature and description as its columns
        const row= `<tr>
                      <td>${date}</td>
                     <td>${temp}</td>
                     <td>${desc}</td>
                    </tr> `;

        body.insertAdjacentHTML('beforeend',row);
    });

}

//to generate new btn to shift to next page after 10 rows
function setupPagination(){
    const pag=document.getElementById('pagination');
    pag.innerHTML='';

    const t_pages=Math.ceil(weaatherData.length/itemPerPage);
    for(let i=1; i<=t_pages;i++){
        const pageBtn=document.createElement('button');
        pageBtn.textContent=i;
        pageBtn.addEventListener('click',()=>{
              currentpage=i;
            displayWeatherTable();
        });
       pag.appendChild(pageBtn);

    }
}

//chatbot logic here
const send=document.getElementById('send');
send.addEventListener('click',function(){
    const query=document.getElementById('userInput').value;
if(query){
    handleResponse(query);
    //to clear the search area
    document.getElementById('userInput').value='';
}
});

//to make sure that it answers only weather related questions
function handleResponse(query){
    const chatArea=document.getElementById('chatarea');
    const msg= `<div>User:${query}</div> `;
    chatArea.insertAdjacentHTML('beforeend',msg);

    if(weaatherData.length===0){
        const botResponse= `<div>Bot:Please fetch weather data first.</div> `;
        chatArea.insertAdjacentHTML('beforeend',response);
        chatArea.scrollTop=chatArea.scrollHeight;
        return;
    }

    const temperatures=weaatherData.map(entry =>entry.main.temp);
    let botResponse;
if(query.toLowerCase().includes('weather')) {
    botResponse= `<div>Bot: What do you want to know about weather?</div> `;
}

//for highest temperature
else if(query.toLowerCase().includes('highest temperature')) {
    const highest=Math.max(...temperatures).toFixed(2);
    botResponse= `<div>Bot: The Highest Temperature is ${highest}°C</div> `;
}
//for lowest temperature
else if(query.toLowerCase().includes('lowest temperature')) {
    const lowest=Math.min(...temperatures).toFixed(2);
    botResponse= `<div>Bot: The Lowest Temperature is ${lowest}°C</div> `;
}
//for displaying average temperature
else if(query.toLowerCase().includes('average temperature')) {
    const avg=(temperatures.reduce((a,b) => a+b,0)/temperatures.length).toFixed(2);
    botResponse= `<div>Bot: The Average Temperature is ${avg}°C</div> `;
}
else{
    botResponse = `<div>Bot: I can currently answer weather-related queries.</div>`;

}

chatArea.insertAdjacentHTML('beforeend',botResponse);
chatArea.scrollTop=chatArea.scrollHeight;
}

//for sorting table data is ascending order
document.getElementById('sortAsc').addEventListener('click',()=>{
const sortData=[...weaatherData].sort((a,b) =>a.main.temp-b.main.temp);
displayWeatherTable(sortData);
});

//for sorting table data is descending order
document.getElementById('sortDsc').addEventListener('click',()=>{
    const sortData=[...weaatherData].sort((a,b) =>b.main.temp-a.main.temp);
    displayWeatherTable(sortData);
    });
//for filtering data that that contains rain
    document.getElementById('filter').addEventListener('click',()=>{
        const filterData=weaatherData.filter(entry => entry.weather[0].description.includes('rain'));
        displayWeatherTable(filterData);
        });
//for displaying highest temperature
        document.getElementById('HighestTemp').addEventListener('click',()=>{
         const high=weaatherData.reduce((max, entry) => entry.temp>max.temp?entry:max, weaatherData[0]);

            displayWeatherTable([high]);
            });