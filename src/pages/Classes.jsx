import { useState, useEffect, useCallback, useRef } from "react";
import Layout from "../components/Layout";
import ClassTable from "../components/ClassTable";
import { getClasses, importClasses } from "../services/classService";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");

  const fileInputRef = useRef(null);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getClasses();
      const items = Array.isArray(data)
        ? data
        : data.items || data.classes || data.data || [];
      setClasses(items);
    } catch {
      setError("Failed to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleImportClick = () => {
    setImportError("");
    setImportMessage("");
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    setImportError("");
    setImportMessage("");

    if (!file) return;

    const isCsv = file.name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      setImportError("Please select a .csv file.");
      resetFileInput();
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImportError("File is too large. Max size is 5 MB.");
      resetFileInput();
      return;
    }

    setImporting(true);
    try {
      const result = await importClasses(file);
      if (result?.success) {
        const inserted = result.data?.inserted ?? 0;
        const duplicates = result.data?.duplicates ?? 0;
        setImportMessage(
          `${inserted} classes imported successfully. ${duplicates} duplicates skipped.`,
        );
        await fetchClasses();
      } else {
        const message =
          result?.message ||
          (Array.isArray(result?.errors) ? result.errors.join(" \n") : null) ||
          "Import failed.";
        setImportError(message);
      }
    } catch (err) {
      setImportError(
        err?.response?.data?.message ||
          "Failed to import classes. Please try again.",
      );
    } finally {
      setImporting(false);
      resetFileInput();
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="page-header">
          <h1>Classes</h1>
          <button
            className="btn btn-primary"
            onClick={handleImportClick}
            disabled={importing}
          >
            {importing ? "Importing..." : "Import CSV"}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {importMessage && (
          <div className="alert alert-success">{importMessage}</div>
        )}
        {importError && <div className="alert alert-error">{importError}</div>}

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
