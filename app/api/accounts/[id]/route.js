import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Instructor } from "@/models/Instructor";
import { Student } from "@/models/Student";
import { Training } from "@/models/Training";
import { Appraise } from "@/models/Appraise";
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

  if (account.role === "training") {
    const training = await Training.findOne({ accountId: id });
    return NextResponse.json({ account, training }, { status: 200 });
  }

  if (account.role === "appraise") {
    const appraise = await Appraise.findOne({ accountId: id });
    return NextResponse.json({ account, appraise }, { status: 200 });
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

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already in use!" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = await Account.findOne({ _id: id }, { role: 1 });
  if (role === "student") {
    const { studentId, faculty, educationProgram } = await request.json();
    if (await Student.findOne({ studentId })) {
      return NextResponse.json(
        { message: "Student ID already exists!" },
        { status: 409 }
      );
    }

    const sId = await Student.findOne({ accountId: id }, { _id: 1 });
    await Student.findByIdAndUpdate(sId, {
      studentId,
      faculty,
      educationProgram,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "instructor") {
    const { instructorId, faculty, academicRank } = await request.json();
    if (await Instructor.findOne({ instructorId })) {
      return NextResponse.json(
        { message: "Instructor ID already exists!" },
        { status: 409 }
      );
    }

    const iId = await Instructor.findOne({ accountId: id }, { _id: 1 });
    await Instructor.findByIdAndUpdate(iId, {
      instructorId,
      faculty,
      academicRank,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "training") {
    const { trainingId } = await request.json();
    if (await Training.findOne({ trainingId })) {
      return NextResponse.json(
        { message: "Training ID already exists!" },
        { status: 409 }
      );
    }

    const tId = await Training.findOne({ accountId: id }, { _id: 1 });
    await Training.findByIdAndUpdate(tId, {
      trainingId,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "appraise") {
    const { appraiseId } = await request.json();
    if (await Appraise.findOne({ appraiseId })) {
      return NextResponse.json(
        { message: "Appraise ID already exists!" },
        { status: 409 }
      );
    }

    const aId = await Appraise.findOne({ accountId: id }, { _id: 1 });
    await Appraise.findByIdAndUpdate(aId, {
      appraiseId,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  return NextResponse.json({ message: "Account updated!" }, { status: 200 });
}
