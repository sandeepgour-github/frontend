const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "admin-login.html";
}
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const student = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      mobileNumber: document.getElementById("mobileNumber").value.trim(),
      admissionDate: document.getElementById("admissionDate").value,
      feePlan: document.getElementById("feePlan").value,
      totalFee: parseFloat(document.getElementById("totalFee").value),
    };

    fetch("https://schoolfeemanagementapp-production.up.railway.app/api/students/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(student),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errors) => {
            // Validation error
            let message = "";
            for (const field in errors) {
              message += `• ${field}: ${errors[field]}\n`;
            }
            throw new Error(message);
          });
        }
        return res.json();
      })
      .then((data) => {
        Swal.fire(
          "Success",
          "Student Registered with ID: " + data.studentId,
          "success"
        ).then(() => {
          window.location.href = "student-search.html";
        });
        document.getElementById("registerForm").reset();
      })
      .catch((err) => {
        Swal.fire("Validation Error", err.message, "warning");
      });
  });
