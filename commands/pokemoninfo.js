const { SlashCommandBuilder } = require('discord.js')

const { fetchUrl } = require('../libs/fetchUrl')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pokemoninfo')
    .setDescription('Replies with a pokemon description!')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('The pokemon name')
        .setRequired(true)),
  async execute (interaction) {
    const pokemon = interaction.options.getString('name')
    const { data: fetchedData, error } = await fetchUrl(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      return interaction.reply("Le pokemon n'existe pas.")
    }
    function formatStats (stats) {
      let formatedStats = ''
      stats.map(item => (formatedStats = formatedStats.concat(`**${item.stat.name.toUpperCase()}** ${item.base_stat}\n`)))
      return formatedStats
    }

    function formatType (types) {
      let formatedTypes = ''
      types.map(type => (formatedTypes = formatedTypes.concat(`${type.type.name[0].toUpperCase() + type.type.name.substring(1)}\n\n`)))
      return formatedTypes
    }

    async function formatInformations (informations) {
      const { height, weight, abilities, species} = informations
      const { data: response} = await fetchUrl(species.url)
      const description = response.flavor_text_entries[0].flavor_text

      const formatedInformations = `
        **Weight:** ${weight / 10}kg\n
        **Height:** ${height / 10}m\n
        **Abilities:**${abilities.map(ability => ` ${ability.ability.name}`)}\n
        **Description:** ${description}
        `
      return formatedInformations
    }

    const pokemonEmbed = {
      color: 0x0099ff,
      title: fetchedData.name,
      url: `https://pokeapi.co/api/v2/pokemon/${fetchedData.name}`,
      fields: [
        {
          name: 'Stats',
          value: formatStats(fetchedData.stats),
          inline: true
        },
        {
          name: 'Types',
          value: formatType(fetchedData.types),
          inline: true
        },
        {
          name: 'Informations',
          value: await formatInformations(fetchedData),
          inline: true
        }
      ],
      image: {
        url: fetchedData.sprites.other['official-artwork'].front_default
      },
      timestamp: new Date().toISOString()
    }

    return interaction.reply({ embeds: [pokemonEmbed]})
  }
}
