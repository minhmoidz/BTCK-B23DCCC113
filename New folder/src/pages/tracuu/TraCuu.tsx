import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  InputNumber,
  Button,
  List,
  Typography,
  Row,
  Col,
  Space,
  message,
  Spin,
  Divider
} from 'antd';
import { CalculatorOutlined, SearchOutlined } from '@ant-design/icons';
import RootLayout from '../../component/dunglai/RootLayout';

const { Option } = Select;
const { Title, Text } = Typography;

// Interfaces (giữ nguyên như trước)
interface SubjectBlock {
  code: string;
  name?: string;
  subjects: string[];
}

interface Major {
  _id: string;
  majorCode: string;
  name: string;
  schoolId?: {
    id: string;
    name: string;
  };
  benchmarkThpt?: number;
  benchmarkDgnlHn150?: number;
  benchmarkDgnlHcm150?: number;
  benchmarkDgnlHn30?: number;
  benchmarkDgnlHcm30?: number;
  benchmarkDgtd?: number;
}

interface SubjectScore {
  name: string;
  score: number;
}

interface CalculationPayload {
  majorId: string;
  admissionType: string;
  scores: SubjectScore[] | { score: number };
  priorityGroup?: string;
  priorityArea?: string;
}

interface CalculationResult {
  status: string;
  userScore: number;
  benchmarkScore?: number;
}

interface AdmissionCalculatorProps {
  username: string;
  onLogout: () => void;
}

