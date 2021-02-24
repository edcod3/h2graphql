const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

//Dummy Data
let links = [{
    id: "link-0",
    url: "https://github.com/edcod3",
    desc: "Check out my github page!",
}]
//IdCount = length of dummy data
let idCount = links.length

//Schema Implementation
const resolvers = {
    Query: {
        //Resolver functions
        msg: () => 'This is my first GraphQL',
        info: () => 'This is the API of a Hackernews Clone',
        feed: async (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        link: async (parent, args, context) => {
            return context.prisma.link.findUnique({
                where: {
                    id: Number(args.id)
                }
            })
        } 
    },
    Mutation:  {
        post: (parent, args, context) => {
            const newLink = context.prisma.link.create({
                data : {
                    desc: args.desc,
                    url: args.url
                }
            })
            return newLink
        },
        updateLink: async (parent, args, context) => {
            const upd_user = await context.prisma.link.update({
                where : {
                    id: Number(args.id)
                },
                data: {
                    desc: args.desc,
                    url: args.url
                }
            })
            return upd_user
        },
        deleteLink: async (parent, args, context) => {
            const del_user = await context.prisma.link.delete({
                where : {
                    id: Number(args.id)
                }
            })
            return del_user
        }
    }
}
//Prisma Client
const prisma = new PrismaClient();

//Apollo Server (QraphQL)
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, "schema.graphql"),
        "utf8"
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) => console.log(`GraphQL Server is running on ${url}`));