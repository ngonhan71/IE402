// import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import locationApi from "../../api/locationApi"
// import provinceApi from "../../api/provinceApi"
// import symbolApi from "../../api/symbolApi"
// import pointApi from "../../api/pointApi"

export default function TourList() {

//   const [locationData, setLocationData] = useState({});
//   const [provinceData, setProvinceData] = useState({});
//   const [symbolData, setSymbolData] = useState({});
//   const [loading, setLoading] = useState(false)

//   const [rerender, setRerender] = useState(false)

//   const [selectedLocation, setSelectedLocation] = useState({})
//   const [selectedToaDo, setSelectedToaDo] = useState({})
 

//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showUpdateToaDoModal, setShowUpdateToaDoModal] = useState(false);
  
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách tour</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã tour"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                <button type="button" className="btn btn-success ms-auto">
                    <Link to={"/tour/add"}>Thêm tour</Link>
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã tour</th>
                  <th>Tên tour</th>
                  <th>Tọa độ</th>
                  <th>Địa chỉ</th>
                  <th>Thời gian (ngày)</th>
                  <th>Chi phí</th>
                  <th>Hình</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {/* {loading && <tr><td>Loading...</td></tr>} */}
                {/* {locationData && locationData.length > 0
                  ? locationData.map((item, index) => {
                      return (
                        <tr key={item.idLocation}>
                          <td> {item.idLocation}</td>
                          <td>{item.name}</td>
                          <td>[{item.longitude}, {item.latitude}]</td>
                          <td>{item.address}</td>
                          <td>{item.time}</td>
                          <td>{item.price}</td>
                          <td><img className="province-image" src={item.url} alt="" /></td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedLocation(item)
                              setShowUpdateModal(true)
                            }}>Sửa</Button>
                          </td>
                          <td>
                            <Button variant="primary" onClick={() => {
                              setSelectedToaDo({
                                longitude: item.longitude,
                                latitude: item.latitude,
                                idPoint: item.idPoint
                              })
                              setShowUpdateToaDoModal(true)
                            }}>Cập nhật tọa độ</Button>
                          </td>
                        </tr>
                      );
                    })
                  : null} */}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
