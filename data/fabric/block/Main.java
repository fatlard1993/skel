package ${user}.${_name};

import net.fabricmc.api.ModInitializer;
import net.minecraft.block.Block;
import net.minecraft.block.Material;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.util.Identifier;
import net.minecraft.util.registry.Registry;

public class Main implements ModInitializer {
	public static final String MOD_ID = "${id}";

	public static final ${block} ${_NAME} = new ${block}(Block.Settings.of(Material.STONE));

	private static void register(String name, Block block){
		Registry.register(Registry.ITEM, new Identifier(MOD_ID, name), new BlockItem(block, new Item.Settings().group(ItemGroup.MISC)));

		Registry.register(Registry.BLOCK, new Identifier(MOD_ID, name), block);
	}

	@Override
	public void onInitialize(){
		register("${_name}", ${_NAME});

		System.out.println("Loaded ${name}");
	}
}
