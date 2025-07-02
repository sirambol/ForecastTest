// src/utils/classifyUrgency.ts
export function classifyUrgency(title: string): number {
  const lower = title.toLowerCase();
  if (lower.includes('emissia')) return 1;
  if (lower.includes('urgent') || lower.includes('payer') || lower.includes('impôts')) return 1;
  if (lower.includes('rendez-vous') || lower.includes('rdv') || lower.includes('réunion')) return 2;
  if (lower.includes('préparer') || lower.includes('envoyer') || lower.includes('réviser')) return 3;
  if (lower.includes('lire') || lower.includes('écrire') || lower.includes('organiser')) return 4;
  return 5; // par défaut
}
