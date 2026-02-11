import { repositoryFactory } from "@data/factory/repositoryFactory";

/**
 * UserService - Business logic for user operations
 * Coordinates AuthRepository and UserRepository
 */
export class UserService {
  constructor() {
    // Use getters to avoid circular dependency issues
  }

  get authRepository() {
    return repositoryFactory.authRepository;
  }

  get userRepository() {
    return repositoryFactory.userRepository;
  }

  /**
   * Sign in with email and ensure profile exists
   */
  async signInWithEmail(email, password) {
    try {
      // 1. Authenticate
      const user = await this.authRepository.signInWithEmail(email, password);

      // 2. Ensure profile exists
      await this.ensureUserProfile(user);

      return user;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  }

  /**
   * Sign up with email and create profile
   */
  async signUpWithEmail(email, password) {
    try {
      // 1. Create auth user
      const user = await this.authRepository.signUpWithEmail(email, password);

      // 2. Create user profile
      await this.createUserProfile(user);

      return user;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  }

  /**
   * Sign in with Google and ensure profile exists
   */
  async signInWithGoogle() {
    try {
      // 1. Authenticate
      const user = await this.authRepository.signInWithGoogle();

      // 2. Ensure profile exists
      await this.ensureUserProfile(user);

      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      await this.authRepository.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return this.authRepository.getCurrentUser();
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback) {
    return this.authRepository.onAuthStateChanged(callback);
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      return await this.userRepository.getUserProfile(userId);
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, updates) {
    try {
      return await this.userRepository.updateUserProfile(userId, updates);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Ensure user profile exists, create if it doesn't
   * @private
   */
  async ensureUserProfile(user) {
    try {
      const profileExists = await this.userRepository.userProfileExists(
        user.uid
      );

      if (!profileExists) {
        await this.createUserProfile(user);
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      throw error;
    }
  }

  /**
   * Create user profile from auth user
   * @private
   */
  async createUserProfile(user) {
    try {
      const profileData = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Anonymous",
        email: user.email,
        createdAt: new Date().toISOString(),
      };

      await this.userRepository.createUserProfile(profileData);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
