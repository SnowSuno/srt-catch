const axios = require('axios');
const FormData = require('form-data');

const token = '87392edb-4740-4648-9fb2-1c5748ddc9aa'


let data = new FormData();
data.append('_csrf', token);
data.append('userLoginId', 'percy3368@gmail.com');
data.append('srtplayPw', 'rnjstnsgh0115!');
data.append('remember-me', 'off');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://srtplay.com/login',
  headers: {
    'Cookie':  'XSRF-TOKEN=' + token,
    ...data.getHeaders()
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
