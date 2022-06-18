const { Permissions, MessageEmbed } = require("discord.js");
const axios = require("axios")

const animalApis = {
    // Cat apis for image + fact
    cat: {
        image: "https://api.thecatapi.com/v1/images/search",
        fact: "https://some-random-api.ml/facts/cat"
    },
    // Capybara api
    capybara: {
        image: "https://api.capybara-api.xyz/v1/image/random",
        fact: "https://api.capybara-api.xyz/v1/facts/random"
    },
    // Dog api, provides both fact and image
    dog: {
        image: "https://some-random-api.ml/animal/dog"
    },
    // Fox api, provides both fact and image
    fox: {
        image: "https://some-random-api.ml/animal/fox"
    },
    // Red panda api, provides both fact and image
    firefox: {
        image: "https://some-random-api.ml/animal/red_panda"
    }
}

module.exports = {
    description: "Get a random animal",
    usage: "(animal)",
    permission: null,
    guild: false,
    run: async (bot, message, args) => {
        switch (args[0]) {
            // Send cat payload
            case "cat": {
                const image = await axios.get(animalApis.cat.image).then(res => res.data[0].url);
                const fact = await axios.get(animalApis.cat.fact).then(res => res.data.fact);
                const title = "Cat payload :D"

                animalEmbed(bot, message, {
                    image: image,
                    fact: fact,
                    title: title
                });
                break;
            }
            // Send capybawa payload
            case "capybara": {
                const image = await axios.get(animalApis.capybara.image).then(res => res.data.image_urls.original);
                const fact = await axios.get(animalApis.capybara.fact).then(res => res.data.fact);
                const title = "Capybawa payload <33";

                animalEmbed(bot, message, {
                    image: image,
                    fact: fact,
                    title: title
                });
                break;
            }
            // Send dog payload
            case "dog": {
               const { image, fact } = await axios.get(animalApis.dog.image).then(res => res.data);
               const title = "Woof woof!";

               animalEmbed(bot, message, {
                   image: image,
                   fact: fact,
                   title: title
               });
               break;
            }
            // Send fox payload
            case "fox": {
               const { image, fact } = await axios.get(animalApis.fox.image).then(res => res.data);
               const title = "Fox fox fox :D";

               animalEmbed(bot, message, {
                   image: image,
                   fact: fact,
                   title: title
               });
               break;
            }
            // Send red panda payload
            case "firefox": {
               const { image, fact } = await axios.get(animalApis.firefox.image).then(res => res.data);
               const title = "RED PAAAANDA <333333";

               animalEmbed(bot, message, {
                   image: image,
                   fact: fact,
                   title: title
               });
               break;
            }
            // Send available animals if no animal is specified
            default: {
                const embed = new MessageEmbed()
                .setTitle("Available animals!")
                .setDescription(`
                    capybara, cat, dog, firefox, fox,
                    `)
                .setTimestamp();
                
                bot.utils.replyEmbed(bot, message, [embed]);
                break;
            }
        }
    }
}

async function animalEmbed(bot, message, animalInfo) {
        const embed = new MessageEmbed()
        .setTitle(animalInfo.title)
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
        })
        .setImage(animalInfo.image)
        .setURL(animalInfo.image)
        .setColor(0xff6961)

        animalInfo.fact ? embed.setFooter({ text: animalInfo.fact }) : embed.setTimestamp();
	// Reply to the author with the embed
	bot.utils.replyEmbed(bot, message, [embed]);
}
