/**
 * Author: Lucas Vogel
 * 
 * This file is a global helper file. 
 * It contains wrapper for all HTTP-Methods with extensive error-handling.
 */

/**
 * HTTP DELETE method
 * @param {String} url url of the request
 * @param {*} payload Object, will be converted into JSON
 * @returns promise that resolves to the result of the request, otherwise false.
 */
async function deleteIt(url, payload) { //Function name "delete" is already reserved
  return new Promise(function (resolve, reject) {
    data = JSON.stringify(payload);
    try {
      fetch(url, {
        method: "DELETE",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status == 200) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json()
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .then(json => resolve(json));
    } catch (e) {
      resolve(false);
    }
  });

}

/**
 * HTTP POST method
 * @param {String} url url of the request
 * @param {*} payload Object, will be converted into JSON
 * @returns promise that resolves to the result of the request, otherwise false.
 */
async function post(url, payload) {
  return new Promise(function (resolve, reject) {
    data = JSON.stringify(payload);
    try {
      fetch(url, {
        method: "POST",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status == 200) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json()
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .then(json => resolve(json));
    } catch (e) {
      resolve(false);
    }
  });
}

/**
 * HTTP GET method
 * @param {String} url url of the request
 * @returns promise that resolves to the result of the request, otherwise false.
 */
async function get(url) {
  return new Promise(function (resolve, reject) {
    try {
      fetch(url, {
        method: "GET",
      })
        .then(response => {
          //console.log(response);
          if (response.status == 200) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json()
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .then(json => resolve(json));
    } catch (e) {
      resolve(false);
    }
  });
}

/**
 * HTTP PUT method
 * @param {String} url url of the request
 * @param {*} payload Object, will be converted into JSON
 * @returns promise that resolves to the result of the request, otherwise false.
 */
async function put(url, payload) {
  return new Promise(function (resolve, reject) {
    data = JSON.stringify(payload);
    try {
      fetch(url, {
        method: "PUT",
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status == 200) {
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json()
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .then(json => resolve(json));
    } catch (e) {
      resolve(false);
    }
  });
}

