import { Card, Steps } from "antd";

export default function RegistrationPeriodTimeline({ period }) {
  if (!period) return null;
  const today = new Date();
  const milestones = [
    { label: "Bắt đầu", date: new Date(period.startDate) },
    { label: "Kết thúc đăng ký", date: new Date(period.endDate) },
    { label: "Hạn kiểm duyệt", date: new Date(period.reviewDeadline) },
    { label: "Hạn nộp hồ sơ", date: new Date(period.submitDeadline) },
    { label: "Hạn thẩm định", date: new Date(period.appraiseDeadline) },
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Check if registration period hasn't started yet
  const startDate = new Date(period.startDate);
  const isBeforeStart = today < startDate;
  const daysUntilStart = isBeforeStart
    ? Math.ceil((startDate - today) / (1000 * 60 * 60 * 24))
    : 0;

  let current = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (today >= milestones[i].date) current = i;
  }

  let nextMilestone = null;
  for (let i = 0; i < milestones.length; i++) {
    if (today < milestones[i].date) {
      nextMilestone = milestones[i];
      break;
    }
  }
  let daysLeft = null;
  if (nextMilestone) {
    const msPerDay = 1000 * 60 * 60 * 24;
    daysLeft = Math.ceil((nextMilestone.date - today) / msPerDay);
  }

  return (
    <Card
      type="inner"
      className="mb-4 bg-gray-50 border border-gray-200 shadow-none"
    >
      <div className="px-2 py-2">
        {isBeforeStart ? (
          <div className="text-center">
            <div className="mb-2 font-medium text-red-600">
              Đợt đăng ký này chưa mở
            </div>
            <div className="text-blue-600">
              Còn {daysUntilStart} ngày nữa đợt đăng ký sẽ mở (
              {formatDate(startDate)})
            </div>
          </div>
        ) : (
          <>
            <Steps
              status="process"
              current={current}
              labelPlacement="vertical"
              size="small"
              items={milestones.map((m) => ({
                title: m.label,
                description: formatDate(m.date),
              }))}
            />
            <div className="mt-2 font-medium text-center text-blue-600">
              Hôm nay: {formatDate(today)}
            </div>
            <div className="mt-1 text-xs text-center text-gray-500">
              {nextMilestone
                ? `Còn ${daysLeft} ngày đến ${nextMilestone.label} (${formatDate(nextMilestone.date)})`
                : "Đã qua tất cả các mốc thời gian"}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
