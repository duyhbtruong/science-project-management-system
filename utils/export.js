import ExcelJS from "exceljs";

export const exportTopicList = (topics, students) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`DANH_SACH_DE_TAI`);

  // Merge cells and set values
  worksheet.mergeCells("B1:D1");
  worksheet.getCell("B1").value = "TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN";
  worksheet.getCell("B1").font = { name: "Times New Roman", size: 13 };
  worksheet.getCell("B1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells("B2:D2");
  worksheet.getCell("B2").value = "PHÒNG KHOA HỌC CÔNG NGHỆ";
  worksheet.getCell("B2").font = {
    name: "Times New Roman",
    size: 13,
    bold: true,
  };
  worksheet.getCell("B2").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells("B4:D4");
  worksheet.getCell("B4").value = "DANH SÁCH ĐỀ TÀI NCKH SINH VIÊN";
  worksheet.getCell("B4").font = {
    name: "Times New Roman",
    size: 13,
    bold: true,
  };
  worksheet.getCell("B4").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  // Add an empty row
  worksheet.addRow([]);

  // Add the table headers
  const headers = [
    "TT",
    "Họ và Tên SV CNĐT",
    "MSSV (CNĐT)",
    "Họ và Tên SV tham gia (nếu có)",
    "Khoa",
    "GVHD",
    "Tên đề tài",
    "Đợt",
    "Đăng ký thực hiện (đánh dấu X- do Trưởng khoa xác nhận thực hiện)",
    "Mã đề tài",
    "Ngày bắt đầu",
    "Ngày kết thúc",
    "QĐ gia hạn (nếu có)",
    "Điểm nghiệm thu",
    "Dự thi các cấp",
  ];

  // Set column widths
  worksheet.getColumn("A").width = 4; // Adjust these values as needed - STT
  worksheet.getColumn("B").width = 25; // Họ và Tên SV CNĐT
  worksheet.getColumn("C").width = 11; // MSSV (CNĐT)
  worksheet.getColumn("D").width = 15; // Họ và Tên SV tham gia (nếu có)
  worksheet.getColumn("E").width = 14; // Khoa
  worksheet.getColumn("F").width = 26; // GVHD
  worksheet.getColumn("G").width = 38; // Tên đề tài
  worksheet.getColumn("H").width = 12; // Đợt
  worksheet.getColumn("I").width = 12; // Đăng ký thực hiện (đánh dấu X- do Trưởng khoa xác nhận thực hiện)
  worksheet.getColumn("J").width = 12; // Mã đề tài
  worksheet.getColumn("K").width = 12; // Ngày bắt đầu
  worksheet.getColumn("L").width = 12; // Ngày kết thúc
  worksheet.getColumn("M").width = 12; // QĐ gia hạn (nếu có)
  worksheet.getColumn("N").width = 12; // Điểm nghiệm thu
  worksheet.getColumn("O").width = 12; // Dự thi các cấp
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Times New Roman",
      size: 12,
      bold: true,
    };
    cell.border = {
      top: { style: "thin", color: { auto: 1 } },
      left: { style: "thin", color: { auto: 1 } },
      bottom: { style: "thin", color: { auto: 1 } },
      right: { style: "thin", color: { auto: 1 } },
    };
    cell.alignment = {
      vertical: "top",
      horizontal: "center",
      wrapText: true,
    };
  });

  // Add the data
  let rowNumber = 1;
  const numRow = worksheet.addRow([
    "(1)",
    "(2)",
    "(3)",
    "(4)",
    "(5)",
    "(6)",
    "(7)",
    "(8)",
    "(9)",
    "(10)",
    "(11)",
    "(12)",
    "(13)",
    "(14)",
    "(15)",
  ]);
  numRow.eachCell((cell, colNumber) => {
    cell.font = { name: "Times New Roman", size: 12, italic: true };
    cell.border = {
      top: { style: "thin", color: { auto: 1 } },
      left: { style: "thin", color: { auto: 1 } },
      bottom: { style: "thin", color: { auto: 1 } },
      right: { style: "thin", color: { auto: 1 } },
    };
    // Align content to the middle for specific columns
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });
  for (let i = 0; i < topics.length; i++) {
    const dataRow = worksheet.addRow([
      rowNumber++,
      students[i].accountId.name.toUpperCase(),
      students[i].studentId,
      "",
      students[i].faculty.toUpperCase(),
      topics[i].instructor.accountId.name.toUpperCase(),
      topics[i].vietnameseName.toUpperCase(),
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
    dataRow.eachCell((cell, colNumber) => {
      cell.font = { name: "Times New Roman", size: 12 };
      cell.border = {
        top: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } },
      };
      // Align content to the middle for specific columns
      cell.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
    });
  }

  // Save the workbook
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const fileName = `DANH_SACH_DE_TAI.xlsx`;
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
};

export const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
