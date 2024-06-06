import express from 'express'

const app = express()

app.use("/",(req,res)=>{
    console.log("Hi")
})

app.listen(8800,()=>{
    console.log("Server is running on 8800");
})