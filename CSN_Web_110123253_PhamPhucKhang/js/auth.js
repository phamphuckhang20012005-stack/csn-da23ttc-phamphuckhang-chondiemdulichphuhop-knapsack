// auth.js - Xác thực và quản lý phiên đăng nhập Admin

// THÔNG TIN TÀI KHOẢN ADMIN (CỐ ĐỊNH)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};

// Key lưu trạng thái đăng nhập trong localStorage
const AUTH_KEY = 'isAdmin';
const AUTH_TIMESTAMP_KEY = 'adminLoginTime';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 giờ (milliseconds)

// HÀM ĐĂNG NHẬP

/**
 * Xử lý đăng nhập admin
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {boolean} - true nếu đăng nhập thành công, false nếu thất bại
 */
function login(username, password) {
  // Loại bỏ khoảng trắng thừa
  username = username.trim();
  password = password.trim();
  
  // Kiểm tra dữ liệu đầu vào
  if (!username || !password) {
    showAlert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!', 'warning');
    return false;
  }
  
  // Kiểm tra thông tin đăng nhập
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Đăng nhập thành công
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    
    console.log('✅ Đăng nhập admin thành công');
    
    // Hiển thị thông báo thành công
    showAlert('Đăng nhập thành công! Đang chuyển trang...', 'success');
    
    // Chuyển sang trang admin sau 1 giây
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1000);
    
    return true;
  } else {
    // Đăng nhập thất bại
    console.log('❌ Đăng nhập thất bại');
    
    // Hiển thị thông báo lỗi
    showAlert('Tên đăng nhập hoặc mật khẩu không đúng!', 'danger');
    
    return false;
  }
}

// HÀM KIỂM TRA ĐĂNG NHẬP

/**
 * Kiểm tra xem admin đã đăng nhập chưa
 * Nếu chưa đăng nhập hoặc phiên hết hạn → chuyển về trang login
 * @param {boolean} redirect - Có tự động chuyển hướng không (mặc định: true)
 * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
 */
function checkAdmin(redirect = true) {
  const isAdmin = localStorage.getItem(AUTH_KEY);
  const loginTime = localStorage.getItem(AUTH_TIMESTAMP_KEY);
  
  // Trường hợp 1: Chưa đăng nhập
  if (isAdmin !== 'true') {
    console.log('⚠️ Chưa đăng nhập admin');
    if (redirect) {
      window.location.href = 'admin-login.html';
    }
    return false;
  }
  
  // Trường hợp 2: Kiểm tra thời gian phiên đăng nhập
  if (loginTime) {
    const currentTime = Date.now();
    const timeDiff = currentTime - parseInt(loginTime);
    
    // Nếu quá 24 giờ → hết hạn phiên
    if (timeDiff > SESSION_DURATION) {
      console.log('⏰ Phiên đăng nhập đã hết hạn');
      logout(true);
      if (redirect) {
        showAlert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', 'warning');
      }
      return false;
    }
  }
  
  // Trường hợp 3: Đã đăng nhập và còn hiệu lực
  console.log('✅ Admin đã đăng nhập');
  return true;
}

/** Kiểm tra và ngăn truy cập trang admin nếu chưa đăng nhập
    Gọi hàm này ở đầu file admin.js */
function requireAdmin() {
  if (!checkAdmin()) {
    // Đã tự động chuyển hướng trong checkAdmin()
    return false;
  }
  return true;
}

// HÀM ĐĂNG XUẤT

/**
 * Đăng xuất admin
 * @param {boolean} silent - Không hiển thị alert (mặc định: false)
 */
function logout(silent = false) {
  // Xóa thông tin đăng nhập khỏi localStorage
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  
  console.log('👋 Đã đăng xuất admin');
  
  if (!silent) {
    showAlert('Đã đăng xuất thành công!', 'success');
  }
  
  // Chuyển về trang login sau 500ms
  setTimeout(() => {
    window.location.href = 'admin-login.html';
  }, 500);
}

