// Global variables
let formData = {};
let costs = {
  baseCost: 0,
  featuresCost: 0,
  totalCost: 0,
};

// Pricing configuration
const PRICING = {
  websiteTypes: {
    informational: 50000,
    ecommerce: 150000,
    booking: 100000,
    membership: 120000,
    dashboard: 80000,
    portfolio: 40000,
    realestate: 75000,
    healthcare: 25000,
    socialmedia: 120000,
    learningmanagementsystem: 30000,
    fintechapplications: 50000,
    saasproduct: 60000,
    newsmagzines: 35000,
    marketplace: 80000,
  },
  features: {
    adminPanel: 25000,
    userAuthentication: 20000,
    roleBasedAccess: 15000,
    productManagement: 30000,
    shoppingCart: 35000,
    orderTracking: 20000,
    inventoryManagement: 40000,
    blogNewsModule: 15000,
    bookingCalendarModule: 30000,
    liveChatChatbot: 12000,
    socialMediaIntegration: 8000,
    googleAnalytics: 5000,
    seoSetup: 15000,
  },
  paymentGateways: {
    stripe: 8000,
    paypal: 8000,
    razorpay: 6000,
    payu: 6000,
    ccavenue: 7000,
  },
  cms: {
    wordpress: 10000,
    strapi: 15000,
    custom: 25000,
  },
  accessibility: {
    basic: 8000,
    wcag: 25000,
  },
  languages: {
    perLanguage: 12000,
  },
  deviceCompatibility: {
    desktop: 10000, // example price
    tablet: 8000,
    mobile: 12000,
  },
  projectType: {
    website: 10000,
    mobile: 15000,
    both: 22000,
  },
  performanceLevel: {
    basic: 0,
    optimized: 10000,
    high_performance: 25000,
    enterprise: 40000,
  },
  logoDesign: {
    no: 0, // No logo needed
    basic: 8000, // Basic logo design
    premium: 15000, // Premium logo with variations
    complete_branding: 25000, // Full brand identity package
  },
  // Add Technology Stack pricing
  technologyStack: {
    frontend: {
      react: 15000,
      vue: 12000,
      angular: 18000,
      nextjs: 20000,
      nuxtjs: 18000,
      svelte: 15000,
      vanilla: 5000,
      jquery: 8000,
      bootstrap: 5000,
      tailwind: 8000,
    },
    backend: {
      nodejs: 15000,
      python_django: 18000,
      python_flask: 12000,
      python_fastapi: 16000,
      php_laravel: 14000,
      php_symfony: 16000,
      php_codeigniter: 10000,
      ruby_rails: 20000,
      java_spring: 22000,
      csharp_dotnet: 20000,
      go: 18000,
      rust: 22000,
    },
    database: {
      mysql: 8000,
      postgresql: 10000,
      mongodb: 12000,
      sqlite: 5000,
      redis: 8000,
      mariadb: 8000,
      oracle: 25000,
      mssql: 15000,
      dynamodb: 15000,
      firestore: 12000,
      cassandra: 20000,
    },
    hosting: {
      aws: 20000,
      azure: 18000,
      gcp: 18000,
      vercel: 8000,
      netlify: 6000,
      heroku: 10000,
      digitalocean: 12000,
      linode: 10000,
      cloudflare: 8000,
      shared_hosting: 3000,
      vps: 8000,
      dedicated: 15000,
    },
    devops: {
      docker: 15000,
      kubernetes: 25000,
      jenkins: 18000,
      github_actions: 10000,
      gitlab_ci: 12000,
      terraform: 20000,
      ansible: 18000,
      nginx: 8000,
      apache: 6000,
      basic_deployment: 5000,
    },
    additionalServices: {
      cdn: 5000,
      ssl: 3000,
      monitoring: 8000,
      backup: 6000,
      load_balancer: 12000,
      caching: 8000,
      search_engine: 15000,
      email_service: 8000,
      analytics: 10000,
      security_audit: 15000,
    },
  },
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeForm();
  setupEventListeners();
  setupSearchableSelects();
  setupProgressTracking();
  animateOnScroll();
});

// Initialize form with default values
function initializeForm() {
  updateFormData();
  calculateCosts();
}

// Set up all event listeners
function setupEventListeners() {
  const form = document.getElementById("quotationForm");

  // Form input change listeners
  form.addEventListener("change", function (e) {
    updateFormData();
    calculateCosts();
    updateProgress();
  });

  form.addEventListener("input", function (e) {
    updateFormData();
    calculateCosts();
    updateProgress();
  });
  const deviceCheckboxes = document.querySelectorAll(
    'input[name="deviceCompatibility"]'
  );
  deviceCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateFormData();
      calculateCosts();
      updateProgress();
    });
  });

  // Generate quote button
  const generateBtn = document.getElementById("generateQuoteBtn");
  generateBtn.addEventListener("click", generateQuotation);

  // Scroll event for animations
  window.addEventListener("scroll", animateOnScroll);
}

// Setup searchable select functionality
function setupSearchableSelects() {
  const searchableSelects = document.querySelectorAll(".searchable-select");

  searchableSelects.forEach((select) => {
    const searchInput = select.querySelector(".search-input");
    const optionsContainer = select.querySelector(".options-container");
    const options = optionsContainer.querySelectorAll(".option-item");

    // Search functionality
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();

      options.forEach((option) => {
        const text = option
          .querySelector(".option-text")
          .textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          option.style.display = "flex";
        } else {
          option.style.display = "none";
        }
      });
    });

    // Toggle dropdown on focus
    searchInput.addEventListener("focus", function () {
      optionsContainer.style.display = "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (!select.contains(e.target)) {
        optionsContainer.style.display = "none";
      }
    });

    // Update search input with selected values
    const checkboxes = optionsContainer.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        updateSearchInputPlaceholder(select);
      });
    });
  });
}

