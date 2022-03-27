
const getFn = function getCrawlData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/hello',
      data: {},
      success: function(result) {
        resolve(result)
      },
      error: function(err) {
        reject(err)
      }
    })
  })
}
getFn().then((res) => {
  console.log(res);
},err => {
  console.log(err);
})