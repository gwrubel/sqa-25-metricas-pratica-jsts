export class EmailUtils {

  public static validateEmail(email: string): boolean {
    if (!this.emailRegex(email)) {
      return false;
    }

    const [localPart, domain] = email.split("@");

    return (
      this.validateLocalPart(localPart) &&
      this.validateDomain(domain)
    );
  }

  private static emailRegex(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  private static validateLocalPart(local: string): boolean {
    const LOCAL_PART_MAX_LENGTH = 64;

    if (local.length > LOCAL_PART_MAX_LENGTH) {
      return false;
    }
    if (local.startsWith(".") || local.endsWith(".")) {
      return false;
    }

    if (local.includes("..")) {
      return false;
    }

    return true;
  }

  private static validateDomain(domain: string): boolean {
    const DOMAIN_MAX_LENGTH = 253;

    if (domain.length > DOMAIN_MAX_LENGTH) {
      return false;
    }
    if (!domain.includes(".")) {
      return false;
    }
    if (domain.startsWith(".") || domain.endsWith(".")) {
      return false;
    }
    if (domain.includes("..")){
      return false;
    }
    return true;
  }



  public static extractDomain(email: string): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }

    const x = email.split("@");
    return x[1] || null;
  }

  public static extractLocalPart(email: string): string | null {
    if (!this.validateEmail(email)) {
      return null;
    }

    const x = email.split("@");
    return x[0] || null;
  }

public static isFromDomain(email: string, domain: string): boolean {
  if (!this.validateEmail(email) || !domain) {
    return false;
  }

  const extractedDomain = this.extractDomain(email);
  if (!extractedDomain) {
    return false;
  }

  return this.matchDomain(extractedDomain, domain);
}

private static matchDomain(emailDomain: string, targetDomain: string): boolean {
  const emailDomainLower = emailDomain.toLowerCase();
  const targetDomainLower = targetDomain.toLowerCase();


  if (emailDomainLower === targetDomainLower) {
    return true;
  }

  if (emailDomainLower.endsWith("." + targetDomainLower)) {
    return true;
  }

  const emailParts = emailDomainLower.split(".");
  const targetParts = targetDomainLower.split(".");

  if (emailParts.length >= targetParts.length) {
    const slice = emailParts.slice(-targetParts.length);
    return slice.join(".") === targetParts.join(".");
  }

  return false;
}


  public static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
