 // Pages configuration
 const guestPages = [
    { id: "home", label: "Home", url: "index.html" },
    { id: "plans", label: "Plans", url: "plans.html" },
    { id: "support", label: "Support", url: "support.html" }
];

const loggedInPages = [
    { id: "home", label: "Home", url: "indexu.html" },
    { id: "plans", label: "Plans", url: "plansu.html" },
    { id: "myplans", label: "My Plans", url: "myplans.html" },
    { id: "transactions", label: "Transactions", url: "transaction.html" },
    { id: "profile", label: "Profile", url: "profilef.html" },
    { id: "support", label: "Support", url: "support.html" }
];

let isLoggedIn = false;
let currentPage = "myplans";
let userInitials = "JS";
let userData = null;

// Fetch user.json for validation (optional, if needed for future features)
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

// Generate navigation based on login status
function generateNavigation() {
    const navLinks = document.getElementById("nav-links");
    navLinks.innerHTML = "";
    
    // Check if user is logged in using localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    isLoggedIn = !!loggedInUser; // Set isLoggedIn based on whether user data exists
 
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
            logout();
        };
        navLinks.appendChild(logoutBtn);
     
        const avatar = document.createElement("div");
        avatar.className = "user-avatar";
        if (loggedInUser && loggedInUser.simHolderName) {
            avatar.textContent = loggedInUser.simHolderName.charAt(0).toUpperCase();
        } else {
            avatar.textContent = "U"; // Default if no user name
        }
        avatar.onclick = function() {
            setCurrentPage("profile");
        };
        navLinks.appendChild(avatar);
    } else {
        const loginBtn = document.createElement("button");
        loginBtn.className = "btn login-btn";
        loginBtn.textContent = "Login";
        loginBtn.onclick = function() {
            window.location.href = './login.html'; // Redirect to login page
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

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('profileSetup');
    sessionStorage.removeItem('phoneNumber');
    isLoggedIn = false;
    generateNavigation();
    window.location.href = 'index.html'; // Redirect to home page (guest state)
}

// Back button functionality
function goBack() {
    window.history.back();
}

// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dynamic navigation
    fetchUsers().then(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            isLoggedIn = true;
            userInitials = loggedInUser.simHolderName ? loggedInUser.simHolderName.charAt(0).toUpperCase() : 'U';
        }
        generateNavigation();
    });

    // Click handlers for current plan buttons
    const renewButton = document.querySelector('.current-plan-card .button:not(.button-secondary)');
    renewButton.addEventListener('click', function() {
        alert('Renewing your current Premium Monthly plan');
    });
    
    const viewDetailsButton = document.querySelector('.current-plan-card .button-secondary');
    viewDetailsButton.addEventListener('click', function() {
        alert('Viewing detailed plan information');
    });
    
    const hiddenButton = document.getElementById('hiddenButton');
    hiddenButton.addEventListener('click', function() {
        window.location.href = 'new-page.html';
    });

    // Modal functionality
    const modal = document.getElementById('rechargeModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalSubmit = document.getElementById('modalSubmit');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const modalTitle = document.getElementById('modalTitle');

    // Recharge button handlers with modal
    const rechargeButtons = document.querySelectorAll('.table-button');
    rechargeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const planName = this.closest('tr').querySelector('td').textContent;
            modalTitle.textContent = `Recharge ${planName}`;
            modal.style.display = 'flex';
            phoneNumberInput.value = '';
            phoneNumberInput.focus();
        });
    });

    // Close modal handlers
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Submit handler
    modalSubmit.addEventListener('click', function() {
        const phoneNumber = phoneNumberInput.value;
        if (phoneNumber.length === 10 && /^\d+$/.test(phoneNumber)) {
            alert(`Initiating recharge for ${modalTitle.textContent.split('Recharge ')[1]} with number: ${phoneNumber}`);
            closeModal();
        } else {
            alert('Please enter a valid 10-digit phone number');
        }
    });

    // Close modal on Esc key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
    }

    // Filter and Pagination functionality
    const planSearch = document.getElementById('planSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const filterTags = document.querySelectorAll('.filter-tag');
    const tableBody = document.getElementById('plansTableBody');
    const tablePlans = Array.from(tableBody.querySelectorAll('tr'));
    const paginationContainer = document.getElementById('pagination');
    
    const rowsPerPage = 2;
    let currentPage = 1;
    let filteredPlans = tablePlans;

    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
            filterAndPaginate();
        });
    });

    function filterPlans() {
        const searchTerm = planSearch.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();
        
        const activeFilters = [];
        filterTags.forEach(tag => {
            if (tag.classList.contains('active')) {
                activeFilters.push(tag.getAttribute('data-filter').toLowerCase());
            }
        });
        
        filteredPlans = tablePlans.filter(row => {
            const planName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            const categoryCell = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const benefitsText = row.querySelector('td:nth-child(8)').textContent.toLowerCase();
            
            const matchesSearch = !searchTerm || 
                                planName.includes(searchTerm) || 
                                benefitsText.includes(searchTerm);
            
            const matchesCategory = !selectedCategory || categoryCell.includes(selectedCategory);
            
            let matchesFeatures = true;
            if (activeFilters.length > 0) {
                matchesFeatures = activeFilters.every(filter => {
                    return categoryCell.includes(filter) || 
                           benefitsText.includes(filter) || 
                           row.querySelector(`.feature-${filter}`) !== null;
                });
            }
            
            return matchesSearch && matchesCategory && matchesFeatures;
        });
    }

    function displayPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        
        tablePlans.forEach(row => row.style.display = 'none');
        filteredPlans.slice(start, end).forEach(row => row.style.display = '');
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(filteredPlans.length / rowsPerPage);

        // Previous Button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage(currentPage);
                setupPagination();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page Numbers
        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-button';
            pageButton.textContent = i;
            if (i === currentPage) pageButton.classList.add('active');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayPage(currentPage);
                setupPagination();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next Button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === pageCount;
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                currentPage++;
                displayPage(currentPage);
                setupPagination();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function filterAndPaginate() {
        filterPlans();
        currentPage = 1;
        displayPage(currentPage);
        setupPagination();
    }

    // Initial setup
    filterAndPaginate();

    planSearch.addEventListener('input', filterAndPaginate);
    categoryFilter.addEventListener('change', filterAndPaginate);
});