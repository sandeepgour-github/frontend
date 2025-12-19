const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "admin-login.html";
}
function loadHistory() {
  const studentId = document.getElementById("studentId").value.trim();

  if (!studentId) {
    Swal.fire("Input Required", "Please enter a Student ID", "warning");
    return;
  }

  fetch("https://schoolfeemanagementapp.onrender.com/api/fees/history/" + studentId, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token, 
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(error.message || "Could not fetch history");
        });
      }
      return res.json();
    })
    .then((data) => {
      const table = $("#historyTable").DataTable();
      table.clear().draw();

      if (data.length === 0) {
        Swal.fire(
          "No History",
          "No transactions found for this student",
          "info"
        );
        return;
      }

      data.forEach((txn) => {
        table.row
          .add([
            txn.paymentDate,
            `₹${txn.amountPaid.toFixed(2)}`,
            `₹${txn.totalPaid.toFixed(2)}`,
            `₹${txn.balance.toFixed(2)}`,
            txn.nextDueDate,
          ])
          .draw(false);
      });
    })
    .catch((err) => {
      Swal.fire("Error", err.message, "error");
    });
}

$(document).ready(function () {
  $("#historyTable").DataTable();
});
