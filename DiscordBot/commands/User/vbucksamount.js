const { MessageEmbed } = require("discord.js");
const Profiles = require('../../../model/profiles.js');
const Users = require('../../../model/user.js');

module.exports = {
    commandInfo: {
        name: "vbucksamount",
        description: "Displays your current V-Bucks balance.",
    },
    execute: async (interaction) => {

    await interaction.deferReply({ ephemeral: true })

    const currentuser = await Users.findOne({ discordId: interaction.user.id });
    const vbucksamount = await Profiles.findOne({ accountId: currentuser?.accountId });
    const currency = vbucksamount?.profiles.common_core.items["Currency:MtxPurchased"].quantity;
    if (!currentuser) 
    {
        return interaction.editReply({ content: "You are not registered!", ephemeral: true });
    }
    const embed = new MessageEmbed()
        .setTitle("V-Bucks Count:")
        .setDescription(`You currently have **` + currency + " V-Bucks** in your Account!")
        .setTimestamp()
        .setThumbnail('https://i.imgur.com/FnOft4i.png')
        .setFooter({
            text: "Under Ground",
            iconURL: "https://cdn.discordapp.com/attachments/1396695834346651770/1396713285729914941/4053A618-F9C1-4CE0-BFE9-04E462254D6B.png?ex=68a3575c&is=68a205dc&hm=02a1f95281629de546425055a9e690215f2c99dc18a6c11699ec1955c549cdce&"
        })
        .setColor("WHITE")
    await interaction.editReply({ embeds: [embed], ephemeral: true });
}
}