import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import tourApi from "../../api/tourApi";

import format from "../../helper/format"

export default function TourList() {

  const [tourData, setTourData] = useState({});
  const [ctTour, setCtTour] = useState([]);
  const [loading, setLoading] = useState(false)


  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data } = await tourApi.getAll({});
        setLoading(false)
        console.log(data)
        setTourData(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const getDetail = async (idTour) => {
    try {
      if (ctTour?.idTour === idTour) {
        setShowModal(true)
        return
      }
      const { data } = await tourApi.getById(idTour)
      console.log(data)
      setCtTour(data)
      setShowModal(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
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