// Update search input placeholder with selected values
function updateSearchInputPlaceholder(selectElement) {
  const searchInput = selectElement.querySelector(".search-input");
  const checkedBoxes = selectElement.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  if (checkedBoxes.length === 0) {
    searchInput.placeholder =
      searchInput.getAttribute("data-placeholder") || "Search...";
  } else if (checkedBoxes.length === 1) {
    const selectedText =
      checkedBoxes[0].parentElement.querySelector(".option-text").textContent;
    searchInput.placeholder = selectedText;
  } else {
    searchInput.placeholder = `${checkedBoxes.length} items selected`;
  }
  searchInput.value = "";
}

// Update form data object
function updateFormData() {
  const form = document.getElementById("quotationForm");
  const formDataNew = new FormData(form);
  formData = {};

  // Handle regular form fields
  for (let [key, value] of formDataNew.entries()) {
    if (formData[key]) {
      if (Array.isArray(formData[key])) {
        formData[key].push(value);
      } else {
        formData[key] = [formData[key], value];
      }
    } else {
      formData[key] = value;
    }
  }

  // Handle checkboxes separately to ensure arrays
  const checkboxGroups = [
    "deviceCompatibility",
    "multilingualSupport",
    "paymentGateway",
    "thirdPartyApis",
  ];

  const websiteTypeSelect = document.getElementById("websiteType");
  if (websiteTypeSelect) {
    formData["websiteType"] = websiteTypeSelect.value;
  }

  const performanceLevelSelect = document.getElementById("performanceLevel");
  if (performanceLevelSelect) {
    formData["performanceLevel"] = performanceLevelSelect.value;
  }

  const logoDesignSelect = document.getElementById("logoDesign");
  if (logoDesignSelect) {
    formData["logoDesign"] = logoDesignSelect.value;
  }

  // Find this existing code around line 180-200:
  checkboxGroups.forEach((groupName) => {
    const checkboxes = document.querySelectorAll(
      `input[name="${groupName}"]:checked`
    );
    formData[groupName] = Array.from(checkboxes).map((cb) => cb.value);
  });

  // Add Technology Stack form data handling (add this in updateFormData function)
  const technologyFields = [
    "frontendTech",
    "backendTech",
    "databaseTech",
    "hostingTech",
    "devopsTech",
    "additionalServices",
  ];
  technologyFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element && element.value) {
      formData[field] = element.value;
    }
  });

  // Handle new Target Audience dropdown
  const targetAudienceSelect = document.getElementById("targetAudience");
  if (targetAudienceSelect) {
    formData["targetAudience"] = Array.from(
      targetAudienceSelect.selectedOptions
    ).map((option) => option.value);
  }

  // Handle toggle switches (boolean features)
  const toggles = document.querySelectorAll(
    '.toggle-item input[type="checkbox"]'
  );
  toggles.forEach((toggle) => {
    formData[toggle.name] = toggle.checked;
  });
}

// Calculate costs based on form data
function calculateCosts() {
  let baseCost = 0;
  let featuresCost = 0;

  // Add Project Type Pricing
  if (formData.projectType && PRICING.projectType[formData.projectType]) {
    baseCost += PRICING.projectType[formData.projectType];
  }
  // Website types pricing
  if (formData.websiteType && PRICING.websiteTypes[formData.websiteType]) {
    baseCost += PRICING.websiteTypes[formData.websiteType];
  }
  // Performance Level pricing
  if (
    formData.performanceLevel &&
    PRICING.performanceLevel[formData.performanceLevel]
  ) {
    baseCost += PRICING.performanceLevel[formData.performanceLevel];
  }

  // Logo design pricing
  if (formData.logoDesign && PRICING.logoDesign[formData.logoDesign]) {
    featuresCost += PRICING.logoDesign[formData.logoDesign];
  }

  // --- Device Compatibility Pricing: new section ---
  if (formData.deviceCompatibility) {
    formData.deviceCompatibility.forEach((device) => {
      if (PRICING.deviceCompatibility && PRICING.deviceCompatibility[device]) {
        baseCost += PRICING.deviceCompatibility[device];
      }
    });
  }

  // Technology Stack pricing
  if (
    formData.frontendTech &&
    PRICING.technologyStack.frontend[formData.frontendTech]
  ) {
    featuresCost += PRICING.technologyStack.frontend[formData.frontendTech];
  }

  if (
    formData.backendTech &&
    PRICING.technologyStack.backend[formData.backendTech]
  ) {
    featuresCost += PRICING.technologyStack.backend[formData.backendTech];
  }

  if (
    formData.databaseTech &&
    PRICING.technologyStack.database[formData.databaseTech]
  ) {
    featuresCost += PRICING.technologyStack.database[formData.databaseTech];
  }

  if (
    formData.hostingTech &&
    PRICING.technologyStack.hosting[formData.hostingTech]
  ) {
    featuresCost += PRICING.technologyStack.hosting[formData.hostingTech];
  }

  if (
    formData.devopsTech &&
    PRICING.technologyStack.devops[formData.devopsTech]
  ) {
    featuresCost += PRICING.technologyStack.devops[formData.devopsTech];
  }

  if (
    formData.additionalServices &&
    PRICING.technologyStack.additionalServices[formData.additionalServices]
  ) {
    featuresCost +=
      PRICING.technologyStack.additionalServices[formData.additionalServices];
  }

  // Features pricing
  Object.keys(formData).forEach((key) => {
    if (formData[key] === true && PRICING.features[key]) {
      featuresCost += PRICING.features[key];
    }
  });

  // Payment gateway pricing
  if (formData.paymentGateway) {
    formData.paymentGateway.forEach((gateway) => {
      if (PRICING.paymentGateways[gateway]) {
        featuresCost += PRICING.paymentGateways[gateway];
      }
    });
  }

  // CMS pricing
  if (formData.cmsRequired && PRICING.cms[formData.cmsRequired]) {
    featuresCost += PRICING.cms[formData.cmsRequired];
  }

  // Accessibility pricing
  if (
    formData.accessibilityCompliance &&
    PRICING.accessibility[formData.accessibilityCompliance]
  ) {
    featuresCost += PRICING.accessibility[formData.accessibilityCompliance];
  }

  // Multi-language pricing
  if (formData.multilingualSupport && formData.multilingualSupport.length > 0) {
    featuresCost +=
      formData.multilingualSupport.length * PRICING.languages.perLanguage;
  }

  // Minimum base cost
  if (baseCost === 0) baseCost = 30000;
  const totalCost = baseCost + featuresCost;

  costs = {
    baseCost,
    featuresCost,
    totalCost,
  };
  updateCostDisplay();
}

