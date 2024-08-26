import { Card } from "./Card";
export const Features = () => {
  const studentFeatures = [
    "Class Schedule",
    "Upload Assignment",
    "Module Resources",
    "Performance Report",
  ];
  const teacherFeatures = [
    "Class Schedule",
    "Upload Resources",
    "Assign Task",
    "View Student Report",
  ];
  const adminFeatures = [
    "Provide Course",
    "Feedback From",
    "Notice Update",
    "Make Student Report",
  ];

  return (
    <>
      <section className="bg-gray-800 py-[126px]">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="tracking-tight text-slate-300 text-[36px] font-extrabold tracking-tigh mb-10">
            Features of <span className="text-green-400"> myClassroom</span>
          </h1>
        </div>
        <div className="feature-grid grid grid-cols-3 gap-4 max-w-screen-xl mx-auto">
          {/* for card portion */}
          <Card cardTitle="Student Feature" actions={studentFeatures} />
          <Card cardTitle="Teacher Feature" actions={teacherFeatures} />
          <Card cardTitle="Admin Feature" actions={adminFeatures} />
        </div>
      </section>
    </>
  );
};
