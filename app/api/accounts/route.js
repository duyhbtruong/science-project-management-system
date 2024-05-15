import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Instructor } from "@/models/Instructor";
import { Student } from "@/models/Student";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

export async function GET(request) {
  await mongooseConnect();
  return NextResponse.json(await Account.find());
}

// export async function POST(request) {
//   await mongooseConnect();
//   const { name, email, phone, password, role } = await request.json();
//   if (await Account.findOne({ email })) {
//     return NextResponse.json(
//       { message: "Email already in use!" },
//       { status: 409 }
//     );
//   } else {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await Account.create({
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       role,
//     });
//     const createdAccountId = await Account.findOne(
//       { email: email },
//       { _id: 1 }
//     );

//     return NextResponse.json(createdAccountId, { status: 201 });
//   }
// }

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

  return NextResponse.json({ message: "Account deleted!" }, { status: 200 });
}
