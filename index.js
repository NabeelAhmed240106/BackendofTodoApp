import chalk from 'chalk';
import express from 'express'
import mongoose from 'mongoose';
import { todoModel } from './model/todoSchema.js';
import cors from 'cors';

const app = express();

const PORT = 2006;

// midleware
app.use(express.json());
app.use(cors());

// mongodb connected
const MONOGODB_URI = `mongodb+srv://nabeel:nabeel12345@cluster0.eej9cwx.mongodb.net/`

mongoose.connect(MONOGODB_URI).then((res) => {
    console.log(chalk.bgBlackBright.bold.italic("MongoDB Is Connected Now....."));
})
.catch((err) => {
    console.log(chalk.bgRed.bold.italic(err))
});

// get all todos
app.get("/api/todos",async (req,res) => {
    const todos = await todoModel.find();
    res.json(todos);

});

// add new todos
app.post("/api/todos", async (req,res) => {
    try {
        const {title} = req.body;

        if (!title || title.trim() === ""){
            return res.status(400).json({error: "Please Fill the Title...."});
        }

        const todo = new todoModel({title});
        await todo.save();
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// update todos

app.put("/api/todos/:id", async (req,res) => {
   try {
     const todo = await todoModel.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if(!todo) {
        return res.status(404).json({error:"Todo not Found"});
    }
    res.json(todo);
   } catch (error) {
    res.status(500).json({error: error.message});
   }
});

// delete todos
app.delete("/api/todos/:id", async(req,res) => {
    try {
        const todo = await todoModel.findByIdAndDelete(req.params.id);

        if(!todo) {
            return res.status(404).json({error: "Todo Not Found...."});
        }

        res.json({message:"Todo Delete Successfully......-_-......"});
    }catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.get('/',(req,res) => {
    res.json({
        message: "Server is runing now......"
    });

});

app.listen(PORT,(req,res) => {
    console.log(chalk.bgGreen.bold.italic(`Server is runing no http://localhost:${PORT}`));

})