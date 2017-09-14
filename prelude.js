
fetch('http://localhost:3000/flowers.jpg').then(function(response) {
  return response.blob();
}).then(function(myBlob) {
  const objectURL = URL.createObjectURL(myBlob);
  const myImage = document.createElement('img');
  myImage.src = objectURL;
  document.body.appendChild(myImage); 

  return new Promise(function (resolve, reject) {  
    const reader = new FileReader()
    reader.onload = function() {
      return resolve(reader.result)
    };
    reader.onerror = function() {
      return reject(reader.error);
    };
    reader.readAsArrayBuffer(myBlob);
  })
}).then(function(arrBuffer) {
  return crypto.subtle.digest("SHA-256", arrBuffer).then(function(hash) {
    const hashString = hex(hash);
    document.getElementById("hash").innerText = hashString;
    console.log(hashString);
  });
});

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}
