export default class HttpError extends Error {
  forbidden() {
    this.message = 'Доступ запрещен';
    this.statusCode = 403;
  }

  notFound() {
    this.message = 'Данный id не найден';
    this.statusCode = 404;
  }
}
