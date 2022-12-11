import { useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from 'esri-loader';
import BenTre from "../../data/BenTre.json"
import NavBar from "../../components/NavBar"
import locationApi from "../../api/locationApi"
import tourApi from "../../api/tourApi"
import format from "../../helper/format";
import symbolApi from "../../api/symbolApi";
import { Button } from "react-bootstrap";

setDefaultOptions({ css: true });


export default function MyMap() {
    const [locationData, setLocationData] = useState({});
    const [tourList, setTourList] = useState([]);
    const [symbolList, setSymbolList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    const [isFiltering, setIsFiltering] = useState(false)
    const [filterResult, setFilterResult] = useState([])

    const viewDiv = useRef()

    useEffect(() => {
        const fetchLocation = async () => {
          try {
            const { data } = await locationApi.getAllToRenderMap({});
            setLocationData(data)
            setSelectedLocation(data[0].idLocation)
          } catch (error) {
            console.log(error);
          }
        };
        const fetchTour = async () => {
          try {
            const { data } = await tourApi.getAllToRenderMap({});
            setTourList(data)
            setFilterResult(data)
          } catch (error) {
            console.log(error);
          }
        };
        const fetchSymbol = async () => {
          try {
            const { data } = await symbolApi.getAll({});
            console.log(data)
            setSymbolList(data)
          } catch (error) {
            console.log(error);
          }
        };
        fetchSymbol()
        fetchTour()
        fetchLocation()
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

            const point = ({longitude, latitude, url, name, address}) => {
                return new Graphic({
                  symbol: {
                    type: "picture-marker",
                    url: url,
                    width: '48px', 
                    height: '48px'
                  },
                  geometry: { type: 'point', longitude, latitude },
                  attributes: { longitude, latitude, name, address },
                  popupTemplate: {
                    title: "Địa điểm: {name}",
                    content: "Địa chỉ: {address}"
                  }
                });
              }; 
              
            const drawTour = ({paths, name, time, totalPrice, content, color}) => {
              return new Graphic( {
                geometry: {type: "polyline", paths: [paths]},
                symbol: {type: "simple-line", color: color, width: 4},
                attributes: { name, time, totalPrice, content },
                  popupTemplate: {
                    title: "Tour {name}",
                    content: `
                      <div style="font-weight: bold; font-size: 18px">
                        Tổng ngày {time}, Tổng chi phí {totalPrice}
                      </div>
                      <div>
                      {content}
                      </div>
                    `
                  }
              });
            };
            if (locationData && locationData.length > 0) {
              locationData.forEach(item => graphicsLayer.add(point(item)))      
            }
            if (filterResult && filterResult.length > 0) {
              filterResult.forEach(item => {
                const pathsConvert = []
                let content = ``
                item.paths.forEach(item => {
                  content += `<div>${item.name} - ${item.time} ngày - Chi phí ${format.formatPrice(item.price)}</div>`
                  pathsConvert.push([item.longitude, item.latitude])
                })
                graphicsLayer.add(drawTour({...item, totalPrice: format.formatPrice(item.totalPrice), paths: pathsConvert, content: content}))
              })      
            }
            graphicsLayer.add(province(BenTre));

        }).catch((err) => console.error(err));
        return () => {
            if (!!view) {
                view.destroy()
                view = null
            }
        }
    }, [locationData, tourList, filterResult]);
  
    const handleFilter = () => {
      setIsFiltering(true)
      const result = []
      tourList.forEach(tour => {
        const { paths } = tour
        const index = paths.findIndex(location => location.idLocation === selectedLocation)
        if (index !== -1) {
          result.push(tour)
        }
      })
      if (result.length === 0) {
        alert("Không tìm thấy tour phù hợp")
        return
      }
      setFilterResult(result)
    }

    return (
       <div style={{position: "relative"}}>
        <header>
            <NavBar />
        </header>
        <div className="symbol-list">
          {symbolList && symbolList.length > 0 && symbolList.map(symbol => {
            return (
              <div key={symbol.idSymbol}>
                <img src={symbol.url} alt="" />
                <p>{symbol.name}</p>
              </div>
            )
          })}
        </div>
        <div className="container-filter">
          <p className="title">Chọn địa điểm</p>
          <select className="form-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(+e.target.value)}
          >
            {locationData.length > 0 &&
              locationData.map(item => (
                <option key={item.idLocation} value={item.idLocation}>
                  {item.name}
                </option>
              ))}
          </select>
          <div className="d-flex justify-content-between">
            <Button variant="danger" className="mt-4" onClick={handleFilter}>Tìm kiếm</Button>
            {isFiltering && <Button variant="secondary" className="mt-4" onClick={() => {
              setIsFiltering(false)
              setFilterResult(tourList)
            }}>Hủy</Button>}
          </div>
        </div>
         <div ref={viewDiv} style={{height: "100vh", width: "100vw"}}></div>
       </div>
    )
}