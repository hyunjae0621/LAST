// frontend/src/components/dashboard/ClassList.js

export default function ClassList({ classes }) {
  if (classes.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg">
        <p className="text-gray-500">오늘은 예정된 수업이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {classes.map((classItem) => (
        <li key={classItem.id} className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{classItem.name}</p>
              <p className="text-sm text-gray-500">
                {classItem.time} | 강사: {classItem.instructor}
              </p>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium
                  ${parseInt(classItem.attendees.split('/')[0]) >= parseInt(classItem.attendees.split('/')[1])
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                  }`}
              >
                {classItem.attendees}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}