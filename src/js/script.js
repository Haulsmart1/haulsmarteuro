// Example: Form Validation for Login and Registration
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const registrationForm = document.getElementById('registration-form');
  const contactForm = document.getElementById('contact-form');

  if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          if (!email || !password) {
              e.preventDefault();
              alert('Please fill in all fields.');
          }
      });
  }

  if (registrationForm) {
      registrationForm.addEventListener('submit', function (e) {
          const fullName = document.getElementById('full-name').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirm-password').value;

          if (!fullName || !email || !password || !confirmPassword) {
              e.preventDefault();
              alert('Please fill in all fields.');
          } else if (password !== confirmPassword) {
              e.preventDefault();
              alert('Passwords do not match.');
          }
      });
  }

  if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const message = document.getElementById('message').value;

          if (!name || !email || !message) {
              e.preventDefault();
              alert('Please fill in all fields.');
          }
      });
  }
});