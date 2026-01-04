// data.js - Dữ liệu địa điểm du lịch Việt Nam
// Cấu trúc: id, ten, vung_mien, chi_phi(VNĐ), thoi_gian(giờ), hinh_anh, thuoc_tinh(1-10 diem)

const DEFAULT_PLACES = [
  {
    id: 1,
    ten: "Vịnh Hạ Long",
    vung_mien: "Miền Bắc",
    chi_phi: 3000000,
    thoi_gian: 48,
    hinh_anh: "images/halong.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 8,
      van_hoa: 6,
      am_thuc: 7,
      kham_pha: 7,
      gia_dinh: 9,
      cap_doi: 9,
      chup_anh: 10,
      khach_san: 8
    }
  },
  {
    id: 2,
    ten: "Phố Cổ Hội An",
    vung_mien: "Miền Trung",
    chi_phi: 2000000,
    thoi_gian: 36,
    hinh_anh: "images/hoian.jpg",
    thuoc_tinh: {
      thien_nhien: 6,
      nghi_duong: 7,
      van_hoa: 10,
      am_thuc: 9,
      kham_pha: 4,
      gia_dinh: 8,
      cap_doi: 10,
      chup_anh: 10,
      khach_san: 6
    }
  },
  {
    id: 3,
    ten: "Đà Lạt",
    vung_mien: "Miền Nam",
    chi_phi: 2500000,
    thoi_gian: 48,
    hinh_anh: "images/dalat.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 9,
      van_hoa: 5,
      am_thuc: 8,
      kham_pha: 6,
      gia_dinh: 9,
      cap_doi: 10,
      chup_anh: 9,
      khach_san: 7
    }
  },
  {
    id: 4,
    ten: "Phú Quốc",
    vung_mien: "Miền Nam",
    chi_phi: 4000000,
    thoi_gian: 72,
    hinh_anh: "images/phuquoc.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 10,
      van_hoa: 4,
      am_thuc: 8,
      kham_pha: 8,
      gia_dinh: 9,
      cap_doi: 9,
      chup_anh: 9,
      khach_san: 10
    }
  },
  {
    id: 5,
    ten: "Sa Pa",
    vung_mien: "Miền Bắc",
    chi_phi: 2200000,
    thoi_gian: 48,
    hinh_anh: "images/sapa.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 7,
      van_hoa: 8,
      am_thuc: 6,
      kham_pha: 9,
      gia_dinh: 7,
      cap_doi: 8,
      chup_anh: 10,
      khach_san: 6
    }
  },
  {
    id: 6,
    ten: "Nha Trang",
    vung_mien: "Miền Trung",
    chi_phi: 3500000,
    thoi_gian: 60,
    hinh_anh: "images/nhatrang.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 9,
      van_hoa: 5,
      am_thuc: 8,
      kham_pha: 8,
      gia_dinh: 10,
      cap_doi: 8,
      chup_anh: 8,
      khach_san: 9
    }
  },
  {
    id: 7,
    ten: "Huế",
    vung_mien: "Miền Trung",
    chi_phi: 1800000,
    thoi_gian: 36,
    hinh_anh: "images/hue.jpg",
    thuoc_tinh: {
      thien_nhien: 7,
      nghi_duong: 6,
      van_hoa: 10,
      am_thuc: 9,
      kham_pha: 5,
      gia_dinh: 8,
      cap_doi: 7,
      chup_anh: 8,
      khach_san: 5
    }
  },
  {
    id: 8,
    ten: "Mũi Né",
    vung_mien: "Miền Nam",
    chi_phi: 1500000,
    thoi_gian: 24,
    hinh_anh: "images/muine.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 8,
      van_hoa: 3,
      am_thuc: 6,
      kham_pha: 7,
      gia_dinh: 7,
      cap_doi: 8,
      chup_anh: 9,
      khach_san: 7
    }
  },
  {
    id: 9,
    ten: "Ninh Bình",
    vung_mien: "Miền Bắc",
    chi_phi: 1200000,
    thoi_gian: 24,
    hinh_anh: "images/ninhbinh.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 7,
      van_hoa: 8,
      am_thuc: 7,
      kham_pha: 6,
      gia_dinh: 8,
      cap_doi: 8,
      chup_anh: 10,
      khach_san: 5
    }
  },
  {
    id: 10,
    ten: "Đảo Cát Bà",
    vung_mien: "Miền Bắc",
    chi_phi: 2800000,
    thoi_gian: 48,
    hinh_anh: "images/catba.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 8,
      van_hoa: 5,
      am_thuc: 7,
      kham_pha: 9,
      gia_dinh: 8,
      cap_doi: 7,
      chup_anh: 9,
      khach_san: 7
    }
  },
  {
    id: 11,
    ten: "Phong Nha Kẻ Bàng",
    vung_mien: "Miền Trung",
    chi_phi: 2800000,
    thoi_gian: 48,
    hinh_anh: "images/phongnha.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 6,
      van_hoa: 7,
      am_thuc: 7,
      kham_pha: 10,
      gia_dinh: 7,
      cap_doi: 7,
      chup_anh: 9,
      khach_san: 6
    }
  },
  {
    id: 12,
    ten: "Quy Nhơn",
    vung_mien: "Miền Trung",
    chi_phi: 2200000,
    thoi_gian: 48,
    hinh_anh: "images/quynhon.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 8,
      van_hoa: 6,
      am_thuc: 9,
      kham_pha: 7,
      gia_dinh: 8,
      cap_doi: 9,
      chup_anh: 9,
      khach_san: 8
    }
  },
  {
    id: 13,
    ten: "Hà Giang",
    vung_mien: "Miền Bắc",
    chi_phi: 3500000,
    thoi_gian: 72,
    hinh_anh: "images/hagiang.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 3,
      van_hoa: 10,
      am_thuc: 7,
      kham_pha: 10,
      gia_dinh: 5,
      cap_doi: 8,
      chup_anh: 10,
      khach_san: 4
    }
  },
  {
    id: 14,
    ten: "Cần Thơ",
    vung_mien: "Miền Nam",
    chi_phi: 1500000,
    thoi_gian: 24,
    hinh_anh: "images/cantho.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 6,
      van_hoa: 9,
      am_thuc: 10,
      kham_pha: 6,
      gia_dinh: 9,
      cap_doi: 7,
      chup_anh: 8,
      khach_san: 7
    }
  },
  {
    id: 15,
    ten: "Đà Nẵng",
    vung_mien: "Miền Trung",
    chi_phi: 3000000,
    thoi_gian: 48,
    hinh_anh: "images/danang.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 9,
      van_hoa: 7,
      am_thuc: 9,
      kham_pha: 7,
      gia_dinh: 10,
      cap_doi: 9,
      chup_anh: 9,
      khach_san: 10
    }
  },
  {
    id: 16,
    ten: "Côn Đảo",
    vung_mien: "Miền Nam",
    chi_phi: 5000000,
    thoi_gian: 72,
    hinh_anh: "images/condao.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 10,
      van_hoa: 9,
      am_thuc: 7,
      kham_pha: 7,
      gia_dinh: 8,
      cap_doi: 9,
      chup_anh: 9,
      khach_san: 9
    }
  },
  {
    id: 17,
    ten: "Đảo Lý Sơn",
    vung_mien: "Miền Trung",
    chi_phi: 2500000,
    thoi_gian: 48,
    hinh_anh: "images/lyson.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 5,
      van_hoa: 8,
      am_thuc: 8,
      kham_pha: 9,
      gia_dinh: 7,
      cap_doi: 8,
      chup_anh: 10,
      khach_san: 4
    }
  },
  {
    id: 18,
    ten: "Tây Ninh",
    vung_mien: "Miền Nam",
    chi_phi: 1000000,
    thoi_gian: 24,
    hinh_anh: "images/tayninh.jpg",
    thuoc_tinh: {
      thien_nhien: 7,
      nghi_duong: 5,
      van_hoa: 10,
      am_thuc: 8,
      kham_pha: 7,
      gia_dinh: 8,
      cap_doi: 6,
      chup_anh: 8,
      khach_san: 6
    }
  },
  {
    id: 19,
    ten: "Mộc Châu",
    vung_mien: "Miền Bắc",
    chi_phi: 1800000,
    thoi_gian: 48,
    hinh_anh: "images/mocchau.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 7,
      van_hoa: 7,
      am_thuc: 8,
      kham_pha: 8,
      gia_dinh: 8,
      cap_doi: 9,
      chup_anh: 10,
      khach_san: 6
    }
  },
  {
    id: 20,
    ten: "Phú Yên",
    vung_mien: "Miền Trung",
    chi_phi: 2000000,
    thoi_gian: 48,
    hinh_anh: "images/phuyen.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 7,
      van_hoa: 6,
      am_thuc: 9,
      kham_pha: 8,
      gia_dinh: 8,
      cap_doi: 9,
      chup_anh: 10,
      khach_san: 7
    }
  },
  {
    id: 21,
    ten: "Buôn Ma Thuột",
    vung_mien: "Miền Trung",
    chi_phi: 2200000,
    thoi_gian: 48,
    hinh_anh: "images/buonmathuot.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 6,
      van_hoa: 10,
      am_thuc: 9,
      kham_pha: 8,
      gia_dinh: 7,
      cap_doi: 7,
      chup_anh: 8,
      khach_san: 6
    }
  },
  {
    id: 22,
    ten: "Đảo Nam Du",
    vung_mien: "Miền Nam",
    chi_phi: 1800000,
    thoi_gian: 48,
    hinh_anh: "images/namdu.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 5,
      van_hoa: 4,
      am_thuc: 8,
      kham_pha: 9,
      gia_dinh: 6,
      cap_doi: 9,
      chup_anh: 10,
      khach_san: 4
    }
  },
  {
    id: 23,
    ten: "Cao Bằng",
    vung_mien: "Miền Bắc",
    chi_phi: 3200000,
    thoi_gian: 72,
    hinh_anh: "images/caobang.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 4,
      van_hoa: 8,
      am_thuc: 7,
      kham_pha: 10,
      gia_dinh: 6,
      cap_doi: 8,
      chup_anh: 10,
      khach_san: 5
    }
  },
  {
    id: 24,
    ten: "Châu Đốc",
    vung_mien: "Miền Nam",
    chi_phi: 1400000,
    thoi_gian: 24,
    hinh_anh: "images/chaudoc.jpg",
    thuoc_tinh: {
      thien_nhien: 7,
      nghi_duong: 5,
      van_hoa: 10,
      am_thuc: 8,
      kham_pha: 7,
      gia_dinh: 8,
      cap_doi: 6,
      chup_anh: 8,
      khach_san: 6
    }
  },
  {
    id: 25,
    ten: "Đồ Sơn",
    vung_mien: "Miền Bắc",
    chi_phi: 1500000,
    thoi_gian: 24,
    hinh_anh: "images/doson.jpg",
    thuoc_tinh: {
      thien_nhien: 6,
      nghi_duong: 7,
      van_hoa: 5,
      am_thuc: 8,
      kham_pha: 5,
      gia_dinh: 8,
      cap_doi: 7,
      chup_anh: 7,
      khach_san: 7
    }
  },
  {
    id: 26,
    ten: "Vũng Tàu",
    vung_mien: "Miền Nam",
    chi_phi: 1200000,
    thoi_gian: 24,
    hinh_anh: "images/vungtau.jpg",
    thuoc_tinh: {
      thien_nhien: 7,
      nghi_duong: 8,
      van_hoa: 5,
      am_thuc: 9,
      kham_pha: 6,
      gia_dinh: 10,
      cap_doi: 8,
      chup_anh: 8,
      khach_san: 8
    }
  },
  {
    id: 27,
    ten: "Điện Biên Phủ",
    vung_mien: "Miền Bắc",
    chi_phi: 2800000,
    thoi_gian: 48,
    hinh_anh: "images/dienbien.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 4,
      van_hoa: 10,
      am_thuc: 7,
      kham_pha: 9,
      gia_dinh: 6,
      cap_doi: 6,
      chup_anh: 8,
      khach_san: 5
    }
  },
  {
    id: 28,
    ten: "Đồng Hới",
    vung_mien: "Miền Trung",
    chi_phi: 2000000,
    thoi_gian: 36,
    hinh_anh: "images/donghoi.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 8,
      van_hoa: 7,
      am_thuc: 8,
      kham_pha: 7,
      gia_dinh: 8,
      cap_doi: 8,
      chup_anh: 8,
      khach_san: 8
    }
  },
  {
    id: 29,
    ten: "Hà Tiên",
    vung_mien: "Miền Nam",
    chi_phi: 1600000,
    thoi_gian: 36,
    hinh_anh: "images/hatien.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 6,
      van_hoa: 9,
      am_thuc: 8,
      kham_pha: 7,
      gia_dinh: 8,
      cap_doi: 7,
      chup_anh: 8,
      khach_san: 6
    }
  },
  {
    id: 30,
    ten: "Pleiku",
    vung_mien: "Miền Trung",
    chi_phi: 2100000,
    thoi_gian: 48,
    hinh_anh: "images/pleiku.jpg",
    thuoc_tinh: {
      thien_nhien: 9,
      nghi_duong: 6,
      van_hoa: 9,
      am_thuc: 8,
      kham_pha: 8,
      gia_dinh: 7,
      cap_doi: 8,
      chup_anh: 9,
      khach_san: 6
    }
  },
  {
    id: 31,
    ten: "Sóc Trăng",
    vung_mien: "Miền Nam",
    chi_phi: 1300000,
    thoi_gian: 24,
    hinh_anh: "images/soctrang.jpg",
    thuoc_tinh: {
      thien_nhien: 6,
      nghi_duong: 5,
      van_hoa: 10,
      am_thuc: 9,
      kham_pha: 6,
      gia_dinh: 7,
      cap_doi: 6,
      chup_anh: 9,
      khach_san: 5
    }
  },
  {
    id: 32,
    ten: "Yên Bái",
    vung_mien: "Miền Bắc",
    chi_phi: 2400000,
    thoi_gian: 48,
    hinh_anh: "images/yenbai.jpg",
    thuoc_tinh: {
      thien_nhien: 10,
      nghi_duong: 6,
      van_hoa: 8,
      am_thuc: 7,
      kham_pha: 9,
      gia_dinh: 7,
      cap_doi: 8,
      chup_anh: 10,
      khach_san: 6
    }
  },
  {
    id: 33,
    ten: "Phan Thiết",
    vung_mien: "Miền Nam",
    chi_phi: 1900000,
    thoi_gian: 36,
    hinh_anh: "images/phanthiet.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 9,
      van_hoa: 6,
      am_thuc: 9,
      kham_pha: 7,
      gia_dinh: 9,
      cap_doi: 8,
      chup_anh: 9,
      khach_san: 8
    }
  },
  {
    id: 34,
    ten: "Lạng Sơn",
    vung_mien: "Miền Bắc",
    chi_phi: 1700000,
    thoi_gian: 36,
    hinh_anh: "images/langson.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 5,
      van_hoa: 9,
      am_thuc: 9,
      kham_pha: 7,
      gia_dinh: 7,
      cap_doi: 6,
      chup_anh: 8,
      khach_san: 6
    }
  },
  {
    id: 35,
    ten: "Bến Tre",
    vung_mien: "Miền Nam",
    chi_phi: 1100000,
    thoi_gian: 24,
    hinh_anh: "images/bentre.jpg",
    thuoc_tinh: {
      thien_nhien: 8,
      nghi_duong: 6,
      van_hoa: 7,
      am_thuc: 9,
      kham_pha: 7,
      gia_dinh: 9,
      cap_doi: 7,
      chup_anh: 8,
      khach_san: 6
    }
  }

];

