const express=require('express')
const app=express()

app.get('/', (req, resp)=>{
    resp.send("Server is Working Successfully")
})

PORT=2021

app.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`)
})