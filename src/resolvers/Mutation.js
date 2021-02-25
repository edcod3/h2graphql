const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
	const password = await bcrypt.hash(args.password, 10);

	const user = await context.prisma.user.create({
		data: { ...args, password },
	});

	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	return {
		token,
		user,
	};
}

async function login(parent, args, context, info) {
	// 1
	const user = await context.prisma.user.findUnique({
		where: { email: args.email },
	});
	if (!user) {
		throw new Error("No such user found");
	}

	// 2
	const valid = await bcrypt.compare(args.password, user.password);
	if (!valid) {
		throw new Error("Invalid password");
	}

	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	// 3
	return {
		token,
		user,
	};
}

async function post(parent, args, context) {
	const userId = getUserId(context);

	const newLink = await context.prisma.link.create({
		data: {
			desc: args.desc,
			url: args.url,
			postedBy: { connect: { id: userId } },
		},
	});

	context.pubsub.publish("NEW_LINK", newLink);

	return newLink;
}

async function vote(parent, args, context, info) {
	// 1
	const userId = getUserId(context);

	// 2
	const vote = await context.prisma.vote.findUnique({
		where: {
			linkId_userId: {
				linkId: Number(args.linkId),
				userId: userId,
			},
		},
	});

	if (Boolean(vote)) {
		throw new Error(`Already voted for link: ${args.linkId}`);
	}

	// 3
	const newVote = context.prisma.vote.create({
		data: {
			user: { connect: { id: userId } },
			link: { connect: { id: Number(args.linkId) } },
		},
	});
	context.pubsub.publish("NEW_VOTE", newVote);

	return newVote;
}

async function updateLink(parent, args, context) {
	const upd_user = await context.prisma.link.update({
		where: {
			id: Number(args.id),
		},
		data: {
			desc: args.desc,
			url: args.url,
		},
	});
	return upd_user;
}

async function deleteLink(parent, args, context) {
	const del_user = await context.prisma.link.delete({
		where: {
			id: Number(args.id),
		},
	});
	return del_user;
}

module.exports = {
	signup,
	login,
	post,
	vote,
	updateLink,
	deleteLink,
};
