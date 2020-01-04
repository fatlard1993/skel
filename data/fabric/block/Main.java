package ${user}.${maven};

import net.fabricmc.api.ModInitializer;
import net.minecraft.block.Block;
import net.minecraft.block.Material;
import net.minecraft.util.Identifier;
import net.minecraft.util.registry.Registry;

public class Main implements ModInitializer {
	public static final MyBlock MY_BLOCK = new MyBlock(Block.Settings.of(Material.STONE));

	@Override
	public void onInitialize(){
		Registry.register(Registry.BLOCK, new Identifier("${name}-${user}", "my_block"), MY_BLOCK);

		System.out.println("Loaded ${name}");
	}
}
