package ${user}.${maven};

import net.fabricmc.api.ModInitializer;
import net.minecraft.block.Block;
import net.minecraft.block.Material;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.Identifier;
import net.minecraft.util.registry.Registry;

public class Main implements ModInitializer {
	public static final MyBlock MY_BLOCK = new MyBlock(Block.Settings.of(Material.STONE));
	public static final BlockItem MY_BLOCK_ITEM = new BlockItem(MY_BLOCK, new Item.Settings().group(ItemGroup.MISC));

	@Override
	public void onInitialize(){
		Registry.register(Registry.BLOCK, new Identifier("${name}-${user}", "my_block"), MY_BLOCK);
		Registry.register(Registry.ITEM, new Identifier("${name}-${user}", "my_block"), MY_BLOCK_ITEM);

		System.out.println("Loaded ${name}");
	}
}
