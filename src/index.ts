import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import fs from 'fs'
import path from 'path'

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise((resolve) =>
    app.listen(process.env.PORT ?? 4000, resolve as any)
  )

  console.log('started')
}
console.log(__dirname)

const typeDefs = gql`
  ${fs.readFileSync(path.resolve(__dirname, 'book.graphql'))}
`

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
}

startApolloServer(typeDefs, resolvers)
