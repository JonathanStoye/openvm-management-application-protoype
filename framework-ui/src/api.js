class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  fetch = (path, ...rest) =>
    fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      ...rest
    });

  getEntires = () =>
    this.fetch("/entries", {
      method: "GET"
    });

  getReferenceTypes = () =>
    this.fetch("/referenceTypes", {
      method: "GET"
    });
}

export default new Api("http://localhost:6060");
