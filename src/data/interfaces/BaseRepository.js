// src/data/interfaces/BaseRepository.js
export class BaseRepository {
  /**
   * Watch for real-time updates
   * @returns {Function} Unsubscribe function
   */
  watch(query, onUpdate, onError) {
    throw new Error("Not implemented");
  }
}
