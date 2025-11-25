import { getAuth, validatePassword } from "firebase/auth";

/**
 * Validates password against Firebase password policy
 * This uses Firebase's built-in validatePassword function
 * @param {string} password - Password to validate
 * @returns {Promise<Object>} - Validation status with detailed requirements
 */
export const validatePasswordWithFirebase = async (password) => {
  try {
    const auth = getAuth();
    const status = await validatePassword(auth, password);

    if (!status.isValid) {
      // Build list of missing requirements
      const missingRequirements = [];

      if (status.containsLowercaseLetter !== true) {
        missingRequirements.push("At least one lowercase letter");
      }
      if (status.containsUppercaseLetter !== true) {
        missingRequirements.push("At least one uppercase letter");
      }
      if (status.containsNumericCharacter !== true) {
        missingRequirements.push("At least one number");
      }
      if (status.containsNonAlphanumericCharacter !== true) {
        missingRequirements.push("At least one special character");
      }
      if (status.meetsMinPasswordLength !== true) {
        missingRequirements.push("Minimum password length");
      }

      return {
        isValid: false,
        status,
        missingRequirements,
        message: "Password does not meet requirements",
      };
    }

    return {
      isValid: true,
      status,
      missingRequirements: [],
      message: "Password meets all requirements",
    };
  } catch {
    // Fallback to basic validation if Firebase validation fails
    return validatePasswordLocal(password);
  }
};

/**
 * Local password validation (fallback if Firebase validation unavailable)
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
export const validatePasswordLocal = (password) => {
  const missingRequirements = [];

  if (password.length < 8) {
    missingRequirements.push("At least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    missingRequirements.push("At least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    missingRequirements.push("At least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    missingRequirements.push("At least one number");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    missingRequirements.push("At least one special character");
  }

  return {
    isValid: missingRequirements.length === 0,
    missingRequirements,
    message:
      missingRequirements.length === 0
        ? "Password meets all requirements"
        : "Password does not meet requirements",
    status: {
      containsLowercaseLetter: /[a-z]/.test(password),
      containsUppercaseLetter: /[A-Z]/.test(password),
      containsNumericCharacter: /[0-9]/.test(password),
      containsNonAlphanumericCharacter: /[^a-zA-Z0-9]/.test(password),
      meetsMinPasswordLength: password.length >= 8,
    },
  };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    message: isValid ? "Valid email" : "Please enter a valid email address",
  };
};

/**
 * List of common disposable email domains to block
 */
const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "throwaway.email",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
  "yopmail.com",
];

/**
 * Check if email is from a disposable domain
 * @param {string} email - Email to check
 * @returns {boolean} - True if disposable
 */
export const isDisposableEmail = (email) => {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
};
