 // Demo: Set initial state (guest by default)
 let isLoggedIn = false;
 let currentPage = "payment";
 let userInitials = "JS";
 let userData = null;
 let paymentMethod = ""; // To store the selected payment method

 // Pages configuration
 const guestPages = [
     { id: "home", label: "Home", url: "index.html" },
     { id: "plans", label: "Plans", url: "plans.html" },
     { id: "support", label: "Support", url: "support.html" }
 ];

 const loggedInPages = [
     { id: "home", label: "Home", url: "index.html" },
     { id: "plans", label: "Plans", url: "plans.html" },
     { id: "myplans", label: "My Plans", url: "myplans.html" },
     { id: "transactions", label: "Transactions", url: "transaction.html" },
     { id: "profile", label: "Profile", url: "profilef.html" },
     { id: "support", label: "Support", url: "support.html" }
 ];

 // Fetch user.json and store data
 async function fetchUsers() {
     try {
         const response = await fetch('./user.json');
         if (!response.ok) {
             throw new Error('Failed to fetch user.json');
         }
         userData = await response.json();
         console.log('Users fetched:', userData.users);
         displayUserDetails();
     } catch (error) {
         console.error('Error fetching user.json:', error);
         userData = { users: [] };
         displayUserDetails();
     }
 }

 // Display user details and plan details
 function displayUserDetails() {
     const mobileNumber = sessionStorage.getItem('phoneNumber');
     const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan'));

     if (!mobileNumber || !selectedPlan) {
         alert('Error: Plan or mobile number not found. Please select a plan again.');
         window.location.href = 'plans.html';
         return;
     }

     // Find user in user.json (take the first match if duplicates exist)
     const formattedNumber = `+91${mobileNumber}`;
     const user = userData.users.find(u => u.number.replace(/\s+/g, '') === formattedNumber);

     if (!user) {
         alert('Error: User not found. Please try again.');
         window.location.href = 'plans.html';
         return;
     }

     // Store user details in sessionStorage for future use (e.g., invoice)
     sessionStorage.setItem('userDetails', JSON.stringify({
         id: user.id,
         simHolderName: user.simHolderName,
         number: user.number,
         dateOfActivation: user.dateOfActivation,
         address: user.address,
         dateOfBirth: user.dateOfBirth,
         username: user.username,
         email: user.email,
         role: user.role,
         status: user.status,
         placeOfSupply: user.placeOfSupply
     }));

     // Display user details
     $('#customerName').text(user.simHolderName);
     $('#customerNumber').text(`+91 ${mobileNumber}`);
     const initials = user.simHolderName.split(' ').map(word => word[0]).join('').toUpperCase();
     $('#customerAvatar').text(initials);

     // Display plan details
     $('#planName').text(selectedPlan.name);
     $('#planData').text(selectedPlan.data);
     $('#planValidity').text(selectedPlan.validity);
     $('#planCalls').text(selectedPlan.calls);
     $('#planSMS').text(selectedPlan.sms);

     // Calculate GST and total
     const planPrice = parseFloat(selectedPlan.price);
     const gstRate = 0.18; // 18% GST
     const gstAmount = planPrice * gstRate;
     const totalAmount = planPrice + gstAmount;

     $('#planPrice').text(`₹${planPrice.toFixed(2)}`);
     $('#gstAmount').text(`₹${gstAmount.toFixed(2)}`);
     $('#totalAmount').text(`₹${totalAmount.toFixed(2)}`);
     $('#payUpiAmount').text(`₹${totalAmount.toFixed(2)}`);
     $('#payCardAmount').text(`₹${totalAmount.toFixed(2)}`);
     $('#payNetbankingAmount').text(`₹${totalAmount.toFixed(2)}`);
 }

 // Generate navigation based on login status
 function generateNavigation() {
     const navLinks = document.getElementById("nav-links");
     navLinks.innerHTML = "";
     
     const pages = isLoggedIn ? loggedInPages : guestPages;
     
     pages.forEach(page => {
         const link = document.createElement("a");
         link.href = page.url;
         link.className = `nav-link ${currentPage === page.id ? 'active' : ''}`;
         link.textContent = page.label;
         link.onclick = function(e) {
             e.preventDefault();
             setCurrentPage(page.id);
         };
         navLinks.appendChild(link);
     });
     
     if (isLoggedIn) {
         const logoutBtn = document.createElement("button");
         logoutBtn.className = "btn logout-btn";
         logoutBtn.textContent = "Logout";
         logoutBtn.onclick = function() {
             toggleLoginStatus();
         };
         navLinks.appendChild(logoutBtn);
         
         const avatar = document.createElement("div");
         avatar.className = "user-avatar";
         avatar.textContent = userInitials;
         avatar.onclick = function() {
             setCurrentPage("profile");
         };
         navLinks.appendChild(avatar);
     } else {
         const loginBtn = document.createElement("button");
         loginBtn.className = "btn login-btn";
         loginBtn.textContent = "Login";
         loginBtn.onclick = function() {
             toggleLoginStatus();
         };
         navLinks.appendChild(loginBtn);
     }
 }

 // Set current page and navigate
 function setCurrentPage(pageId) {
     currentPage = pageId;
     const page = isLoggedIn ? loggedInPages.find(p => p.id === pageId) : guestPages.find(p => p.id === pageId);
     if (page) {
         window.location.href = page.url;
     }
     generateNavigation();
 }

 // Toggle login status
 function toggleLoginStatus() {
     isLoggedIn = !isLoggedIn;
     if (!isLoggedIn) {
         localStorage.removeItem('userName');
     } else {
         localStorage.setItem('userName', 'John Doe');
         userInitials = 'J';
     }
     generateNavigation();
 }

 // Toggle mobile menu
 function toggleMenu() {
     const navLinks = document.getElementById("nav-links");
     navLinks.classList.toggle("active");
 }

 // Generate a random reference number
 function generateRefNo() {
     return `REF${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(100000 + Math.random() * 900000)}`;
 }

 // Generate a random transaction ID
 function generateTxnId() {
     return `TXN${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(100000 + Math.random() * 900000)}`;
 }

 // Format current date as DD Mon YYYY
 function formatDate() {
     const date = new Date();
     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
 }

 // Format current time as HH:MM:SS IST
 function formatTime() {
     const date = new Date();
     const hours = String(date.getHours()).padStart(2, '0');
     const minutes = String(date.getMinutes()).padStart(2, '0');
     const seconds = String(date.getSeconds()).padStart(2, '0');
     return `${hours}:${minutes}:${seconds} IST`;
 }

 // Confirm payment and redirect to success page
 function confirmPayment() {
     const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
     const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan'));
     const planPrice = parseFloat(selectedPlan.price);
     const gstRate = 0.18; // 18% GST
     const totalAmount = planPrice + (planPrice * gstRate);

     // Generate transaction details
     const transactionDetails = {
         mobileNumber: userDetails.number,
         customerName: userDetails.simHolderName,
         amount: `₹${totalAmount.toFixed(2)}`,
         refNo: generateRefNo(),
         txnId: generateTxnId(),
         date: formatDate(),
         time: formatTime(),
         paymentMode: paymentMethod
     };

     // Store transaction details in sessionStorage
     sessionStorage.setItem('transactionDetails', JSON.stringify(transactionDetails));

     // Redirect to success page
     window.location.href = 'success.html';
 }

 document.addEventListener('DOMContentLoaded', function() {
     // Fetch user data and display details
     fetchUsers();

     // Check if user is logged in
     const userName = localStorage.getItem('userName');
     if (userName) {
         isLoggedIn = true;
         userInitials = userName.charAt(0).toUpperCase();
     }
     generateNavigation();

     // Tab switching with enhanced animations
     const tabs = document.querySelectorAll('.option-tab');
     const contents = document.querySelectorAll('.payment-option-content');
     
     tabs.forEach(tab => {
         tab.addEventListener('click', () => {
             const target = tab.getAttribute('data-tab');
             
             // Remove active class from all tabs and contents
             tabs.forEach(t => t.classList.remove('active'));
             contents.forEach(c => {
                 c.classList.remove('active');
                 c.style.display = 'none';
             });
             
             // Add active class to current tab and content
             tab.classList.add('active');
             const currentContent = document.getElementById(target);
             
             // Animate the content becoming visible
             setTimeout(() => {
                 currentContent.style.display = 'block';
                 currentContent.classList.add('active');
             }, 50);
         });
     });
     
     // UPI App Selection with improved feedback
     const upiApps = document.querySelectorAll('.upi-app');
     upiApps.forEach(app => {
         app.addEventListener('click', () => {
             upiApps.forEach(a => a.classList.remove('selected'));
             app.classList.add('selected');
             
             // Show selection feedback
             const appName = app.querySelector('p').textContent;
             const upiInput = document.getElementById('upi-id');
             const upiValidationMsg = document.querySelector('.upi-validation-message');
             
             // Update the validation message based on selected app
             upiValidationMsg.textContent = `Enter your UPI ID for ${appName} (e.g. username@${app.getAttribute('data-app')})`;
         });
     });
     
     // Bank Selection with improved feedback
     const bankOptions = document.querySelectorAll('.bank-option');
     const bankError = document.getElementById('bank-error');
     
     bankOptions.forEach(bank => {
         bank.addEventListener('click', () => {
             bankOptions.forEach(b => b.classList.remove('selected'));
             bank.classList.add('selected');
             bankError.style.display = 'none';
         });
     });
     
     // Enhanced UPI Validation with real-time feedback
     const upiInput = document.getElementById('upi-id');
     const upiError = document.getElementById('upi-id-error');
     const upiValidIndicator = document.querySelector('.input-with-validation .validation-indicator.valid');
     const upiInvalidIndicator = document.querySelector('.input-with-validation .validation-indicator.invalid');
     const upiValidationMsg = document.querySelector('.upi-validation-message');
     const payUpiBtn = document.getElementById('pay-upi-btn');
     
     function validateUPI() {
         const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
         const isValid = upiRegex.test(upiInput.value);
         
         // Show appropriate validation feedback
         if (!isValid) {
             upiInput.classList.add('error');
             upiError.style.display = 'block';
             upiValidIndicator.style.display = 'none';
             upiInvalidIndicator.style.display = 'block';
             return false;
         } else {
             upiInput.classList.remove('error');
             upiError.style.display = 'none';
             upiValidIndicator.style.display = 'block';
             upiInvalidIndicator.style.display = 'none';
             return true;
         }
     }
     
     // Real-time UPI validation
     upiInput.addEventListener('input', function() {
         if (this.value.length > 0) {
             const isPartiallyValid = this.value.includes('@');
             
             if (isPartiallyValid) {
                 upiValidationMsg.style.color = '#28a745';
                 upiValidationMsg.textContent = 'Valid UPI ID format';
             } else {
                 upiValidationMsg.style.color = '#666';
                 upiValidationMsg.textContent = 'UPI ID must include @ symbol (e.g. username@upi)';
             }
             
             if (this.value.length > 5) {
                 validateUPI();
             }
         } else {
             upiValidIndicator.style.display = 'none';
             upiInvalidIndicator.style.display = 'none';
             upiValidationMsg.style.color = '#666';
             upiValidationMsg.textContent = 'Enter your UPI ID like yourname@bankname';
         }
     });
     
     // Card validation functions
     const cardNameInput = document.getElementById('card-name');
     const cardNumberInput = document.getElementById('card-number');
     const expiryInput = document.getElementById('expiry-date');
     const cvvInput = document.getElementById('cvv');
     const cardNameError = document.getElementById('card-name-error');
     const cardNumberError = document.getElementById('card-number-error');
     const expiryError = document.getElementById('expiry-error');
     const cvvError = document.getElementById('cvv-error');
     const payCardBtn = document.getElementById('pay-card-btn');
     
     function validateCardName() {
         const name = cardNameInput.value.trim();
         if (name.length < 2 || !/^[a-zA-Z\s]+$/.test(name)) {
             cardNameInput.classList.add('error');
             cardNameError.style.display = 'block';
             return false;
         } else {
             cardNameInput.classList.remove('error');
             cardNameError.style.display = 'none';
             return true;
         }
     }
     
     function validateCardNumber() {
         const number = cardNumberInput.value.replace(/\s/g, '');
         const cardNumberRegex = /^\d{16}$/;
         if (!cardNumberRegex.test(number)) {
             cardNumberInput.classList.add('error');
             cardNumberError.style.display = 'block';
             return false;
         } else {
             cardNumberInput.classList.remove('error');
             cardNumberError.style.display = 'none';
             return true;
         }
     }
     
     function validateExpiry() {
         const expiry = expiryInput.value;
         const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
         if (!expiryRegex.test(expiry)) {
             expiryInput.classList.add('error');
             expiryError.style.display = 'block';
             return false;
         }
         
         const [month, year] = expiry.split('/');
         const currentYear = new Date().getFullYear() % 100;
         const currentMonth = new Date().getMonth() + 1;
         if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
             expiryInput.classList.add('error');
             expiryError.textContent = 'Card has expired';
             expiryError.style.display = 'block';
             return false;
         }
         
         expiryInput.classList.remove('error');
         expiryError.style.display = 'none';
         return true;
     }
     
     function validateCVV() {
         const cvv = cvvInput.value;
         const cvvRegex = /^\d{3}$/;
         if (!cvvRegex.test(cvv)) {
             cvvInput.classList.add('error');
             cvvError.style.display = 'block';
             return false;
         } else {
             cvvInput.classList.remove('error');
             cvvError.style.display = 'none';
             return true;
         }
     }
     
     // Card number formatting
     cardNumberInput.addEventListener('input', function(e) {
         let value = e.target.value.replace(/\D/g, '');
         value = value.replace(/(\d{4})/g, '$1 ').trim();
         e.target.value = value;
         validateCardNumber();
     });
     
     // Expiry date formatting
     expiryInput.addEventListener('input', function(e) {
         let value = e.target.value.replace(/\D/g, '');
         if (value.length >= 2) {
             value = value.substring(0, 2) + '/' + value.substring(2);
         }
         e.target.value = value;
         validateExpiry();
     });
     
     // Real-time validation for card inputs
     cardNameInput.addEventListener('input', validateCardName);
     expiryInput.addEventListener('input', validateExpiry);
     cvvInput.addEventListener('input', validateCVV);
     
     // Card payment submission
     payCardBtn.addEventListener('click', function(e) {
         e.preventDefault();
         paymentMethod = "Cards";
         const isCardNameValid = validateCardName();
         const isCardNumberValid = validateCardNumber();
         const isExpiryValid = validateExpiry();
         const isCVVValid = validateCVV();
         
         if (isCardNameValid && isCardNumberValid && isExpiryValid && isCVVValid) {
             confirmPayment();
         }
     });
     
     // UPI payment submission
     payUpiBtn.addEventListener('click', function(e) {
         e.preventDefault();
         paymentMethod = "UPI";
         if (validateUPI()) {
             confirmPayment();
         }
     });
     
     // Netbanking payment submission
     const payNetbankingBtn = document.getElementById('pay-netbanking-btn');
     payNetbankingBtn.addEventListener('click', function(e) {
         e.preventDefault();
         paymentMethod = "Net Banking";
         const selectedBank = document.querySelector('.bank-option.selected');
         if (!selectedBank) {
             bankError.style.display = 'block';
             return;
         }
         confirmPayment();
     });
 });