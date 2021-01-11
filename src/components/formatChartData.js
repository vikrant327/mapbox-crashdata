import moment from 'moment';


const formatChartData = (chartData) => {

    if("features" in chartData){
      console.log(chartData)
        var freqMap = {};        
        chartData.features.forEach(function(item) {
            const t = moment(item.properties.time,'HHmm');
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
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: dataValues
          }
        ]
      }

       //chartConfig.datasets[0].data = dataValues;
       //chartConfig.labels =  labelValues;
       return updatedData;
    }


}

export default formatChartData;