export default class DataService {
    alldata(endpoints, callback, fail) {
        axios
            .all(endpoints.map((endpoint) => axios.get(endpoint)))
            .then(
                axios.spread((...allData) => {
                    callback({data: allData[0].data, input: allData[1].data});
                })
            )
            .catch(function (error) {
                fail(error);
            })
            .finally(function () {});
    }
    getData(endpoint, callback, fail) {
        let args = arguments;
        axios
            .get(endpoint)
            .then(function (response) {
                callback(response.data, args);
            })
            .catch(function (error) {
                fail(error);
            })
            .finally(function () {});
    }
    postdata(url, callback, fail, data) {
        console.log(data);
        axios
            .post(url, data)
            .then((response) => {
                this.getData(url, callback, fail);
                console.log("Response", response);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }
    deleteData(url, callback, fail, data) {
        axios
            .delete(url + "/" + data)
            .then((response) => {
                this.getData(url, callback, fail);
                console.log("Response", response);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }

    putData(url, callback, fail, data) {
        axios
            .put(url + "/" + data.id + "/", data)
            .then((response) => {
                this.getData(url, callback, fail);
                console.log("Response", response);
            })
            .catch((error) => {
                console.log(data);
                console.log("Error:", error);
            });
    }
}
