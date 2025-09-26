const { MessageEmbed } = require("discord.js");
const functions = require("../../../structs/functions.js");
const User = require("../../../model/user.js");
const log = require("../../../structs/log.js");

module.exports = {
    commandInfo: {
        name: "createhostaccount",
        description: "Creates a host account for Reload Backend."
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const serverOwnerId = interaction.guild.ownerId;

        if (interaction.user.id !== serverOwnerId) {
            return interaction.editReply({
                content: "Only the server owner can execute this command.",
                ephemeral: true
            });
        }

        const existingHostAccount = await User.findOne({ email: "hostaccount@reloadbackend.com" });

        if (existingHostAccount) {
            return interaction.editReply({
                content: "A host account has already been created.",
                ephemeral: true
            });
        }

        const username = "reloadbackendhostaccount";
        const email = "hostaccount@reloadbackend.com";
        const password = generateRandomPassword(12);

        try {
            await functions.registerUser(null, username, email, password).then(async (resp) => {
                let embed = new MessageEmbed()
                    .setColor(resp.status >= 400 ? "#ff0000" : "#56ff00")
                    .addFields(
                        { name: "Message", value: resp.message },
                        { name: "Username", value: `\`\`\`${username}\`\`\`` },
                        { name: "Email", value: `\`\`\`${email}\`\`\`` },
                        { name: "Password", value: `\`\`\`${password}\`\`\`` },
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "Under Ground Admin",
                        iconURL: "https://cdn.discordapp.com/attachments/1396695834346651770/1396713285729914941/4053A618-F9C1-4CE0-BFE9-04E462254D6B.png?ex=68a3575c&is=68a205dc&hm=02a1f95281629de546425055a9e690215f2c99dc18a6c11699ec1955c549cdce&"
                    });

                if (resp.status >= 400) {
                    return interaction.editReply({ embeds: [embed], ephemeral: true });
                }

                await interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                });
            });
        } catch (error) {
            log.error(error);
            return interaction.editReply({
                content: "An error occurred while creating the host account.",
                ephemeral: true
            });
        }
    }
};

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}