export class CNPJUtils {
  public static validateCNPJ(cnpj: String): boolean {
    const x = cnpj.replace(/\D/g, "");

    if (!this.tamanhoValido(x)) {
      return false;
    }
    if (/^(\d)\1{13}$/.test(x)) {
      return false;
    }

    const PESOS_PRIMEIRO_DIGITO = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const PESOS_SEGUNDO_DIGITO = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const POSICAO_PRIMEIRO_DIGITO = 12;
    const POSICAO_SEGUNDO_DIGITO = 13;

    const primeiroDigito = this.calcularDigito(x.substring(0, POSICAO_PRIMEIRO_DIGITO), PESOS_PRIMEIRO_DIGITO);
    const segundoDigito = this.calcularDigito(x.substring(0, POSICAO_SEGUNDO_DIGITO), PESOS_SEGUNDO_DIGITO);

    return (
      parseInt(x.charAt(POSICAO_PRIMEIRO_DIGITO)) === primeiroDigito &&
      parseInt(x.charAt(POSICAO_SEGUNDO_DIGITO)) === segundoDigito
    );
  }

  private static tamanhoValido(cnpj: string): boolean {
    const TAMANHO = 14;
    return cnpj.length === TAMANHO;
  }

  private static calcularDigito(numbers: string, weights: number[]): number {
    let soma = 0;
    const DIVISOR = 11;
    for (let i = 0; i < numbers.length; i++) {
      soma += parseInt(numbers.charAt(i)) * weights[i];
    }
    const resto = soma % DIVISOR;
    return resto < 2 ? 0 : DIVISOR - resto;
  }

  public static maskCNPJ(cnpj: string): string {
    const x = cnpj.replace(/\D/g, "");
    const TAMANHO = 14;
    if (x.length !== TAMANHO) {
      throw new Error("CNPJ deve ter 14 dígitos");
    }

    let mascarado = "";
    for (let i = 0; i < x.length; i++) {
      mascarado += this.getMaskChar(i) + x.charAt(i);
    }

    return mascarado;
  }

  private static getMaskChar(index: number): string {
    const POSICOES_PONTOS = [2, 5];
    const POSICAO_BARRA = 8;
    const POSICAO_TRACO = 12;

    if (POSICOES_PONTOS.includes(index)) { return "."; }
    if (index === POSICAO_BARRA) { return "/"; }
    if (index === POSICAO_TRACO) { return "-"; }
    return "";
  }

  public static unmaskCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, "");
  }

  public static generateValidCNPJ(): string {
    const TAMANHO_PARCIAL = 12;
    const gerarDigitosAleatorios = (tamanho: number): string => {
      let x = "";
      for (let i = 0; i < tamanho; i++) {
        x += Math.floor(Math.random() * 10).toString();
      }
      return x;
    };

    let cnpjParcial = gerarDigitosAleatorios(TAMANHO_PARCIAL);

    const primeiroDigito = this.calcularDigito(cnpjParcial, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    cnpjParcial += primeiroDigito.toString();

    const segundoDigito = this.calcularDigito(cnpjParcial, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    cnpjParcial += segundoDigito.toString();

    return cnpjParcial;
  }

  public static isValidFormat(cnpj: string): boolean {
    const PADRAO_FORMATADO = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (PADRAO_FORMATADO.test(cnpj)) {
      return true;
    }

    const PADRAO_SEM_FORMATO = /^\d{14}$/;
    if (PADRAO_SEM_FORMATO.test(cnpj)) {
      return true;
    }

    const PADRAO_PARCIAL = /^\d{0,2}(\.\d{0,3})?(\.\d{0,3})?(\/\d{0,4})?(-\d{0,2})?$/;
    if (PADRAO_PARCIAL.test(cnpj)) {
      return true;
    }

    return false;
  }
}
