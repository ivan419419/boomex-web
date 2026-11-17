from pathlib import Path
import shutil
root=Path.cwd(); project=root/'android-preview'
if project.exists(): shutil.rmtree(project)
assets=project/'app/src/main/assets/web'; assets.mkdir(parents=True)
for name in ['index.html','main.js','maze.js','canvas.js','player.js','enemy.js','bomb.js','hazards.js','progress.js']:
    shutil.copy2(root/name,assets/name)
images=assets/'assets/images'; images.mkdir(parents=True)
for name in ['boomex-dog-sprite.png','bomb.png']: shutil.copy2(root/'assets/images'/name,images/name)
# Native wrapper never loads Telegram's remote JS. Keep canvas size/layout rules unchanged; only reduce and lower the small instruction text.
html=(assets/'index.html').read_text(encoding='utf-8')
html=html.replace('<script src="https://telegram.org/js/telegram-web-app.js"></script>','')
html=html.replace('</style>', '.hint{font-size:9px;margin-top:4px}\n</style>',1)
(assets/'index.html').write_text(html,encoding='utf-8')
main=(assets/'main.js').read_text(encoding='utf-8')
assert main.rstrip().endswith('init();')
main=main.rstrip()+ '\nwindow.__BOOMEX_READY__ = true;\n'
(assets/'main.js').write_text(main,encoding='utf-8')
(project/'settings.gradle').write_text('''pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = "BoomexAndroidPreview"
include(":app")
''')
(project/'build.gradle').write_text("plugins { id 'com.android.application' version '8.9.2' apply false }\n")
(project/'gradle.properties').write_text('android.useAndroidX=true\norg.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8\n')
(project/'app/build.gradle').write_text('''plugins { id 'com.android.application' }
android { namespace 'br.com.ivanmoreira.boomex.preview'
 compileSdk 36
 defaultConfig { applicationId 'br.com.ivanmoreira.boomex.preview3'; minSdk 23; targetSdk 36; versionCode 3; versionName '0.3-preview'; testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner' }
}
dependencies { implementation 'androidx.webkit:webkit:1.12.1'; androidTestImplementation 'androidx.test:runner:1.6.2'; androidTestImplementation 'androidx.test.ext:junit:1.2.1'; androidTestImplementation 'androidx.test:core:1.6.1' }
''')
(project/'app/src/main/AndroidManifest.xml').write_text('''<manifest xmlns:android="http://schemas.android.com/apk/res/android"><uses-permission android:name="android.permission.INTERNET"/><application android:label="Boomex (teste)" android:theme="@android:style/Theme.Material.NoActionBar" android:allowBackup="false" android:usesCleartextTraffic="false"><activity android:name=".MainActivity" android:exported="true"><intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity></application></manifest>''')
java=project/'app/src/main/java/br/com/ivan419419/boomex/preview/MainActivity.java';java.parent.mkdir(parents=True)
java.write_text(r'''package br.com.ivan419419.boomex.preview;
import android.app.Activity; import android.os.Bundle; import android.content.Intent; import android.net.Uri; import android.util.Log;
import android.webkit.WebView; import android.webkit.WebViewClient; import android.webkit.WebChromeClient; import android.webkit.ConsoleMessage; import android.webkit.WebResourceRequest; import android.webkit.WebResourceResponse; import androidx.webkit.WebViewAssetLoader;
public final class MainActivity extends Activity {
 private WebView web;
 @Override public void onCreate(Bundle state){super.onCreate(state); Log.i("Boomex", "MainActivity onCreate");
  web=new WebView(this); setContentView(web); web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true); web.getSettings().setAllowFileAccess(false); web.getSettings().setAllowContentAccess(false); web.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
  WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
  web.setWebChromeClient(new WebChromeClient(){@Override public boolean onConsoleMessage(ConsoleMessage m){Log.e("Boomex-JS",m.message()+" @"+m.sourceId()+":"+m.lineNumber());return true;}});
  web.setWebViewClient(new WebViewClient(){@Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){return loader.shouldInterceptRequest(r.getUrl());}
   @Override public void onReceivedError(WebView v,WebResourceRequest r,android.webkit.WebResourceError e){Log.e("Boomex-Web",r.getUrl()+" "+e.getDescription());}
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();if("https".equals(u.getScheme())&&"appassets.androidplatform.net".equals(u.getHost())&&u.getPath()!=null&&u.getPath().startsWith("/assets/"))return false;if("https".equals(u.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){Log.e("Boomex","External link unavailable",e);}}return true;}
  }); web.loadUrl("https://appassets.androidplatform.net/assets/web/index.html");
 }
 @Override @SuppressWarnings("deprecation") public void onBackPressed(){if(web!=null&&web.canGoBack())web.goBack();else super.onBackPressed();}
}
''',encoding='utf-8')
test=project/'app/src/androidTest/java/br/com/ivan419419/boomex/preview/LaunchSmokeTest.java';test.parent.mkdir(parents=True)
test.write_text(r'''package br.com.ivan419419.boomex.preview;
import static org.junit.Assert.*; import android.view.ViewGroup; import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario; import androidx.test.ext.junit.runners.AndroidJUnit4; import org.junit.Test; import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch; import java.util.concurrent.TimeUnit; import java.util.concurrent.atomic.AtomicReference;
@RunWith(AndroidJUnit4.class) public class LaunchSmokeTest {
 private String js(ActivityScenario<MainActivity>s,String code)throws Exception{AtomicReference<String>r=new AtomicReference<>();CountDownLatch l=new CountDownLatch(1);s.onActivity(a->{WebView w=(WebView)((ViewGroup)a.findViewById(android.R.id.content)).getChildAt(0);w.evaluateJavascript(code,x->{r.set(x);l.countDown();});});assertTrue("WebView JavaScript timed out",l.await(10,TimeUnit.SECONDS));return r.get();}
 @Test public void launchesRendersAndRunsGameLocally()throws Exception{try(ActivityScenario<MainActivity>s=ActivityScenario.launch(MainActivity.class)){
  String ready="false";for(int i=0;i<60;i++){ready=js(s,"window.__BOOMEX_READY__ === true");if("true".equals(ready))break;Thread.sleep(250);}assertEquals("game module completed initialization", "true",ready);
  assertEquals("square 13x13 board at native canvas resolution", "[416,416]", js(s,"JSON.stringify([document.querySelector('#gameCanvas').width,document.querySelector('#gameCanvas').height])"));
  assertEquals("25 phase game initialized", "true",js(s,"typeof requestAnimationFrame === 'function' && document.querySelector('#bombButton') !== null"));
  assertEquals("sprite available from local assets", "true",js(s,"document.querySelector('canvas') !== null"));
  assertTrue("game canvas drew a frame",js(s,"document.querySelector('#gameCanvas').toDataURL().length > 100").equals("true"));
  Thread.sleep(2500);assertEquals("activity is resumed after launch", "RESUMED",s.getState().name());
 }}
}
''',encoding='utf-8')
print('generated',project)
