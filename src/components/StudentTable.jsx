function StudentTable({
  students,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortOrder,
}) {
  const renderSortIcon = (field) => {
    if (sortField !== field) return <span className="sort-icon">⇅</span>;
    return sortOrder === "asc" ? (
      <span className="sort-icon active">↑</span>
    ) : (
      <span className="sort-icon active">↓</span>
    );
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => onSort("firstName")} className="sortable">
              First Name {renderSortIcon("firstName")}
            </th>
            <th onClick={() => onSort("lastName")} className="sortable">
              Last Name {renderSortIcon("lastName")}
            </th>
            <th onClick={() => onSort("phoneNumber")} className="sortable">
              Phone Number {renderSortIcon("phoneNumber")}
            </th>
            <th onClick={() => onSort("emailId")} className="sortable">
              Email {renderSortIcon("emailId")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="no-data">
                No students found.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.emailId}</td>
                <td className="actions-cell">
                  <button
                    className="btn btn-sm btn-edit"
                    onClick={() => onEdit(student.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-delete"
                    onClick={() => onDelete(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
