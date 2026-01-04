// knapsack.js - Thuật toán Knapsack 0/1 cho bài toán tìm địa điểm du lịch
// QUAN TRỌNG: Tối ưu bộ nhớ bằng cách chia ngân sách cho 100.000 (đơn vị: 100k VNĐ)

/** Hệ số chuyển đổi ngân sách
    Ví dụ: 5.000.000 VNĐ ÷ 100.000 = 50 đơn vị
    Mục đích: Giảm kích thước bảng dp để tránh tràn bộ nhớ */
const SCALE_FACTOR = 100000;

/**
 * Tính điểm phù hợp của địa điểm dựa trên nhu cầu người dùng
 * @param {Object} place - Địa điểm du lịch
 * @param {Object} userPreferences - Nhu cầu người dùng (các thuộc tính từ 1-10)
 * @returns {number} - Điểm phù hợp (càng cao càng tốt)
 */
function calculatePlaceValue(place, userPreferences) {
  let totalValue = 0;
  let totalWeight = 0; // Tổng trọng số các thuộc tính
  
  // Duyệt qua từng thuộc tính trong nhu cầu người dùng
  for (let attr in userPreferences) {
    if (place.thuoc_tinh && place.thuoc_tinh[attr] !== undefined) {
      // Công thức: Giá trị = (Điểm của địa điểm) × (Mức độ quan tâm của người dùng)
      // Ví dụ: Địa điểm có thien_nhien=10, user muốn thien_nhien=8 → điểm = 10 × 8 = 80
      totalValue += place.thuoc_tinh[attr] * userPreferences[attr];
      totalWeight += userPreferences[attr];
    }
  }
  
  // Trả về điểm trung bình có trọng số
  // Nếu totalWeight = 0, trả về 0 để tránh chia cho 0
  return totalWeight > 0 ? totalValue / totalWeight : 0;
}

/**
 * Thuật toán Knapsack 0/1 (Quy hoạch động - Tối ưu bộ nhớ)
 * @param {Array} places - Danh sách các địa điểm du lịch
 * @param {number} maxBudget - Ngân sách tối đa (VNĐ)
 * @param {Object} userPreferences - Nhu cầu người dùng
 * @returns {Array} - Danh sách địa điểm được chọn
 */
function knapsack01(places, maxBudget, userPreferences) {
  const n = places.length; // Số lượng địa điểm
  
  // BƯỚC 1: Chuyển đổi chi phí sang đơn vị nhỏ hơn (100k VNĐ)
  // Ví dụ: 5.000.000 VNĐ → 50 đơn vị
  const scaledBudget = Math.floor(maxBudget / SCALE_FACTOR);
  
  console.log(`Ngân sách gốc: ${maxBudget.toLocaleString('vi-VN')} VNĐ`);
  console.log(`Ngân sách sau khi scale: ${scaledBudget} đơn vị (x100k VNĐ)`);
  
  // BƯỚC 2: Tính giá trị (value) cho mỗi địa điểm và scale chi phí
  const items = places.map(place => ({
    place: place,
    cost: Math.floor(place.chi_phi / SCALE_FACTOR),  // Chi phí đã scale
    originalCost: place.chi_phi,  // Chi phí gốc để hiển thị
    value: calculatePlaceValue(place, userPreferences) // Giá trị phù hợp
  }));
  
  // Lọc bỏ các địa điểm vượt ngân sách
  const affordableItems = items.filter(item => item.cost <= scaledBudget);
  
  if (affordableItems.length === 0) {
    console.log('Không có địa điểm nào phù hợp với ngân sách');
    return [];
  }
  
  const m = affordableItems.length;
  
  // BƯỚC 3: Khởi tạo bảng quy hoạch động
  // dp[i][w] = Giá trị tối đa khi xét i địa điểm đầu tiên với ngân sách w (đã scale)
  const dp = Array(m + 1).fill(null).map(() => Array(scaledBudget + 1).fill(0));
  
  console.log(`Kích thước bảng dp: ${m + 1} x ${scaledBudget + 1}`);
  
  // BƯỚC 4: Xây dựng bảng dp (bottom-up)
  for (let i = 1; i <= m; i++) {
    const currentItem = affordableItems[i - 1];
    
    for (let w = 0; w <= scaledBudget; w++) {
      // Trường hợp 1: KHÔNG chọn địa điểm thứ i
      dp[i][w] = dp[i - 1][w];
      
      // Trường hợp 2: CÓ chọn địa điểm thứ i (nếu đủ ngân sách)
      if (currentItem.cost <= w) {
        const valueWithItem = dp[i - 1][w - currentItem.cost] + currentItem.value;
        
        // Chọn phương án tốt hơn
        dp[i][w] = Math.max(dp[i][w], valueWithItem);
      }
    }
  }
  
  // BƯỚC 5: Truy vết để tìm các địa điểm được chọn
  const selectedPlaces = [];
  let remainingBudget = scaledBudget;
  
  // Duyệt ngược từ cuối bảng
  for (let i = m; i > 0; i--) {
    // Nếu giá trị tại dp[i][remainingBudget] khác dp[i-1][remainingBudget]
    // => Địa điểm thứ i đã được chọn
    if (dp[i][remainingBudget] !== dp[i - 1][remainingBudget]) {
      const selectedItem = affordableItems[i - 1];
      selectedPlaces.push({
        ...selectedItem.place,
        diem_phu_hop: selectedItem.value.toFixed(2) // Điểm phù hợp
      });
      remainingBudget -= selectedItem.cost;
    }
  }
  
  // Sắp xếp lại theo điểm phù hợp giảm dần
  selectedPlaces.sort((a, b) => parseFloat(b.diem_phu_hop) - parseFloat(a.diem_phu_hop));
  
  console.log(`Đã chọn ${selectedPlaces.length} địa điểm`);
  
  return selectedPlaces;
}

