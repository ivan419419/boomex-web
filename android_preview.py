from pathlib import Path
import shutil
root=Path.cwd()
project=root/'android-preview'
if project.exists(): shutil.rmtree(project)
assets=project/'app/src/main/assets/web'
assets.mkdir(parents=True)
# Include only assets referenced by this game; the unrelated third-party-looking Mario sprite is excluded.
for name in ['index.html','main.js','maze.js','canvas.js','player.js','enemy.js','bomb.js','hazards.js','progress.js']:
    shutil.copy2(root/name,assets/name)
images=assets/'assets/images'; images.mkdir(parents=True)
for name in ['boomex-dog-sprite.png','bomb.png']:
    shutil.copy2(root/'assets/images'/name,images/name)
html=(assets/'index.html').read_text(encoding='utf-8')
html=html.replace('<script src="https://telegram.org/js/telegram-web-app.js"></script>','')
html=html.replace('</style>', '.hint{font-size:9px;margin-top:4px}\n</style>', 1)
html=html.replace('href="https://www.tiktok.com/@achadosanosdourados?_r=1&amp;_t=ZS-9BSGQP0YF1t" target="_blank" rel="noopener noreferrer"', 'href="https://www.tiktok.com/@achadosanosdourados?_r=1&amp;_t=ZS-9BSGQP0YF1t" target="_blank" rel="noopener noreferrer"')
(assets/'index.html').write_text(html,encoding='utf-8')
(project/'settings.gradle').write_text('''pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }\ndependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }\nrootProject.name = "BoomexAndroidPreview"\ninclude(":app")\n''')
(project/'build.gradle').write_text("plugins { id 'com.android.application' version '8.9.2' apply false }\n")
(project/'gradle.properties').write_text('android.useAndroidX=true\norg.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8\n')
(project/'app/build.gradle').write_text('''plugins { id 'com.android.application' }\nandroid { namespace 'br.com.ivanmoreira.boomex.preview'\n compileSdk 36\n defaultConfig { applicationId 'br.com.ivanmoreira.boomex.preview2'; minSdk 23; targetSdk 36; versionCode 2; versionName '0.2-preview' }\n}\ndependencies { implementation 'androidx.webkit:webkit:1.12.1' }\n''')
manifest='''<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application android:label="Boomex (teste)" android:theme="@android:style/Theme.Material.NoActionBar" android:allowBackup="false" android:usesCleartextTraffic="false"><activity android:name=".MainActivity" android:exported="true"><intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity></application></manifest>'''
(project/'app/src/main/AndroidManifest.xml').write_text(manifest)
java=project/'app/src/main/java/br/com/ivan419419/boomex/preview/MainActivity.java';java.parent.mkdir(parents=True)
java.write_text(r'''package br.com.ivan419419.boomex.preview;
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import androidx.webkit.WebViewAssetLoader;
public final class MainActivity extends Activity {
 private WebView web;
 @Override public void onCreate(Bundle state){super.onCreate(state);web=new WebView(this);setContentView(web);
  web.getSettings().setJavaScriptEnabled(true);web.getSettings().setDomStorageEnabled(true);
  web.getSettings().setAllowFileAccess(false);web.getSettings().setAllowContentAccess(false);web.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
  WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){return loader.shouldInterceptRequest(r.getUrl());}
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();
    if("https".equals(u.getScheme())&&"appassets.androidplatform.net".equals(u.getHost())&&u.getPath()!=null&&u.getPath().startsWith("/assets/"))return false;
    if("https".equals(u.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception ignored){}}return true;
   }
  });web.loadUrl("https://appassets.androidplatform.net/assets/web/index.html");
 }
 @Override @SuppressWarnings("deprecation") public void onBackPressed(){if(web.canGoBack())web.goBack();else super.onBackPressed();}
}
''',encoding='utf-8')
print('Generated Android preview project:',project)
