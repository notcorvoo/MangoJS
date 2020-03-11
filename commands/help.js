const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'Information about all my commands.',
	aliases: ['h'],
    usage: '<help> (command)',
    cooldown: 3,
	execute(message, args, user) {
        const data = [];
        const { commands } = message.client;

        if(!args.length) {

            if(user["regular"]) {
                data.push('Here\'s a list of all my commands:\`');
                data.push(commands.map(command => command.name).join('\n'));
                data.push(`\`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            } else if (user["admin"]) {
                data.push('Here\'s a list of all my administrative commands:\`');
                data.push(commands.map(command => command.name).join('\n'));
                data.push(`\`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            } else if (user["moderator"]) {
                data.push('Here\'s a list of all my moderator commands:\`');
                data.push(commands.map(command => command.name).join('\n'));
                data.push(`\`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            }

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
                    }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('I can\'t recognize that command, please enter a valid command.');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
	},
};