const AdmissionCalculator: React.FC<AdmissionCalculatorProps> = ({ username, onLogout }) => {
  const [admissionMethod, setAdmissionMethod] = useState<string>('');
  const [subjectBlocks, setSubjectBlocks] = useState<SubjectBlock[]>([]);
  const [selectedSubjectBlock, setSelectedSubjectBlock] = useState<string>('');
  const [subjectScores, setSubjectScores] = useState<{ [key: string]: number }>({});
  const [priorityGroup, setPriorityGroup] = useState<string>('0');
  const [priorityArea, setPriorityArea] = useState<string>('0');
  const [dgnlType, setDgnlType] = useState<string>('dgnl_hn');
  const [dgnlScore, setDgnlScore] = useState<number | null>(null);
  const [dgtdScore, setDgtdScore] = useState<number | null>(null);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<{ [key: string]: boolean }>({});

  const API_BASE_URL = 'https://btck-123.onrender.com/api/chance';

  // Load subject blocks when THPT is selected
  useEffect(() => {
    if (admissionMethod === 'thpt' && subjectBlocks.length === 0) {
      loadSubjectBlocks();
    }
  }, [admissionMethod]);

  const loadSubjectBlocks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/subject-blocks`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const blocks = await response.json();
      setSubjectBlocks(blocks);
    } catch (error) {
      message.error(`Lỗi khi tải danh sách khối thi: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionMethodChange = (value: string) => {
    setAdmissionMethod(value);
    setMajors([]);
    setSubjectScores({});
    setSelectedSubjectBlock('');
  };

  const handleSubjectBlockChange = (value: string) => {
    setSelectedSubjectBlock(value);
    setSubjectScores({});
  };

  const handleSubjectScoreChange = (subjectName: string, value: number | null) => {
    setSubjectScores(prev => ({
      ...prev,
      [subjectName]: value || 0
    }));
  };

  const handleLogout = () => {
    message.success('Đăng xuất thành công');
    // Thêm logic đăng xuất ở đây
  };

  const getSubjectScoresArray = (): SubjectScore[] | null => {
    const selectedBlock = subjectBlocks.find(block => block.code === selectedSubjectBlock);
    if (!selectedBlock) return null;

    const scores: SubjectScore[] = [];
    let allValid = true;

    selectedBlock.subjects.forEach(subject => {
      const score = subjectScores[subject];
      if (score === undefined || score < 0 || score > 10) {
        allValid = false;
      }
      scores.push({ name: subject, score: score || 0 });
    });

    return allValid ? scores : null;
  };

  const findThptMajors = async () => {
    if (!selectedSubjectBlock) {
      message.warning('Vui lòng chọn khối thi');
      return;
    }

    const scores = getSubjectScoresArray();
    if (!scores) {
      message.warning('Vui lòng nhập điểm hợp lệ cho tất cả các môn (0-10)');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/majors/by-subject-block?subjectBlockCode=${selectedSubjectBlock}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      const majorsData = await response.json();
      setMajors(majorsData);
    } catch (error) {
      message.error(`Lỗi tìm ngành THPT: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const findDgnlMajors = async () => {
    if (!dgnlType) {
      message.warning('Vui lòng chọn loại ĐGNL');
      return;
    }
    if (dgnlScore === null) {
      message.warning('Vui lòng nhập điểm ĐGNL');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/majors/by-dgnl?dgnlType=${dgnlType}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      const majorsData = await response.json();
      setMajors(majorsData);
    } catch (error) {
      message.error(`Lỗi tìm ngành ĐGNL: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const findDgtdMajors = async () => {
    if (dgtdScore === null) {
      message.warning('Vui lòng nhập điểm ĐGTD');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/majors/by-dgtd`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      const majorsData = await response.json();
      setMajors(majorsData);
    } catch (error) {
      message.error(`Lỗi tìm ngành ĐGTD: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateChance = async (major: Major, admissionTypeForCalc: string): Promise<CalculationResult | null> => {
    let payload: CalculationPayload;

    if (admissionTypeForCalc === 'thpt') {
      const scores = getSubjectScoresArray();
      if (!scores) {
        message.error('Vui lòng nhập điểm hợp lệ cho tất cả các môn.');
        return null;
      }
      payload = {
        majorId: major._id,
        admissionType: admissionTypeForCalc,
        scores: scores,
        priorityGroup: priorityGroup === '0' ? undefined : priorityGroup,
        priorityArea: priorityArea === '0' ? undefined : priorityArea
      };
    } else if (admissionTypeForCalc === 'dgnl') {
      if (dgnlScore === null) {
        message.error('Vui lòng nhập điểm ĐGNL.');
        return null;
      }
      payload = {
        majorId: major._id,
        admissionType: dgnlType,
        scores: { score: dgnlScore },
        priorityGroup: priorityGroup === '0' ? undefined : priorityGroup,
        priorityArea: priorityArea === '0' ? undefined : priorityArea
      };
    } else if (admissionTypeForCalc === 'dgtd') {
      if (dgtdScore === null) {
        message.error('Vui lòng nhập điểm ĐGTD.');
        return null;
      }
      payload = {
        majorId: major._id,
        admissionType: admissionTypeForCalc,
        scores: { score: dgtdScore },
        priorityGroup: priorityGroup === '0' ? undefined : priorityGroup,
        priorityArea: priorityArea === '0' ? undefined : priorityArea
      };
    } else {
      // For other admission types like TSA (Talent/Straight Admission), scores might not be applicable
      payload = {
        majorId: major._id,
        admissionType: admissionTypeForCalc,
        scores: [], // Or handle as needed if no scores are involved
        priorityGroup: priorityGroup === '0' ? undefined : priorityGroup,
        priorityArea: priorityArea === '0' ? undefined : priorityArea
      };
    }

    try {
      setCalculating(prev => ({ ...prev, [major._id]: true }));
      const response = await fetch(`${API_BASE_URL}/calculate-chance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      message.error(`Lỗi tính toán cơ hội trúng tuyển: ${error}`);
      return null;
    } finally {
      setCalculating(prev => ({ ...prev, [major._id]: false }));
    }
  };

  const renderSubjectInputs = () => {
    const selectedBlock = subjectBlocks.find(block => block.code === selectedSubjectBlock);
    if (!selectedBlock) return null;

    return (
      <Row gutter={[16, 16]}>
        {selectedBlock.subjects.map(subject => (
          <Col span={12} key={subject}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>{subject}:</Text>
              <InputNumber
                style={{ width: '100%' }}
                placeholder={`Điểm ${subject}`}
                min={0}
                max={10}
                step={0.01}
                value={subjectScores[subject]}
                onChange={(value) => handleSubjectScoreChange(subject, value)}
              />
            </Space>
          </Col>
        ))}
      </Row>
    );
  };

  const getBenchmarkInfo = (major: Major, admissionType: string): string => {
    if (admissionType === 'thpt' && major.benchmarkThpt != null) {
      return ` - Điểm chuẩn THPT: ${major.benchmarkThpt}`;
    } else if (admissionType === 'dgnl_hn' && major.benchmarkDgnlHn150 != null) {
      return ` - ĐC ĐGNL HN (150): ${major.benchmarkDgnlHn150}`;
    } else if (admissionType === 'dgnl_hcm' && major.benchmarkDgnlHcm150 != null) {
      return ` - ĐC ĐGNL HCM (150): ${major.benchmarkDgnlHcm150}`;
    } else if (admissionType === 'dgtd' && major.benchmarkDgtd != null) {
      return ` - Điểm chuẩn ĐGTD: ${major.benchmarkDgtd}`;
    }
    return '';
  };

  const renderMajorItem = (major: Major) => {
    const admissionTypeForCalc = admissionMethod === 'dgnl' ? dgnlType : admissionMethod;
    const benchmarkInfo = getBenchmarkInfo(major, admissionTypeForCalc);
    const isCalculating = calculating[major._id];

    return (
      <List.Item key={major._id}>
        <Card style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>
              <Text strong>Trường:</Text> {major.schoolId?.name || 'N/A'} (ID: {major.schoolId?.id || 'N/A'})
            </Text>
            <Text>
              <Text strong>Ngành:</Text> {major.name} (Mã: {major.majorCode}){benchmarkInfo}
            </Text>
            <Button
              type="primary"
              icon={<CalculatorOutlined />}
              loading={isCalculating}
              onClick={async () => {
                const result = await calculateChance(major, admissionTypeForCalc);
                
                if (result) {
                  message.success(
                    `${major.name}: ${result.status} (Điểm của bạn: ${result.userScore}, Điểm chuẩn: ${result.benchmarkScore || 'N/A'})`
                  );
                } else {
                  message.error(`Không thể tính toán cho ngành ${major.name}`);
                }
              }}
            >
              Tính khả năng trúng tuyển
            </Button>
          </Space>
        </Card>
      </List.Item>
    );
  };

  return (
    <RootLayout username={username} onLogout={handleLogout}>
      <Title level={2}>Công cụ Tính toán Khả năng Trúng tuyển</Title>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong>Chọn phương thức xét tuyển:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="-- Vui lòng chọn --"
              value={admissionMethod}
              onChange={handleAdmissionMethodChange}
            >
              <Option value="thpt">Điểm THPT</Option>
              <Option value="dgnl">Điểm ĐGNL</Option>
              <Option value="dgtd">Điểm ĐGTD</Option>
            </Select>
          </div>

          {/* THPT Section */}
          {admissionMethod === 'thpt' && (
            <Card title="Xét tuyển bằng điểm THPT">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong>Chọn khối:</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="-- Chọn khối --"
                    value={selectedSubjectBlock}
                    onChange={handleSubjectBlockChange}
                    loading={loading}
                  >
                    {subjectBlocks.map(block => (
                      <Option key={block.code} value={block.code}>
                        {block.code} ({block.name || block.subjects.join(', ')})
                      </Option>
                    ))}
                  </Select>
                </div>

                {selectedSubjectBlock && (
                  <>
                    <Divider>Nhập điểm các môn</Divider>
                    {renderSubjectInputs()}
                  </>
                )}

                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Đối tượng ưu tiên:</Text>
                    <Select
                      style={{ width: '100%', marginTop: 8 }}
                      value={priorityGroup}
                      onChange={setPriorityGroup}
                    >
                      <Option value="0">Không có</Option>
                      <Option value="1">Đối tượng 1 (Thuộc nhóm ưu tiên 1)</Option>
                      <Option value="2">Đối tượng 2 (Thuộc nhóm ưu tiên 1)</Option>
                      <Option value="3">Đối tượng 3 (Thuộc nhóm ưu tiên 1)</Option>
                      <Option value="4">Đối tượng 4 (Thuộc nhóm ưu tiên 1)</Option>
                      <Option value="5">Đối tượng 5 (Thuộc nhóm ưu tiên 2)</Option>
                      <Option value="6">Đối tượng 6 (Thuộc nhóm ưu tiên 2)</Option>
                    </Select>
                  </Col>
                  <Col span={12}>
                    <Text strong>Khu vực ưu tiên:</Text>
                    <Select
                      style={{ width: '100%', marginTop: 8 }}
                      value={priorityArea}
                      onChange={setPriorityArea}
                    >
                      <Option value="0">Không có</Option>
                      <Option value="KV1">Khu vực 1 (KV1)</Option>
                      <Option value="KV2-NT">Khu vực 2 Nông thôn (KV2-NT)</Option>
                      <Option value="KV2">Khu vực 2 (KV2)</Option>
                      <Option value="KV3">Khu vực 3 (KV3)</Option>
                    </Select>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={findThptMajors}
                  loading={loading}
                  size="large"
                >
                  Tìm ngành (THPT)
                </Button>
              </Space>
            </Card>
          )}

          {/* DGNL Section */}
          {admissionMethod === 'dgnl' && (
            <Card title="Xét tuyển bằng điểm ĐGNL">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong>Chọn loại ĐGNL:</Text>
                  <Select
                    style={{ width: '100%', marginTop: 8 }}
                    value={dgnlType}
                    onChange={setDgnlType}
                  >
                    <Option value="dgnl_hn">ĐGNL ĐHQG Hà Nội</Option>
                    <Option value="dgnl_hcm">ĐGNL ĐHQG TP.HCM</Option>
                  </Select>
                </div>

                <div>
                  <Text strong>Nhập điểm ĐGNL (thang 150):</Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Ví dụ: 100"
                    value={dgnlScore}
                    onChange={setDgnlScore}
                  />
                </div>

                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={findDgnlMajors}
                  loading={loading}
                  size="large"
                >
                  Tìm ngành (ĐGNL)
                </Button>
              </Space>
            </Card>
          )}

          {/* DGTD Section */}
          {admissionMethod === 'dgtd' && (
            <Card title="Xét tuyển bằng điểm ĐGTD">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <Text strong>Nhập điểm:</Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Ví dụ: 70"
                    value={dgtdScore}
                    onChange={setDgtdScore}
                  />
                </div>

                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={findDgtdMajors}
                  loading={loading}
                  size="large"
                >
                  Tìm ngành (ĐGTD)
                </Button>
              </Space>
            </Card>
          )}
        </Space>
      </Card>

      {/* Results Section */}
      <Card title="Kết quả: Các ngành phù hợp" style={{ marginTop: 20 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tìm kiếm...</div>
          </div>
        ) : majors.length > 0 ? (
          <List
            dataSource={majors}
            renderItem={renderMajorItem}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        ) : (
          <Text type="secondary">Chưa có kết quả.</Text>
        )}
      </Card>
    </RootLayout>
  );
};

export default AdmissionCalculator;
