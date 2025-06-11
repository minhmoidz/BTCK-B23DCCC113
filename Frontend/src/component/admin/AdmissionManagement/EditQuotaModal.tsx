// src/pages/Admin/AdmissionManagement/components/EditQuotaModal.tsx

import React from 'react';
import { Modal, Form, InputNumber, Row, Col, Button } from 'antd';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  form: any;
}

const EditQuotaModal: React.FC<Props> = ({ visible, onCancel, onSave, form }) => (
  <Modal
    title="Chỉnh sửa chỉ tiêu"
    visible={visible}
    onCancel={onCancel}
    onOk={onSave}
    okText="Lưu"
    cancelText="Hủy"
    width={600}
  >
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="totalQuota" label="Tổng chỉ tiêu" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="thpt" label="Điểm thi THPT" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="hsa" label="Học bạ" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="tsa" label="Xét tuyển thẳng" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="dgnl" label="Đánh giá năng lực" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="xthb" label="Xét tuyển kết hợp" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Modal>
);

export default EditQuotaModal;
