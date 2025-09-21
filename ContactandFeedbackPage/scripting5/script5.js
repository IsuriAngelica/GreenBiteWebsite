 // Form Validation and Submission
        document.getElementById('feedbackForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Name validation
            if (name.value.trim() === '') {
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('nameError').style.display = 'none';
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('emailError').style.display = 'none';
            }
            
            // Message validation
            if (message.value.trim() === '') {
                document.getElementById('messageError').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('messageError').style.display = 'none';
            }
            
            if (isValid) {
                // Store feedback in localStorage
                const feedback = {
                    name: name.value,
                    email: email.value,
                    message: message.value,
                    timestamp: new Date().toISOString()
                };
                
                let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
                feedbacks.push(feedback);
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
                
                
                document.getElementById('confirmation').style.display = 'block';
                
         
                document.getElementById('feedbackForm').reset();
                
              
                setTimeout(() => {
                    document.getElementById('confirmation').style.display = 'none';
                }, 5000);
            }
        });

        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                item.classList.toggle('active');
            });
        });