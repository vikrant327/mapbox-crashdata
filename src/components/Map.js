import React, {
  useRef,
  useEffect,
  useState
} from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import FetchData from './../FetchData';
import moment from 'moment';
import MultiselectCheckbox from './MultiselectCheckbox';
import { Line, defaults } from 'react-chartjs-2';
import FormatChartData from './formatChartData';

defaults.global.maintainAspectRatio = false


/**
 * Token From Mabox site. No Personal Token Embedded
*/
mapboxgl.accessToken = 'pk.eyJ1IjoidmlrcmFudDMyNyIsImEiOiJjanIwcjFlMTAwczhqNDNxcXByc3VmajhzIn0.b3Fq-fSNOmwdWXr1E5lv4g'; //

// Days abbrevation map to match data day key values
const dayAbbr = {
  "Sunday": "SUN",
  "Monday": "MON",
  "Tuesday": "TUE",
  "Wednesday": "WED",
  "Thursday": "THU",
  "Friday": "FRI",
  "Saturday": "SAT"
}

// Initializa days of week from moment
const daysOfWeek = moment.weekdays().map((e, i) => {
  return {
    value: e,
    label: e,
    checked: true
  }
});



const Map = () => {

  const mapRef = useRef(null);

  const [map, setMap] = useState(null);

  const [mapData, setData] = useState({data: {}})

  const [filterData,setFilteredData] = useState({data: {}})

  /**   Function to Handle Update to Days  */
  const handleCheckboxListChange = filterData => {
    
    const filterAbbr = filterData.map((e) => {
      return dayAbbr[e.value]
    });

    const filterFeatures = mapData.features.filter((feature) => {
      return filterAbbr.indexOf(feature.properties.dywk) > -1
    });

    const filteredDataSource = {
      "type": "FeatureCollection",
      "features": filterFeatures
    }
    map.getSource('crash').setData(filteredDataSource);
 
    const chartData = FormatChartData(filteredDataSource);
    setFilteredData(chartData);

  }


  /** Initialize map when component mounts */
  useEffect(() => {
    
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-93.452062, 45.101594],
      zoom: 12
    });

    map.on("load", (...args) => {
       setMap(map)
    })

    FetchData.fetchData().then((response) => {

       
      setData(response.data); 
      
      const chartData = FormatChartData(response.data);
      setFilteredData(chartData);
      
      map.addSource('crash', {
        type: 'geojson',
        data: response.data
      });

      map.addLayer({
        id: 'crash-layer',
        source: 'crash',
        type: 'heatmap',
        paint: {
          'heatmap-radius': 10
        },
        'heatmap-intensity': {
          stops: [
            [11, 1],
            [15, 3]
          ]
        },
        "heatmap-color": {
          "stops": [
            [0.0, "blue"],
            [0.5, "yellow"],
            [1.0, "red"]
          ]
        }
      })

    }).catch(err => console.log(err));

    // Add navigation control 
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => map.remove();
  }, []);

  return ( 
    <div className='main' >
          <div className="header">
            <h1>Vehicle Crash Hotspots in City of Maple Grove, MN (2010-2017)</h1> 
            
          </div>
          
           <div className = 'map-container' ref = {mapRef} ></div>
           <div className="footer">
              <MultiselectCheckbox options={daysOfWeek} onChange={handleCheckboxListChange} /> 
              <Line data={filterData} />
           </div>

    </div>
  );
};

export default Map;
