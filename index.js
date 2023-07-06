const http = require('http'); // http module ko call kiya server create karne k liye
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");  // home.html ka data backend me (node js me)le liya

//niche hamne replaceval ko call kiya jo do parameter expect kar raha tha temperary valu aaur orignal value  es functon k andar hamne temp value ko realtime orignal vaue se replace kiya ye .main.temp ye hamare array of an object me sse value  lene ka tarika samzlo
// fir hamne saree value replace karke niche temperature k rooop m return kar diya
const replaceVal = (tempVal, orgVal) =>{
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp)
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min)
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max)
  temperature = temperature.replace("{%location%}", orgVal.name)
  temperature = temperature.replace("{%country%}", orgVal.sys.country)
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
 
return temperature;
} 

const server = http.createServer((req, res) => {   // creating server
     
    if (req.url == "/"){
    
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=a8ce448228eaee18bf7282d54b433ae2", )
        .on('data',  (chunk) => {
            const objdata = JSON.parse(chunk)// jo data (chunk) hame json me mila use object me convert kiya
            //console.log(chunk)
            const arrData = [objdata];// object data ko array me convert kiya , ab hame jo bhi data milega vo hame array of an object me milega
          // console.log(arrData[0].main.temp)

           // hum map method use karenge data fetch karne ke liye array of an object se
          const realTimeData = arrData.map((val) =>replaceVal(homeFile, val)).join("");
          // uper k 2 line me hamne realtimedata fetch kiya jo hame val k roop me mila aaur second line me hum home file yani hamri home .html ko val se repplace karenge esliye hamne replaceval nam ka function banaya tha jisme tempary value aaur orignal value aa gaye

          // .join esliye q ki hum jo dATA de rahe hai.. vo array me hai aaur hume vo string me dikhana hai
          res.write(realTimeData);  // hamne temparary data k badale current data respond kiya

          // console.log(realTimeData)
 
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
         
          res.end();
          
        });

    }
})

server.listen(8000,"127.0.0.1");