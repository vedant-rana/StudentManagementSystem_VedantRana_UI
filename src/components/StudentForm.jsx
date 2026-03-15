import { useEffect } from "react";
import { useForm } from "react-hook-form";

function StudentForm({ onSubmit, onCancel, initialData, classes }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      PhoneNumber: "",
      EmailId: "",
      ClassIds: [],
    },
  });

  const selectedClassIds = watch("ClassIds") || [];

  useEffect(() => {
    if (initialData) {
      const classIdsFromData =
        initialData.classIds ||
        (initialData.classes ? initialData.classes.map((c) => c.id) : []);

      reset({
        FirstName: initialData.firstName || "",
        LastName: initialData.lastName || "",
        PhoneNumber: initialData.phoneNumber || "",
        EmailId: initialData.emailId || "",
        ClassIds: classIdsFromData,
      });
    } else {
      reset({
        FirstName: "",
        LastName: "",
        PhoneNumber: "",
        EmailId: "",
        ClassIds: [],
      });
    }
  }, [initialData, reset]);

  const handleClassToggle = (classId) => {
    const id = String(classId);
    const current = selectedClassIds.map(String);
    if (current.includes(id)) {
      setValue(
        "ClassIds",
        current.filter((c) => c !== id),
      );
    } else {
      setValue("ClassIds", [...current, id]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="student-form" noValidate>
      <div className="form-group">
        <label>First Name</label>
        <input
          {...register("FirstName", { required: "First name is required" })}
          className={errors.FirstName ? "input-error" : ""}
          placeholder="First Name"
        />
        {errors.FirstName && (
          <span className="error-msg">{errors.FirstName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          {...register("LastName", { required: "Last name is required" })}
          className={errors.LastName ? "input-error" : ""}
          placeholder="Last Name"
        />
        {errors.LastName && (
          <span className="error-msg">{errors.LastName.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          {...register("PhoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9+\-\s()]{7,15}$/,
              message: "Enter a valid phone number",
            },
          })}
          className={errors.PhoneNumber ? "input-error" : ""}
          placeholder="Phone Number"
        />
        {errors.PhoneNumber && (
          <span className="error-msg">{errors.PhoneNumber.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          {...register("EmailId", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          className={errors.EmailId ? "input-error" : ""}
          placeholder="Email"
        />
        {errors.EmailId && (
          <span className="error-msg">{errors.EmailId.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Classes</label>
        <div className="class-checkboxes">
          {classes && classes.length > 0 ? (
            classes.map((cls) => (
              <label key={cls.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedClassIds
                    .map(String)
                    .includes(String(cls.id))}
                  onChange={() => handleClassToggle(cls.id)}
                />
                {cls.name}
              </label>
            ))
          ) : (
            <span className="no-data">No classes available</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
