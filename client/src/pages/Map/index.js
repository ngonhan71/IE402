import { useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from 'esri-loader';
import BenTre from "../../data/BenTre.json"
import NavBar from "../../components/NavBar"
import locationApi from "../../api/locationApi"

setDefaultOptions({ css: true });


export default function MyMap() {
    const [locationData, setLocationData] = useState({});

    const viewDiv = useRef()

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await locationApi.getAllToRenderMap({});
            setLocationData(res.data)
            console.log(res)
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, []);

    useEffect(() => {
        let view
        loadModules([   "esri/config",
        "esri/Map",
        "esri/views/MapView",

        "esri/Graphic",
        "esri/layers/GraphicsLayer",]).then(([esriConfig, Map, MapView, Graphic, GraphicsLayer]) => {

            const map = new Map({
                basemap: "topo-vector", // Basemap layer service
            });

            view = new MapView({
                map: map,
                center: [106.45691090375918, 10.211763464155379], // Longitude, latitude
                zoom: 10, // Zoom level
                container: viewDiv.current, // Div element
            });
    
            const graphicsLayer = new GraphicsLayer();
            map.add(graphicsLayer);


            const province = (data) => {
                return new Graphic({
                    geometry: { type: "polygon", rings: data.rings },
                    symbol: { type: "simple-fill", color: data.color },
                    attributes: data,
                    popupTemplate: {
                    title: "{title}",
                    content:
                        "<a> <b>Dân số:</b> {population} người <br> <b>Diện tích:</b> {area} km² <br><img src={image}> </img> <b>Thông tin tổng quát:</b> <br> {description} </a>",
                    },
                });
            };

            const point = ({longitude, latitude, url, name}) => {
                return new Graphic({
                  symbol: {
                    type: "picture-marker",
                    url: url,
                    width: '48px', 
                    height: '48px'
                  },
                  geometry: { type: 'point', longitude, latitude },
                  attributes: { longitude, latitude, name },
                  popupTemplate: {
                    title: "{name}, {longitude}, {latitude}",
                  }
                });
              };      
            if (locationData && locationData.length >0) {
              locationData.forEach(item => graphicsLayer.add(point(item)))      
            }
            graphicsLayer.add(province(BenTre));

        }).catch((err) => console.error(err));
        return () => {
            if (!!view) {
                view.destroy()
                view = null
            }
        }
    }, [locationData]);
  
    return (
       <div>
        <header>
            <NavBar />
        </header>
         <div ref={viewDiv} style={{height: "100vh", width: "100vw"}}></div>
       </div>
    )
}