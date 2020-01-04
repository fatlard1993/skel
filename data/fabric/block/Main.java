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
	public static final ${block} ${_name} = new ${block}(Block.Settings.of(Material.STONE));
	public static final BlockItem ${_name}_item = new BlockItem(${_name}, new Item.Settings().group(ItemGroup.MISC));

	@Override
	public void onInitialize(){
		Registry.register(Registry.BLOCK, new Identifier("${id}", "${name}"), ${_name});
		Registry.register(Registry.ITEM, new Identifier("${id}", "${name}"), ${_name}_item);

		System.out.println("Loaded ${name}");
	}
}
