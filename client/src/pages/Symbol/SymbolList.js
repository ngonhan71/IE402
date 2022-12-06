import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";

import symbolApi from "../../api/symbolApi"

export default function SymbolList() {

  const [symbolData, setSymbolData] = useState({});
  const [loading, setLoading] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [selectedSymbol, setSelectedSymbol] = useState({})
  const [addSymbol, setAddSymbol] = useState({
    name: "",
    url: "",
  })

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await symbolApi.getAll({});
        setLoading(false)
        console.log(res)
        setSymbolData(res.data);
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitUpdate = async () => {
    try {
      const res = await symbolApi.update(selectedSymbol.idSymbol, selectedSymbol)
      setShowUpdateModal(false)
      setRerender(!rerender)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitAdd = async () => {
    try {
      const res = await symbolApi.create(addSymbol)
      setShowAddModal(false)
      setRerender(!rerender)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row>
      <Modal size="lg" show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật ký hiệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin ký hiệu</h5>
                <Col xl={4}>
                    <label>Mã ký hiệu</label>
                    <input type="text" readOnly name="id" value={selectedSymbol?.idSymbol} className="form-control" />
                </Col>
                <Col xl={4}>
                    <label>Tên ký hiệu</label>
                    <input type="text" value={selectedSymbol?.name} className="form-control" 
                      onChange={(e) => setSelectedSymbol(prev => { return {...prev, name: e.target.value}})} 
                    />
                </Col>
                <Col xl={12}>
                    <label>Đường dẫn ảnh</label>
                    <input type="text" value={selectedSymbol?.url} className="form-control"
                    onChange={(e) => setSelectedSymbol(prev => { return {...prev, url: e.target.value}})} />
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
      <Modal size="lg" show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm ký hiệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin ký hiệu</h5>
                <Col xl={4}>
                    <label>Tên ký hiệu</label>
                    <input type="text" value={addSymbol?.name} className="form-control" 
                      onChange={(e) => setAddSymbol(prev => { return {...prev, name: e.target.value}})} 
                    />
                </Col>
                <Col xl={12}>
                    <label>Đường dẫn ảnh</label>
                    <input type="text" value={addSymbol?.url} className="form-control" 
                    onChange={(e) => setAddSymbol(prev => { return {...prev, url: e.target.value}})} />
                </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleSubmitAdd}>Lưu</Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className="title">Danh sách ký hiệu</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã ký hiệu"
                  />
                  <button type="button" className="btn btn-primary">
                    Tìm kiếm
                  </button>
                </div>
              </Col>
              <Col xl={3} className="ms-auto">
                <div className="d-flex mb-2">
                  <button type="button" className="btn btn-success ms-auto"
                    onClick={() => setShowAddModal(true)}>
                    Thêm ký hiệu
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã ký hiệu</th>
                  <th>Tên ký hiệu</th>
                  <th>Hình</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {symbolData && symbolData.length > 0
                  ? symbolData.map((item, index) => {
                      return (
                        <tr key={item.idSymbol}>
                          <td> {item.idSymbol}</td>
                          <td> {item.name}</td>
                          <td><img className="symbol-image" src={item.url} alt="" /></td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedSymbol(item)
                              setShowUpdateModal(true)
                            }}>Sửa</Button>
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
