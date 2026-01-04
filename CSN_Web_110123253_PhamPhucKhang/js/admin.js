// admin.js - Logic quản lý địa điểm du lịch (CRUD)

// Biến toàn cục
let currentEditId = null; // ID địa điểm đang được sửa
let allPlaces = []; // Lưu tất cả địa điểm để tìm kiếm/lọc

// KHỞI TẠO KHI LOAD TRANG

document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra quyền admin (đã được gọi trong HTML, nhưng đảm bảo thêm)
  if (typeof requireAdmin === 'function') {
    if (!requireAdmin()) {
      return; // Dừng nếu không phải admin
    }
  }
  
  // Load và hiển thị danh sách địa điểm
  loadAndDisplayPlaces();
  
  // Bind các sự kiện
  bindFormEvents();
  bindSearchAndFilter();
  bindResetButton();
  
  console.log('✅ Admin panel đã sẵn sàng');
});

// HIỂN THỊ DANH SÁCH ĐỊA ĐIỂM

//Load và hiển thị tất cả địa điểm
function loadAndDisplayPlaces() {
  // Lấy dữ liệu từ localStorage (sử dụng hàm từ data.js)
  allPlaces = getPlaces();
  
  console.log(`📍 Đã load ${allPlaces.length} địa điểm`);
  
  // Hiển thị lên bảng
  displayPlaces(allPlaces);
  
  // Cập nhật số lượng
  updatePlaceCount(allPlaces.length);
}

/**
 * Hiển thị danh sách địa điểm lên table
 * @param {Array} places - Danh sách địa điểm
 */
function displayPlaces(places) {
  const tbody = document.getElementById('placesTableBody');
  const emptyState = document.getElementById('emptyState');
  
  // Xóa nội dung cũ
  tbody.innerHTML = '';
  
  // Kiểm tra rỗng
  if (places.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  } else {
    emptyState.classList.add('d-none');
  }
  
  // Tạo từng row
  places.forEach(place => {
    const row = createPlaceRow(place);
    tbody.appendChild(row);
  });
}

/**
 * Tạo một row trong table
 * @param {Object} place - Địa điểm
 * @returns {HTMLElement} - Table row
 */
function createPlaceRow(place) {
  const tr = document.createElement('tr');
  
  // ID
  const tdId = document.createElement('td');
  tdId.textContent = place.id;
  
  // Tên
  const tdName = document.createElement('td');
  tdName.innerHTML = `<strong>${place.ten}</strong>`;
  
  // Miền
  const tdRegion = document.createElement('td');
  const regionBadge = getRegionBadge(place.vung_mien);
  tdRegion.innerHTML = regionBadge;
  
  // Chi phí
  const tdCost = document.createElement('td');
  tdCost.textContent = formatCurrency(place.chi_phi);
  
  // Thời gian
  const tdTime = document.createElement('td');
  tdTime.textContent = place.thoi_gian + 'h';
  tdTime.innerHTML += `<br><small class="text-muted">${Math.ceil(place.thoi_gian / 24)} ngày</small>`;
  
  // Thuộc tính (hiển thị top 3)
  const tdAttrs = document.createElement('td');
  tdAttrs.innerHTML = getTopAttributesBadges(place.thuoc_tinh);
  
  // Thao tác
  const tdActions = document.createElement('td');
  tdActions.innerHTML = `
    <button class="btn btn-warning btn-sm me-1" onclick="editPlace(${place.id})" title="Sửa">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-danger btn-sm" onclick="confirmDeletePlace(${place.id})" title="Xóa">
      <i class="bi bi-trash"></i>
    </button>
  `;
  
  // Nối thêm tất cả td vào tr
  tr.appendChild(tdId);
  tr.appendChild(tdName);
  tr.appendChild(tdRegion);
  tr.appendChild(tdCost);
  tr.appendChild(tdTime);
  tr.appendChild(tdAttrs);
  tr.appendChild(tdActions);
  
  return tr;
}

/** Cập nhật số lượng địa điểm */
function updatePlaceCount(count) {
  document.getElementById('placeCount').textContent = count;
}

// THÊM ĐỊA ĐIỂM MỚI

