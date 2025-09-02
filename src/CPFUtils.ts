export class CPFUtils {
  public static validateCPF(cpf: string): boolean {
    const x = cpf.replace(/\D/g, "");

    if (!this.tamanhoValido(x)) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(x)) {
      return false;
    }

    const PESO_PRIMEIRO_DIGITO = 10;
    const PESO_SEGUNDO_DIGITO = 11;

    const primeiroDigito = this.calcularDigito(x.substring(0, 9), PESO_PRIMEIRO_DIGITO);
    const segundoDigito = this.calcularDigito(x.substring(0, 10), PESO_SEGUNDO_DIGITO);

    return (
      parseInt(x.charAt(9)) === primeiroDigito &&
      parseInt(x.charAt(10)) === segundoDigito
    );
  }

  private static tamanhoValido(cpf: string): boolean {
    const TAMANHO = 11;
    return cpf.length === TAMANHO;
  }

  private static calcularDigito(cpfParcial: string, pesoInicial: number): number {
    let soma = 0;
    const DIVISOR = 11;
    for (let i = 0; i < cpfParcial.length; i++) {
      soma += parseInt(cpfParcial.charAt(i)) * (pesoInicial - i);
    }

    const resto = soma % DIVISOR;
    return resto < 2 ? 0 : DIVISOR - resto;
  }

  public static maskCPF(cpf: String): string {
    const x = cpf.replace(/\D/g, "");

    if (!this.tamanhoValido(x)) {
      throw new Error("CPF deve ter 11 dígitos");
    }

    let x1 = "";
    for (let i = 0; i < x.length; i++) {
      if (i === 3 || i === 6) {
        x1 += ".";
      } else if (i === 9) {
        x1 += "-";
      }
      x1 += x.charAt(i);
    }

    return x1;
  }

  public static unmaskCPF(cpf: string): string {
    return cpf.replace(/\D/g, "");
  }

  public static generateValidCPF(): string {
    const gerarDigitosAleatorios = (tamanho: number): string => {
      let x = "";
      for (let i = 0; i < tamanho; i++) {
        x += Math.floor(Math.random() * 10).toString();
      }
      return x;
    };

    let cpfParcial = gerarDigitosAleatorios(9);

    const PESO_PRIMEIRO_DIGITO = 10;
    const PESO_SEGUNDO_DIGITO = 11;

    const primeiroDigito = this.calcularDigito(cpfParcial, PESO_PRIMEIRO_DIGITO);
    cpfParcial += primeiroDigito.toString();

    const segundoDigito = this.calcularDigito(cpfParcial, PESO_SEGUNDO_DIGITO);
    cpfParcial += segundoDigito.toString();

    return cpfParcial;
  }


  public static isValidFormat(cpf: string): boolean {
    const x = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (x.test(cpf)) {
      return true;
    }

    const x1 = /^\d{11}$/;
    if (x1.test(cpf)) {
      return true;
    }

    const temp = /^\d{0,3}(\.\d{0,3})?(\.\d{0,3})?(-\d{0,2})?$/;
    if (temp.test(cpf)) {
      return true;
    }

    return false;
  }
}