// Update cost display in the UI
function updateCostDisplay() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  document.getElementById("baseCost").textContent = `₹${formatCurrency(
    costs.baseCost
  )}`;
  document.getElementById("featuresCost").textContent = `₹${formatCurrency(
    costs.featuresCost
  )}`;
  document.getElementById("totalCost").textContent = `₹${formatCurrency(
    costs.totalCost
  )}`;

  // Update timeline based on complexity
  const timeline = calculateTimeline();
  document.getElementById("timeline").textContent = timeline;
}

// Calculate project timeline based on complexity
function calculateTimeline() {
  let weeks = 4; // Base timeline

  // Add time based on website types
  if (formData.websiteType) {
    switch (formData.websiteType) {
      case "ecommerce":
      case "marketplace":
      case "socialmedia":
        weeks += 6; // High complexity
        break;
      case "membership":
      case "booking":
      case "learningmanagementsystem":
      case "realestate":
      case "fintechapplications":
      case "saasproduct":
        weeks += 4; // Medium-high complexity
        break;
      case "dashboard":
      case "healthcare":
      case "newsmagzines":
        weeks += 3; // Medium complexity
        break;
      case "portfolio":
      case "informational":
        weeks += 1; // Low complexity
        break;
      default:
        weeks += 2; // Fallback
    }
  }

  // Add time for complex technology stacks
  const complexTech = [
    "angular",
    "java_spring",
    "csharp_dotnet",
    "rust",
    "kubernetes",
    "terraform",
  ];
  const selectedTech = [
    formData.frontendTech,
    formData.backendTech,
    formData.devopsTech,
  ].filter((tech) => tech && complexTech.includes(tech));

  weeks += selectedTech.length * 1; // Add 1 week per complex technology

  // Add time for advanced DevOps
  if (
    formData.devopsTech &&
    ["kubernetes", "terraform", "ansible"].includes(formData.devopsTech)
  ) {
    weeks += 2;
  }

  if (formData.performanceLevel) {
    switch (formData.performanceLevel) {
      case "optimized":
        weeks += 1;
        break;
      case "high_performance":
        weeks += 2;
        break;
      case "enterprise":
        weeks += 3;
        break;
      // basic: no extra time added
    }
  }

  // Add time for complex features
  const complexFeatures = [
    "productManagement",
    "shoppingCart",
    "inventoryManagement",
    "bookingCalendarModule",
  ];
  complexFeatures.forEach((feature) => {
    if (formData[feature]) {
      weeks += 1;
    }
  });

  // Add time for multi-language support
  if (formData.multilingualSupport && formData.multilingualSupport.length > 1) {
    weeks += formData.multilingualSupport.length;
  }

  return `${Math.max(weeks, 4)}-${weeks + 2} weeks`;
}

// Setup progress tracking
function setupProgressTracking() {
  updateProgress();
}

// Update progress indicator
function updateProgress() {
  const requiredFields = [
    "clientName",
    "companyName",
    "projectTitle",
    "email",
    "projectType",
    "performanceLevel",
  ];

  const importantSelections = [
    "targetAudience",
    "websiteType",
    "deviceCompatibility",
    "performanceLevel",
    "logoDesign",
  ];

  let completedRequired = 0;
  let completedSelections = 0;

  // Check required fields
  requiredFields.forEach((field) => {
    if (formData[field] && formData[field].trim() !== "") {
      completedRequired++;
    }
  });

  // Check important selections
  importantSelections.forEach((field) => {
    if (field === "browserSupport") {
      if (formData[field] && formData[field].trim() !== "") {
        completedSelections++;
      }
    } else if (
      Array.isArray(formData[field])
        ? formData[field].length > 0
        : typeof formData[field] === "string"
        ? formData[field].trim() !== ""
        : false
    ) {
      completedSelections++;
    }
  });

  // Calculate progress percentage
  const totalRequired = requiredFields.length + importantSelections.length;
  const totalCompleted = completedRequired + completedSelections;
  const progressPercentage = Math.round((totalCompleted / totalRequired) * 100);

  // Update progress display
  document.getElementById(
    "progressPercentage"
  ).textContent = `${progressPercentage}%`;
  document.getElementById(
    "progressFill"
  ).style.width = `${progressPercentage}%`;

  // Update progress message
  const progressMessage = document.getElementById("progressMessage");
  if (progressPercentage >= 75) {
    progressMessage.textContent = "Almost there!";
  } else if (progressPercentage >= 50) {
    progressMessage.textContent = "Looking great!";
  } else if (progressPercentage >= 25) {
    progressMessage.textContent = "Making progress...";
  } else {
    progressMessage.textContent = "Let's begin!";
  }
}

// Generate quotation summary
function generateQuotation() {
  if (!validateForm()) {
    alert(
      "Please fill in all required fields before generating the quotation."
    );
    return;
  }

  const summarySection = document.getElementById("summarySection");
  const summaryContent = document.getElementById("summaryContent");

  summaryContent.innerHTML = generateSummaryHTML();
  summarySection.style.display = "block";

  // Smooth scroll to summary
  summarySection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  // Show success animation
  summarySection.style.opacity = "0";
  summarySection.style.transform = "translateY(20px)";

  setTimeout(() => {
    summarySection.style.transition = "all 0.6s ease";
    summarySection.style.opacity = "1";
    summarySection.style.transform = "translateY(0)";
  }, 100);
}

