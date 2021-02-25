const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

//Dummy Data
// let links = [
// 	{
// 		id: "link-0",
// 		url: "https://github.com/edcod3",
// 		desc: "Check out my github page!",
// 	},
// ];
//IdCount = length of dummy data
// let idCount = links.length;

//Schema Implementation
const resolvers = {
	Query,
	Mutation,
	Subscription,
	Vote,
	User,
	Link,
};
//PubSub (Apollo)
const pubsub = new PubSub();

//Prisma Client
const prisma = new PrismaClient();

//Apollo Server (QraphQL)
const server = new ApolloServer({
	typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
	resolvers,
	context: ({ req }) => {
		return {
			...req,
			prisma,
			pubsub,
			userId: req && req.headers.authorization ? getUserId(req) : null,
		};
	},
});

server
	.listen()
	.then(({ url }) => console.log(`GraphQL Server is running on ${url}`));
