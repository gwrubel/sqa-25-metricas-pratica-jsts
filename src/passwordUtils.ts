export class PasswordUtils {
  private static readonly CONFIG = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventSequential: true,
    preventRepeating: true,
  };

  public static validatePassword(password: string): boolean {
    if (password === null || password === undefined) {
    throw new Error("Password cannot be null or undefined");
  }

    const violations: string[] = [];

    this.checkLength(password, violations);
    this.checkUppercase(password, violations);
    this.checkLowercase(password, violations);
    this.checkNumbers(password, violations);
    this.checkSymbols(password, violations);
    this.checkSequential(password, violations);
    this.checkRepeating(password, violations);

    return violations.length === 0;
  }

  private static checkLength(password: string, violations: string[]): void {
    const { minLength, maxLength } = this.CONFIG;

    if (password.length < minLength) {
      violations.push(`Senha deve ter pelo menos ${minLength} caracteres`);
    }

    if (maxLength && password.length > maxLength) {
      violations.push(`Senha deve ter no máximo ${maxLength} caracteres`);
    }
  }

  private static checkUppercase(password: string, violations: string[]): void {
    if (this.CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
      violations.push("Senha deve conter pelo menos uma letra maiúscula");
    }
  }

  private static checkLowercase(password: string, violations: string[]): void {
    if (this.CONFIG.requireLowercase && !/[a-z]/.test(password)) {
      violations.push("Senha deve conter pelo menos uma letra minúscula");
    }
  }

  private static checkNumbers(password: string, violations: string[]): void {
    if (this.CONFIG.requireNumbers && !/\d/.test(password)) {
      violations.push("Senha deve conter pelo menos um número");
    }
  }

  private static checkSymbols(password: string, violations: string[]): void {
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (this.CONFIG.requireSymbols && !regex.test(password)) {
      violations.push("Senha deve conter pelo menos um caractere especial");
    }
  }

  private static checkSequential(password: string, violations: string[]): void {
    if (!this.CONFIG.preventSequential) {
      return;
    }

    const patterns = [/123/, /abc/, /qwe/, /asd/, /zxc/];
    for (const pattern of patterns) {
      if (pattern.test(password.toLowerCase())) {
        violations.push("Senha não deve conter sequências");
        break;
      }
    }
  }

  private static checkRepeating(password: string, violations: string[]): void {
    if (this.CONFIG.preventRepeating && /(.)\1{2,}/.test(password)) {
      violations.push("Senha não deve ter caracteres repetidos em excesso");
    }
  }

}
export const validatePassword = PasswordUtils.validatePassword.bind(PasswordUtils);
