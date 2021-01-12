import axios from 'axios';

export default {

    fetchData: () => {
        return new Promise( (resolve,reject) => {

            axios('https://raw.githubusercontent.com/vikrant327/MapData/main/maplegrove_crash_data.geojson').then((response) => {
                resolve(response);
            }).catch((e) => {
                reject(e);
            });
        });
    }
}