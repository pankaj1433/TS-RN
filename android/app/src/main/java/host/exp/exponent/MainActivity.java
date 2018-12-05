package host.exp.exponent;

import android.os.Bundle;

import com.facebook.react.ReactPackage;
import org.devio.rn.splashscreen.SplashScreen;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import host.exp.exponent.generated.DetachBuildConstants;
import host.exp.exponent.experience.DetachActivity;

import com.google.firebase.analytics.FirebaseAnalytics;

public class MainActivity extends DetachActivity {

    private FirebaseAnalytics mFirebaseAnalytics;

    @Override
    public String publishedUrl() {
        if (!BuildConfig.RELEASE_CHANNEL.isEmpty()) {
            return "exp://exp.host/@tsbb_mapp/tatasky-broadband?release-channel=" + BuildConfig.RELEASE_CHANNEL;
        }
        return "exp://exp.host/@tsbb_mapp/tatasky-broadband";
    }

    @Override
    public String developmentUrl() {
        return DetachBuildConstants.DEVELOPMENT_URL;
    }

    @Override
    public List<String> sdkVersions() {
        return new ArrayList<>(Arrays.asList("24.0.0"));
    }

    @Override
    public List<ReactPackage> reactPackages() {
        return ((MainApplication) getApplication()).getPackages();
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    @Override
    public Bundle initialProps(Bundle expBundle) {
        // Add extra initialProps here
        return expBundle;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
        // Obtain the FirebaseAnalytics instance.
        mFirebaseAnalytics = FirebaseAnalytics.getInstance(this);
    }

    @Override
    protected void onStart() {
        super.onStart();
    }
}
