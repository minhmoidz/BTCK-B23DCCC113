import User from '../models/User.mjs';

// Lấy danh sách tất cả người dùng (Admin)
export const getAllUsersService = async () => {
  try {
    // Loại bỏ trường password khỏi kết quả trả về
    const users = await User.find().select('-password');
    return users;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách người dùng: ${error.message}`);
  }
};

// Lấy thông tin chi tiết một người dùng bằng ID (Admin)
export const getUserByIdService = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('Không tìm thấy người dùng.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (error) {
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi lấy chi tiết người dùng: ${error.message}`);
  }
};

// Tạo người dùng mới bởi Admin (Admin có thể set role, password trực tiếp)
export const createUserServiceForAdmin = async (userData) => {
  const { email, password, sdt, role } = userData;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email đã được sử dụng.');
      error.statusCode = 409;
      throw error;
    }
    // Password sẽ được hash tự động bởi pre-save hook trong User model
    const newUser = new User({ email, password, sdt, role: role || 'user' });
    await newUser.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.password; // Đảm bảo không trả về password
    return userResponse;

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu tạo người dùng không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi tạo người dùng bởi admin: ${error.message}`);
  }
};

// Hàm MỚI: Tạo người dùng mới (Public, không cần admin, role mặc định 'user')
export const createPublicUserService = async (userData) => {
  const { email, password, sdt } = userData;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email đã được sử dụng.');
      error.statusCode = 409; // Conflict
      throw error;
    }
    // Password sẽ được hash tự động bởi pre-save hook trong User model
    // Role sẽ mặc định là 'user'
    const newUser = new User({ email, password, sdt, role: 'user' });
    await newUser.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.password; // Đảm bảo không trả về password
    return userResponse;

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu tạo người dùng không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) throw error; // Lỗi đã có statusCode (ví dụ 409)
    // Lỗi chung khác
    throw new Error(`Lỗi khi tạo người dùng public: ${error.message}`);
  }
};

// Cập nhật thông tin người dùng bởi Admin
export const updateUserServiceForAdmin = async (userId, dataToUpdate) => {
  const { email, password, sdt, role } = dataToUpdate;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Không tìm thấy người dùng để cập nhật.');
      error.statusCode = 404;
      throw error;
    }

    // Kiểm tra nếu email được cập nhật và đã tồn tại cho user khác
    if (email && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        const error = new Error('Email đã được sử dụng bởi tài khoản khác.');
        error.statusCode = 409;
        throw error;
      }
      user.email = email;
    }

    if (sdt) user.sdt = sdt;
    if (role) user.role = role;

    // Nếu mật khẩu được cung cấp, nó sẽ được hash bởi pre-save hook khi user.save() được gọi
    if (password) {
      user.password = password; // Gán mật khẩu mới, pre-save hook sẽ hash nó
    }

    await user.save(); // Chạy pre-save hook (bao gồm hash password nếu đổi) và validators

    const userResponse = user.toObject();
    delete userResponse.password;
    return userResponse;

  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Dữ liệu cập nhật người dùng không hợp lệ.');
      validationError.statusCode = 400;
      validationError.details = Object.values(error.errors).map(e => e.message);
      throw validationError;
    }
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi cập nhật người dùng bởi admin: ${error.message}`);
  }
};

// Xóa người dùng bởi Admin
export const deleteUserService = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      const error = new Error('Không tìm thấy người dùng để xóa.');
      error.statusCode = 404;
      throw error;
    }
    // TODO: Cân nhắc xóa các dữ liệu liên quan đến user này (ví dụ: đơn xét tuyển của họ)
    return { message: 'Xóa người dùng thành công.' };
  } catch (error) {
    if (error.statusCode) throw error;
    throw new Error(`Lỗi khi xóa người dùng: ${error.message}`);
  }
}; 