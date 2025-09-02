//Crie uma função para fingir que estamos lidando com email, password, cnpj, cpf, fazendo chamadas a api, tudo dentro dessa função service

import { validatePassword } from "./PasswordUtils";
import { EmailUtils } from "./EmailUtils";
import { CNPJUtils } from "./CNPJUtils";

interface ApiResult {
  success: boolean;
  message: string;
}

interface BatchItem {
  email: string;
  password: string;
  cnpj: string;
}

interface ProcessedBatchItem {
  index: number;
  originalData: BatchItem;
  isValid: boolean;
  processedEmail: string;
  processedCNPJ: string;
}

interface Report {
  timestamp: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  apiCalls: number;
  domain: string | null;
  isFromSpecificDomain: boolean;
}

interface Backup {
  timestamp: string;
  data: ProcessedBatchItem[];
  checksum: number;
  originalInput: { email: string; password: string; cnpj: string };
}

interface Integrity {
  isValid: boolean;
  errors: string[];
  totalChecks: number;
}

interface Audit {
  timestamp: string;
  suspiciousEmails: number;
  duplicateCNPJs: number;
  totalOperations: number;
}

interface ServiceResult {
  success: boolean;
  message: string;
  timestamp?: string;
  summary?: {
    totalProcessed: number;
    validRecords: number;
    invalidRecords: number;
    apiCalls: number;
    backupCreated: boolean;
    integrityValid: boolean;
    auditCompleted: boolean;
    dataExported: boolean;
  };
  data?: {
    processed: {
      normalizedEmail: string;
      domain: string | null;
      isFromSpecificDomain: boolean;
      maskedCNPJ: string;
      unmaskedCNPJ: string;
      cnpjFormatValid: boolean;
    };
    test: { testCNPJ: string; testEmail: string; testPassword: string };
    batch: ProcessedBatchItem[];
    report: Report;
    backup: Backup;
    integrity: Integrity;
    audit: Audit;
    exported: { format: string; content: string; size: number };
  };
  details?: {
    email: boolean;
    password: boolean;
    cnpj: boolean;
  };
}

function fakeApiCall(_param1: string, _param2: string): ApiResult {
  return {
    success: true,
    message: "Api call successful",
  };
}

function validateInputs(email: string, password: string, cnpj: string): boolean[] {
  return [
    EmailUtils.validateEmail(email),
    validatePassword(password),
    CNPJUtils.validateCNPJ(cnpj),
  ];
}

function processUserData(email: string, cnpj: string) {
  const normalizedEmail = EmailUtils.normalizeEmail(email);
  const domain = EmailUtils.extractDomain(normalizedEmail);
  const isFromSpecificDomain = EmailUtils.isFromDomain(normalizedEmail, "empresa.com");
  const maskedCNPJ = CNPJUtils.maskCNPJ(cnpj);
  const unmaskedCNPJ = CNPJUtils.unmaskCNPJ(maskedCNPJ);
  const cnpjFormatValid = CNPJUtils.isValidFormat(maskedCNPJ);

  return {
    normalizedEmail,
    domain,
    isFromSpecificDomain,
    maskedCNPJ,
    unmaskedCNPJ,
    cnpjFormatValid,
  };
}

function generateTestData() {
  return {
    testCNPJ: CNPJUtils.generateValidCNPJ(),
    testEmail: `teste.${Date.now()}@empresa.com`,
    testPassword: "Teste123!@#",
  };
}

function makeApiCalls(email: string, password: string, cnpj: string, testEmail: string, testPassword: string): ApiResult[] {
  return [
    fakeApiCall(email, password),
    fakeApiCall(email, cnpj),
    fakeApiCall(password, cnpj),
    fakeApiCall(testEmail, testPassword),
  ];
}

function processBatchData(batchData: BatchItem[]): ProcessedBatchItem[] {
  return batchData.map((item, index) => {
    const isValid =
      EmailUtils.validateEmail(item.email) &&
      validatePassword(item.password) &&
      CNPJUtils.validateCNPJ(item.cnpj);

    return {
      index,
      originalData: item,
      isValid,
      processedEmail: EmailUtils.normalizeEmail(item.email),
      processedCNPJ: CNPJUtils.maskCNPJ(item.cnpj),
    };
  });
}

function createReport(processedBatch: ProcessedBatchItem[], apiResults: ApiResult[], domain: string | null, isFromSpecificDomain: boolean): Report {
  return {
    timestamp: new Date().toISOString(),
    totalRecords: processedBatch.length,
    validRecords: processedBatch.filter((item) => item.isValid).length,
    invalidRecords: processedBatch.filter((item) => !item.isValid).length,
    apiCalls: apiResults.length,
    domain,
    isFromSpecificDomain,
  };
}

