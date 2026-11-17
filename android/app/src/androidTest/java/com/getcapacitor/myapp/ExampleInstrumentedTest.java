package com.getcapacitor.myapp;

import static org.junit.Assert.*;
import android.webkit.WebView;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.rule.ActivityTestRule;
import com.ivan419419.boomex.MainActivity;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {
    @Rule public ActivityTestRule<MainActivity> activityRule = new ActivityTestRule<>(MainActivity.class);
    private String js(String script) throws Exception {
        AtomicReference<String> result=new AtomicReference<>(); CountDownLatch latch=new CountDownLatch(1);
        activityRule.getActivity().runOnUiThread(() -> activityRule.getActivity().getBridge().getWebView().evaluateJavascript(script,v->{result.set(v);latch.countDown();}));
        assertTrue("WebView callback timeout",latch.await(10,TimeUnit.SECONDS)); return result.get();
    }
    @Test public void gameInitializesAndDrawsAtOriginalCanvasSize() throws Exception {
        assertEquals("[416,416]",js("JSON.stringify([document.querySelector('#gameCanvas').width,document.querySelector('#gameCanvas').height])"));
        assertEquals("true",js("document.querySelector('#bombButton') !== null"));
        assertEquals("true",js("document.querySelector('#gameCanvas').toDataURL().length > 100"));
        String assets="false";
        for(int i=0;i<60;i++){assets=js("performance.getEntriesByType('resource').some(r=>r.name.endsWith('boomex-dog-sprite.png')) && performance.getEntriesByType('resource').some(r=>r.name.endsWith('bomb.png'))");if("true".equals(assets))break;Thread.sleep(250);}
        assertEquals("v0.3 dog and bomb image assets loaded", "true",assets);
    }
}
