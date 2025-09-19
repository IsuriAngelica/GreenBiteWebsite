document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculator-form');
    const resultsContainer = document.getElementById('results-container');
    const backButton = document.getElementById('back-button');
    
    // Set default radio button to checked
    document.getElementById('male').checked = true;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            // Get form values
            const age = parseInt(document.getElementById('age').value);
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const height = parseInt(document.getElementById('height').value);
            const weight = parseInt(document.getElementById('weight').value);
            const actLevel = document.getElementById('activity-level').value;
            
            // Validate inputs
            if (isNaN(age) || isNaN(height) || isNaN(weight)) {
                alert("Please enter valid numbers for all fields");
                return;
            }
            
            if (age < 1 || age > 120) {
                alert("Please enter a valid age between 1 and 120");
                return;
            }
            
            if (height < 50 || height > 250) {
                alert("Please enter a valid height between 50cm and 250cm");
                return;
            }
            
            if (weight < 10 || weight > 300) {
                alert("Please enter a valid weight between 10kg and 300kg");
                return;
            }
            
            // Calculate BMR
            let bmr = 0;
            if (gender === "MALE") {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else if (gender === "FEMALE") {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
            
            // Determine activity factor
            let factor = 1.2;
            switch(actLevel) {
                case "sedentary":
                    factor = 1.2;
                    break;
                case "lightly-active":
                    factor = 1.375;
                    break;
                case "moderately-active":
                    factor = 1.55;
                    break;
                case "very-active":
                    factor = 1.725;
                    break;
                case "extra-active":
                    factor = 1.9;
                    break;
            }
            
            // Calculate TDEE
            const tdee = bmr * factor;
            
            // Calculate macronutrients
            const carbsGrams = Math.round((tdee * 0.50) / 4);
            const proteinGrams = Math.round((tdee * 0.20) / 4);
            const fatGrams = Math.round((tdee * 0.30) / 9);
            
            // Display results with animations
            displayResults(Math.round(bmr), Math.round(tdee), carbsGrams, proteinGrams, fatGrams);
        } catch (error) {
            console.error("Error calculating results:", error);
            alert("An error occurred. Please check your inputs and try again.");
        }
    });
    
    backButton.addEventListener('click', function() {
        // Hide results and show form again
        resultsContainer.classList.remove('results-visible');
        resultsContainer.classList.add('results-hidden');
    });
    
    function displayResults(bmr, tdee, carbs, protein, fat) {
        // Show results container FIRST so the elements are visible for animation
        resultsContainer.classList.remove('results-hidden');
        resultsContainer.classList.add('results-visible');
        
        // Reset counters to 0 for the animation
        document.getElementById('bmr-result').textContent = '0';
        document.getElementById('tdee-result').textContent = '0';
        document.getElementById('carbs-result').textContent = '0';
        document.getElementById('protein-result').textContent = '0';
        document.getElementById('fat-result').textContent = '0';
        
        // Reset progress bars to 0
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Brief delay to allow the browser to render the reset values before animating
        setTimeout(() => {
            // Animate the BMR and TDEE counters
            animateCounter('bmr-result', bmr, 1500);
            animateCounter('tdee-result', tdee, 1500);
            
            // Animate the macro counters and progress bars
            animateCounter('carbs-result', carbs, 1500);
            animateCounter('protein-result', protein, 1500);
            animateCounter('fat-result', fat, 1500);
            
            // Animate the progress bars to their full width
            document.querySelectorAll('.progress-fill').forEach(bar => {
                const targetWidth = bar.getAttribute('data-percent') + '%';
                bar.style.width = targetWidth;
            });
            
        }, 50); // 50ms delay
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    function animateCounter(elementId, targetValue, duration) {
        const element = document.getElementById(elementId);
        const startValue = 0;
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime > duration) {
                element.textContent = targetValue.toLocaleString(); // Format number with commas
                return;
            }
            const progress = elapsedTime / duration;
            const currentValue = Math.floor(progress * (targetValue - startValue) + startValue);
            element.textContent = currentValue.toLocaleString();
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
});