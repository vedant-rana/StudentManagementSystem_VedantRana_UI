function ClassTable({ classes }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan={2} className="no-data">
                No classes found.
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.description || <span className="muted">—</span>}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClassTable;
