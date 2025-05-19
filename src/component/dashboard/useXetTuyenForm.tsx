import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';

// Interface định nghĩa cấu trúc dữ liệu cho trường và ngành
interface ListItem {
  value: string;
  label: string;
}

// Hook tùy chỉnh để xử lý logic của form xét tuyển
const useXetTuyenForm = () => {
  // State cho danh sách trường, ngành, tổ hợp
  const [truongList, setTruongList] = useState<ListItem[]>([]);
  const [nganhList, setNganhList] = useState<ListItem[]>([]);
  const [toHopList, setToHopList] = useState<string[]>([]);
  
  // State cho file upload
  const [fileList, setFileList] = useState<any[]>([]);

  // Lấy danh sách trường khi component mount
  useEffect(() => {
    const fetchTruongList = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/truong');
        setTruongList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách trường:', error);
        message.error('Không thể tải danh sách trường. Vui lòng làm mới trang.');
      }
    };

    fetchTruongList();
  }, []);

  // Xử lý khi chọn trường
  const onTruongChange = async (truongKey: string, form: any) => {
    try {
      // Reset ngành và tổ hợp khi đổi trường
      form.setFieldsValue({ nganh: undefined, toHop: undefined });
      setToHopList([]);
      
      // Gọi API lấy danh sách ngành theo trường
      const response = await axios.get(`http://localhost:3000/api/nganh/${truongKey}`);
      setNganhList(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ngành:', error);
      message.error('Không thể tải danh sách ngành. Vui lòng thử lại.');
      setNganhList([]);
    }
  };

  // Xử lý khi chọn ngành
  const onNganhChange = async (nganhKey: string, form: any) => {
    const truongKey = form.getFieldValue('truong');
    if (!truongKey || !nganhKey) {
      setToHopList([]);
      return;
    }

    try {
      // Reset tổ hợp khi đổi ngành
      form.setFieldsValue({ toHop: undefined });
      
      // Gọi API lấy danh sách tổ hợp theo trường và ngành
      const response = await axios.get(`http://localhost:3000/api/tohop/${truongKey}/${nganhKey}`);
      setToHopList(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tổ hợp:', error);
      message.error('Không thể tải danh sách tổ hợp. Vui lòng thử lại.');
      setToHopList([]);
    }
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
    
    // Trả về false để ngăn chặn upload mặc định của antd
    // và để thay vào đó sử dụng upload của chúng ta thông qua FormData
    return false;
  };

  // Xử lý sự kiện thay đổi file
  const onFileChange = ({ fileList }: any) => {
    // Lọc các file không hợp lệ
    const filteredFileList = fileList.filter((file: any) => {
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
    
    setFileList(filteredFileList);
  };

  return {
    truongList,
    nganhList,
    toHopList,
    fileList,
    setFileList,
    onTruongChange,
    onNganhChange,
    beforeUpload,
    onFileChange,
  };
};

export default useXetTuyenForm;