// HÀM KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP (KHÔNG REDIRECT)

/**
 * Kiểm tra trạng thái đăng nhập mà không tự động chuyển hướng
 * Dùng để hiển thị UI khác nhau cho admin/user
 * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
 */
function isAdminLoggedIn() {
  return checkAdmin(false);
}

/**
 * Lấy thời gian còn lại của phiên đăng nhập
 * @returns {number} - Số giờ còn lại (làm tròn)
 */
function getSessionTimeRemaining() {
  const loginTime = localStorage.getItem(AUTH_TIMESTAMP_KEY);
  
  if (!loginTime) return 0;
  
  const currentTime = Date.now();
  const timeDiff = currentTime - parseInt(loginTime);
  const timeRemaining = SESSION_DURATION - timeDiff;
  
  if (timeRemaining <= 0) return 0;
  
  // Trả về số giờ còn lại (làm tròn)
  return Math.ceil(timeRemaining / (60 * 60 * 1000));
}

// HÀM TIỆN ÍCH

/**
 * Hiển thị thông báo (alert)
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại: success, danger, warning, info
 */
function showAlert(message, type = 'info') {
  // Kiểm tra xem có Bootstrap không
  if (typeof bootstrap !== 'undefined') {
    // Nếu có Bootstrap, tạo alert đẹp
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  } else {
    // Fallback: dùng alert() đơn giản
    alert(message);
  }
}

/** Hiển thị thông tin admin đang đăng nhập
    Gọi hàm này trong trang admin.html để hiển thị username
 */
function displayAdminInfo() {
  if (isAdminLoggedIn()) {
    const hoursRemaining = getSessionTimeRemaining();
    return {
      username: ADMIN_CREDENTIALS.username,
      hoursRemaining: hoursRemaining,
      message: `Xin chào, ${ADMIN_CREDENTIALS.username}! (Còn ${hoursRemaining}h)`
    };
  }
  return null;
}

// XỬ LÝ FORM ĐĂNG NHẬP (Tự động khi có form)

/** Khởi tạo form đăng nhập
    Tự động gọi khi DOM load xong trong trang admin-login.html */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (!loginForm) return; // Không có form thì bỏ qua
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Gọi hàm login
    login(username, password);
  });
  
  // Xử lý nút Enter trong input
  const inputs = loginForm.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
      }
    });
  });
  
  console.log('✅ Form đăng nhập đã được khởi tạo');
}

// Tự động khởi tạo form khi DOM load
document.addEventListener('DOMContentLoaded', initLoginForm);

// XỬ LÝ NÚT ĐĂNG XUẤT (Tự động khi có nút)

/** Khởi tạo nút đăng xuất
    Tự động gọi khi DOM load xong trong trang admin.html */
function initLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (!logoutBtn) return; // Không có nút thì bỏ qua
  
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Xác nhận trước khi đăng xuất
    const confirm = window.confirm('Bạn có chắc muốn đăng xuất?');
    if (confirm) {
      logout();
    }
  });
  
  console.log('✅ Nút đăng xuất đã được khởi tạo');
}

// Tự động khởi tạo nút logout khi DOM load
document.addEventListener('DOMContentLoaded', initLogoutButton);

// DEMO VÀ TESTING

/** Hàm demo để test */
function demoAuth() {
  console.log('=== DEMO AUTH SYSTEM ===');
  console.log('Tài khoản admin:', ADMIN_CREDENTIALS);
  console.log('Trạng thái đăng nhập:', isAdminLoggedIn());
  
  if (isAdminLoggedIn()) {
    const info = displayAdminInfo();
    console.log('Thông tin admin:', info);
  }
}

// Expose functions để có thể gọi từ console
window.demoAuth = demoAuth;
window.login = login;
window.logout = logout;
window.checkAdmin = checkAdmin;
window.isAdminLoggedIn = isAdminLoggedIn;