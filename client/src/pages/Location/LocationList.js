import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Pagination from "../../components/Pagination";

import locationApi from "../../api/locationApi"
import provinceApi from "../../api/provinceApi"
import symbolApi from "../../api/symbolApi"
import pointApi from "../../api/pointApi"

export default function LocationList() {

  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)

  const [locationData, setLocationData] = useState({});
  const [provinceData, setProvinceData] = useState({});
  const [symbolData, setSymbolData] = useState({});
  const [loading, setLoading] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [selectedLocation, setSelectedLocation] = useState({})
  const [selectedToaDo, setSelectedToaDo] = useState({})
 

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUpdateToaDoModal, setShowUpdateToaDoModal] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, totalPage } = await locationApi.getAll({limit: 5, page});
        setLoading(false)
        setLocationData(data);
        setTotalPage(totalPage)
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender, page]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = await provinceApi.getAll({});
        console.log(res)
        setProvinceData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSymbol = async () => {
      try {
        const res = await symbolApi.getAll({});
        console.log(res)
        setSymbolData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSymbol()
    fetchProvince();
  }, []);

  const handleSubmitUpdate = async () => {
    try {
        const res = await locationApi.update(selectedLocation.idLocation, selectedLocation)
        console.log(res)
        setShowUpdateModal(false)
        setRerender(!rerender)
    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmitUpdateToaDo = async () => {
    try {
      console.log(selectedToaDo)
      const res = await pointApi.update(selectedToaDo.idPoint, selectedToaDo)
      console.log(res)
      setShowUpdateToaDoModal(false)
      setRerender(!rerender)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showUpdateToaDoModal} onHide={() => setShowUpdateToaDoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật tọa độ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin tọa độ</h5>
                <Col xl={3}>
                  <label>Longitude</label>
                  <input required type="number" className="form-control" value={selectedToaDo?.longitude} 
                     onChange={(e) => setSelectedToaDo(prev => { return {...prev, longitude: +e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Latitude</label>
                  <input required type="number" className="form-control" value={selectedToaDo?.latitude} 
                    onChange={(e) => setSelectedToaDo(prev => { return {...prev, latitude: +e.target.value}})} />
                </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateToaDoModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitUpdateToaDo}>Cập nhật</Button>
          {/* <Button variant="danger" onClick={() => console.log(selectedToaDo)}>Tạo mới Tọa độ</Button> */}
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật địa điểm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin địa điểm</h5>
                <Col xl={6}>
                  <label>Tên địa điểm</label>
                  <input required type="text" className="form-control" value={selectedLocation?.name} 
                    onChange={(e) => setSelectedLocation(prev => { return {...prev, name: e.target.value}})} />
                </Col>
                <Col xl={3}>
                    <label>Loại</label>
                    <select className="form-select"
                      value={selectedLocation?.idSymbol}
                      onChange={(e) => setSelectedLocation(prev => { return {...prev, idSymbol: +e.target.value}})}
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
                    <label>Tỉnh/Thành</label>
                    <select className="form-select"
                      value={selectedLocation?.idProvince}
                      onChange={(e) => setSelectedLocation(prev => { return {...prev, idProvince: +e.target.value}})}
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
                  <label>Địa chỉ</label>
                  <input required type="text" className="form-control" value={selectedLocation?.address}
                  onChange={(e) => setSelectedLocation(prev => { return {...prev, address: e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Thời gian (ngày)</label>
                  <input required type="number" min={0} className="form-control" value={selectedLocation?.time} 
                  onChange={(e) => setSelectedLocation(prev => { return {...prev, time: e.target.value}})} />
                </Col>
                <Col xl={3}>
                  <label>Chi phí</label>
                  <input required type="number" min="0" className="form-control" value={selectedLocation?.price} 
                  onChange={(e) => setSelectedLocation(prev => { return {...prev, price: e.target.value}})} />
                </Col>
                <Col xl={12}>
                  <label>Đường dẫn</label>
                  <input type="text" className="form-control" value={selectedLocation?.url} 
                  onChange={(e) => setSelectedLocation(prev => { return {...prev, url: e.target.value}})} />
                </Col>
              </Row>
              <Row>
                <Col xl={12}>
                    <label>Nội dung</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={selectedLocation?.description}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setSelectedLocation(prev => { return {...prev, description: data}})
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitUpdate}>Lưu</Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách địa điểm</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã địa điểm"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                <button type="button" className="btn btn-success ms-auto">
                    <Link to={"/location/add"}>Thêm Địa điểm</Link>
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã địa điểm</th>
                  <th>Tên địa điểm</th>
                  <th>Tọa độ</th>
                  <th>Địa chỉ</th>
                  <th>Thời gian (ngày)</th>
                  <th>Chi phí</th>
                  <th>Hình</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {locationData && locationData.length > 0
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
                  : null}
              </tbody>
            </Table>
            <div className="pagination">
            <Row>
              <Col xl={12}>
                {totalPage && totalPage > 1 ? (
                  <Pagination
                    totalPage={totalPage}
                    currentPage={page}
                    onChangePage={(nPage) => setPage(nPage)}
                  />
                ) : null}
              </Col>
            </Row>
          </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
