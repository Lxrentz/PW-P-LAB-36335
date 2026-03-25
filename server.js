import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import {configDotenv} from 'dotenv'
import {PrismaPg} from "@prisma/adapter-pg";

let movies = [
  {id: 1, title: "Inception", year: 2010},
  {id: 2, title: "Interstellar", year: 2014}
];

let tasks = [
  { id: 1, title: "Estudar Node.js", completed: false, priority: "high" },
  { id: 2, title: "Fazer LAB-1", completed: true, priority: "medium" }
];

configDotenv()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

app.get('/movies', (req, res) => {
    res.status(200).json({message: "Lista de filmes acessada.", movies: movies})
})

app.get('/movies/:id', (req, res) => {

    const { 
        id
    } = req.params
    
    if (!id) {
        return res.status(404).json({message: "Nenhum ID foi adicionado."})
    }

    const movie = movies.find((movie) => movie.id == id)

    if (!movie) {
        return res.status(404).json({message: "Nenhum filme com este ID foi encontrado."})
    }

    res.status(200).json({message: "Sucesso ao acessar a rota de Get Movies.", movie})
})

app.post('/movies', (req, res) => {

    const moviesLenght = movies.length

    const {
        title,
        year
    } = req.body

    if (!title || !year) {
        res.status(404).json({message: "Erro! Introduza o título do filme e o seu ano de criação."})
    }

    const newMovie = {
        id: moviesLenght + 1,
        title,
        year
    }

    movies.push(newMovie)

    res.status(200).json({message: "Novo filme adicionado.", movies: movies})
})

app.put('/movies/:id', (req, res) => {
    
    const {id} = req.params
    const {title, year} = req.body

    const movieToEdit = movies.filter(movie => movie.id == id)

    if (title) {
        movieToEdit[0].title = title
    } 
    if (year) {
        movieToEdit[0].year = year
    }

    if (!title && !year) {
        return res.status(404).json({message: "Erro! Nenhum dado foi passado para realizar a edição."})
    }

    res.status(200).json({message: `O filme de ID ${id} foi editado.`, updatedMoviesList: movies})
})

app.delete('/movies/:id', (req, res) => {

    const {id} = req.params

    const movieToDelete = movies.filter(movie => movie.id == id)
    
    movies = movies.filter(movies => movies.id != movieToDelete[0].id)

    res.status(200).json({message: "Rota de Delete acessada.", updatedMoviesList: movies})
})

app.get('/tasks', (req, res) => {
    const {completed} = req.query

    const isCompleted = completed === "true"

    let tasksToReturn = []

    if(isCompleted) {
        tasksToReturn = tasks.filter(task => task.completed == true)
        return res.status(200).json({message: "Lista de tarefas completas acessada.", tasks: tasksToReturn})
    } else if(!isCompleted) {
        tasksToReturn = tasks.filter(task => task.completed == false)
        return res.status(200).json({message: "Lista de tarefas inacabadas acessada.", tasks: tasksToReturn})
    }

    res.status(200).json({message: "Lista de tarefas acessada.", tasks: tasks})
})

app.get('/tasks/:id', (req, res) => {

    const { 
        id
    } = req.params
    
    if (!id) {
        return res.status(404).json({message: "Nenhum ID foi adicionado."})
    }

    const task = tasks.find((task) => task.id == id)

    if (!task) {
        return res.status(404).json({message: "Nenhuma tarefa com este ID foi encontrada."})
    }

    res.status(200).json({message: "Sucesso ao acessar a rota de Get Tasks.", task})
})

app.post('/tasks', (req, res) => {

    const tasksLenght = tasks.length

    const {
        title,
        priority
    } = req.body

    if (!title || !priority) {
        res.status(404).json({message: "Erro! Introduza o título da tarefa e a sua prioridade."})
    }

    let completed = false

    const newTask = {
        id: tasksLenght + 1,
        title,
        priority,
        completed
    }

    tasks.push(newTask)

    res.status(200).json({message: "Nova tarefa adicionada.", tasks: tasks})
})

app.put('/tasks/:id', (req, res) => {
    
    const {id} = req.params
    const {title, priority} = req.body

    const taskToEdit = tasks.filter(task => task.id == id)

    if (title) {
        taskToEdit[0].title = title
    } 
    if (priority) {
        taskToEdit[0].year = year
    }

    if (!title && !priority) {
        return res.status(404).json({message: "Erro! Nenhum dado foi passado para realizar a edição."})
    }

    res.status(200).json({message: `A tarefa de ID ${id} foi editada.`, updatedTasksList: tasks})
})

app.patch("/tasks/:id/toggle", (req, res) => {
    const {id} = req.params

    const task = tasks.find(task => task.id == id)

    task.completed = !task.completed

    if(!task) {
        return res.status(404).json({message: "Não foi possível encontrar a tarefa."})
    }

    else {
        return res.status(200).json({message: "Rota encontrada com sucesso."})
    }
})

app.delete('/tasks/:id', (req, res) => {

    const {id} = req.params

    const taskToDelete = tasks.filter(task => task.id == id)
    
    tasks = tasks.filter(tasks => tasks.id != taskToDelete[0].id)

    res.status(200).json({message: "Rota de Delete acessada.", updatedTasksList: tasks})
})


app.get('/prisma/tasks', async (req, res) => {
    try {

        console.log("aqi")

        const prismaTasks = await prisma.task.findMany();
        res.status(200).json({ data: prismaTasks});
    }   catch (err) {
        console.error(err);
        res.status(300).json({message: "Erro ao buscar tarefas no banco"});
    }
});

app.post('/auth/signup')

const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log("Servidor rodando.", port)
})