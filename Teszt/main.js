$(() => {
    axios
        .get("https://localhost:7078/jarmutipusok")
        .then(response => {
            console.log(response.data);
        })
        .catch(console.error)
    ;
});