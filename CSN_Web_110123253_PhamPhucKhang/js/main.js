// main.js - Xử lý logic cho trang index.html (trang người dùng)

// Chờ DOM load xong mới chạy code
document.addEventListener('DOMContentLoaded', function() {
  
  // Lấy các phần tử form
  const form = document.getElementById('userForm');
  const budgetInput = document.getElementById('ngan_sach');
  const budgetDisplay = document.getElementById('budgetDisplay');
  
  // Lấy tất cả các slider (9 thuộc tính)
  const sliders = {
    thien_nhien: document.getElementById('thien_nhien'),
    nghi_duong: document.getElementById('nghi_duong'),
    van_hoa: document.getElementById('van_hoa'),
    am_thuc: document.getElementById('am_thuc'),
    kham_pha: document.getElementById('kham_pha'),
    gia_dinh: document.getElementById('gia_dinh'),
    cap_doi: document.getElementById('cap_doi'),
    chup_anh: document.getElementById('chup_anh'),
    khach_san: document.getElementById('khach_san')
  };
  
  // Hiển thị giá trị ngân sách khi thay đổi
  if (budgetInput && budgetDisplay) {
    budgetInput.addEventListener('input', function() {
      const value = parseInt(this.value);
      budgetDisplay.textContent = formatCurrency(value);
    });
    
    // Hiển thị giá trị ban đầu
    budgetDisplay.textContent = formatCurrency(parseInt(budgetInput.value));
  }
  
  // Cập nhật giá trị hiển thị cho từng slider
  for (let attr in sliders) {
    const slider = sliders[attr];
    const display = document.getElementById(attr + 'Value');
    
    if (slider && display) {
      // Lắng nghe sự kiện thay đổi
      slider.addEventListener('input', function() {
        display.textContent = this.value;
      });
      
      // Hiển thị giá trị ban đầu
      display.textContent = slider.value;
    }
  }
  
  // Xử lý khi submit form
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Ngăn form reload trang
      
      // Bước 1: Lấy dữ liệu từ form
      const userInput = getUserInput();
      
      // Bước 2: Validate dữ liệu
      if (!validateInput(userInput)) {
        return; // Dừng nếu dữ liệu không hợp lệ
      }
      
      // Bước 3: Lưu vào localStorage
      saveUserInput(userInput);
      
      // Bước 4: Hiển thị loading (tùy chọn)
      showLoading();
      
      // Bước 5: Chuyển sang trang kết quả sau 500ms
      setTimeout(() => {
        window.location.href = 'result.html';
      }, 500);
    });
  }
  
  // Nút reset form
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      // Reset tất cả slider về giá trị mặc định (5)
      for (let attr in sliders) {
        if (sliders[attr]) {
          sliders[attr].value = 5;
          const display = document.getElementById(attr + 'Value');
          if (display) display.textContent = '5';
        }
      }
      
      // Reset ngân sách về 5 triệu
      if (budgetInput) {
        budgetInput.value = 5000000;
        if (budgetDisplay) {
          budgetDisplay.textContent = formatCurrency(5000000);
        }
      }
      
      // Reset số ngày về mặc định
      const daysSelect = document.getElementById('so_ngay');
      if (daysSelect) {
        daysSelect.value = '2';
      }
      
      // Reset miền về "Tất cả"
      const regionAll = document.getElementById('regionAll');
      if (regionAll) {
        regionAll.checked = true;
      }
      
      showAlert('Đã đặt lại tất cả về giá trị mặc định', 'info');
    });
  }
});

/**
 * Lấy dữ liệu từ form
 * @returns {Object} - Dữ liệu người dùng nhập
 */
function getUserInput() {
  const ngan_sach = parseInt(document.getElementById('ngan_sach').value);
  const so_ngay = document.getElementById('so_ngay').value;
  
  // Lấy miền được chọn
  const regionRadios = document.getElementsByName('vung_mien');
  let vung_mien = 'all';
  for (let radio of regionRadios) {
    if (radio.checked) {
      vung_mien = radio.value;
      break;
    }
  }
  
  // Lấy giá trị tất cả các thuộc tính
  const nhu_cau = {
    thien_nhien: parseInt(document.getElementById('thien_nhien').value),
    nghi_duong: parseInt(document.getElementById('nghi_duong').value),
    van_hoa: parseInt(document.getElementById('van_hoa').value),
    am_thuc: parseInt(document.getElementById('am_thuc').value),
    kham_pha: parseInt(document.getElementById('kham_pha').value),
    gia_dinh: parseInt(document.getElementById('gia_dinh').value),
    cap_doi: parseInt(document.getElementById('cap_doi').value),
    chup_anh: parseInt(document.getElementById('chup_anh').value),
    khach_san: parseInt(document.getElementById('khach_san').value)
  };
  
  return {
    ngan_sach: ngan_sach,
    so_ngay: so_ngay,
    vung_mien: vung_mien,
    nhu_cau: nhu_cau,
    timestamp: new Date().toISOString() // Thời gian tạo
  };
}

