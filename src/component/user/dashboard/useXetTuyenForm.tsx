import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

// Interface định nghĩa cấu trúc dữ liệu
interface ListItem {
  id: string;
  name: string;
}

interface PhuongThuc {
  code: string;
  name: string;
  description: string;
}

interface FieldRequirement {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  description?: string;
}

interface FileRequirement {
  name: string;
  label: string;
  required: boolean;
}

interface Requirements {
  fields: FieldRequirement[];
  files: FileRequirement[];
}

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Hook tùy chỉnh để xử lý logic của form xét tuyển
const useXetTuyenForm = () => {
  // State cho danh sách trường, ngành, tổ hợp
  const [truongList, setTruongList] = useState<ListItem[]>([]);
  const [nganhList, setNganhList] = useState<ListItem[]>([]);
  const [toHopList, setToHopList] = useState<ListItem[]>([]);
  
  // State cho thông tin đã chọn
  const [selectedTruong, setSelectedTruong] = useState<ListItem | null>(null);
  const [selectedNganh, setSelectedNganh] = useState<ListItem | null>(null);
  const [selectedToHop, setSelectedToHop] = useState<ListItem | null>(null);
  
  // State cho phương thức xét tuyển
  const [phuongThucList, setPhuongThucList] = useState<PhuongThuc[]>([]);
  const [selectedPhuongThuc, setSelectedPhuongThuc] = useState<string>('');
  const [phuongThucRequirements, setPhuongThucRequirements] = useState<Requirements | null>(null);
  
  // State cho file upload
  const [fileList, setFileList] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy danh sách phương thức xét tuyển khi component mount
  useEffect(() => {
    const fetchPhuongThucList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/phuongthuc-xettuyen`);
        setPhuongThucList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phương thức xét tuyển:', error);
        message.error('Không thể tải danh sách phương thức xét tuyển. Vui lòng làm mới trang.');
      }
    };

    fetchPhuongThucList();
  }, []);

  // Lấy danh sách trường khi component mount
  useEffect(() => {
    const fetchTruongList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/truong`);
        setTruongList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách trường:', error);
        message.error('Không thể tải danh sách trường. Vui lòng làm mới trang.');
      }
    };

    fetchTruongList();
  }, []);

  // Xử lý khi chọn phương thức xét tuyển
  const onPhuongThucChange = async (phuongThucCode: string, form: any) => {
    setSelectedPhuongThuc(phuongThucCode);
    setLoading(true);
    
    try {
      // Reset form khi đổi phương thức
      form.resetFields(['truong', 'nganh', 'toHop']);
      setNganhList([]);
      setToHopList([]);
      setSelectedTruong(null);
      setSelectedNganh(null);
      setSelectedToHop(null);
      
      // Khởi tạo lại danh sách file
      setFileList({});
      
      // Gọi API lấy yêu cầu của phương thức
      const response = await axios.get(`${API_BASE_URL}/phuongthuc-xettuyen/${phuongThucCode}/requirements`);
      setPhuongThucRequirements(response.data.requirements);
      
      // Khởi tạo fileList cho từng loại file
      const newFileList: Record<string, any[]> = {};
      response.data.requirements.files.forEach((file: FileRequirement) => {
        newFileList[file.name] = [];
      });
      setFileList(newFileList);
    } catch (error) {
      console.error('Lỗi khi lấy yêu cầu phương thức xét tuyển:', error);
      message.error('Không thể tải yêu cầu phương thức xét tuyển. Vui lòng thử lại.');
      setPhuongThucRequirements(null);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn trường
  const onTruongChange = async (truongKey: string, form: any) => {
    // Tìm thông tin trường đã chọn
    const truong = truongList.find(t => t.id === truongKey);
    setSelectedTruong(truong || null);
    
    setLoading(true);
    try {
      // Reset ngành và tổ hợp khi đổi trường
      form.resetFields(['nganh', 'toHop']);
      setToHopList([]);
      setSelectedNganh(null);
      setSelectedToHop(null);
      
      // Gọi API lấy danh sách ngành theo trường
      const response = await axios.get(`${API_BASE_URL}/nganh/${truongKey}`);
      setNganhList(response.data);
      
      console.log('Danh sách ngành cho trường', truongKey, ':', response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ngành:', error);
      message.error('Không thể tải danh sách ngành. Vui lòng thử lại.');
      setNganhList([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn ngành
  const onNganhChange = async (nganhKey: string, form: any) => {
    // Tìm thông tin ngành đã chọn
    const nganh = nganhList.find(n => n.id === nganhKey);
    setSelectedNganh(nganh || null);
    
    console.log('Ngành được chọn:', { nganhKey, nganh });
    
    const truongKey = form.getFieldValue('truong');
    if (!truongKey || !nganhKey) {
      setToHopList([]);
      return;
    }

    setLoading(true);
    try {
      // Reset tổ hợp khi đổi ngành
      form.resetFields(['toHop']);
      setSelectedToHop(null);
      
      // Gọi API lấy danh sách tổ hợp theo trường và ngành
      const response = await axios.get(`${API_BASE_URL}/tohop/${truongKey}/${nganhKey}`);
      setToHopList(response.data);
      
      console.log('Danh sách tổ hợp cho ngành', nganhKey, ':', response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tổ hợp:', error);
      message.error('Không thể tải danh sách tổ hợp. Vui lòng thử lại.');
      setToHopList([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn tổ hợp môn
  const onToHopChange = (toHopKey: string) => {
    const toHop = toHopList.find(t => t.id === toHopKey);
    setSelectedToHop(toHop || null);
    
    console.log('Tổ hợp được chọn:', { toHopKey, toHop });
  };

  // Kiểm tra file trước khi upload
  const beforeUpload = (file: File) => {
    const isValidType = 
      file.type === 'application/pdf' || 
      file.type === 'image/jpeg' || 
      file.type === 'image/png';
      
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isValidType) {
      message.error('Chỉ chấp nhận file PDF, JPG hoặc PNG!');
    }
    
    if (!isLt5M) {
      message.error('File phải nhỏ hơn 5MB!');
    }
    
    return false;
  };

  // Xử lý sự kiện thay đổi file
  const onFileChange = (fileType: string, info: any) => {
    const { fileList: newFileList } = info;
    
    // Lọc các file không hợp lệ
    const filteredFileList = newFileList.filter((file: any) => {
      if (file.type) {
        const isValidType = 
          file.type === 'application/pdf' || 
          file.type === 'image/jpeg' || 
          file.type === 'image/png';
          
        if (!isValidType) {
          return false;
        }
      }
      
      if (file.size) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          return false;
        }
      }
      
      return true;
    });
    
    setFileList(prev => ({
      ...prev,
      [fileType]: filteredFileList
    }));
  };

  // Gửi hồ sơ xét tuyển
  const submitHoSo = async (values: any, form: any) => {
    // Kiểm tra xem đã chọn phương thức xét tuyển chưa
    if (!selectedPhuongThuc) {
      message.error('Vui lòng chọn phương thức xét tuyển!');
      return;
    }
    
    // Kiểm tra thông tin trường và ngành
    if (!selectedTruong) {
      message.error('Vui lòng chọn trường!');
      return;
    }
    
    if (!selectedNganh) {
      message.error('Vui lòng chọn ngành!');
      return;
    }
    
    // Kiểm tra file đã upload đủ chưa
    if (phuongThucRequirements) {
      const requiredFiles = phuongThucRequirements.files
        .filter(file => file.required)
        .map(file => file.name);
        
      for (const fileType of requiredFiles) {
        if (!fileList[fileType] || fileList[fileType].length === 0) {
          message.error(`Vui lòng tải lên file ${fileType}!`);
          return;
        }
      }
    }
    
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Bạn chưa đăng nhập. Vui lòng đăng nhập để nộp hồ sơ!');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Thêm thông tin trường và ngành từ state đã chọn
      formData.append('truong', selectedTruong.id);
      formData.append('maTruong', selectedTruong.id); // Có thể cần thiết
      formData.append('nganh', selectedNganh.name);
      formData.append('maNganh', selectedNganh.id);
      
      // Thêm thông tin tổ hợp nếu có
      if (selectedToHop) {
        formData.append('toHop', selectedToHop.id);
        formData.append('maToHop', selectedToHop.id);
      }
      
      console.log('Thông tin trường/ngành được gửi:', {
        truong: selectedTruong.id,
        maTruong: selectedTruong.id,
        nganh: selectedNganh.name,
        maNganh: selectedNganh.id,
        toHop: selectedToHop?.id
      });
      
      // Thêm tất cả các trường form khác vào formData
      Object.keys(values).forEach(key => {
        // Bỏ qua các trường đã được xử lý ở trên
        if (['truong', 'nganh', 'toHop'].includes(key)) {
          return;
        }
        
        if (values[key] !== undefined && values[key] !== null) {
          console.log(`Adding field ${key}:`, values[key]);
          // Xử lý đặc biệt cho ngày sinh
          if ((key === 'ngaySinh' || key === 'ngayCapCCCD' || key === 'ngayThi' || key === 'ngayPhongVan') && values[key]._isAMomentObject) {
            formData.append(key, values[key].format('YYYY-MM-DD'));
          } else if (key === 'cacMonXetTuyen' && typeof values[key] === 'object') {
            // Xử lý đặc biệt cho mảng các môn xét tuyển
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        }
      });
      
      // Log để debug các file
      console.log("Files cần upload:", fileList);
      
      // Thêm các file vào formData
      Object.keys(fileList).forEach(fileType => {
        if (fileList[fileType] && fileList[fileType].length > 0) {
          console.log(`Adding file ${fileType}:`, fileList[fileType][0]);
          formData.append(fileType, fileList[fileType][0].originFileObj);
        }
      });
      
      // Kiểm tra formData
      console.log('=== FormData được gửi ===');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      // Gọi API nộp hồ sơ
      const response = await axios.post(
        `${API_BASE_URL}/xettuyen/${selectedPhuongThuc}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      message.success('Nộp hồ sơ xét tuyển thành công!');
      
      // Reset form và state
      form.resetFields();
      setSelectedPhuongThuc('');
      setPhuongThucRequirements(null);
      setFileList({});
      setSelectedTruong(null);
      setSelectedNganh(null);
      setSelectedToHop(null);
      
      return response.data;
    } catch (error: any) {
      console.error('Lỗi chi tiết khi nộp hồ sơ:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        let errorMessage = error.response.data.error || error.response.data.message || 'Gửi hồ sơ thất bại';
        
        // Hiển thị thông tin debug nếu có
        if (error.response.data.debug) {
          console.error('Debug info:', error.response.data.debug);
        }
        
        message.error(errorMessage);
      } else {
        message.error('Không thể kết nối đến máy chủ');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    truongList,
    nganhList,
    toHopList,
    selectedTruong,
    selectedNganh,
    selectedToHop,
    phuongThucList,
    selectedPhuongThuc,
    phuongThucRequirements,
    fileList,
    loading,
    onPhuongThucChange,
    onTruongChange,
    onNganhChange,
    onToHopChange,
    beforeUpload,
    onFileChange,
    submitHoSo
  };
};

export default useXetTuyenForm;
