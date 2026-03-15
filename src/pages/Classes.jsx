import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import ClassTable from "../components/ClassTable";
import { getClasses } from "../services/classService";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await getClasses();
        setClasses(
          Array.isArray(data) ? data : data.items || data.classes || [],
        );
      } catch {
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Classes</h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading">Loading classes...</div>
        ) : (
          <ClassTable classes={classes} />
        )}
      </div>
    </Layout>
  );
}

export default Classes;
