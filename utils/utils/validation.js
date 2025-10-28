// utils/validation.js

/**
 * Valide que les champs requis sont présents dans un objet.
 * @param {Object} obj L’objet à valider.
 * @param {string[]} requiredFields Liste des noms de clés requises.
 * @returns {string|null} Retourne un message d’erreur ou null si tout va bien.
 */
export function validateRequiredFields(obj, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in obj)) {
      return `Missing required field: ${field}`;
    }
    const val = obj[field];
    if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
      return `Field ${field} is empty or invalid`;
    }
  }
  return null;
}
