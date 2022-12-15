import { useEffect, useRef, useState } from "react";
import { loadModules, setDefaultOptions } from 'esri-loader';

import NavBar from "../../components/NavBar"
import locationApi from "../../api/locationApi"
import tourApi from "../../api/tourApi"
import format from "../../helper/format";
import symbolApi from "../../api/symbolApi";
import { Table } from "react-bootstrap";


import BenTre from "../../data/BenTre.json"
import TienGiang from "../../data/TienGiang.json"
import LongAn from "../../data/LongAn.json"
import BacLieu from "../../data/BacLieu.json"
import AnGiang from "../../data/AnGiang.json"
import CanTho from "../../data/CanTho.json"
import CaMau from "../../data/CaMau.json"
import DongThap from "../../data/DongThap.json"
import HauGiang from "../../data/HauGiang.json"
import SocTrang from "../../data/SocTrang.json"
import TraVinh from "../../data/TraVinh.json"
import VinhLong from "../../data/VinhLong.json"
import KienGiang from "../../data/KienGiang.json"
import KienGiang_islands from "../../data/KienGiang_islands.json"

setDefaultOptions({ css: true });


export default function MyMap() {
    const [locationData, setLocationData] = useState({});
    const [locationSelect, setLocationSelect] = useState([])
    const [tourList, setTourList] = useState([]);
    const [symbolList, setSymbolList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(0);

    const [filterResult, setFilterResult] = useState([])

    const [selectedTour, setSelectedTour] = useState({})

    const viewDiv = useRef()

    useEffect(() => {
        const fetchLocation = async () => {
          try {
            const { data } = await locationApi.getAllToRenderMap({});
            const select =  data.map(item => {
              return { idLocation: item.idLocation, name: item.name }
            })
            const none = { idLocation: 0, name: "Chọn địa điểm" }
            setLocationSelect([none, ...select])
            setLocationData(data)
          } catch (error) {
            console.log(error);
          }
        };
        const fetchTour = async () => {
          try {
            const { data } = await tourApi.getAllToRenderMap({});
            setTourList(data)
            // setFilterResult(data)
          } catch (error) {
            console.log(error);
          }
        };
        const fetchSymbol = async () => {
          try {
            const { data } = await symbolApi.getAll({});
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

            const islands = (data, island) => {
              return new Graphic({
                geometry: { type: "polygon", rings: island },
                symbol: { type: "simple-fill", color: data.color },
                attributes: data,
                popupTemplate: {
                  title: "{title}",
                  content:
                    "<a>Dân số: {population} người <br> Diện tích: {area}</a> km²",
                },
              });
            };

            const point = ({longitude, latitude, url, name, address, image}) => {
                return new Graphic({
                  symbol: {
                    type: "picture-marker",
                    url: url,
                    width: '48px', 
                    height: '48px'
                  },
                  geometry: { type: 'point', longitude, latitude },
                  attributes: { longitude, latitude, name, address, image },
                  popupTemplate: {
                    title: "Địa điểm: {name}",
                      content: "Địa chỉ: {address} <br><img src={image}> </img> "
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
                      {content}
                    `,
                  }
              });
            };
            
            for (let i = 0; i < KienGiang_islands.length; i++) {
              graphicsLayer.add(islands(KienGiang, KienGiang_islands[i]));
            }
            graphicsLayer.add(province(BenTre));
            graphicsLayer.add(province(TienGiang));
            graphicsLayer.add(province(LongAn));
            graphicsLayer.add(province(AnGiang));
            graphicsLayer.add(province(BacLieu));
            graphicsLayer.add(province(CanTho));
            graphicsLayer.add(province(CaMau));
            graphicsLayer.add(province(DongThap));
            graphicsLayer.add(province(SocTrang));
            graphicsLayer.add(province(TraVinh));
            graphicsLayer.add(province(VinhLong));
            graphicsLayer.add(province(HauGiang));
            graphicsLayer.add(province(KienGiang));

            if (locationData && locationData.length > 0) {
              locationData.forEach(item => graphicsLayer.add(point(item)))      
            }
            if (selectedTour && selectedTour.idTour) {
              const pathsConvert = []
              let content = `<table class="table table-striped table-bordered table-hover">
                                <tr>
                                  <th>Địa điểm</th>
                                  <th>Thời gian(ngày)</th>
                                  <th>Chi phí</th>
                                </tr>`
              selectedTour.paths.forEach(item => {
                content += `  <tr>
                                <td>${item.name}</td>
                                <td class="time">${item.time}</td>
                                <td class="price">${format.formatPrice(item.price)}</td>
                              </tr>`
                pathsConvert.push([item.longitude, item.latitude])
              })
              content += `</table>`
              graphicsLayer.add(drawTour({...selectedTour, totalPrice: format.formatPrice(selectedTour.totalPrice), paths: pathsConvert, content: content}))
            }

        }).catch((err) => console.error(err));
        return () => {
            if (!!view) {
                view.destroy()
                view = null
            }
        }
    }, [locationData, selectedTour]);
  
    useEffect(() => {
      const result = []
      if (selectedLocation === 0) {
        setSelectedTour({})
        setFilterResult([])
        return
      }
      tourList.forEach(tour => {
        const { paths } = tour
        const index = paths.findIndex(location => location.idLocation === selectedLocation)
        if (index !== -1) {
          result.push(tour)
        }
      })
      if (result.length === 0) {
        setFilterResult([])
        return
      }
      setFilterResult(result)
    }, [selectedLocation, tourList])

    return (
       <div style={{position: "relative"}}>
        <header>
            <NavBar />
        </header>
        {selectedTour && selectedTour.name && filterResult && filterResult.length > 0 && (
          <div className="title-selected-tour">
            <p>{selectedTour?.name}</p>
          </div>
        )}
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
            {locationSelect && locationSelect.length > 0 &&
              locationSelect.map(item => (
                <option key={item.idLocation} value={item.idLocation}>
                  {item.name}
                </option>
              ))}
          </select>
          {selectedLocation !== 0 && (
          <div className="container-result">
            <p className="title">Kết quả:</p>
            {filterResult && filterResult.length > 0 ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                      <th>#</th>
                      <th>Tour</th>
                      <th>Thời gian (ngày)</th>
                      <th>Chi phí</th>
                  </tr>
                </thead>
                <tbody style={{textAlign: "center"}}>
                {filterResult.map((item, index) => {
                  return (
                      <tr key={item.idTour} onClick={() => setSelectedTour(item)}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.time}</td>
                        <td style={{textAlign: "right"}}>{format.formatPrice(item.totalPrice)}</td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            ): <p>Không tìm thấy tour phù hợp!!</p>}
        </div>
        )}
          {/* <div className="d-flex justify-content-between">
            <Button variant="danger" className="mt-4" onClick={handleFilter} disabled={selectedLocation === 0}>Tìm kiếm</Button>
            {isFiltering && <Button variant="secondary" className="mt-4" onClick={() => {
              setIsFiltering(false)
              setFilterResult(tourList)
            }}>Hủy</Button>}
          </div> */}
        </div>
        
         <div ref={viewDiv} style={{height: "100vh", width: "100vw"}}></div>
       </div>
    )
}