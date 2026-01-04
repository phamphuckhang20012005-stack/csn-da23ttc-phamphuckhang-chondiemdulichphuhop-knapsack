// result.js - Xử lý logic cho trang result.html

// Biến toàn cục để lưu kết quả
let currentResults = null;
let currentUserInput = null;

// Chờ DOM load xong
document.addEventListener('DOMContentLoaded', function() {
  // Thời gian delay để hiển thị loading (tạo UX tốt hơn)
  setTimeout(() => {
    processAndDisplayResults();
  }, 800);
  
  // Xử lý nút sắp xếp
  setupSortButtons();
});

/** Hàm chính: Xử lý và hiển thị kết quả */
function processAndDisplayResults() {
  // Bước 1: Lấy dữ liệu người dùng từ localStorage
  currentUserInput = getUserInputFromStorage();
  
  if (!currentUserInput) {
    showError('Không tìm thấy thông tin tìm kiếm. Vui lòng thực hiện tìm kiếm mới.');
    return;
  }
  
  console.log('Dữ liệu người dùng:', currentUserInput);
  
  // Bước 2: Áp dụng thuật toán Knapsack
  currentResults = findOptimalPlaces(currentUserInput);
  
  console.log('Kết quả thuật toán:', currentResults);
  
  // Bước 3: Kiểm tra kết quả
  if (!currentResults.success || currentResults.danh_sach_dia_diem.length === 0) {
    showError(currentResults.message || 'Không tìm thấy địa điểm phù hợp. Hãy thử tăng ngân sách hoặc điều chỉnh nhu cầu.');
    return;
  }
  
  // Bước 4: Giới hạn số lượng địa điểm hiển thị (3-5 địa điểm tốt nhất)
  const maxPlaces = 5;
  const displayPlaces = currentResults.danh_sach_dia_diem.slice(0, maxPlaces);
  
  console.log(`Hiển thị ${displayPlaces.length} địa điểm tốt nhất`);
  
  // Bước 5: Hiển thị kết quả
  hideLoading();
  displaySummary(currentUserInput, currentResults, displayPlaces.length);
  displayPlaces.forEach((place, index) => {
    displayPlaceCard(place, index + 1);
  });
}

/**
 * Lấy dữ liệu người dùng từ localStorage
 * @returns {Object|null} - Dữ liệu người dùng hoặc null nếu không có
 */
function getUserInputFromStorage() {
  try {
    const data = localStorage.getItem('userInput');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ localStorage:', error);
    return null;
  }
}

/** Hiển thị thông tin tổng hợp */
function displaySummary(userInput, results, displayCount) {
  document.getElementById('summaryBudget').textContent = formatCurrency(userInput.ngan_sach);
  document.getElementById('summaryTotalCost').textContent = formatCurrency(results.tong_chi_phi);
  document.getElementById('summaryRemaining').textContent = formatCurrency(results.ngan_sach_con_lai);
  document.getElementById('summaryTotalTime').textContent = results.tong_thoi_gian + ' giờ ≈ ' + Math.ceil(results.tong_thoi_gian / 24) + ' ngày';
  document.getElementById('summaryRegion').textContent = getRegionName(userInput.vung_mien);
  document.getElementById('summaryPlaceCount').textContent = displayCount;
}

/** Hiển thị một card địa điểm */
function displayPlaceCard(place, rank) {
  // Lấy template
  const template = document.getElementById('placeCardTemplate');
  const clone = template.content.cloneNode(true);
  
  // Fill dữ liệu cơ bản
  const img = clone.querySelector('.place-image');
  img.src = place.hinh_anh;
  img.alt = place.ten;
  img.onerror = function() {
    this.src = 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(place.ten);
  };
  
  clone.querySelector('.place-name').textContent = rank + '. ' + place.ten;
  clone.querySelector('.place-region').textContent = place.vung_mien;
  clone.querySelector('.place-cost').textContent = formatCurrency(place.chi_phi);
  clone.querySelector('.place-time').textContent = place.thoi_gian + ' giờ';
  clone.querySelector('.place-days').textContent = '(' + Math.ceil(place.thoi_gian / 24) + ' ngày)';
  
  // Điểm phù hợp (hiển thị 2 nơi)
  const score = parseFloat(place.diem_phu_hop);
  clone.querySelector('.place-score').innerHTML = `<i class="bi bi-star-fill"></i> ${score.toFixed(1)}`;
  clone.querySelector('.place-score-text').textContent = score.toFixed(1);
  
  // Hiển thị các thuộc tính nổi bật (điểm >= 7)
  displayAttributes(clone, place.thuoc_tinh, currentUserInput.nhu_cau);
  
  // Thêm vào container
  document.getElementById('placesContainer').appendChild(clone);
}

