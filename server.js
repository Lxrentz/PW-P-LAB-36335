import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import {configDotenv} from 'dotenv'


let movies = [
  {id: 1, title: "Inception", year: 2010},
  {id: 2, title: "Interstellar", year: 2014}
];

configDotenv()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

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


const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log("Servidor rodando.", port)
})