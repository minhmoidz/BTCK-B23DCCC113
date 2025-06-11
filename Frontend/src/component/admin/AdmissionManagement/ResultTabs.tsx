// src/pages/Admin/AdmissionManagement/components/ResultTabs.tsx

import React from 'react';
import { Tabs, Card, Table, Typography, Tag, Alert } from 'antd';
import { AdmissionQuota, AdmissionResult, AdmissionSummary } from '../../../types/admin/AdmissionManagement/types';

const { TabPane } = Tabs;
const { Text } = Typography;

interface Props {
  activeTab: string;
  setActiveTab: (key: string) => void;
  quotas: AdmissionQuota[];
  loading: boolean;
  admissionResults: AdmissionResult[];
  admissionSummary: AdmissionSummary | null;
  onEditQuota: () => void;
  quotaColumns: any[];
  resultColumns: any[];
}

const ResultTabs: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  quotas,
  loading,
  admissionResults,
  admissionSummary,
  onEditQuota,
  quotaColumns,
  resultColumns,
}) => (
  <Tabs activeKey={activeTab} onChange={setActiveTab}>
    <TabPane tab="Thông tin chung" key="1">
      <Card>
        <Text>Chọn trường và ngành để bắt đầu quy trình xét tuyển</Text>
      </Card>
    </TabPane>
    <TabPane tab={`Chỉ tiêu tuyển sinh ${quotas.length > 0 ? '✓' : ''}`} key="2">
      {quotas.length > 0 ? (
        <Card>
          <Table
            dataSource={quotas}
            columns={quotaColumns}
            loading={loading}
            pagination={false}
            rowKey="majorId"
          />
        </Card>
      ) : (
        <Alert message="Chưa có chỉ tiêu cho ngành này." type="info" showIcon />
      )}
    </TabPane>
    <TabPane tab="Kết quả xét tuyển" key="3">
      {admissionResults.length > 0 ? (
        <Card>
          <Table
            dataSource={admissionResults.flatMap((r) => r.selectedProfiles)}
            columns={resultColumns}
            pagination={false}
            rowKey="profileId"
          />
          {admissionSummary && (
            <div style={{ marginTop: 16 }}>
              <Text strong>
                Tổng hồ sơ đã xử lý: {admissionSummary.totalProcessed} | Hồ sơ trúng tuyển: {admissionSummary.totalAccepted} | Thông báo đã gửi: {admissionSummary.notificationsSent}
              </Text>
            </div>
          )}
        </Card>
      ) : (
        <Alert message="Chưa có kết quả xét tuyển." type="info" showIcon />
      )}
    </TabPane>
  </Tabs>
);

export default ResultTabs;
