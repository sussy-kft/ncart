$(() => {
    get("jarmutipusok");
    get("jarmutipusok/1");
    get("allomasok");
    get("allomasok/1");
    get("vonalak");
    get("vonalak/1");
    get("inditasok");
    get("inditasok/1/1/420");
    get("megallok");
    get("megallok/1/2");
});

function get(url)
{
    axios
        .get("https://localhost:7078/" + url)
        .then(response => {
            console.log(response.data);
        })
        .catch(console.error)
    ;
}