/**
 * Validate dữ liệu đầu vào
 * @param {Object} userInput - Dữ liệu cần validate
 * @returns {boolean} - true nếu hợp lệ, false nếu không
 */
function validateInput(userInput) {
  // Kiểm tra ngân sách
  if (!userInput.ngan_sach || userInput.ngan_sach < 500000) {
    showAlert('Ngân sách tối thiểu là 500,000 VNĐ', 'warning');
    return false;
  }
  
  if (userInput.ngan_sach > 20000000) {
    showAlert('Ngân sách tối đa là 20,000,000 VNĐ', 'warning');
    return false;
  }
  
  // Kiểm tra các thuộc tính (phải từ 1-10)
  for (let attr in userInput.nhu_cau) {
    const value = userInput.nhu_cau[attr];
    if (value < 1 || value > 10) {
      showAlert(`Giá trị ${attr} phải từ 1 đến 10`, 'warning');
      return false;
    }
  }
  
  // Kiểm tra xem có ít nhất 1 thuộc tính > 5 không
  const hasHighPriority = Object.values(userInput.nhu_cau).some(v => v > 5);
  if (!hasHighPriority) {
    const confirm = window.confirm(
      'Tất cả các thuộc tính đều ở mức thấp (≤5). Bạn có chắc muốn tiếp tục?'
    );
    return confirm;
  }
  
  return true;
}

/**
 * Lưu dữ liệu người dùng vào localStorage
 * @param {Object} userInput - Dữ liệu cần lưu
 */
function saveUserInput(userInput) {
  try {
    localStorage.setItem('userInput', JSON.stringify(userInput));
    console.log('Đã lưu nhu cầu người dùng vào localStorage');
    console.log('Dữ liệu:', userInput);
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    showAlert('Không thể lưu dữ liệu. Vui lòng thử lại!', 'danger');
  }
}

/**
 * Format số tiền theo định dạng Việt Nam
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi đã format
 */
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' triệu VNĐ';
  }
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}

/**
 * Hiển thị thông báo (alert)
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại: success, danger, warning, info
 */
function showAlert(message, type = 'info') {
  // Tạo div alert
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.style.minWidth = '300px';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  // Thêm vào body
  document.body.appendChild(alertDiv);
  
  // Tự động xóa sau 3 giây
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

/**
 * Hiển thị loading khi đang xử lý
 */
function showLoading() {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...';
  }
}

/** Load lại dữ liệu đã lưu (nếu có)
    Dùng khi user quay lại trang index.html */
function loadSavedInput() {
  const savedInput = localStorage.getItem('userInput');
  
  if (savedInput) {
    try {
      const data = JSON.parse(savedInput);
      
      // Fill ngân sách
      const budgetInput = document.getElementById('ngan_sach');
      if (budgetInput && data.ngan_sach) {
        budgetInput.value = data.ngan_sach;
        const budgetDisplay = document.getElementById('budgetDisplay');
        if (budgetDisplay) {
          budgetDisplay.textContent = formatCurrency(data.ngan_sach);
        }
      }
      
      // Fill số ngày
      const daysSelect = document.getElementById('so_ngay');
      if (daysSelect && data.so_ngay) {
        daysSelect.value = data.so_ngay;
      }
      
      // Fill miền
      if (data.vung_mien) {
        const regionRadios = document.getElementsByName('vung_mien');
        for (let radio of regionRadios) {
          if (radio.value === data.vung_mien) {
            radio.checked = true;
            break;
          }
        }
      }
      
      // Fill các slider
      if (data.nhu_cau) {
        for (let attr in data.nhu_cau) {
          const slider = document.getElementById(attr);
          const display = document.getElementById(attr + 'Value');
          
          if (slider) {
            slider.value = data.nhu_cau[attr];
            if (display) {
              display.textContent = data.nhu_cau[attr];
            }
          }
        }
      }
      
      console.log('Đã load lại dữ liệu đã lưu');
    } catch (error) {
      console.error('Lỗi khi load dữ liệu:', error);
    }
  }
}

/** Lấy tên miền bằng tiếng Việt */
function getRegionName(region) {
  const regionMap = {
    'all': 'Tất cả',
    'Miền Bắc': 'Miền Bắc',
    'Miền Trung': 'Miền Trung',
    'Miền Nam': 'Miền Nam'
  };
  return regionMap[region] || region;
}

/** Lấy tên thuộc tính bằng tiếng Việt */
function getAttributeName(attr) {
  const attrMap = {
    'thien_nhien': 'Thiên nhiên',
    'nghi_duong': 'Nghỉ dưỡng',
    'van_hoa': 'Văn hóa',
    'am_thuc': 'Ẩm thực',
    'kham_pha': 'Khám phá',
    'gia_dinh': 'Gia đình',
    'cap_doi': 'Cặp đôi',
    'chup_anh': 'Chụp ảnh',
    'khach_san': 'Khách sạn'
  };
  return attrMap[attr] || attr;
}

// Auto load dữ liệu đã lưu khi vào trang (optional)
// Bỏ comment dòng dưới nếu muốn tự động load
// window.addEventListener('load', loadSavedInput);