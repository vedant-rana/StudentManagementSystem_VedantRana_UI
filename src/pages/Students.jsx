import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";
import { getClasses } from "../services/classService";

const PAGE_SIZE = 10;

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formError, setFormError] = useState("");

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getStudents({
        search,
        sortField,
        sortOrder,
        page,
        pageSize: PAGE_SIZE,
      });

      // Support both paginated { items, totalPages } and plain array responses
      if (Array.isArray(data)) {
        setStudents(data);
        setTotalPages(1);
      } else {
        setStudents(data.items || data.students || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, sortField, sortOrder, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    getClasses()
      .then((data) => {
        setClasses(data.data);
      })
      .catch(() => setClasses([]));
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleAddClick = () => {
    setEditingStudent(null);
    setFormError("");
    setShowForm(true);
  };

  const handleEditClick = async (id) => {
    setFormError("");
    setLoading(true);

    try {
      const response = await getStudentById(id);
      // support wrappers (axios) that return data prop
      const student = response?.data ?? response;
      setEditingStudent(student);
      setShowForm(true);
    } catch {
      setError("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch {
      setError("Failed to delete student.");
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormError("");
    try {
      const payload = {
        ...formData,
        ClassIds: (formData.ClassIds || []).map(Number),
      };
      if (editingStudent) {
        await updateStudent(editingStudent.id, payload);
      } else {
        await createStudent(payload);
      }
      setShowForm(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to save student.";
      setFormError(typeof msg === "string" ? msg : "Failed to save student.");
      throw err; // keep form in submitting=false state via react-hook-form
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    setFormError("");
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Students</h1>
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Add Student
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
              {formError && (
                <div className="alert alert-error">{formError}</div>
              )}
              <StudentForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                initialData={editingStudent}
                classes={classes}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search students..."
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleSearchClear}
            >
              Clear
            </button>
          )}
        </form>

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <>
            <StudentTable
              students={students}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Students;
