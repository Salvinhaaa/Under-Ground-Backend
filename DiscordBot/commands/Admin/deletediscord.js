const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const Users = require('../../../model/user.js');
const Profiles = require('../../../model/profiles.js');
const SACCodes = require('../../../model/saccodes.js');
const Friends = require('../../../model/friends.js');
const log = require("../../../structs/log.js");
const config = require('../../../Config/config.json');

module.exports = {
    commandInfo: {
        name: "deletediscord",
        description: "Deletes a user's account",
        options: [
            {
                name: "username",
                description: "Target username.",
                required: true,
                type: 6
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
        }

        const discordId = interaction.options.getUser('username').id;
        const user = interaction.options.getUser('username');
        const deleteAccount = await Users.findOne({ discordId: discordId });

        if (!deleteAccount) {
            await interaction.editReply({ content: "The selected user does not have **an account**", ephemeral: true });
            return;
        }

        const accountId = deleteAccount.accountId;
        let somethingDeleted = false;

        await Users.deleteOne({ discordId: discordId }).then(() => {
            somethingDeleted = true;
        }).catch(error => {
            log.error('Error deleting from Users:', error);
        });

        await Profiles.deleteOne({ accountId: accountId }).then(() => {
            somethingDeleted = true;
        }).catch(error => {
            log.error('Error deleting from Profiles:', error);
        });

        await Friends.deleteOne({ accountId: accountId }).then(() => {
            somethingDeleted = true;
        }).catch(error => {
            log.error('Error deleting from Friends:', error);
        });

        await SACCodes.deleteOne({ owneraccountId: accountId }).then(() => {
            somethingDeleted = true;
        }).catch(error => {
            log.error('Error deleting from SACCodes:', error);
        });

        const clientSettingsPath = path.join(__dirname, '../../../ClientSettings', accountId);
        if (fs.existsSync(clientSettingsPath)) {
            fs.rmSync(clientSettingsPath, { recursive: true, force: true });
            somethingDeleted = true;
        }

        if (!somethingDeleted) {
            await interaction.editReply({ content: `No data found to delete for **${deleteAccount.username}**.`, ephemeral: true });
            return;
        }

        const embed = new MessageEmbed()
            .setTitle("Account deleted")
            .setDescription("The account has been **deleted**")
            .setColor("GREEN")
            .setFooter({
                text: "Under Ground Admin",
                iconURL: "https://cdn.discordapp.com/attachments/1396695834346651770/1396713285729914941/4053A618-F9C1-4CE0-BFE9-04E462254D6B.png?ex=68a3575c&is=68a205dc&hm=02a1f95281629de546425055a9e690215f2c99dc18a6c11699ec1955c549cdce&"
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], ephemeral: true });

        try {
            await user.send({ content: `Your account has been deleted by <@${interaction.user.id}>` });
        } catch (error) {
            log.error('Could not send DM:', error);
        }
    }
};