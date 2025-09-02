export class Types {
  static UserInput: {
    email: string;
    password: string;
    cnpj: string;
  };

  static ProcessedData: {
    normalizedEmail: string;
    domain: string | null;
    isFromSpecificDomain: boolean;
    maskedCNPJ: string;
    unmaskedCNPJ: string;
    cnpjFormatValid: boolean;
  };

  static BatchItem: {
    index: number;
    originalData: typeof Types.UserInput;
    isValid: boolean;
    processedEmail: string;
    processedCNPJ: string;
  };

  static Report: {
    timestamp: string;
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    apiCalls: number;
    domain: string | null;
    isFromSpecificDomain: boolean;
  };

  static Backup: {
    timestamp: string;
    data: typeof Types.BatchItem[];
    checksum: number;
    originalInput: typeof Types.UserInput;
  };

  static Integrity: {
    isValid: boolean;
    errors: string[];
    totalChecks: number;
  };

  static Audit: {
    timestamp: string;
    suspiciousEmails: number;
    duplicateCNPJs: number;
    totalOperations: number;
  };

  static ExportedData: {
    format: "json";
    content: string;
    size: number;
  };
}
