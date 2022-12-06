import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import locationApi from "../../api/locationApi";
import provinceApi from "../../api/provinceApi";

export default function AddTour() {
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({});
  const [symbolData, setSymbolData] = useState({});

  const [selectedLocation, setSelectedLocation] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data } = await locationApi.getAll({});
        const opts = data.map((item) => {
          return {
            value: item.idLocation,
            label: item.name,
            idPoint: item.idPoint,
          };
        });
        setLocationData(opts);
        // setIdProvince(res.data[0]?.idProvince);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  // Form <select multiple>POINT</select>
  // Click => insert Arc -> idArc, List<Point> insert Table Arc_POINT ->
  //Select array Location -> List<Point>, insert Arc -> idArc -> insertTour
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
                <Col xl={12}>
                  <label>Địa điểm</label>
                  <Select
                    isMulti={true}
                    onChange={(location) => console.log(location)}
                    options={locationData}
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
