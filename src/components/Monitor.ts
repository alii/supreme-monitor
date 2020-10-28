import { useClientContext } from 'discord-jsx';
import { useMonitor } from '../hooks';
import { MessageEmbed, TextChannel } from 'discord.js';
import { base_url } from '../SupremeAPI';

export function Monitor() {
  const { client } = useClientContext();

  useMonitor(async (data) => {
    const { restocks, product } = data;
    const entries = [...restocks.entries()];

    entries.forEach((entry) => {
      const [style, sizes] = entry;
      console.log(`[${product.name} in ${style.name}] restocked sizes ${sizes.join(', ')}`);
      console.log(`[${product.name} in ${style.name}] `);
    });

    const channel = (await client.channels.fetch(process.env.CHANNEL!)) as TextChannel;

    for (const entry of entries) {
      const [style, sizes] = entry;

      const embed = new MessageEmbed()
        .setTitle(`${product.name} restocked in ${style.name}`)
        .setDescription(product.description)
        .setURL(`${base_url}/shop/${product.id}`)
        .addField('New Sizes', sizes.map((s) => s.name).join(', '))
        .addField('Mobile Link', `[${style.name}](${base_url}/mobile#products/${product.id}/${style.id})`, true)
        .addField('Desktop Link', `[${style.name}](${base_url}/shop/${product.id})`, true)
        .setColor('DARK_ORANGE')
        .setFooter("Alistair's Lab Restock Monitor • Supreme")
        .setTimestamp()
        .setImage(`https:${product.image_url}`)
        .setAuthor('Supreme EU', 'https://assets.stickpng.com/images/5a7f5f47abc3d121aba71181.png', 'https://www.supremenewyork.com');

      await channel.send(embed);
    }
  });

  return null;
}
