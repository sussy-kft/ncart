var allomasok = [];
var jarmuvek = []; // Járműtípusokat tároló tömb
var vonalak = [];

function getAllAllomas() {
    axios
        .get("https://localhost:44339/allomasok")
        .then(function (serverResponse) {
            /*
            [
                {
                    "nev": "string",
                    "id": 0,
                    "koord": {
                    "x": 0,
                    "y": 0
                    }
                }
            ]
            */
            console.log(serverResponse);
            allomasok = serverResponse.data;
            var datalist = document.getElementById("megalloNevek");

            allomasok.forEach(function (allomas) {
                var option = document.createElement("option");
                option.value = allomas.nev;
                datalist.appendChild(option);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Járművek lekérése
function getJarmuvek() {
    axios
        .get("https://localhost:44339/jarmutipusok")
        .then(function (serverResponse) {
            /*
            [
                {
                    "megnevezes": "string",
                    "id": 0
                }
            ]
            */
            console.log(serverResponse);
            jarmuvek = serverResponse.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}
// Vonalak lekérése
function getVonalak() {
    axios
        .get("https://localhost:44339/vonalak")
        .then(function (serverResponse) {
            console.log(serverResponse);
            vonalak = serverResponse.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function tervezes() {
    var honnanMegallo = document.getElementById("honnanMegallo").value;
    var hovaMegallo = document.getElementById("hovaMegallo").value;
    var honnanMegalloId = getIdByName(honnanMegallo);
    var hovaMegalloId = getIdByName(hovaMegallo);
    var datum = document
        .getElementById("date")
        .value.replace("-", ".")
        .replace("-", ".");
    var ido = document.getElementById("appt").value;
    var ejfeltolElteltPercek = convertTimeToMinutesFromMidnight(ido);
    var vehicle1 = document.getElementById("vehicle1").checked;
    var vehicle2 = document.getElementById("vehicle2").checked;
    var vehicle3 = document.getElementById("vehicle3").checked;

    var line1 = document.getElementById("line1").checked;
    var line2 = document.getElementById("line2").checked;
    var line3 = document.getElementById("line3").checked;
    var line4 = document.getElementById("line4").checked;
    var line5 = document.getElementById("line5").checked;

    var data = {
        honnan: honnanMegalloId,
        hova: hovaMegalloId,
        mikor: ejfeltolElteltPercek,
        indulas_e: true,
        datum: datum,
        jarmuKivetel: [],
        vonalKivetel: [],
    };

    // Járműtípusok ellenőrzése és hozzáadása a jarmuKivetel tömbhöz
    if (vehicle1) {
        var jarmuId = getIdByMegnevezes("NCART");
        if (jarmuId !== null) {
            data.jarmuKivetel.push(jarmuId);
        }
    }

    if (vehicle2) {
        var jarmuId = getIdByMegnevezes("NCBT");
        if (jarmuId !== null) {
            data.jarmuKivetel.push(jarmuId);
        }
    }

    if (vehicle3) {
        var jarmuId = getIdByMegnevezes("NCET");
        if (jarmuId !== null) {
            data.jarmuKivetel.push(jarmuId);
        }
    }

    if (line1) {
        var lineId = "M1";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }

    if (line2) {
        var lineId = "M2";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }

    if (line3) {
        var lineId = "B1";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }

    if (line4) {
        var lineId = "E1";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }

    if (line5) {
        var lineId = "E2";
        if (lineId !== null) {
            data.vonalKivetel.push(lineId);
        }
    }
    axios
        .post("https://localhost:44339/dQw4w9WgXcQ/legkevesebb", data)
        .then(function (response) {
            console.log(response.data);
            // Ellenőrizzük, hogy a válasz üres-e vagy nem
            if (response.data && response.data.length > 0) {
                // Ha van már táblázat és a második sorban vannak adatok, akkor cseréljük ki az adatokat
                var table = document.querySelector("#jarat table");
                if (table && table.rows.length > 1) {
                    var row = table.rows[1];
                    row.innerHTML = ""; // Törlünk mindent a második sorból
                    displayDataInTableRow(response.data[0], row); // Megjelenítjük az új adatokat a második sorban
                } else {
                    // Ha nincs táblázat vagy az első sorban nincsenek adatok, akkor hozzáadjuk az új adatokat
                    displayDataInTable(response.data);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
            // A táblázat megjelenítése a függvény végén
            document.getElementById("jarat").style.display = "block";
        });
}
function getIdByName(name) {
    for (let i = 0; i < allomasok.length; i++) {
        if (allomasok[i].nev === name) {
            return allomasok[i].id;
        }
    }
    return null;
}

function getNameById(id) {
    for (let i = 0; i < allomasok.length; i++) {
        if (allomasok[i].id === id) {
            return allomasok[i].nev;
        }
    }
    return null;
}

function getIdByMegnevezes(megnevezes) {
    for (let i = 0; i < jarmuvek.length; i++) {
        if (jarmuvek[i].megnevezes === megnevezes) {
            return jarmuvek[i].id;
        }
    }
    return null;
}

function convertTimeToMinutesFromMidnight(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    const minutesFromMidnight = hours * 60 + minutes;
    return minutesFromMidnight;
}

function getVonalNevById(id) {
    for (let i = 0; i < vonalak.length; i++) {
        if (vonalak[i].id === id) {
            return vonalak[i].vonalSzam;
        }
    }
    return null; // Ha nem található a megadott id-jú vonal, null-t ad vissza
}

function displayDataInTable(data) {
    var table = document.querySelector("#jarat table"); // Kiválasztjuk a táblázatot

    // Ellenőrizzük, hogy van-e táblázat, és hogy van-e adat
    if (!table || !data || data.length === 0) {
        console.log("No table or data available.");
        return;
    }

    // Adatok beillesztése a táblázatba
    var tableBody = table.querySelector("tbody");
    data.forEach(function (entry) {
        var row = document.createElement("tr");
        displayDataInTableRow(entry, row);
        tableBody.appendChild(row); // Sor hozzáadása a táblázathoz
    });
}

function displayDataInTableRow(entry, row) {
    // Vonal számának megjelenítése az első oszlopban
    var vonalSzamCell = document.createElement("td");
    vonalSzamCell.textContent = getVonalNevById(entry.vonal);
    row.appendChild(vonalSzamCell);

    // KezdoMegallo
    var kezdoMegalloCell = document.createElement("td");
    var kezdoMegalloId = entry.megallok[0];
    var kezdoMegalloNev = getNameById(kezdoMegalloId); // Megkapjuk az állomás nevét
    kezdoMegalloCell.textContent = kezdoMegalloNev; // Beállítjuk a cella tartalmát a nevre
    row.appendChild(kezdoMegalloCell); // Adjuk hozzá a cellát a táblázathoz

    // VegsoMegallo
    var vegsoMegalloCell = document.createElement("td");
    var vegsoMegalloId = entry.megallok[entry.megallok.length - 1]; // Utolsó megálló
    var vegsoMegalloNev = getNameById(vegsoMegalloId);
    vegsoMegalloCell.textContent = vegsoMegalloNev; // Beállítjuk a cella tartalmát a nevre
    row.appendChild(vegsoMegalloCell);

    // Nap
    var napCell = document.createElement("td");
    var mikor = entry.nap + " " + percekToOraPerc(entry.indulasiIdo);
    napCell.textContent = mikor;
    row.appendChild(napCell);
}

function percekToOraPerc(percek) {
    var ora = Math.floor(percek / 60);
    var perc = percek % 60;
    // Hozzáadunk egy nullát, ha az óra vagy a perc egyjegyű
    ora = ora < 10 ? "0" + ora : ora;
    perc = perc < 10 ? "0" + perc : perc;
    return ora + ":" + perc;
}

getAllAllomas();
getJarmuvek();
getVonalak();
