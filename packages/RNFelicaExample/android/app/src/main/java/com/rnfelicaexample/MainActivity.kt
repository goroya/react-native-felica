package com.rnfelicaexample

import android.app.PendingIntent
import android.content.Intent
import android.content.IntentFilter
import android.nfc.NfcAdapter
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
  companion object {
    @JvmField val TAG:String = MainActivity::class.java.simpleName
  }
  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  override fun getMainComponentName(): String? {
    return "RNFelicaExample"
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    Log.d(TAG, "onCreate()")
    super.onCreate(savedInstanceState)
  }

  override fun onPause() {
    Log.d(TAG, "onPause()")
    super.onPause()
  }

  override fun onResume() {
    Log.d(TAG, "onResume()")
    /*
    val nfcAdapter = NfcAdapter.getDefaultAdapter(this)
    val intent = Intent(applicationContext, javaClass)
    intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)

    val nfcPendingIntent = PendingIntent.getActivity(applicationContext, 0, intent, 0)

    val intentFilter = arrayOf(IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED))

    val techList = arrayOf(arrayOf(android.nfc.tech.NfcF::class.java.name))

    nfcAdapter.enableForegroundDispatch(this, nfcPendingIntent, intentFilter, techList)
    //nfcAdapter.enableForegroundDispatch(this, nfcPendingIntent, null, null)
    */
    super.onResume()
  }

  override fun onNewIntent(intent: Intent?) {
    Log.d(TAG, "onNewIntent()")
    super.onNewIntent(intent)
  }

  override fun onDestroy() {
    Log.d(TAG, "onDestroy()")
    super.onDestroy()
  }
}
