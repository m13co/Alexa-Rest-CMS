const Alexa = require('alexa-sdk');
//npm package for handling async requests w. promises DOKU: https://github.com/axios/axios
const axios = require('axios');

//festlegen der URL des REST Endpoints
const url = 'https://alexapjs.000webhostapp.com/wp-json/wp/v2/posts';

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(restHandler);
    alexa.execute();

}
var data;
//counter to loop thorugh the response array
var counter = 0;

const restHandler = {
    'getData': function () {
        //Übergabe der URL an Funktion die Promise erzeugt
        //Promise hat bei Rückgabe zwei Funktionen -> Erfolgreich => .then / Fehler => .catch
        //Im .then teil kann anschießend der Rückgabewert des Promise weiter verarbeitet werden 
        //Arbeiten mit Promise Rückgabewert auserhalb von .then Block nicht möglich => Asyncrhon
        //Bis hierhin synchroner Code
        data = getRequest(url);
        //Start Asynchroner Code
        // Über Arrow functions 
        data.then((response) => {
                //Dieser Teil wird erst ausgeführt, wenn Promise fullfilled -
                //Asynchroner Teil => Success
                let speachout = createSpeachArray(response);
                let responseLength = speachout.length
                let newsTitle = speachout[counter].title;
                let newsContent = speachout[counter].content;
                console.log('Array Länge:  ' + responseLength + 'Beitragstitel: ' + newsTitle + ' Inhalt ist :' + newsContent);
             //   getNext(responseLength);

                this.emit(':tell', 'Array Länge:  ' + responseLength + 'Beitragstitel: ' + newsTitle + ' Inhalt ist :' + newsContent);
            })
            .catch((err) => {
                //wenn Error beim Abfragen von Promise wird dieser Block ausgeführt
                // Asynchorner Teil => Fail
                console.log(err, 'Fehler bei Rest Request');
                this.emit(':tell', 'Fehler beim Abfragen des CMS');

            });
            //hier wieder Syncrhoner Code


    }
}
//creating promise
function getRequest(url) {
    //Über npm package  axios ganz einfach promise erstellen für REST call
    var prom = axios.get(url);
    return prom;

}

function createSpeachObj(data) {
    //Erstellt Objekte für das Array aus createSpeachArray Funktion 
    //Zugriff auf die Texte im CMS Blogeintrag über .rendered

    var respObj = {
        'title': data.title.rendered,
        'content': data.content.rendered
    };
    return respObj;
}

function createSpeachArray(response) {
//Methode die bei Promise success ausgeführt wird
// => Über response.data auf Nachrichten Body der Antwort zugreifen
// => Hier wird für die Blogeinträge ein Array erstellt.

    var respseData = response.data;
    var wpArray = [];
    //dummy Länge => noch response anpassen
    for (i = 0; i < 5; i++) {
        var toArray = respseData[i];
        wpArray.push(createSpeachObj(toArray));
        console.log(i, toArray);
    }
    return wpArray;
}
/**
 * 
 * Hier muss noch weiter gecodet werden
 * 
 * 
function getNext(responseLength) {
    var ret = true;
    if (counter < responseLength) {
        counter++;
    } else {
        counter = false;
    }
    return ret;
}


 * 
 * 
 */