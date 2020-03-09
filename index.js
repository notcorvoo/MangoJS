// Defining variables
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
    
    // Defining client
    const client = new Discord.Client();
    client.commands = new Discord.Collection();
// End of variables


// Check if ready
client.once('ready', () => {
    console.log("Opened succesfully");
})

// Handling commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// On message event
client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!client.commands.has(commandName)) {
        message.channel.send('I\'m not familiar with that command. Please try again, or refer to '+`${config.prefix}`+'help')
        return;
    }

    const command = client.commands.get(commandName);

    try {
    command.execute(message, args)
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});


// Logging in the bot
client.login(config.token);