// Validate form before generating quotation
function validateForm() {
  const required = [
    "clientName",
    "companyName",
    "projectTitle",
    "email",
    "projectType",
  ];

  for (let field of required) {
    if (!formData[field] || formData[field].trim() === "") {
      return false;
    }
  }

  if (!formData.targetAudience || formData.targetAudience.length === 0) {
    return false;
  }

  if (!formData.websiteType || formData.websiteType.trim() === "") {
    return false;
  }

  if (!formData.performanceLevel || formData.performanceLevel.trim() === "") {
    return false;
  }

  return true;
}

// Generate summary HTML
function generateSummaryHTML() {
  console.log("Form Data:", formData);
  console.log("Website Type:", formData.websiteType);
  console.log("Frontend Tech:", formData.frontendTech);
  console.log("Backend Tech:", formData.backendTech);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const websiteTypeLabels = {
    informational: "Informational / Business Website",
    ecommerce: "eCommerce Store",
    booking: "Booking / Appointment System",
    membership: "Membership / Community Platform",
    dashboard: "Internal Tool / Dashboard",
    portfolio: "Portfolio / Blog Website",
    realestate: "Real-e-state",
    socialmedia: "Social Media Platforms",
    learningmanagementsystem: "Learning-Management-System",
    fintechapplications: "Fintech-applications",
    saasproduct: "Saas Products",
    marketplace: "MarketPlace",
    newsmagzines: "News / Magzines",
  };

  // Add Technology Stack Labels
  const techStackLabels = {
    frontend: {
      react: " React.js",
      vue: " Vue.js",
      angular: " Angular",
      nextjs: " Next.js",
      nuxtjs: " Nuxt.js",
      svelte: " Svelte",
      vanilla: " Vanilla JavaScript",
      jquery: " jQuery",
      bootstrap: " Bootstrap + HTML/CSS",
      tailwind: " Tailwind CSS + HTML",
    },
    backend: {
      nodejs: " Node.js + Express",
      python_django: " Python + Django",
      python_flask: " Python + Flask",
      python_fastapi: " Python + FastAPI",
      php_laravel: " PHP + Laravel",
      php_symfony: " PHP + Symfony",
      php_codeigniter: " PHP + CodeIgniter",
      ruby_rails: " Ruby on Rails",
      java_spring: " Java + Spring Boot",
      csharp_dotnet: " C# + .NET Core",
      go: " Go (Golang)",
      rust: " Rust",
    },
    database: {
      mysql: " MySQL",
      postgresql: " PostgreSQL",
      mongodb: " MongoDB",
      sqlite: " SQLite",
      redis: " Redis",
      mariadb: " MariaDB",
      oracle: " Oracle Database",
      mssql: " Microsoft SQL Server",
      dynamodb: " AWS DynamoDB",
      firestore: " Google Firestore",
      cassandra: " Apache Cassandra",
    },
    hosting: {
      aws: " Amazon Web Services (AWS)",
      azure: " Microsoft Azure",
      gcp: " Google Cloud Platform",
      vercel: " Vercel",
      netlify: " Netlify",
      heroku: " Heroku",
      digitalocean: " DigitalOcean",
      linode: " Linode",
      cloudflare: " Cloudflare Pages",
      shared_hosting: " Shared Hosting",
      vps: " VPS Hosting",
      dedicated: " Dedicated Server",
    },
    devops: {
      docker: " Docker",
      kubernetes: " Kubernetes",
      jenkins: " Jenkins CI/CD",
      github_actions: " GitHub Actions",
      gitlab_ci: " GitLab CI/CD",
      terraform: " Terraform",
      ansible: " Ansible",
      nginx: " Nginx",
      apache: " Apache",
      basic_deployment: " Basic Deployment",
    },
    additionalServices: {
      cdn: " Content Delivery Network (CDN)",
      ssl: " SSL Certificate",
      monitoring: " Application Monitoring",
      backup: " Automated Backup",
      load_balancer: " Load Balancer",
      caching: " Advanced Caching",
      search_engine: " Search Engine (Elasticsearch)",
      email_service: " Email Service Integration",
      analytics: " Advanced Analytics",
      security_audit: " Security Audit",
    },
  };

  const performanceLabels = {
    basic: "⚡ Basic Performance (Standard loading)",
    optimized: "🚀 Optimized Performance (Fast loading)",
    high_performance: "⚡ High Performance (Very fast loading)",
    enterprise: "🏆 Enterprise Performance (Ultra-fast loading)",
  };
  const selectedPerformance =
    performanceLabels[formData.performanceLevel] ||
    formData.performanceLevel ||
    "—";

  if (formData.logoDesign) {
    const logoLabels = {
      no: "✅ No logo design needed (client has existing logo)",
      basic: "🎨 Basic Logo Design",
      premium: "✨ Premium Logo Design with variations",
      complete_branding: "🏆 Complete Brand Identity Package",
    };
  }

  const featureLabels = {
    adminPanel: "Admin Panel & CMS",
    userAuthentication: "User Authentication System",
    roleBasedAccess: "Role-based Access Control",
    productManagement: "Product Management",
    shoppingCart: "Shopping Cart & Checkout",
    orderTracking: "Order Tracking System",
    inventoryManagement: "Inventory Management",
    blogNewsModule: "Blog & News Module",
    bookingCalendarModule: "Booking & Calendar System",
    liveChatChatbot: "Live Chat / Chatbot",
    socialMediaIntegration: "Social Media Integration",
    googleAnalytics: "Google Analytics & Tracking",
    seoSetup: "Advanced SEO Setup",
  };

  let html = `
        <div class="summary-grid">
            <div class="summary-section">
                <div class="summary-section-header">
                    <i class="fas fa-user"></i>
                    <h3>Client Information</h3>
                </div>
                <div class="summary-details">
                    <div class="detail-item">
                        <span class="detail-label">Client:</span>
                        <span class="detail-value">${formData.clientName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Company:</span>
                        <span class="detail-value">${
                          formData.companyName
                        }</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Project:</span>
                        <span class="detail-value">${
                          formData.projectTitle
                        }</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${formData.email}</span>
                    </div>
                    ${
                      formData.phone
                        ? `
                        <div class="detail-item">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${formData.phone}</span>
                        </div>
                    `
                        : ""
                    }
                    ${
                      formData.budgetRange
                        ? `
                        <div class="detail-item">
                            <span class="detail-label">Budget Range:</span>
                            <span class="detail-value">${formData.budgetRange}</span>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
            
            <div class="summary-section">
                <div class="summary-section-header">
                    <i class="fas fa-project-diagram"></i>
                    <h3>Project Overview</h3>
                </div>
                <div class="summary-details">
                    <div class="detail-item">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">${
                          formData.projectType
                        }</span>
                    </div>
                    ${
                      formData.targetAudience
                        ? `
                        <div class="detail-item">
                            <span class="detail-label">Target Audience:</span>
                            <span class="detail-value">${formData.targetAudience.join(
                              ", "
                            )}</span>
                        </div>
                    `
                        : ""
                    }
                    ${
                      formData.projectGoal
                        ? `
                        <div class="detail-item">
                            <span class="detail-label">Goal:</span>
                            <span class="detail-value">${formData.projectGoal}</span>
                        </div>
                    `
                        : ""
                    }
                    ${
                      formData.deviceCompatibility
                        ? `
                        <div class="detail-item">
                            <span class="detail-label">Device Support:</span>
                            <span class="detail-value">${formData.deviceCompatibility.join(
                              ", "
                            )}</span>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
        
        ${
          formData.websiteType
            ? `
          <div class="summary-section">
              <div class="summary-section-header">
                  <i class="fas fa-globe"></i>
                  <h3>Website Type & Structure</h3>
              </div>
              <div class="summary-details">
                  <div class="detail-item">
                      <span class="detail-label">Website Type:</span>
                      <span class="detail-value">${
                        websiteTypeLabels[formData.websiteType] ||
                        formData.websiteType
                      }</span>
                  </div>
                  ${
                    formData.numberOfPages
                      ? `
                      <div class="detail-item">
                          <span class="detail-label">Number of Pages:</span>
                          <span class="detail-value">${formData.numberOfPages}</span>
                      </div>
                  `
                      : ""
                  }
                  ${
                    formData.performanceLevel
                      ? `
                      <div class="detail-item">
                          <span class="detail-label">Performance Level:</span>
                          <span class="detail-value">${
                            performanceLabels[formData.performanceLevel] ||
                            formData.performanceLevel
                          }</span>
                      </div>
                  `
                      : ""
                  }
                  ${
                    formData.logoDesign
                      ? `
                      <div class="detail-item">
                          <span class="detail-label">Logo Design:</span>
                          <span class="detail-value">${formData.logoDesign}</span>
                      </div>
                  `
                      : ""
                  }
                  ${
                    formData.accessibilityCompliance
                      ? `
                      <div class="detail-item">
                          <span class="detail-label">Accessibility:</span>
                          <span class="detail-value">${formData.accessibilityCompliance}</span>
                      </div>
                  `
                      : ""
                  }
                  ${
                    formData.multilingualSupport &&
                    formData.multilingualSupport.length > 0
                      ? `
                      <div class="detail-item">
                          <span class="detail-label">Languages:</span>
                          <span class="detail-value">${formData.multilingualSupport.join(
                            ", "
                          )}</span>
                      </div>
                  `
                      : ""
                  }
              </div>
          </div>
      `
            : ""
        }
      <!-- Technology Stack Section -->
      ${(() => {
        const techStack = [];
        if (formData.frontendTech)
          techStack.push(`Frontend: ${formData.frontendTech}`);
        if (formData.backendTech)
          techStack.push(`Backend: ${formData.backendTech}`);
        if (formData.databaseTech)
          techStack.push(`Database: ${formData.databaseTech}`);
        if (formData.hostingTech)
          techStack.push(`Hosting: ${formData.hostingTech}`);
        if (formData.devopsTech)
          techStack.push(`DevOps: ${formData.devopsTech}`);
        if (formData.additionalServices)
          techStack.push(`Services: ${formData.additionalServices}`);

        return techStack.length > 0
          ? `
      <div class="summary-section">
        <div class="summary-section-header">
          <i class="fas fa-code"></i>
          <h3>Technology Stack</h3>
        </div>
        <div class="feature-list">
          ${techStack
            .map(
              (tech) => `
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>${tech}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
          : "";
      })()}


        
        <div class="summary-section">
            <div class="summary-section-header">
                <i class="fas fa-cogs"></i>
                <h3>Selected Features</h3>
            </div>
            <div class="feature-list">
                ${Object.keys(featureLabels)
                  .filter((key) => formData[key])
                  .map(
                    (key) => `
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>${featureLabels[key]}</span>
                    </div>
                `
                  )
                  .join("")}
                ${
                  formData.paymentGateway && formData.paymentGateway.length > 0
                    ? formData.paymentGateway
                        .map(
                          (gateway) => `
                        <div class="feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Payment Gateway: ${gateway.toUpperCase()}</span>
                        </div>
                    `
                        )
                        .join("")
                    : ""
                }
                ${
                  formData.cmsRequired
                    ? `
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>CMS: ${formData.cmsRequired.toUpperCase()}</span>
                    </div>
                `
                    : ""
                }
            </div>
        </div>
        
        <div class="cost-summary">
            <div class="cost-summary-header">
                <i class="fas fa-calculator"></i>
                <h3>Investment Breakdown</h3>
            </div>
            <div class="cost-summary-grid">
                <div class="cost-summary-item">
                    <span class="cost-label">Base Development</span>
                    <span class="cost-value">₹${formatCurrency(
                      costs.baseCost
                    )}</span>
                </div>
                <div class="cost-summary-item">
                    <span class="cost-label">Advanced Features</span>
                    <span class="cost-value">₹${formatCurrency(
                      costs.featuresCost
                    )}</span>
                </div>
                <div class="cost-summary-item total">
                    <span class="cost-label">Total Investment</span>
                    <span class="cost-value">₹${formatCurrency(
                      costs.totalCost
                    )}</span>
                </div>
                <div class="cost-summary-item">
                    <span class="cost-label">Timeline</span>
                    <span class="cost-value">${calculateTimeline()}</span>
                </div>
            </div>
        </div>
        
        <div class="summary-actions">
            <button onclick="downloadExcel()" class="action-btn primary">
                <i class="fas fa-file-excel"></i>
                Download Excel Sheet
            </button>
            <button type="button "onclick="downloadPDF()" class="action-btn primary">
                <i class="fas fa-file-pdf"></i>
                Download PDF Quote
            </button>
        </div>

    `;

  return html;
}

// Animate elements on scroll
function animateOnScroll() {
  const sections = document.querySelectorAll(".form-section");
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < windowHeight * 0.8) {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }
  });
}

