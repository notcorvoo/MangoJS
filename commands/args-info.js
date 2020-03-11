module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	aliases: ['ainfo'],
	guildOnly: true,
	args: true,
	cooldown: 3,
    usage: '<args-info> <arguments,...>',
	execute(message, args) {

        if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};