/** Bind sự kiện form */
function bindFormEvents() {
  const form = document.getElementById('placeForm');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Submit form
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (currentEditId) {
      // Chế độ sửa
      updatePlaceFromForm();
    } else {
      // Chế độ thêm mới
      addPlaceFromForm();
    }
  });
  
  // Nút hủy (chuyển về chế độ thêm mới)
  cancelBtn.addEventListener('click', function() {
    resetForm();
  });
}

/** Thêm địa điểm mới từ form */
function addPlaceFromForm() {
  // Lấy dữ liệu từ form
  const placeData = getFormData();
  
  // Xác thực
  if (!validateFormData(placeData)) {
    return;
  }
  
  // Thêm vào localStorage (sử dụng hàm từ data.js)
  const newPlace = addPlace(placeData);
  
  console.log('✅ Đã thêm địa điểm:', newPlace);
  
  // Hiển thị thông báo
  showToast('Thêm địa điểm thành công!', 'success');
  
  // Reset form
  resetForm();
  
  // Reload danh sách
  loadAndDisplayPlaces();
}

/**
 * Lấy dữ liệu từ form
 * @returns {Object} - Dữ liệu địa điểm
 */
function getFormData() {
  return {
    ten: document.getElementById('ten').value.trim(),
    vung_mien: document.getElementById('vung_mien').value,
    chi_phi: parseInt(document.getElementById('chi_phi').value) || 0,
    thoi_gian: parseInt(document.getElementById('thoi_gian').value) || 0,
    hinh_anh: document.getElementById('hinh_anh').value.trim() || 'images/default.jpg',
    thuoc_tinh: {
      thien_nhien: parseInt(document.getElementById('thien_nhien').value) || 0,
      nghi_duong: parseInt(document.getElementById('nghi_duong').value) || 0,
      van_hoa: parseInt(document.getElementById('van_hoa').value) || 0,
      am_thuc: parseInt(document.getElementById('am_thuc').value) || 0,
      kham_pha: parseInt(document.getElementById('kham_pha').value) || 0,
      gia_dinh: parseInt(document.getElementById('gia_dinh').value) || 0,
      cap_doi: parseInt(document.getElementById('cap_doi').value) || 0,
      chup_anh: parseInt(document.getElementById('chup_anh').value) || 0,
      khach_san: parseInt(document.getElementById('khach_san').value) || 0
    }
  };
}

/** Validate dữ liệu form */
function validateFormData(data) {
  if (!data.ten) {
    showToast('Vui lòng nhập tên địa điểm!', 'warning');
    return false;
  }
  
  if (!data.vung_mien) {
    showToast('Vui lòng chọn vùng miền!', 'warning');
    return false;
  }
  
  if (data.chi_phi < 0) {
    showToast('Chi phí không hợp lệ!', 'warning');
    return false;
  }
  
  if (data.thoi_gian < 1) {
    showToast('Thời gian phải lớn hơn 0!', 'warning');
    return false;
  }
  
  // Validate thuộc tính (1-10)
  for (let attr in data.thuoc_tinh) {
    const value = data.thuoc_tinh[attr];
    if (value < 1 || value > 10) {
      showToast(`Thuộc tính ${attr} phải từ 1-10!`, 'warning');
      return false;
    }
  }
  
  return true;
}

// SỬA ĐỊA ĐIỂM

/**
 * Chuyển sang chế độ sửa địa điểm
 * @param {number} id - ID địa điểm
 */
