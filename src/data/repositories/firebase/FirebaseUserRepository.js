import { UserRepository } from "../../interfaces/UserRepository";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@backend/config/firebase-config";
import { COLLECTIONS } from "@data/constants";

export class FirebaseUserRepository extends UserRepository {
  /**
   * Get user profile by ID
   * @param {string} userId - The user's ID
   * @returns {Promise<Object|null>} User profile or null if not found
   */
  async getUserProfile(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  /**
   * Create a new user profile
   * @param {Object} userData - User profile data
   * @returns {Promise<boolean>} Success status
   */
  async createUserProfile(userData) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userData.uid);

      const profileData = {
        name: userData.name,
        email: userData.email,
        uid: userData.uid,
        createdAt: userData.createdAt || new Date().toISOString(),
      };

      await setDoc(docRef, profileData);
      return true;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - The user's ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<boolean>} Success status
   */
  async updateUserProfile(userId, updates) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Delete user profile
   * @param {string} userId - The user's ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteUserProfile(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  }

  /**
   * Check if user profile exists
   * @param {string} userId - The user's ID
   * @returns {Promise<boolean>} Whether profile exists
   */
  async userProfileExists(userId) {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error("Error checking if user profile exists:", error);
      throw error;
    }
  }
}
