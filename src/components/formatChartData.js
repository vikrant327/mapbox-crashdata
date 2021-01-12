import moment from 'moment';

/** 
 * Method to formate GeoJSON features 
 * Group by time property and convert to Chart.js data parameter
 * 
 * @params {GeoJSON}
 * 
 */
const formatChartData = (chartData) => {

    if("features" in chartData){
      
        var freqMap = {};        
        chartData.features.forEach(function(item) {
            const key = moment(item.properties.time,'HHmm').endOf('hour').format('h A');
            if(freqMap.hasOwnProperty(key)){
            freqMap[key] = freqMap[key] + 1;
            }else{
            freqMap[key] =  1;
            }
        });

         const mapArray = Object.keys(freqMap).map(function (key) { 
           return [key, freqMap[key]]; 
        }); 
        const sortedTimeMap = mapArray.slice().sort((a, b) => moment(a, 'h A').toDate() - moment(b, 'h A').toDate())
        
        
       const dataValues = sortedTimeMap.map((e) => {
          return e[1];
       });

       const labelValues = sortedTimeMap.map((e) => {
        return e[0];
       });

       const updatedData = {
        labels: labelValues,
        datasets: [
          {
            label: 'Crash Frequency By Time of Day',
            data: dataValues
          }
        ]
      }
       return updatedData;
    }


}

export default formatChartData;