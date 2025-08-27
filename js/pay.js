const token = localStorage.getItem("token");

if (!token) {
  // Not logged in: redirect to login
  window.location.replace("admin-login.html");
}
document.getElementById("payForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const studentId = document.getElementById("studentId").value.trim();
  const amount = parseFloat(document.getElementById("amount").value.trim());

  fetch(`http://localhost:8081/api/fees/${studentId}?amount=${amount}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
          throw new Error(errorData.message || "Unknown error");
        });
      }
      return res.json();
    })
    .then((data) => {
      Swal.fire("Success", "Payment recorded!", "success");
      const token = localStorage.getItem("token");

      // Create or update download button
      let existingBtn = document.getElementById("downloadReceiptBtn");

      if (!existingBtn) {
        existingBtn = document.createElement("button");
        existingBtn.id = "downloadReceiptBtn";
        existingBtn.className = "btn btn-success mt-3";
        existingBtn.textContent = "Download Latest Receipt";
        document.getElementById("payForm").after(existingBtn);
      }

      //Set button click to fetch receipt with token
      existingBtn.onclick = function () {
        fetch(
          `http://localhost:8081/api/receipts/${studentId}_${data.id}.pdf`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch receipt");
            }
            return res.blob();
          })
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt_${studentId}_${data.id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch((err) => {
            Swal.fire("Error", err.message, "error");
          });
      };
    })
    .catch((err) => {
      Swal.fire("Error", err.message, "error");
    });
});
