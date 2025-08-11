

    const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    document.getElementById("profileImage").src = savedImage;
  }

  document.getElementById("profileName").textContent = localStorage.getItem("name") || "Unknown User";
  document.getElementById("profileEmail").textContent = localStorage.getItem("email") || "Not provided";
  document.getElementById("profileGender").textContent = localStorage.getItem("gender") || "Not set";
  document.getElementById("profileAge").textContent = localStorage.getItem("bod") || "Not set";
  document.getElementById("profileCountry").textContent = localStorage.getItem("country") || "Not set";
  document.getElementById("profileCity").textContent = localStorage.getItem("city") || "Not set";
  document.getElementById("profileAddress").textContent = localStorage.getItem("address") || "Not set";
  document.getElementById("profilePhone").textContent = localStorage.getItem("phone") || "Not set";
