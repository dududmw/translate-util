import axios from 'axios';
const config={
    timeout:3000,
    headers:{
        'Content-Type':'application/json'
    },
    transformResponse:(data)=>{
        let result=JSON.parse(data);
        return result;
    }
};
const http=axios.create(config);
export default http;