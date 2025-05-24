import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json({ message: "Thiếu sectionId" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(sectionId)) {
      return NextResponse.json(
        { message: "Section id không hợp lệ" },
        { status: 400 }
      );
    }

    await mongooseConnect();
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi kết nối với cơ sở dữ liệu" },
      { status: 500 }
    );
  }
}
