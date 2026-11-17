package com.getcapacitor.myapp;

import static org.junit.Assert.*;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.rule.ActivityTestRule;
import com.ivan419419.boomex.MainActivity;
import org.json.JSONTokener;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {
    @Rule public ActivityTestRule<MainActivity> activityRule = new ActivityTestRule<>(MainActivity.class);
    private Object js(String script) throws Exception {
        AtomicReference<String> result = new AtomicReference<>();
        CountDownLatch latch = new CountDownLatch(1);
        activityRule.getActivity().runOnUiThread(() -> activityRule.getActivity().getBridge().getWebView().evaluateJavascript(script, value -> { result.set(value); latch.countDown(); }));
        assertTrue("WebView callback timeout", latch.await(10, TimeUnit.SECONDS));
        return new JSONTokener(result.get()).nextValue();
    }
    private void waitForPage() throws Exception {
        for (int i=0;i<60;i++) {
            if (Boolean.TRUE.equals(js("document.readyState==='complete' && !!document.querySelector('#gameCanvas')"))) return;
            Thread.sleep(500);
        }
        fail("BOOMEX page did not become ready");
    }
    private void waitForCondition(String script) throws Exception {
        for (int i=0;i<40;i++) {
            if (Boolean.TRUE.equals(js(script))) return;
            Thread.sleep(500);
        }
        fail("Timed out waiting for: " + script);
    }
    @Test public void canvasDimensionIs416() throws Exception {
        waitForPage();
        assertEquals(Boolean.TRUE,js("(()=>{const c=document.querySelector('#gameCanvas');return !!(c&&c.width===416&&c.height===416)})()"));
    }
    @Test public void bombControlExists() throws Exception {
        waitForPage();
        assertEquals(Boolean.TRUE,js("!!document.querySelector('#bombButton')"));
    }
    @Test public void canvasHasDrawn() throws Exception {
        waitForPage();
        waitForCondition("document.querySelector('#gameCanvas').toDataURL().length>100");
    }
    @Test public void selectedV03AssetsLoaded() throws Exception {
        waitForPage();
        waitForCondition("(()=>{const r=performance.getEntriesByType('resource');return r.some(x=>x.name.includes('boomex-dog-sprite.png'))&&r.some(x=>x.name.includes('bomb.png'))})()");
    }
}
