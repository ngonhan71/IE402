import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { SketchPicker } from 'react-color';
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import locationApi from "../../api/locationApi";
import provinceApi from "../../api/provinceApi";
import tourApi from "../../api/tourApi";

export default function AddTour() {
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({});
  const [provinceData, setProvinceData] = useState({});

  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#00000");
  // const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await locationApi.getAll({});
        console.log(data)
        const opts = data.map((item) => {
          return {
            value: item.idLocation,
            label: item.name,
            idPoint: item.idPoint,
            time: item.time,
            price: item.price
          };
        });
        setLocationData(opts);
        // setIdProvince(res.data[0]?.idProvince);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchProvince = async () => {
      try {
        const { data } = await provinceApi.getAll({});
        const opts = data.map((item) => {
          return {
            value: item.idProvince,
            label: item.name,
          }
        })
        setProvinceData(opts)
      } catch (error) {
        console.log(error);
      }
    };
    fetchProvince();
    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({name, selectedLocation, selectedProvince, color})
    try {
      const { error } = await tourApi.create({
        name, color,
        provinceList: selectedProvince, 
        locationList: selectedLocation
      })
      if (!error) {
        alert("Thêm thành công!")
        navigate({ pathname: "/tour" });
      }
      console.log(name)
    } catch (error) {
      console.log(error)
    }
  };
  
  useEffect(() => {
    const newName = selectedLocation.map(item => item.label).join(" - ")
    setName(newName)
  }, [selectedLocation])

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Thêm Tour</Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xl={6}>
                  <label>Tên Tour</label>
                  <input required type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)}
                  />
                </Col>
                <Col xl={6}>
                  <label>Danh sách các tỉnh/thành đi qua</label>
                  <Select
                    isMulti={true}
                    onChange={(province) => setSelectedProvince(province)}
                    options={provinceData}
                  />
                </Col>
                <Col xl={12}>
                  <label>Danh sách các Địa điểm đi qua theo thứ tự</label>
                  <Select
                    isMulti={true}
                    onChange={(location) => setSelectedLocation(location)}
                    options={locationData}
                  />
                </Col>
                <Col xl={4}>
                  <label>Màu hiển thị</label>
                  <SketchPicker
                    color={color}
                    onChangeComplete={(color) => setColor(color?.hex)}
                  />
                </Col>
              </Row>
              <Button type="submit" className="mt-3">
                Thêm
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
