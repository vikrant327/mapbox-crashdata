import React, {
  useRef,
  useEffect,
  useState,
  useContext
} from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import FetchData from './../FetchData';
import moment from 'moment';
import MultiselectCheckbox from './MultiselectCheckbox';
import { Line, defaults } from 'react-chartjs-2';
import FormatChartData from './formatChartData';

defaults.global.maintainAspectRatio = false


// Token From Mabox site. No Personal Token Embedded
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

  const [filterDays, setFilterDays] = useState(moment.weekdays());

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


  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-93.452062, 45.090494],
      zoom: 11
    });

    map.on("load", (...args) => {
      setMap(map)
    })

    FetchData.fetchData().then((response) => {

      setData(response.data); // Set Data Source State
      
      // Initialze Chjar with Initial; Data
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
      });

    });

    // Add navigation control 
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => map.remove();
  }, []);

  return ( 
    <div className='main' >
          <div className="header">
          <MultiselectCheckbox options={daysOfWeek} onChange={handleCheckboxListChange} /> 
          </div>
          
           <div className = 'map-container' ref = {mapRef} ></div>
           <div className="footer">
              <Line data={filterData} />
           </div>

    </div>
  );
};

export default Map;