// Excel download functionality
function downloadExcel() {
  // Get existing quotations from local storage
  let existingQuotations = getQuotationsFromLocalStorage();

  // Prepare current quotation data
  const currentQuotation = prepareExcelRowData();

  // Add current quotation to the list
  existingQuotations.push(currentQuotation);

  // Create table-format CSV content
  const csvContent = createTableCSV(existingQuotations);

  // Create and download file
  const blob = new Blob([csvContent], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotations_master_file.xls";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  // Store updated quotations in local storage
  storeQuotationInLocalStorage(currentQuotation);

  // Show success message
  alert("Excel file updated successfully with new quotation data!");
}

// Prepare data for Excel row format with auto-fill for empty cells
function prepareExcelRowData() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  // Define default values for empty cells based on your options data
  const defaultValues = {
    projectType: "website",
    websiteType: "informational",
    frontendTech: "react",
    backendTech: "nodejs", 
    databaseTech: "mysql",
    hostingTech: "shared_hosting",
    devopsTech: "basic_deployment",
    additionalServices: "ssl",
    performanceLevel: "basic",
    logoDesign: "no",
    cmsRequired: "wordpress",
    accessibilityCompliance: "basic",
    deviceCompatibility: ["desktop", "mobile"],
    paymentGateway: ["razorpay"],
    multilingualSupport: ["English"],
    targetAudience: ["General Public"]
  };

  // Helper function to fill empty values
  const fillEmptyValue = (value, defaultValue) => {
    if (!value || value.trim() === "" || value === null || value === undefined) {
      return defaultValue;
    }
    return value;
  };

  // Helper function for arrays
  const fillEmptyArray = (arr, defaultArr) => {
    if (!arr || arr.length === 0 || (arr.length === 1 && (!arr[0] || arr[0].trim() === ""))) {
      return defaultArr;
    }
    return arr;
  };

  const websiteTypeLabels = {
    informational: "Informational Website",
    ecommerce: "eCommerce Store", 
    booking: "Booking System",
    membership: "Membership Platform",
    dashboard: "Dashboard",
    portfolio: "Portfolio Website",
    realestate: "Real Estate",
    socialmedia: "Social Media Platforms",
    learningmanagementsystem: "Learning Management System",
    fintechapplications: "Fintech Applications", 
    saasproduct: "SaaS Products",
    marketplace: "Marketplace",
    newsmagzines: "News / Magazines",
  };

  const featureLabels = {
    adminPanel: "Admin Panel",
    userAuthentication: "User Auth",
    roleBasedAccess: "Role Access", 
    productManagement: "Product Mgmt",
    shoppingCart: "Shopping Cart",
    orderTracking: "Order Tracking",
    inventoryManagement: "Inventory Mgmt",
    blogNewsModule: "Blog/News",
    bookingCalendarModule: "Booking Calendar",
    liveChatChatbot: "Live Chat",
    socialMediaIntegration: "Social Media",
    googleAnalytics: "Analytics",
    seoSetup: "SEO Setup",
  };

  const logoLabels = {
    no: "No logo design needed",
    basic: "Basic Logo Design", 
    premium: "Premium Logo Design",
    complete_branding: "Complete Brand Identity Package",
  };

  const performanceLabels = {
    basic: "Basic Performance",
    optimized: "Optimized Performance",
    high_performance: "High Performance", 
    enterprise: "Enterprise Performance",
  };

  const cmsLabels = {
    wordpress: "WordPress",
    strapi: "Strapi CMS",
    custom: "Custom CMS",
  };

  const accessibilityLabels = {
    basic: "Basic Accessibility",
    wcag: "Full WCAG 2.1 Compliance",
  };

  const techStackLabels = {
    frontend: {
      react: "React.js",
      vue: "Vue.js", 
      angular: "Angular",
      nextjs: "Next.js",
      nuxtjs: "Nuxt.js",
      svelte: "Svelte",
      vanilla: "Vanilla JavaScript",
      jquery: "jQuery",
      bootstrap: "Bootstrap + HTML/CSS",
      tailwind: "Tailwind CSS + HTML",
    },
    backend: {
      nodejs: "Node.js + Express",
      python_django: "Python + Django",
      python_flask: "Python + Flask", 
      python_fastapi: "Python + FastAPI",
      php_laravel: "PHP + Laravel",
      php_symfony: "PHP + Symfony",
      php_codeigniter: "PHP + CodeIgniter",
      ruby_rails: "Ruby on Rails",
      java_spring: "Java + Spring Boot",
      csharp_dotnet: "C# + .NET Core",
      go: "Go (Golang)",
      rust: "Rust",
    },
    database: {
      mysql: "MySQL",
      postgresql: "PostgreSQL",
      mongodb: "MongoDB",
      sqlite: "SQLite",
      redis: "Redis", 
      mariadb: "MariaDB",
      oracle: "Oracle Database",
      mssql: "Microsoft SQL Server",
      dynamodb: "AWS DynamoDB",
      firestore: "Google Firestore",
      cassandra: "Apache Cassandra",
    },
    hosting: {
      aws: "Amazon Web Services (AWS)",
      azure: "Microsoft Azure",
      gcp: "Google Cloud Platform",
      vercel: "Vercel",
      netlify: "Netlify",
      heroku: "Heroku",
      digitalocean: "DigitalOcean",
      linode: "Linode",
      cloudflare: "Cloudflare Pages",
      shared_hosting: "Shared Hosting",
      vps: "VPS Hosting", 
      dedicated: "Dedicated Server",
    },
    devops: {
      docker: "Docker",
      kubernetes: "Kubernetes",
      jenkins: "Jenkins CI/CD",
      github_actions: "GitHub Actions",
      gitlab_ci: "GitLab CI/CD",
      terraform: "Terraform",
      ansible: "Ansible",
      nginx: "Nginx",
      apache: "Apache",
      basic_deployment: "Basic Deployment",
    },
    additionalServices: {
      cdn: "Content Delivery Network (CDN)",
      ssl: "SSL Certificate",
      monitoring: "Application Monitoring",
      backup: "Automated Backup",
      load_balancer: "Load Balancer",
      caching: "Advanced Caching",
      search_engine: "Search Engine (Elasticsearch)",
      email_service: "Email Service Integration",
      analytics: "Advanced Analytics",
      security_audit: "Security Audit",
    },
  };

  // Auto-fill empty form data with defaults
  const filledFormData = {
    ...formData,
    projectType: fillEmptyValue(formData.projectType, defaultValues.projectType),
    websiteType: fillEmptyValue(formData.websiteType, defaultValues.websiteType),
    frontendTech: fillEmptyValue(formData.frontendTech, defaultValues.frontendTech),
    backendTech: fillEmptyValue(formData.backendTech, defaultValues.backendTech),
    databaseTech: fillEmptyValue(formData.databaseTech, defaultValues.databaseTech),
    hostingTech: fillEmptyValue(formData.hostingTech, defaultValues.hostingTech),
    devopsTech: fillEmptyValue(formData.devopsTech, defaultValues.devopsTech),
    additionalServices: fillEmptyValue(formData.additionalServices, defaultValues.additionalServices),
    performanceLevel: fillEmptyValue(formData.performanceLevel, defaultValues.performanceLevel),
    logoDesign: fillEmptyValue(formData.logoDesign, defaultValues.logoDesign),
    cmsRequired: fillEmptyValue(formData.cmsRequired, defaultValues.cmsRequired),
    accessibilityCompliance: fillEmptyValue(formData.accessibilityCompliance, defaultValues.accessibilityCompliance),
    deviceCompatibility: fillEmptyArray(formData.deviceCompatibility, defaultValues.deviceCompatibility),
    paymentGateway: fillEmptyArray(formData.paymentGateway, defaultValues.paymentGateway),
    multilingualSupport: fillEmptyArray(formData.multilingualSupport, defaultValues.multilingualSupport),
    targetAudience: fillEmptyArray(formData.targetAudience, defaultValues.targetAudience)
  };

  return {
    quotationId: `QTN-${Date.now()}`,
    generatedDate: new Date().toLocaleDateString(),
    clientName: fillEmptyValue(filledFormData.clientName, "N/A"),
    companyName: fillEmptyValue(filledFormData.companyName, "N/A"),
    projectTitle: fillEmptyValue(filledFormData.projectTitle, "Untitled Project"),
    email: fillEmptyValue(filledFormData.email, "N/A"),
    phone: fillEmptyValue(filledFormData.phone, "N/A"),
    address: fillEmptyValue(filledFormData.address, "N/A"),
    preferredStartDate: fillEmptyValue(filledFormData.preferredStartDate, "To be decided"),
    projectType: filledFormData.projectType,
    targetAudience: filledFormData.targetAudience.join(", "),
    projectGoal: fillEmptyValue(filledFormData.projectGoal, "N/A"),
    deviceCompatibility: filledFormData.deviceCompatibility.join(", "),
    websiteType: websiteTypeLabels[filledFormData.websiteType] || filledFormData.websiteType,
    cmsRequired: cmsLabels[filledFormData.cmsRequired] || filledFormData.cmsRequired,
    accessibilityCompliance: accessibilityLabels[filledFormData.accessibilityCompliance] || filledFormData.accessibilityCompliance,
    logoDesign: logoLabels[filledFormData.logoDesign] || filledFormData.logoDesign,
    performanceLevel: performanceLabels[filledFormData.performanceLevel] || filledFormData.performanceLevel,
    frontendTech: techStackLabels.frontend[filledFormData.frontendTech] || filledFormData.frontendTech,
    backendTech: techStackLabels.backend[filledFormData.backendTech] || filledFormData.backendTech,
    databaseTech: techStackLabels.database[filledFormData.databaseTech] || filledFormData.databaseTech,
    hostingTech: techStackLabels.hosting[filledFormData.hostingTech] || filledFormData.hostingTech,
    devopsTech: techStackLabels.devops[filledFormData.devopsTech] || filledFormData.devopsTech,
    additionalServices: techStackLabels.additionalServices[filledFormData.additionalServices] || filledFormData.additionalServices,
    selectedFeatures: Object.keys(featureLabels)
      .filter((key) => filledFormData[key])
      .map((key) => featureLabels[key])
      .join(", ") || "Basic features only",
    paymentGateways: filledFormData.paymentGateway.join(", "),
    multilingualSupport: filledFormData.multilingualSupport.join(", "),
    baseCost: costs.baseCost,
    featuresCost: costs.featuresCost,
    totalCostINR: costs.totalCost,
    timeline: calculateTimeline(),
    formattedBaseCost: `₹${formatCurrency(costs.baseCost)}`,
    formattedFeaturesCost: `₹${formatCurrency(costs.featuresCost)}`,
    formattedTotalINR: `₹${formatCurrency(costs.totalCost)}`,
  };
}