function editPlace(id) {
  // Lấy thông tin địa điểm
  const place = getPlaceById(id);
  
  if (!place) {
    showToast('Không tìm thấy địa điểm!', 'danger');
    return;
  }
  
  console.log('✏️ Sửa địa điểm:', place);
  
  // Lưu ID đang sửa
  currentEditId = id;
  
  // Fill dữ liệu vào form
  document.getElementById('placeId').value = id;
  document.getElementById('ten').value = place.ten;
  document.getElementById('vung_mien').value = place.vung_mien;
  document.getElementById('chi_phi').value = place.chi_phi;
  document.getElementById('thoi_gian').value = place.thoi_gian;
  document.getElementById('hinh_anh').value = place.hinh_anh;
  
  // Fill thuộc tính
  document.getElementById('thien_nhien').value = place.thuoc_tinh.thien_nhien;
  document.getElementById('nghi_duong').value = place.thuoc_tinh.nghi_duong;
  document.getElementById('van_hoa').value = place.thuoc_tinh.van_hoa;
  document.getElementById('am_thuc').value = place.thuoc_tinh.am_thuc;
  document.getElementById('kham_pha').value = place.thuoc_tinh.kham_pha;
  document.getElementById('gia_dinh').value = place.thuoc_tinh.gia_dinh;
  document.getElementById('cap_doi').value = place.thuoc_tinh.cap_doi;
  document.getElementById('chup_anh').value = place.thuoc_tinh.chup_anh;
  document.getElementById('khach_san').value = place.thuoc_tinh.khach_san;
  
  // Đổi UI sang chế độ sửa
  document.getElementById('formTitle').innerHTML = '<i class="bi bi-pencil-square"></i> Sửa địa điểm';
  document.getElementById('submitBtn').innerHTML = '<i class="bi bi-check-circle"></i> Cập nhật';
  document.getElementById('submitBtn').classList.remove('btn-primary');
  document.getElementById('submitBtn').classList.add('btn-success');
  document.getElementById('cancelBtn').style.display = 'block';
  
  // Scroll lên form
  document.getElementById('placeForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Cập nhật địa điểm từ form */
function updatePlaceFromForm() {
  // Lấy dữ liệu từ form
  const placeData = getFormData();
  
  // Validate
  if (!validateFormData(placeData)) {
    return;
  }
  
  // Cập nhật vào localStorage (sử dụng hàm từ data.js)
  const updated = updatePlace(currentEditId, placeData);
  
  if (updated) {
    console.log('✅ Đã cập nhật địa điểm:', updated);
    showToast('Cập nhật địa điểm thành công!', 'success');
    
    // Reset form
    resetForm();
    
    // Reload danh sách
    loadAndDisplayPlaces();
  } else {
    showToast('Lỗi khi cập nhật địa điểm!', 'danger');
  }
}

// XÓA ĐỊA ĐIỂM

/**
 * Xác nhận trước khi xóa
 * @param {number} id - ID địa điểm
 */
function confirmDeletePlace(id) {
  const place = getPlaceById(id);
  
  if (!place) {
    showToast('Không tìm thấy địa điểm!', 'danger');
    return;
  }
  
  // Xác nhận
  const confirmed = confirm(`Bạn có chắc muốn xóa địa điểm "${place.ten}"?`);
  
  if (confirmed) {
    deletePlaceById(id);
  }
}

/**
 * Xóa địa điểm
 * @param {number} id - ID địa điểm
 */
function deletePlaceById(id) {
  // Xóa khỏi localStorage (sử dụng hàm từ data.js)
  const deleted = deletePlace(id);
  
  if (deleted) {
    console.log('✅ Đã xóa địa điểm ID:', id);
    showToast('Xóa địa điểm thành công!', 'success');
    
    // Nếu đang sửa địa điểm này thì reset form
    if (currentEditId === id) {
      resetForm();
    }
    
    // Reload danh sách
    loadAndDisplayPlaces();
  } else {
    showToast('Lỗi khi xóa địa điểm!', 'danger');
  }
}

// TÌM KIẾM VÀ LỌC

/** Bind sự kiện tìm kiếm và lọc */
function bindSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const filterRegion = document.getElementById('filterRegion');
  
  // Tìm kiếm theo tên
  searchInput.addEventListener('input', function() {
    applyFilters();
  });
  
  // Lọc theo miền
  filterRegion.addEventListener('change', function() {
    applyFilters();
  });
}

/** Áp dụng bộ lọc */
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const selectedRegion = document.getElementById('filterRegion').value;
  
  // Lọc dữ liệu
  let filtered = allPlaces;
  
  // Lọc theo tên
  if (searchTerm) {
    filtered = filtered.filter(place => 
      place.ten.toLowerCase().includes(searchTerm)
    );
  }
  
  // Lọc theo miền
  if (selectedRegion) {
    filtered = filtered.filter(place => 
      place.vung_mien === selectedRegion
    );
  }
  
  // Hiển thị kết quả
  displayPlaces(filtered);
  updatePlaceCount(filtered.length);
}

