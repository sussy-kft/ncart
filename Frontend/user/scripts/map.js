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
                
                // Új: Megjelenítjük az ikont az állomás koordinátáinál
                displayIconAtCoordinates(allomas.nev, allomas.koord.x, allomas.koord.y);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function displayIconAtCoordinates(stationName, x, y) {
    // Létrehozunk egy új ikon elemet
    var icon = document.createElement("i");
    icon.className = "bi bi-geo-fill"; // Bootstrap ikon osztályának beállítása

    // Beállítjuk az ikon stílusát a megadott színre
    icon.style.color = "rgb(255, 231, 33)";

    // Állítsuk be az ikon pozícióját a térképen a megadott koordinátákkal
    icon.style.position = "absolute";
    icon.style.left = x + "px";
    icon.style.top = y + "px";

    // Adjuk hozzá az ikont a térkép elemhez
    var map = document.getElementById("map");
    map.appendChild(icon);

    // Opcionális: Adjunk hozzá egy eseménykezelőt az ikonhoz, ha szükséges
    icon.addEventListener("click", function() {
        // Valamilyen művelet végrehajtása az ikonra kattintva
        console.log("Icon clicked for station: " + stationName);
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
            if (response.data && response.data.length > 0) {
                var table = document.querySelector("#jarat table");
                if (table) {
                    // Táblázat létrehozása vagy megtisztítása
                    table.innerHTML = "";

                    // Címsor hozzáadása
                    var headerRow = document.createElement("tr");
                    var headerCells = ["vonal", "honnan", "hova", "mikor"];
                    headerCells.forEach(function (header) {
                        var cell = document.createElement("th");
                        cell.textContent = header;
                        headerRow.appendChild(cell);
                    });
                    table.appendChild(headerRow);

                    // Adatok hozzáadása
                    response.data.forEach(function (entry) {
                        var row = document.createElement("tr");
                        displayDataInTableRow(entry, row);
                        table.appendChild(row);
                    });
                }
            }
        })
        .catch(function (error) {
            var table = document.querySelector("#jarat table");
            if (table) {
                table.innerHTML =
                    "<tr class='error'><td colspan='4'>Nincs elérhető útvonal. Kérem próbáljon meg más útvonalat keresni!</td></tr>";
            }
            console.log(error);
        })
        .finally(function () {
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
