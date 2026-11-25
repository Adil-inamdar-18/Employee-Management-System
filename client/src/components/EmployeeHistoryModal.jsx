import React from "react";

const EmployeeHistoryModal = ({ open, onClose, history, employee }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {employee?.firstName} {employee?.lastName} Login History
          </h2>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
            No login history found
          </div>
        ) : (
          <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-left">Time</th>

                  <th className="p-4 text-left">IP Address</th>

                  <th className="p-4 text-left">Device</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "Login"
                            ? "bg-green-100 text-green-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(
                        item.loginTime || item.logoutTime,
                      ).toLocaleString()}
                    </td>

                    {/* IP */}
                    <td className="p-4 text-sm text-slate-600">
                      {item.ipAddress || "N/A"}
                    </td>

                    {/* Device */}
                    <td className="max-w-xs truncate p-4 text-sm text-slate-600">
                      {item.device || "Unknown Device"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHistoryModal;
