// src/pages/Admin/AdmissionManagement/AdmissionManagement.tsx

import React, { useState, useEffect } from 'react';
import { Card, Form, message, notification, Modal, Typography, Spin } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AdmissionForm from '../../component/admin/AdmissionManagement/AdmissionForm';
import QuotaTable from '../../component/admin/AdmissionManagement/QuotaTable';
import ResultTabs from '../../component/admin/AdmissionManagement/ResultTabs';
import EditQuotaModal from '../../component/admin/AdmissionManagement/EditQuotaModal';
import { School, Major, AdmissionQuota, AdmissionResult, AdmissionSummary } from '../../types/admin/AdmissionManagement/types';
import { fetchSchools, fetchMajors, fetchQuotas } from '../../services/admin/AdmissionManagement/services';

const { Title } = Typography;
const { confirm } = Modal;

const AdmissionManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [quotaForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [quotas, setQuotas] = useState<AdmissionQuota[]>([]);
  const [admissionResults, setAdmissionResults] = useState<AdmissionResult[]>([]);
  const [admissionSummary, setAdmissionSummary] = useState<AdmissionSummary | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [processLoading, setProcessLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Load danh sách trường
  useEffect(() => {
    fetchSchools()
      .then(setSchools)
      .catch(() => message.error('Không thể tải danh sách trường'));
  }, []);

  // Load danh sách ngành khi chọn trường
  useEffect(() => {
    if (selectedSchool) {
      fetchMajors(selectedSchool)
        .then(setMajors)
        .catch(() => message.error('Không thể tải danh sách ngành'));
    }
  }, [selectedSchool]);

  const handleProcessAdmission = async () => {
    try {
      const values = await form.validateFields();
      if (quotas.length === 0) {
        message.warning('Vui lòng cấu hình chỉ tiêu trước khi xét tuyển!');
        setActiveTab('2');
        return;
      }
      confirm({
        title: 'Xác nhận chạy xét tuyển',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>Bạn có chắc chắn muốn chạy xét tuyển cho:</p>
            <ul>
              <li><strong>Trường:</strong> {schools.find(s => s.id === values.schoolId)?.name}</li>
              <li><strong>Ngành:</strong> {majors.find(m => m.id === values.majorId)?.name}</li>
              <li><strong>Năm học:</strong> {values.academicYear}</li>
            </ul>
          </div>
        ),
        okText: 'Xác nhận',
        cancelText: 'Hủy',
        onOk: () => executeAdmissionProcess(values),
        width: 500,
      });
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const executeAdmissionProcess = async (values: any) => {
    try {
      setProcessLoading(true);
      notification.info({
        message: 'Bắt đầu xét tuyển',
        description: 'Hệ thống đang thực hiện xét tuyển và gửi thông báo...',
        duration: 3,
      });
      const response = await fetch('http://localhost:3000/api/admin/process-admission-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: values.schoolId,
          majorId: values.majorId,
          academicYear: values.academicYear,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAdmissionResults(result.results || []);
          setAdmissionSummary(result.summary);
          notification.success({
            message: 'Xét tuyển hoàn thành!',
            description: `Đã xử lý ${result.summary.totalProcessed} hồ sơ, ${result.summary.totalAccepted} hồ sơ trúng tuyển`,
            duration: 5,
          });
          setActiveTab('3');
        } else {
          message.error(result.error || 'Có lỗi xảy ra khi thực hiện xét tuyển');
        }
        fetchQuotas(values.schoolId, values.majorId, values.academicYear)
          .then((data) => setQuotas([data]))
          .catch(() => setQuotas([]));
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Có lỗi xảy ra khi thực hiện xét tuyển');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thực hiện xét tuyển');
    } finally {
      setProcessLoading(false);
    }
  };

  const handleViewQuotas = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      fetchQuotas(values.schoolId, values.majorId, values.academicYear)
        .then((data) => setQuotas([data]))
        .catch(() => setQuotas([]))
        .finally(() => setLoading(false));
      setActiveTab('2');
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleEditQuota = () => {
    if (quotas.length > 0) {
      const quota = quotas[0];
      quotaForm.setFieldsValue({
        totalQuota: quota.totalQuota,
        ...quota.quotaByMethod,
      });
      setEditModalVisible(true);
    }
  };

  const handleSaveQuota = async () => {
    try {
      const values = await quotaForm.validateFields();
      const formValues = await form.validateFields();
      const totalMethodQuota =
        (values.thpt || 0) +
        (values.hsa || 0) +
        (values.tsa || 0) +
        (values.dgnl || 0) +
        (values.xthb || 0);
      if (totalMethodQuota !== values.totalQuota) {
        message.error(
          `Tổng chỉ tiêu các phương thức (${totalMethodQuota}) phải bằng tổng chỉ tiêu (${values.totalQuota})`
        );
        return;
      }
      const quotaData = {
        schoolId: formValues.schoolId,
        majorId: formValues.majorId,
        academicYear: formValues.academicYear,
        totalQuota: values.totalQuota,
        quotaByMethod: {
          thpt: values.thpt || 0,
          hsa: values.hsa || 0,
          tsa: values.tsa || 0,
          dgnl: values.dgnl || 0,
          xthb: values.xthb || 0,
        },
      };
      const response = await fetch('http://localhost:3000/api/admin/admission-quotas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotaData),
      });
      if (response.ok) {
        message.success('Cập nhật chỉ tiêu thành công!');
        setEditModalVisible(false);
        fetchQuotas(formValues.schoolId, formValues.majorId, formValues.academicYear)
          .then((data) => setQuotas([data]))
          .catch(() => setQuotas([]));
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Có lỗi xảy ra khi cập nhật chỉ tiêu');
      }
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  // Columns cho bảng kết quả
  const resultColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Mã hồ sơ',
      dataIndex: 'maHoSo',
      key: 'maHoSo',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      render: (name: string) => <strong>{name}</strong>,
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <span style={{ color: 'green' }}>{score?.toFixed(2) || '0.00'}</span>,
    },
  ];

  // Columns cho bảng chỉ tiêu
  const quotaColumns = [
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const methodNames: { [key: string]: string } = {
          thpt: 'Điểm thi THPT',
          hsa: 'Học bạ',
          tsa: 'Xét tuyển thẳng',
          dgnl: 'Đánh giá năng lực',
          xthb: 'Xét tuyển kết hợp',
        };
        return <span>{methodNames[method] || method}</span>;
      },
    },
    {
      title: 'Chỉ tiêu',
      dataIndex: 'quota',
      key: 'quota',
      render: (quota: number) => <strong>{quota}</strong>,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🎓 Quản lý Xét tuyển</Title>
      <Card title="Thông tin xét tuyển" extra={<ReloadOutlined onClick={() => window.location.reload()} />}>
        <AdmissionForm
          form={form}
          schools={schools}
          majors={majors}
          loading={loading}
          processLoading={processLoading}
          selectedSchool={selectedSchool}
          setSelectedSchool={setSelectedSchool}
          selectedMajor={selectedMajor}
          setSelectedMajor={setSelectedMajor}
          onProcess={handleProcessAdmission}
          onViewQuotas={handleViewQuotas}
        />
      </Card>
      <div style={{ marginTop: 24 }}>
        <ResultTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          quotas={quotas}
          loading={loading}
          admissionResults={admissionResults}
          admissionSummary={admissionSummary}
          onEditQuota={handleEditQuota}
          quotaColumns={quotaColumns}
          resultColumns={resultColumns}
        />
      </div>
      <EditQuotaModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleSaveQuota}
        form={quotaForm}
      />
    </div>
  );
};

export default AdmissionManagement;
