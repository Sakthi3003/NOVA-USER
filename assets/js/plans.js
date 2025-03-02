 // Demo: Set initial state (guest by default)
 let isLoggedIn = false;
 let currentPage = "plans";
 let userInitials = "JS";
 let userData = null;
 let plansData = null;
 let selectedPlan = null;

 // Pages configuration
 const guestPages = [
     { id: "home", label: "Home", url: "index.html" },
     { id: "plans", label: "Plans", url: "plans.html" },
     { id: "support", label: "Support", url: "supportg.html" }
 ];

 const loggedInPages = [
     { id: "home", label: "Home", url: "indexu.html" },
     { id: "plans", label: "Plans", url: "plansu.html" },
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
     } catch (error) {
         console.error('Error fetching user.json:', error);
         userData = { users: [] };
     }
 }

 // Fetch plans.json and render plans
 async function fetchPlans() {
     try {
         const response = await fetch('./plans.json');
         if (!response.ok) {
             throw new Error('Failed to fetch plans.json: ' + response.statusText);
         }
         const text = await response.text();
         console.log('Raw response text:', text);
         plansData = JSON.parse(text);
         console.log('Fetched Plans:', plansData);
         if (!plansData.plans || !Array.isArray(plansData.plans)) {
             throw new Error('Invalid plans.json structure: "plans" array not found');
         }
         renderPlans(plansData.plans);
     } catch (error) {
         console.error('Error fetching plans.json:', error);
         plansData = { plans: [] };
         renderPlans(plansData.plans);
     }
 }

 // Render plans dynamically
 function renderPlans(plans) {
     const categories = [
         { id: "popular", name: "Popular Plans" },
         { id: "data-top-up", name: "Data Top-Up" },
         { id: "5g-plans", name: "5G Plans" },
         { id: "entertainment", name: "Entertainment Plans" },
         { id: "ott", name: "OTT Plans" },
         { id: "validity", name: "Validity Plans" },
         { id: "family", name: "family" },
         { id: "voice", name: "Voice Plans" }
     ];

     const plansList = document.getElementById("plansList");
     plansList.innerHTML = "";

     categories.forEach((category, index) => {
         const categoryPlans = plans.filter(plan => plan.category === category.id);
         console.log(`Rendering category: ${category.id}, Plans found: ${categoryPlans.length}`);

         const categorySection = document.createElement("div");
         categorySection.className = "category-section";
         categorySection.dataset.category = category.id;
         categorySection.style.display = index === 0 ? "block" : "none";

         const plansGrid = document.createElement("div");
         plansGrid.className = "plans-grid";

         categoryPlans.forEach(plan => {
             const planCard = document.createElement("div");
             planCard.className = "plan-card";

             if (plan.badge) {
                 const badge = document.createElement("span");
                 badge.className = `badge ${plan.badge.toLowerCase() === "best seller" ? "" : "green"}`;
                 badge.textContent = plan.badge;
                 planCard.appendChild(badge);
             }

             const planTitle = document.createElement("h3");
             planTitle.innerHTML = `${plan.name} <i class="${plan.icon}"></i>`;
             planCard.appendChild(planTitle);

             const planPrice = document.createElement("div");
             planPrice.className = "plan-price";
             planPrice.textContent = `₹${plan.price}`;
             planCard.appendChild(planPrice);

             const planDetails = document.createElement("div");
             planDetails.className = "plan-details";
             planDetails.innerHTML = `
                 <div class="plan-detail"><i class="fas fa-calendar-alt"></i> Validity: ${plan.validity}</div>
                 <div class="plan-detail"><i class="fas fa-mobile-alt"></i> Data: ${plan.data}</div>
                 <div class="plan-detail"><i class="fas fa-sms"></i> SMS: ${plan.sms}</div>
                 <div class="plan-detail"><i class="fas fa-phone"></i> Calls: ${plan.calls}</div>
             `;
             planCard.appendChild(planDetails);

             const planBenefits = document.createElement("div");
             planBenefits.className = "plan-benefits";
             const benefitsList = document.createElement("ul");
             plan.benefits.forEach(benefit => {
                 const li = document.createElement("li");
                 li.textContent = benefit;
                 benefitsList.appendChild(li);
             });
             planBenefits.appendChild(benefitsList);
             planCard.appendChild(planBenefits);

             const buyButton = document.createElement("button");
             buyButton.className = "buy-now-btn";
             buyButton.textContent = "Recharge now";
             buyButton.setAttribute('data-plan-name', plan.name);
             buyButton.setAttribute('data-plan-price', plan.price);
             buyButton.setAttribute('data-plan-validity', plan.validity);
             buyButton.setAttribute('data-plan-data', plan.data);
             buyButton.setAttribute('data-plan-sms', plan.sms);
             buyButton.setAttribute('data-plan-calls', plan.calls);
             buyButton.setAttribute('data-plan-benefits', encodeURIComponent(JSON.stringify(plan.benefits)));
             planCard.appendChild(buyButton);

             plansGrid.appendChild(planCard);
         });

         categorySection.appendChild(plansGrid);
         plansList.appendChild(categorySection);
     });
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

 // Show change number modal
 function showChangeNumberModal(isChangeNumber = false, plan = null) {
     const modal = document.getElementById("numberModal");
     const modalTitle = document.getElementById("modalTitle");
     modal.style.display = "flex";
     document.getElementById("modalNumberInput").value = sessionStorage.getItem('phoneNumber') || '';
     document.getElementById("modalErrorMessage").style.display = "none";
     modal.dataset.isChangeNumber = isChangeNumber ? "true" : "false";
     
     if (plan) {
         selectedPlan = plan;
         modalTitle.textContent = `Recharge ${plan.name}`;
     } else {
         modalTitle.textContent = "Enter Your Mobile Number";
     }
 }

 // Validate modal number input
 function validateModalNumber() {
     const mobileNumber = document.getElementById("modalNumberInput").value.trim();
     const errorMessage = document.getElementById("modalErrorMessage");
     const modal = document.getElementById("numberModal");
     const isChangeNumber = modal.dataset.isChangeNumber === "true";

     // Basic format validation
     const mobileNumberPattern = /^[6789]\d{9}$/;
     if (!mobileNumberPattern.test(mobileNumber)) {
         errorMessage.textContent = 'Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9.';
         errorMessage.style.display = "block";
         return;
     }

     // Check if userData is available
     if (!userData) {
         errorMessage.textContent = 'User data not loaded. Please try again later.';
         errorMessage.style.display = "block";
         return;
     }

     try {
         // Normalize the entered mobile number and user.json numbers
         const enteredNumber = `+91${mobileNumber}`;
         const validNumbers = userData.users.map(user => user.number.replace(/\s+/g, ''));

         // Check if the number exists in user.json
         if (!validNumbers.includes(enteredNumber)) {
             errorMessage.textContent = 'This doesn’t seem to be a NOVA number. Please check and try again.';
             errorMessage.style.display = "block";
         } else {
             errorMessage.style.display = "none";
             sessionStorage.setItem('phoneNumber', mobileNumber);
             document.getElementById("selectedNumber").textContent = mobileNumber;
             document.getElementById("numberModal").style.display = "none";
             document.getElementById("numberDisplay").style.display = "flex";

             // If this was triggered by a Buy Now click (not a change number action), proceed to payment
             if (!isChangeNumber && selectedPlan) {
                 proceedToPayment(selectedPlan);
             }
         }
     } catch (error) {
         console.error('Error validating user data:', error);
         errorMessage.textContent = 'Failed to validate number. Please try again.';
         errorMessage.style.display = "block";
     }
 }

 // Proceed to payment page
 function proceedToPayment(plan) {
     sessionStorage.setItem('selectedPlan', JSON.stringify({
         name: plan.name,
         price: plan.price,
         validity: plan.validity,
         data: plan.data,
         sms: plan.sms,
         calls: plan.calls,
         benefits: plan.benefits
     }));
     window.location.href = 'payment.html';
 }

 // Close modal on outside click or Esc key
 document.getElementById("numberModal").addEventListener('click', function(e) {
     if (e.target === this) {
         this.style.display = "none";
     }
 });

 document.addEventListener('keydown', function(e) {
     const modal = document.getElementById("numberModal");
     if (e.key === 'Escape' && modal.style.display === "flex") {
         modal.style.display = "none";
     }
 });

 $(document).ready(function() {
     Promise.all([fetchUsers(), fetchPlans()]).then(() => {
         const userName = localStorage.getItem('userName');
         if (userName) {
             isLoggedIn = true;
             userInitials = userName.charAt(0).toUpperCase();
         }
         generateNavigation();

         // Check for phone number in sessionStorage
         const phoneNumber = sessionStorage.getItem('phoneNumber');
         if (phoneNumber) {
             document.getElementById("selectedNumber").textContent = phoneNumber;
             document.getElementById("numberDisplay").style.display = "flex";
         } else {
             // If no phone number is provided, don't show modal immediately
             document.getElementById("numberDisplay").style.display = "none";
         }

         $('.tab').on('click', function() {
             $('.tab').removeClass('active');
             $(this).addClass('active');

             const category = $(this).data('category');
             $('.category-section').hide();
             $(`.category-section[data-category="${category}"]`).show();

             const searchTerm = $('#searchInput').val().toLowerCase();
             filterPlans(searchTerm);
         });

         $('#searchInput').on('input', function() {
             const searchTerm = $(this).val().toLowerCase();
             filterPlans(searchTerm);
         });

         function filterPlans(searchTerm) {
             $('.plan-card').each(function() {
                 const planName = $(this).find('h3').text().toLowerCase();
                 const benefits = $(this).find('.plan-benefits').text().toLowerCase();
                 const isVisible = planName.includes(searchTerm) || benefits.includes(searchTerm);

                 const activeTab = $('.tab.active').data('category');
                 const cardCategory = $(this).closest('.category-section').data('category');

                 if (isVisible && cardCategory === activeTab) {
                     $(this).show();
                 } else {
                     $(this).hide();
                 }
             });
         }

         $(document).on('click', '.buy-now-btn', function() {
             const plan = {
                 name: $(this).attr('data-plan-name'),
                 price: $(this).attr('data-plan-price'),
                 validity: $(this).attr('data-plan-validity'),
                 data: $(this).attr('data-plan-data'),
                 sms: $(this).attr('data-plan-sms'),
                 calls: $(this).attr('data-plan-calls'),
                 benefits: JSON.parse(decodeURIComponent($(this).attr('data-plan-benefits')))
             };

             // Always show the modal when clicking "Recharge now"
             showChangeNumberModal(false, plan);
         });
     });
 });