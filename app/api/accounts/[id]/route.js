import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Instructor } from "@/models/Instructor";
import { Student } from "@/models/Student";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  await mongooseConnect();
  const { id } = params;
  const account = await Account.findOne({ _id: id });

  if (account.role === "student") {
    const student = await Student.findOne({ accountId: id });
    return NextResponse.json({ account, student }, { status: 200 });
  }

  if (account.role === "instructor") {
    const instructor = await Instructor.findOne({ accountId: id });
    return NextResponse.json({ account, instructor }, { status: 200 });
  }
}

export async function PUT(request, { params }) {
  await mongooseConnect();
  const { id } = params;
  const {
    name: name,
    email: email,
    phone: phone,
    password: password,
  } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  await Account.findByIdAndUpdate(id, {
    name,
    email,
    phone,
    password: hashedPassword,
  });

  const role = await Account.findOne({ _id: id }, { role: 1 });
  if (role === "student") {
    const sId = await Student.findOne({ accountId: id }, { _id: 1 });
    const { studentId, faculty, educationProgram } = await request.json();
    await Student.findByIdAndUpdate(sId, {
      studentId,
      faculty,
      educationProgram,
    });
  }

  if (role === "instructor") {
    const iId = await Instructor.findOne({ accountId: id }, { _id: 1 });
    const { instructorId, faculty, academicRank } = await request.json();
    await Instructor.findByIdAndUpdate(iId, {
      instructorId,
      faculty,
      academicRank,
    });
  }

  return NextResponse.json({ message: "Account updated!" }, { status: 200 });
}
