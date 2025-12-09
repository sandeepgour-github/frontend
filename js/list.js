const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "admin-login.html";
}

//Load all students but show only ACTIVE
function loadAllStudents() {
  fetch("http://localhost:8082/api/students/search", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(error.message || "No student record");
        });
      }
      return res.json();
    })
    .then((students) => {
      const tbody = document.getElementById("studentTableBody");
      tbody.innerHTML = "";

      students
        .filter((student) => student.status === "ACTIVE")
        .forEach((student) => {
          const row = document.createElement("tr");
          row.setAttribute("id", `student-${student.studentId}`);
          row.innerHTML = `
            <td>${student.studentId}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.mobileNumber}</td>
            <td>${student.feePlan}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.studentId}')">
                Delete
              </button>
            </td>
          `;
          tbody.appendChild(row);
        });
    })
    .catch((err) => {
      Swal.fire("Error", err.message, "error");
      console.error("Failed to load student list", err);
    });
}

//Delete student → backend sets status=DELETED → remove row instantly
function deleteStudent(studentId) {
  Swal.fire({
    title: "Are you sure?",
    text: "This will delete the student record!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8082/api/students/delete/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");

          //Instantly remove row from table
          const row = document.getElementById(`student-${studentId}`);
          if (row) row.remove();

          Swal.fire("Deleted!", "Student has been deleted.", "success");
        })
        .catch((err) => {
          Swal.fire("Error", err.message, "error");
        });
    }
  });
}

// ✅ Call function on page load
document.addEventListener("DOMContentLoaded", loadAllStudents);
