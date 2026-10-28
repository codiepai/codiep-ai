/* ===========================================================================
   BỘ CÂU HỎI DÙNG CHUNG CHO CÁC TRÒ CHƠI CẢ LỚP
   - Chọn bộ có sẵn (Toán, Tiếng Việt, TNXH, HĐTN, Đạo đức lớp 1) theo bài/chủ đề
   - Hoặc chọn "KHÁC": thầy cô lớp nào cũng dán câu hỏi của mình vào
   Cần nạp trước file cau-hoi-san.js (tạo window.CAUHOI_SAN).
   Dùng: BoCauHoi.mo({ khiChon: function(dsCau, tenBo){ ... bắt đầu trò chơi ... } })
   Mỗi câu trả về: { c: "câu hỏi", a: ["đáp án A","B",...], d: vị trí đáp án đúng (0 là A) }
   =========================================================================== */
(function () {
  var NEN_MIN = 8, NEN_MAX = 12, TOI_THIEU = 6, TOI_DA = 30;
  var KHOA = 'codiep-bo-cau-hoi';

  var MAU_DAN = 'Câu 1: Số liền sau của 7 là số nào?\nA. 6\nB. 8\nC. 9\nĐáp án: B\n\n' +
                'Câu 2: Từ nào chỉ hoạt động?\nA. xanh\n*B. chạy\nC. bàn\nD. cao\n\n' +
                'Câu 3: 6 × 7 = ?\nA. 36\nB. 48\nC. 42\nĐáp án: C';

  /* ---- đọc và kiểm tra văn bản dán vào ---- */
  function phanTich(txt) {
    var cau = [], loi = [], cur = null, stt = 0;
    function xong() {
      if (!cur) return;
      stt++;
      var tom = cur.c.length > 36 ? cur.c.slice(0, 36) + '...' : cur.c;
      if (cur.a.length < 2) loi.push('Câu ' + stt + ' ("' + tom + '"): cần ít nhất 2 đáp án A, B.');
      else if (cur.a.length > 4) loi.push('Câu ' + stt + ' ("' + tom + '"): có ' + cur.a.length + ' đáp án, chỉ nhận tối đa 4 (A, B, C, D).');
      else if (cur.d >= cur.a.length) loi.push('Câu ' + stt + ' ("' + tom + '"): đáp án ghi là ' + 'ABCD'[cur.d] + ' nhưng câu chỉ có ' + cur.a.length + ' đáp án.');
      else if (cur.d < 0) loi.push('Câu ' + stt + ' ("' + tom + '"): chưa ghi đáp án đúng. Thêm dòng "Đáp án: B" hoặc gõ dấu * trước đáp án đúng.');
      else cau.push({ c: cur.c, a: cur.a, d: cur.d });
      cur = null;
    }
    var dong = String(txt || '').replace(/\r/g, '').replace(/ /g, ' ').split('\n');
    for (var i = 0; i < dong.length; i++) {
      var l = dong[i].trim(), m;
      if (!l) continue;
      if (cur && (m = l.match(/^(\*?)\s*\(?([A-Ha-h])\s*[.):\-]\s*(.+)$/))) {
        cur.a.push(m[3].trim());
        if (m[1]) cur.d = cur.a.length - 1;
        continue;
      }
      if (cur && (m = l.match(/^(?:đáp án|dap an|đ\/a|đ\.a|đa)\s*[:\-]\s*\(?([A-Ha-h])/i))) {
        cur.d = 'ABCDEFGH'.indexOf(m[1].toUpperCase());
        continue;
      }
      var q = l.replace(/^(câu|cau)\s*\d+\s*[:.)\-]?\s*/i, '').replace(/^\d+\s*[.):]\s*/, '');
      if (cur && cur.a.length === 0) { cur.c += ' ' + q; continue; }   // câu hỏi viết nhiều dòng
      xong();
      cur = { c: q, a: [], d: -1 };
    }
    xong();
    return { cau: cau, loi: loi };
  }

  function tron(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function doc() { try { return JSON.parse(localStorage.getItem(KHOA)) || {}; } catch (e) { return {}; } }
  function ghi(o) { try { localStorage.setItem(KHOA, JSON.stringify(o)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var css = '.bch-ov{position:fixed;inset:0;background:rgba(29,53,87,.6);z-index:50;display:flex;align-items:center;justify-content:center;padding:12px}' +
    '.bch{background:#fff;color:#1d3557;border-radius:26px;width:min(96vw,760px);max-height:96vh;overflow:auto;padding:20px 22px;box-shadow:0 20px 50px rgba(0,0,0,.4);font-family:"Be Vietnam Pro",system-ui,sans-serif}' +
    '.bch h2{font:800 28px "Baloo 2",sans-serif;color:#e63946;margin-bottom:8px}' +
    '.bch label{display:block;font-weight:700;font-size:15px;margin:10px 0 4px;color:#5b6b80}' +
    '.bch select,.bch textarea,.bch input[type=number]{width:100%;width:100%;font:500 17px "Be Vietnam Pro",sans-serif;padding:10px 12px;border:3px solid #cfe3fa;border-radius:14px;background:#fff;color:#1d3557}' +
    '.bch textarea{min-height:170px;resize:vertical}' +
    '.bch .hai{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.bch .huong{background:#fff6d6;border:2px solid #ffd166;border-radius:16px;padding:12px 14px;font-size:15.5px;line-height:1.5;margin-top:10px}' +
    '.bch .huong b{color:#c2255c}.bch .huong pre{background:#fff;border-radius:10px;padding:8px 10px;margin:8px 0;font:600 14.5px/1.45 "Be Vietnam Pro",monospace;white-space:pre-wrap}' +
    '.bch .tt{font-weight:700;margin-top:10px;font-size:16px}.bch .ok{color:#2a9d4a}.bch .canh{color:#d9730d}.bch .loi{color:#e63946}' +
    '.bch ul{margin:6px 0 0 20px;font-size:14.5px;color:#e63946}' +
    '.bch .nut{font:800 20px "Baloo 2",sans-serif;border:0;border-radius:30px;padding:9px 22px;cursor:pointer;color:#fff;background:#1d7bd8;box-shadow:0 5px 0 rgba(0,0,0,.18);margin:6px 8px 0 0}' +
    '.bch .nut.bd{background:linear-gradient(90deg,#ff5d8f,#ff9a3c);font-size:26px;padding:11px 34px}' +
    '.bch .nut.xam{background:#7a8aa0}.bch .nut:disabled{opacity:.45;cursor:not-allowed}' +
    '@media(max-width:520px){.bch .hai{grid-template-columns:1fr}}';

  function khoang(a, b) { return a === b ? a + ' phút' : a + ' đến ' + b + ' phút'; }

  function chenCss() {
    if (!document.getElementById('bch-css')) { var st = document.createElement('style'); st.id = 'bch-css'; st.textContent = css; document.head.appendChild(st); }
  }

  /* ---- khung HƯỚNG DẪN dùng chung: mỗi trò truyền vào {ten, gioiThieu, buoc:[[tiêu đề, mô tả],...], meo:[...]} ---- */
  var cssHD = '.bch-g{background:#fff;color:#1d3557;border-radius:26px;width:min(96vw,720px);max-height:94vh;overflow:auto;padding:20px 22px;box-shadow:0 20px 50px rgba(0,0,0,.45);font-family:"Be Vietnam Pro",system-ui,sans-serif}' +
    '.bch-g h2{font:800 28px "Baloo 2",sans-serif;color:#e63946;margin-bottom:4px}' +
    '.bch-g .gt{font-size:17px;line-height:1.5;color:#5b6b80;margin-bottom:12px}' +
    '.bch-g .b{display:flex;gap:14px;align-items:flex-start;margin:10px 0}' +
    '.bch-g .so{flex:none;width:44px;height:44px;border-radius:50%;background:#e64980;color:#fff;font:800 24px/44px "Baloo 2",sans-serif;text-align:center}' +
    '.bch-g .b b{display:block;font:800 20px "Baloo 2",sans-serif;color:#1d3557}' +
    '.bch-g .b span{font-size:17px;line-height:1.5}' +
    '.bch-g .meo{background:#fff6d6;border:2px solid #ffd166;border-radius:16px;padding:10px 14px;margin-top:12px;font-size:16px;line-height:1.5}' +
    '.bch-g .meo b{color:#c2255c}.bch-g .meo div{margin-top:3px}' +
    '.bch-g .nut{font:800 22px "Baloo 2",sans-serif;border:0;border-radius:30px;padding:9px 28px;cursor:pointer;color:#fff;background:#2a9d4a;box-shadow:0 5px 0 rgba(0,0,0,.18);margin-top:14px}';

  function huongDan(g) {
    chenCss();
    if (!document.getElementById('bch-css-hd')) { var st = document.createElement('style'); st.id = 'bch-css-hd'; st.textContent = cssHD; document.head.appendChild(st); }
    var ov = document.createElement('div'); ov.className = 'bch-ov'; ov.style.zIndex = 60;
    ov.innerHTML = '<div class="bch-g"><h2>❓ Hướng dẫn: ' + esc(g.ten) + '</h2>' +
      (g.gioiThieu ? '<div class="gt">' + esc(g.gioiThieu) + '</div>' : '') +
      (g.buoc || []).map(function (b, i) { return '<div class="b"><div class="so">' + (i + 1) + '</div><div><b>' + esc(b[0]) + '</b><span>' + esc(b[1]) + '</span></div></div>'; }).join('') +
      ((g.meo && g.meo.length) ? '<div class="meo"><b>Mẹo nhỏ</b>' + g.meo.map(function (m) { return '<div>• ' + esc(m) + '</div>'; }).join('') + '</div>' : '') +
      '<button class="nut" type="button">Đã hiểu, bắt đầu thôi!</button></div>';
    ov.onclick = function (e) { if (e.target === ov || e.target.className === 'nut') ov.remove(); };
    document.body.appendChild(ov);
  }

  /* ---- NỘI DUNG HƯỚNG DẪN CÁCH CHƠI cho từng trò (viết cho thầy cô, dễ hiểu) ---- */
  var HD = {
    non: {
      ten: 'Chiếc Nón Kì Diệu',
      gioiThieu: 'Trò chơi cả lớp: quay nón để bốc câu hỏi. Chơi khoảng 10 đến 15 phút, hợp để khởi động hoặc ôn bài cuối tiết.',
      buoc: [
        ['Chuẩn bị (1 phút)', 'Chiếu game lên màn hình. Chọn bộ câu hỏi có sẵn, hoặc chọn mục KHÁC rồi dán câu hỏi của cô vào. Chọn thời gian chơi cho hợp tiết học: khởi động 2 phút, luyện tập 4 hoặc 5 phút, hoặc tự gõ số phút. Bấm "Bắt đầu chơi".'],
        ['Chia đội', 'Chia lớp thành 2 đội hoặc 4 tổ. Mỗi lượt một bạn lên bấm nút "QUAY NÓN".'],
        ['Nón quay', 'Nón quay rồi dừng ở một số, và hiện ra một câu hỏi.'],
        ['Trả lời', 'Cả đội bàn nhau, bạn đại diện nói đáp án A, B, C hoặc D (hoặc giơ bảng con). Cô bấm đáp án đội chọn. Đúng ngay lần đầu được 10 điểm. Sai thì được thử lại một lần, đúng thì được 5 điểm.'],
        ['Kết thúc', 'Hết câu hỏi hoặc HẾT GIỜ là game dừng ngay và hiện điểm, số sao. Đồng hồ ở góc phải màn hình chỉ chạy từ lần quay nón đầu tiên, bấm nút ⏸ để tạm dừng khi cần. Bấm "Chơi lại" để chơi thêm lượt mới.']
      ],
      meo: ['Điện thoại không nghe tiếng? Chạm vào màn hình một lần, bấm nút "Âm thanh" để thử. iPhone: gạt nút im lặng bên hông lên (không thấy dải màu cam) và tăng âm lượng.', 'Game có một bảng điểm chung. Muốn thi đua giữa các đội thì cô ghi điểm từng đội lên bảng, hoặc cho mỗi đội chơi một ván riêng rồi so điểm.',
            'Muốn đổi sang môn khác: bấm nút "Bộ câu hỏi".', 'Lớp ồn thì tắt tiếng bằng nút "Âm thanh".']
    },
    trieuphu: {
      ten: 'Triệu phú nhí',
      gioiThieu: 'Một bạn ngồi "ghế nóng", trả lời lần lượt các câu từ dễ đến khó, được 3 quyền trợ giúp. Cả lớp cổ vũ. Cô điều khiển trên máy và chiếu lên màn hình. Số câu và tổng thời gian do cô quyết định.',
      buoc: [
        ['Chuẩn bị (cô tự đặt kế hoạch)', 'Bấm "Bộ câu hỏi", chọn bộ có sẵn hoặc dán câu hỏi của cô. Chọn SỐ CÂU mỗi bạn phải trả lời (5 đến 15) và TỔNG THỜI GIAN cả buổi chơi (2 phút, 4 phút, 5 phút hoặc tự gõ). Bấm "Danh sách" để nhập tên các bạn, mỗi dòng một tên.'],
        ['Chọn người chơi', 'Bấm vào tên một bạn ở cột bên trái, hoặc bấm "Chọn bạn may mắn" để game chọn ngẫu nhiên một bạn chưa chơi.'],
        ['Trả lời câu hỏi', 'Bạn nghe cô đọc (có nút đọc to), chọn A, B, C hoặc D. Đúng thì bạn lên một bậc ở thang bên phải, mỗi bậc được thêm sao. Nếu cô đặt tổng thời gian thì không có giờ riêng từng câu, chỉ có một đồng hồ chung cho cả buổi.'],
        ['Ba quyền trợ giúp (mỗi quyền dùng một lần)', '50:50 bỏ bớt đáp án sai. Nút 🙋 hỏi ý kiến cả lớp. Nút 📞 nhờ một bạn khác lên giúp.'],
        ['Mốc an toàn', 'Qua câu 5 và câu 10 là mốc an toàn: nếu sau đó trả lời sai, bạn vẫn giữ số sao của mốc. Bạn có thể bấm "Dừng cuộc chơi" để giữ số sao đang có.'],
        ['Hết giờ', 'Đồng hồ chung ở góc phải phía dưới, chạy khi bạn đầu tiên bắt đầu (bấm ⏸ để tạm dừng). Hết giờ là trò chơi DỪNG NGAY, bạn đang chơi giữ số sao đang có.'],
        ['Lượt tiếp theo', 'Chọn bạn khác, những bạn đã chơi được đánh dấu. Muốn bắt đầu buổi mới, vào "Danh sách" rồi bấm "Xóa điểm, chơi buổi mới".']
      ],
      meo: ['Với lớp 1, cô có thể đọc to câu hỏi cho cả lớp nghe, bạn chơi chỉ cần chọn.', 'Cô tính trước: tổng thời gian chia cho số bạn sẽ lên chơi, ví dụ 5 phút cho 3 bạn thì mỗi bạn khoảng 5 đến 6 câu ngắn.']
    },
    olympia: {
      ten: 'Đường lên đỉnh tri thức',
      gioiThieu: '4 tổ thi qua 4 vòng giống chương trình Olympia. Các em trả lời miệng, cô bấm Đúng hoặc Sai. Cô tự đặt số câu từng vòng và tổng thời gian cho vừa tiết học.',
      buoc: [
        ['Chuẩn bị (cô tự đặt kế hoạch)', 'Bấm "Bộ câu hỏi", chọn bộ câu hỏi, rồi chọn SỐ CÂU từng vòng (Khởi động, Tăng tốc, Về đích) và TỔNG THỜI GIAN cả trò (ví dụ 15 phút, tự gõ số phút). Game tự báo cần bao nhiêu câu hỏi. Bấm "Soạn Vòng 2" để soạn ô chữ theo bài cô đang dạy. Chia lớp thành 4 tổ, bấm vào tên tổ ở dưới để đổi tên.'],
        ['Vòng 1: Khởi động', 'Cô chọn tổ rồi bấm "Bắt đầu". Mỗi tổ trả lời số câu cô đã chọn. Đúng bấm "Đúng +10", sai bấm "Sai". Các tổ thi lần lượt.'],
        ['Vòng 2: Vượt chướng ngại vật', 'Các tổ chọn một hàng ngang, cô bấm vào số hàng để hiện câu hỏi (15 giây). Tổ nào trả lời đúng, cô bấm tên tổ rồi "Chấm điểm", một mảnh tranh được mở. Tổ đoán đúng từ khóa càng sớm thì điểm càng cao.'],
        ['Vòng 3: Tăng tốc', 'Có số câu cô đã chọn. Cô bấm tên các tổ theo thứ tự trả lời đúng: nhanh nhất +40, rồi +30, +20, +10. Cuối cùng bấm "Chấm điểm".'],
        ['Vòng 4: Về đích', 'Mỗi tổ chọn số câu cô đã đặt trong các gói 10, 20, 30 điểm. Tổ có thể chọn ⭐ ngôi sao hy vọng: đúng được gấp đôi điểm, sai bị trừ. Tổ trả lời sai thì tổ khác được giành quyền.'],
        ['Hết giờ và tổng kết', 'Đồng hồ chung ở góc phải phía dưới, chạy khi vào vòng thi đầu tiên (bấm ⏸ để tạm dừng). Hết giờ là trò chơi DỪNG NGAY và hiện bảng tổng kết. Cô cũng có thể bấm "🏆 Tổng kết" bất cứ lúc nào để xem tổ nào về nhất. Có nút + và − để cô sửa điểm nếu bấm nhầm.']
      ],
      meo: ['Nếu thời gian ít, cô giảm số câu từng vòng hoặc chỉ chơi vòng 1 và vòng 3 cũng được.', 'Vòng 2 cần cô chuẩn bị trước ô chữ, hãy dùng nút "Soạn Vòng 2" và bấm "Điền mẫu" để xem cách viết.']
    },
    tcl: {
      ten: 'Trò chơi cả lớp (4 trò)',
      gioiThieu: 'Cô điều khiển trên máy, chiếu lên màn hình, cả lớp cùng chơi bằng câu hỏi của chính cô. Mỗi trò chơi khoảng 10 đến 15 phút.',
      buoc: [
        ['Bước 1: Chọn trò chơi', 'Rung chuông vàng: ai trả lời sai thì bị loại, bạn cuối cùng thắng. Mảnh ghép bí ẩn: đúng thì mở một mảnh của bức tranh. Đua thuyền các tổ: tổ đúng thì thuyền tiến lên, tổ nào tới đích trước thắng. Hộp quà bí mật: chọn ô số, trả lời đúng thì nhận quà.'],
        ['Bước 2: Lấy câu hỏi từ đâu', 'Chọn bộ có sẵn của lớp 1 (Toán, Tiếng Việt, TNXH, HĐTN, Đạo đức) rồi chọn bài. Hoặc chọn mục KHÁC, dán câu hỏi của cô vào (mọi lớp, mọi môn). Dưới ô có dòng báo "Có bao nhiêu câu" và nhắc nếu quá ít hay quá nhiều.'],
        ['Bước 3: Bắt đầu', 'Chọn "Thời gian cả ván" nếu cô muốn giới hạn (khởi động 2 phút, luyện tập 4 hoặc 5 phút, hoặc tự gõ số phút). Hết giờ game dừng ngay để cô chốt điểm, không bị cháy giáo án. Bấm "Bắt đầu chơi cả lớp". Cô đọc câu hỏi, các em trả lời, cô bấm "Hiện đáp án" rồi bấm tên bạn hoặc tổ để chấm.'],
        ['Rung chuông vàng', 'Cô bấm "Hiện đáp án", rồi bấm vào tên bạn trả lời sai để loại. Còn một bạn là bạn thắng.'],
        ['Đua thuyền', 'Mỗi tổ trả lời đúng, cô bấm nút "Tổ ... đúng +1". Tổ nào đủ 8 bước tới đích trước thì thắng. Cô bấm vào tên tổ để sửa tên.'],
        ['Hộp quà bí mật', 'Học sinh chọn một ô số, câu hỏi hiện ra, đúng thì mở quà và cộng điểm cho cả lớp.']
      ],
      meo: ['Câu hỏi nên có 8 đến 12 câu cho một trò (mỗi câu khoảng 1 đến 2 phút).', 'Mảnh ghép dùng tối đa 9 câu, Hộp quà tối đa 16 câu.']
    }
  };

  /* ---- ĐỒNG HỒ CẢ VÁN dùng chung: hết giờ thì gọi khiHet để trò chơi DỪNG NGAY ---- */
  var cssGio = '.bch-gio{position:fixed;bottom:56px;right:12px;z-index:45;background:#1d3557;color:#fff;border-radius:30px;padding:4px 8px 4px 18px;font:800 clamp(30px,5vw,46px) "Baloo 2",sans-serif;display:flex;gap:8px;align-items:center;box-shadow:0 6px 16px rgba(0,0,0,.3)}' +
    '.bch-gio button{border:0;border-radius:50%;width:38px;height:38px;font-size:18px;cursor:pointer;background:#ffd166}' +
    '.bch-gio.gap{background:#e63946;animation:bch-nhay .6s infinite}' +
    '@keyframes bch-nhay{50%{opacity:.55}}';
  /* ---- MỞ KHÓA ÂM THANH CHO ĐIỆN THOẠI ----
     Điện thoại chỉ cho phát tiếng sau khi người dùng chạm vào màn hình, và iPhone còn tắt tiếng khi gạt nút im lặng.
     Hàm này tạo MỘT bộ âm thanh dùng chung, mở khóa ở lần chạm đầu tiên; các trò chơi lấy qua BoCauHoi.ctx(). */
  var AC = null, ACLOCK = false, ACEL = null;
  // Tạo một đoạn âm thanh WAV ngay trong trình duyệt (tần số 0 là im lặng). iPhone chỉ chịu "mở khóa" bằng thẻ audio thật.
  function taoWav(hz, giay) {
    var sr = 8000, n = Math.floor(sr * giay), buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    function ch(o, t) { for (var i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); }
    ch(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); ch(8, 'WAVE'); ch(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); ch(36, 'data'); v.setUint32(40, n * 2, true);
    for (var i = 0; i < n; i++) v.setInt16(44 + i * 2, hz ? Math.round(Math.sin(2 * Math.PI * hz * i / sr) * 12000 * Math.min(1, (n - i) / 400)) : 0, true);
    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }
  function ctx() {
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) {}
    return AC;
  }
  function moKhoaAm() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}      // iPhone: kêu cả khi gạt nút im lặng
    var c = ctx();
    try { if (c) { var bf = c.createBuffer(1, 1, 22050), sc = c.createBufferSource(); sc.buffer = bf; sc.connect(c.destination); sc.start(0); } } catch (e) {}
    try {                                                                                         // thẻ audio im lặng chạy lặp: đưa iPhone sang chế độ "phát nhạc"
      if (!ACEL) { ACEL = document.createElement('audio'); ACEL.src = taoWav(0, 1); ACEL.loop = true; ACEL.setAttribute('playsinline', ''); ACEL.style.display = 'none'; document.body.appendChild(ACEL); }
      if (!ACLOCK) { var pr = ACEL.play(); if (pr && pr.then) pr.then(function () { ACLOCK = true; }).catch(function () {}); else ACLOCK = true; }
    } catch (e) {}
    if (c && c.state === 'running' && ACLOCK) ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown'].forEach(function (e) { document.removeEventListener(e, moKhoaAm, true); });
  }
  ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown'].forEach(function (e) { document.addEventListener(e, moKhoaAm, true); });

  function tick(f) {
    try { ctx(); var t0 = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
      o.type = 'square'; o.frequency.value = f; g.gain.setValueAtTime(.06, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + .08); o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + .08); } catch (e) {}
  }
  var G = { el: null, nd: null, t: null, con: 0, tam: false, cb: null };
  G.hien = function () {
    if (!G.el) return;
    var m = Math.floor(G.con / 60), s = G.con % 60;
    G.nd.textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s;
    G.el.classList.toggle('gap', G.con <= 10 && G.con > 0);
  };
  G.huy = function () { clearInterval(G.t); G.t = null; if (G.el) G.el.remove(); G.el = null; G.con = 0; G.tam = false; };
  G.chuan = function (giay, khiHet) {                    // hiện đồng hồ, CHƯA chạy; trò chơi gọi G.bat() khi bắt đầu thật sự
    G.huy(); giay = +giay || 0; if (!giay) return;
    chenCss(); if (!document.getElementById('bch-css-gio')) { var st = document.createElement('style'); st.id = 'bch-css-gio'; st.textContent = cssGio; document.head.appendChild(st); }
    G.cb = khiHet; G.con = giay;
    G.el = document.createElement('div'); G.el.className = 'bch-gio';
    G.nd = document.createElement('span');
    var b = document.createElement('button'); b.type = 'button'; b.textContent = '⏸'; b.title = 'Tạm dừng hoặc chạy tiếp đồng hồ';
    b.onclick = function () { if (!G.t) return; G.tam = !G.tam; b.textContent = G.tam ? '▶' : '⏸'; };
    G.el.appendChild(G.nd); G.el.appendChild(b); document.body.appendChild(G.el); G.hien();
  };
  G.bat = function () {
    if (!G.el || G.t || G.con <= 0) return;
    G.t = setInterval(function () {
      if (G.tam) return;
      G.con--; G.hien();
      if (G.con <= 10 && G.con > 0) tick(800 + (10 - G.con) * 40);
      if (G.con <= 0) { clearInterval(G.t); G.t = null; tick(300); var f = G.cb; G.cb = null; if (f) f(); }
    }, 1000);
  };
  G.chay = function () { return !!G.t; };

  function mo(opt) {
    var KHO = window.CAUHOI_SAN || [];
    var luu = doc();
    var H = opt.huong || {};                               // quy định riêng của từng trò chơi
    var nenMin = H.nenMin || NEN_MIN, nenMax = H.nenMax || NEN_MAX, toiThieu = H.toiThieu || TOI_THIEU, toiDa = H.toiDa || TOI_DA;
    var cacSo = H.cacSo || [6, 8, 10, 12, 15, 20, 30], soMac = H.soMacDinh || 10;
    var gioMoiCau = H.phutMoiCau || [1, 2];
    chenCss();
    var ov = document.createElement('div'); ov.className = 'bch-ov';
    ov.innerHTML =
      '<div class="bch">' + (opt.huongDan ? '<button class="nut xam" id="bch-hd" type="button" style="float:right;font-size:17px;padding:6px 16px;margin:0">❓ Hướng dẫn</button>' : '') + '<h2>📚 Chọn bộ câu hỏi</h2>' +
      '<label for="bch-nguon">Bộ câu hỏi</label><select id="bch-nguon"></select>' +
      '<div id="bch-san"><div class="hai"><div><label for="bch-tu">Từ bài / chủ đề</label><select id="bch-tu"></select></div>' +
      '<div><label for="bch-den">Đến bài / chủ đề</label><select id="bch-den"></select></div></div>' +
      '<p style="font-size:14px;color:#5b6b80;margin-top:6px">Muốn ôn một bài thì chỉ cần chọn "Từ bài". Muốn ôn nhiều bài thì chọn thêm "Đến bài", câu hỏi các bài sẽ gộp lại. Câu hỏi có sẵn là bản mẫu, cô nên xem lại cho khớp bài đang dạy.</p></div>' +
      '<div id="bch-khac" style="display:none">' +
      '<div class="huong"><b>CÁCH DÁN CÂU HỎI CỦA CÔ (dùng cho mọi môn, mọi lớp)</b><br>' +
      '1. Mỗi câu gồm: <b>câu hỏi</b>, rồi <b>2 đến 4 đáp án</b> bắt đầu bằng A. B. C. D.<br>' +
      '2. Báo đáp án đúng bằng một dòng <b>Đáp án: B</b> ở cuối câu, hoặc gõ dấu <b>*</b> trước đáp án đúng.<br>' +
      '3. Dán được thẳng từ Word hoặc Excel. Giữa các câu cách một dòng trống cho dễ nhìn (không bắt buộc).<br>' +
      '4. <b>Số câu:</b> mỗi câu chơi mất khoảng <b>' + gioMoiCau[0] + ' đến ' + gioMoiCau[1] + ' phút</b>. Nên dán <b>' + (nenMin === nenMax ? 'đúng ' + nenMin : nenMin + ' đến ' + nenMax) + ' câu</b> (chơi khoảng ' + khoang(nenMin * gioMoiCau[0], nenMax * gioMoiCau[1]) + '). Ít nhất ' + toiThieu + ' câu, nhiều nhất ' + toiDa + ' câu.' +
      (H.ghiChu ? '<br>5. <b>Riêng trò này:</b> ' + H.ghiChu : '') +
      '<pre>' + esc(MAU_DAN) + '</pre>' +
      '<button class="nut xam" id="bch-mau" type="button">Điền ví dụ vào ô</button><button class="nut xam" id="bch-xoa" type="button">Xóa ô</button></div>' +
      '<label for="bch-dan">Dán câu hỏi vào đây</label><textarea id="bch-dan" placeholder="Câu 1: ...&#10;A. ...&#10;B. ...&#10;C. ...&#10;Đáp án: B"></textarea></div>' +
      '<div class="hai"' + (H.anSoCau ? ' style="display:none"' : '') + '><div><label for="bch-so">' + esc(H.nhanSoCau || 'Số câu chơi') + '</label><select id="bch-so"></select></div><div></div></div>' +
      ((opt.truong && opt.truong.length) ? '<div class="hai">' + opt.truong.map(function (f) { return '<div><label for="bch-t-' + f.id + '">' + esc(f.nhan) + '</label><select id="bch-t-' + f.id + '">' + f.tuyChon.map(function (v) { return '<option value="' + v + '"' + (v === f.mac ? ' selected' : '') + '>' + v + '</option>'; }).join('') + '</select></div>'; }).join('') + '</div>' : '') +
      (opt.thoiGian ? '<div class="hai"><div><label for="bch-tg">Thời gian chơi (cô tự chọn cho hợp tiết học)</label><select id="bch-tg"><option value="0">Không giới hạn</option><option value="120">Khởi động: 2 phút</option><option value="240">Luyện tập: 4 phút</option><option value="300">Luyện tập: 5 phút</option><option value="khac">Tự nhập số phút...</option></select></div>' +
        '<div id="bch-tgx" style="display:none"><label for="bch-ph">Số phút</label><input id="bch-ph" type="number" min="1" max="60" value="3"></div></div>' : '') +
      '<div class="tt" id="bch-tt"></div><ul id="bch-loi"></ul>' +
      '<div style="margin-top:8px"><button class="nut bd" id="bch-bd" type="button">Bắt đầu chơi</button>' +
      '<button class="nut xam" id="bch-dong" type="button" style="display:none">Đóng</button></div></div>';
    document.body.appendChild(ov);
    var $ = function (s) { return ov.querySelector(s); };

    var nguon = $('#bch-nguon'), tu = $('#bch-tu'), den = $('#bch-den'), dan = $('#bch-dan'), so = $('#bch-so');
    nguon.innerHTML = KHO.map(function (m, i) { return '<option value="' + i + '">' + esc(m.mon) + '</option>'; }).join('') +
      '<option value="khac">KHÁC: dán câu hỏi của cô (mọi môn, mọi lớp)</option>';
    function dienBai() {
      var m = KHO[+nguon.value]; if (!m) return;
      var h = m.bai.map(function (b, i) { return '<option value="' + i + '">' + esc(b.ten) + '</option>'; }).join('');
      tu.innerHTML = h; den.innerHTML = h;
    }
    function layCau() {
      if (nguon.value === 'khac') return phanTich(dan.value);
      var m = KHO[+nguon.value]; if (!m) return { cau: [], loi: [] };
      var a = +tu.value, b = Math.max(a, +den.value), out = [];
      for (var i = a; i <= b; i++) if (m.bai[i]) m.bai[i].q.forEach(function (q) { out.push({ c: q.c, a: q.a.slice(), d: q.d }); });
      return { cau: out, loi: [] };
    }
    function capNhat() {
      var khac = nguon.value === 'khac';
      $('#bch-san').style.display = khac ? 'none' : ''; $('#bch-khac').style.display = khac ? '' : 'none';
      var r = layCau(), n = r.cau.length, tt = $('#bch-tt');
      // số câu chơi
      var capChon = H.chonToiDa || 1e9;
      var opts = cacSo.filter(function (x) { return x < n && x <= capChon; });
      if (n <= capChon) opts.push(n);
      var giay = giayChon(), giu = +so.value, mac = giay && !H.chonToiDa ? n : Math.min(soMac, n, capChon);   // có giới hạn giờ thì mặc định bốc hết câu
      so.innerHTML = opts.filter(function (x) { return x > 0; }).map(function (x) { return '<option value="' + x + '">' + (x === n ? 'Tất cả (' + n + ' câu)' : x + ' câu') + '</option>'; }).join('');
      so.value = (giu && opts.indexOf(giu) >= 0) ? giu : String(mac);
      var ch = +so.value || 0, kq, lop;
      if (!n) { kq = khac ? 'Chưa có câu hỏi nào. Cô dán câu hỏi vào ô bên trên.' : 'Bộ này chưa có câu hỏi.'; lop = 'loi'; }
      else if (ch < toiThieu) { kq = 'Có ' + n + ' câu, nhưng trò này cần ít nhất ' + toiThieu + ' câu' + (H.ghiChu ? ' (' + H.ghiChu + ')' : '') + '. Cô thêm câu hỏi nhé.'; lop = H.nenMin ? 'loi' : 'canh'; }
      else if (ch > toiDa) { kq = 'Chơi ' + ch + ' câu là lâu (khoảng ' + khoang(ch * gioMoiCau[0], ch * gioMoiCau[1]) + '). Nên chọn ' + nenMin + ' đến ' + nenMax + ' câu.'; lop = 'canh'; }
      else if (ch > nenMax) { kq = 'Có ' + n + ' câu, chơi ' + ch + ' câu: khoảng ' + khoang(ch * gioMoiCau[0], ch * gioMoiCau[1]) + '. Muốn gọn hơn thì chọn ' + nenMin + ' đến ' + nenMax + ' câu.'; lop = 'canh'; }
      else { kq = 'Có ' + n + ' câu, chơi ' + ch + ' câu (khoảng ' + khoang(ch * gioMoiCau[0], ch * gioMoiCau[1]) + '). Vừa đủ.'; lop = 'ok'; }
      if (khac && n > toiDa) { kq = 'Có ' + n + ' câu, nhiều hơn mức ' + toiDa + ' câu. Game vẫn chạy, nhưng cô nên chọn số câu chơi ít hơn.'; lop = 'canh'; }
      if (H.canCau && n) {
        var can = H.canCau(giaTri()); ch = Math.min(n, can);
        kq = 'Có ' + n + ' câu. Kế hoạch cô chọn cần khoảng ' + can + ' câu' + (n >= can ? '. Đủ rồi.' : ', thiếu thì game dùng lại câu hỏi.'); lop = n >= can ? 'ok' : 'canh';
      }
      if (giay && n) {
        var pp = Math.ceil(giay / 60), tg = giay % 60 ? Math.floor(giay / 60) + ' phút ' + (giay % 60) + ' giây' : (giay / 60) + ' phút';
        if (H.moTaGio) { kq = H.moTaGio(tg) + (H.canCau ? ' ' + kq : ' Có ' + n + ' câu, mỗi lượt chơi ' + ch + ' câu.'); lop = H.canCau ? lop : 'ok'; }
        else { kq = 'Giới hạn ' + tg + ': hết giờ game DỪNG NGAY. Có ' + n + ' câu, nên có khoảng ' + pp + ' đến ' + pp * 2 + ' câu (mỗi câu 30 giây đến 1 phút).'; lop = n >= pp ? 'ok' : 'canh'; }
      }
      tt.className = 'tt ' + lop; tt.textContent = (lop === 'ok' ? '✔ ' : lop === 'canh' ? '⚠ ' : '✖ ') + kq;
      $('#bch-loi').innerHTML = r.loi.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
      if (r.loi.length) tt.textContent += ' Có ' + r.loi.length + ' câu chưa đọc được, xem bên dưới.';
      $('#bch-bd').disabled = !n || (H.nenMin && ch < toiThieu);
    }
    function giaTri() {
      var o = {}; (opt.truong || []).forEach(function (f) { o[f.id] = +$('#bch-t-' + f.id).value; }); return o;
    }
    function giayChon() {
      if (!opt.thoiGian) return 0;
      var v = $('#bch-tg').value;
      if (v === 'khac') return Math.max(1, Math.min(60, +$('#bch-ph').value || 0)) * 60;
      return +v || 0;
    }
    function nho() { ghi({ nguon: nguon.value, tu: tu.value, den: den.value, dan: dan.value, tg: opt.thoiGian ? $('#bch-tg').value : '', ph: opt.thoiGian ? $('#bch-ph').value : '', tr: giaTri() }); }

    nguon.onchange = function () { dienBai(); capNhat(); nho(); };
    tu.onchange = function () { den.value = tu.value; capNhat(); nho(); };
    den.onchange = function () { capNhat(); nho(); };
    dan.oninput = function () { capNhat(); nho(); };
    so.onchange = capNhat;
    (opt.truong || []).forEach(function (f) { $('#bch-t-' + f.id).onchange = function () { capNhat(); nho(); }; });
    if (opt.thoiGian) {
      $('#bch-tg').onchange = function () { $('#bch-tgx').style.display = this.value === 'khac' ? '' : 'none'; capNhat(); nho(); };
      $('#bch-ph').oninput = function () { capNhat(); nho(); };
    }
    $('#bch-mau').onclick = function () { dan.value = MAU_DAN; capNhat(); nho(); };
    $('#bch-xoa').onclick = function () { dan.value = ''; capNhat(); nho(); };
    $('#bch-dong').onclick = function () { ov.remove(); };
    if (opt.huongDan) $('#bch-hd').onclick = function () { huongDan(opt.huongDan); };

    // khôi phục lựa chọn lần trước
    if (luu.nguon != null && nguon.querySelector('option[value="' + luu.nguon + '"]')) nguon.value = luu.nguon;
    dienBai();
    if (luu.tu != null && nguon.value !== 'khac') { tu.value = luu.tu; den.value = luu.den != null ? luu.den : luu.tu; }
    if (luu.dan) dan.value = luu.dan;
    if (opt.thoiGian && luu.tg != null && luu.tg !== '') { $('#bch-tg').value = luu.tg; if (luu.ph) $('#bch-ph').value = luu.ph; $('#bch-tgx').style.display = $('#bch-tg').value === 'khac' ? '' : 'none'; }
    if (luu.tr) (opt.truong || []).forEach(function (f) { if (luu.tr[f.id] != null && $('#bch-t-' + f.id).querySelector('option[value="' + luu.tr[f.id] + '"]')) $('#bch-t-' + f.id).value = luu.tr[f.id]; });
    capNhat();
    if (opt && opt.coThoat) $('#bch-dong').style.display = '';

    $('#bch-bd').onclick = function () {
      var r = layCau(); if (!r.cau.length) return;
      var ch = Math.min(+so.value || r.cau.length, r.cau.length);
      var ten = nguon.value === 'khac' ? 'Bộ câu hỏi của cô' : KHO[+nguon.value].mon;
      var dsAll = H.giuThuTu && nguon.value === 'khac' ? r.cau : tron(r.cau);
      var canN = H.canCau ? Math.min(r.cau.length, H.canCau(giaTri())) : ch;
      var ds = opt.traHetCau ? dsAll : dsAll.slice(0, H.canCau ? canN : ch);
      ov.remove(); nho();
      opt.khiChon(ds, ten, giayChon(), H.canCau ? canN : ch, giaTri());
    };
    return ov;
  }

  window.BoCauHoi = { ctx: ctx, taoWav: taoWav, trangThaiAm: function () { return { ctx: AC ? AC.state : 'chưa tạo', khoa: ACLOCK, phien: (navigator.audioSession ? navigator.audioSession.type : 'không hỗ trợ') }; }, mo: mo, huongDan: huongDan, HD: HD, gio: G, phanTich: phanTich, NEN_MIN: NEN_MIN, NEN_MAX: NEN_MAX, TOI_THIEU: TOI_THIEU, TOI_DA: TOI_DA };
})();