// Create table format CSV content
function createTableCSV(quotationsArray) {
  // Helper function to clean and escape CSV values
  function cleanCSVValue(value) {
    if (value === undefined || value === null) {
      return "";
    }
    // Convert to string and remove any existing quotes
    let cleanValue = String(value).replace(/"/g, '""');
    return cleanValue;
  }
  let csv = "";

  // Add BOM for proper Excel UTF-8 encoding
  csv += "\uFEFF";

  // Add header row with proper Excel formatting
  const headers = [
    "Sr.No",
    "Quotation ID",
    "Date",
    "Client Name",
    "Company Name",
    "Project Title",
    "Email",
    "Phone",
    "Address",
    "Start Date",
    "Project Type",
    "Target Audience",
    "Multilingual Support",
    "Project Goal",
    "Device Compatibility",
    "Website Type",
    "Logo Design",
    "Performance Level",
    "Frontend Technology", // Add this
    "Backend Technology", // Add this
    "Database Technology", // Add this
    "Hosting Platform", // Add this
    "DevOps Tools", // Add this
    "Additional Services",
    "Accessibility Compliance",
    "Selected Features",
    "Payment Gateways",
    "CMS Required",
    "Base Cost",
    "Features Cost",
    "Total Cost INR",
    "Timeline",
  ];

  csv += headers.join(",") + "\r\n";

  // Add data rows
  quotationsArray.forEach((quotation, index) => {
    const rowData = [
      index + 1,
      cleanCSVValue(quotation.quotationId),
      cleanCSVValue(quotation.generatedDate),
      cleanCSVValue(quotation.clientName),
      cleanCSVValue(quotation.companyName),
      cleanCSVValue(quotation.projectTitle),
      cleanCSVValue(quotation.email),
      cleanCSVValue(quotation.phone),
      cleanCSVValue(quotation.address),
      cleanCSVValue(quotation.preferredStartDate),
      cleanCSVValue(quotation.projectType),
      cleanCSVValue(quotation.targetAudience),
      cleanCSVValue(quotation.multilingualSupport),
      cleanCSVValue(quotation.projectGoal),
      cleanCSVValue(quotation.deviceCompatibility),
      cleanCSVValue(quotation.websiteType),
      cleanCSVValue(quotation.logoDesign),
      cleanCSVValue(quotation.performanceLevel),
      cleanCSVValue(quotation.frontendTech), // Add this
      cleanCSVValue(quotation.backendTech), // Add this
      cleanCSVValue(quotation.databaseTech), // Add this
      cleanCSVValue(quotation.hostingTech), // Add this
      cleanCSVValue(quotation.devopsTech), // Add this
      cleanCSVValue(quotation.additionalServices),
      cleanCSVValue(quotation.accessibilityCompliance),
      cleanCSVValue(quotation.selectedFeatures),
      cleanCSVValue(quotation.paymentGateways),
      cleanCSVValue(quotation.cmsRequired),
      cleanCSVValue(quotation.formattedBaseCost),
      cleanCSVValue(quotation.formattedFeaturesCost),
      cleanCSVValue(quotation.formattedTotalINR),
      cleanCSVValue(quotation.timeline),
    ];

    // Properly quote each field that contains commas or special characters
    const quotedRow = rowData.map((field) => {
      const fieldStr = String(field);
      if (
        fieldStr.includes(",") ||
        fieldStr.includes('"') ||
        fieldStr.includes("\n") ||
        fieldStr.includes("\r")
      ) {
        return `"${fieldStr}"`;
      }
      return fieldStr;
    });

    csv += quotedRow.join(",") + "\r\n";
  });

  return csv;
}

// Store quotation data in local storage
function storeQuotationInLocalStorage(data) {
  try {
    // Get existing quotations from local storage
    let existingQuotations = JSON.parse(
      localStorage.getItem("quotationsTable") || "[]"
    );

    // Add new quotation to the array
    existingQuotations.push(data);

    // Store updated quotations array
    localStorage.setItem("quotationsTable", JSON.stringify(existingQuotations));

    // Store latest quotation separately for quick access
    localStorage.setItem("latestQuotation", JSON.stringify(data));

    console.log("Quotation stored in local storage:", data.quotationId);
  } catch (error) {
    console.error("Error storing quotation in local storage:", error);
  }
}

// Function to retrieve quotations from local storage
function getQuotationsFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem("quotationsTable") || "[]");
  } catch (error) {
    console.error("Error retrieving quotations from local storage:", error);
    return [];
  }
}

