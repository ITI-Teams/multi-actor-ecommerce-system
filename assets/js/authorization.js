(()=>{
  let currentID = localStorage.getItem("customerSession");
  if (!currentID) {
    alert("You must log in first.");
    window.location.href = "login.html";
    return;
  }
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const currentCustomer = customers.find(c => String(c.id) === String(currentID));
  if (!currentCustomer) {
    alert("Profile not found.");
    return;
  }
})();