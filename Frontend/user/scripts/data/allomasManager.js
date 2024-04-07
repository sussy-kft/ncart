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
            // Kijelöljük a datalist elemet
            var allomasok = serverResponse.data;
            var datalist = document.getElementById("megalloNevek");

            // Új opciókat hozzáadunk
            allomasok.forEach(function (allomas) {
                var option = document.createElement("option");
                option.value = allomas.nev; // Az 'nev' property alapján töltjük be az opciót
                datalist.appendChild(option);
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}
getAllAllomas();
