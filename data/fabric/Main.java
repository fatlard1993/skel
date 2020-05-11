package ${user}.${_name};

import net.fabricmc.api.ModInitializer;

public class Main implements ModInitializer {
	public static final String MOD_ID = "${id}";

	@Override
	public void onInitialize() {
		System.out.println("Loaded ${name}");
	}
}
