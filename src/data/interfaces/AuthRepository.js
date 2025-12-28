export class AuthRepository {
  /**
   * Sign in with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async signInWithEmail(email, password) {
    throw new Error("Not implemented");
  }

  /**
   * Sign up with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  async signUpWithEmail(email, password) {
    throw new Error("Not implemented");
  }

  /**
   * Sign in with Google
   * @returns {Promise<User>}
   */
  async signInWithGoogle() {
    throw new Error("Not implemented");
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    throw new Error("Not implemented");
  }

  /**
   * Get current user
   * @returns {User|null}
   */
  getCurrentUser() {
    throw new Error("Not implemented");
  }

  /**
   * Subscribe to auth state changes
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    throw new Error("Not implemented");
  }
}