/** Hiển thị các thuộc tính nổi bật của địa điểm */
function displayAttributes(clone, placeAttrs, userPrefs) {
  const container = clone.querySelector('.place-attributes .d-flex');
  const attrNames = {
    thien_nhien: { name: 'Thiên nhiên', icon: 'tree-fill', color: 'success' },
    nghi_duong: { name: 'Nghỉ dưỡng', icon: 'moon-stars', color: 'info' },
    van_hoa: { name: 'Văn hóa', icon: 'bank', color: 'warning' },
    am_thuc: { name: 'Ẩm thực', icon: 'cup-hot', color: 'danger' },
    kham_pha: { name: 'Khám phá', icon: 'bicycle', color: 'primary' },
    gia_dinh: { name: 'Gia đình', icon: 'people-fill', color: 'success' },
    cap_doi: { name: 'Cặp đôi', icon: 'heart-fill', color: 'danger' },
    chup_anh: { name: 'Chụp ảnh', icon: 'camera', color: 'warning' },
    khach_san: { name: 'Khách sạn', icon: 'building', color: 'info' }
  };
  
  // Tìm các thuộc tính mà địa điểm có điểm cao (>=7) VÀ user quan tâm (>=6)
  const highlighted = [];
  for (let attr in placeAttrs) {
    if (placeAttrs[attr] >= 7 && userPrefs[attr] >= 6) {
      highlighted.push({
        attr: attr,
        score: placeAttrs[attr]
      });
    }
  }
  
  // Sắp xếp theo điểm giảm dần và chỉ lấy top 4
  highlighted.sort((a, b) => b.score - a.score);
  const topAttrs = highlighted.slice(0, 4);
  
  // Tạo badges
  if (topAttrs.length === 0) {
    container.innerHTML = '<small class="text-muted">Phù hợp tổng quát</small>';
  } else {
    topAttrs.forEach(item => {
      const info = attrNames[item.attr];
      const badge = document.createElement('span');
      badge.className = `badge bg-${info.color}`;
      badge.innerHTML = `<i class="bi bi-${info.icon}"></i> ${info.name}`;
      container.appendChild(badge);
    });
  }
}

/** Ẩn loading và hiển thị kết quả */
function hideLoading() {
  document.getElementById('loadingSection').classList.add('d-none');
  document.getElementById('resultSection').classList.remove('d-none');
}

/** Hiển thị thông báo lỗi */
function showError(message) {
  document.getElementById('loadingSection').classList.add('d-none');
  document.getElementById('errorSection').classList.remove('d-none');
  document.getElementById('errorMessage').textContent = message;
}

/** Setup các nút sắp xếp */
function setupSortButtons() {
  const sortByScore = document.getElementById('sortByScore');
  const sortByCost = document.getElementById('sortByCost');
  
  if (sortByScore) {
    sortByScore.addEventListener('click', function() {
      sortAndRedisplay('score');
      this.classList.add('active');
      sortByCost.classList.remove('active');
    });
  }
  
  if (sortByCost) {
    sortByCost.addEventListener('click', function() {
      sortAndRedisplay('cost');
      this.classList.add('active');
      sortByScore.classList.remove('active');
    });
  }
}

/** Sắp xếp và hiển thị lại danh sách */
function sortAndRedisplay(sortType) {
  if (!currentResults || !currentResults.danh_sach_dia_diem) return;
  
  let places = [...currentResults.danh_sach_dia_diem];
  
  if (sortType === 'score') {
    // Sắp xếp theo điểm phù hợp giảm dần
    places.sort((a, b) => parseFloat(b.diem_phu_hop) - parseFloat(a.diem_phu_hop));
  } else if (sortType === 'cost') {
    // Sắp xếp theo chi phí tăng dần
    places.sort((a, b) => a.chi_phi - b.chi_phi);
  }
  
  // Giới hạn 3-5 địa điểm
  const maxPlaces = 5;
  places = places.slice(0, maxPlaces);
  
  // Xóa danh sách cũ
  document.getElementById('placesContainer').innerHTML = '';
  
  // Hiển thị lại
  places.forEach((place, index) => {
    displayPlaceCard(place, index + 1);
  });
}

/** Format số tiền */
function formatCurrency(amount) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + ' triệu VNĐ';
  }
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}

/** Lấy tên miền */
function getRegionName(region) {
  const regionMap = {
    'all': 'Tất cả',
    'Miền Bắc': 'Miền Bắc',
    'Miền Trung': 'Miền Trung',
    'Miền Nam': 'Miền Nam'
  };
  return regionMap[region] || region;
}

/** Export kết quả ra JSON (dùng để debug) */
function exportResults() {
  if (!currentResults) {
    console.log('Chưa có kết quả');
    return;
  }
  
  const exportData = {
    userInput: currentUserInput,
    results: currentResults,
    timestamp: new Date().toISOString()
  };
  
  console.log('Dữ liệu export:', JSON.stringify(exportData, null, 2));
  
  // Tạo file download (optional)
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ket-qua-du-lich-' + Date.now() + '.json';
  link.click();
}

// Expose function để có thể gọi từ console để debug
window.exportResults = exportResults;