// RESET DỮ LIỆU

/** Bind nút reset */
function bindResetButton() {
  const resetBtn = document.getElementById('resetDataBtn');
  
  resetBtn.addEventListener('click', function() {
    const confirmed = confirm('Bạn có chắc muốn reset về dữ liệu mặc định? Tất cả dữ liệu hiện tại sẽ bị xóa!');
    
    if (confirmed) {
      resetToDefaultData();
    }
  });
}

/** Reset về dữ liệu mặc định */
function resetToDefaultData() {
  // Gọi hàm từ data.js
  if (typeof resetToDefault === 'function') {
    resetToDefault();
    
    console.log('🔄 Đã reset về dữ liệu mặc định');
    showToast('Đã reset về dữ liệu mặc định!', 'info');
    
    // Reset form và reload
    resetForm();
    loadAndDisplayPlaces();
  }
}

// HELPER FUNCTIONS

/** Reset form về chế độ thêm mới */
function resetForm() {
  document.getElementById('placeForm').reset();
  document.getElementById('placeId').value = '';
  currentEditId = null;
  
  // Reset UI
  document.getElementById('formTitle').innerHTML = '<i class="bi bi-plus-circle"></i> Thêm địa điểm mới';
  document.getElementById('submitBtn').innerHTML = '<i class="bi bi-plus-circle"></i> Thêm địa điểm';
  document.getElementById('submitBtn').classList.remove('btn-success');
  document.getElementById('submitBtn').classList.add('btn-primary');
  document.getElementById('cancelBtn').style.display = 'none';
  
  // Reset thuộc tính về 5
  document.getElementById('thien_nhien').value = 5;
  document.getElementById('nghi_duong').value = 5;
  document.getElementById('van_hoa').value = 5;
  document.getElementById('am_thuc').value = 5;
  document.getElementById('kham_pha').value = 5;
  document.getElementById('gia_dinh').value = 5;
  document.getElementById('cap_doi').value = 5;
  document.getElementById('chup_anh').value = 5;
  document.getElementById('khach_san').value = 5;
}

/** Format số tiền */
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' triệu';
  }
  return amount.toLocaleString('vi-VN') + ' đ';
}

/** Tạo badge cho miền */
function getRegionBadge(region) {
  const colors = {
    'Miền Bắc': 'primary',
    'Miền Trung': 'warning',
    'Miền Nam': 'success'
  };
  const color = colors[region] || 'secondary';
  return `<span class="badge bg-${color}">${region}</span>`;
}

/** Lấy top 3 thuộc tính cao nhất */
function getTopAttributesBadges(attrs) {
  const attrNames = {
    thien_nhien: { name: 'Thiên nhiên', icon: '🌳' },
    nghi_duong: { name: 'Nghỉ dưỡng', icon: '🌙' },
    van_hoa: { name: 'Văn hóa', icon: '🏛️' },
    am_thuc: { name: 'Ẩm thực', icon: '☕' },
    kham_pha: { name: 'Khám phá', icon: '🚴' },
    gia_dinh: { name: 'Gia đình', icon: '👨‍👩‍👧' },
    cap_doi: { name: 'Cặp đôi', icon: '❤️' },
    chup_anh: { name: 'Chụp ảnh', icon: '📷' },
    khach_san: { name: 'Khách sạn', icon: '🏨' }
  };
  
  // Chuyển thành array và sort
  const sorted = Object.entries(attrs)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3); // Lấy top 3
  
  // Tạo badges
  return sorted
    .map(item => {
      const info = attrNames[item.key];
      return `<small class="badge bg-secondary me-1">${info.icon} ${item.value}</small>`;
    })
    .join('');
}

/** Hiển thị toast notification */
function showToast(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.style.minWidth = '300px';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Chức năng hiển thị để có thể gọi từ HTML onclick
window.editPlace = editPlace;
window.confirmDeletePlace = confirmDeletePlace;