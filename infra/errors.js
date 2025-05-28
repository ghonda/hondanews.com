export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado aconteceu.", { cause });
  }

  name = "InternalServerError";
  action = "Entre em contato com o suporte";
  statusCode = statusCode || 500;
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponível no momento.", { cause });
  }

  name = "ServiceError";
  action = "Verifique se o serviço está disponível.";
  statusCode = 500;
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido para este endpoint");
  }

  name = "MethodNotAllowedError";
  action = "Verifique se o método HTTP enviado é válido para este endpoint";
  statusCode = 405;
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
