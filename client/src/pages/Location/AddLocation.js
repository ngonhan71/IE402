import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useNavigate } from "react-router-dom";

import locationApi from "../../api/locationApi"
import provinceApi from "../../api/provinceApi"
import symbolApi from "../../api/symbolApi"

export default function AddLocation() {

  const navigate = useNavigate()

  const [provinceData, setProvinceData] = useState({});
  const [symbolData, setSymbolData] = useState({});

  const [name, setName] = useState("")
  const [longitude, setLongitude] = useState("")
  const [latitude, setLatitude] = useState("")
  const [address, setAddress] = useState("")
  const [time, setTime] = useState(1)
  const [price, setPrice] = useState(0)
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [idProvince, setIdProvince] = useState("")
  const [idSymbol, setIdSymbol] = useState("")

 
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = await provinceApi.getAll({});
        console.log(res)
        setProvinceData(res.data);
        setIdProvince(res.data[0]?.idProvince)
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSymbol = async () => {
      try {
        const res = await symbolApi.getAll({});
        console.log(res)
        setSymbolData(res.data);
        setIdSymbol(res.data[0]?.idSymbol)
      } catch (error) {
        console.log(error);
      }
    };
    fetchSymbol()
    fetchProvince();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log({
        name, address, time, price, url, description, idProvince, idSymbol, longitude, latitude
    })
    try {
        const { error } = await locationApi.create({
          name, address, time, price, url, description, idProvince, idSymbol, longitude, latitude
        })
        if (!error) {
          alert("Th??m th??nh c??ng!")
          navigate({ pathname: "/location" });
        }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Th??m ?????a ??i???m</Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xl={6}>
                  <label>T??n ?????a ??i???m</label>
                  <input required type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Longitude</label>
                  <input required type="number" className="form-control" value={longitude} onChange={(e) => setLongitude(+e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Latitude</label>
                  <input required type="number" className="form-control" value={latitude} onChange={(e) => setLatitude(+e.target.value)} />
                </Col>
                <Col xl={3}>
                    <label>Lo???i</label>
                    <select className="form-select"
                      value={idSymbol}
                      onChange={(e) => setIdSymbol(+e.target.value)}
                    >
                      {symbolData.length > 0 &&
                        symbolData.map(item => (
                          <option key={item.idSymbol} value={item.idSymbol}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                </Col>
                <Col xl={3}>
                    <label>T???nh/Th??nh</label>
                    <select className="form-select"
                      value={idProvince}
                      onChange={(e) => setIdProvince(+e.target.value)}
                    >
                      {provinceData.length > 0 &&
                        provinceData.map(item => (
                          <option key={item.idProvince} value={item.idProvince}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                </Col>
                <Col xl={6}>
                  <label>?????a ch???</label>
                  <input required type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Th???i gian (ng??y)</label>
                  <input required type="number" min={0} className="form-control" value={time} onChange={(e) => setTime(+e.target.value)} />
                </Col>
                <Col xl={3}>
                  <label>Chi ph??</label>
                  <input required type="number" min="0" className="form-control" value={price} onChange={(e) => setPrice(+e.target.value)} />
                </Col>
                <Col xl={12}>
                  <label>???????ng d???n</label>
                  <input type="text" className="form-control" value={url} onChange={(e) => setUrl(e.target.value)} />
                </Col>
              </Row>
              <Row>
                <Col xl={12}>
                    <label>N???i dung</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={description}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setDescription(data)
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                  </Col>
              </Row>
              <Button type="submit" className="mt-3">
                Th??m
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
