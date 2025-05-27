import { auth } from "@/auth";
import { Report } from "@/models/Report";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = session.user;
  const { room } = await request.json();

  const report = await Report.findOne({ _id: room }).populate({
    path: "topicId",
    select: "owner instructor",
    populate: {
      path: "instructor owner",
      select: "accountId",
    },
  });
  if (!report) {
    return new Response("Report not found", { status: 404 });
  }

  const isOwner = report.topicId.owner.accountId.equals(user.id);
  const isInstructor = report.topicId.instructor.accountId.equals(user.id);

  console.log("IS OWNER: ", isOwner);
  console.log("IS INSTRUCTOR: ", isInstructor);

  if (!isOwner && !isInstructor) {
    return new Response("Unauthorized", { status: 401 });
  }

  const name = user.name ?? user.email ?? "Anonymous";
  const nameToNumber = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = Math.abs(nameToNumber) % 360;
  const color = `hsl(${hue}, 80%, 60%)`;

  const authSession = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      color,
    },
  });
  authSession.allow(room, authSession.FULL_ACCESS);
  const { body, status } = await authSession.authorize();

  return new Response(body, { status });
}
