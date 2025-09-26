const { MessageEmbed } = require("discord.js");
const Users = require("../../../model/user.js");

module.exports = {
    commandInfo: {
        name: "lookup",
        description: "Search for a Discord user\'s ID by providing their in-game username.",
        options: [
            {
                name: "user",
                description: "Target username.",
                required: true,
                type: 3
            }
        ]
    },
    execute: async (interaction) => {

    await interaction.deferReply({ ephemeral: true });

    const { options } = interaction;

    const user = await Users.findOne({ username_lower: (options.get("user").value).toLowerCase() }).lean();
    if (!user) return interaction.editReply({ content: "The account username you entered does not exist.", ephemeral: true });

    let onlineStatus = global.Clients.some(i => i.accountId == user.accountId);

    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`**User Information:**\n- **Discord User:** <@${user.discordId}>\n- **DiscordID:** ${user.discordId}\n- **In-Game Username:** ${user.username}\n- **Banned:** ${user.banned ? "Yes" : "No"}\n- **Online:** ${onlineStatus ? "Yes" : "No"}`)
        .setFooter({
            text: "Under Ground",
            iconURL: "https://cdn.discordapp.com/attachments/1396695834346651770/1396713285729914941/4053A618-F9C1-4CE0-BFE9-04E462254D6B.png?ex=68a3575c&is=68a205dc&hm=02a1f95281629de546425055a9e690215f2c99dc18a6c11699ec1955c549cdce&"
        })

    interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}