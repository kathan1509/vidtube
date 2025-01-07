class ApiResponse {
  constructor(statuscode, data, message = "Success") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = statuscode >= 200 && statuscode < 300;
  }
}

export { ApiResponse };
