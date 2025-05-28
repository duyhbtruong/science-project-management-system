import { forwardRef } from "react";
import parse from "html-react-parser";

export const ReportPdfTemplate = forwardRef(
  ({ owner, instructor, topic, sections }, ref) => {
    const renderParticipants = () => (
      <table className="w-full my-3 text-sm border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="p-2 font-bold text-center bg-gray-100 border border-gray-800">
              TT
            </th>
            <th className="p-2 font-bold text-center bg-gray-100 border border-gray-800">
              Họ và tên, MSSV
            </th>
            <th className="p-2 font-bold text-center bg-gray-100 border border-gray-800">
              Chịu trách nhiệm
            </th>
            <th className="p-2 font-bold text-center bg-gray-100 border border-gray-800">
              Điện thoại
            </th>
            <th className="p-2 font-bold text-center bg-gray-100 border border-gray-800">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 text-center border border-gray-800">1</td>
            <td className="p-2 text-center border border-gray-800">
              {owner?.accountId?.name}, {owner?.studentId}
            </td>
            <td className="p-2 text-center border border-gray-800">
              Chủ nhiệm đề tài
            </td>
            <td className="p-2 text-center border border-gray-800">
              {owner?.accountId?.phone}
            </td>
            <td className="p-2 text-center border border-gray-800">
              {owner?.accountId?.email}
            </td>
          </tr>
          {topic?.participants?.map((mem, idx) => (
            <tr key={`participant-${idx}`}>
              <td className="p-2 text-center border border-gray-800">
                {idx + 2}
              </td>
              <td className="p-2 text-center border border-gray-800">{mem}</td>
              <td className="p-2 text-center border border-gray-800">
                Thành viên
              </td>
              <td className="p-2 text-center border border-gray-800">
                Không có
              </td>
              <td className="p-2 text-center border border-gray-800">
                Không có
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    return (
      <div
        ref={ref}
        className="w-[210mm] bg-white text-gray-800 font-['Times_New_Roman',_Times,_serif]"
        id="report-pdf-template"
      >
        <div className="p-10 flex flex-col min-h-[277mm]">
          <div className="flex-grow">
            <div className="mb-6 text-center">
              <div className="text-lg font-normal">
                ĐẠI HỌC QUỐC GIA TP. HCM
              </div>
              <div className="text-lg font-bold">
                TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN
              </div>
              <div className="flex justify-center my-10">
                <img src="/logo-uit.jpg" alt="UIT Logo" width={150} />
              </div>
              <div className="mb-2 text-xl font-bold">BÁO CÁO TỔNG KẾT</div>
              <div className="mb-6 text-base">
                ĐỀ TÀI KHOA HỌC VÀ CÔNG NGHỆ SINH VIÊN NĂM 2025
              </div>
            </div>
            <div className="mb-6">
              <div>
                <span>Tên đề tài tiếng Việt:</span>
              </div>
              <div className="mb-2 text-lg italic font-bold text-center">
                {topic?.vietnameseName || "..."}
              </div>
              <div>
                <span>Tên đề tài tiếng Anh:</span>
              </div>
              <div className="mb-2 text-lg italic font-bold text-center">
                {topic?.englishName || "..."}
              </div>
              <div>
                <div>Khoa/Bộ môn: {owner?.faculty}</div>
                <div>Thời gian thực hiện: 6 tháng</div>
                <div>
                  Cán bộ hướng dẫn: {instructor.academicRank}.{" "}
                  {instructor?.accountId?.name}
                </div>
              </div>
            </div>
            <div>
              <b>Tham gia thực hiện</b>
              {renderParticipants()}
            </div>
          </div>
          <div className="mt-auto text-base font-bold text-center">
            Thành phố Hồ Chí Minh - Tháng {new Date().getMonth() + 1} / 2025
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between p-10">
            <div className="flex items-start gap-4">
              <img src="/logo-uit.jpg" alt="Logo" className="w-20 h-20" />
              <div className="text-center">
                <p className="m-0 font-bold uppercase">
                  Đại Học Quốc Gia TP. HCM
                </p>
                <p className="m-0 uppercase">
                  Trường Đại Học Công Nghệ Thông Tin
                </p>
              </div>
            </div>

            <table className="text-sm text-left border-collapse">
              <tbody>
                <tr>
                  <td className="p-2 font-semibold border border-black border-dashed">
                    Ngày nhận hồ sơ
                  </td>
                  <td className="border border-dashed border-black p-2 w-[130px]"></td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold border border-black border-dashed">
                    Mã số đề tài
                  </td>
                  <td className="p-2 border border-black border-dashed"></td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    className="italic font-bold text-center border border-black border-dashed"
                  >
                    (Do CQ quản lý ghi)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-6 text-xl font-bold text-center">
            BÁO CÁO TỔNG KẾT
          </div>
          <div className="mb-4 ml-10">
            <div>
              <span>Tên đề tài tiếng Việt:</span>
            </div>
            <div className="mb-2 italic font-bold text-center">
              {topic?.vietnameseName || "..."}
            </div>
            <div>
              <span>Tên đề tài tiếng Anh:</span>
            </div>
            <div className="mb-2 italic font-bold text-center">
              {topic?.englishName || "..."}
            </div>
          </div>
          <div className="flex justify-between mt-30">
            <div className="text-center w-[45%]">
              Ngày ... tháng ... năm ...
              <br />
              <b>Cán bộ hướng dẫn</b>
              <br />
              <i>(Họ tên và chữ ký)</i>
            </div>
            <div className="text-center w-[45%]">
              Ngày ... tháng ... năm ...
              <br />
              <b>Sinh viên chủ nhiệm đề tài</b>
              <br />
              <i>(Họ tên và chữ ký)</i>
            </div>
          </div>
        </div>

        <div className="break-before-page p-10 min-h-[297mm]">
          <div className="mb-6 text-lg font-bold text-center">
            THÔNG TIN KẾT QUẢ NGHIÊN CỨU
          </div>
          {sections.map((sec, idx) => (
            <div key={sec._id} className="mb-6">
              <div className="mb-2 text-base font-bold">
                {idx + 1}. {sec.templateId?.title}
              </div>
              <div className="text-sm tiptap">{parse(sec.content)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
