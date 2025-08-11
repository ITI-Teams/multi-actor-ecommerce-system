
    document.getElementById("photo").addEventListener("change", function (event) {
      const reader = new FileReader();
      reader.onload = function () {
        document.getElementById("preview").src = reader.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    });

    const cityOptions = {
      "Egypt": ["Cairo", "Alexandria", "Giza"],
      "USA": ["New York", "Los Angeles", "Chicago"],
      "India": ["Delhi", "Mumbai", "Bangalore"]
    };

    document.getElementById("country").addEventListener("change", function () {
      const country = this.value;
      const citySelect = document.getElementById("city");
      citySelect.innerHTML = '<option value="">Select City</option>';
      if (cityOptions[country]) {
        cityOptions[country].forEach(city => {
          const option = document.createElement("option");
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });
      }
    });

    window.addEventListener("DOMContentLoaded", function () {
      
      document.querySelector('input[type="text"]').value = localStorage.getItem("name") || "";
      document.querySelector('input[type="email"]').value = localStorage.getItem("email") || "";
      document.querySelector('input[type="password"]').value = localStorage.getItem("password") || "";
      document.getElementById("gender").value = localStorage.getItem("gender") || "";
      document.querySelector('input[type="date"]').value = localStorage.getItem("bod") || "";
      document.getElementById("country").value = localStorage.getItem("country") || "";
      document.getElementById("country").dispatchEvent(new Event("change"));
      document.getElementById("city").value = localStorage.getItem("city") || "";
      document.querySelector('input[placeholder="Address"]').value = localStorage.getItem("address") || "";
      document.querySelector('input[type="tel"]').value = localStorage.getItem("phone") || "";
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage) {
        document.getElementById("preview").src = savedImage;
      }
    });

    document.querySelector(".profile-form").addEventListener("submit", function (e) {
      e.preventDefault();
      localStorage.setItem("profileImage", document.getElementById("preview").src);
      localStorage.setItem("name", document.querySelector('input[placeholder="Name"]').value);
      localStorage.setItem("email", document.querySelector('input[placeholder="Email"]').value);
      localStorage.setItem("password", document.querySelector('input[placeholder="Password"]').value);
      localStorage.setItem("gender", document.getElementById("gender").value);
      localStorage.setItem("bod", document.querySelector('input[type="date"]').value);
      localStorage.setItem("country", document.getElementById("country").value);
      localStorage.setItem("city", document.getElementById("city").value);
      localStorage.setItem("address", document.querySelector('input[placeholder="Address"]').value);
      localStorage.setItem("phone", document.querySelector('input[type="tel"]').value);
      window.location.href = "./user-profile.html";
    });
  