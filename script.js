// Function to create a night sky with twinkling stars
function createStars() {
  const starsContainer = document.querySelector('.stars'); // Get the container where stars will appear

  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div'); // Create a star div
    star.classList.add('star'); // Give it a class for styling

    // Random position and animation delay
    const randomLeft = Math.random() * 100 + '%';
    const randomTop = Math.random() * 100 + '%';
    const twinkleDelay = Math.random() * 2 + 's';

    star.style.left = randomLeft;
    star.style.top = randomTop;
    star.style.animationDelay = twinkleDelay;

    starsContainer.appendChild(star); // Add star to the container
  }
}

// Show how far the user has scrolled with a progress bar
function updateProgressBar() {
  const scrollY = window.pageYOffset; // How far we’ve scrolled
  const pageHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollY / pageHeight) * 100;

  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = scrollPercent + '%';
}

// Make steps appear smoothly when they come into view
function animateStepsOnScroll() {
  const steps = document.querySelectorAll('.step');

  steps.forEach(step => {
    const position = step.getBoundingClientRect(); // Check where the step is

    const isVisible = position.top < window.innerHeight && position.bottom > 0;

    if (isVisible) {
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
    }
  });
}

// Set up your page when it loads
function initializePage() {
  createStars();

  // Make steps hidden initially
  document.querySelectorAll('.step').forEach(step => {
    // step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Animate steps after 100ms
  setTimeout(animateStepsOnScroll, 100);
}

// When the page scrolls, update the progress bar and animate steps
window.addEventListener('scroll', () => {
  updateProgressBar();
  showCompletionBadge();
  animateStepsOnScroll();
});

initializePage(); // Start everything!

// Global tracker
// Store selected components in an object
let selectedComponents = {};

document.addEventListener("DOMContentLoaded", function () {
    let allSteps = document.querySelectorAll(".step");

    for (let i = 0; i < allSteps.length; i++) {
        let step = allSteps[i];
        let componentOptions = step.querySelectorAll(".component-option");
        let componentType = step.getAttribute("data-component");

        for (let j = 0; j < componentOptions.length; j++) {
            let option = componentOptions[j];

            option.addEventListener("click", function () {
                // Deselect all options in this step
                for (let k = 0; k < componentOptions.length; k++) {
                    componentOptions[k].classList.remove("selected");
                }

                // Highlight selected option
                this.classList.add("selected");

                // Get the selected option's name and price
                let name = this.getAttribute("data-name");
                let price = parseFloat(this.getAttribute("data-price"));

                // Save selection to the object
                selectedComponents[componentType] = {
                    name: name,
                    price: price
                };

                updateSummary();
                updateProgress();
                updateBuildStatus();
                updatePerformanceEstimate();
            });
        }
    }
});

// Update the summary section
function updateSummary() {
    let totalCost = 0;
    let totalSelected = 0;

    for (let key in selectedComponents) {
        totalCost += selectedComponents[key].price;
        totalSelected++;
    }

    document.getElementById("totalCost").textContent = "$" + totalCost.toFixed(2);
    document.getElementById("componentsSelected").textContent = totalSelected + "/9";

    let buildStatus = totalSelected === 9 ? "✅ Complete" : "In Progress";
    document.getElementById("buildStatus").textContent = buildStatus;

    updatePerformanceEstimate();
}

// Show progress circle
function updateProgress() {
    let totalParts = 9;
    let selectedCount = Object.keys(selectedComponents).length;
    let percent = Math.round((selectedCount / totalParts) * 100);

    document.getElementById("progressCircle").textContent = percent + "%";
    document.getElementById("progressText").textContent = selectedCount + "/" + totalParts + " Components";
}

// Build status message
function updateBuildStatus() {
    let isComplete = Object.keys(selectedComponents).length === 9;
    let statusText = isComplete ? "Complete" : "Incomplete";

    document.getElementById("buildStatus").textContent = "Build Status: " + statusText;
}

// Estimate performance based on CPU and GPU
function updatePerformanceEstimate() {
    let gpuName = selectedComponents["GPU (Graphics Card)"]?.name || "";

    let score = 0

    // Score the GPU
    if (gpuName.includes("5090")) {
        score += 5;
    } else if (gpuName.includes("4080")) {
        score += 4;
    } else if (gpuName.includes("4070")) {
        score += 3;
    } else if (gpuName.includes("7600")) {
        score += 1;
    }

    let performance = "Estimated Performance: Select GPU";

    if (score >= 5) {
        performance = "Ultimate: 4K+ Ray Tracing Gaming";
    } else if (score >= 4) {
        performance = "High End: 4K Gaming";
    } else if (score >= 3) {
        performance = "Mid-Range: 1440P Gaming";
    } else if (score >= 1) {
        performance = "Entry-Level: 1080P Gaming";
    }

    document.getElementById("performanceLevel").textContent = performance;
}

function resetBuild() {
    // 1. Clear the selected components
    selectedComponents = {};

    // 2. Remove .selected class from all options
    let selectedElements = document.querySelectorAll(".component-option.selected");
    for (let i = 0; i < selectedElements.length; i++) {
        selectedElements[i].classList.remove("selected");
    }

    // 3. Reset the summary and progress
    document.getElementById("totalCost").textContent = "$0.00";
    document.getElementById("componentsSelected").textContent = "0/9";
    document.getElementById("performanceLevel").textContent = "Estimated Performance: Select GPU";
    document.getElementById("buildStatus").textContent = "Build Status: Incomplete";
    document.getElementById("progressCircle").textContent = "0%";
    document.getElementById("progressText").textContent = "0/9 Components";
}

// Show full build in popup
function exportBuild() {
    let summary = "Your PC Build:\n";
    let total = 0;

    for (let type in selectedComponents) {
        let part = selectedComponents[type];
        summary += "• " + type + ": " + part.name + " ($" + part.price + ")\n";
        total += part.price;
    }

    summary += "\nTotal Cost: $" + total.toFixed(2);
    alert(summary);
}

// Coming soon
function shareBuild() {
    alert("Sharing feature coming soon!");
}
