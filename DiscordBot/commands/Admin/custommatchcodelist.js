const MMCodes = require("../../../model/mmcodes.js");
const { MessageEmbed } = require("discord.js");
const log = require("../../../structs/log.js");
const config = require('../../../Config/config.json')

module.exports = {
    commandInfo: {
        name: "custom-match-code-list",
        description: "Lists all custom matchmaking codes.",
    },
    execute: async (interaction) => {
        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.reply({ content: "You do not have moderator permissions.", ephemeral: true });
        }

        try {
            const codes = await MMCodes.find({});

            if (codes.length === 0) {
                return interaction.reply({ content: "No custom matchmaking codes found.", ephemeral: true });
            }

            const embed = new MessageEmbed()
                .setTitle("Custom Matchmaking Codes")
                .setDescription("Here is the list of all custom matchmaking codes:")
                .setColor("GREEN")
                .setTimestamp()
                .setThumbnail("https://i.imgur.com/2RImwlb.png")
                .setFooter({
                    text: "Under Ground Admin",
                    iconURL: "https://cdn.discordapp.com/attachments/1396695834346651770/1396713285729914941/4053A618-F9C1-4CE0-BFE9-04E462254D6B.png?ex=68a3575c&is=68a205dc&hm=02a1f95281629de546425055a9e690215f2c99dc18a6c11699ec1955c549cdce&"
                });

            codes.forEach(code => {
                embed.addFields([
                    { name: "Code", value: code.code, inline: true },
                    { name: "IP", value: code.ip, inline: true },
                    { name: "Port", value: code.port.toString(), inline: true }
                ]);
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            log.error(error);
            return interaction.reply({ content: "An error occurred while fetching the codes.", ephemeral: true });
        }
    }
};