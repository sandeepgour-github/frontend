const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "admin-login.html";
}
function loadAllStudents() {
  fetch("http://localhost:8081/api/students/search", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(error.message || "Failed to load students");
        });
      }
      return res.json();
    })
    .then((students) => {
      const tbody = document.getElementById("studentTableBody");
      tbody.innerHTML = ""; // ✅ Clear old rows

      students.forEach((student) => {
        const row = `
          <tr>
            <td>${student.studentId}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.mobileNumber}</td>
            <td>${student.feePlan}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch((err) => {
      Swal.fire("Error", err.message, "error");
      console.error("Failed to load student list", err);
    });
}

// ✅ Call function on page load
window.addEventListener("DOMContentLoaded", loadAllStudents);
