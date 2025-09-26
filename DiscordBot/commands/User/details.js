const { MessageEmbed } = require("discord.js");
const User = require("../../../model/user.js");
const Profiles = require('../../../model/profiles.js');

module.exports = {
    commandInfo: {
        name: "details",
        description: "Retrieves your account info."
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ discordId: interaction.user.id }).lean();
        const vbucksamount = await Profiles.findOne({ accountId: user?.accountId });
        const currency = vbucksamount?.profiles.common_core.items["Currency:MtxPurchased"].quantity;
        if (!user) return interaction.editReply({ content: "You do not have a registered account!", ephemeral: true });

        let onlineStatus = global.Clients.some(i => i.accountId == user.accountId);

        let embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("These are your account details")
        .setFields(
            { name: 'Username:', value: user.username },
            { name: 'Email:', value: `${user.email}` },
            { name: "Online:", value: `${onlineStatus ? "Yes" : "No"}` },
            { name: "Banned:", value: `${user.banned ? "Yes" : "No"}` },
            { name: 'V-Bucks:', value: `${currency} V-Bucks` },
            { name: "Account ID:", value: user.accountId })
        .setTimestamp()
        .setThumbnail(interaction.user.avatarURL())
        .setFooter({
            text: "Under Ground",
            iconURL: "https://cdn.discordapp.com/attachments/1396695834346651770/1396713285729914941/4053A618-F9C1-4CE0-BFE9-04E462254D6B.png?ex=68a3575c&is=68a205dc&hm=02a1f95281629de546425055a9e690215f2c99dc18a6c11699ec1955c549cdce&"
        })

        interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}