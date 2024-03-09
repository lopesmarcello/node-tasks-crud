import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    // Cria nova Task
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        title,
        description,
        id: randomUUID(),
        created_at: new Date(),
        updated_at: null,
        completed_at: null
      }

      database.insert("tasks", task)

      return res.writeHead(204).end()

    }
  },
  {
    // Lista Tasks
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (_, res) => {
      const data = database.select("tasks")
      return res.writeHead(200).end(JSON.stringify(data))
    }
  },
  {
    // Atualiza Task pelo id
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const updatedTask = {
        title,
        description,
        updated_at: new Date()
      }

      database.update('tasks', id, updatedTask)

      return res.writeHead(204).end()
    }
  },
  {
    // Exclui Task pelo id
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      database.delete("tasks", id)
      return res.writeHead(204).end()
    }
  },
  {
    // Marca Task pelo id como completa
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      database.update('tasks', id, { completed_at: new Date() })

      return res.writeHead(204).end()
    }
  },
]
