import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import Select from "react-select";

import tourApi from "../../api/tourApi";

import format from "../../helper/format"
import locationApi from "../../api/locationApi";

export default function TourList() {

  const [locationData, setLocationData] = useState({})
  const [tourData, setTourData] = useState({})
  const [ctTour, setCtTour] = useState([])
  const [loading, setLoading] = useState(false)

  const [updateTour, setUpdateTour] = useState({})

  const [showModal, setShowModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const [rerender, setRerender] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await tourApi.getAll({});
        setLoading(false)
        setTourData(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [rerender])

  const getDetail = async (idTour) => {
    try {
      if (ctTour?.idTour === idTour) {
        setShowModal(true)
        return
      }
      const { data } = await tourApi.getById(idTour)
      setCtTour(data)
      setShowModal(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClickUpdate = async (tour) => {
    try {
      const { name, idTour, idArc } = tour
      console.log(tour)
      const { data } = await tourApi.getById(idTour)
      const locationList = data.map(item => {
        return {
          value: item.idLocation,
          label: item.name,
          idPoint: item.idPoint,
          number: item.number,
          time: item.time,
          price: item.price,
          idProvince: item.idProvince
        }
      })
      setUpdateTour({idTour, idArc, name, locationList: locationList.sort((a, b) => a.number > b.number ? 1 : -1)})
      setShowUpdateModal(true)
    } catch (error) {
      console.log(error)
    }
  }

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
            price: item.price,
            idProvince: item.idProvince
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

  const handleUpdate = async () => {
    const { idTour, idArc, name, locationList } = updateTour
    const provinceList = locationList.map(item => item.idProvince)
    const set = new Set(provinceList)
    try {
      const { error } = await tourApi.update(idTour, {name, idArc, locationList, provinceList: Array.from(set) })
      if (error) {
        alert(error)
        return
      }
      alert("Thành công!")
      setRerender(!rerender)
      setShowUpdateModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin tour</h5>
                <Col xl={12}>
                  <label>Tên Tour</label>
                  <input required type="text" className="form-control" value={updateTour?.name}
                  onChange={(e) => setUpdateTour(prev => { return {...prev, name: e.target.value}})} 
                  />
                </Col>
                {/* <Col xl={6}>
                  <label>Danh sách các tỉnh/thành đi qua</label>
                  <Select
                    isMulti={true}
                    onChange={(province) => setSelectedProvince(province)}
                    options={provinceData}
                  />
                </Col> */}
                <Col xl={12}>
                  <label>Danh sách các Địa điểm đi qua</label>
                  <Select
                    isMulti={true}
                    value={updateTour?.locationList}
                    onChange={(location) => setUpdateTour(prev => { return {...prev, locationList: location}})}
                    options={locationData}
                  />
                </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleUpdate}>Cập nhật</Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin tour</h5>
                <Table striped bordered hover>
                  <thead>
                      <tr>
                          <th>#</th>
                          <th>Tên địa điểm</th>
                          <th>Địa chỉ</th>
                          <th>Thời gian (ngày)</th>
                          <th>Chi phí</th>
                      </tr>
                  </thead>
                  <tbody style={{textAlign: "center"}}>
                  { ctTour && ctTour.length > 0 ? (
                    ctTour.map((item, index) => {
                      return (
                          <tr key={item.idLocation}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.address}</td>
                            <td>{item.time}</td>
                            <td style={{textAlign: "right"}}>{format.formatPrice(item.price)}</td>
                          </tr>
                        )
                      })
                    ) : ( <tr><td>Không có</td></tr>
                  )}
                  </tbody>
                </Table>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          {/* <Button variant="success" onClick={handleSubmitUpdateToaDo}>Cập nhật</Button> */}
        </Modal.Footer>
      </Modal>
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
                  <th>Thời gian (ngày)</th>
                  <th>Chi phí</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {tourData && tourData.length > 0
                  ? tourData.map((item, index) => {
                      return (
                        <tr key={item.idTour}>
                          <td> {item.idTour}</td>
                          <td>{item.name}</td>
                          <td>{item.time}</td>
                          <td style={{textAlign: "right"}}>{format.formatPrice(item.totalPrice)}</td>
                          <td>
                            <Button variant="primary" onClick={() => getDetail(item?.idTour)}>Chi tiết</Button>
                          </td>
                          <td>
                            <Button variant="warning" onClick={() => handleClickUpdate(item)}>Sửa</Button>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
