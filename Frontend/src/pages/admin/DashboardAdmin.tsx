import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  Spin,
  message,
  Typography,
  Space,
  Progress,
  Avatar,
  Divider,
  Badge,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { dashboardApi } from '../../services/dashboardApi';
import {
  TongQuanStats,
  TruongPhooBien,
  ThongKeTheoThoiGian,
  SoSanhData,
} from '../../types/index';

const { Title, Text } = Typography;
const { Option } = Select;

const DashboardAdmin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tongQuanData, setTongQuanData] = useState<TongQuanStats | null>(null);
  const [truongPhoBienData, setTruongPhoBienData] = useState<TruongPhooBien[]>([]);
  const [userTimeData, setUserTimeData] = useState<ThongKeTheoThoiGian[]>([]);
  const [hoSoTimeData, setHoSoTimeData] = useState<ThongKeTheoThoiGian[]>([]);
  const [soSanhData, setSoSanhData] = useState<SoSanhData | null>(null);
  const [timeFilter, setTimeFilter] = useState<'ngay' | 'tuan' | 'thang'>('ngay');

  // Enhanced color palette - elegant and modern
  const colors = {
    primary: '#2563eb',      // Modern blue
    secondary: '#64748b',    // Slate gray
    accent: '#0ea5e9',       // Sky blue
    success: '#059669',      // Emerald
    warning: '#d97706',      // Amber
    error: '#dc2626',        // Red
    background: '#ffffff',
    surface: '#f8fafc',      // Very light gray
    border: '#e2e8f0',       // Light border
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#94a3b8'
    }
  };

  const CHART_COLORS = [colors.primary, colors.success, colors.warning, colors.error];

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadTimeBasedData();
  }, [timeFilter]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [tongQuan, truongPhoBien, soSanh] = await Promise.all([
        dashboardApi.getTongQuan(),
        dashboardApi.getTruongPhooBien(),
        dashboardApi.getSoSanh(),
      ]);

      setTongQuanData(tongQuan);
      setTruongPhoBienData(truongPhoBien);
      setSoSanhData(soSanh);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeBasedData = async () => {
    try {
      const [userData, hoSoData] = await Promise.all([
        dashboardApi.getUserTheoThoiGian(timeFilter),
        dashboardApi.getHoSoTheoThoiGian(timeFilter),
      ]);

      setUserTimeData(userData);
      setHoSoTimeData(hoSoData);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu thống kê thời gian');
    }
  };

  const formatTimeData = (userData: ThongKeTheoThoiGian[], hoSoData: ThongKeTheoThoiGian[]) => {
    const userMap = new Map();
    const hoSoMap = new Map();

    userData.forEach(item => {
      const key = timeFilter === 'ngay' 
        ? `${item._id.ngay}/${item._id.thang}`
        : timeFilter === 'tuan'
        ? `T${item._id.tuan}/${item._id.nam}`
        : `${item._id.thang}/${item._id.nam}`;
      userMap.set(key, item.soLuongDangKy || 0);
    });

    hoSoData.forEach(item => {
      const key = timeFilter === 'ngay'
        ? `${item._id.ngay}/${item._id.thang}`
        : timeFilter === 'tuan'
        ? `T${item._id.tuan}/${item._id.nam}`
        : `${item._id.thang}/${item._id.nam}`;
      hoSoMap.set(key, item.soLuongNop || 0);
    });

    const allKeys = new Set([...userMap.keys(), ...hoSoMap.keys()]);
    
    return Array.from(allKeys).map(key => ({
      time: key,
      users: userMap.get(key) || 0,
      hoSo: hoSoMap.get(key) || 0,
    })).slice(0, 15);
  };

  const formatPieData = (data: { [key: string]: number }) => {
    return Object.entries(data).map(([key, value]) => ({
      name: getTrangThaiLabel(key),
      value,
    }));
  };

  const getTrangThaiLabel = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'dang_duyet': 'Đang duyệt',
      'da_duyet': 'Đã duyệt',
      'tu_choi': 'Từ chối',
      'can_bo_sung': 'Cần bổ sung',
    };
    return statusMap[status] || status;
  };

  const getTrangThaiIcon = (status: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'dang_duyet': <ClockCircleOutlined style={{ color: colors.warning }} />,
      'da_duyet': <CheckCircleOutlined style={{ color: colors.success }} />,
      'tu_choi': <CloseCircleOutlined style={{ color: colors.error }} />,
      'can_bo_sung': <ExclamationCircleOutlined style={{ color: colors.primary }} />,
    };
    return iconMap[status] || <EyeOutlined />;
  };

  const schoolColumns = [
    {
      title: 'Xếp hạng',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: index < 3 
              ? `linear-gradient(135deg, ${CHART_COLORS[index]}, ${CHART_COLORS[index]}dd)`
              : colors.surface,
            color: index < 3 ? '#fff' : colors.text.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      title: 'Thông tin trường',
      key: 'school',
      render: (record: TruongPhooBien) => (
        <div>
          <Text strong style={{ fontSize: '14px', color: colors.text.primary }}>
            {record.tenTruong}
          </Text>
          <br />
          <Text style={{ fontSize: '12px', color: colors.text.muted }}>
            Mã: {record.maTruong}
          </Text>
        </div>
      ),
    },
    {
      title: 'Đăng ký',
      dataIndex: 'soLuongDangKy',
      key: 'soLuongDangKy',
      width: 120,
      render: (value: number, record: TruongPhooBien, index: number) => (
        <div>
          <Text strong style={{ color: colors.text.primary, fontSize: '16px' }}>
            {value.toLocaleString()}
          </Text>
          <Progress
            percent={(value / (truongPhoBienData[0]?.soLuongDangKy || 1)) * 100}
            size="small"
            strokeColor={index < 3 ? CHART_COLORS[index] : colors.primary}
            showInfo={false}
            style={{ marginTop: '4px' }}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: `linear-gradient(135deg, ${colors.surface} 0%, #e0e7ff 100%)`
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: colors.text.secondary }}>
            Đang tải dữ liệu...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '32px', 
      background: `linear-gradient(135deg, ${colors.surface} 0%, #e0e7ff 100%)`,
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Enhanced Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        color: '#fff',
        boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <DashboardOutlined style={{ fontSize: '32px', marginRight: '12px' }} />
              <Title level={1} style={{ margin: 0, color: '#fff', fontWeight: 700 }}>
                Dashboard Tuyển sinh
              </Title>
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
              Tổng quan và phân tích dữ liệu hệ thống
            </Text>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '8px'
          }}>
            <Select
              value={timeFilter}
              onChange={setTimeFilter}
              style={{ width: 140 }}
              size="large"
              bordered={false}
            >
              <Option value="ngay">📅 Theo ngày</Option>
              <Option value="tuan">📊 Theo tuần</Option>
              <Option value="thang">📈 Theo tháng</Option>
            </Select>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserOutlined style={{ color: '#fff', fontSize: '20px' }} />
              </div>
              
              <Text style={{ color: colors.text.muted, fontSize: '14px', display: 'block' }}>
                Tổng số User
              </Text>
              <Text style={{ 
                color: colors.text.primary, 
                fontSize: '36px', 
                fontWeight: 700,
                lineHeight: 1.2,
                display: 'block',
                marginTop: '8px'
              }}>
                {tongQuanData?.tongSoUser?.toLocaleString() || 0}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <ArrowUpOutlined style={{ color: colors.success, fontSize: '12px' }} />
                <Text style={{ color: colors.success, fontSize: '12px', marginLeft: '4px' }}>
                  +12% so với tháng trước
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.success}15, ${colors.success}05)`,
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.success}, #10b981)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarOutlined style={{ color: '#fff', fontSize: '20px' }} />
              </div>
              
              <Text style={{ color: colors.text.muted, fontSize: '14px', display: 'block' }}>
                User tuần này
              </Text>
              <Text style={{ 
                color: colors.text.primary, 
                fontSize: '36px', 
                fontWeight: 700,
                lineHeight: 1.2,
                display: 'block',
                marginTop: '8px'
              }}>
                {tongQuanData?.userDangKyTuan?.toLocaleString() || 0}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <ArrowUpOutlined style={{ color: colors.success, fontSize: '12px' }} />
                <Text style={{ color: colors.success, fontSize: '12px', marginLeft: '4px' }}>
                  +8% từ tuần trước
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.warning}15, ${colors.warning}05)`,
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.warning}, #f59e0b)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileTextOutlined style={{ color: '#fff', fontSize: '20px' }} />
              </div>
              
              <Text style={{ color: colors.text.muted, fontSize: '14px', display: 'block' }}>
                Tổng Hồ sơ
              </Text>
              <Text style={{ 
                color: colors.text.primary, 
                fontSize: '36px', 
                fontWeight: 700,
                lineHeight: 1.2,
                display: 'block',
                marginTop: '8px'
              }}>
                {tongQuanData?.tongSoHoSo?.toLocaleString() || 0}
              </Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <ArrowUpOutlined style={{ color: colors.success, fontSize: '12px' }} />
                <Text style={{ color: colors.success, fontSize: '12px', marginLeft: '4px' }}>
                  +15% tăng trưởng
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ 
              background: `linear-gradient(135deg, ${colors.error}15, ${colors.error}05)`,
              padding: '24px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${colors.error}, #ef4444)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrophyOutlined style={{ color: '#fff', fontSize: '20px' }} />
              </div>
              
              <Text style={{ color: colors.text.muted, fontSize: '14px', display: 'block' }}>
                Trường hàng đầu
              </Text>
              <Text style={{ 
                color: colors.text.primary, 
                fontSize: '36px', 
                fontWeight: 700,
                lineHeight: 1.2,
                display: 'block',
                marginTop: '8px'
              }}>
                {truongPhoBienData[0]?.soLuongDangKy?.toLocaleString() || 0}
              </Text>
              <Text style={{ 
                color: colors.text.muted, 
                fontSize: '12px', 
                marginTop: '8px',
                display: 'block'
              }}>
                🏆 {truongPhoBienData[0]?.tenTruong || 'Chưa có dữ liệu'}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Enhanced Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={16}>
          <Card
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ fontSize: '18px', color: colors.text.primary }}>
                  📈 Xu hướng đăng ký theo thời gian
                </Text>
                <br />
                <Text style={{ color: colors.text.muted, fontSize: '14px' }}>
                  Theo dõi sự tăng trưởng user và hồ sơ
                </Text>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={formatTimeData(userTimeData, hoSoTimeData)}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorHoSo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.success} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.success} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.text.muted }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.text.muted }}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={colors.primary}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="👥 User đăng ký"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="hoSo"
                  stroke={colors.success}
                  fillOpacity={1}
                  fill="url(#colorHoSo)"
                  name="📄 Hồ sơ nộp"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '18px', color: colors.text.primary }}>
                📊 Phân bố trạng thái
              </Text>
              <br />
              <Text style={{ color: colors.text.muted, fontSize: '14px' }}>
                Tình trạng xử lý hồ sơ
              </Text>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={formatPieData(tongQuanData?.thongKeTheoTrangThai || {})}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {formatPieData(tongQuanData?.thongKeTheoTrangThai || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <Divider style={{ margin: '20px 0' }} />
            <div>
              {Object.entries(tongQuanData?.thongKeTheoTrangThai || {}).map(([status, count], index) => (
                <div key={status} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: `${CHART_COLORS[index % CHART_COLORS.length]}10`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getTrangThaiIcon(status)}
                    <Text style={{ fontSize: '14px', color: colors.text.primary, marginLeft: '8px' }}>
                      {getTrangThaiLabel(status)}
                    </Text>
                  </div>
                  <Badge 
                    count={count} 
                    style={{ 
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      fontWeight: 'bold'
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom Section */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ fontSize: '18px', color: colors.text.primary }}>
                  🏆 Top trường phổ biến
                </Text>
                <br />
                <Text style={{ color: colors.text.muted, fontSize: '14px' }}>
                  Xếp hạng theo số lượng đăng ký
                </Text>
              </div>
              <Tooltip title="Xem chi tiết">
                <EyeOutlined style={{ color: colors.primary, cursor: 'pointer', fontSize: '16px' }} />
              </Tooltip>
            </div>
            <Table
              columns={schoolColumns}
              dataSource={truongPhoBienData.slice(0, 8)}
              pagination={false}
              rowKey="maTruong"
              showHeader={false}
              style={{ 
                '.ant-table-tbody > tr > td': {
                  borderBottom: `1px solid ${colors.border}`,
                  padding: '16px 0'
                }
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            style={{ 
              borderRadius: '16px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '18px', color: colors.text.primary }}>
                📊 So sánh theo tháng
              </Text>
              <br />
              <Text style={{ color: colors.text.muted, fontSize: '14px' }}>
                User vs Hồ sơ 6 tháng gần đây
              </Text>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={soSanhData?.userTheoThang.map((userItem, index) => ({
                  thang: `T${userItem._id.thang}`,
                  users: userItem.soUser,
                  hoSo: soSanhData.hoSoTheoThang[index]?.soHoSo || 0,
                })).slice(-6)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="thang" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.text.muted }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: colors.text.muted }}
                />
                <RechartsTooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
                <Bar 
                  dataKey="users" 
                  fill={colors.primary} 
                  name="👥 User đăng ký"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="hoSo" 
                  fill={colors.success} 
                  name="📄 Hồ sơ nộp"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Custom CSS for enhanced styling */}
      <style jsx>{`
        .ant-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
        }
        .ant-table-tbody > tr:hover > td {
          background: ${colors.surface} !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardAdmin;
