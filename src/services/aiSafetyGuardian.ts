/**
 * AI Safety & Abuse Guardian
 * Provides real-time linguistic scanning, profanity masking, sectarian attack prevention,
 * and HIPAA medical privacy protection.
 */

// Profanity and explicit abuse keywords
const PROFANITY_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|bastard|dick|cunt|pussy|slut|whore|nigger|faggot|retard)\b/gi,
  /\bdammit\b/gi,
];

// Derogatory inter-religious slurs and cross-faith attacks
const SECTARIAN_ATTACK_PATTERNS = [
  /\b(your god is (fake|evil|satan|dead|false))\b/gi,
  /\b(burn in hell (heathen|infidel|heretic|kafir))\b/gi,
  /\b(idolater scum|pagan filth|cultist)\b/gi,
  /\b(all (christians|muslims|jews|hindus|buddhists|mormons|catholics) are (evil|terrorists|stupid|going to hell|devils))\b/gi,
  /\b(convert or die|fake religion)\b/gi,
  /\b(muhammad was a|jesus was a (liar|myth)|fake prophet)\b/gi,
];

// Sensitive Personal Health Information (HIPAA / Medical Privacy) patterns
const PHI_PATTERNS = [
  /\b(ssn|social security number)\s*[:#]?\s*\d{3}-?\d{2}-?\d{4}\b/gi,
  /\b(diagnosed with (cancer|hiv|aids|schizophrenia|bipolar|covid|herpes))\b/gi,
  /\b(medical record|mrn)\s*[:#]?\s*\d+/gi,
  /\b(my doctor Dr\.?\s+[A-Z][a-z]+ told me my prognosis is)\b/gi,
];

// Commercial Solicitation & Spam patterns
const SOLICITATION_PATTERNS = [
  /\b(buy now|discount code|crypto investment|guaranteed profit|dm for price|click here to invest|telegram channel|whatsapp me at)\b/gi,
  /\bhttps?:\/\/(?!the-living-hearth)[^\s]+/gi,
];

export interface SafetyAnalysisResult {
  isSafe: boolean;
  sanitizedText: string;
  flags: {
    hasProfanity: boolean;
    hasSectarianAttack: boolean;
    hasPhiMedicalInfo: boolean;
    hasSolicitation: boolean;
  };
  warningMessage?: string;
  pastoralAdvice?: string;
  blockedReason?: string;
}

/**
 * Analyzes text in real-time before submission in any prayer, room message, or study note.
 */
export function analyzeContentSafety(
  rawText: string,
  _userTradition?: string,
  _targetContext?: string
): SafetyAnalysisResult {
  let sanitizedText = rawText;
  const flags = {
    hasProfanity: false,
    hasSectarianAttack: false,
    hasPhiMedicalInfo: false,
    hasSolicitation: false,
  };

  // 1. Check for Profanity
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(rawText)) {
      flags.hasProfanity = true;
      sanitizedText = sanitizedText.replace(pattern, (match) => '•'.repeat(match.length));
    }
  }

  // 2. Check for Sectarian Attacks & Cross-Religion Hate Speech
  for (const pattern of SECTARIAN_ATTACK_PATTERNS) {
    if (pattern.test(rawText)) {
      flags.hasSectarianAttack = true;
    }
  }

  // 3. Check for HIPAA / Medical Privacy Disclosures
  for (const pattern of PHI_PATTERNS) {
    if (pattern.test(rawText)) {
      flags.hasPhiMedicalInfo = true;
    }
  }

  // 4. Check for Solicitation & Commercial Spam
  for (const pattern of SOLICITATION_PATTERNS) {
    if (pattern.test(rawText)) {
      flags.hasSolicitation = true;
    }
  }

  // Determine overall safety and messaging
  if (flags.hasSectarianAttack) {
    return {
      isSafe: false,
      sanitizedText,
      flags,
      blockedReason:
        'Peace Sanctuary Policy: Disparaging remarks against other faiths or hostile attacks are strictly prohibited to preserve sanctuary peace.',
      warningMessage:
        'Your reflection contains language that attacks or demeans another religion. Please rephrase with reverent sincerity.',
      pastoralAdvice:
        'The Living Hearth upholds sacred boundaries so every soul worships without fear of attack.',
    };
  }

  if (flags.hasSolicitation) {
    return {
      isSafe: false,
      sanitizedText,
      flags,
      blockedReason:
        'Non-Commercial Policy: Advertising, crypto promotions, and external links are not allowed in sacred rooms.',
      warningMessage: 'Commercial pitching and external link solicitation detected.',
      pastoralAdvice: 'Rooms are dedicated exclusively to prayer, study, and spiritual fellowship.',
    };
  }

  if (flags.hasPhiMedicalInfo) {
    return {
      isSafe: true, // Allowed, but with active privacy warning
      sanitizedText,
      flags,
      warningMessage:
        'Medical Privacy Notice: This reflection mentions specific diagnoses or medical details. For your HIPAA safety, we recommend saving this to your Private Encrypted Journal or sharing generally.',
      pastoralAdvice: 'You can offer a prayer for healing without disclosing private medical records.',
    };
  }

  if (flags.hasProfanity) {
    return {
      isSafe: true,
      sanitizedText,
      flags,
      warningMessage:
        'Gentle Language Filter: Vulgarity has been softened to maintain sacred tranquility.',
      pastoralAdvice: 'Thank you for keeping language gentle and uplifting.',
    };
  }

  return {
    isSafe: true,
    sanitizedText: rawText,
    flags,
  };
}
