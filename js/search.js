const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "admin-login.html";
}

function searchStudent() {
  const input = document.getElementById("searchInput").value.trim();

  if (!input) {
    Swal.fire(
      "Input Required",
      "Please enter a name, ID, or mobile number.",
      "warning"
    );
    return;
  }

  fetch("http://localhost:8081/api/students/search/" + input, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token, // ✅ token added
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(error.message || "Student not found");
        });
      }
      return res.json();
    })
    .then((data) => {
      const table = $("#resultTable").DataTable();
      table.clear().draw();

      if (!data || data.length === 0) {
        Swal.fire("Not Found", "No student found with that input.", "warning");
        return;
      }

      data.forEach((student) => {
        table.row
          .add([
            student.studentId,
            student.firstName,
            student.lastName,
            student.mobileNumber,
            student.feePlan,
          ])
          .draw(false);
      });
    })
    .catch((err) => {
      Swal.fire("Error", err.message, "error");
    });
}

$(document).ready(function () {
  $("#resultTable").DataTable();
});
