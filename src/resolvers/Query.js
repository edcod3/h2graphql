const msg = () => {
	return "This is my first GraphQL";
};
const info = () => {
	return "This is the API of a Hackernews Clone";
};

async function feed(parent, args, context, info) {
	const where = args.filter
		? {
				OR: [
					{ desc: { contains: args.filter } },
					{ url: { contains: args.filter } },
				],
		  }
		: {};

	const links = await context.prisma.link.findMany({
		where,
		skip: args.skip,
		take: args.take,
		orderBy: args.orderBy,
	});

	const count = await context.prisma.link.count({ where });

	return { links, count };
}

function link(parent, args, context) {
	return context.prisma.link.findUnique({
		where: {
			id: Number(args.id),
		},
	});
}

module.exports = {
	msg,
	info,
	feed,
	link,
};