function createBackup(processedBatch: ProcessedBatchItem[], email: string, password: string, cnpj: string): Backup {
  return {
    timestamp: new Date().toISOString(),
    data: processedBatch,
    checksum: JSON.stringify(processedBatch).length,
    originalInput: { email, password, cnpj },
  };
}

function validateIntegrity(domain: string | null, cnpjFormatValid: boolean, apiResults: ApiResult[]): Integrity {
  const integrityErrors: string[] = [];
  if (!domain) {
    integrityErrors.push("Domínio inválido");
  }
  if (!cnpjFormatValid) {
    integrityErrors.push("Formato CNPJ inválido");
  }
  if (apiResults.length !== 4) {
    integrityErrors.push("Número incorreto de chamadas de API");
  }

  return {
    isValid: integrityErrors.length === 0,
    errors: integrityErrors,
    totalChecks: 3,
  };
}

function performAudit(processedBatch: ProcessedBatchItem[], cnpj: string): Audit {
  return {
    timestamp: new Date().toISOString(),
    suspiciousEmails: processedBatch.filter(
      (item) =>
        item.originalData.email.includes("test") ||
        item.originalData.email.includes("admin")
    ).length,
    duplicateCNPJs: processedBatch.filter(
      (item) => item.originalData.cnpj === cnpj
    ).length,
    totalOperations: 9,
  };
}

function exportData(report: Report, processedBatch: ProcessedBatchItem[], backup: Backup, integrity: Integrity, audit: Audit) {
  const data = { report, processedBatch, backup, integrity, audit };
  return {
    format: "json",
    content: JSON.stringify(data, null, 2),
    size: JSON.stringify(data).length,
  };
}

function buildServiceResult(
  processed: ReturnType<typeof processUserData>,
  testData: ReturnType<typeof generateTestData>,
  processedBatch: ProcessedBatchItem[],
  report: Report,
  backup: Backup,
  integrity: Integrity,
  audit: Audit,
  exportedData: ReturnType<typeof exportData>,
  apiResults: ApiResult[]
): ServiceResult {
  return {
    success: true,
    message: "Serviço executado com sucesso",
    timestamp: new Date().toISOString(),
    summary: {
      totalProcessed: processedBatch.length,
      validRecords: report.validRecords,
      invalidRecords: report.invalidRecords,
      apiCalls: apiResults.length,
      backupCreated: !!backup,
      integrityValid: integrity.isValid,
      auditCompleted: !!audit,
      dataExported: !!exportedData,
    },
    data: {
      processed: {
        normalizedEmail: processed.normalizedEmail,
        domain: processed.domain,
        isFromSpecificDomain: processed.isFromSpecificDomain,
        maskedCNPJ: processed.maskedCNPJ,
        unmaskedCNPJ: processed.unmaskedCNPJ,
        cnpjFormatValid: processed.cnpjFormatValid,
      },
      test: testData,
      batch: processedBatch,
      report,
      backup,
      integrity,
      audit,
      exported: exportedData,
    },
  };
}

export function service(email: string, password: string, cnpj: string): ServiceResult {
  console.log("Iniciando serviço...");

  const [emailValid, passwordValid, cnpjValid] = validateInputs(email, password, cnpj);

  if (!emailValid || !passwordValid || !cnpjValid) {
    console.log("Dados inválidos detectados");
    return {
      success: false,
      message: "Dados inválidos",
      details: { email: emailValid, password: passwordValid, cnpj: cnpjValid },
    };
  }

  const processed = processUserData(email, cnpj);
  const testData = generateTestData();
  const apiResults = makeApiCalls(email, password, cnpj, testData.testEmail, testData.testPassword);

  const batchData: BatchItem[] = [
    { email, password, cnpj },
    { email: testData.testEmail, password: testData.testPassword, cnpj: testData.testCNPJ },
  ];

  const processedBatch = processBatchData(batchData);
  const report = createReport(processedBatch, apiResults, processed.domain, processed.isFromSpecificDomain);
  const backup = createBackup(processedBatch, email, password, cnpj);
  const integrity = validateIntegrity(processed.domain, processed.cnpjFormatValid, apiResults);
  const audit = performAudit(processedBatch, cnpj);
  const exportedData = exportData(report, processedBatch, backup, integrity, audit);

  return buildServiceResult(processed, testData, processedBatch, report, backup, integrity, audit, exportedData, apiResults);
}