// Khởi tạo dữ liệu trong localStorage
function initializeData() {
  // Kiểm tra xem localStorage đã có dữ liệu chưa
  const existingData = localStorage.getItem('places');
  
  if (!existingData) {
    // Nếu chưa có, lưu dữ liệu mặc định vào localStorage
    localStorage.setItem('places', JSON.stringify(DEFAULT_PLACES));
    console.log('Đã khởi tạo dữ liệu mặc định vào localStorage');
  } else {
    console.log('Dữ liệu đã tồn tại trong localStorage');
  }
}

// Lấy danh sách địa điểm từ localStorage
function getPlaces() {
  const data = localStorage.getItem('places');
  return data ? JSON.parse(data) : DEFAULT_PLACES;
}

// Lưu danh sách địa điểm vào localStorage
function savePlaces(places) {
  localStorage.setItem('places', JSON.stringify(places));
}

// Thêm địa điểm mới
function addPlace(place) {
  const places = getPlaces();
  
  // Tự động tạo ID mới
  const maxId = places.length > 0 ? Math.max(...places.map(p => p.id)) : 0;
  place.id = maxId + 1;
  
  places.push(place);
  savePlaces(places);
  return place;
}

// Cập nhật địa điểm
function updatePlace(id, updatedPlace) {
  const places = getPlaces();
  const index = places.findIndex(p => p.id === id);
  
  if (index !== -1) {
    places[index] = { ...places[index], ...updatedPlace, id: id };
    savePlaces(places);
    return places[index];
  }
  return null;
}

// Xóa địa điểm
function deletePlace(id) {
  const places = getPlaces();
  const filteredPlaces = places.filter(p => p.id !== id);
  
  if (filteredPlaces.length < places.length) {
    savePlaces(filteredPlaces);
    return true;
  }
  return false;
}

// Lấy địa điểm theo ID
function getPlaceById(id) {
  const places = getPlaces();
  return places.find(p => p.id === id);
}

// Reset về dữ liệu mặc định
function resetToDefault() {
  localStorage.setItem('places', JSON.stringify(DEFAULT_PLACES));
  console.log('Đã reset về dữ liệu mặc định');
}

// Khởi tạo dữ liệu khi file được load
initializeData();
