// Defining variables
    const fs = require('fs');
    const Discord = require('discord.js');
    const config = require('./config.json');
    const client = new Discord.Client();
    client.commands = new Discord.Collection();
    const cooldowns = new Discord.Collection();

        // Collections

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

    // Constants
	const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if it starts with prefix, and if the author isn't a bot
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    // If the command isn't existing

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        return message.channel.send('I\'m not familiar with that command. Please try again, or refer to '+`${config.prefix}`+'help')
    }
    
    // Set cooldowns
    if (!cooldowns.has(commandName)) {
        cooldowns.set(commandName, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
        }

    } else {
        
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    

    // Arg check, and usage command.
    if(command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if(command.usage){
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\`\nFor more, use the command \`${config.prefix}help\``;
        }

        return message.channel.send(reply);
    }

    // DM Check
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I cannot execute commands in DM. Please check me out at a server!');
    }

    const user = {
        "regular": message.member.roles.cache.some(role => role.name == "Member"),
        "moderator": message.member.roles.cache.some(role => role.name == "Moderator"),
        "admin": message.member.roles.cache.some(role => role.name == "Admin")
    };

    // Try to execute command, if theres an error catch it and display the error in console.
    try {
        command.execute(message, args, user)
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});


// Logging in the bot
client.login(config.token);