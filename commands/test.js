module.exports = {
	name: 'test',
	description: 'testcommand',
	execute(message, args) {
		message.channel.send('Ja ik leef!');
	},
};