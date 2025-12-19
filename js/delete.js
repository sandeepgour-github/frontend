const token = localStorage.getItem("token");

if (!token) {
  // Not logged in: redirect to login
  window.location.replace("admin-login.html");
}
document.getElementById("deleteForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("studentId").value;

  Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the student!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`https://schoolfeemanagementapp.onrender.com/students/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token, //token header added
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");
          Swal.fire("Deleted!", "Student record has been deleted.", "success");
          document.getElementById("deleteForm").reset();
        })
        .catch((err) => {
          Swal.fire("Error", err.message, "error");
        });
    }
  });
});
