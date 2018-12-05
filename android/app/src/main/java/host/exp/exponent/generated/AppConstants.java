package host.exp.exponent.generated;

import com.facebook.common.internal.DoNotStrip;

import java.util.ArrayList;
import java.util.List;

import host.exp.exponent.BuildConfig;
import host.exp.exponent.Constants;

@DoNotStrip
public class AppConstants {

  public static final String VERSION_NAME = "2.2.0";
  public static String INITIAL_URL = "exp://exp.host/@tsbb_mapp/tatasky-broadband";
  public static final boolean IS_DETACHED = true;
  public static final String SHELL_APP_SCHEME = "tataskybb";
  public static final String RELEASE_CHANNEL = "default";
  public static boolean SHOW_LOADING_VIEW_IN_SHELL_APP = true;
  public static final List<Constants.EmbeddedResponse> EMBEDDED_RESPONSES;

  static {
    List<Constants.EmbeddedResponse> embeddedResponses = new ArrayList<>();

    
        
        
        
        
        
        
        
        
        
        
        
        
        // ADD EMBEDDED RESPONSES HERE
        // START EMBEDDED RESPONSES
        embeddedResponses.add(new Constants.EmbeddedResponse("https://exp.host/@tsbb_mapp/tatasky-broadband/index.exp", "assets://shell-app-manifest.json", "application/json"));
        embeddedResponses.add(new Constants.EmbeddedResponse("https://d1wp6m56sqw74a.cloudfront.net/%40tsbb_mapp%2Ftatasky-broadband%2F1.0.0%2F087a966b7c3405733fa4113fb2883874-24.0.0-android.js", "assets://shell-app.bundle", "application/javascript"));
        // END EMBEDDED RESPONSES
    EMBEDDED_RESPONSES = embeddedResponses;
  }

  // Called from expoview/Constants
  public static Constants.ExpoViewAppConstants get() {
    Constants.ExpoViewAppConstants constants = new Constants.ExpoViewAppConstants();
    constants.VERSION_NAME = VERSION_NAME;
    constants.INITIAL_URL = INITIAL_URL;
    constants.IS_DETACHED = IS_DETACHED;
    constants.SHELL_APP_SCHEME = SHELL_APP_SCHEME;
    constants.RELEASE_CHANNEL = RELEASE_CHANNEL;
    constants.SHOW_LOADING_VIEW_IN_SHELL_APP = SHOW_LOADING_VIEW_IN_SHELL_APP;
    constants.EMBEDDED_RESPONSES = EMBEDDED_RESPONSES;
    constants.ANDROID_VERSION_CODE = BuildConfig.VERSION_CODE;
    return constants;
  }
}
