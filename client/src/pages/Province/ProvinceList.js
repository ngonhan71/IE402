import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Modal, Button } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import provinceApi from "../../api/provinceApi"

export default function ProvinceList() {

  const [provinceData, setProvinceData] = useState({});
  const [loading, setLoading] = useState(false)

  const [rerender, setRerender] = useState(false)

  const [selectedProvince, setSelectedProvince] = useState({})
  const [addProvince, setAddProvince] = useState({
    name: "",
    url: "",
    description: "",
  })

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await provinceApi.getAll({});
        setLoading(false)
        console.log(res)
        setProvinceData(res.data);
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetchData();
  }, [rerender]);

  const handleSubmitUpdate = async () => {
    try {
      const { error } = await provinceApi.update(selectedProvince.idProvince, selectedProvince)
      if (error) {
        alert("Thất bại")
        return
      }
      alert("Thành công")
      setShowUpdateModal(false)
      setRerender(!rerender)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitAdd = async () => {
    try {
      const res = await provinceApi.create(addProvince)
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
          <Modal.Title>Cập nhật tỉnh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin tỉnh</h5>
                <Col xl={4}>
                    <label>Mã tỉnh</label>
                    <input type="text" readOnly name="id" value={selectedProvince?.idProvince} className="form-control" />
                </Col>
                <Col xl={4}>
                    <label>Tên tỉnh</label>
                    <input type="text" value={selectedProvince?.name} className="form-control" 
                      onChange={(e) => setSelectedProvince(prev => { return {...prev, name: e.target.value}})} 
                    />
                </Col>
                <Col xl={12}>
                    <label>Mô tả</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={selectedProvince?.description}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setSelectedProvince(prev => { return {...prev, description: data}})
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                </Col>
                <Col xl={12}>
                    <label>Đường dẫn ảnh</label>
                    <input type="text" value={selectedProvince?.url} className="form-control"
                    onChange={(e) => setSelectedProvince(prev => { return {...prev, url: e.target.value}})} />
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
          <Modal.Title>Thêm tỉnh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
                <h5>Thông tin tỉnh</h5>
                <Col xl={4}>
                    <label>Tên tỉnh</label>
                    <input type="text" value={addProvince?.name} className="form-control" 
                      onChange={(e) => setAddProvince(prev => { return {...prev, name: e.target.value}})} 
                    />
                </Col>
                <Col xl={12}>
                    <label>Mô tả</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={addProvince?.description}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setAddProvince(prev => { return {...prev, description: data}})
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                </Col>
                <Col xl={12}>
                    <label>Đường dẫn ảnh</label>
                    <input type="text" value={addProvince?.url} className="form-control" 
                    onChange={(e) => setAddProvince(prev => { return {...prev, url: e.target.value}})} />
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
          <Card.Header className="title">Danh sách tỉnh</Card.Header>
          <Card.Body>
            <Row>
              <Col xl={3}>
                <div className="d-flex mb-2">
                  <input
                    className="form-control search"
                    placeholder="Nhập tên, mã tỉnh"
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
                    Thêm tỉnh
                  </button>
                </div>
              </Col>
            </Row>
            <Table striped bordered hover style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th>Mã tỉnh</th>
                  <th>Tên tỉnh</th>
                  <th>Hình</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td>Loading...</td></tr>}
                {provinceData && provinceData.length > 0
                  ? provinceData.map((item, index) => {
                      return (
                        <tr key={item.idProvince}>
                          <td> {item.idProvince}</td>
                          <td> {item.name}</td>
                          <td><img className="province-image" src={item.url} alt="" /></td>
                          <td>
                            <Button variant="warning" onClick={() => {
                              setSelectedProvince(item)
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
