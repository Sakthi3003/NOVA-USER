// Pages configuration for guests only
const guestPages = [
    { id: "home", label: "Home", url: "index.html" },
    { id: "plans", label: "Plans", url: "plans.html" },
    { id: "support", label: "Support", url: "support.html" }
];

let currentPage = "home";

// Generate static guest navigation
function generateNavigation() {
    const navLinks = document.getElementById("nav-links");
    navLinks.innerHTML = "";

    guestPages.forEach(page => {
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

    const loginBtn = document.createElement("a");
    loginBtn.href = "./login.html";
    loginBtn.className = "btn login-btn";
    loginBtn.textContent = "Login";
    navLinks.appendChild(loginBtn);
}

// Set current page and navigate
function setCurrentPage(pageId) {
    currentPage = pageId;
    const page = guestPages.find(p => p.id === pageId);
    if (page) {
        window.location.href = page.url;
    }
    generateNavigation();
}

// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("active");
}

$(document).ready(function() {
    // Initialize static guest navigation
    generateNavigation();

    // Mobile number validation on input
    $('#mobileNumber').on('input', function() {
        let mobileNumber = $(this).val().trim();
        let errorMessage = $('#errorMessage');

        // Allow only numeric input and limit to 10 digits
        mobileNumber = mobileNumber.replace(/\D/g, '');
        if (mobileNumber.length > 10) {
            mobileNumber = mobileNumber.substring(0, 10);
        }
        $(this).val(mobileNumber);

        // Basic format validation
        const mobileNumberPattern = /^[6789]\d{9}$/;
        if (!mobileNumberPattern.test(mobileNumber)) {
            errorMessage.text('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9.');
            errorMessage.show();
        } else {
            errorMessage.hide();
        }
    });

    // Validate mobile number on button click and redirect to plans.html
    $('#rechargeButton').on('click', function() {
        const mobileNumber = $('#mobileNumber').val().trim();
        const errorMessage = $('#errorMessage');

        // Basic format validation
        const mobileNumberPattern = /^[6789]\d{9}$/;
        if (!mobileNumberPattern.test(mobileNumber)) {
            errorMessage.text('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9.');
            errorMessage.show();
            return;
        }

        errorMessage.hide();
        sessionStorage.setItem('phoneNumber', mobileNumber);
        setCurrentPage('plans');
    });

    // About Us Counters
    const customers = [
        { name: "Alice", recharges: 5, rating: 4.5 },
        { name: "Bob", recharges: 10, rating: 5.0 },
        { name: "Charlie", recharges: 7, rating: 4.8 },
        { name: "David", recharges: 15, rating: 4.9 },
        { name: "Emma", recharges: 8, rating: 4.2 }
    ];

    const totalCustomers = customers.length;
    document.getElementById("totalCustomers").setAttribute("data-target", totalCustomers);

    const totalRecharges = customers.reduce((sum, customer) => sum + customer.recharges, 0);
    document.getElementById("totalRecharges").setAttribute("data-target", totalRecharges);

    const avgRating = (customers.reduce((sum, customer) => sum + customer.rating, 0) / customers.length).toFixed(1);
    document.getElementById("avgRating").innerText = avgRating + "/5";

    const ratingStarsContainer = document.getElementById("ratingStars");
    ratingStarsContainer.innerHTML = "";
    const fullStars = Math.floor(avgRating);
    const halfStar = avgRating % 1 !== 0 ? 1 : 0;
    for (let i = 0; i < fullStars; i++) {
        ratingStarsContainer.innerHTML += '<i class="bi bi-star-fill"></i>';
    }
    if (halfStar) {
        ratingStarsContainer.innerHTML += '<i class="bi bi-star-half"></i>';
    }

    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        counter.innerText = "0";
        const updateCounter = () => {
            const target = +counter.getAttribute("data-target");
            const count = +counter.innerText;
            const increment = target / 100;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
});