/**
 * Hàm wrapper để gọi thuật toán Knapsack dễ dàng hơn
 * @param {Object} userInput - Thông tin người dùng nhập vào
 *   - ngan_sach: Ngân sách (VNĐ)
 *   - nhu_cau: Object chứa các thuộc tính (thien_nhien, nghi_duong, ...)
 *   - vung_mien: Lọc theo miền (optional)
 * @returns {Object} - Kết quả gồm danh sách địa điểm và thông tin tổng hợp
 */
function findOptimalPlaces(userInput) {
  // Lấy danh sách địa điểm từ localStorage
  let places = getPlaces();
  
  // Kiểm tra dữ liệu đầu vào
  if (!places || places.length === 0) {
    return {
      success: false,
      message: "Không có dữ liệu địa điểm du lịch",
      danh_sach_dia_diem: []
    };
  }
  
  if (!userInput.ngan_sach || userInput.ngan_sach <= 0) {
    return {
      success: false,
      message: "Ngân sách không hợp lệ",
      danh_sach_dia_diem: []
    };
  }
  
  // Lọc theo miền nếu có
  if (userInput.vung_mien && userInput.vung_mien !== 'all') {
    places = places.filter(p => p.vung_mien === userInput.vung_mien);
    console.log(`Đã lọc theo miền: ${userInput.vung_mien} (${places.length} địa điểm)`);
  }
  
  // Chạy thuật toán Knapsack
  const selectedPlaces = knapsack01(
    places,
    userInput.ngan_sach,
    userInput.nhu_cau
  );
  
  if (selectedPlaces.length === 0) {
    return {
      success: false,
      message: "Không tìm thấy địa điểm phù hợp với ngân sách và nhu cầu của bạn. Hãy thử tăng ngân sách hoặc điều chỉnh nhu cầu.",
      danh_sach_dia_diem: []
    };
  }
  
  // Tính tổng chi phí và thời gian
  const tong_chi_phi = selectedPlaces.reduce((sum, place) => sum + place.chi_phi, 0);
  const tong_thoi_gian = selectedPlaces.reduce((sum, place) => sum + place.thoi_gian, 0);
  
  return {
    success: true,
    danh_sach_dia_diem: selectedPlaces,
    tong_chi_phi: tong_chi_phi,
    tong_thoi_gian: tong_thoi_gian,
    ngan_sach_con_lai: userInput.ngan_sach - tong_chi_phi,
    so_luong_dia_diem: selectedPlaces.length
  };
}

// GIẢI THÍCH THUẬT TOÁN VÀ TỐI ƯU BỘ NHỚ
// 
// 1. BÀI TOÁN KNAPSACK 0/1:
//    - Cho n địa điểm, mỗi địa điểm có chi_phi (trọng lượng) và giá trị phù hợp
//    - Tìm tập hợp địa điểm sao cho tổng chi phí ≤ ngân sách và giá trị tối đa
//    - Mỗi địa điểm chỉ chọn 0 hoặc 1 lần
//
// 2. PHƯƠNG PHÁP: Quy hoạch động (Dynamic Programming)
//    - Công thức: dp[i][w] = max(dp[i-1][w], dp[i-1][w-cost[i]] + value[i])
//    - Độ phức tạp: O(n × W) với n = số địa điểm, W = ngân sách (đã scale)
//
// 3. TỐI ƯU BỘ NHỚ (QUAN TRỌNG!):
//    - VẤN ĐỀ: Ngân sách du lịch thường rất lớn (5.000.000 VNĐ)
//    - Nếu dùng trực tiếp → Bảng dp[10][5000000] = 50 triệu ô → TRÀn bộ nhớ!
//    - GIẢI PHÁP: Chia tất cả cho 100.000 (SCALE_FACTOR)
//      + 5.000.000 VNĐ → 50 đơn vị
//      + Bảng dp[10][50] = 500 ô → Nhẹ hơn 100.000 lần!
//    - Kết quả vẫn chính xác vì tỷ lệ giữa các chi phí không đổi
//
// 4. CÁCH TÍNH ĐIỂM PHÙ HỢP:
//    - Mỗi địa điểm có 9 thuộc tính (thien_nhien, nghi_duong, ...)
//    - User chọn mức độ quan tâm cho từng thuộc tính (1-10)
//    - Điểm = Σ(thuộc_tính[i] × nhu_cầu[i]) / Σ(nhu_cầu[i])
//    - Ví dụ: Địa điểm A có thien_nhien=10, User muốn 8 → đóng góp 80 điểm