// Function to get latest quotation
function getLatestQuotation() {
  try {
    return JSON.parse(localStorage.getItem("latestQuotation") || "null");
  } catch (error) {
    console.error("Error retrieving latest quotation:", error);
    return null;
  }
}

// Add CSS for summary styling
const summaryStyles = `
<style>
.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.summary-section {
    background: rgba(255, 255, 255, 0.6);
    padding: 25px;
    border-radius: 15px;
    border: 2px solid #e5e7eb;
    margin-bottom: 25px;
}

.summary-section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: #374151;
}

.summary-section-header i {
    font-size: 1.5rem;
    margin-right: 15px;
    color: #667eea;
}

.summary-section-header h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
}

.summary-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
}

.detail-label {
    font-weight: 600;
    color: #6b7280;
}

.detail-value {
    color: #374151;
    text-align: right;
}

.feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.feature-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.feature-item i {
    color: #10b981;
    margin-right: 10px;
}

.cost-summary {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: white;
    padding: 30px;
    border-radius: 20px;
    margin: 30px 0;
}

.cost-summary-header {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
}

.cost-summary-header i {
    font-size: 1.8rem;
    margin-right: 15px;
    color: #ffd700;
}

.cost-summary-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: #ffd700;
}

.cost-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.cost-summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.cost-summary-item.total {
    border: 2px solid #ffd700;
    background: rgba(255, 215, 0, 0.1);
}

.cost-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
    text-align: center;
}

.cost-value {
    font-size: 1.3rem;
    font-weight: 700;
    font-family: 'Courier New', monospace;
}

.cost-summary-item.total .cost-value {
    font-size: 1.5rem;
    color: #ffd700;
}

.summary-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
    flex-wrap: wrap;
}

.action-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
}

.action-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
    border: 2px solid #e5e7eb;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
    .summary-grid {
        grid-template-columns: 1fr;
    }
    
    .feature-list {
        grid-template-columns: 1fr;
    }
    
    .cost-summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .summary-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .action-btn {
        width: 100%;
        max-width: 300px;
        justify-content: center;
    }
}
</style>
`;

// Inject summary styles
document.head.insertAdjacentHTML("beforeend", summaryStyles);
