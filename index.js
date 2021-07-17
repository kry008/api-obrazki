const express = require('express');
const morgan = require('morgan');
resolve = require('path').resolve
const testFolder = './public/obrazki/';
const fs = require('fs');
const send = require('send');
//losowa liczba z zakresu
function losowa(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var i = 0;
var items = [];
fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
        //console.log(file);
        items[i] = file;
        i++
    });
});
const app = express();
//pliki statyczne
app.use(express.static('public'));
//logi
app.use(morgan('dev'));


//strona główna
app.get('/', (req, res) => {
    var liczbalosowa = losowa(0, items.length - 1)
    var wylosowany = items[liczbalosowa]
    var link = "http://" + req.headers.host + "/obrazki/" + wylosowany
    var odpowiedz = {
        Jak_uzywac: "Odwiedzając stronę główną jest losowany za każdym razem jeden obraz z puli. Wszystkie obrazki są licencji CC0 z Pixabay. Jest możliwość wylosowania również filmu (CC0). Zmienna url podaje bezpośredni link do obrazka",
        How_to_use: "When visiting the home page, one image is drawn from the pool each time. All images are licensed under the CC0 from Pixabay. It is also possible to draw a movie (CC0). The url variable gives a direct link to the image",
        number: liczbalosowa,
        uwaga: "Numer może się zmienić",
        warn: "Number may change",
        img: wylosowany,
        url: link,
        to_use_number: "/nr/YOUR_NUMBER",
        git: "https://github.com/kry008/api-obrazki"
    }
    res.status(200).json(odpowiedz);

    //console.log(req.hostname + ":" + req.route)
    console.log(req.headers.host)
});
app.get('/wyswietl', (req, res) => {
    var wylosowany = items[losowa(0, items.length - 1)]
    res.status(200).sendFile(resolve("./public/obrazki/" + wylosowany))
});
app.get('/nr', (req, res) => {
    res.status(400).send("<img src=https://http.cat/400.jpg><br><h2>Musisz dodać parametr np.:/nr/5<br />You must add parameter, example: /nr/5</h2>")
});
app.get('/nr/:nr', (req, res) => {
    if (req.params.nr < 0 || req.params.nr > items.length - 1 || items[req.params.nr] == undefined) {
        res.status(404).send("<img src=https://http.cat/404.jpg>")
    } else {
        var wylosowany = items[req.params.nr]
        res.status(202).sendFile(resolve("./public/obrazki/" + wylosowany))
    }
});




// 404 page
app.use((req, res) => {
    res.status(404).send("<img src=https://http.cat/404.jpg>")
});
let port = process.env.PORT || 3001;
app.listen(port)
console.log(`Słucham na porcie ${port}`)