import { storage } from "@/lib/firebase";
import { TopicFile } from "@/models/TopicFile";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { filePath } = await request.json();
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    await TopicFile.findOneAndDelete({ fileUrl: filePath });

    return NextResponse.json({ message: "Xóa file thành công." });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa file " + error },
      { status: 500 }
    );
  }
}
