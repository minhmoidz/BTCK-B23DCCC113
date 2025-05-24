import {
  getAllUsersService,
  getUserByIdService,
  createUserServiceForAdmin,
  updateUserServiceForAdmin,
  deleteUserService,
  createPublicUserService
} from '../services/user.service.mjs';

// Lấy danh sách tất cả người dùng (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng (controller):", error);
    res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh sách người dùng.' });
  }
};

// Lấy thông tin chi tiết một người dùng (Admin)
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi lấy chi tiết người dùng.';
    console.error("Lỗi khi lấy chi tiết người dùng (controller):", error);
    res.status(statusCode).json({ message });
  }
};

// Tạo người dùng mới bởi Admin
export const createUserByAdmin = async (req, res) => {
  try {
    const user = await createUserServiceForAdmin(req.body);
    res.status(201).json({ message: 'Tạo người dùng mới thành công bởi admin', user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi tạo người dùng.';
    const response = { message };
    if (error.details) response.details = error.details;
    console.error("Lỗi khi tạo người dùng bởi admin (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Cập nhật thông tin người dùng bởi Admin
export const updateUserByAdmin = async (req, res) => {
  try {
    const user = await updateUserServiceForAdmin(req.params.id, req.body);
    res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công', user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi cập nhật người dùng.';
    const response = { message };
    if (error.details) response.details = error.details;
    console.error("Lỗi khi cập nhật người dùng bởi admin (controller):", error);
    res.status(statusCode).json(response);
  }
};

// Xóa người dùng bởi Admin
export const deleteUserByAdmin = async (req, res) => {
  try {
    const result = await deleteUserService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Lỗi server khi xóa người dùng.';
    console.error("Lỗi khi xóa người dùng (controller):", error);
    res.status(statusCode).json({ message });
  }
};

// Hàm MỚI: Tạo người dùng mới (Public)
export const createPublicUser = async (req, res) => {
  try {
    const user = await createPublicUserService(req.body);
    res.status(201).json({ message: 'Tạo người dùng mới thành công', user });
  } catch (error) {
    const statusCode = error.statusCode || 500; // Service có thể throw lỗi với statusCode
    const message = error.message || 'Lỗi server khi tạo người dùng.';
    const response = { message };
    if (error.details) response.details = error.details; // Nếu là lỗi validation từ service
    console.error("Lỗi khi tạo người dùng public (controller):", error);
    res.status(statusCode).json(response);
  }
}; 