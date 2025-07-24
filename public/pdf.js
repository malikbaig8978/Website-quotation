// pdf.js - Dedicated PDF Generation Module

// Initialize PDF generation when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // Ensure PDF libraries are loaded before initializing
    checkPDFLibraries();
});

// Check if PDF libraries are loaded
function checkPDFLibraries() {
    const checkInterval = setInterval(() => {
        if (typeof window.jspdf !== 'undefined' && typeof html2canvas !== 'undefined') {
            console.log('PDF libraries loaded successfully');
            clearInterval(checkInterval);
        }
    }, 100);

    // Timeout after 5 seconds if libraries don't load
    setTimeout(() => {
        clearInterval(checkInterval);
        if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
            console.error('PDF libraries failed to load');
        }
    }, 5000);
}

// Main PDF download function
function downloadPDF() {
    // Validate form data before generating PDF
    if (!validatePDFData()) {
        alert('Please fill in all required fields before generating the PDF.');
        return;
    }

    // Show loading indicator
    showPDFLoadingIndicator();

    // Create a temporary container for PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 200mm;
        background: white;
        padding: 10mm;
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.4;
    `;
    
    // Generate clean HTML for PDF
    const pdfHTML = generatePDFHTML();
    pdfContainer.innerHTML = pdfHTML;
    document.body.appendChild(pdfContainer);
    
    // Use html2canvas to convert HTML to image, then to PDF
    html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 760,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 760,
        windowHeight: 1000
    }).then(canvas => {
        try {
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 200;
            const pageHeight = 287;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 5;
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add additional pages if content exceeds one page
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 5;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `Quotation_${formData.clientName || 'Client'}_${timestamp}.pdf`;
            
            // Download the PDF
            pdf.save(filename);
            
            // Clean up
            document.body.removeChild(pdfContainer);
            hidePDFLoadingIndicator();
            
            // Store PDF info in local storage
            storePDFInfo(filename);
            
            // Show success message
            showPDFSuccessMessage(filename);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            document.body.removeChild(pdfContainer);
            hidePDFLoadingIndicator();
            showPDFErrorMessage(error.message);
        }
    }).catch(error => {
        console.error('Error with html2canvas:', error);
        document.body.removeChild(pdfContainer);
        hidePDFLoadingIndicator();
        showPDFErrorMessage('Failed to generate PDF. Please try again.');
    });
}

// Generate clean HTML specifically for PDF (WITHOUT Icons)
function generatePDFHTML() {
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
        realestate: "Real Estate",
        socialmedia: "Social Media Platforms",
        learningmanagementsystem: "Learning Management System",
        fintechapplications: "Fintech Applications",
        saasproduct: "SaaS Products",
        marketplace: "Marketplace",
        newsmagzines: "News / Magazines",
        healthcare: "Healthcare"
    };

    const logoLabels = {
        no: "No logo design needed",
        basic: "Basic Logo Design",
        premium: "Premium Logo Design",
        complete_branding: "Complete Brand Identity Package"
    };

    const performanceLabels = {
        basic: "Basic Performance",
        optimized: "Optimized Performance", 
        high_performance: "High Performance",
        enterprise: "Enterprise Performance"
    };

    const cmsLabels = {
        wordpress: "WordPress",
        strapi: "Strapi CMS",
        custom: "Custom CMS"
    };

    const accessibilityLabels = {
        basic: "Basic Accessibility",
        wcag: "Full WCAG 2.1 Compliance"
    };

    // Calculate dates
    const currentDate = new Date();
    const validUntilDate = new Date();
    validUntilDate.setDate(currentDate.getDate() + 30); // Valid for 30 days

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Calculate GST and final amounts
    const subtotalCost = costs.totalCost;
    const gstAmount = Math.round(subtotalCost * 0.18);
    const finalTotalCost = subtotalCost + gstAmount;

    let html = `
        <div style="max-width: 100%; margin: 0 auto; padding: 5mm 0; font-size: 14px; min-height: 100vh;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 15px; border-bottom: 3px solid #667eea; padding-bottom: 12px; page-break-inside: avoid;">
                <h1 style="color: #667eea; margin: 0; font-size: 26px;">Website Development Quotation</h1>
                <p style="margin: 6px 0; color: #666; font-size: 14px;">Quotation ID: QTN-${Date.now()}</p>
                <p style="margin: 6px 0; color: #666; font-size: 14px;">Date: ${formatDate(currentDate)}</p>
            </div>

            <!-- Client Information -->
            <div style="margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px;">Client Information</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
                    <div><strong>Client Name:</strong> ${formData.clientName || "—"}</div>
                    <div><strong>Company:</strong> ${formData.companyName || "—"}</div>
                    <div><strong>Email:</strong> ${formData.email || "—"}</div>
                    <div><strong>Phone:</strong> ${formData.phone || "—"}</div>
                </div>
            </div>

            <!-- Project Overview -->
            <div style="margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px;">Project Overview</h2>
                <div style="font-size: 14px;">
                    <div style="margin-bottom: 4px;"><strong>Project Title:</strong> ${formData.projectTitle || "—"}</div>
                    <div style="margin-bottom: 4px;"><strong>Project Goal:</strong> ${formData.projectGoal || "—"}</div>
                    <div style="margin-bottom: 4px;"><strong>Project Type:</strong> ${formData.projectType || "—"}</div>
                    <div style="margin-bottom: 4px;"><strong>Website Type:</strong> ${websiteTypeLabels[formData.websiteType] || formData.websiteType || "—"}</div>
                    <div style="margin-bottom: 4px;"><strong>Performance Level:</strong> ${performanceLabels[formData.performanceLevel] || "—"}</div>
                    <div style="margin-bottom: 4px;"><strong>Timeline:</strong> ${calculateTimeline()}</div>
                    <div style="margin-bottom: 4px;"><strong>Preferred Start Date:</strong> ${formData.preferredStartDate || "To be discussed"}</div>
                    ${formData.deviceCompatibility && formData.deviceCompatibility.length > 0 ? `
                        <div style="margin-bottom: 4px;"><strong>Device Compatibility:</strong> ${formData.deviceCompatibility.join(", ")}</div>
                    ` : ''}
                </div>
            </div>

            <!-- Website Development Particulars -->
            <div style="margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px;">Website Development Particulars</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 13px;">
                    <div style="margin-bottom: 2px;">✓ Static website with 5 professional pages</div>
                    <div style="margin-bottom: 2px;">✓ Website Design & UI/UX</div>
                    <div style="margin-bottom: 2px;">✓ Frontend & Backend Development</div>
                    <div style="margin-bottom: 2px;">✓ User Interactive Animations</div>
                    <div style="margin-bottom: 2px;">✓ Comprehensive Testing</div>
                    <div style="margin-bottom: 2px;">✓ Basic SEO & Performance Optimizations</div>
                    <div style="margin-bottom: 2px;">✓ Mobile-responsive design</div>
                    <div style="margin-bottom: 2px;">✓ Cross-browser compatibility</div>
                </div>
            </div>

            <!-- Technical Requirements -->
            <div style="margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px;">Technical Requirements</h2>
                <div style="font-size: 14px;">
                    ${formData.logoDesign ? `<div style="margin-bottom: 4px;"><strong>Logo Design:</strong> ${logoLabels[formData.logoDesign] || formData.logoDesign}</div>` : ''}
                    ${formData.cmsRequired ? `<div style="margin-bottom: 4px;"><strong>CMS:</strong> ${cmsLabels[formData.cmsRequired] || formData.cmsRequired}</div>` : ''}
                    ${formData.accessibilityCompliance ? `<div style="margin-bottom: 4px;"><strong>Accessibility:</strong> ${accessibilityLabels[formData.accessibilityCompliance] || formData.accessibilityCompliance}</div>` : ''}
                    ${formData.multilingualSupport && formData.multilingualSupport.length > 0 ? `<div style="margin-bottom: 4px;"><strong>Languages:</strong> ${formData.multilingualSupport.join(", ")}</div>` : ''}
                </div>
            </div>

            <!-- Selected Features -->
            <div style="margin-bottom: 50px; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px;">Selected Features</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 13px;">
                    ${Object.keys(formData).filter(key => formData[key] === true && PRICING && PRICING.features && PRICING.features[key]).map(feature => {
                        const featureNames = {
                            adminPanel: "Admin Panel",
                            userAuthentication: "User Authentication",
                            roleBasedAccess: "Role-based Access Control",
                            productManagement: "Product Management",
                            shoppingCart: "Shopping Cart",
                            orderTracking: "Order Tracking",
                            inventoryManagement: "Inventory Management",
                            blogNewsModule: "Blog/News Module",
                            bookingCalendarModule: "Booking Calendar",
                            liveChatChatbot: "Live Chat/Chatbot",
                            socialMediaIntegration: "Social Media Integration",
                            googleAnalytics: "Google Analytics",
                            seoSetup: "SEO Setup"
                        };
                        return `<div style="margin-bottom: 2px;">• ${featureNames[feature] || feature}</div>`;
                    }).join('')}
                    ${formData.paymentGateway && formData.paymentGateway.length > 0 ? 
                        `<div style="margin-bottom: 2px;">• Payment Gateway: ${formData.paymentGateway.map(gateway => gateway.toUpperCase()).join(", ")}</div>` : ''
                    }
                </div>
            </div>

            <!-- Force page break with large space -->
            <div style="page-break-before: always; height: 52mm;"></div>

            <!-- Investment Breakdown on New Page -->
            <div style="margin-top: 0; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 15px; margin-top: 0;">Investment Breakdown</h2>
                
                <!-- Simplified Cost Table -->
                <div style="page-break-inside: avoid; break-inside: avoid;">
                    <table style="width: 100%; border-collapse: collapse; border: 2px solid #333; font-size: 12px; margin-bottom: 20px;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 12px 8px; text-align: left; border: 1px solid #333; font-weight: 700;">Description</th>
                                <th style="padding: 12px 8px; text-align: center; border: 1px solid #333; font-weight: 700;">INR (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 10px 8px; border: 1px solid #333;">Base Development</td>
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #333;">₹${formatCurrency(costs.baseCost)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 8px; border: 1px solid #333;">Advanced Features</td>
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #333;">₹${formatCurrency(costs.featuresCost)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 8px; border: 1px solid #333;">Subtotal</td>
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #333;">₹${formatCurrency(subtotalCost)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 8px; border: 1px solid #333;">GST (18%)</td>
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #333;">₹${formatCurrency(gstAmount)}</td>
                            </tr>
                            <tr style="background-color: #f0f0f0;">
                                <td style="padding: 12px 8px; border: 1px solid #333; font-weight: 700;">Total Investment (Including GST)</td>
                                <td style="padding: 12px 8px; text-align: center; border: 1px solid #333; font-weight: 700;">₹${formatCurrency(finalTotalCost)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 8px; border: 1px solid #333; font-weight: 600;">Project Timeline</td>
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #333;" colspan="3">${calculateTimeline()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Commercial Terms & Conditions -->
            <div style="margin-bottom: 20px; margin-top: 25px; page-break-inside: avoid; break-inside: avoid;">
                <h2 style="color: #667eea; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 12px;">Commercial Terms & Conditions</h2>
                <div style="font-size: 13px; line-height: 1.6;">
                    <div style="margin-bottom: 10px;"><strong>Payment Schedule:</strong></div>
                    <div style="margin-bottom: 8px; margin-left: 15px;">• 100% Hosting payment in advance</div>
                    <div style="margin-bottom: 8px; margin-left: 15px;">• 50% Development payment in advance</div>
                    <div style="margin-bottom: 8px; margin-left: 15px;">• 30% after Phase III completion</div>
                    <div style="margin-bottom: 8px; margin-left: 15px;">• 20% on final delivery</div>
                    
                    <div style="margin-bottom: 8px; margin-top: 12px;"><strong>GST:</strong> 18% extra as applicable</div>
                    
                    <div style="margin-bottom: 8px;"><strong>Maintenance:</strong> Post-launch maintenance will be charged separately upon discussion</div>
                    
                    <div style="margin-bottom: 8px;"><strong>Hosting:</strong> 3-year hosting package includes technical support and basic maintenance</div>
                    
                    <div style="margin-bottom: 8px;"><strong>Revisions:</strong> Up to 3 rounds of revisions included in each phase</div>
                    
                    <div style="margin-bottom: 8px;"><strong>Content:</strong> Client to provide all content, images, and materials in timely manner</div>
                    
                    <div style="margin-bottom: 8px;"><strong>Validity:</strong> This quotation is valid for 30 days from the date mentioned</div>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: right; padding: 15px 0; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; page-break-inside: avoid; break-inside: avoid; margin-top: 20px;">
                <p style="margin: 4px 0;"><em>Malik Ahmed Baig</em></p>
                <p style="margin: 4px 0;"><em>Email: malikmoghal5@gmail.com</em></p>
            </div>
        </div>
    `;

    return html;
}

// Store PDF info in local storage
function storePDFInfo(filename) {
    try {
        const pdfInfo = {
            filename: filename,
            clientName: formData.clientName,
            projectTitle: formData.projectTitle,
            totalCost: costs.totalCost,
            generatedDate: new Date().toISOString(),
            quotationId: `QTN-${Date.now()}`
        };

        // Get existing PDF records
        let existingPDFs = JSON.parse(localStorage.getItem("generatedPDFs") || "[]");
        existingPDFs.push(pdfInfo);
        localStorage.setItem("generatedPDFs", JSON.stringify(existingPDFs));

        console.log("PDF info stored:", filename);
    } catch (error) {
        console.error("Error storing PDF info:", error);
    }
}

// Validate PDF data before generation
function validatePDFData() {
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

    return true;
}

// Show loading indicator
function showPDFLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'pdf-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    loader.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 0 auto 20px;"></div>
            <p style="margin: 0; font-size: 16px; color: #333;">Generating PDF...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loader);
}

// Hide loading indicator
function hidePDFLoadingIndicator() {
    const loader = document.getElementById('pdf-loader');
    if (loader) {
        document.body.removeChild(loader);
    }
}

// Show success message
function showPDFSuccessMessage(filename) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    message.innerHTML = `
        <div style="display: flex; align-items: center;">
            <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
            <div>
                <strong>PDF Generated Successfully!</strong><br>
                <small>${filename}</small>
            </div>
        </div>
    `;
    document.body.appendChild(message);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 5000);
}

// Show error message
function showPDFErrorMessage(errorMsg) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;     
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    message.innerHTML = `
        <div style="display: flex; align-items: center;">
            <i class="fas fa-exclamation-circle" style="margin-right: 10px;"></i>
            <div>
                <strong>PDF Generation Failed</strong><br>
                <small>${errorMsg}</small>
            </div>
        </div>
    `;
    document.body.appendChild(message);

    // Auto remove after 7 seconds
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 7000);
}

// Function to get PDF generation history
function getPDFHistory() {
    try {
        return JSON.parse(localStorage.getItem("generatedPDFs") || "[]");
    } catch (error) {
        console.error("Error retrieving PDF history:", error);
        return [];
    }
}

// Function to clear PDF generation history
function clearPDFHistory() {
    try {
        localStorage.removeItem("generatedPDFs");
        console.log("PDF history cleared");
        return true;
    } catch (error) {
        console.error("Error clearing PDF history:", error);
        return false;
    }
}

// Export functions for external use
window.downloadPDF = downloadPDF;
window.getPDFHistory = getPDFHistory;
window.clearPDFHistory = clearPDFHistory;
