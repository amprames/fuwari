// Import commands if needed later
// import './commands'

// Ensure uncaught exceptions don't fail tests unless relevant
Cypress.on("uncaught:exception", (err) => {
	// Allow 3rd-party script errors unrelated to our app
	return false;
});

// Register mochawesome reporter hooks
import "cypress-mochawesome-reporter/register";
