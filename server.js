const express = require("express");
const bodyParser = require('body-parser');
const redis = require("redis");
if (process.env.NODE_ENV != 'test') {
    var Gpio = require('onoff').Gpio;
}

const app = express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000

const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});
client.set('value', 0);
client.set('toggle', 0);

if (process.env.NODE_ENV != 'test') {
    var buzzer = new Gpio(4, 'out');
}

function beepbuzzer() { //function to start blinking
    if (buzzer.readSync() === 0) { //check the pin state, if the state is 0 (or off)
      buzzer.writeSync(1); //set pin state to 1 (turn buzzer on)
    } else {
      buzzer.writeSync(0); //set pin state to 0 (turn buzzer off)
    }
}

  

app.post("/update", (req, res) => {
    console.log(req.body.value);
    client.set('value', req.body.value);

    client.get('toggle', (err,value)=>{
        if(!err){
            if((req.body.value < 30)&&(value == 1)){
                var blinkInterval = setInterval(beepbuzzer, 250);
                setTimeout(endBlink, 5000);
                function endBlink() { //function to stop blinking
                    clearInterval(blinkInterval); // Stop blink intervals
                    buzzer.writeSync(0); // Turn buzzer off
                    // buzzer.unexport(); // Unexport GPIO to free resources
                }
            }

            if((req.body.value > 90)&&(value == 0)){
                var blinkInterval = setInterval(beepbuzzer, 250);
                setTimeout(endBlink, 5000);
                function endBlink() { //function to stop blinking
                    clearInterval(blinkInterval); // Stop blink intervals
                    buzzer.writeSync(0); // Turn buzzer off
                    // buzzer.unexport(); // Unexport GPIO to free resources
                }
            }

            // if((req.body.value > 70)&&(value == 0)){
            //     client.set('toggle', 1);
            // }
        }else{
            res.statusCode(404);
        }
    });

    res.sendStatus(200);
})

app.get('/', (req, res) => {
    res.send("hello");
    // var blinkInterval = setInterval(beepbuzzer, 250);
    // setTimeout(endBlink, 5000);
    // function endBlink() { //function to stop blinking
    //     clearInterval(blinkInterval); // Stop blink intervals
    //     buzzer.writeSync(0); // Turn buzzer off
    //     // buzzer.unexport(); // Unexport GPIO to free resources
    // }
})

app.get('/status', (req,res)=>{
    client.get('value', (err,value)=>{
        if(!err){
            var percentage = (((122-value)/122)*100);
            res.json({ 
                value: value,
                percentage: percentage
            });
        }else{
            res.statusCode(404);
        }
    })
});

app.get('/turnedoff', (req, res) => {
    client.set('toggle', 0);
    res.send("turnedoff");
})

app.get('/turnedon', (req, res) => {
    client.set('toggle', 1);
    res.send("turnedoff");
})

app.get('/togglestatus', (req,res)=>{
    client.get('toggle', (err,value)=>{
        if(!err){
            res.json({ 
                toggle: value
            });
        }else{
            res.statusCode(404);
        }
    })
});

if (process.env.NODE_ENV === 'test') {
    module.exports = app
  } else {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}