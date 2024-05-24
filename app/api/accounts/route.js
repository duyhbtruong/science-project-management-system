import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Appraise } from "@/models/Appraise";
import { Instructor } from "@/models/Instructor";
import { Student } from "@/models/Student";
import { Training } from "@/models/Training";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();
  return NextResponse.json(await Account.find());
}

export async function DELETE(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  const { role } = await Account.findOne({ _id: id }, { _id: 0, role: 1 });

  if (role === "student") {
    const studentId = await Student.findOne({ accountId: id }, { _id: 1 });
    await Account.findByIdAndDelete(id);
    await Student.findByIdAndDelete(studentId);
  }

  if (role === "instructor") {
    const instructorId = await Instructor.findOne(
      { accountId: id },
      { _id: 1 }
    );
    await Account.findByIdAndDelete(id);
    await Instructor.findByIdAndDelete(instructorId);
  }

  if (role === "training") {
    const trainingId = await Training.findOne(
      {
        accountId: id,
      },
      { _id: 1 }
    );
    await Account.findByIdAndDelete(id);
    await Training.findByIdAndDelete(trainingId);
  }

  if (role === "appraise") {
    const appraiseId = await Appraise.findOne({ accountId: id }, { _id: 1 });
    await Account.findByIdAndDelete(id);
    await Appraise.findByIdAndDelete(appraiseId);
  }

  return NextResponse.json({ message: "Account deleted!" }, { status: 200 });
}
